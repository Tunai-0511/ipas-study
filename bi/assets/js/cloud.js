/* ============================================================
   cloud.js — Supabase 信箱登入＋雲端同步
   同一份檔案供 junior / intermediate / bi 使用（依路徑自動判斷 app id）。
   資料表：user_state(user_id, app, data jsonb, updated_at)，RLS 限本人。
   同步策略：登入/開機 pull→Store.importAll(merge)→push；
   之後 Store.persist 觸發 debounce push；分頁隱藏時強制 push。
   ============================================================ */
(function (global) {
  "use strict";
  var SB_URL = "https://mugrltimxkvlqyksymjq.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3JsdGlteGt2bHF5a3N5bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTY0MDgsImV4cCI6MjA5OTIzMjQwOH0.OfJpNubw7WNF4ca56LZT_oWawiJlZm10Fm1l7rbRI8s";
  var APP_ID = location.pathname.indexOf("/bi/") >= 0 ? "bi" :
    (location.pathname.indexOf("/intermediate/") >= 0 ? "intermediate" : "junior");
  var sb = null, pushTimer = null, syncPromise = null, lastEmail = "";

  function el(id) { return document.getElementById(id); }
  function setStatus(kind, msg) {
    var box = el("cloudStatus"); if (!box) return;
    box.className = "ai-status " + (kind || "");
    box.textContent = msg || "";
  }
  function friendlyErr(e) {
    var m = (e && e.message) || "", s = (e && e.status) || 0;
    if (s === 429 || /rate|too many|limit/i.test(m)) return "寄送太頻繁：免費信箱服務每小時有次數上限，請等約 1 小時再試，或點之前信件中的登入連結。";
    if (s >= 500 || (e && e.name === "AuthRetryableFetchError") || m === "{}" || !m) return "寄信服務暫時忙碌（可能已達每小時上限），請稍後再試或點信中連結。";
    return m.slice(0, 80);
  }

  function readShared() {
    var out = {};
    try {
      out.name = localStorage.getItem("ipas_shared_name") || "";
      out.nameSource = localStorage.getItem("ipas_shared_name_source") || "";
      out.nameUpdatedAt = Number(localStorage.getItem("ipas_shared_name_updated_at")) || 0;
      out.theme = localStorage.getItem("ipas_shared_theme") || "";
      var ai = localStorage.getItem("ipas_shared_ai");
      if (ai) out.ai = JSON.parse(ai);
    } catch (e) {}
    return out;
  }
  function applyShared(d) {
    if (!d) return;
    try {
      // 只在本機尚未有主題偏好時才採用雲端主題；否則以本機為準（避免雲端舊值蓋掉使用者剛在首頁選的主題）
      if ((d.theme === "dark" || d.theme === "light") && !localStorage.getItem("ipas_shared_theme")) {
        localStorage.setItem("ipas_shared_theme", d.theme);
        // html 與 body 同設，避免裸 [data-theme] 選擇器（命中 html）與 body 規則分裂
        document.documentElement.setAttribute("data-theme", d.theme);
        document.body.setAttribute("data-theme", d.theme);
      }
      if (d.ai && d.ai.provider) {
        localStorage.setItem("ipas_shared_ai", JSON.stringify(d.ai));
        Store.saveAi(d.ai);
      }
    } catch (e) {}
  }

  function pushNow(uid) {
    var now = new Date().toISOString();
    return sb.from("user_state").upsert([
      { user_id: uid, app: APP_ID, data: Store.exportAll(), updated_at: now },
      { user_id: uid, app: "shared", data: readShared(), updated_at: now }
    ]).then(function (r) { if (r.error) throw r.error; });
  }

  function cleanName(value) {
    return typeof value === "string" ? value.trim().slice(0, 64) : "";
  }
  function nameChoice(data) {
    data = data || {};
    var name = cleanName(data.name);
    var custom = data.nameSource === "custom" ||
      (!data.nameSource && name && ["我", "使用者", "學習者"].indexOf(name) < 0);
    return { name: name, custom: custom, updatedAt: Number(data.nameUpdatedAt) || 0 };
  }
  function localName(user) {
    var owner = localStorage.getItem("ipas_shared_name_owner");
    if (owner && owner !== user.id) return nameChoice(null);
    var d = readShared();
    if (!d.name) d.name = Store.current().name;
    return nameChoice(d);
  }
  function applyAccountName(user, shared, local, remoteProfile) {
    var remote = nameChoice(shared);
    // 舊版沒有 shared 資料時，仍保留雲端已取好的名稱。
    if (!remote.name && remoteProfile) remote = nameChoice(remoteProfile);
    var chosen;
    if (local.custom && local.name && (!remote.custom || local.updatedAt > remote.updatedAt)) chosen = local;
    else if (remote.custom && remote.name) chosen = remote;
    else {
      var meta = user.user_metadata || {};
      chosen = { name: cleanName(meta.full_name) || cleanName(meta.name) ||
        cleanName((user.email || "").split("@")[0]) || "使用者", custom: false, updatedAt: 0 };
    }
    localStorage.setItem("ipas_shared_name_owner", user.id);
    localStorage.setItem("ipas_shared_name_updated_at", String(chosen.updatedAt));
    localStorage.setItem("ipas_shared_name_source", chosen.custom ? "custom" : "account");
    localStorage.setItem("ipas_shared_name", chosen.name);
    var current = Store.current();
    if (current.name !== chosen.name) Store.renameProfile(current.id, chosen.name);
    var label = el("userNameLabel"), avatar = el("userAvatar");
    if (label) label.textContent = chosen.name;
    if (avatar) avatar.textContent = chosen.name.slice(0, 1).toUpperCase();
    document.dispatchEvent(new CustomEvent("profile-name-changed"));
  }
  function isEmptyLocalProfile() {
    var state = Store.exportAll();
    if (state.profiles.length !== 1) return false;
    return Object.keys(state.data || {}).every(function (id) {
      return Object.keys(state.data[id] || {}).every(function (key) {
        var value = state.data[id][key];
        return !value || (typeof value === "object" && Object.keys(value).length === 0);
      });
    });
  }

  function syncNow() {
    if (!sb) return Promise.resolve();
    if (syncPromise) return syncPromise;
    setStatus("load", "同步中…");
    syncPromise = sb.auth.getUser().then(function (u) {
      var user = u.data.user;
      if (!user) { paint(); return; }
      return sb.from("user_state").select("app,data").in("app", [APP_ID, "shared"])
        .then(function (res) {
          if (res.error) throw res.error;
          var rows = res.data || [];
          var appRow = rows.filter(function (row) { return row.app === APP_ID; })[0];
          var sharedRow = rows.filter(function (row) { return row.app === "shared"; })[0];
          // 在回應抵達後讀取本機名稱，避免蓋掉使用者同步途中剛改的名稱。
          var local = localName(user), remoteProfile;
          if (appRow && appRow.data && appRow.data.profiles && appRow.data.profiles.length) {
            remoteProfile = appRow.data.profiles.filter(function (p) { return p.id === appRow.data.currentId; })[0];
            // 新裝置直接還原雲端目前的使用者，既有本機紀錄則照常合併。
            Store.importAll(appRow.data, isEmptyLocalProfile() ? "replace" : "merge");
          }
          applyShared(sharedRow && sharedRow.data);
          applyAccountName(user, sharedRow && sharedRow.data, local, remoteProfile);
          clearTimeout(pushTimer); pushTimer = null;
          return pushNow(user.id);
        })
        .then(function () { setStatus("ok", "✓ 已同步"); });
    }).catch(function (e) {
      setStatus("err", "同步失敗：" + (e.message || "網路問題").slice(0, 40));
    }).finally(function () { syncPromise = null; });
    return syncPromise;
  }

  function schedulePush() {
    if (!sb) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(flushPush, 3000);
  }
  function flushPush() {
    if (!sb) return;
    if (syncPromise) { syncPromise.then(flushPush); return; }
    clearTimeout(pushTimer); pushTimer = null;
    sb.auth.getUser().then(function (u) {
      var uid = u.data.user && u.data.user.id;
      if (!uid) return;
      setStatus("load", "同步中…");
      return pushNow(uid).then(function () { setStatus("ok", "✓ 已同步"); });
    }).catch(function () { setStatus("err", "離線，稍後自動重試"); });
  }

  function paint() {
    if (!sb) return;
    sb.auth.getSession().then(function (r) {
      var s = r.data.session;
      var out = el("cloudOut"), inn = el("cloudIn");
      if (!out || !inn) return;
      if (s && s.user) {
        out.classList.add("hidden"); inn.classList.remove("hidden");
        var who = el("cloudWho"); if (who) who.textContent = s.user.email;
      } else {
        out.classList.remove("hidden"); inn.classList.add("hidden");
        setStatus("", "");
      }
    });
  }

  function bind() {
    var send = el("cloudSend"), verify = el("cloudVerify");
    if (send) send.onclick = function () {
      var em = (el("cloudEmail").value || "").trim();
      if (!em || em.indexOf("@") < 0) { setStatus("err", "請輸入有效信箱"); return; }
      lastEmail = em;
      setStatus("load", "寄送中…");
      sb.auth.signInWithOtp({ email: em, options: { emailRedirectTo: location.origin + location.pathname } })
        .then(function (r) {
          if (r.error) { setStatus("err", friendlyErr(r.error)); return; }
          el("cloudCodeField").classList.remove("hidden");
          el("cloudVerifyRow").classList.remove("hidden");
          setStatus("ok", "已寄出，請輸入信中的驗證碼（或直接點信中連結）");
        });
    };
    if (verify) verify.onclick = function () {
      var code = (el("cloudCode").value || "").trim();
      if (!code) return;
      setStatus("load", "驗證中…");
      sb.auth.verifyOtp({ email: lastEmail || (el("cloudEmail").value || "").trim(), token: code, type: "email" })
        .then(function (r) {
          if (r.error) { setStatus("err", "驗證碼錯誤或已過期"); return; }
          setStatus("ok", "登入成功");
        });
    };
    var syncBtn = el("cloudSyncBtn"); if (syncBtn) syncBtn.onclick = syncNow;
    var outBtn = el("cloudOutBtn"); if (outBtn) outBtn.onclick = function () { sb.auth.signOut().then(paint); };
  }

  function init() {
    var panel = el("cloudPanel");
    if (!global.supabase || SB_KEY.indexOf("__") === 0) {
      if (panel) panel.innerHTML = '<p class="side-hint">雲端同步尚未啟用。</p>';
      return;
    }
    sb = global.supabase.createClient(SB_URL, SB_KEY);
    bind();
    sb.auth.onAuthStateChange(function (ev) {
      // 離開 Auth callback 後再呼叫 Auth API，避免登入鎖互相等待。
      setTimeout(function () {
        paint();
        if (ev === "SIGNED_IN") syncNow();
      }, 0);
    });
    paint();
    sb.auth.getSession().then(function (r) { if (r.data.session) syncNow(); });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden" && pushTimer) flushPush();
    });
  }

  global.Cloud = { schedulePush: schedulePush, syncNow: syncNow };
  if (document.readyState === "complete") init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);

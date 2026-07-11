/* ============================================================
   cloud.js — Supabase 信箱登入＋雲端同步
   同一份檔案供 junior / intermediate 使用（依路徑自動判斷 app id）。
   資料表：user_state(user_id, app, data jsonb, updated_at)，RLS 限本人。
   同步策略：登入/開機 pull→Store.importAll(merge)→push；
   之後 Store.persist 觸發 debounce push；分頁隱藏時強制 push。
   ============================================================ */
(function (global) {
  "use strict";
  var SB_URL = "https://mugrltimxkvlqyksymjq.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Z3JsdGlteGt2bHF5a3N5bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTY0MDgsImV4cCI6MjA5OTIzMjQwOH0.OfJpNubw7WNF4ca56LZT_oWawiJlZm10Fm1l7rbRI8s";
  var APP_ID = location.pathname.indexOf("/intermediate/") >= 0 ? "intermediate" : "junior";
  var sb = null, pushTimer = null, lastEmail = "";

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
      out.theme = localStorage.getItem("ipas_shared_theme") || "";
      var ai = localStorage.getItem("ipas_shared_ai");
      if (ai) out.ai = JSON.parse(ai);
    } catch (e) {}
    return out;
  }
  function applyShared(d) {
    if (!d) return;
    try {
      if (d.name) {
        localStorage.setItem("ipas_shared_name", d.name);
        var target = (d.name || "").trim();
        var u = Store.current();
        if ((u.name || "").trim() !== target) {
          // 已有同名使用者 → 切換過去；否則才把目前這筆改名，避免產生同名重複
          var same = Store.profiles().filter(function (p) { return (p.name || "").trim() === target; })[0];
          if (same) Store.switchProfile(same.id);
          else Store.renameProfile(u.id, d.name);
          var cur = Store.current();
          var lb = el("userNameLabel"), av = el("userAvatar");
          if (lb) lb.textContent = cur.name;
          if (av) av.textContent = (cur.name || "?").trim().slice(0, 1).toUpperCase();
        }
      }
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

  function syncNow() {
    if (!sb) return;
    setStatus("load", "同步中…");
    sb.auth.getUser().then(function (u) {
      var uid = u.data.user && u.data.user.id;
      if (!uid) { paint(); return; }
      return sb.from("user_state").select("app,data").in("app", [APP_ID, "shared"])
        .then(function (res) {
          if (res.error) throw res.error;
          (res.data || []).forEach(function (row) {
            if (row.app === APP_ID && row.data && row.data.profiles) {
              try { Store.importAll(row.data, "merge"); } catch (e) {}
            }
            if (row.app === "shared") applyShared(row.data);
          });
          return pushNow(uid);
        })
        .then(function () { setStatus("ok", "✓ 已同步"); });
    }).catch(function (e) { setStatus("err", "同步失敗：" + (e.message || "網路問題").slice(0, 40)); });
  }

  function schedulePush() {
    if (!sb) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(flushPush, 3000);
  }
  function flushPush() {
    if (!sb) return;
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
      paint();
      if (ev === "SIGNED_IN") syncNow();
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

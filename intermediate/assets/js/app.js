/* ============================================================
   app.js — 主控（路由、頁面、側邊欄、AI 設定、使用者）
   ============================================================ */
(function (global) {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

  // 科目一律用中文名（禁用 S1/S2/S3 等代號）：依科目順序給「科目一/二/三…」序位
  var CJK_NUM = ["一", "二", "三", "四", "五", "六", "七", "八"];
  function subjOrd(i) { return "科目" + (CJK_NUM[i] || (i + 1)); }
  function subjOrdName(s, i) { return subjOrd(i) + "　" + (s && s.name || ""); }
  // 模擬考完全比照官方：單科、50 題、75 分鐘
  var MOCK_COUNT = 50, MOCK_LIMIT_SEC = 75 * 60;

  var main = $("#mainView");
  var route = "dashboard";
  var pendingQuiz = null;
  var inRunner = false;   // 測驗執行器是否在畫面上（避免被 bank-ready 重繪打斷）

  /* ---------- Toast / Modal ---------- */
  function toast(msg, type) {
    var t = document.createElement("div");
    t.className = "toast" + (type ? " " + type : "");
    t.textContent = msg; $("#toastWrap").appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = ".3s"; setTimeout(function () { t.remove(); }, 300); }, 2200);
  }
  function modal(html) {
    $("#modalBox").innerHTML = html; $("#modalRoot").classList.remove("hidden");
  }
  function closeModal() { $("#modalRoot").classList.add("hidden"); }
  $("#modalScrim").onclick = closeModal;
  function confirmDlg(title, desc, onOk, okLabel) {
    modal('<div class="modal-title">' + esc(title) + '</div><div class="modal-desc">' + esc(desc) + '</div>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="mCancel">取消</button>' +
      '<button class="btn btn-primary" id="mOk">' + esc(okLabel || "確定") + '</button></div>');
    $("#mCancel").onclick = closeModal;
    $("#mOk").onclick = function () { closeModal(); onOk && onOk(); };
  }

  /* ---------- 導覽 ---------- */
  function go(r) {
    route = r; pendingQuiz = null; inRunner = false;
    $$(".nav-item").forEach(function (n) { n.classList.toggle("active", n.getAttribute("data-route") === r); });
    closeSidebar();
    render();
    main.scrollTop = 0; window.scrollTo(0, 0);
  }
  function render() {
    var v = VIEWS[route]; if (v) v(); else VIEWS.dashboard();
    playEnter();
  }
  // 只在換頁時觸發一次進場動畫（內部重繪不會呼叫 render，故不會亂閃）
  function playEnter() {
    main.classList.remove("nav-enter"); void main.offsetWidth; main.classList.add("nav-enter");
    clearTimeout(main._enterT); main._enterT = setTimeout(function () { main.classList.remove("nav-enter"); }, 750);
  }

  /* ---------- 側邊欄 ---------- */
  function openSidebar() { $("#sidebar").classList.add("open"); $("#sidebarScrim").classList.add("show"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#sidebarScrim").classList.remove("show"); }
  $("#menuToggle") && ($("#menuToggle").onclick = openSidebar);
  $("#sidebarScrim").onclick = closeSidebar;
  $$(".nav-item").forEach(function (n) { n.onclick = function (e) { e.preventDefault(); go(n.getAttribute("data-route")); }; });
  $$(".side-section-head").forEach(function (h) {
    h.onclick = function () { var b = $("#" + h.getAttribute("data-collapse")); if (b) b.classList.toggle("collapsed"); };
  });

  /* ---------- 主題（跨認證共用 ipas_shared_theme） ---------- */
  // 重要：data-theme 必須 html 與 body 同時設。CSS 變數用裸 [data-theme="dark"] 選擇器（會命中 html），
  // 圖片切換用 body[data-theme]；只設其中一個會出現「圖換了背景沒換」的分裂狀態。
  function setThemeAttr(t) { document.documentElement.setAttribute("data-theme", t); document.body.setAttribute("data-theme", t); }
  function paintFab(){ var d=document.body.getAttribute("data-theme")==="dark"; var m=document.getElementById("fabMoon"),s=document.getElementById("fabSun"); if(m)m.style.display=d?"none":""; if(s)s.style.display=d?"":"none"; }
  function applyTheme(t) { setThemeAttr(t); try { localStorage.setItem("aipsc_theme", t); localStorage.setItem("ipas_shared_theme", t); } catch (e) {} paintFab(); }
  (function () {
    try {
      var t = localStorage.getItem("ipas_shared_theme") || localStorage.getItem("aipsc_theme");
      if (t) { setThemeAttr(t); return; }
      if (matchMedia("(prefers-color-scheme: dark)").matches) setThemeAttr("dark");
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem("ipas_shared_theme") && !localStorage.getItem("aipsc_theme")) setThemeAttr(e.matches ? "dark" : "light");
      });
    } catch (e) {}
  })();
  /* 主題即時同步：另一分頁切深淺，這裡不刷新直接變 */
  global.addEventListener("storage", function (ev) {
    if (ev && ev.key === "ipas_shared_theme" && (ev.newValue === "dark" || ev.newValue === "light")) setThemeAttr(ev.newValue); paintFab();
  });
  /* bfcache 還原（上一頁/認證切換）時重新對齊共用主題與名稱 */
  global.addEventListener("pageshow", function () {
    try {
      var t = localStorage.getItem("ipas_shared_theme");
      if ((t === "dark" || t === "light") && document.body.getAttribute("data-theme") !== t) setThemeAttr(t); paintFab();
      var sn = localStorage.getItem("ipas_shared_name");
      var u = Store.current();
      if (sn && u.name !== sn) { Store.renameProfile(u.id, sn); paintUser(); }
    } catch (e) {}
  });
  function toggleTheme() { applyTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"); }
  $("#themeToggle") && ($("#themeToggle").onclick = toggleTheme);
  $("#themeToggleTop") && ($("#themeToggleTop").onclick = toggleTheme);
  $("#themeFab") && ($("#themeFab").onclick = toggleTheme);
  paintFab();


  /* ---------- 使用者名稱：預設遷移＋跨認證同步 ---------- */
  (function () {
    try {
      var u = Store.current();
      if (u.name === "我") { Store.renameProfile(u.id, "使用者"); u = Store.current(); }
      var shared = localStorage.getItem("ipas_shared_name");
      if (shared && shared !== u.name) { Store.renameProfile(u.id, shared); }
      else if (!shared) { localStorage.setItem("ipas_shared_name", u.name); }
    } catch (e) {}
  })();

  /* 共用名稱即時同步：另一個認證分頁改名時，這裡不必刷新直接跟著變 */
  global.addEventListener("storage", function (ev) {
    if (!ev || ev.key !== "ipas_shared_name" || !ev.newValue) return;
    try {
      var u = Store.current();
      if (u.name !== ev.newValue) { Store.renameProfile(u.id, ev.newValue); paintUser(); }
    } catch (e) {}
  });

  /* ---------- 使用者切換 ---------- */
  function paintUser() {
    var u = Store.current();
    $("#userNameLabel").textContent = u.name; $("#userAvatar").textContent = (u.name || "?").trim().slice(0, 1).toUpperCase();
  }
  $("#userCurrentBtn").onclick = function (e) {
    e.stopPropagation();
    var menu = $("#userMenu");
    if (!menu.classList.contains("hidden")) { menu.classList.add("hidden"); return; }
    var cur = Store.currentId();
    var html = Store.profiles().map(function (p) {
      return '<a class="um-item ' + (p.id === cur ? "active" : "") + '" href="#" role="menuitem" data-uid="' + p.id + '">' +
        '<span class="um-ava">' + esc((p.name || "?").trim().slice(0, 1).toUpperCase()) + '</span><span style="flex:1">' + esc(p.name) + '</span>' + (p.id === cur ? Icon.get("check") : "") + '</a>';
    }).join("");
    html += '<div class="um-sep"></div><a class="um-item um-add" href="#" role="menuitem" data-add="1">' + Icon.get("plus") + '新增使用者</a>' +
      '<a class="um-item" href="#" role="menuitem" data-rename="1">' + Icon.get("pencil") + '重新命名</a>' +
      (Store.profiles().length > 1 ? '<a class="um-item" href="#" role="menuitem" data-del="1" style="color:var(--danger)">' + Icon.get("trash") + '刪除此使用者</a>' : '');
    menu.innerHTML = html; menu.classList.remove("hidden");
    $$("[data-uid]", menu).forEach(function (a) { a.onclick = function (e) { e.preventDefault(); Store.switchProfile(a.getAttribute("data-uid")); try { localStorage.setItem("ipas_shared_name", Store.current().name); } catch (e2) {} menu.classList.add("hidden"); paintUser(); go(route); toast("已切換使用者"); }; });
    $("[data-add]", menu) && ($("[data-add]", menu).onclick = function (e) { e.preventDefault(); menu.classList.add("hidden"); addUserDlg(); });
    $("[data-rename]", menu) && ($("[data-rename]", menu).onclick = function (e) { e.preventDefault(); menu.classList.add("hidden"); renameDlg(); });
    $("[data-del]", menu) && ($("[data-del]", menu).onclick = function (e) { e.preventDefault(); menu.classList.add("hidden"); delUserDlg(); });
  };
  document.addEventListener("click", function () { var m = $("#userMenu"); if (m && !m.classList.contains("hidden")) m.classList.add("hidden"); });

  function addUserDlg() {
    modal('<div class="modal-title">新增使用者</div><div class="modal-desc">建立獨立的學習與成績紀錄。</div>' +
      '<div class="field"><span class="field-label">名稱</span><input id="nuName" placeholder="例：小明" maxlength="16"></div>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">建立</button></div>');
    $("#mCancel").onclick = closeModal;
    $("#mOk").onclick = function () { var n = $("#nuName").value.trim() || "學習者"; Store.addProfile(n, ""); try { localStorage.setItem("ipas_shared_name", Store.current().name); } catch (e2) {} closeModal(); paintUser(); go("dashboard"); toast("已建立「" + n + "」", "ok"); };
  }
  function renameDlg() {
    var u = Store.current();
    modal('<div class="modal-title">重新命名</div>' +
      '<div class="field"><span class="field-label">名稱</span><input id="rnName" value="' + esc(u.name) + '" maxlength="16"></div>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">儲存</button></div>');
    $("#mCancel").onclick = closeModal;
    $("#mOk").onclick = function () { var nn = $("#rnName").value.trim() || u.name; Store.renameProfile(u.id, nn); try { localStorage.setItem("ipas_shared_name", nn); } catch (e2) {} closeModal(); paintUser(); toast("已更新"); };
  }
  function delUserDlg() {
    var u = Store.current();
    confirmDlg("刪除使用者「" + u.name + "」？", "此使用者的所有成績紀錄將永久刪除，無法復原。", function () {
      Store.deleteProfile(u.id); paintUser(); go("dashboard"); toast("已刪除", "ok");
    }, "刪除");
  }

  /* AI 模型設定已移除：官方＋網路題皆內建解析，無需使用者提供金鑰 */

  /* ---------- 備份 ---------- */
  function downloadJSON(obj, name) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob); var a = document.createElement("a");
    a.href = url; a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ============================================================
     頁面
     ============================================================ */
  var SUBJ_COLORS = { S1: "#5b5bd6", S2: "#00b3a4", S3: "#e8843d", MIX: "#8a63d2", AI: "#e5566b" };

  function pageHead(title, sub) {
    return '<div class="page-head"><div class="page-title">' + esc(title) + '</div>' + (sub ? '<div class="page-sub">' + esc(sub) + '</div>' : '') + '</div>';
  }

  var VIEWS = {};

  /* ---- 儀表板 ---- */
  VIEWS.dashboard = function () {
    var ov = Analysis.overall();
    var u = Store.current();
    var cnts = Content.counts();
    var subjAcc = {}; Analysis.bySubject().forEach(function (s) { subjAcc[s.key] = s; });

    var hero =
      '<section class="hero">' +
        (global.LITE ? '' : '<video class="hero-video" autoplay muted loop playsinline preload="none" poster="assets/media/hero-light.jpg"><source src="assets/media/hero.mp4" type="video/mp4"></video>') +
        '<div class="hero-bg"></div><div class="hero-scrim"></div>' +
        '<div class="hero-inner">' +
          '<div class="hero-eyebrow">AI 應用規劃師 · 中級能力鑑定</div>' +
          '<h1 class="hero-title">' + (ov.count ? '歡迎回來，' + esc(u.name) : esc(u.name) + '，開始備考吧') + '</h1>' +
          '<p class="hero-sub">' + cnts.total + ' 題官方公告試題（114-2／115-1 兩梯次）、三科教材、成績判讀與成長曲線，一站搞定。</p>' +
          '<div class="hero-cta">' +
            '<button class="btn btn-primary btn-lg" data-act="mock">開始模擬考</button>' +
            '<button class="btn btn-glass btn-lg" data-goto="learn">瀏覽教材</button>' +
          '</div>' +
        '</div>' +
      '</section>';
    var statsGrid = ov.count ? (
      '<div class="grid grid-4">' +
        statCard("練習次數", ov.count, "次", null) +
        statCard("平均分數", ov.avgScore, "分", "accent") +
        statCard("最佳分數", ov.bestScore, "分", null) +
        statCard("累計作答", ov.totalQuestions, "題", null) +
      '</div>'
    ) : '';

    var SUBJ_IMG = { S1: "assets/media/subj-s1", S2: "assets/media/subj-s2", S3: "assets/media/subj-s3" };
    var subjectsCards = Content.subjects().map(function (s, si) {
      var acc = subjAcc[s.code];
      var pct = acc ? acc.accuracy : 0;
      var meta = acc ? (acc.correct + "/" + acc.attempted + " 題答對 · 正確率 " + pct + "%") : (Content.chapters(s.code).length + " 章 · " + Content.questions({ subject: s.code }).length + " 題");
      return '<button class="subject-card sc-card" data-subj="' + s.code + '">' +
        '<div class="sc-media"><img class="img-light" src="' + SUBJ_IMG[s.code] + '.jpg?v=13" alt="" loading="lazy"><img class="img-dark" src="' + SUBJ_IMG[s.code] + '-dark.jpg?v=13" alt="" loading="lazy"><span class="sc-badge">' + subjOrd(si) + '</span></div>' +
        '<div class="sc-body"><div class="sc-name">' + esc(s.name) + '</div>' +
        '<div class="sc-meta">' + esc(meta) + '</div>' +
        '<div class="sc-bar"><i style="width:' + pct + '%"></i></div></div></button>';
    }).join("");

    var quick =
      '<div class="grid grid-3">' +
        actionCard("mock", "target", "模擬考", "單科 50 題／75 分鐘") +
        actionCard("wrong", "loop", "錯題複習", "重做答錯的題目") +
        actionCard("bookmark", "flag", "收藏複習", "重做收藏的題目") +
      '</div>';

    var growthCard = "";
    if (ov.count >= 2) {
      var g = Analysis.growthSeries();
      growthCard = '<div class="section-title">分數趨勢</div><div class="card card-pad">' +
        Charts.line([{ name: "總分", color: SUBJ_COLORS.MIX, points: g.overall }]) + '</div>';
    }

    main.innerHTML =
      hero + statsGrid +
      '<div class="section-title">三大科目 <span class="tag">點擊開始練習</span></div>' +
      '<div class="grid grid-3">' + subjectsCards + '</div>' +
      '<div class="section-title">快速開始</div>' + quick +
      growthCard;

    $$("[data-subj]").forEach(function (b) { b.onclick = function () { go("quiz"); setTimeout(function () { setupSubject(b.getAttribute("data-subj")); }, 0); }; });
    $$("[data-act]").forEach(function (b) { b.onclick = function () { handleAction(b.getAttribute("data-act")); }; });
    $$("[data-goto]").forEach(function (b) { b.onclick = function () { go(b.getAttribute("data-goto")); }; });
  };
  function statCard(label, val, unit, cls, foot) {
    return '<div class="stat ' + (cls ? "stat-" + cls : "") + '"><div class="stat-label">' + esc(label) + '</div>' +
      '<div class="stat-value">' + val + '<span class="unit">' + esc(unit || "") + '</span></div>' + (foot ? '<div class="stat-foot">' + esc(foot) + '</div>' : '') + '</div>';
  }
  function actionCard(act, ico, name, desc) {
    return '<button class="mode-card" data-act="' + act + '"><div class="mc-ico">' + Icon.get(ico) + '</div>' +
      '<div class="mc-name">' + esc(name) + '</div><div class="mc-desc">' + esc(desc) + '</div></button>';
  }
  function handleAction(act) {
    if (act === "mock" || act === "exam") { quizCfg.mode = "mock"; if (!quizCfg.subject) quizCfg.subject = (Content.subjects()[0] || {}).code || ""; quizCfg.onlyOfficial = true; quizCfg.onlyNetwork = false; go("quiz"); }
    else if (act === "bookmark") startQuiz({ mode: "bookmark", subjectName: "收藏複習" });
    else if (act === "wrong") startQuiz({ mode: "wrong", subjectName: "錯題複習" });
    else if (act === "generate") go("generate");
  }

  /* ---- 教材學習 ---- */
  var learnSubj = "S1", learnQuery = "";
  function hl(text, q) {
    var t = esc(text || "");
    if (!q) return t;
    try { return t.replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), '<span class="hl">$1</span>'); }
    catch (e) { return t; }
  }
  function chapterMatches(ch, q) {
    if (!q) return true;
    var hay = (ch.title + " " + (ch.summary || "") + " " + (ch.keyPoints || []).join(" ") + " " +
      (ch.concepts || []).map(function (c) { return c.term + " " + c.definition; }).join(" ")).toLowerCase();
    return hay.indexOf(q) >= 0;
  }
  function chapterCard(ch, subjCode, idx, q, open) {
    var kp = (ch.keyPoints || []).map(function (p) { return '<li>' + hl(p, q) + '</li>'; }).join("");
    var cc = (ch.concepts || []).map(function (c) {
      return '<div class="concept"><div class="c-term">' + hl(c.term, q) + '</div><div class="c-def">' + hl(c.definition, q) + '</div></div>';
    }).join("");
    var qn = Content.chapterQuestionCount(ch.id);
    var subj = ch.subjectCode || subjCode || learnSubj;
    return '<div class="chapter' + (open ? ' open' : '') + '" data-ch="' + ch.id + '">' +
      '<div class="chapter-head" tabindex="0" role="button" aria-expanded="' + (open ? 'true' : 'false') + '"><div class="chapter-idx">' + (idx + 1) + '</div>' +
      '<div class="chapter-title">' + hl(ch.title, q) + (subjCode ? ' <span class="q-badge subj" style="margin-left:8px">' + subjCode + '</span>' : '') + '</div>' +
      '<div class="chapter-qn">' + qn + ' 題</div><span class="chevron">▾</span></div>' +
      '<div class="chapter-body">' +
        '<div class="chapter-summary">' + hl(ch.summary || "", q) + '</div>' +
        (kp ? '<div class="kp-title">學習重點</div><ul class="kp-list">' + kp + '</ul>' : '') +
        (cc ? '<div class="kp-title">關鍵名詞</div>' + cc : '') +
        '<div class="chapter-actions">' +
          (qn ? '<button class="btn btn-primary btn-sm" data-practice="' + ch.id + '" data-subj="' + subj + '">' + Icon.get("pencil") + '練習本章 (' + qn + ')</button>' : '') +
        '</div>' +
      '</div></div>';
  }
  VIEWS.learn = function () {
    var q = learnQuery.trim().toLowerCase();
    var searchBox = '<input class="learn-search" id="learnSearch" type="search" placeholder="搜尋章節、重點、名詞…" value="' + esc(learnQuery) + '" aria-label="搜尋教材">';
    var tabs = "", body;
    if (q) {
      var hits = [];
      Content.subjects().forEach(function (s) {
        (s.chapters || []).forEach(function (ch, i) { if (chapterMatches(ch, q)) hits.push({ ch: ch, code: s.code, i: i }); });
      });
      body = hits.length
        ? '<div class="page-sub" style="margin-bottom:12px">找到 ' + hits.length + ' 章</div>' + hits.map(function (h) { return chapterCard(h.ch, h.code, h.i, q, true); }).join("")
        : '<div class="empty"><div class="e-title">找不到「' + esc(learnQuery) + '」</div><div class="e-sub">換個關鍵字試試。</div></div>';
    } else {
      tabs = '<div class="chip-row" style="margin-bottom:16px">' + Content.subjects().map(function (s, i) {
        return '<button class="chip ' + (s.code === learnSubj ? "on" : "") + '" data-ltab="' + s.code + '">' + subjOrd(i) + '　' + esc(s.name) + '</button>';
      }).join("") + '</div>';
      var subj = Content.subject(learnSubj);
      body = (subj ? subj.chapters : []).map(function (ch, i) { return chapterCard(ch, "", i, "", false); }).join("");
    }
    main.innerHTML = pageHead("教材學習", "官方學習指引數位化 · 依章節研讀重點與名詞") + searchBox + tabs + body;

    var search = $("#learnSearch");
    if (search) search.oninput = function () { learnQuery = search.value; VIEWS.learn(); var el = $("#learnSearch"); if (el) { el.focus(); var v = el.value; el.value = ""; el.value = v; } };
    $$("[data-ltab]").forEach(function (b) { b.onclick = function () { learnSubj = b.getAttribute("data-ltab"); VIEWS.learn(); }; });
    $$(".chapter-head").forEach(function (h) {
      var toggle = function () { var open = h.parentNode.classList.toggle("open"); h.setAttribute("aria-expanded", open ? "true" : "false"); };
      h.onclick = toggle;
      h.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } };
    });
    $$("[data-practice]").forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); startQuiz({ mode: "official", subject: b.getAttribute("data-subj"), topic: b.getAttribute("data-practice"), subjectName: Content.chapterTitle(b.getAttribute("data-practice")) }); }; });
  };

  /* ---- 測驗設定 ---- */
  var quizCfg = { mode: "official", subject: "", topic: "", count: 15, onlyOfficial: false, onlyNetwork: false };
  function limitSecOf() {
    return quizCfg.mode === "mock" ? MOCK_LIMIT_SEC : 0;   // 模擬考固定 75 分鐘，其餘不限時
  }
  function sourceGroup() {
    return '<div class="opt-group"><span class="og-label">題目來源</span><div class="chip-row">' +
      '<button class="chip ' + (!quizCfg.onlyOfficial && !quizCfg.onlyNetwork ? "on" : "") + '" data-src="all">全部（官方＋網路）</button>' +
      '<button class="chip ' + (quizCfg.onlyOfficial ? "on" : "") + '" data-src="official">只考官方歷屆</button>' +
      '<button class="chip ' + (quizCfg.onlyNetwork ? "on" : "") + '" data-src="network">只考網路題</button>' +
      '</div></div>';
  }
  function poolSize() {
    if (quizCfg.mode === "mock") return quizCfg.subject
      ? Content.questions({ subject: quizCfg.subject, includeContext: false, onlyOfficial: quizCfg.onlyOfficial, onlyGenerated: quizCfg.onlyNetwork }).length
      : Content.allOfficial(false, quizCfg.onlyOfficial, quizCfg.onlyNetwork).length;
    if (quizCfg.mode === "official") return Content.questions({ subject: quizCfg.subject || null, topic: quizCfg.topic || null, includeContext: false, onlyOfficial: quizCfg.onlyOfficial, onlyGenerated: quizCfg.onlyNetwork }).length;
    if (quizCfg.mode === "ai") return Store.aiQuestions().length;
    if (quizCfg.mode === "wrong") return Quiz.buildQuestions({ mode: "wrong" }).length;
    if (quizCfg.mode === "bookmark") return Quiz.buildQuestions({ mode: "bookmark" }).length;
    return 0;
  }
  VIEWS.quiz = function () {
    var modeCards = Object.keys(Quiz.MODES).map(function (k) {
      var m = Quiz.MODES[k];
      return '<button class="mode-card ' + (quizCfg.mode === k ? "on" : "") + '" data-mode="' + k + '">' +
        '<div class="mc-ico">' + Icon.get(m.icon) + '</div><div class="mc-name">' + esc(m.name) + '</div>' +
        '<div class="mc-desc">' + esc(m.desc) + '</div></button>';
    }).join("");

    var body = "";
    if (quizCfg.mode === "official" || quizCfg.mode === "ai") {
      var subjChips = '<button class="chip ' + (!quizCfg.subject ? "on" : "") + '" data-subj-chip="">全部科目</button>' +
        Content.subjects().map(function (s, i) { return '<button class="chip ' + (quizCfg.subject === s.code ? "on" : "") + '" data-subj-chip="' + s.code + '" title="' + esc(s.name) + '">' + esc(subjOrdName(s, i)) + '</button>'; }).join("");
      var chapOpts = '<option value="">全部章節</option>';
      if (quizCfg.subject) chapOpts += Content.chapters(quizCfg.subject).map(function (c) { return '<option value="' + c.id + '"' + (quizCfg.topic === c.id ? " selected" : "") + '>' + esc(c.title) + '</option>'; }).join("");
      body =
        (quizCfg.mode === "ai" ? '<div class="callout"><span class="co-ico">' + Icon.get("sparkle") + '</span><div>目前 AI 題庫有 <b>' + Store.aiQuestions().length + '</b> 題。可到「AI 出題」頁面產生更多。</div></div>' : '') +
        '<div class="opt-group"><span class="og-label">科目</span><div class="chip-row">' + subjChips + '</div></div>' +
        '<div class="opt-group"><span class="og-label">章節</span><select id="qzChap">' + chapOpts + '</select></div>' +
        (quizCfg.mode === "official" ? sourceGroup() : "") +
        '<div class="opt-group"><span class="og-label">題數</span>' + countChips([10, 15, 25, 50], true) + '</div>';
    } else if (quizCfg.mode === "mock") {
      var mockSubjChips = Content.subjects().map(function (s, i) { return '<button class="chip ' + (quizCfg.subject === s.code ? "on" : "") + '" data-subj-chip="' + s.code + '" title="' + esc(s.name) + '">' + esc(subjOrdName(s, i)) + '</button>'; }).join("");
      body = '<div class="callout"><span class="co-ico">' + Icon.get("target") + '</span><div>完全比照官方考試：<b>單一科目、' + MOCK_COUNT + ' 題、75 分鐘</b>計時作答，交卷後才公布成績與詳解，最貼近實戰。</div></div>' +
        '<div class="opt-group"><span class="og-label">科目（選一科應考）</span><div class="chip-row">' + mockSubjChips + '</div></div>' +
        sourceGroup();
    } else if (quizCfg.mode === "wrong") {
      var wc = Quiz.buildQuestions({ mode: "wrong" }).length;
      body = '<div class="callout ' + (wc ? "" : "warn") + '"><span class="co-ico">' + Icon.get("loop") + '</span><div>' +
        (wc ? ('你目前累積 <b>' + wc + '</b> 題錯題，將隨機重做。') : '目前沒有錯題。先做幾份測驗，答錯的題目會自動收進這裡。') + '</div></div>';
    } else if (quizCfg.mode === "bookmark") {
      var bc = Quiz.buildQuestions({ mode: "bookmark" }).length;
      body = '<div class="callout ' + (bc ? "" : "warn") + '"><span class="co-ico">' + Icon.get("flag") + '</span><div>' +
        (bc ? ('你已收藏 <b>' + bc + '</b> 題，將隨機重做。') : '目前沒有收藏題目。作答時按題目右上角的★即可收藏。') + '</div></div>';
    }

    var isMock = quizCfg.mode === "mock";
    var canStart = true;
    if (quizCfg.mode === "ai" && Store.aiQuestions().length === 0) canStart = false;
    if (quizCfg.mode === "wrong" && poolSize() === 0) canStart = false;
    if (quizCfg.mode === "bookmark" && poolSize() === 0) canStart = false;
    if (isMock && !quizCfg.subject) canStart = false;
    var pool = poolSize();

    function row(label, val) { return '<div class="qs-row"><span>' + esc(label) + '</span><b>' + esc(val) + '</b></div>'; }
    var summary =
      row("模式", Quiz.MODES[quizCfg.mode].name) +
      ((quizCfg.mode === "official" || quizCfg.mode === "ai") ? row("科目", quizCfg.subject ? Content.subjectName(quizCfg.subject) : "全部科目") + row("章節", quizCfg.topic ? Content.chapterTitle(quizCfg.topic) : "全部章節") : "") +
      (isMock ? row("科目", quizCfg.subject ? Content.subjectName(quizCfg.subject) : "請選擇一科") : "") +
      ((quizCfg.mode === "official" || isMock) ? row("來源", quizCfg.onlyOfficial ? "只考官方歷屆" : quizCfg.onlyNetwork ? "只考網路題" : "全部（官方＋網路）") : "") +
      (isMock ? (row("題數", MOCK_COUNT + " 題") + row("限時", "75 分鐘"))
              : row("題數", quizCfg.mode === "wrong" ? "全部錯題" : (quizCfg.count === 0 ? "全部" : quizCfg.count + " 題"))) +
      row("可用題目", pool + " 題" + (
        (isMock && pool < MOCK_COUNT) || (!isMock && quizCfg.count > 0 && pool < quizCfg.count && quizCfg.mode !== "wrong")
          ? "（不足將全數作答）" : ""));

    var panel =
      '<aside class="quiz-side">' +
        '<div class="quiz-anim quiz-anim-img"><img class="img-light" src="assets/media/quiz-target-light.jpg?v=25" alt="" loading="lazy"><img class="img-dark" src="assets/media/quiz-target-dark.jpg?v=25" alt="" loading="lazy"></div>' +
        '<div class="qs-title">測驗摘要</div>' +
        '<div class="qs-list">' + summary + '</div>' +
        '<button class="btn btn-primary full" id="qzStart" ' + (canStart ? "" : "disabled") + '>開始測驗 →</button>' +
      '</aside>';

    main.innerHTML = pageHead("開始測驗", "選擇模式與範圍，即可開始") +
      '<div class="quiz-setup">' +
        '<div class="opt-group"><span class="og-label">測驗模式</span><div class="mode-grid">' + modeCards + '</div></div>' +
        '<div class="quiz-cols"><div class="quiz-opts">' + body + '</div>' + panel + '</div>' +
      '</div>';

    $$("[data-mode]").forEach(function (b) { b.onclick = function () {
      quizCfg.mode = b.getAttribute("data-mode");
      if (quizCfg.mode === "mock") { if (!quizCfg.subject) quizCfg.subject = (Content.subjects()[0] || {}).code || ""; quizCfg.onlyOfficial = true; quizCfg.onlyNetwork = false; }
      VIEWS.quiz();
    }; });
    $$("[data-subj-chip]").forEach(function (b) { b.onclick = function () { quizCfg.subject = b.getAttribute("data-subj-chip"); quizCfg.topic = ""; VIEWS.quiz(); }; });
    var chapSel = $("#qzChap"); if (chapSel) chapSel.onchange = function () { quizCfg.topic = chapSel.value; VIEWS.quiz(); };
    $$("[data-count]").forEach(function (c) { c.onclick = function () { var v = c.getAttribute("data-count"); quizCfg.count = v === "all" ? 0 : +v; VIEWS.quiz(); }; });
    $$("[data-src]").forEach(function (c) { c.onclick = function () { var v = c.getAttribute("data-src"); quizCfg.onlyOfficial = v === "official"; quizCfg.onlyNetwork = v === "network"; VIEWS.quiz(); }; });
    $("#qzStart").onclick = function () {
      var name = quizCfg.mode === "mock"
        ? (quizCfg.subject ? Content.subjectName(quizCfg.subject) + " 模擬考" : "綜合模擬考")
        : quizCfg.topic ? Content.chapterTitle(quizCfg.topic) : quizCfg.subject ? Content.subjectName(quizCfg.subject) : Quiz.MODES[quizCfg.mode].name;
      var allMode = quizCfg.mode === "wrong" || quizCfg.mode === "bookmark";
      var cnt = quizCfg.mode === "mock" ? MOCK_COUNT : (allMode ? 0 : quizCfg.count);
      startQuiz({ mode: quizCfg.mode, subject: quizCfg.subject, topic: quizCfg.mode === "mock" ? "" : quizCfg.topic, count: cnt, onlyOfficial: quizCfg.onlyOfficial, onlyGenerated: quizCfg.onlyNetwork, limitSec: limitSecOf(), subjectName: name });
    };
    if (global.Interactions && Interactions.mountQuizAnim) Interactions.mountQuizAnim();
  };
  function countChips(list, withAll) {
    var chips = list.map(function (n) { return '<button class="chip ' + (quizCfg.count === n ? "on" : "") + '" data-count="' + n + '">' + n + ' 題</button>'; });
    if (withAll) chips.push('<button class="chip ' + (quizCfg.count === 0 ? "on" : "") + '" data-count="all">全部</button>');
    return '<div class="chip-row">' + chips.join("") + '</div>';
  }
  function setupSubject(code) { quizCfg.mode = "official"; quizCfg.subject = code; quizCfg.topic = ""; VIEWS.quiz(); }

  /* ---- 啟動測驗（接管主畫面）---- */
  function startQuiz(config) {
    route = "quiz"; inRunner = true;
    $$(".nav-item").forEach(function (n) { n.classList.toggle("active", n.getAttribute("data-route") === "quiz"); });
    // 需要擴充題庫時先確保載入（首次會動態載 bank.js）
    Content.ensureBank(function () {
      Quiz.launch(config, main, { onExit: function (r) { inRunner = false; go(r || "quiz"); } });
      playEnter();
      window.scrollTo(0, 0);
    });
  }

  /* ---- 成績判讀 ---- */
  VIEWS.analysis = function () {
    if (!Analysis.hasData()) { main.innerHTML = pageHead("成績判讀") + emptyBox("尚無成績", "做完第一份測驗後，這裡會分析你各科、各主題的強弱與加強建議。", "去測驗", "quiz"); bindEmpty(); return; }
    var subj = Analysis.bySubject();
    var weak = Analysis.weakTopics(2, 6);
    var strong = Analysis.strongTopics(2, 3);
    var recs = Analysis.recommendations();
    var mastery = Analysis.masterySummary();

    var subjBars = Charts.bars(subj.map(function (s) { return { label: s.title, value: s.accuracy }; }));
    var weakHtml = weak.length ? weak.map(function (t) {
      return '<div class="weak-row"><div class="weak-info"><div class="weak-name">' + esc(t.title) + '</div>' +
        '<div class="weak-meta">' + t.correct + '/' + t.attempted + ' 題答對</div></div>' +
        '<div class="weak-bar"><i style="width:' + t.accuracy + '%;background:' + Charts.color(t.accuracy) + '"></i></div>' +
        '<div class="weak-pct" style="color:' + Charts.color(t.accuracy) + '">' + t.accuracy + '%</div></div>';
    }).join("") : '<div class="page-sub">再多做幾題就能分析主題強弱。</div>';

    var recHtml = recs.length ? recs.map(function (r) {
      return '<div class="tips"><div class="tips-head">' + Icon.get("flag") + esc(r.title) + '（正確率 ' + r.accuracy + '%）</div>' +
        '<ul>' + r.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul></div>';
    }).join("") : "";

    var strongHtml = strong.length ? ('<div class="chip-row">' + strong.map(function (t) { return '<span class="chip on">' + Icon.get("check") + esc(t.title) + '　' + t.accuracy + '%</span>'; }).join("") + '</div>') : "";

    main.innerHTML = pageHead("成績判讀", "看清楚哪些觀念要加強") +
      '<div class="grid grid-4">' +
        statCard("熟練章節", mastery.mastered, "章", "accent") +
        statCard("待複習", mastery.review, "章", null) +
        statCard("高風險弱點", mastery.risk, "章", null) +
        statCard("題量不足", mastery.insufficient, "章", null) +
      '</div>' +
      '<div class="section-title">各科正確率</div><div class="card card-pad">' + subjBars + '</div>' +
      '<div class="section-title">最需加強的主題 <span class="tag">正確率由低到高</span></div><div class="card card-pad">' + weakHtml + '</div>' +
      (recHtml ? '<div class="section-title">加強建議</div>' + recHtml : "") +
      (strongHtml ? '<div class="section-title">你的強項</div>' + strongHtml : "");
  };

  /* ---- 成長曲線 ---- */
  var growthMode = "overall";
  VIEWS.growth = function () {
    if (!Analysis.hasData()) { main.innerHTML = pageHead("成長曲線") + emptyBox("尚無成長紀錄", "每完成一次測驗，就會在這裡新增一個分數點，追蹤你的進步。", "去測驗", "quiz"); bindEmpty(); return; }
    var ov = Analysis.overall();
    var g = Analysis.growthSeries();
    var _atts = Store.attempts().slice().sort(function (x, y) { return new Date(x.finishedAt) - new Date(y.finishedAt); });
    var _n = _atts.length, _sumT = 0, _sumC = 0;
    _atts.forEach(function (a) { _sumT += a.total; _sumC += a.correct; });
    var _acc = _sumT ? Math.round(100 * _sumC / _sumT) : 0;
    var _accOf = function (arr) { var t = 0, c = 0; arr.forEach(function (a) { t += a.total; c += a.correct; }); return t ? (100 * c / t) : null; };
    var _c1 = statCard("平均正確率", _acc, "%", null, "題目加權");
    var _c2 = statCard("累積作答", _sumT, "題", null, "共 " + _n + " 次");
    var _c3;
    if (_n >= 4) {
      var _k = Math.min(5, Math.floor(_n / 2));
      var _d = Math.round(_accOf(_atts.slice(_n - _k)) - _accOf(_atts.slice(0, _n - _k)));
      var _col = _d > 0 ? "#16a34a" : _d < 0 ? "#e5566b" : "var(--text-mute)";
      var _arr = _d > 0 ? "▲" : _d < 0 ? "▼" : "▬";
      _c3 = statCard("近期趨勢", '<span style="color:' + _col + '">' + _arr + " " + (_d > 0 ? "+" : "") + _d + "</span>", "%", null, "近" + _k + "次 vs 更早");
    } else {
      _c3 = statCard("近期趨勢", "—", "", null, "資料累積中");
    }

    var series;
    if (growthMode === "overall") series = [{ name: "總分", color: SUBJ_COLORS.MIX, points: g.overall }];
    else series = Object.keys(g.subjects).map(function (code) {
      return { name: Content.subjectName(code) || (code === "MIX" ? "綜合" : code), color: SUBJ_COLORS[code] || "#888", points: g.subjects[code] };
    }).filter(function (s) { return s.points.length; });

    var history = Store.attempts().slice().reverse().slice(0, 12).map(function (a) {
      var d = new Date(a.finishedAt);
      return '<div class="weak-row"><div class="weak-info"><div class="weak-name">' + esc(a.subjectName || a.modeName) + '　<span style="color:var(--text-mute);font-weight:600;font-size:12px">' + esc(a.modeName) + '</span></div>' +
        '<div class="weak-meta">' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' · ' + a.correct + '/' + a.total + ' 題</div></div>' +
        '<div class="weak-pct" style="color:' + Charts.color(a.score) + '">' + a.score + '</div></div>';
    }).join("");

    main.innerHTML = pageHead("成長曲線", "你的進步軌跡") +
      '<div class="grid grid-3">' +
        _c1 + _c2 + _c3 +
      '</div>' +
      '<div class="section-title">分數趨勢　<span class="chip-row" style="display:inline-flex;margin-left:6px">' +
        '<button class="chip ' + (growthMode === "overall" ? "on" : "") + '" data-gm="overall">總分</button>' +
        '<button class="chip ' + (growthMode === "subject" ? "on" : "") + '" data-gm="subject">分科</button></span></div>' +
      '<div class="card card-pad">' + Charts.line(series) + '</div>' +
      '<div class="section-title">最近測驗紀錄</div><div class="card card-pad">' + history + '</div>';

    $$("[data-gm]").forEach(function (b) { b.onclick = function () { growthMode = b.getAttribute("data-gm"); VIEWS.growth(); }; });
  };

  /* ---- AI 出題 ---- */
  var genState = { subject: "S1", chapter: "", count: 5, difficulty: "中等", preview: null, busy: false };
  function presetGenerate(subj, chap) { genState.subject = subj; genState.chapter = chap || ""; VIEWS.generate(); }
  VIEWS.generate = function () {
    var subjOpts = Content.subjects().map(function (s) { return '<option value="' + s.code + '"' + (genState.subject === s.code ? " selected" : "") + '>' + esc(s.name) + '</option>'; }).join("");
    var chapOpts = '<option value="">整科綜合</option>' + Content.chapters(genState.subject).map(function (c) { return '<option value="' + c.id + '"' + (genState.chapter === c.id ? " selected" : "") + '>' + esc(c.title) + '</option>'; }).join("");
    var aiN = Store.aiQuestions().length;
    var configured = !!Store.ai().key;

    var preview = "";
    if (genState.preview && genState.preview.length) {
      preview = '<div class="gen-preview"><div class="section-title">預覽（' + genState.preview.length + ' 題）</div>' +
        genState.preview.map(function (q, i) {
          return '<div class="card card-pad" style="margin-bottom:10px"><div class="q-stem" style="font-size:15px">' + (i + 1) + '. ' + esc(q.stem) + '</div>' +
            '<div class="options">' + ["A", "B", "C", "D"].map(function (k) {
              return '<div class="option ' + (k === q.answer ? "correct" : "") + '" style="cursor:default"><span class="opt-key">' + k + '</span><span>' + esc(q.options[k]) + '</span></div>';
            }).join("") + '</div>' +
            '<div class="explain"><div class="ex-head">' + Icon.get("bulb") + ' 解析 <span class="ex-ans">正解：' + q.answer + '</span></div>' + esc(q.explanation) + '</div></div>';
        }).join("") +
        '<div class="quiz-foot"><button class="btn btn-ghost" id="genDiscard">捨棄</button>' +
        '<div style="display:flex;gap:10px"><button class="btn btn-ghost" id="genSave">存入題庫</button>' +
        '<button class="btn btn-primary" id="genStart">存入並開始測驗 →</button></div></div></div>';
    }

    main.innerHTML = pageHead("AI 出題", "依歷屆考點與官方知識，生成全新題目與解析") +
      (configured ? "" : '<div class="callout warn"><span class="co-ico">' + Icon.get("gear") + '</span><div>尚未設定 AI 模型。請在左側「AI 模型設定」填入供應商與 API 金鑰（支援 MiniMax 國際版等多種模型）。</div></div>') +
      '<div class="card card-pad gen-form">' +
        '<div class="field"><span class="field-label">科目</span><select id="genSubj">' + subjOpts + '</select></div>' +
        '<div class="field"><span class="field-label">主題（章節）</span><select id="genChap">' + chapOpts + '</select></div>' +
        '<div class="field"><span class="field-label">題數</span>' + genCountChips() + '</div>' +
        '<div class="field"><span class="field-label">難度</span><div class="chip-row">' +
          ["基礎", "中等", "進階"].map(function (d) { return '<button class="chip ' + (genState.difficulty === d ? "on" : "") + '" data-diff="' + d + '">' + d + '</button>'; }).join("") + '</div></div>' +
        '<button class="btn btn-primary" id="genRun" ' + (genState.busy ? "disabled" : "") + '>' + (genState.busy ? '<span class="spin"></span> 生成中…' : Icon.get("sparkle") + '生成題目') + '</button>' +
        '<div class="ai-status" id="genStatus" style="margin-top:8px"></div>' +
      '</div>' +
      preview +
      (aiN ? ('<div class="section-title">我的 AI 題庫 <span class="tag">' + aiN + ' 題</span></div>' +
        '<div class="card card-pad"><button class="btn btn-primary btn-sm" id="genPractice">' + Icon.get("pencil") + '練習全部 AI 題</button> ' +
        '<button class="btn btn-danger-ghost btn-sm" id="genClearAi">清空 AI 題庫</button></div>') : "");

    $("#genSubj").onchange = function () { genState.subject = $("#genSubj").value; genState.chapter = ""; VIEWS.generate(); };
    $("#genChap").onchange = function () { genState.chapter = $("#genChap").value; };
    $$("[data-gcount]").forEach(function (c) { c.onclick = function () { genState.count = +c.getAttribute("data-gcount"); VIEWS.generate(); }; });
    $$("[data-diff]").forEach(function (c) { c.onclick = function () { genState.difficulty = c.getAttribute("data-diff"); VIEWS.generate(); }; });
    $("#genRun").onclick = runGenerate;
    if ($("#genDiscard")) $("#genDiscard").onclick = function () { genState.preview = null; VIEWS.generate(); };
    if ($("#genSave")) $("#genSave").onclick = function () { saveGenerated(); VIEWS.generate(); toast("已存入題庫", "ok"); };
    if ($("#genStart")) $("#genStart").onclick = function () { var qs = saveGenerated(); startQuiz({ mode: "ai", questions: qs, subjectName: "AI 生成測驗" }); };
    if ($("#genPractice")) $("#genPractice").onclick = function () { startQuiz({ mode: "ai", subjectName: "AI 題庫練習" }); };
    if ($("#genClearAi")) $("#genClearAi").onclick = function () { confirmDlg("清空 AI 題庫？", "將刪除此使用者所有 AI 生成的題目。", function () { Store.aiQuestions().forEach(function (q) { Store.removeAiQuestion(q.id); }); VIEWS.generate(); toast("已清空", "ok"); }, "清空"); };
  };
  function genCountChips() {
    return '<div class="chip-row">' + [3, 5, 8, 10].map(function (n) { return '<button class="chip ' + (genState.count === n ? "on" : "") + '" data-gcount="' + n + '">' + n + ' 題</button>'; }).join("") + '</div>';
  }
  function buildKnowledge(chapterId, subjectCode) {
    if (chapterId) {
      var ch = Content.chapter(chapterId);
      if (!ch) return "";
      var parts = [ch.summary || ""];
      if (ch.keyPoints && ch.keyPoints.length) parts.push("重點：" + ch.keyPoints.join("；"));
      if (ch.concepts && ch.concepts.length) parts.push("名詞：" + ch.concepts.map(function (c) { return c.term + "＝" + c.definition; }).join("；"));
      return parts.join("\n");
    }
    // 整科：抓每章 summary + 前兩重點
    return Content.chapters(subjectCode).map(function (ch) {
      return "【" + ch.title + "】" + (ch.summary || "") + (ch.keyPoints ? "（" + ch.keyPoints.slice(0, 2).join("；") + "）" : "");
    }).join("\n");
  }
  function runGenerate() {
    if (!Store.ai().key) { toast("請先在左側設定 AI 金鑰", "err"); return; }
    genState.busy = true; VIEWS.generate();
    var st = $("#genStatus"); if (st) { st.textContent = "AI 命題中，請稍候…"; st.className = "ai-status load"; }
    var subj = Content.subject(genState.subject);
    var knowledge = buildKnowledge(genState.chapter, genState.subject);
    var samples = Content.questions({ subject: genState.subject, topic: genState.chapter || null }).slice(0, 6);
    Ai.generateQuestions({
      subjectCode: genState.subject, subjectName: subj ? subj.name : genState.subject,
      chapterId: genState.chapter, chapterTitle: genState.chapter ? Content.chapterTitle(genState.chapter) : "",
      knowledge: knowledge, samples: samples, count: genState.count, difficulty: genState.difficulty
    }).then(function (qs) {
      genState.busy = false;
      if (!qs.length) { genState.preview = null; VIEWS.generate(); toast("AI 未回傳有效題目，請重試", "err"); return; }
      genState.preview = qs; VIEWS.generate(); toast("已生成 " + qs.length + " 題", "ok");
    }).catch(function (e) {
      genState.busy = false; genState.preview = null; VIEWS.generate();
      var s = $("#genStatus"); if (s) { s.textContent = "生成失敗：" + e.message; s.className = "ai-status err"; }
    });
  }
  function saveGenerated() {
    var qs = genState.preview || []; if (qs.length) Store.addAiQuestions(qs);
    genState.preview = null; return qs;
  }

  /* ---- 共用空狀態 ---- */
  function emptyBox(title, sub, btn, r) {
    return '<div class="empty"><div class="e-ico">' + Icon.get("chart", "ic-xl") + '</div><div class="e-title">' + esc(title) + '</div>' +
      '<div class="e-sub">' + esc(sub) + '</div><br><button class="btn btn-primary" data-goto="' + r + '">' + esc(btn) + '</button></div>';
  }
  function bindEmpty() { $$("[data-goto]").forEach(function (b) { b.onclick = function () { go(b.getAttribute("data-goto")); }; }); }

  /* ---------- 啟動 ---------- */
  global.App = { go: go, confirm: confirmDlg, toast: toast };
  paintUser();
  go("dashboard");

  // 題庫載入完成後，若正在儀表板（且不在測驗中）刷新數字
  document.addEventListener("bank-ready", function () { if (route === "dashboard" && !inRunner) render(); });
  // 首屏後閒置時預先載入擴充題庫，讓開始測驗時已就緒（不阻塞首屏）
  (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(function () { Content.ensureBank(); });

})(window);

/* ============================================================
   interactions.js — GSAP / Lottie / hover 互動動畫
   全部檢查函式庫是否存在並尊重 prefers-reduced-motion。
   ============================================================ */
(function (global) {
  "use strict";
  var reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var lite = reduce || !!global.LITE;   // 精簡模式：關閉游標聚光/磁吸
  function gsapReady() { return !!global.gsap; }

  /* ---------- Lottie 面板動畫（含 SVG 退路） ---------- */
  var _lottie = null;
  function fallbackSVG(el) {
    el.innerHTML =
      '<svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g fill="none" stroke="var(--primary)" stroke-width="6">' +
      '<circle class="sonar s1" cx="100" cy="100" r="55"/>' +
      '<circle class="sonar s2" cx="100" cy="100" r="55" stroke="var(--accent)"/>' +
      '</g><circle class="sonar-dot" cx="100" cy="100" r="16" fill="var(--primary)"/></svg>';
  }
  function mountQuizAnim() {
    var el = document.getElementById("quizAnim");
    if (!el) return;
    if (_lottie && _lottie.destroy) { try { _lottie.destroy(); } catch (e) {} _lottie = null; }
    if (reduce || !global.lottie) { fallbackSVG(el); return; }
    try {
      _lottie = global.lottie.loadAnimation({
        container: el, renderer: "svg", loop: true, autoplay: true,
        path: "assets/lottie/target.json?v=4"
      });
      _lottie.addEventListener("data_failed", function () { fallbackSVG(el); });
    } catch (e) { fallbackSVG(el); }
  }

  /* ---------- 磁吸 CTA ---------- */
  function attachMagnetic(btn) {
    if (btn._mag || !gsapReady() || lite) return; btn._mag = 1;
    var xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
    var yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
    btn.addEventListener("pointermove", function (e) {
      var r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    btn.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
  }

  /* ---------- 模式卡 3D 傾斜 ---------- */
  function attachTilt(card) {
    if (card._tilt || !gsapReady() || reduce) return; card._tilt = 1;
    gsap.set(card, { transformPerspective: 700, transformStyle: "preserve-3d" });
    var rxTo = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
    var ryTo = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      ryTo(px * 10); rxTo(-py * 10);
    });
    card.addEventListener("pointerleave", function () { rxTo(0); ryTo(0); });
  }

  /* ---------- 過關彩帶 ---------- */
  function confetti() {
    if (reduce || !gsapReady()) return;
    var colors = ["#5b5bd6", "#00b3a4", "#e8a33d", "#e5566b", "#30a46c"];
    var wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:150;overflow:hidden";
    document.body.appendChild(wrap);
    var N = 90;
    for (var i = 0; i < N; i++) {
      var p = document.createElement("div");
      var sz = 6 + (i % 4) * 2;
      p.style.cssText = "position:absolute;top:-12px;left:" + (10 + (i / N) * 80) + "%;width:" + sz + "px;height:" + (sz * 0.6) + "px;background:" + colors[i % colors.length] + ";border-radius:2px;opacity:1";
      wrap.appendChild(p);
      gsap.to(p, {
        y: (global.innerHeight || 800) + 40,
        x: (i % 2 ? 1 : -1) * (40 + (i % 7) * 20),
        rotation: (i % 2 ? 1 : -1) * (180 + (i % 5) * 120),
        opacity: 0, duration: 1.6 + (i % 6) * 0.25, ease: "power1.in",
        delay: (i % 10) * 0.04
      });
    }
    gsap.delayedCall(3.2, function () { wrap.remove(); });
  }

  /* ---------- 按鈕漣漪 ---------- */
  function ripple(e) {
    var btn = e.target.closest && e.target.closest(".btn");
    if (!btn || reduce) return;
    var r = btn.getBoundingClientRect();
    var span = document.createElement("span");
    var d = Math.max(r.width, r.height);
    span.className = "ripple";
    span.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
    btn.appendChild(span);
    setTimeout(function () { span.remove(); }, 600);
  }

  /* ---------- 觀察主內容，為新元素掛載互動 ---------- */
  /* ---------- hover：SVG 圖示逐筆描繪組成 ---------- */
  function drawIcon(svg) {
    if (!svg) return;
    var els = svg.querySelectorAll("path,circle,rect,line,polyline,polygon,ellipse");
    els.forEach(function (el, i) {
      var len; try { len = el.getTotalLength() || 40; } catch (e) { len = 40; }
      el.style.transition = "none";
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      void el.getBoundingClientRect();               // 強制重繪
      el.style.transition = "stroke-dashoffset .55s cubic-bezier(.4,0,.2,1) " + (i * 0.07).toFixed(2) + "s";
      el.style.strokeDashoffset = "0";
    });
  }
  function attachIconDraw(card) {
    if (card._icodraw) return; card._icodraw = 1;
    card.addEventListener("pointerenter", function () {
      if (reduce) return;
      drawIcon(card.querySelector(".mc-ico .ic"));
    });
  }

  function enhance(root) {
    root.querySelectorAll(".btn-primary").forEach(attachMagnetic);
    root.querySelectorAll(".mode-card").forEach(attachIconDraw);
    // 游標聚光：為卡片加上 .spotlight
    root.querySelectorAll(".card,.stat,.subject-card,.mode-card,.quiz-side,.chapter").forEach(function (el) { el.classList.add("spotlight"); });
    // 過關彩帶：偵測結算頁「表現優異」
    var v = root.querySelector(".result-verdict");
    if (v && !v._done && /優異/.test(v.textContent)) { v._done = 1; confetti(); }
  }
  // 游標聚光：跟隨滑鼠更新光暈位置
  function spotlightMove(e) {
    if (lite) return;
    var el = e.target.closest && e.target.closest(".spotlight");
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
  }
  function init() {
    var mainEl = document.getElementById("mainView");
    if (!mainEl) return;
    document.addEventListener("click", ripple, true);
    if (!lite) document.addEventListener("pointermove", spotlightMove, { passive: true });
    enhance(mainEl);
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; enhance(mainEl); });
    }).observe(mainEl, { childList: true, subtree: true });
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  global.Interactions = { mountQuizAnim: mountQuizAnim, confetti: confetti };
})(window);

/* ===== 圖片停留動畫：hover 播放 Higgsfield 生成影片（委派，重繪安全） ===== */
(function (global) {
  "use strict";
  if (global.LITE) return;
  try {
    if (!matchMedia("(hover:hover)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch (e) { return; }
  var active = null;
  function stop() {
    if (!active) return;
    active.querySelectorAll(".hover-vid").forEach(function (v) { v.pause(); v.classList.remove("on"); });
    active = null;
  }
  document.addEventListener("mouseover", function (e) {
    var box = e.target.closest ? e.target.closest(".hover-media") : null;
    if (box === active) return;
    stop();
    if (!box) return;
    active = box;
    var dark = document.body.getAttribute("data-theme") === "dark";
    var v = box.querySelector(dark ? ".vid-dark" : ".vid-light");
    if (!v) return;
    if (!v.getAttribute("src")) v.setAttribute("src", v.getAttribute("data-src"));
    v.currentTime = 0;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    v.classList.add("on");
  }, { passive: true });
})(window);

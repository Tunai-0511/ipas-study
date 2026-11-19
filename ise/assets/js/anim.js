/* ============================================================
   anim.js — 動效增強（數字跳動 + 進場，純疊加、不改既有模組）
   透過 MutationObserver 監看主內容切換，對新元素做一次性動畫。
   尊重 prefers-reduced-motion。
   ============================================================ */
(function (global) {
  "use strict";
  var reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* 數字由 0 跳動到目標值 */
  function countUp(el) {
    var node = el.firstChild;                 // 數字文字節點（其後為單位 span）
    if (!node || node.nodeType !== 3) return;
    var raw = String(node.textContent).trim();
    if (!/^\d[\d,]*$/.test(raw)) return;      // 只處理純數字，避免破壞 "+12"、"5:03" 等
    var target = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(target)) return;
    if (reduce || target <= 0) { return; }
    var dur = target > 200 ? 900 : 650, start = null;
    function fmt(v) { return Math.round(v).toLocaleString(); }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var ease = 1 - Math.pow(1 - p, 3);      // easeOutCubic
      node.textContent = fmt(target * ease);
      if (p < 1) requestAnimationFrame(step); else node.textContent = target.toLocaleString();
    }
    node.textContent = "0";
    requestAnimationFrame(step);
  }

  function enhance(root) {
    if (!root) return;
    var vals = root.querySelectorAll(".stat-value:not([data-anim]), .weak-pct:not([data-anim])");
    for (var i = 0; i < vals.length; i++) { vals[i].setAttribute("data-anim", "1"); countUp(vals[i]); }
  }

  function init() {
    var mainEl = document.getElementById("mainView");
    if (!mainEl) return;
    enhance(mainEl);
    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; enhance(mainEl); });
    });
    mo.observe(mainEl, { childList: true, subtree: true });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})(window);

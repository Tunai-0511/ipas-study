/* ============================================================
   icons.js — 線性 SVG 圖示（currentColor，取代 emoji）
   用法：Icon.get("dashboard")；或 HTML 放 <i data-ico="dashboard"></i> 後 Icon.hydrate()
   ============================================================ */
(function (global) {
  "use strict";
  var P = {
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    book: '<path d="M4 19.5V6A2.5 2.5 0 0 1 6.5 3.5H20v14H6.5A2.5 2.5 0 0 0 4 20"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-4.5"/>',
    bookOpen: '<path d="M12 7v13"/><path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H9a3 3 0 0 1 3 3 3 3 0 0 1 3-3h4.5A1.5 1.5 0 0 1 21 5.5V18a1 1 0 0 1-1 1h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4a1 1 0 0 1-1-1z"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4-4"/>',
    trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    sparkle: '<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/><path d="M19 4v3"/><path d="M20.5 5.5h-3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    loop: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    save: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><path d="M12 15V3"/>',
    moon: '<path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14a5 5 0 1 1 7 0c-.7.7-1.2 1.4-1.4 2.3H9.9c-.2-.9-.7-1.6-1.4-2.3z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V4"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-5"/>',
    chart: '<path d="M6 20v-5"/><path d="M12 20V8"/><path d="M18 20v-9"/><path d="M3 20h18"/>',
    folder: '<path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H5a2 2 0 0 0 2 4"/><path d="M17 6h2a2 2 0 0 1-2 4"/><path d="M12 14v3"/><path d="M8 21h8"/><path d="M10 21c0-1.5.7-2.5 2-3 1.3.5 2 1.5 2 3"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    drop: '<path d="M12 2.7s6 6.3 6 10.3a6 6 0 0 1-12 0c0-4 6-10.3 6-10.3z"/><path d="M9 13.5a3 3 0 0 0 3 3"/>'
  };
  function svg(name, cls) {
    var inner = P[name] || P.sparkle;
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  function hydrate(root) {
    (root || document).querySelectorAll("[data-ico]").forEach(function (el) {
      var n = el.getAttribute("data-ico");
      if (P[n]) el.innerHTML = svg(n);
    });
  }
  global.Icon = { get: svg, has: function (n) { return !!P[n]; }, hydrate: hydrate };
  if (document.readyState !== "loading") hydrate();
  else document.addEventListener("DOMContentLoaded", function () { hydrate(); });
})(window);

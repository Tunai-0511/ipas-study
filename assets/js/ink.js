/* ============================================================
   ink.js — 墨流し（游標墨水流動背景）
   深色主題白墨、淺色主題米色墨。
   curl-noise 流場 + 墨滴暈染(bloom) + 閒置自動暫停，效能友善。
   對外 API：window.Ink.toggle()/set(on)/isOn()/supported（開關記憶於 localStorage）。
   ============================================================ */
(function (global) {
  "use strict";
  var canvas = document.getElementById("inkCanvas");
  var reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // 精簡模式/減少動態/無 canvas：提供停用版 API，讓開關鈕仍可存在但不啟用
  if (!canvas || reduce || global.LITE) {
    global.Ink = { supported: false, isOn: function () { return false; }, set: function () {}, toggle: function () { return false; } };
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true });
  var PREF_KEY = "aipsc_ink";
  var enabled = true;
  try { enabled = localStorage.getItem(PREF_KEY) !== "off"; } catch (e) {}

  var W = 0, H = 0, DPR = Math.min(2, global.devicePixelRatio || 1);
  function resize() {
    W = Math.floor(global.innerWidth); H = Math.floor(global.innerHeight);
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  global.addEventListener("resize", resize, { passive: true });

  /* 預先繪製柔邊墨點 sprite（依主題快取）*/
  var sprites = {};
  function sprite() {
    var dark = document.body.getAttribute("data-theme") === "dark";
    var key = dark ? "d" : "l";
    if (sprites[key]) return sprites[key];
    var s = document.createElement("canvas"); s.width = s.height = 64;
    var c = s.getContext("2d");
    // 深色→白墨；淺色→品牌紫墨 #5b5bd6
    var col = dark ? "255,255,255" : "91,91,214";
    var peak = dark ? 0.95 : 0.66;
    var g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(" + col + "," + peak + ")");
    g.addColorStop(0.4, "rgba(" + col + "," + (peak * 0.34) + ")");
    g.addColorStop(1, "rgba(" + col + ",0)");
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
    sprites[key] = s; return s;
  }

  var parts = [], lastX = 0, lastY = 0, lastMove = 0, running = false, t = 0, MAX = 220;

  /* curl-noise 流場：取勢函數的旋度 → 無散度、像流體般旋轉盤繞 */
  function potential(x, y) {
    return Math.sin(x * 0.0055 + t * 0.6) +
           Math.cos(y * 0.0060 - t * 0.5) +
           0.6 * Math.sin((x + y) * 0.0035 + t * 0.9);
  }
  function curl(x, y, out) {
    var e = 1.6;
    out.x = (potential(x, y + e) - potential(x, y - e)) / (2 * e);
    out.y = -(potential(x + e, y) - potential(x - e, y)) / (2 * e);
  }

  function spawn(x, y, dx, dy, sp) {
    var n = 1 + Math.min(4, sp / 9 | 0);
    for (var i = 0; i < n && parts.length < MAX; i++) {
      var ang = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
      var speed = sp * 0.14 + Math.random() * 1.2;
      var bloom = Math.random() < 0.22;   // 少量大而慢的墨滴，做暈染
      parts.push({
        x: x + (Math.random() - 0.5) * 12, y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(ang) * speed * (bloom ? 0.25 : 0.55) + dx * 0.08,
        vy: Math.sin(ang) * speed * (bloom ? 0.25 : 0.55) + dy * 0.08,
        r: (bloom ? 20 + sp * 0.6 : 9 + sp * 0.4) + Math.random() * 12,
        grow: bloom ? 1.016 : 1.008,
        life: 1, decay: (bloom ? 0.006 : 0.010) + Math.random() * 0.006,
        seed: Math.random() * 6.28
      });
    }
  }

  function onMove(e) {
    if (!enabled) return;
    var x = e.clientX, y = e.clientY;
    var dx = x - lastX, dy = y - lastY;
    var sp = Math.min(75, Math.hypot(dx, dy));
    lastX = x; lastY = y; lastMove = performance.now();
    if (sp > 0.6) spawn(x, y, dx, dy, sp);
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  var fv = { x: 0, y: 0 };
  function loop() {
    t += 0.01;
    // 逐格淡出（destination-out 只擦除舊墨、保持透明背景）
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0,0,0,0.045)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    var sp = sprite();
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      curl(p.x, p.y, fv);                       // 流體旋度擾動
      p.vx += fv.x * 0.9 + Math.sin(p.seed + t * 2) * 0.02;
      p.vy += fv.y * 0.9 + 0.012;               // 極輕微下沉，墨會「垂流」
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.94; p.vy *= 0.94;               // 黏滯
      p.r *= p.grow; p.life -= p.decay;         // 暈開＋淡出
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, p.life * p.life * 0.15);
      ctx.drawImage(sp, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    ctx.globalAlpha = 1;
    if (parts.length === 0 && performance.now() - lastMove > 500) {
      running = false; ctx.clearRect(0, 0, W, H); return;
    }
    requestAnimationFrame(loop);
  }

  global.addEventListener("pointermove", onMove, { passive: true });

  global.Ink = {
    supported: true,
    isOn: function () { return enabled; },
    set: function (on) {
      enabled = !!on;
      try { localStorage.setItem(PREF_KEY, enabled ? "on" : "off"); } catch (e) {}
      if (!enabled) { parts.length = 0; ctx.clearRect(0, 0, W, H); running = false; }
    },
    toggle: function () { this.set(!enabled); return enabled; }
  };
})(window);

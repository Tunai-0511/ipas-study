/* ============================================================
   service-worker.js — 離線可用 App Shell
   策略：導覽用 network-first（離線退回 index.html）；
   同源靜態資源用 stale-while-revalidate（含 bank.js/media 首次使用才快取）；
   AI／代理請求一律走網路、不快取。版本改變時清舊快取。
   ============================================================ */
var CACHE = "aipsc-v37";
var CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/media/icon-192.png",
  "assets/media/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () {});   // 個別失敗不阻擋安裝
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                 // 跨源（含 AI API）走網路
  if (url.pathname.indexOf("/.netlify/functions/") >= 0) return;   // AI 代理不快取

  // 導覽：network-first，離線退回快取的 index.html
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(function () {
        return caches.match("index.html").then(function (r) { return r || caches.match("./"); });
      })
    );
    return;
  }

  // 靜態資源：stale-while-revalidate
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (cached) {
        var net = fetch(req).then(function (res) {
          if (res && res.status === 200) c.put(req, res.clone());
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      });
    })
  );
});

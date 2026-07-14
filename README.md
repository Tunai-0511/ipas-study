<p align="center">
  <img src="assets/mascot.png" width="240" alt="備考學院吉祥物 DataWise Buddy（阿智）" />
</p>

<h1 align="center">iPAS 備考學院</h1>

<p align="center">
  <b>一站搞定 iPAS 三張證照的備考</b><br/>
  AI 應用規劃師（初級・中級）× 營運智慧分析師 BI（初級）<br/>
  <i>Practice smarter. Pass faster.</i>
</p>

<p align="center">
  <a href="https://ipas.tun9i.com"><img src="https://img.shields.io/badge/線上試用-ipas.tun9i.com-5b5bd6?style=for-the-badge" alt="Live Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PWA-可離線-5b5bd6" />
  <img src="https://img.shields.io/badge/前端-Vanilla%20JS-f7df1e" />
  <img src="https://img.shields.io/badge/部署-Cloudflare%20Pages-f38020" />
  <img src="https://img.shields.io/badge/同步-Supabase-3ecf8e" />
  <img src="https://img.shields.io/badge/相依套件-0-brightgreen" />
</p>

---

## 這是什麼？

**iPAS 備考學院**是一個為台灣 iPAS 產業人才能力鑑定打造的線上刷題平台。把散落各處的官方歷屆題與網路題庫，整理成一個**乾淨、快速、能離線用、跨裝置同步**的練習系統——而且**零廣告、零安裝、開網頁就能用**。

一套程式碼、三張證照，開箱即用：

| 認證 | 級別 | 路徑 |
|---|---|---|
| AI 應用規劃師 | 初級 | [`/junior`](https://ipas.tun9i.com/junior/) |
| AI 應用規劃師 | 中級 | [`/intermediate`](https://ipas.tun9i.com/intermediate/) |
| 營運智慧分析師（BI） | 初級 | [`/bi`](https://ipas.tun9i.com/bi/) |

---

## ✨ 特色

- 📚 **官方＋網路雙題庫** — 官方歷屆題與網路蒐集題**嚴格分桶**：模擬考可只考官方歷屆，平時練習可全都來。每題標示出處。
- 📝 **多種練習模式** — 題庫練習（作答即看解析）、**模擬考**（比照官方 50 題 / 75 分鐘）、錯題複習、收藏複習。
- 🧠 **每題內建解析** — 不需要自己再去查，答完立刻懂。
- 📊 **成績判讀** — 各科正確率、最需加強的主題、個人化加強建議。
- 📈 **成長曲線** — 題目加權的平均正確率、累積作答量、近期趨勢（不被單場難度誤導）。
- 🔌 **PWA 離線可用** — 加到主畫面像 App 一樣用，沒網路也能刷題。
- ☁️ **跨裝置雲端同步** — 登入後手機、電腦進度自動同步（Supabase）。
- 🌗 **深淺色主題** — 全站主題感應，跨認證同步。
- 🛡️ **隱私友善** — 無 cookie 追蹤、無第三方廣告。
- 📊 **管理後台** — 內建 `/admin` 使用統計儀表板（總人數、各認證、每日活躍、個別學習者下鑽）。

---

## 🛠️ 技術棧

刻意走**極簡、零建置、零框架**路線，載入快、好維護：

- **前端**：Vanilla JS SPA（hash 路由）+ 手寫 CSS 設計系統，**無框架、無打包工具、無 npm 相依**
- **PWA**：Service Worker（App Shell 預快取、導覽逾時退快取、靜態 stale-while-revalidate）
- **動畫**：GSAP + Lottie（在地化，離線可用）
- **雲端**：Supabase（Auth + Postgres，跨裝置同步、RLS 保護）
- **部署**：Cloudflare Pages，push 到 `main` 自動上線
- **總下載量**：約 550 KB / 站，CDN 秒開

---

## 🏗️ 架構一覽

```
GitHub (main)  ──push──▶  Cloudflare Pages  ──▶  ipas.tun9i.com
                                                     │
                     ┌───────────────┬───────────────┼───────────────┐
                  Portal          junior        intermediate         bi
                （入口）      （AI 初級）      （AI 中級）      （BI 初級）
                     └───────────────┴───────────────┴───────────────┘
                                 每個 app = 同構 PWA SPA
   殼：index.html / style.css / service-worker.js
   執行層：app.js（路由）· quiz.js · analysis.js · charts.js
   資料層：content-api.js  ──▶  content.js（官方題）＋ bank.js（網路題）
   儲存：store.js → localStorage  │  cloud.js → Supabase（背景同步）
```

**資料分離原則**：官方歷屆題放 `content.js`（無 `generated` 標記）；網路蒐集題放 `bank.js`（自動標 `generated:true` 並附出處）。兩者永不混用，讓「只考官方歷屆」成為可靠選項。

---

## 🚀 本機開發

純靜態站，不需建置。任何靜態伺服器即可：

```bash
# 用 Python
python -m http.server 8000
# 或 Node
npx serve .
```

然後開 `http://localhost:8000/junior/`。改完 push 到 `main`，Cloudflare Pages 自動部署。

> PWA 換版特性：改動 JS/CSS 需 bump `?v=` 與 service worker 的 `CACHE` 版本；純 `index.html` 改動免 bump。

---

## 📊 管理後台

`/admin` 是獨立的使用統計後台（僅管理者 Email 登入可見）：總使用者、近 7/30 天活躍、各認證人數與累積作答、每日活躍走勢，並可**點入個別學習者**檢視其每一次測驗紀錄。資料經 Supabase `security definer` 函式聚合，只回傳統計、不外洩個資。

---

## 🗺️ Roadmap

- [ ] 營運智慧分析師（BI）官方歷屆題：待 **115/10/31 首考**公告後補入
- [ ] 更多網路題庫來源與去重
- [ ] 練習頁層級的事件統計

---

## 📄 授權與聲明

本專案程式碼為個人作品。**題庫內容之著作權另屬原出處**（iPAS 官方公告試題／各網路來源），僅供學習研究使用，請勿作商業用途。

<p align="center"><sub>Made with ☕ &amp; Vanilla JS · <a href="https://ipas.tun9i.com">ipas.tun9i.com</a></sub></p>

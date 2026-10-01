# All Subject Practice Implementation Plan

> **For agentic workers:** Use the existing parallel content agents and root integration workflow. Preserve file ownership and complete the whole objective.

**Goal:** 25鑑定、100考科均能逐題刷題並有圖片。
**Architecture:** 分片題庫＋共用圖文刷題引擎，保留原卷閱讀與既有四站；雲端沿用catalog命名空間。
**Tech Stack:** Vanilla JS、靜態JSON／SVG／WebP、PyMuPDF、Supabase、Cloudflare Workers。
**Spec:** docs/superpowers/specs/2026-10-01-all-subject-practice.md

## Global Constraints
- 原題ID、原PDF、既有進度及登入限制保持相容。
- 官方、自編、歷史與術科準備分別明示；不猜答案、不截斷圖題與共用情境。
- 全100科有非空題庫；每個鑑定有可見且可讀的相關圖片。

## Review Focus
- 原卷答案欄、跨頁和題組上下文：逐版式圖文抽查＋裁切範圍檢查。
- 部分題型重編與多個可接受答案：真實fixture判分。
- 重新整理或換帳號：草稿、收藏、錯題隔離與補同步。
- 題庫載入失敗、無錯題／收藏、快速切換考科：不可混用舊題或顯示假完成。
- 手機圖片放大和長選項：375px渲染與操作驗證。

## Tasks
- [x] 官方拆題：extract-practice-questions.py、practice-official.json、official題圖與來源稽核；證明6852候選題處理狀態。
- [x] 工業補充題：13個缺題／術科考科，每科至少12題，圖解與來源驗證。
- [x] 專業／歷史補充題：28考科，每科至少10題，圖解與來源驗證。
- [x] 整合既有AIoT、BI與舊物聯網；補充BI圖表題；build-practice-bank.mjs產生各鑑定分片與全100科覆蓋索引。
- [x] practice-model.js：科目篩選、隨機抽樣、單複選及替代答案判分、錯題／收藏與進度恢復；回歸測試。
- [x] practice.js／CSS／catalog入口：完整逐題流程、答案後顯示、圖放大、來源、結果與複習；本機真實UI驗證。
- [x] 資料及權限審查、全測試、建置、部署與正式站核對，完成條件逐項稽核；201項測試通過，正式站7,679個變更資產SHA-256全數一致，詳見發布紀錄。

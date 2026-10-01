# AIoT 視覺素材

## 裝飾封面

- 檔案：`media/cert-aiot-v1.png`
- 用途：首頁認證卡、AIoT 首頁與科目卡的裝飾封面；不是考試題目或技術接線圖。
- 製作：2026-10-01，使用內建 image_gen 工具，原始輸出保留於 Codex generated_images，專案內保存一份完整 PNG。
- 圖題的精確架構與數值另以自製向量圖繪製、輸出 PNG，存於 `aiot/assets/questions/`。

生成提示：

> Use case: stylized-concept. Asset type: website certification card cover, wide landscape 3:2. Create a polished miniature isometric AIoT laboratory diorama: a tiny teal sensor board in foreground, a white industrial robot arm, small edge-computing chip, and a floating cloud form linked by subtle cyan luminous data paths. Clean white and pale lavender studio background, tasteful indigo and teal palette matching a modern learning dashboard. Soft physically believable shadows and premium 3D clay/material rendering, centered compact arrangement that crops nicely to a wide cover. No text, letters, numbers, logos, watermark, people or pseudo-scientific labels. Decorative cover, not an exam diagram.

## 技術圖可編輯原檔

`docs/aiot-diagrams/` 保存六張 SVG；對應同名 PNG 位於 `aiot/assets/questions/`。修改後可用支援繁體中文字型的 SVG 光柵化工具輸出 1000 像素寬 PNG，並重新檢查箭頭方向、標示與手機可讀性。SVG 原檔不放入公開發布目錄。

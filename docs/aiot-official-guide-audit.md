# AIoT 科一官方學習指引練習題匯入與校核

核對日期：2026-10-01。資料檔：`aiot/data/official-guide.js`。本檔新增後，`aiot-sources.md` 先前所述「尚未收錄 80 題」是前一階段紀錄；官方原題收錄狀態以本次紀錄及實際載入檔案為準。

## 收錄結果

- 完整保留官方指引的 **80 題**：9 節題數為 **5、5、10、10、10、10、10、10、10**，並逐一對上 80 個官方 `Ans` 標記。
- **64 題可納入一般作答；16 題標記 `needsReview: true`**，保留為疑義原題檢視，不能納入計分、錯題率或模擬考。
- 這些是官方學習指引中的章節練習，**不是歷屆正式考題**，也不是官方公布的完整考試題庫。原書序文說明它只提供準備方向，不保證考試通過。
- 題幹、四選項、答案及解析保留官方內容；只整理 PDF 的排版斷行與抽取破字。待複核題的 `answer` 仍是原書答案，另以 `originalAnswer` 和 `reviewReason` 明確記錄，沒有冒用官方名義改答案。
- 80 題的題目與答案涉及 36 個 PDF 頁面。全部頁面均渲染核看，**沒有作答所必需的題圖**；頁面中的標題裝飾與 iPAS 浮水印不是題圖，故本次沒有新增圖片或以 AI 生成替代原圖。

## 來源與版本

1. [AIoT 官方學習資源](https://ipd.nat.gov.tw/ipas/certification/AIOT/learning-resources)。當日此頁所列科一下載即為本次檔案。
2. [科目一《AIoT 基礎概論》學習指引 PDF](https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf)，共 156 頁；[上架公告](https://ipd.nat.gov.tw/ipas/certification/AIOT/news/d5d0dcc933064895b8b0cb9d3cb7fc9c) 更新日期為 2026-05-28。
3. PDF SHA-256：`961d6b649e335ab757cb3fad02462355237574e52590d898d5765fb47bfcbd71`。
4. 本文及資料欄位所列頁碼一律是 **PDF 檔案頁序**，不是頁尾的章內頁碼。每題 `sourceUrl`／`srcUrl` 指向題目起始頁，`answerUrl` 指向答案起始頁；跨頁範圍另外保存在 `sourcePages`／`answerPages`。

## 公開資料授權查核

採用依據為經濟部產業發展署的[政府網站資料開放宣告](https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation)（頁面更新日期 2023-09-26，2026-10-01 再查核）。宣告允許公眾無償重製、改作、編輯及公開傳輸該署網站資料，須註明出處；機關標誌及其他智慧財產權不在範圍內，另經機關特別聲明須同意使用的作品亦須另處理，且不能暗示機關認可衍生服務。

適用範圍的查核與判斷如下：

- [iPAS 官網](https://ipd.nat.gov.tw/ipas/) 即時頁尾標示「版權所有 © 2026 經濟部產業發展署」，執行單位為工業技術研究院產業學院。
- [產發署 iPAS 網站搬遷公告](https://www.ida.gov.tw/ctlr?PRO=filepath.DownloadFile&f=project&id=675&t=f) 確認 `ipd.nat.gov.tw/ipas/` 是該署 iPAS 資訊發布平台。本次從該平台的學習資源頁取得 PDF，沒有以網路轉載站的宣稱作為授權依據。
- 指引序文說明由計畫委託委員會題庫組與規劃組等專家編寫，署名經濟部產業人才能力鑑定推動小組。核看的 PDF 未見對本次 80 題另加「須經同意方可使用」或禁止重製聲明。
- 本次據同機關版權署名、官方發布關係與上述開放宣告，將這批官方文字練習題作為可具名重製的署方網站資料處理。iPAS 頁面未另外列出獨立授權條款；此為對公告適用範圍的判斷，**不是聲稱已取得個別書面授權，也不是把整份指引、其參考書目或所有第三方圖像宣稱為公有領域或 CC 授權**。
- 每題 `source` 保留發布機關、iPAS、書名範圍與版本，並附官方 PDF 與授權公告連結；本站為學習整理服務，未受官方背書。官方 PDF 中的商標浮水印不抽出用作本站標誌。

## 格式整理與相容欄位

- 固定 ID：`aiot-guide-a1-tN-qNN`。科目固定 `A1`；`chapter` 與現有前端使用的 `topic` 同為 `a1-tN`。
- 沿用現有題目結構：`options` 為 `{ A, B, C, D }`，`answer` 為 A–D 字母，不是數字索引。分類為 `sourceKind: "official-guide"`，`session: "guide-115-a1"`；`generated` 與 `aiExplained` 均為 `false`。
- 只移除頁首頁尾、排版換行和中文兩端對齊造成的空格；保留完整跨頁選項及解析。逐項修整的英文破字包括 `P ropagation`、`Class ification`、`Lo w Energy`、`Piezoresista nce`、`Presen tation`、`serve r`、`On -premise`、`Client -Server`。
- 將 PDF 上標抽取為 `I2C`、`0oC` 的排版分別顯示為 `I²C`、`0°C`，不變更技術內容。
- 原書本身的字詞與錯誤沒有默默改寫，例如「運速度」、「在 100 在時」、中文同步與英文 Asynchronous 的衝突、相位題錯誤答案等。必要的辨識說明放在 `reviewReason`，與官方解析分開。
- 章節範圍與現有原創教材相同，但來源分類獨立，不得因放進統一題池就把原創題重新標成官方題。

## 疑義處置

先前盤點的 11 題全部保留為待複核；本次完整覆核另加 5 題，共 16 題。這是本站查核註記，**不是官方勘誤公告**。除下列題目外，其餘題目未發現同等程度的明確矛盾；不表示對所有敘述作無條件的技術正確性保證。

| 題目 ID 尾碼 | 原答案 | 類別 | 不納入計分的原因 |
| --- | --- | --- | --- |
| a1-t1-q04 | B | 原列 | 選項直接混入正誤判定與解析，無法正常四選一。 |
| a1-t3-q06 | D | 原列 | 題目是室內燈光控制，解析卻是掃地機器人。 |
| a1-t6-q09 | A | 原列 | MQTT QoS、排序、多對多、長連線及 Keep Alive 的敘述混淆，答案唯一性不明。 |
| a1-t7-q04 | B | 原列 | 「自己的金鑰」未交代公私鑰，且易混淆加密與簽章。 |
| a1-t7-q06 | B | 原列 | 將 Hash 稱為加密，未交代完整性驗證的信任條件。 |
| a1-t7-q10 | B | 原列 | TLS／PKI 題的解析只有「DoS 的定義」。 |
| a1-t8-q09 | B | 原列 | 一般金屬應變規受拉／受壓電阻變化的方向寫反。 |
| a1-t9-q03 | D | 原列 | 解析「同步（Asynchronous）」中英文相反。 |
| a1-t9-q05 | B | 原列 | 答案指 UART、解析指紅外線，而 UART 與 IrDA 都可雙向通訊。 |
| a1-t9-q07 | C | 原列 | 官方 C 是 135 度，解析的 90 度對應 B。 |
| a1-t9-q08 | C | 原列 | C 是依賴根節點的缺點，解析對應 A 的擴展性。 |
| a1-t4-q10 | C | 新增 | HTTP/1.1 可持續連線，不能說回應後必定斷線。 |
| a1-t5-q03 | B | 新增 | UDP 的 B 無連線不可靠與 C 封包大小有限制均成立。 |
| a1-t7-q02 | C | 新增 | 僅設定不同 SSID 不保證隔離，D 缺少 VLAN／隔離等條件。 |
| a1-t7-q07 | D | 新增 | 原解析把「DDoS 監控」等同「DDoS 攻擊」。 |
| a1-t8-q10 | A | 新增 | 題幹未區分壓電元件電荷與完整 IEPE 感測器電壓輸出。 |

補充查核的一手技術依據：

- [RFC 9112 §9.3 Persistence](https://www.rfc-editor.org/rfc/rfc9112.html#name-persistence)：HTTP/1.1 持續連線。
- [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html)：UDP 標頭與長度欄位、傳輸特性。
- [Cisco：多 SSID 的 VLAN 分段配置](https://www.cisco.com/c/en/us/support/docs/smb/routers/cisco-rv-series-small-business-routers/smb5652-configure-multiple-ssids-on-a-network.html) 與 [SSID Isolation 配置](https://www.cisco.com/c/dam/assets/sol/sb/isa500_emulator/help/guide/ae1192261.html)：SSID 名稱與安全隔離設定不是同一件事。
- [PCB Piezotronics：壓電感測器訊號調節器](https://www.pcb.com/about/press-room/2024-press-releases/endevco-model-2775c-pe-iepe-signal-conditioner)：區分電荷輸出 PE 與電壓輸出 IEPE。
- [OASIS MQTT 5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html)：QoS、Keep Alive 與訊息排序的適用條件。
- [NXP I²C UM10204 Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)：同步時脈介面。

## 完整性驗證

資料載入後檢查 80 個唯一 ID、80 組 A–D 非空選項、80 個有效答案鍵、80 則非空解析、9 節題數、16 個疑義標記、疑義原答案一致性、完整 PDF 頁碼來源與三個重要跨頁題／解析。未變更原有題目、其他程式或部署設定。

以下逐題清單同時記錄原答案與確切頁序。PDF 起始頁連結另在每筆題目資料；跨頁範圍已涵蓋全部選項與解析。

| 題目 ID | 題目 PDF 頁 | 答案 PDF 頁 | 原答案 | 待複核 |
| --- | --- | --- | --- | --- |
| aiot-guide-a1-t1-q01 | 21 | 23 | B | 否 |
| aiot-guide-a1-t1-q02 | 21 | 23 | B | 否 |
| aiot-guide-a1-t1-q03 | 21 | 23、24 | A | 否 |
| aiot-guide-a1-t1-q04 | 22 | 24 | B | 是 |
| aiot-guide-a1-t1-q05 | 22 | 24 | C | 否 |
| aiot-guide-a1-t2-q01 | 30 | 32 | C | 否 |
| aiot-guide-a1-t2-q02 | 30 | 32 | B | 否 |
| aiot-guide-a1-t2-q03 | 30 | 32 | B | 否 |
| aiot-guide-a1-t2-q04 | 30、31 | 32、33 | B | 否 |
| aiot-guide-a1-t2-q05 | 31 | 33 | C | 否 |
| aiot-guide-a1-t3-q01 | 55 | 57 | A | 否 |
| aiot-guide-a1-t3-q02 | 55 | 57 | B | 否 |
| aiot-guide-a1-t3-q03 | 55 | 57 | C | 否 |
| aiot-guide-a1-t3-q04 | 55 | 57 | D | 否 |
| aiot-guide-a1-t3-q05 | 55 | 57 | D | 否 |
| aiot-guide-a1-t3-q06 | 55、56 | 57 | D | 是 |
| aiot-guide-a1-t3-q07 | 56 | 57 | A | 否 |
| aiot-guide-a1-t3-q08 | 56 | 58 | B | 否 |
| aiot-guide-a1-t3-q09 | 56 | 58 | B | 否 |
| aiot-guide-a1-t3-q10 | 56 | 58 | C | 否 |
| aiot-guide-a1-t4-q01 | 76 | 78 | C | 否 |
| aiot-guide-a1-t4-q02 | 76 | 78 | D | 否 |
| aiot-guide-a1-t4-q03 | 76 | 78 | A | 否 |
| aiot-guide-a1-t4-q04 | 76 | 78 | B | 否 |
| aiot-guide-a1-t4-q05 | 76、77 | 78 | B | 否 |
| aiot-guide-a1-t4-q06 | 77 | 78 | C | 否 |
| aiot-guide-a1-t4-q07 | 77 | 78 | D | 否 |
| aiot-guide-a1-t4-q08 | 77 | 78 | D | 否 |
| aiot-guide-a1-t4-q09 | 77 | 79 | D | 否 |
| aiot-guide-a1-t4-q10 | 77 | 79 | C | 是 |
| aiot-guide-a1-t5-q01 | 102 | 104 | C | 否 |
| aiot-guide-a1-t5-q02 | 102 | 104 | B | 否 |
| aiot-guide-a1-t5-q03 | 102 | 104 | B | 是 |
| aiot-guide-a1-t5-q04 | 102 | 104 | C | 否 |
| aiot-guide-a1-t5-q05 | 102 | 104 | B | 否 |
| aiot-guide-a1-t5-q06 | 103 | 104 | B | 否 |
| aiot-guide-a1-t5-q07 | 103 | 104 | C | 否 |
| aiot-guide-a1-t5-q08 | 103 | 104 | C | 否 |
| aiot-guide-a1-t5-q09 | 103 | 105 | C | 否 |
| aiot-guide-a1-t5-q10 | 103 | 105 | C | 否 |
| aiot-guide-a1-t6-q01 | 113 | 116 | B | 否 |
| aiot-guide-a1-t6-q02 | 113 | 116 | B | 否 |
| aiot-guide-a1-t6-q03 | 113 | 116 | C | 否 |
| aiot-guide-a1-t6-q04 | 113 | 116 | D | 否 |
| aiot-guide-a1-t6-q05 | 113、114 | 116 | B | 否 |
| aiot-guide-a1-t6-q06 | 114 | 116 | C | 否 |
| aiot-guide-a1-t6-q07 | 114 | 116 | A | 否 |
| aiot-guide-a1-t6-q08 | 114 | 116 | D | 否 |
| aiot-guide-a1-t6-q09 | 114、115 | 116、117 | A | 是 |
| aiot-guide-a1-t6-q10 | 115 | 117 | D | 否 |
| aiot-guide-a1-t7-q01 | 124 | 127 | B | 否 |
| aiot-guide-a1-t7-q02 | 124 | 127 | C | 是 |
| aiot-guide-a1-t7-q03 | 124 | 127 | B | 否 |
| aiot-guide-a1-t7-q04 | 124 | 127 | B | 是 |
| aiot-guide-a1-t7-q05 | 125 | 127 | D | 否 |
| aiot-guide-a1-t7-q06 | 125 | 127 | B | 是 |
| aiot-guide-a1-t7-q07 | 125 | 127 | D | 是 |
| aiot-guide-a1-t7-q08 | 125 | 127 | D | 否 |
| aiot-guide-a1-t7-q09 | 126 | 127 | A | 否 |
| aiot-guide-a1-t7-q10 | 126 | 127 | B | 是 |
| aiot-guide-a1-t8-q01 | 138 | 140 | D | 否 |
| aiot-guide-a1-t8-q02 | 138 | 140 | B | 否 |
| aiot-guide-a1-t8-q03 | 138 | 140 | B | 否 |
| aiot-guide-a1-t8-q04 | 138 | 140 | D | 否 |
| aiot-guide-a1-t8-q05 | 138 | 140 | B | 否 |
| aiot-guide-a1-t8-q06 | 139 | 140 | B | 否 |
| aiot-guide-a1-t8-q07 | 139 | 140、141 | A | 否 |
| aiot-guide-a1-t8-q08 | 139 | 141 | A | 否 |
| aiot-guide-a1-t8-q09 | 139 | 141 | B | 是 |
| aiot-guide-a1-t8-q10 | 139 | 141 | A | 是 |
| aiot-guide-a1-t9-q01 | 152 | 154 | D | 否 |
| aiot-guide-a1-t9-q02 | 152 | 154 | C | 否 |
| aiot-guide-a1-t9-q03 | 152 | 154 | D | 是 |
| aiot-guide-a1-t9-q04 | 152 | 154 | B | 否 |
| aiot-guide-a1-t9-q05 | 152 | 154 | B | 是 |
| aiot-guide-a1-t9-q06 | 153 | 154 | D | 否 |
| aiot-guide-a1-t9-q07 | 153 | 154 | C | 是 |
| aiot-guide-a1-t9-q08 | 153 | 154 | C | 是 |
| aiot-guide-a1-t9-q09 | 153 | 154 | B | 否 |
| aiot-guide-a1-t9-q10 | 153 | 154 | C | 否 |

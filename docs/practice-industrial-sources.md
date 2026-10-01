# 工業與實作科目原創補充題來源及驗證

更新日期：2026-10-01。此文件涵蓋 `catalog/data/practice-industrial.json`、`catalog/assets/questions/industrial/` 與可重建資料及圖片的 `scripts/build-industrial-practice.py`。

## 內容定位

本題庫為依 iPAS 官方考科範圍編寫的原創練習，**不是官方試題、考古題或官方公布答案**。每題均標記 `sourceKind: original-practice`、`official: false`；官方簡章只用於確認科目與評鑑範圍。概念及計算另參考下列標準組織、儀器或軟體廠商的第一手文件。

所有案例、量測數字、圖表、允收條件與干擾選項均為此網站自編，並非從來源文件複製試題。圖內規格與模型只適用於題定情境；例如發射功率上限、孔銅厚度、曝光參數與樹脂後處理條件，均不可當成通用法規、材料配方或製造允收標準。

實作及混合考科標記 `practicalPreparation: true`，用於操作前的原理、讀圖、計算及故障判讀練習；線上單選題不能取代官方現場操作、設備安全訓練或完整術科考核。中級天線系統整合、材料與製程優化、儀器與數據判讀依目錄的筆試類型標記為 false。

## 覆蓋範圍

共 13 科、156 題、39 張獨立 SVG 技術圖表。每科 12 題、3 張圖，每張圖支援 4 道不同判讀或計算題；每題均附圖及文字替代說明。

| 科目 ID | 鑑定及級別 | 科目 | 題數 / 圖數 | 圖表主題 |
| --- | --- | --- | --- | --- |
| `ant-junior-2` | 天線設計工程師・初級 | 天線設計實務 | 12 / 3 | 阻抗匹配、天線尺寸估算、半功率波束寬 |
| `ant-intermediate-2` | 天線設計工程師・中級 | 天線系統整合設計實務 | 12 / 3 | 整合鏈路預算、MIMO 方案篩選、整機效率 |
| `pcb-junior-3` | 電路板製程工程師・初級 | 電路板製造及切片分析實務 | 12 / 3 | 顯微尺度校正、試樣製備、孔環幾何 |
| `aiot-junior-3` | AIoT應用工程師・初級 | 機器聯網基礎應用實作 | 12 / 3 | 暫存器解碼、資料品質、重複訊息 |
| `aiot-junior-4` | AIoT應用工程師・初級 | 感測器信號調節實務應用 | 12 / 3 | 電流迴路縮放、訊號放大、低通截止 |
| `3dp-junior-3` | 3D列印積層製造工程師・初級 | 3D列印製程實務：材料擠製成型 | 12 / 3 | 層數計算、流量校正、首層排錯 |
| `3dp-junior-4` | 3D列印積層製造工程師・初級 | 3D列印製程實務：光聚合固化 | 12 / 3 | 曝光校正、擺放方案選擇、製程順序 |
| `3dp-intermediate-1` | 3D列印積層製造工程師・中級 | 3D列印材料與製程優化 | 12 / 3 | 因子主效應、尺寸能力Cp、限制條件選型 |
| `3dp-intermediate-2` | 3D列印積層製造工程師・中級 | 3D列印進階製程實務：材料擠製成型 | 12 / 3 | 體積流量、設計應力、換料材料損耗 |
| `3dp-intermediate-3` | 3D列印積層製造工程師・中級 | 3D列印進階製程實務：光聚合固化 | 12 / 3 | 工作曲線計算、外尺寸縮放、剝離力估算 |
| `mdmt-junior-2` | 工具機機械設計工程師・初級 | 機械製圖(含工具機實例) | 12 / 3 | 剖面深度判讀、最小間隙、名義尺寸鏈 |
| `spe-junior-3` | 智慧生產工程師・初級 | 智慧生產與管理實務 | 12 / 3 | OEE時間稼動率、交期優先派工、首過良率 |
| `pmae-intermediate-3` | 塑膠材料應用工程師・中級 | 常見塑膠材料檢測儀器的功能及數據判讀 | 12 / 3 | 玻璃轉移判讀、揮發分計算、拉伸應力 |

## 官方範圍與第一手概念來源

以下來源已依主題查閱；每題保留實際相關連結，並不表示該來源發布或認可本站原創題。各科所依的官方簡章連結如下。

- `ant-junior-2`：[115 年官方簡章・天線設計實務](https://www.ipas.org.tw/api/proxy/uploads/certification/ANT/115年度天線設計工程師能力鑑定簡章(初級、中級)_0410_20260410121218.pdf)
- `ant-intermediate-2`：[115 年官方簡章・天線系統整合設計實務](https://www.ipas.org.tw/api/proxy/uploads/certification/ANT/115年度天線設計工程師能力鑑定簡章(初級、中級)_0410_20260410121218.pdf)
- `pcb-junior-3`：[115 年官方簡章・電路板製造及切片分析實務](https://www.ipas.org.tw/api/proxy/uploads/certification/PCB/115年度電路板製程工程師能力鑑定簡章(初級、中級)_0410_20260410161233.pdf)
- `aiot-junior-3`：[115 年官方簡章・機器聯網基礎應用實作](https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf)
- `aiot-junior-4`：[115 年官方簡章・感測器信號調節實務應用](https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf)
- `3dp-junior-3`：[115 年官方簡章・3D列印製程實務：材料擠製成型](https://www.ipas.org.tw/api/proxy/uploads/certification/3DP/115年度3D列印積層製造工程師能力鑑定簡章(初、中級)_0508_20260508182625.pdf)
- `3dp-junior-4`：[115 年官方簡章・3D列印製程實務：光聚合固化](https://www.ipas.org.tw/api/proxy/uploads/certification/3DP/115年度3D列印積層製造工程師能力鑑定簡章(初、中級)_0508_20260508182625.pdf)
- `3dp-intermediate-1`：[115 年官方簡章・3D列印材料與製程優化](https://www.ipas.org.tw/api/proxy/uploads/certification/3DP/115年度3D列印積層製造工程師能力鑑定簡章(初、中級)_0508_20260508182625.pdf)
- `3dp-intermediate-2`：[115 年官方簡章・3D列印進階製程實務：材料擠製成型](https://www.ipas.org.tw/api/proxy/uploads/certification/3DP/115年度3D列印積層製造工程師能力鑑定簡章(初、中級)_0508_20260508182625.pdf)
- `3dp-intermediate-3`：[115 年官方簡章・3D列印進階製程實務：光聚合固化](https://www.ipas.org.tw/api/proxy/uploads/certification/3DP/115年度3D列印積層製造工程師能力鑑定簡章(初、中級)_0508_20260508182625.pdf)
- `mdmt-junior-2`：[115 年官方簡章・機械製圖(含工具機實例)](https://www.ipas.org.tw/api/proxy/uploads/certification/MDMT/115年度工具機機械設計工程師能力鑑定簡章(初級)_0410_20260410112702.pdf)
- `spe-junior-3`：[115 年官方簡章・智慧生產與管理實務](https://www.ipas.org.tw/api/proxy/uploads/certification/SPE/115年度智慧生產工程師能力鑑定簡章(初、中級)_0410_20260410140735.pdf)
- `pmae-intermediate-3`：[115 年官方簡章・常見塑膠材料檢測儀器的功能及數據判讀](https://www.ipas.org.tw/api/proxy/uploads/certification/PMAE/115年度塑膠材料應用工程師能力鑑定簡章(初、中級)_20251230213934.pdf)

第一手技術文件：

- [Rohde & Schwarz：VNA 天線量測](https://www.rohde-schwarz.com/uk/products/test-and-measurement/essentials-test-equipment/spectrum-analyzers/vector-network-analyzer-antenna-measurement_258137.html)
- [Rohde & Schwarz：Antenna design, measurement and optimization](https://scdn.rohde-schwarz.com/ur/pws/dl_downloads/premiumdownloads/premium_dl_brochures_and_datasheets/IoT-design-guide_eGuide_en_3683-3959-92_v0100.pdf)
- [IPC-TM-650 2.1.1：Microsectioning](https://www.ipc.org/sites/default/files/test_methods_docs/2-1-01f.pdf)
- [Modbus Organization：Application Protocol V1.1b3](https://www.modbus.org/file/secure/modbusprotocolspecification.pdf)
- [OPC Foundation：DataValue](https://reference.opcfoundation.org/specs/OPC-10000-4/7.11)
- [OASIS：MQTT Version 3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [Fluke：Eliminating sensor errors in loop calibrations](https://media.fluke.com/b21c30b8-7919-495d-b9a9-b1060066a809_original%20file.pdf)
- [Texas Instruments：ADC code 與電壓換算](https://e2e.ti.com/blogs_/archives/b/precisionhub/posts/it-s-in-the-math-how-to-convert-adc-code-to-a-voltage-part-1)
- [Texas Instruments：MSPM0 ADC Noise Analysis and Application](https://www.ti.com/lit/an/slaaeo8a/slaaeo8a.pdf)
- [Prusa Research：Max volumetric speed](https://help.prusa3d.com/article/max-volumetric-speed_127176)
- [Prusa Research：Extrusion multiplier calibration](https://help.prusa3d.com/article/extrusion-multiplier-calibration_2257)
- [Formlabs：SLA 零件擺放、支撐與排液](https://formlabs.com/blog/how-to-orient-sla-parts/)
- [Formlabs：3D printing post-processing FAQs](https://formlabs.com/global/support/3d-printing-post-processing-faqs/)
- [Formlabs：Using the Form Wash](https://formlabs.com/support/Using-Form-Wash/)
- [NIST：What is Process Capability?](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm)
- [NIST：Working Curve in Vat Photopolymerization](https://www.nist.gov/publications/results-interlaboratory-study-working-curve-vat-photopolymerization)
- [Autodesk：Dimension reference](https://help.autodesk.com/cloudhelp/ENU/Fusion-Drawing/files/DWG-REF-DIMENSION-DLG.htm)
- [Autodesk：Limits and Fits Mechanical Calculator](https://help.autodesk.com/cloudhelp/2026/ENU/Inventor-Help/files/GUID-1EF0D439-A1C2-4073-A5F8-0154A5C4677A.htm)
- [Vorne：OEE Calculation](https://www.oee.com/calculating-oee/)
- [NETZSCH：How to Analyze Thermoplastic Polymers by Means of DSC](https://analyzing-testing.netzsch.com/en-US/application-literature/how-to-analyze-thermoplastic-polymers-by-means-of-dsc)
- [NETZSCH：Crystallinity / Degree of Crystallinity](https://analyzing-testing.netzsch.com/en/know-how/glossary/crystallinity-degree-of-crystallinity)
- [NETZSCH：TGA Measurements on Polymers](https://analyzing-testing.netzsch.com/en-US/application-literature/tga-measurements-and-c-dta-determination-on-polymers)
- [ZwickRoell：Tensile test on plastics ISO 527](https://www.zwickroell.com/industries/plastics/thermoplastics-and-thermosetting-molding-materials/tensile-test-iso-527-1-2/)
- [ZwickRoell：MFR and MVR definitions](https://www.zwickroell.com/industries/plastics/plastic-pipes/melt-index-flow-rate/)

## 驗證紀錄

- 建置程式檢查 156 個 ID 唯一、13 個科目 ID 存在於現行目錄、每科 12 題及 3 張不同圖片、所有答案鍵與四個互異選項、來源 HTTPS 連結及本地圖片路徑。
- 97 個數值斷言通過：包含單位換算、射頻鏈路、迴路電壓、ADC、RC 濾波、流率、尺寸與公差、製程能力、OEE、DSC/TGA 等；其中 17 項另核對四捨五入結果與實際正解選項文字。
- ABCD 正解各 39 題。每題單選，未將同一情境的判斷重複成換名填空。
- 39 張 SVG 全部通過 XML 解析，且無腳本、外部影像或網路字型依賴。圖尺寸為 1100×720，具 title、desc 與 alt。
- 39 張 SVG 已全部渲染並目視抽版面；修正兩處過長方塊標籤後，重新渲染及檢視感測濾波與材料擠製流率兩張完整圖。數值與條件由同一來源程式產生，並逐題對照答案解析。
- 明確保留模型適用條件：Cp/Cpk 題先限定穩定且近似常態製程；Jacobs 工作曲線題使用題定 Dp/Ec；剝離力題只計簡化壓差力並排除黏著/動態效應；TGA 題指定各段反應假設；拉伸模數題指定線彈性區。

重建：`python3 scripts/build-industrial-practice.py`。此指令只產生本站原創工業補充題及其 SVG，不會改寫官方題庫、網站帳戶或任何雲端資料。

## 已知界線

本檔案補齊缺少公開可互動官方題的考科練習入口，並未宣稱涵蓋每科全部評鑑細目。機器聯網題聚焦通訊與資料品質；術科仍需以官方當年規範實際練習指定設備、工具及交付格式。資料僅標示來源文件的概念依據，原創題答案由本站推導與驗證。若官方日後公布原卷，可併列於官方來源分類，勿將本檔改標為官方。

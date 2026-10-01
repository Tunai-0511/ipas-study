// Official learning-guide exercises, not past examination papers.
// Source: Ministry of Economic Affairs, Industrial Development Administration, iPAS.
// Preserve the published answer keys; needsReview items must not be scored.
// Provenance, open-data statement, normalization and audit: docs/aiot-official-guide-audit.md.
window.APP_OFFICIAL_GUIDE = [
  {
    "id": "aiot-guide-a1-t1-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t1",
    "chapter": "a1-t1",
    "stem": "關於機器學習（Machine Learning）在 AIoT 資料分析中的應用範式，下列敘述何者正確？",
    "options": {
      "A": "監督式學習（Supervised Learning）不需依賴標籤資料，適合用於未知故障型態的探索",
      "B": "非監督式學習（Unsupervised Learning）常利用資料分群（Clustering）技術，將相似的設備運作資料自動歸類",
      "C": "強化學習（Reinforcement Learning）的主要目標是進行靜態影像的瑕疵檢測（Automated Optical Inspection, AOI）",
      "D": "迴歸（Regression）屬於非監督式學習的一種，主要用於將資料進行離散類別的區分"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。監督式學習必須依賴「特徵與對應的標籤（Label）」才能進行訓練，無法處理無標籤的未知型態。 (B) 正確。非監督式學習無需標籤，可透過演算法找出資料內部的結構與群集特性，台灣教科書稱之為「分群」。 (C) 錯誤。影像瑕疵檢測（AOI）通常使用監督式學習中的卷積神經網路（CNN）；強化學習主要用於動態控制決策（如空調節能控制）。 (D) 錯誤。迴歸屬於監督式學習，且輸出為「連續數值」 （如溫度、壽命預測），而非離散類別（那是分類 Classification）。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "sourcePages": [
      21
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=23",
    "answerPages": [
      23
    ],
    "sourceSection": "AI基礎概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t1-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t1",
    "chapter": "a1-t1",
    "stem": "在處理 AIoT 感測器產生的時間序列資料（Time-series Data），如馬達連續震動波形或電流趨勢時，下列何種神經網路模型架構最為合適？",
    "options": {
      "A": "卷積神經網路（CNN）",
      "B": "循環神經網路（RNN/LSTM）",
      "C": "生成對抗網路（GAN）",
      "D": "隨機森林（Random Forest）"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。CNN 擅長處理具有空間結構的資料（如影像），雖也可用於一維時間序列（1D-CNN），但在教學與典型應用中，RNN/LSTM 更具代表性。 (B) 正確。 RNN 與 LSTM 具備「記憶」機制，能捕捉前後時間點的關聯性，最適合時序資料。 (C) 錯誤。GAN 主要用於生成新資料（如生成逼真影像），而非用於時序訊號的分析與預測。 (D) 錯誤。隨機森林是傳統機器學習演算法，不屬於深度學習（類神經網路）架構。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "sourcePages": [
      21
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=23",
    "answerPages": [
      23
    ],
    "sourceSection": "AI基礎概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t1-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t1",
    "chapter": "a1-t1",
    "stem": "在邊緣運算（Edge AI）架構中，為了讓神經網路模型能部署在資源受限的微控制器（MCU）上，通常會採用「量化（Quantization）」技術。關於此技術的敘述，下列何者正確？",
    "options": {
      "A": "將模型參數由高精度浮點數（FP32）轉換為低精度整數（INT8），以降低記憶體佔用",
      "B": "透過增加神經網路的層數，來提升模型在邊緣端的推論準確度",
      "C": "將模型切割成多個部分，分別在不同的雲端伺服器上執行",
      "D": "是一種將類比訊號轉換為數位訊號的硬體電路技術"
    },
    "answer": "A",
    "explanation": "(A) 正確。量化是透過降低數值精度來換取更小的模型體積與更快的運速度，適合邊緣端（Edge）。 (B) 錯誤。增加層數會增加運算量與體積，不符合邊緣裝置輕量化的需求。 (C) 錯誤。這是「模型平行（Model Parallelism）」或分散式運算的概念，並非量化。 (D) 錯誤。這是訊號處理中的「類比數位轉換（ADC）」，與AI 模型的權重量化不同。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=21",
    "sourcePages": [
      21
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=23",
    "answerPages": [
      23,
      24
    ],
    "sourceSection": "AI基礎概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t1-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t1",
    "chapter": "a1-t1",
    "stem": "關於神經網路處理器（Neural Processing Unit, NPU）在 AIoT 邊緣裝置中的角色與特性，下列敘述何者正確？",
    "options": {
      "A": "錯誤。NPU 是協同處理器，負責 AI 加速，通用運算（OS、I/O）仍由CPU 負責",
      "B": "正確。 NPU 專注於推論（Forward Propagation），移除訓練所需的複雜反向傳播邏輯，因此能效極高",
      "C": "錯誤。雲端訓練通常使用高算力的 GPU 或 TPU；邊緣 NPU 運算力不足以支撐訓練",
      "D": "錯誤。NPU 的優勢正是執行 INT8 量化模型，這比浮點運算更省電且快速"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。NPU 是協同處理器，負責 AI 加速，通用運算（OS、I/O）仍由CPU 負責。 (B) 正確。 NPU 專注於推論（Forward Propagation），移除訓練所需的複雜反向傳播邏輯，因此能效極高。 (C) 錯誤。雲端訓練通常使用高算力的 GPU 或 TPU；邊緣 NPU 運算力不足以支撐訓練。 (D) 錯誤。 NPU 的優勢正是執行 INT8 量化模型，這比浮點運算更省電且快速。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=22",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=22",
    "sourcePages": [
      22
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=24",
    "answerPages": [
      24
    ],
    "sourceSection": "AI基礎概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "原 PDF 選項直接含「正確／錯誤」及說明，與解析重複，不能作為正常的四選一題；保留官方答案 B，不把編輯重寫當官方原題。"
  },
  {
    "id": "aiot-guide-a1-t1-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t1",
    "chapter": "a1-t1",
    "stem": "為了降低 AIoT 系統的隱私風險，應遵循「由設計起始的隱私（Privacy by Design, PbD）」原則。下列哪項措施最符合此原則在「邊緣運算」中的實踐？",
    "options": {
      "A": "將攝影機拍攝的所有原始畫面無條件上傳至雲端儲存，以備不時之需",
      "B": "僅依賴雲端伺服器的防火牆進行防護，終端裝置不需處理資安",
      "C": "在邊緣端即進行資料去識別化（如僅傳送特徵值或骨架資訊），避免原始敏感個資外流",
      "D": "要求所有使用者在使用服務前，必須簽署放棄隱私權同意書"
    },
    "answer": "C",
    "explanation": "(A) 錯誤。上傳原始畫面會增加傳輸過程被攔截的風險，且雲端儲存亦有洩漏風險，不符最小化原則。 (B) 錯誤。AIoT 強調端對端防護，邊緣裝置（Edge）往往是駭客入侵的破口，不能只靠雲端。 (C) 正確。PbD 強調在系統架構設計時就納入隱私。數據「不離地」或「去識別化後才上傳」是核心實踐。 (D) 錯誤。這屬於法律免責手段，並非技術架構上的「設計起始（by Design）」保護措施。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=22",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=22",
    "sourcePages": [
      22
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=24",
    "answerPages": [
      24
    ],
    "sourceSection": "AI基礎概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t2-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t2",
    "chapter": "a1-t2",
    "stem": "在智慧工廠的「預測性維護（Predictive Maintenance, PdM）」應用中，關於 AI 模型任務的分類，下列敘述何者正確？",
    "options": {
      "A": "「故障診斷（Diagnosis）」屬於迴歸任務，用於計算設備的運轉時數",
      "B": "「健康預測（Prognosis）」屬於分類任務，用於判斷設備是否故障",
      "C": "「故障診斷」用於判斷設備當前狀態（如正常 /異常），屬於分類任務",
      "D": "「健康預測」主要依賴非監督式學習，不需參考歷史故障資料"
    },
    "answer": "C",
    "explanation": "(A) 錯誤。故障診斷是判斷「類別」 （哪種故障），屬於分類（Classification）。 (B) 錯誤。健康預測是推估「剩餘壽命（Remaining Useful Life, RUL）」，輸出為連續時間數值，屬於迴歸（Regression）。 (C) 正確。診斷即是分類當下的狀態。 (D) 錯誤。健康預測通常需要歷史的衰退數據來訓練迴歸模型，通常是監督式學習。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "sourcePages": [
      30
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=32",
    "answerPages": [
      32
    ],
    "sourceSection": "AIoT應用案例",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t2-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t2",
    "chapter": "a1-t2",
    "stem": "關於「感測融合（Sensor Fusion）」技術在 AIoT 系統中的主要效益，下列敘述何者正確？",
    "options": {
      "A": "目的是降低硬體成本，減少感測器的使用數量",
      "B": "透過整合多種不同類型的感測器（如影像加光達），提升系統在複雜環境下的強健性（Robustness）",
      "C": "只能在雲端伺服器上執行，無法在邊緣裝置上運作",
      "D": "會導致資料衝突，降低系統判斷的準確度"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。感測融合通常需要更多或多種感測器，硬體成本可能增加，但換取的是可靠度。 (B) 正確。互補不同感測器的盲點（例如光達補強影像在暗處的不足），增加系統強健性（台灣學術用語，對應 Robustness）。 (C) 錯誤。感測融合常在邊緣端（如自駕車的車載電腦）即時執行。 (D) 錯誤。融合演算法（如 Kalman Filter 或 AI 模型）的目的正是解決衝突，提升準確度。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "sourcePages": [
      30
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=32",
    "answerPages": [
      32
    ],
    "sourceSection": "AIoT應用案例",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t2-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t2",
    "chapter": "a1-t2",
    "stem": "某智慧農業場域需在大面積溫室佈署溫濕度監測系統，考量感測器需電池供電且傳輸距離遠（數公里），最適合採用下列何種通訊技術與 AI 架構？",
    "options": {
      "A": "使用 Wi-Fi 傳輸高解析度影像，並在感測器端進行模型訓練",
      "B": "使用低功耗廣域網路（Low-Power Wide-Area Network, LPWAN） （如LoRa）傳輸環境數值，並採「端雲協作」在雲端進行趨勢分析",
      "C": "使用 NFC 進行近場資料讀取，並由人工抄寫數據",
      "D": "使用 5G 毫米波進行超低延遲控制，不需考量功耗"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。 Wi-Fi 耗電高且傳輸距離短，不適合大面積農業；感測器端（End Node）通常無能力進行訓練。 (B) 正確。 LoRa/Sigfox 具備長距離、低功耗特性，適合傳輸量小的溫濕度資料，複雜分析則交由雲端。 (C) 錯誤。 NFC 距離僅數公分，無法達成自動化大面積監測。 (D) 錯誤。 5G 基地台建置成本高且終端耗電，非單純環境監測的首選。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "sourcePages": [
      30
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=32",
    "answerPages": [
      32
    ],
    "sourceSection": "AIoT應用案例",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t2-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t2",
    "chapter": "a1-t2",
    "stem": "在智慧工廠中，為了讓 AI 系統能讀取來自不同廠牌可程式邏輯控制器（Programmable Logic Controller, PLC）的異質數據，通常會透過閘道器（Gateway）將資料轉換為下列何種工業標準通訊架構？",
    "options": {
      "A": "HTTP",
      "B": "OPC UA （Open Platform Communications Unified Architecture）",
      "C": "BLE（Bluetooth Low Energy）",
      "D": "USB 3.0"
    },
    "answer": "B",
    "explanation": "(A) 錯誤。HTTP 是網際網路應用層協定，雖通用但非工業底層設備（如 PLC）資料交換的首選標準格式，且缺乏工業所需的時效性與語意描述。 (B) 正確。 OPC UA 是工業 4.0 架構中解決跨平台、跨廠牌設備互通性的標準協定，具備統一的資訊模型，方便上層 AI 系統讀取與分析。 (C) 錯誤。BLE 是短距離無線通訊技術，主要用於消費電子或簡單感測器，並非工業控制器間資料交換的標準架構。 (D) 錯誤。 USB 是實體傳輸介面，無法解決不同廠牌 PLC 內部暫存器定義與通訊邏輯不一致的問題。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=30",
    "sourcePages": [
      30,
      31
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=32",
    "answerPages": [
      32,
      33
    ],
    "sourceSection": "AIoT應用案例",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t2-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t2",
    "chapter": "a1-t2",
    "stem": "AIoT 系統規劃需考量「四位一體循環」，下列針對各層級功能的描述，何者正確？",
    "options": {
      "A": "感知端（Input）：負責執行複雜的深度學習模型訓練與權重更新",
      "B": "通訊端（Transport）：僅負責資料加密，不負責資料傳輸",
      "C": "智慧端（AI/Process）：負責進行資料分析、即時判斷（Judgment）或趨勢預測（Prediction）",
      "D": "安全端（Security）：指的就是在工廠門口設置保全人員，與資訊系統無關"
    },
    "answer": "C",
    "explanation": "(A) 錯誤。感知端（Sensor）負責擷取物理訊號，通常無能力進行模型訓練。 (B) 錯誤。通訊端負責將資料從端點傳輸到邊緣或雲端（如 LoRa, 5G）。 (C) 正確。智慧端是 AI 演算法發揮作用的地方，將資料轉化為決策。 (D) 錯誤。安全端指資訊安全，如資料加密、身分認證，非實體保全。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=31",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=31",
    "sourcePages": [
      31
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=33",
    "answerPages": [
      33
    ],
    "sourceSection": "AIoT應用案例",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "下列哪一項是物聯網感測器的主要工作原理？",
    "options": {
      "A": "收集與傳輸數據",
      "B": "存儲數據與執行複雜的計算任務",
      "C": "控制外部設備",
      "D": "建立虛擬現實體驗"
    },
    "answer": "A",
    "explanation": "物聯網系統是指將許多智慧設備和感測器透過網路連接起來，使它們能夠透過大量收集的數據，系統可以進行深入的分析和決策。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "下列哪一種「不」是智慧醫療中使用物聯網應用的例子？",
    "options": {
      "A": "智慧控溫器",
      "B": "自動駕駛汽車",
      "C": "穿戴裝置",
      "D": "遠距照護"
    },
    "answer": "B",
    "explanation": "遠程患者監測可以提高患者的生活品質。患者可以在家中自主進行監測，而不必經常前往醫院或診所，從而減少了疲勞和不便。此外，由於醫療機構可以實時監測患者的狀態，可以及時發現和處理患者的問題，從而提高了患者的治療效果和生活品質。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "DHT11 屬於下列哪一種感測器？",
    "options": {
      "A": "光學感測器",
      "B": "音頻感測器",
      "C": "溫度和濕度感測器",
      "D": "加速度感測器"
    },
    "answer": "C",
    "explanation": "溫度感測器可以測量環境中的溫度，濕度感測器可以測量環境中的濕度，這些數據可以用來分析環境的舒適度，並根據需要調整空調或加濕器等設備以維持環境的舒適度。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "下列哪一種感測器可用於監控居家中的瓦斯漏氣？",
    "options": {
      "A": "壓力感測器",
      "B": "光學感測器",
      "C": "溫度和濕度感測器",
      "D": "氣體感測器"
    },
    "answer": "D",
    "explanation": "瓦斯是一種無色、無味、易燃的氣體，透過氣體感測器可以檢測環境中的瓦斯濃度。當瓦斯漏氣時，氣體感測器會檢測到異常的瓦斯濃度，並發出聲音或發送警報訊息，提醒居民可能存在瓦斯漏氣問題。居民可以根據警報訊息採取相應的應對措施，例如通風、關閉瓦斯閥門、撤離房屋等。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "在工業環境中使用 IoT 感測器的關鍵優勢，下列敘述何者「不」正確？",
    "options": {
      "A": "提高生產力和效率",
      "B": "可透過感測器數據收集，更加掌握製程的情況",
      "C": "可以透過感測器偵測設備的振動與溫度，預測產品的品質",
      "D": "對於設備維護的時間，仍無法預測"
    },
    "answer": "D",
    "explanation": "透過感測器對設備的數據收集，可以提早預測設備的維護時間，並使生產的預測能更精準。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "下列哪一項物聯網應用，「不」會使用到電子羅盤和加速度感測器？",
    "options": {
      "A": "智慧國防之無人機海巡搜索",
      "B": "智慧休憩之登山客戶外個人導航",
      "C": "智慧交通之無人車慣性導航",
      "D": "智慧家庭之室內燈光控制"
    },
    "answer": "D",
    "explanation": "室內掃地機器人的移動不會使用到電子羅盤。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=55",
    "sourcePages": [
      55,
      56
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "D",
    "reviewReason": "選項 D 是室內燈光控制，官方解析卻談室內掃地機器人，題目與解析不對應。"
  },
  {
    "id": "aiot-guide-a1-t3-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "對於感測器的使用，下列哪一項「不」正確？",
    "options": {
      "A": "可以使用超音波感測器量測噪音分貝數",
      "B": "可以使用電子羅盤偵測無人機的飛行方向",
      "C": "可以使用三軸加速度計偵測居家老人是否跌倒",
      "D": "可以利用陀螺儀偵測無人機是否傾斜"
    },
    "answer": "A",
    "explanation": "超音波感測器是用來量測距離，不是偵測音量大小。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "sourcePages": [
      56
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=57",
    "answerPages": [
      57
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "下列哪一種感測器可用於監控智慧城市道路旁垃圾桶的填滿程度以進行垃圾車行進路線的規劃？",
    "options": {
      "A": "壓力感測器",
      "B": "超音波感測器",
      "C": "GPS 定位系統",
      "D": "加速度計"
    },
    "answer": "B",
    "explanation": "在垃圾桶蓋內側裝置超音波感測器，可測量到垃圾桶剩餘空間（即垃圾的填滿程度），進而進行垃圾車行進路線規劃。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "sourcePages": [
      56
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=58",
    "answerPages": [
      58
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "關於物聯網的感知層，下列敘述何者「不」正確？",
    "options": {
      "A": "負責感測和收集資料的層級",
      "B": "感測元件應各自運作，不需要兼顧感測器之間溝通及資料交換",
      "C": "透過各種感應器、設備或技術來收集環境中的物理或生理信號",
      "D": "主要包括無線射頻識別（RFID）技術、感測技術及控制技術等"
    },
    "answer": "B",
    "explanation": "很多應用場景需要感測器彼此間互相溝通，例如訪客按下門鈴後，會通知攝影機開始進行人臉辨識與錄影，此時兩個感測元件彼此間會進行資料交換，因此選項 B 是錯誤的。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "sourcePages": [
      56
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=58",
    "answerPages": [
      58
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t3-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t3",
    "chapter": "a1-t3",
    "stem": "「智慧停車場系統」中感測器技術應用的描述，下列何者正確？",
    "options": {
      "A": "紅外線感測器可以透過檢測車輛的熱能分佈來實時追蹤特定會員車輛行進路徑，並進行車輛流量分析",
      "B": "使用氣壓感測器來檢測車位上方的壓力變化，當車輛進入或離開車位時，根據壓力變化更新車位使用狀態",
      "C": "超音波感測器可用於檢測車輛進出車位時的動態距離，幫助停車場管理系統自動記錄停車時間與車位使用狀態",
      "D": "結合光纖感測技術，透過感應車輛輪胎的重量分佈來精確定位車輛，並即時傳輸數據到停車場管理平台"
    },
    "answer": "C",
    "explanation": "(A) 紅外線感測器主要用於檢測物體的溫度和熱能分佈，但不常用於追蹤車輛的路徑或分析流量。車輛流量分析更多依賴於影像或雷達技術。 (B) 氣壓感測器通常應用於環境氣壓測量，並不適合用來檢測車位壓力變化，停車場中多使用超音波或雷達來檢測車輛存在。 (C) 超音波感測器是智慧停車場中常見的技術，透過發射聲波並接收回波來檢測車輛與感測器之間的距離，判斷車位是否被占用。 (D) 光纖感測技術主要應用於通訊和特殊工業監測，並不常用於智慧停車場系統的車輛檢測與定位。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=56",
    "sourcePages": [
      56
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=58",
    "answerPages": [
      58
    ],
    "sourceSection": "物聯網架構與功能",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "下列哪一種網路協定可用於物聯網低功耗設備之間的通訊？",
    "options": {
      "A": "HTTP",
      "B": "FTP",
      "C": "MQTT",
      "D": "SMTP"
    },
    "answer": "C",
    "explanation": "MQTT（Message Queuing Telemetry Transport）是一種輕量級的、開放源碼的消息協議，通常用於物聯網設備之間的通信。並且針對低頻寬和不穩定的網路連接進行了優化。這意味著它可以在低功耗設備之間進行通信，同時保持良好的連接性。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "sourcePages": [
      76
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "關於第五代行動通訊（5G）的技術或特性，下列敘述哪一項「不」正確？",
    "options": {
      "A": "5G 的速度比 4G 快",
      "B": "適合需要高帶寬和低延遲連接的應用程序",
      "C": "可以在同一時間提供更多的用戶使用基地台",
      "D": "是一種低功耗、長距離無線通訊技術"
    },
    "answer": "D",
    "explanation": "5G 更適合高頻寬、低延遲、高速率的應用，以及高密度、高速度的移動設備通訊。在固定速率下，可提供更多的用戶來使用基地台。 5G 在傳輸速率、容量、連接密度、可靠性等方面都有很大的提升，但是相對地需要更多的功率和較短的通訊距離。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "sourcePages": [
      76
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "MQTT 通訊協定定義了多種傳輸品質保證層級（QoS Level），下列哪一項層級「不」保證資料會送達目的端？",
    "options": {
      "A": "Level 0",
      "B": "Level 1",
      "C": "Level 2",
      "D": "Level 3"
    },
    "answer": "A",
    "explanation": "根據 MQTT 官方文件的 QoS 定義， 0 不保證送達。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "sourcePages": [
      76
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "CoAP 是一種類似輕量級 HTTP 並可適用於物聯網通訊的協定，此協定「不」支援下列哪一項請求方式來實現物聯網設備間的通訊？",
    "options": {
      "A": "GET",
      "B": "QUERY",
      "C": "POST",
      "D": "PUT"
    },
    "answer": "B",
    "explanation": "HTTP 沒有 Query 請求。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "sourcePages": [
      76
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "設計一個智慧保全系統讓用戶除了可以透過智慧手機觀察家中長者的起居狀況並可進行線上通話。下列哪一種網路傳輸協定「最」適合此應用情境？",
    "options": {
      "A": "HTTP",
      "B": "WebSocket",
      "C": "CoAP",
      "D": "MQTT"
    },
    "answer": "B",
    "explanation": "此題應用場景需要雙向即時通訊，因此 WebSocket 最合適。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
    "sourcePages": [
      76,
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "關於 MQTT，下列敘述何者「不」正確？",
    "options": {
      "A": "發佈者無法知道有多少訂閱者訂閱資料",
      "B": "以 Client-Server 架構而言，發佈者為 client 端而訂閱者也是 client 端",
      "C": "發佈者無法要求 Broker 保留一份最新訊息給新加入的訂閱者",
      "D": "MQTT 使用 TCP 協定傳輸資料"
    },
    "answer": "C",
    "explanation": "根據 MQTT 協定定義，發佈者可以透過 Retained Message 要求 Broker 保留一份最新訊息給新加入的訂閱者。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "sourcePages": [
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "Matter 是應用於智慧家庭之一種物聯網連接標準，此標準「不」支援下列哪一項技術的連結層協定？",
    "options": {
      "A": "Wi-Fi",
      "B": "Bluetooth",
      "C": "Thread",
      "D": "LoRa"
    },
    "answer": "D",
    "explanation": "Matter 可支援包含 Ethernet、Wi-Fi 及 Thread 等技術的連結層協定，也支援 BLE 技術。但不支援 LoRa。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "sourcePages": [
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "在 Wi-Fi 訊號中的 SSID 功用為下列何者？",
    "options": {
      "A": "Wi-Fi 加密類型",
      "B": "版本編號類似 IEEE 的 802.11n",
      "C": "儲存該基地台基本資訊，例如製造商…等",
      "D": "Wi-Fi 基地台識別碼"
    },
    "answer": "D",
    "explanation": "SSID 的定義就是基地台識別碼，因此答案為 D，其他選項均錯誤。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "sourcePages": [
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=78",
    "answerPages": [
      78
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "在無線通訊技術裡， Wi-Fi、Bluetooth、ZigBee、NB-IoT 這幾項較早推出的應用已經於不同領域中奠定發展基礎。下列敘述何者「不」正確？",
    "options": {
      "A": "Wi-Fi 適用於大資料量的傳輸，比如影音傳輸或者 AR/VR 等領域",
      "B": "Bluetooth 多用於個人穿戴式裝置",
      "C": "ZigBee 在工業、建築等自動控制應用",
      "D": "NB-IoT 高耗能、高範圍傳輸為影像聲音傳輸"
    },
    "answer": "D",
    "explanation": "NB-IoT 為窄頻網路，傳輸速度僅適合物聯網感測元件傳輸資料，不適合大量影音資料傳送。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "sourcePages": [
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=79",
    "answerPages": [
      79
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t4-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t4",
    "chapter": "a1-t4",
    "stem": "下列何者網路通訊技術會在資料傳輸完成後讓網路連線自動斷線？",
    "options": {
      "A": "Socket",
      "B": "WebSocket",
      "C": "HTTP",
      "D": "FTP"
    },
    "answer": "C",
    "explanation": "ABD 在資料傳輸完畢後不會斷線， HTTP 在 Server response 後網路會斷線。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
    "sourcePages": [
      77
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=79",
    "answerPages": [
      79
    ],
    "sourceSection": "常見通訊協定與網路層技術",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "C",
    "reviewReason": "HTTP 並不必然在一次回應後斷線；HTTP/1.1 預設支援持續連線。原題未限定版本或 Connection: close，官方答案 C 與解析過度概括。"
  },
  {
    "id": "aiot-guide-a1-t5-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "關於區域網路（Local Area Network, LAN）的特性，下列敘述何者正確？",
    "options": {
      "A": "LAN 是一個覆蓋廣泛地區的網路，如整個城市或國家",
      "B": "LAN 可以跨越路由器連接不同地區的電腦和設備",
      "C": "LAN 是一個覆蓋相對較小的地理範圍，通常在一個建築物或一組建築物內的網路",
      "D": "LAN 是一個不需要物理電纜的無線通信系統"
    },
    "answer": "C",
    "explanation": "區域網路（LAN）指的是覆蓋一個小的地理範圍，如一棟辦公大樓、學校或家庭的電腦網路。它通常用於連接電腦和其他網路設備，以便在有限範圍內共用資源和資訊。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "sourcePages": [
      102
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "網路資料傳輸方式，在以下哪一種情況下，應該選擇使用 TCP 而不是 UDP？",
    "options": {
      "A": "快速傳輸小量數據包",
      "B": "需要確保每個數據包都準確送達",
      "C": "傳輸聲音或影像數據流",
      "D": "對數據傳輸速度要求高於數據完整性"
    },
    "answer": "B",
    "explanation": "在需要可靠數據傳輸的應用中，如文件傳輸、郵件傳送和網路服務器請求，選擇 TCP 是更好的選擇。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "sourcePages": [
      102
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "關於通訊協定 UDP 的特點，下列敘述何者正確？",
    "options": {
      "A": "有連接且可靠",
      "B": "無連接且不保證可靠傳輸",
      "C": "數據封包傳輸有大小限制",
      "D": "傳輸數據之前需要三次握手"
    },
    "answer": "B",
    "explanation": "UDP（用戶數據報協議）是一種無連接的協議，它不保證傳輸的可靠性、順序或重複數據。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "sourcePages": [
      102
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "除官方答案 B 外，C「數據封包傳輸有大小限制」也成立；UDP 長度欄位及 IP 封包條件限制資料報大小，原題存在多個正確選項。"
  },
  {
    "id": "aiot-guide-a1-t5-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "通訊協定 TCP，具備下列哪一項數據傳輸的特性？",
    "options": {
      "A": "速度最優先",
      "B": "數據封包大小",
      "C": "連接導向且可靠傳輸",
      "D": "最佳努力傳輸，不保證順序或傳輸品質"
    },
    "answer": "C",
    "explanation": "連接導向且可靠傳輸。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "sourcePages": [
      102
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "IPv4 位址通常以點分隔符號（.）切割成幾個部分所組成？",
    "options": {
      "A": "2 部分",
      "B": "4 部分",
      "C": "6 部分",
      "D": "8 部分"
    },
    "answer": "B",
    "explanation": "IPv4 位址由四部分組成，每部分為一個 8 位的數字，範圍從 0 到 255，通常以點分隔符號（.）分隔，如 192.168.0.1。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=102",
    "sourcePages": [
      102
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "關於 OPC UA 通訊協定的特點，下列敘述何者正確？",
    "options": {
      "A": "僅限於 Windows 作業系統",
      "B": "具備跨平台特性",
      "C": "專用於數位家庭自動化",
      "D": "僅支援有線連接"
    },
    "answer": "B",
    "explanation": "OPC UA 的一個關鍵特點是它的具備跨平臺特性，可以在多種作業系統和設備上實現。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "sourcePages": [
      103
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "在 OPC UA 資料存取方式中，下列哪一種方法可以訂閱特定事件，被動的接收特定事件發生的通知？",
    "options": {
      "A": "Read/Write Variable",
      "B": "Invoke Method",
      "C": "Event Notification",
      "D": "Data Change Notification"
    },
    "answer": "C",
    "explanation": "當這些事件發生時（例如設備故障或過程警報），用戶會收到通知。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "sourcePages": [
      103
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "在工業物聯網（IIoT）中，下列何者為 MQTT 通訊協定的主要用途？",
    "options": {
      "A": "生產線機器手臂路徑規劃程式設計",
      "B": "作為設備維護日誌記錄格式",
      "C": "即時設備監控和故障預警",
      "D": "產品外觀設計與機構設計"
    },
    "answer": "C",
    "explanation": "工業物聯網中，MQTT 通常用於連接各種感測器和設備，實現即時監控和故障預警。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "sourcePages": [
      103
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=104",
    "answerPages": [
      104
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "在使用 MQTT 通訊協定時，如果擔心以下哪些情況發生，需要啟用 QoS（Quality of Service，服務品質）功能？",
    "options": {
      "A": "消息發送速度過慢",
      "B": "需要加密消息內容",
      "C": "消息可能丟失、重複或需要保證按特定順序到達",
      "D": "消息的顏色和格式需要特定設置"
    },
    "answer": "C",
    "explanation": "MQTT 的 QoS 功能用於確保消息傳輸的可靠性。啟用 QoS 是為了應對消息可能丟失或重複的情況，以及在需要時保證消息按特定順序到達。 QoS 提供了不同級別的消息傳輸保證，如 QoS 0（最多一次）、 QoS 1（至少一次）、 QoS 2 （恰好一次）。選擇合適的 QoS 級別可以根據應用需求和網路條件確保消息的可靠傳輸。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "sourcePages": [
      103
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=105",
    "answerPages": [
      105
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t5-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t5",
    "chapter": "a1-t5",
    "stem": "MQTT 使用下列哪一項協定作為其傳輸層？",
    "options": {
      "A": "UDP",
      "B": "HTTP",
      "C": "TCP",
      "D": "FTP"
    },
    "answer": "C",
    "explanation": "MQTT 應用層通訊協定，其傳輸層是基於 TCP 協議。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=103",
    "sourcePages": [
      103
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=105",
    "answerPages": [
      105
    ],
    "sourceSection": "工業通訊標準與資訊模型",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "關於雲端運算如何協助物聯網完成系統建置，下列敘述何者「不」正確？",
    "options": {
      "A": "提供大量的運算資源",
      "B": "雲端運算讓物聯網設備也能支援虛擬化和容器化技術",
      "C": "提供安全的資料儲存",
      "D": "讓物聯網感測元件不需要擁有較強的運算能力"
    },
    "answer": "B",
    "explanation": "A, C 均為雲服務的特色。 D：在雲運算，的確可以簡化 edge server、閘道器、感測器的設計，使得這些元件無需進行計算。 B：虛擬化與容器化，通常指的是具有較大運算能力的系統，物聯網設備（sensor node/gateway）沒必要。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "sourcePages": [
      113
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "提供開發平台，包含作業系統、程式語言的執行環境、資料庫及網頁伺服器，是下列哪一項雲端服務？",
    "options": {
      "A": "軟體即服務（SaaS）",
      "B": "平台即服務（PaaS）",
      "C": "基礎建設即服務（IaaS）",
      "D": "資料即服務（DaaS）"
    },
    "answer": "B",
    "explanation": "基本的 PaaS 定義。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "sourcePages": [
      113
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "大數據分析工具（如 Hadoop 等），是由於下列哪一項協助物聯網應用實現創新和價值創造？",
    "options": {
      "A": "提供資料儲存和管理功能",
      "B": "提供資料加密和安全性保護機制",
      "C": "提供資料處理和分析能力",
      "D": "提供即時的資料傳輸和訊息處理"
    },
    "answer": "C",
    "explanation": "基本的數據分析定義。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "sourcePages": [
      113
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "下列何者「非」雲端平台在資訊安全方面的主要考量？",
    "options": {
      "A": "身份驗證與存取管理",
      "B": "資料傳輸過程使用加密協定（如 TLS/SSL）",
      "C": "平台提供災害復原計劃",
      "D": "軟體工程安全，提供用戶及應用程式最大權限"
    },
    "answer": "D",
    "explanation": "A, B, C 都是基本平台資訊安全概念。 D：通常是最小權限設計。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "sourcePages": [
      113
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "在物聯網系統中，下列何者為選擇使用雲端技術即時資料處理的主要挑戰？",
    "options": {
      "A": "需要在每個裝置上配置高效能處理器來處理資料",
      "B": "可能會出現較高的網路延遲",
      "C": "無法擴展以支援大量物聯網裝置的連接需求",
      "D": "需要安裝大量本地伺服器來處理和存儲資料"
    },
    "answer": "B",
    "explanation": "A, D：在雲運算，就是簡化 sensor/gateway/edge server/On-premise server 的負擔。C：雲的特色就是容易擴展。 B：相較於 Local/Edge，一路傳輸到雲所需的時間較多。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
    "sourcePages": [
      113,
      114
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "物聯網結合人工智慧技術，兩者將快速匯流，進化為 AIoT，驅動更多智慧應用。下列與 AIoT 技術相關的敘述，何者「不」正確？",
    "options": {
      "A": "無人駕駛計程車、影像及語音辨識、智慧工廠等，都已是 AIoT 的應用實例",
      "B": "人工智慧應用若要普及，行動與終端裝置的發展扮演重要角色",
      "C": "邊緣運算將計算移至雲端平台來處理，如此可以加快資料的處理與傳送速度",
      "D": "邊緣運算架構需克服「低功耗的運算晶片」和「適用於終端的輕量化演算法」二項技術"
    },
    "answer": "C",
    "explanation": "A, B 描述無問題。 C：邊緣運算是將計算移往網路邏輯上的邊緣，會比較靠近源頭，而不是雲。至於 D 可能所有的運算架構都需要克服這兩問題。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "sourcePages": [
      114
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "在智慧健康照護的物聯網應用中，為了實現病患健康資料的即時異常檢測與預警，哪一項技術組合「最」能有效平衡資料處理的效率與傳輸延遲？",
    "options": {
      "A": "結合穿戴式裝置、邊緣運算和分散式機器學習，減少數據傳輸至雲端的需求",
      "B": "使用雲端資料分析與 AI 模型，以實現精準的異常檢測",
      "C": "透過區塊鏈技術加密病患資料，確保資料的安全性和隱私保護",
      "D": "利用虛擬實境技術模擬病患的身體反應，幫助醫療人員進行診斷"
    },
    "answer": "A",
    "explanation": "A 是蠻標準的答案， B 沒有 A 好。C：區塊鏈應用對象不在這， D 與資料處理效率/傳輸延遲無關。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "sourcePages": [
      114
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "在智慧交通的物聯網應用中，下列哪一項技術「最」能有效提升車輛之間的即時通訊，並支援交通狀況的動態調整？",
    "options": {
      "A": "使用區塊鏈技術記錄車輛行駛數據，防止數據篡改",
      "B": "利用雲端計算進行全市交通數據的集中分析與優化",
      "C": "使用大數據分析歷史交通數據，預測高峰期流量並提供導航建議",
      "D": "結合 5G 通訊技術和車聯網（V2V）協議，實現低延遲的車輛間即時通訊"
    },
    "answer": "D",
    "explanation": "V2V born to solve。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "sourcePages": [
      114
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t6-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "MQTT（Message Queuing Telemetry Transport）是一種輕量級的通訊協定，主要用於物聯網（IoT）應用中的設備間通訊。關於 MQTT 通訊協定，下列敘述何者正確？",
    "options": {
      "A": "MQTT 的 QoS 等級用來控制訊息的傳送品質，包括確保訊息到達、確保訊息不重複、確保訊息的順序",
      "B": "MQTT 的消息傳送模式以多對多方式進行",
      "C": "MQTT 的訂閱操作是用來向訊息發布者（Publisher）發送訊息",
      "D": "MQTT 的發佈者會跟 Broker 持續保持連線"
    },
    "answer": "A",
    "explanation": "B：也可以一對多，多數的應用可能也是一對多。 C：向訂閱者發送訊息。 D：應該是建立「長連線 , keepalive connection」，而不是持續保持連線，而通常 keepalive 會設定一個 TTL，例如 60 秒，broker 在 TTL 特定倍數之下持續沒有收到封包，就會與連線者斷線。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=114",
    "sourcePages": [
      114,
      115
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=116",
    "answerPages": [
      116,
      117
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "A",
    "reviewReason": "MQTT 的 QoS、訊息排序、多對多及 Keep Alive 敘述混在一起；發布者可以維持長連線，Keep Alive 不是連線必定到期的 TTL。原題答案唯一性及解析需釐清。"
  },
  {
    "id": "aiot-guide-a1-t6-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t6",
    "chapter": "a1-t6",
    "stem": "以無人機進行自動飛行方式進行輸電電塔巡檢，延伸人力不易到達的地點與執行高風險性的任務，並透過擷取影像與感測器資料蒐集，再由後臺運算與電腦辨識，完成指派任務。下列哪一項通訊協定為長距離無人機傳輸資料方式？",
    "options": {
      "A": "NB-IoT",
      "B": "Bluetooth",
      "C": "Wi-Fi",
      "D": "4G/5G"
    },
    "answer": "D",
    "explanation": "題目得要傳輸影像，所以只剩 4G/5G 可使用。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=115",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=115",
    "sourcePages": [
      115
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=117",
    "answerPages": [
      117
    ],
    "sourceSection": "中介軟體與平台",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "為了防止駭客非法存取，正當使用者必須進行認證，下列哪一項是防護「較」差的認證技術？",
    "options": {
      "A": "靜脈",
      "B": "密碼",
      "C": "瞳孔",
      "D": "指紋"
    },
    "answer": "B",
    "explanation": "認證， A, C, D 都是生物特徵認證，不易偽造。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "sourcePages": [
      124
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "基於安全的考量，將物聯網裝置和一般網路裝置區隔開來是一項可行的方案，下列哪一項技術無法實現此方案？",
    "options": {
      "A": "虛擬區域網路（VLAN）",
      "B": "防火牆（Firewall）",
      "C": "中繼器（Repeater）",
      "D": "使用不同網路識別碼（SSID）"
    },
    "answer": "C",
    "explanation": "network isolation，A, B, D 都可以，而 Repeater 只是用來重整 /放大網路封包，沒有隔離的作用。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "sourcePages": [
      124
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "C",
    "reviewReason": "不同 SSID 本身不保證網路隔離，仍需 VLAN、ACL、防火牆或 SSID 隔離設定。原題 D 沒有交代這些條件，不能無條件認定只有 C 無法隔離。"
  },
  {
    "id": "aiot-guide-a1-t7-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "著名的 Mirai 病毒感染了數十萬台物聯網裝置（例如：無線攝影機、路由器、監視器等）以取得控制權，並進一步採取下列哪一項攻擊來癱瘓物聯網服務？",
    "options": {
      "A": "中間人攻擊（MITM Attack）",
      "B": "分散式阻斷服務攻擊（DDoS Attack）",
      "C": "竊聽攻擊（Eavesdropping Attack）",
      "D": "篡改攻擊（Tampering Attack）"
    },
    "answer": "B",
    "explanation": "殭屍攻擊，依定義就是 B。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "sourcePages": [
      124
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "若 A、B 間的資料傳輸要使用非對稱式金鑰加密，當 A 使用 A 自己的金鑰加密文件後，請問 B 要如何解開？",
    "options": {
      "A": "使用 A 的私有金鑰",
      "B": "使用 A 的公開金鑰",
      "C": "使用 B 的私有金鑰",
      "D": "使用 B 的公開金鑰"
    },
    "answer": "B",
    "explanation": "Asymmetric Encryption 的定義。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=124",
    "sourcePages": [
      124
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "題目只說「A 自己的金鑰」，未指明公鑰或私鑰；官方答案 B 隱含私鑰操作，且易混淆加密保密與數位簽章。"
  },
  {
    "id": "aiot-guide-a1-t7-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "某工廠生產線使用可程式化邏輯控制器（Programmable Logic Controller, PLC）控制裝配線上的機械手臂，下列哪一項措施「無法」防止服務拒絕攻擊（Denial of Service, DoS）的資安漏洞？",
    "options": {
      "A": "限制訪問 IP",
      "B": "安裝防火牆",
      "C": "關閉不必要的通訊埠",
      "D": "設置物理屏障（如鐵殼）保護 PLC 設備"
    },
    "answer": "D",
    "explanation": "A, B, C 都是合理的資安保護措施。 D 僅能用來保護設備不受電磁波影響。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "sourcePages": [
      125
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "某家公司正在開發一個雲端物聯網應用系統，將感測資料上傳雲端以便進行資料分析和流程管理。請問下列哪一項為使用雜湊（Hash）加密的正確時機？",
    "options": {
      "A": "當感測資料包含個人資訊或敏感資料時，以保護使用者隱私",
      "B": "當感測資料需要傳輸至其他裝置時，以確保資料傳輸的完整性",
      "C": "當感測資料需要儲存至雲端時，以避免資料庫遭受黑客攻擊",
      "D": "當感測資料需要進行即時處理時，以確保資料處理的即時性"
    },
    "answer": "B",
    "explanation": "單獨使用 Hash，僅能達到資料完整性的保護。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "sourcePages": [
      125
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "原題把 Hash 稱為加密。雜湊不是加密，且未受保護的雜湊值無法單獨確保遭主動竄改的資料完整性；需釐清信任及認證條件。"
  },
  {
    "id": "aiot-guide-a1-t7-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "在智慧物聯網的解決方案中，下列哪一項對於防止個資及機敏資料洩露沒有幫助？",
    "options": {
      "A": "資料傳輸加密",
      "B": "身份認證及權限管控",
      "C": "資料去識別化",
      "D": "DDoS 監控"
    },
    "answer": "D",
    "explanation": "A, B, C 都是資料安全的保護方式。 DDoS 是攻擊。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "sourcePages": [
      125
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "D",
    "reviewReason": "選項 D 是「DDoS 監控」，但官方解析把它視為「DDoS 攻擊」。監控與攻擊不是同一件事，原解析不能作為排除監控措施的理由。"
  },
  {
    "id": "aiot-guide-a1-t7-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "在物聯網中，哪種機制可確保訊息的發送者無法否認其已發送過該訊息，從而提供不可否認性？",
    "options": {
      "A": "對稱加密",
      "B": "雜湊",
      "C": "防止暴力破解攻擊",
      "D": "數位簽章"
    },
    "answer": "D",
    "explanation": "數位簽章標準定義。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
    "sourcePages": [
      125
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "在物聯網安全中，下列哪一項攻擊屬於阻斷服務攻擊（DoS）的例子？",
    "options": {
      "A": "攻擊者持續發送大量請求使系統資源耗盡",
      "B": "攻擊者竊聽數據傳輸內容",
      "C": "攻擊者破解密碼進入系統",
      "D": "攻擊者篡改通信數據並重發以製造假象"
    },
    "answer": "A",
    "explanation": "阻斷服務攻擊（DoS）是指攻擊者透過發送大量請求使系統無法正常處理其他合法請求，導致服務中斷。此類攻擊常針對網路伺服器或物聯網設備發動。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=126",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=126",
    "sourcePages": [
      126
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t7-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t7",
    "chapter": "a1-t7",
    "stem": "在物聯網系統中，即使設備和平台之間的傳輸已透過 SSL/TLS 加密，下列哪一個問題最「不」可能被攻擊者利用來成功實施資料竊取或惡意操控？",
    "options": {
      "A": "中間人攻擊（Man-in-the-Middle Attack , MitM）導致 SSL/TLS 握手（handshake）過程被攔截",
      "B": "平台和設備的公開金鑰基礎建設（Public Key Infrastructure , PKI）驗證機制已實施雙向驗證",
      "C": "伺服器端使用了過時的加密協議",
      "D": "感測器設備的金鑰生成過程缺乏硬體隨機數支援"
    },
    "answer": "B",
    "explanation": "DoS 的定義。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=126",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=126",
    "sourcePages": [
      126
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=127",
    "answerPages": [
      127
    ],
    "sourceSection": "資安與隱私基本概念",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "題目是 TLS／PKI 的資料竊取與操控風險，但官方解析只有「DoS 的定義」，與題目不對應。"
  },
  {
    "id": "aiot-guide-a1-t8-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "關於熱電偶（Thermocouple），下列敘述何者正確？",
    "options": {
      "A": "是一種量測電流大小的感測器，量測單位為安培",
      "B": "通常由一種金屬導線組成",
      "C": "通常由兩條金屬導線組成，一條黏貼於待測物表面，另一條接地",
      "D": "通常由兩條不同種類的金屬導線組成，且其中一端需焊接在一起"
    },
    "answer": "D",
    "explanation": "熱電偶通常將兩種不同材質的金屬導線的一端焊接在一起，成為溫度感測之接觸點，在金屬受熱產生溫差時，兩金屬間迴路會產生電流，進而生成電位差，透過量測兩金屬導線間之電位差，換算溫度值。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "sourcePages": [
      138
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "關於感測器相關名詞，下列敘述何者「不」正確？",
    "options": {
      "A": "靈敏度（Sensitivity）：感測器測得之電壓訊號與待測物理量之間的比值",
      "B": "遲滯現象（Hysteresis）：感測器進行量測時所產生之時間延遲",
      "C": "精度（Precision）：感測器對於同一待測物理量重複進行多次量測的誤差",
      "D": "準度（Accuracy）：感測器對於待測物理量進行量測，所獲得量測結果與正確值之間的誤差"
    },
    "answer": "B",
    "explanation": "滯後現象（Hysteresis）是指感測器在量測過程中，其量測值從零點上升到達一定值後，在結束量測而其量測值下降回零點的過程中，對同一數值測量的偏差，意即上升曲線與下降曲線並未重合。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "sourcePages": [
      138
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "市面上常見的熱電偶溫度感測器，主要是利用何種原理或效應來測定溫度？",
    "options": {
      "A": "貝爾堤效應（Peltier Effect）",
      "B": "席貝克效應（Seebeck Effect）",
      "C": "奧斯特效應（Oersted Effect）",
      "D": "法拉第效應（Faraday Effect）"
    },
    "answer": "B",
    "explanation": "席貝克效應（Seebeck Effect），當端點存在溫差變化時，兩金屬間迴路會產生電流，進而生成電位差，稱為熱電效應。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "sourcePages": [
      138
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "阿華欲使用電阻式溫度感測器（Pt100）進行溫度量測，已知其線性電阻溫度係數為 0.004，請問下列敘述何者正確？",
    "options": {
      "A": "在 0°C 時，阿華測得的電阻值約為 40 歐姆（Ω）",
      "B": "在 10°C 時，阿華測得的電阻值約為 40 歐姆（Ω）",
      "C": "在 10°C 時，阿華測得的電阻值約為 140 歐姆（Ω）",
      "D": "在 100°C 時，阿華測得的電阻值約為 140 歐姆（Ω）"
    },
    "answer": "D",
    "explanation": "Pt100 是鉑熱電阻，它的阻值跟溫度的變化成正比。 PT100 的阻值與溫度變化關係為：當 PT100 溫度為 0 度時它的阻值為 100 歐姆，在 100 在時它的阻值約為 138.5 歐姆。它的工業原理：當 PT100 在 0 攝氏度的時候他的阻值為 100 歐姆，它的阻值會隨著溫度上升而成勻速增長的。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "sourcePages": [
      138
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "關於感測器的性能與應用，下列敘述何者正確？",
    "options": {
      "A": "若欲量測微小振動，建議選擇靈敏度較低的加速規",
      "B": "熱電偶的線徑會影響其溫度量測範圍",
      "C": "渦電流位移計為接觸式位移計的一種",
      "D": "加速規本體的重量只要比待測物輕，即可避免質量效應影響量測結果"
    },
    "answer": "B",
    "explanation": "熱電偶的線徑會影響其溫度量測範圍。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=138",
    "sourcePages": [
      138
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "市售的熱敏電阻樣式相當多種，但購買的熱敏電阻其電阻特性為隨溫度上昇而減少，以下何種熱敏電阻符合此特性？",
    "options": {
      "A": "PTC",
      "B": "NTC",
      "C": "CTR",
      "D": "NCC"
    },
    "answer": "B",
    "explanation": "NTC（Negative Temperature Coefficient）：此類元件的電阻值會隨著溫度的上升而下降，也就是具有負溫度係數，一般的熱敏電阻就是指此類的元件。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "sourcePages": [
      139
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "一般熱電偶式溫度感測器都以 0℃為標準進行測量，然而測量時儀表是處於環境溫度 25℃，此時應採取何種補償措施方可量測到待測物的溫度？",
    "options": {
      "A": "冷點補償",
      "B": "相位補償",
      "C": "頻率補償",
      "D": "環路補償"
    },
    "answer": "A",
    "explanation": "一般熱電偶資料庫所建構電位差與溫度的關係表中的數值，是假設冷端是處於 0℃般環境所量測之結果，僅能代表兩金屬導線間之溫度差異，因此若要正確量測實際溫度，尚需透過另一環境溫度感測器去取得冷端溫度，此稱為冷點補償。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "sourcePages": [
      139
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=140",
    "answerPages": [
      140,
      141
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "關於誤差（Error），下列敘述何者「不」正確？",
    "options": {
      "A": "誤差=平均值 -標準差",
      "B": "系統誤差為量測系統本身帶有的誤差",
      "C": "隨機誤差為量測過程中隨機產生之誤差",
      "D": "人為誤差為量測儀器操作不當所造成之誤差"
    },
    "answer": "A",
    "explanation": "在使用感測器進行量測的過程中，量測值與真實值之間的差異即為量測誤差。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "sourcePages": [
      139
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=141",
    "answerPages": [
      141
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t8-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "當金屬材料受到外力作用時，其電阻會產生變化，下列何種感測器是利用此一原理製作的？",
    "options": {
      "A": "光感測計",
      "B": "應變規",
      "C": "電流計",
      "D": "溫度計"
    },
    "answer": "B",
    "explanation": "根據歐姆定律（Ohm's Law），電阻值與金屬導線之截面積成反比，而與長度成正比；故當待測物受到壓力時應變規的電阻值會增加，反之受到張力時應變規的電阻值將減少，此稱為壓阻效應（Piezoresistance Effect）。利用上述原理，使用應變規配合惠斯登電橋（Wheatstone bridge）即可透過量測應變規的電阻變化來推估待測物之應變量值。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "sourcePages": [
      139
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=141",
    "answerPages": [
      141
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "官方解析把一般金屬應變規的受壓／受拉電阻變化方向寫反；此處保留官方原文與 B 答案，不以自行修訂冒充官方勘誤。"
  },
  {
    "id": "aiot-guide-a1-t8-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t8",
    "chapter": "a1-t8",
    "stem": "當被測物體因振動所產生的力量傳遞至壓電式振動感測器後，依壓電式振動感測器的特性，會產生下列何者相對應的訊號？",
    "options": {
      "A": "電荷",
      "B": "電阻",
      "C": "電感",
      "D": "電壓"
    },
    "answer": "A",
    "explanation": "壓電式振動感測器乃透過其內的壓電材料在承受由振動所引發的力量時所產生的電荷變化來推估振動量。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
    "sourcePages": [
      139
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=141",
    "answerPages": [
      141
    ],
    "sourceSection": "感測技術基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "A",
    "reviewReason": "壓電元件可產生電荷，但含內建電子電路的 IEPE 壓電感測器也可輸出電壓。題幹未區分元件與完整感測器，A 與 D 的判定取決於輸出型式。"
  },
  {
    "id": "aiot-guide-a1-t9-q01",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "目前最常見的網路堆疊架構 OSI（Open System Interconnection）模型，是將網際網路區分成幾個層級？",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "7"
    },
    "answer": "D",
    "explanation": "OSI（Open System Interconnection）模型為一種電腦間的通訊網路標準架構，共有七層，包含應用層（Application Layer）、表達層（Presentation Layer）、會話層（Session Layer）、傳輸層（Transport Layer）、網路層（Network Layer）、資料鏈結層（Data link Layer）和實體層（Physical Layer）。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "sourcePages": [
      152
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 1,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t9-q02",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "針對網際網路的數據傳輸，常會有資料加密與解密、壓縮及解壓縮的需求，此類功能隸屬於 OSI（Open System Interconnection）模型中的哪一層？",
    "options": {
      "A": "傳輸層（Transport Layer）",
      "B": "會話層（Session Layer）",
      "C": "表達層（Presentation Layer）",
      "D": "應用層（Application Layer）"
    },
    "answer": "C",
    "explanation": "表達層負責將資料格式轉換以重新編碼為網路的標準格式，並提供加密、解密、壓縮、解壓縮等功能。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "sourcePages": [
      152
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 2,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t9-q03",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "請問下列何者不是 I²C 的特性？",
    "options": {
      "A": "接腳數較少",
      "B": "易受線長影響，導致訊號品質不佳",
      "C": "可以有效減少重量及電源的消耗",
      "D": "是一種非同步（Asynchronous）的傳輸協定"
    },
    "answer": "D",
    "explanation": "I²C 是一種同步（Asynchronous）傳輸通訊。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "sourcePages": [
      152
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 3,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "D",
    "reviewReason": "官方解析寫「同步（Asynchronous）」；中文同步與英文非同步矛盾。I²C 是同步介面，官方答案 D 與中文解析可對應，但英文術語須勘誤。"
  },
  {
    "id": "aiot-guide-a1-t9-q04",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "I²C 為嵌入式系統中常用的串列通訊方式，下列何者為 I²C 資料傳輸的特性？",
    "options": {
      "A": "全雙工傳輸",
      "B": "半雙工傳輸",
      "C": "單工傳輸",
      "D": "全雙工傳輸和半雙工傳輸"
    },
    "answer": "B",
    "explanation": "I²C 屬於半雙工傳輸。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "sourcePages": [
      152
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 4,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t9-q05",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "下列何種技術無法支援雙向通訊？",
    "options": {
      "A": "IrDA（紅外線）",
      "B": "UART（Universal Asynchronous Receiver/Transmitter）",
      "C": "SPI（Serial Peripheral Interface）",
      "D": "I²C（Inter-Integrated Circuit）"
    },
    "answer": "B",
    "explanation": "紅外線為單工（單向通訊）。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=152",
    "sourcePages": [
      152
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 5,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "B",
    "reviewReason": "官方答案 B 指向 UART，但解析指紅外線；UART 可雙向通訊，IrDA 亦可雙向，原題未限定單向裝置，不能直接把答案改成 A。"
  },
  {
    "id": "aiot-guide-a1-t9-q06",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "MT Connect 與 OPC UA 為目前國際公認的工業用通訊標準，以下關於兩者的敘述何者不正確？",
    "options": {
      "A": "MT Connect 數據編碼機制為 XML",
      "B": "MT Connect 可讀取機台參數",
      "C": "NodeID 在 OPC UA 的 Information model 中是不能重複的",
      "D": "OPC UA 可對應到 OSI（Open system interconnection）架構的第 5 層"
    },
    "answer": "D",
    "explanation": "OPC UA 可對應到 OSI（Open System Interconnection）架構的第 7 層。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "sourcePages": [
      153
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 6,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t9-q07",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "針對訊號波形分別為正弦與餘弦型式的二時間域訊號，兩者間之相位（Phase）差為？",
    "options": {
      "A": "45 度",
      "B": "90 度",
      "C": "135 度",
      "D": "180 度"
    },
    "answer": "C",
    "explanation": "正弦波與餘弦波的相位差剛好為 90 度。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "sourcePages": [
      153
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 7,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "C",
    "reviewReason": "官方答案 C 是 135 度，官方解析卻寫 90 度（對應 B），答案與解析直接矛盾。"
  },
  {
    "id": "aiot-guide-a1-t9-q08",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "網路拓樸中的樹狀拓樸具有何種優點？",
    "options": {
      "A": "易於推廣，這種結構可以延伸出很多分支和子分支，新的節點和新的分支易於加入網內",
      "B": "方便集中管理",
      "C": "對根節點的依賴性大",
      "D": "可靠度高，能快速找出故障節點"
    },
    "answer": "C",
    "explanation": "樹狀拓樸的優點易於推廣，這種結構可以延伸出很多分支和子分支，新的節點和新的分支易於加入網內。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "sourcePages": [
      153
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 8,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": true,
    "generated": false,
    "aiExplained": false,
    "originalAnswer": "C",
    "reviewReason": "官方答案 C 是對根節點依賴大，並非優點；官方解析則對應 A 的擴展性，答案與解析不符，且其他優點選項也需釐清。"
  },
  {
    "id": "aiot-guide-a1-t9-q09",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "通訊的種類若依收發兩端間時序（Timing）同步的方式則可區分為何種通訊？",
    "options": {
      "A": "串列及並列",
      "B": "同步及非同步",
      "C": "單工、半雙工以及全雙工",
      "D": "有線通訊及無線通訊"
    },
    "answer": "B",
    "explanation": "若依收發兩端間時序（Timing）同步的方式則可區分為同步通訊及非同步通訊。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "sourcePages": [
      153
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 9,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  },
  {
    "id": "aiot-guide-a1-t9-q10",
    "subject": "A1",
    "subjectName": "AIoT 基礎概論",
    "topic": "a1-t9",
    "chapter": "a1-t9",
    "stem": "下列何者非並列通訊缺點？",
    "options": {
      "A": "線路成本高",
      "B": "維修不易",
      "C": "傳輸速率慢",
      "D": "易受干擾"
    },
    "answer": "C",
    "explanation": "並列通訊優點為傳輸速率快，缺點為線路成本高、維修不易、及易受干擾。",
    "source": "經濟部產業發展署 iPAS｜AIoT 科目一官方學習指引（2026-05-28）",
    "sourceKind": "official-guide",
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=153",
    "sourcePages": [
      153
    ],
    "answerUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=154",
    "answerPages": [
      154
    ],
    "sourceSection": "感測訊號與通訊基礎",
    "sourceVersion": "2026-05-28",
    "sourceLicenseUrl": "https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation",
    "number": 10,
    "session": "guide-115-a1",
    "needsContext": false,
    "needsReview": false,
    "generated": false,
    "aiExplained": false
  }
];

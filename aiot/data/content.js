window.APP_CONTENT = {
  "version": "1.0",
  "examSource": "依 115 年官方大綱編寫的章節自評，非官方原題或歷屆試題",
  "updatedAt": "2026-10-01",
  "cert": "AIoT 應用工程師（初級・物聯網類）",
  "subjects": [
    {
      "code": "A1",
      "name": "AIoT 基礎概論",
      "chapters": [
        {
          "id": "a1-t1",
          "title": "AI 基礎概念",
          "summary": "先辨認要預測的結果，再選擇模型與評估方法。AIoT 的資料常帶有時間性、雜訊與不平衡分布，部署時還要同時考量反應時間、裝置記憶體及耗電。模型在開發資料上表現好，不代表在不同機台或新場域仍然可靠。",
          "keyPoints": [
            "分類預測類別，迴歸預測連續數值；分群用於探索未標記資料中的結構。",
            "訓練用資料學習參數，推論使用既有模型產生預測；不可把測試答案帶入訓練。",
            "依機台、受測者或時間切分資料，避免相鄰片段洩漏造成不實的高分。",
            "邊緣部署需量測實際延遲、記憶體與耗電；量化後須重新確認準確度。"
          ],
          "concepts": [
            {
              "term": "監督式學習",
              "definition": "利用有標記的範例學習輸入與目標之間的關係，可處理分類或迴歸。"
            },
            {
              "term": "推論",
              "definition": "以訓練完成的模型處理新輸入；通常不在此階段更新模型參數。"
            },
            {
              "term": "量化",
              "definition": "以較低精度表示權重或運算數值，降低資源需求；效果須在目標硬體驗證。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=8",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t2",
          "title": "AIoT 應用案例",
          "summary": "把場域需求拆成可量測的訊號、可執行的決策與可驗證的效益。例如預測維護要分清楚當下故障診斷與未來壽命預測，智慧農業則要兼顧量測覆蓋率、電池壽命與通訊條件。",
          "keyPoints": [
            "故障診斷回答目前屬於哪種狀態；剩餘壽命預測回答還能使用多久。",
            "融合不同感測來源可補足盲點，但須對齊時間、單位及校正資訊。",
            "現場即時控制通常需本地處理與安全備援，不能只依賴遠端網路。",
            "先定義可量測指標，再比較導入前後的停機、誤報、能耗或良率。"
          ],
          "concepts": [
            {
              "term": "預測性維護",
              "definition": "運用設備資料估計異常或劣化趨勢，支援適時檢查與維修。"
            },
            {
              "term": "感測融合",
              "definition": "結合多種量測來源改善判斷，但不能假設資料越多結果一定越好。"
            },
            {
              "term": "端雲協作",
              "definition": "在端側或閘道器處理即時需求，在雲端彙整資料、分析與管理模型。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=25",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t3",
          "title": "物聯網架構與功能",
          "summary": "從資料如何產生、傳送、處理到使用，理解感測器、致動器、閘道器與應用程式的責任。架構分層是分析工具；真實設備可以同時具有數個角色，設計時仍要清楚標示資料流與控制流。",
          "keyPoints": [
            "感測器將物理量轉為可處理的訊號，致動器依控制命令改變環境。",
            "閘道器可彙整設備、轉換協定、暫存資料及執行邊緣運算。",
            "雲端平台可管理設備與歷史資料；是否即時仍取決於完整處理路徑。",
            "設計時標示設備身分、時間戳記、量測單位與資料流向。"
          ],
          "concepts": [
            {
              "term": "感知層",
              "definition": "以感測與辨識取得場域資訊的部分，例如溫度、振動及位置。"
            },
            {
              "term": "閘道器",
              "definition": "連接不同網路或設備協定的節點，也可加入資料整理與緩存功能。"
            },
            {
              "term": "致動器",
              "definition": "把電訊號轉成實際動作的元件，例如馬達、閥門與繼電器。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=34",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t4",
          "title": "常見通訊協定與網路層技術",
          "summary": "通訊選型需比較資料量、距離、電力、延遲與環境。連線技術與應用層協定屬於不同面向，例如使用 Wi-Fi 連網的設備仍可透過 MQTT 交換訊息；不能只看協定名稱就推定完整系統能力。",
          "keyPoints": [
            "MQTT 使用發布／訂閱；Broker 依主題將訊息送往符合訂閱條件的客戶端。",
            "MQTT QoS 0、1、2 分別代表最多一次、至少一次與恰好一次的協定交付等級。",
            "QoS 1 可能重送，應用端需以訊息識別碼避免重複執行不可重複的動作。",
            "Wi-Fi、BLE、LoRaWAN 與行動網路有不同功耗、範圍及吞吐量取捨。"
          ],
          "concepts": [
            {
              "term": "Broker",
              "definition": "接收客戶端發布內容，並依主題與訂閱關係轉送訊息的服務。"
            },
            {
              "term": "Retained message",
              "definition": "保留於特定 MQTT 主題的最新保留訊息，方便新訂閱者取得最近狀態。"
            },
            {
              "term": "LPWAN",
              "definition": "針對低功耗、遠距離與少量資料設計的廣域網路類型，不適合假設可高速串流影像。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=59",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t5",
          "title": "工業通訊標準與資訊模型",
          "summary": "工業設備連上網路之後，還需要一致的資料含義。除傳輸封包外，應確認設備狀態、量測單位、時間與品質碼的定義，才能讓不同廠牌設備資料被同一套分析流程正確使用。",
          "keyPoints": [
            "OPC UA 同時涵蓋資訊模型、服務與安全機制，不能只把它當作網路接頭。",
            "資訊模型描述資料及其關係，降低不同系統對欄位意義理解不一致的風險。",
            "MTConnect 用一致語意表達設備觀測資訊；應核對設備實作支援的版本與項目。",
            "工業連線需管理憑證、帳號與權限，並檢查時間與資料品質。"
          ],
          "concepts": [
            {
              "term": "資訊模型",
              "definition": "描述資料的類型、含義與關聯，例如把數值連結到所屬設備與工程單位。"
            },
            {
              "term": "互通性",
              "definition": "不同供應商系統能交換並正確理解資料的能力。"
            },
            {
              "term": "資料品質碼",
              "definition": "讓接收端辨識量測值是否有效、過期或存在異常的狀態資訊。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=80",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t6",
          "title": "中介軟體與平台",
          "summary": "平台把設備資料轉成可維護的服務：接收訊息、處理格式、保存紀錄、提供查詢與告警。選擇雲端或邊緣並非二選一；應依網路依賴、維護能力與資料保護需求分工。",
          "keyPoints": [
            "IaaS 提供基礎運算資源，PaaS 提供應用部署平台，SaaS 提供可直接使用的軟體。",
            "訊息佇列可緩衝尖峰流量，仍須設計容量、重試、過期與失敗處理。",
            "需要斷線仍能運作的流程，應在現場保留必要控制與資料暫存能力。",
            "平台維運需觀察連線數、處理延遲、錯誤率、佇列深度與成本。"
          ],
          "concepts": [
            {
              "term": "中介軟體",
              "definition": "位於設備、資料服務與應用之間，提供訊息交換或整合功能的軟體。"
            },
            {
              "term": "Store-and-forward",
              "definition": "連線不可用時先保存資料，恢復後依規則補傳。"
            },
            {
              "term": "可觀測性",
              "definition": "透過日誌、指標與追蹤資料理解系統行為並找出問題。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=106",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t7",
          "title": "資安與隱私基本概念",
          "summary": "安全設計須從設備身分、通訊到平台權限一併規劃。加密、雜湊與數位簽章解決不同問題；保護個人資料則還需要限定蒐集目的、保存期限與可存取的人員。",
          "keyPoints": [
            "機密性關注誰能讀取資料，完整性關注是否遭竄改，可用性關注服務能否正常使用。",
            "雜湊不是可逆的加密；需要驗證來源時可依用途選用 MAC 或數位簽章。",
            "傳輸加密仍需要正確驗證端點，不能忽略憑證錯誤或把所有設備共用同一祕密。",
            "採最小權限、更新管理與備援復原；減少不必要的敏感原始資料上傳。"
          ],
          "concepts": [
            {
              "term": "最小權限",
              "definition": "帳號與設備只取得工作所需的權限，並依生命週期撤銷不再需要的存取。"
            },
            {
              "term": "雙向驗證",
              "definition": "通訊雙方都驗證對方身分；採用 TLS 時可用客戶端與伺服器憑證實現。"
            },
            {
              "term": "資料最小化",
              "definition": "只蒐集與目的相關且必要的資料，並設定保留與刪除規則。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=118",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t8",
          "title": "感測技術基礎",
          "summary": "先確認量程、精確度、反應時間與環境條件，再挑選感測器。量測值與真實狀態之間存在誤差，單次看似合理的讀值不代表感測器已校正，也不能把重複性與準確度混為一談。",
          "keyPoints": [
            "靈敏度描述輸入變化造成的輸出變化；量程則是可量測的範圍。",
            "重複量測很接近代表重複性好，但平均值仍可能因偏移而不準。",
            "熱電偶利用熱電效應，量測時須考慮參考端溫度。",
            "NTC 熱敏電阻溫度升高時阻值通常下降；使用前仍須核對元件曲線。"
          ],
          "concepts": [
            {
              "term": "校正",
              "definition": "以可追溯的參考量比對量測結果，估計誤差；是否調整須另外確認。"
            },
            {
              "term": "遲滯",
              "definition": "同一輸入因先前上升或下降路徑不同而產生不同輸出，並非單純延遲。"
            },
            {
              "term": "冷端補償",
              "definition": "考慮熱電偶參考接點的溫度，將熱電勢正確換算成量測端溫度。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=128",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        },
        {
          "id": "a1-t9",
          "title": "感測訊號與通訊基礎",
          "summary": "感測資料進入軟體前，常需先調整訊號幅度、移除不需要的頻率成分，再完成取樣與量化。短距離電路介面與跨網路協定的目的不同，設計時要確認電氣條件與時序。",
          "keyPoints": [
            "取樣率描述每秒取樣次數，解析度描述每次取樣可區分的數值層級。",
            "輸入超過 ADC 容許範圍可能飽和或損壞；不能只靠程式修正硬體超限。",
            "標準 I²C 使用 SDA 與 SCL；UART 通常不共用時鐘，雙方須約定相同通訊參數。",
            "SPI 的時鐘極性與相位、I²C 的位址與上拉、UART 的電位與鮑率均需核對。"
          ],
          "concepts": [
            {
              "term": "ADC",
              "definition": "將類比輸入轉換為離散數位代碼的電路；可表示層級與位元數有關。"
            },
            {
              "term": "抗混疊濾波",
              "definition": "在取樣前抑制過高的頻率成分，避免它們在取樣後被誤認為較低頻率。"
            },
            {
              "term": "同步通訊",
              "definition": "通訊雙方依共同時序或時鐘協調資料傳送，例如標準 I²C。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=142",
          "sourceNote": "對照官方科目一學習指引；本站自行整理"
        }
      ]
    },
    {
      "code": "A2",
      "name": "物聯網系統與應用",
      "chapters": [
        {
          "id": "a2-t1",
          "title": "系統元件與架構",
          "summary": "以完整資料生命週期規劃系統：設備擷取、閘道整理、平台保存、應用判斷與現場回饋。每個環節都應有清楚責任與失效處理，特別要區分可延後上傳的紀錄與不能延遲的安全動作。",
          "keyPoints": [
            "以需求與風險決定哪些決策留在現場、哪些分析放到雲端。",
            "區分遙測狀態與控制命令，命令需有授權、有效期限及執行回覆。",
            "為設備設定穩定識別碼；記錄資料產生時間與接收時間。",
            "設計離線緩存、重試、重複資料處理與復原流程。"
          ],
          "concepts": [
            {
              "term": "資料流",
              "definition": "資料從來源、轉換、儲存到使用者的傳遞路徑。"
            },
            {
              "term": "控制閉環",
              "definition": "以量測結果判斷並調整致動器，再量測調整後狀態的回饋流程。"
            },
            {
              "term": "失效安全",
              "definition": "系統故障時進入事先定義的安全狀態；需依場域危害評估設計。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        },
        {
          "id": "a2-t2",
          "title": "簡易系統故障問題判斷與排除",
          "summary": "排查時沿資料路徑逐層縮小範圍，保留時間戳記與觀測證據。不要直接把所有異常歸因於網路，也不要用反覆重啟取代找出原因；先區分電力、訊號、連線、認證、資料格式與應用問題。",
          "keyPoints": [
            "先確認供電、接線與環境，再檢查連線與軟體設定。",
            "能解析 DNS 不等於能建立連線；建立 TCP 連線也不等於應用認證成功。",
            "比對最後正常時間、變更紀錄與錯誤訊息，控制每次變更的變因。",
            "重試應有間隔、退避與上限，避免同時重連壓垮系統。"
          ],
          "concepts": [
            {
              "term": "根因",
              "definition": "導致故障的基礎原因，可能與使用者看到的表面症狀不同。"
            },
            {
              "term": "基準值",
              "definition": "正常運作時的量測與設定，供故障時比較差異。"
            },
            {
              "term": "指數退避",
              "definition": "失敗後逐步增加重試等待時間，常搭配隨機抖動分散請求。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        },
        {
          "id": "a2-t3",
          "title": "物聯網資訊安全",
          "summary": "設備生命週期從出廠、佈署到退役都需要安全管理。隔離網路、加密通訊與最小權限需一起使用，並建立韌體更新、金鑰輪替、事件處置及備份復原流程。",
          "keyPoints": [
            "每台設備宜具可管理的個別身分，退役或遺失時能撤銷。",
            "網段分離還要搭配實際存取規則，不是更換 Wi-Fi 名稱就完成隔離。",
            "韌體更新應驗證可信來源與完整性，並規劃失敗回復。",
            "對外服務應限流、記錄異常與保留復原能力，避免過度蒐集敏感日誌。"
          ],
          "concepts": [
            {
              "term": "裝置身分",
              "definition": "用於辨識與授權個別設備的帳號、金鑰或憑證。"
            },
            {
              "term": "網路分段",
              "definition": "將不同信任程度的設備分區，透過規則限制可通行的流量。"
            },
            {
              "term": "安全更新",
              "definition": "只接受可信且驗證通過的軟體版本，並管理更新失敗與回復。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        },
        {
          "id": "a2-t4",
          "title": "物聯網硬體設計基礎",
          "summary": "硬體整合應同時核對電源、電位、時序、量測範圍與驅動能力。元件能接上相同形狀的接頭，不表示可以直接互接；資料表與接線圖是確認相容性的必要依據。",
          "keyPoints": [
            "檢查供電與 GPIO 耐壓，必要時使用電平轉換、隔離與保護。",
            "馬達與繼電器等負載需適合的驅動電路，不可只依 GPIO 邏輯判斷。",
            "量測功耗須包含待機、採樣、運算與無線傳輸，不能只看單一時刻。",
            "選型亦需確認溫度、防護、電磁干擾與維修條件。"
          ],
          "concepts": [
            {
              "term": "GPIO",
              "definition": "可設定為輸入或輸出的通用數位腳位，須遵守電壓與電流限制。"
            },
            {
              "term": "ADC 解析度",
              "definition": "位元數所決定的離散代碼數；N 位元通常有 2 的 N 次方個代碼。"
            },
            {
              "term": "電平轉換",
              "definition": "在不同邏輯電壓的電路間轉換訊號，使輸入輸出符合規格。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        },
        {
          "id": "a2-t5",
          "title": "雲端環境數據收集與平台設計",
          "summary": "可靠資料平台需要一致格式、時間與識別方式，也要能面對掉線、重送與不同版本的設備。儲存量測數字時應一起保留單位與品質，避免看似完整的資料導致錯誤分析。",
          "keyPoints": [
            "資料結構包含設備識別碼、量測時間、值、單位與結構版本。",
            "區分事件時間與接收時間，遲到資料需有明確處理規則。",
            "以穩定事件識別碼去重，重送不應造成重複計费或重複動作。",
            "選擇儲存與索引方式時考慮查詢需求、保存期間、流量及成本。"
          ],
          "concepts": [
            {
              "term": "冪等性",
              "definition": "相同操作重複執行仍得到與一次執行相同的預期效果。"
            },
            {
              "term": "結構版本",
              "definition": "標示資料欄位格式的版本，讓接收端能相容處理新舊裝置。"
            },
            {
              "term": "時序資料",
              "definition": "依時間排列的量測或事件紀錄，常用於趨勢、告警及設備分析。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        },
        {
          "id": "a2-t6",
          "title": "智慧製造流程優化與成本控制",
          "summary": "改善需連結現場目標，先量測現況再評估試點成效。單看設備上線數或模型準確率不足以證明效益；應追蹤停機、報廢、能耗與總持有成本，並檢查產量及產品組合差異。",
          "keyPoints": [
            "OEE 由可用率、性能率與品質率相乘，三項都以比例帶入。",
            "先定義基準期間與比較條件，避免把產量下降造成的節電當成效率提升。",
            "成本估算包含設備、安裝、連線、維運、更新與人員訓練。",
            "試點應有可接受的錯誤範圍、效益目標與停止或擴大條件。"
          ],
          "concepts": [
            {
              "term": "OEE",
              "definition": "設備綜合效率，用可用率、性能率、品質率的乘積衡量設備利用情況。"
            },
            {
              "term": "TCO",
              "definition": "總持有成本，除了購入費用，也納入使用期間的維運與相關成本。"
            },
            {
              "term": "單位產出能耗",
              "definition": "把耗電等能源使用量除以可比較的產出量，用於觀察效率變化。"
            }
          ],
          "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
          "sourceNote": "對照官方簡章評鑑內容；本站自行整理"
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "aiot-study-a1-001",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t1",
      "stem": "某模型輸出的是「未來一小時預估用電度數」，這個任務屬於哪一類？",
      "options": {
        "A": "迴歸",
        "B": "影像分割",
        "C": "資料分群",
        "D": "身分驗證"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=9",
      "sourcePage": 9,
      "session": "study-115",
      "number": 1,
      "explanation": "輸出為連續數值，因此屬於迴歸；若輸出高、中、低等類別才是分類。",
      "concept": "分類與迴歸",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-002",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t1",
      "stem": "設備端已載入完成訓練的模型，用新振動資料判斷是否異常，且未更新模型權重。此時主要在做什麼？",
      "options": {
        "A": "資料標記",
        "B": "模型推論",
        "C": "模型訓練",
        "D": "權重初始化"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 2,
      "explanation": "套用既有模型處理新資料是推論。訓練會根據資料與學習目標調整參數。",
      "concept": "訓練與推論",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-003",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t2",
      "stem": "農田監測設備每 30 分鐘只需傳送溫度和濕度，需以電池運作並涵蓋遠距離。選型時最應優先檢查哪一組條件？",
      "options": {
        "A": "螢幕色彩與解析度",
        "B": "影片壓縮率與播放格數",
        "C": "無線涵蓋、每次傳輸耗電與資料量",
        "D": "鍵盤語言與列印速度"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=25",
      "sourcePage": 25,
      "session": "study-115",
      "number": 3,
      "explanation": "少量、低頻的環境資料需要匹配無線涵蓋與電池預算；不應以影音串流需求決定設備規格。",
      "concept": "場域需求分析",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-004",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t2",
      "stem": "工廠同時使用影像與距離感測器辨識障礙物，整合前最需要確認什麼？",
      "options": {
        "A": "所有資料檔名長度相同",
        "B": "兩個感測器必須同品牌",
        "C": "所有感測器輸出都改成文字",
        "D": "量測時間與座標能正確對齊"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=25",
      "sourcePage": 25,
      "session": "study-115",
      "number": 4,
      "explanation": "若時間或座標未對齊，兩個觀測可能指向不同物體或時刻，融合後反而造成誤判。",
      "concept": "感測融合",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-005",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t3",
      "stem": "溫室系統中，哪個元件主要負責依命令打開水流？",
      "options": {
        "A": "電磁閥",
        "B": "溫度感測器",
        "C": "資料庫索引",
        "D": "網路時間服務"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=34",
      "sourcePage": 34,
      "session": "study-115",
      "number": 5,
      "explanation": "電磁閥是致動元件，可依電訊號改變水流；感測器的主要任務則是取得量測。",
      "concept": "感測與致動",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-006",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t3",
      "stem": "現場數台設備使用不同資料格式，需先整理後再上傳平台。最適合將這項工作安排在哪個角色？",
      "options": {
        "A": "僅供顯示的 LED",
        "B": "具協定與格式轉換功能的閘道器",
        "C": "只記錄網址的書籤",
        "D": "無供電的備用電纜"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=34",
      "sourcePage": 34,
      "session": "study-115",
      "number": 6,
      "explanation": "閘道器可連接不同設備協定，將資料整理為上層平台可使用的格式。",
      "concept": "閘道器角色",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-007",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t4",
      "stem": "使用 MQTT 的設備因 QoS 1 重送，伺服器收到同一事件兩次。對需要避免重複計數的系統，何者適當？",
      "options": {
        "A": "將第二次訊息一律當成攻擊",
        "B": "假設協定絕不會重複傳送",
        "C": "用穩定事件識別碼判斷是否已處理",
        "D": "關閉所有裝置的時間紀錄"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=76",
      "sourcePage": 76,
      "session": "study-115",
      "number": 7,
      "explanation": "QoS 1 允許重送。業務端仍須以事件識別碼或其他冪等設計避免重複累加。",
      "concept": "MQTT QoS 1",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-008",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t4",
      "stem": "新訂閱者加入某狀態主題時，希望立即取得先前留下的最新狀態。MQTT 的哪項功能與此需求最直接相關？",
      "options": {
        "A": "修改裝置 MAC 位址",
        "B": "停用 Broker",
        "C": "縮短感測器導線",
        "D": "Retained message"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=77",
      "sourcePage": 77,
      "session": "study-115",
      "number": 8,
      "explanation": "Retained message 可由 Broker 保留主題的最近保留值，並在新訂閱建立時依規則送出。",
      "concept": "MQTT 保留訊息",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-009",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t5",
      "stem": "兩台設備都傳送數值 50，但一台單位是 °C，另一台是 °F。整合時應優先補上哪種資訊？",
      "options": {
        "A": "工程單位與欄位語意",
        "B": "網頁背景色",
        "C": "操作者桌面照片",
        "D": "相同的檔案壓縮密碼"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=80",
      "sourcePage": 80,
      "session": "study-115",
      "number": 9,
      "explanation": "資料傳得通不等於含義相同。資訊模型需要表達單位與語意，才可正確轉換和比較。",
      "concept": "資訊模型",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-010",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t5",
      "stem": "跨廠牌工業設備整合除了能連線，還需要一致理解設備資料。OPC UA 的哪個面向最能支援此需求？",
      "options": {
        "A": "只指定同一品牌的網路線",
        "B": "資訊模型與標準化服務",
        "C": "要求所有設備停用認證",
        "D": "只更改 IP 位址最後一碼"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=80",
      "sourcePage": 80,
      "session": "study-115",
      "number": 10,
      "explanation": "資訊模型與服務有助描述及存取設備資料；只統一線材或位址不能解決資料含義差異。",
      "concept": "OPC UA",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-011",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t6",
      "stem": "場域網路偶爾中斷，但量測紀錄需在恢復後補上。最適合哪種設計？",
      "options": {
        "A": "斷線時永久刪除讀值",
        "B": "要求感測器完全停止量測",
        "C": "本地暫存並於重連後補傳",
        "D": "把所有錯誤訊息關閉"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=106",
      "sourcePage": 106,
      "session": "study-115",
      "number": 11,
      "explanation": "先保存後轉送可降低斷線期間資料流失，仍需設計容量上限、補傳順序與去重。",
      "concept": "斷線緩存",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-012",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t6",
      "stem": "團隊希望部署程式時由服務商管理執行環境，自己主要維護應用程式。這最接近哪種服務模式？",
      "options": {
        "A": "SaaS：只使用現成軟體",
        "B": "自行建置機房所有硬體",
        "C": "離線文字編輯器",
        "D": "PaaS：使用代管應用平台"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=113",
      "sourcePage": 113,
      "session": "study-115",
      "number": 12,
      "explanation": "PaaS 著重提供應用部署與執行平台，讓團隊較少直接管理底層環境。",
      "concept": "雲端服務模式",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-013",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t7",
      "stem": "一台只需上傳溫度的設備被授予刪除所有使用者資料的權限。最應採取哪項改進？",
      "options": {
        "A": "依設備工作縮小權限",
        "B": "把刪除權限發給更多設備",
        "C": "停用所有稽核紀錄",
        "D": "只更換儀表板字型"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=118",
      "sourcePage": 118,
      "session": "study-115",
      "number": 13,
      "explanation": "設備不需要的高權限擴大受入侵後的影響，應依最小權限原則調整。",
      "concept": "最小權限",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-014",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t7",
      "stem": "系統要證明更新檔來自持有特定私鑰的發布者，且檔案未遭竄改。哪個機制最符合需求？",
      "options": {
        "A": "只改用較短檔名",
        "B": "驗證數位簽章",
        "C": "把檔案轉成 Base64",
        "D": "在網站顯示鎖頭圖片"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=125",
      "sourcePage": 125,
      "session": "study-115",
      "number": 14,
      "explanation": "以可信公鑰驗證數位簽章可檢查來源與內容完整性；Base64 只是編碼。",
      "concept": "數位簽章",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-015",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t8",
      "stem": "一個感測器重複量測標準 25 °C 熱源，每次都顯示約 28 °C。最合理的初步判斷是什麼？",
      "options": {
        "A": "因為讀值一致，所以完全準確",
        "B": "它沒有任何誤差",
        "C": "可能有固定偏移，需比對校正",
        "D": "一定是網路頻寬不足"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=128",
      "sourcePage": 128,
      "session": "study-115",
      "number": 15,
      "explanation": "讀值集中代表重複性較好，但與參考值的差距提示可能存在系統偏移。",
      "concept": "精密度與準確度",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-016",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t8",
      "stem": "已確認某熱敏電阻為 NTC，且在規定工作範圍內使用。溫度上升時，其阻值通常如何變化？",
      "options": {
        "A": "必定維持不變",
        "B": "必定變成無限大",
        "C": "與溫度無關且完全隨機",
        "D": "下降"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=139",
      "sourcePage": 139,
      "session": "study-115",
      "number": 16,
      "explanation": "NTC 為負溫度係數，阻值通常隨溫度上升而降低；實際換算依元件特性曲線。",
      "concept": "NTC",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-017",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t9",
      "stem": "標準 I²C 介面中，哪一組訊號分別負責資料與時鐘？",
      "options": {
        "A": "SDA 與 SCL",
        "B": "TX 與 RX",
        "C": "MOSI 與 CS",
        "D": "VCC 與 GND"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=142",
      "sourcePage": 142,
      "session": "study-115",
      "number": 17,
      "explanation": "標準 I²C 使用 SDA 傳遞資料，SCL 提供時序。電源與接地不屬於這兩條通訊訊號線。",
      "concept": "I²C 訊號",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a1-018",
      "subject": "A1",
      "subjectName": "AIoT 基礎概論",
      "topic": "a1-t9",
      "stem": "量測前已知道訊號中含有超出取樣能力的高頻成分。應在 ADC 取樣前加入什麼以降低混疊？",
      "options": {
        "A": "只更改檔名",
        "B": "適當的類比低通濾波器",
        "C": "移除所有接地線",
        "D": "提高螢幕亮度"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf#page=142",
      "sourcePage": 142,
      "session": "study-115",
      "number": 18,
      "explanation": "混疊一旦在取樣時發生，數位資料可能已無法區分原始高低頻；取樣前需抑制不需要的高頻成分。",
      "concept": "取樣與混疊",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-019",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t1",
      "stem": "遠端平台中斷時，設備仍需執行事先定義的安全停機。哪種設計最適當？",
      "options": {
        "A": "等待雲端重新上線才處理",
        "B": "一律繼續目前動作",
        "C": "在現場保留必要的安全控制",
        "D": "自動刪除所有設備設定"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 19,
      "explanation": "無法依賴遠端網路的安全功能應在現場具備可用的控制與失效處理，並依風險評估驗證。",
      "concept": "現場控制與安全",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-020",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t1",
      "stem": "一筆遠端開閥命令在網路中延遲了數小時才到達。為避免過期命令被執行，命令設計應包含什麼？",
      "options": {
        "A": "固定背景顏色",
        "B": "任意增加字元數",
        "C": "相同的使用者暱稱",
        "D": "有效期限與可驗證的命令識別碼"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 20,
      "explanation": "有效期限可拒絕過期命令；識別碼則有助辨識重送與追蹤執行情況，仍須驗證授權。",
      "concept": "控制命令設計",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-021",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t2",
      "stem": "設備可以取得 IP 位址，也能連上伺服器，但收到「未授權」回覆。下一步最合理的是？",
      "options": {
        "A": "檢查設備憑證、帳號及權限",
        "B": "立即更換所有感測器",
        "C": "增加 ADC 位元數",
        "D": "調高室內照明"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 21,
      "explanation": "應用已回覆未授權，應沿認證與授權設定調查，而非先假定感測器硬體故障。",
      "concept": "分層排錯",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-022",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t2",
      "stem": "大量設備因平台維護同時斷線，恢復時應如何重連以減少流量尖峰？",
      "options": {
        "A": "所有設備每毫秒同步嘗試",
        "B": "採退避並加入隨機等待",
        "C": "持續建立不限數量的連線",
        "D": "永久停用重新連線"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 22,
      "explanation": "退避降低失敗重試壓力，隨機等待可分散設備的重連時間，減少同步尖峰。",
      "concept": "重試控制",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-023",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t3",
      "stem": "一台設備遺失，系統仍保存每台設備獨立的憑證。最合適的處理是？",
      "options": {
        "A": "在網頁刪除設備圖片即可",
        "B": "公開所有裝置私鑰",
        "C": "撤銷該設備存取資格並檢查異常紀錄",
        "D": "忽略，因為同型號設備仍在使用"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 23,
      "explanation": "個別身分可支援針對遺失設備撤銷權限，並透過紀錄確認是否曾發生異常存取。",
      "concept": "設備生命週期安全",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-024",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t3",
      "stem": "更新服務提供新的韌體檔案。裝置安裝前最重要的安全檢查之一是什麼？",
      "options": {
        "A": "檔案名稱是否好記",
        "B": "檔案是否使用彩色圖示",
        "C": "下載完成的時間是否整點",
        "D": "驗證可信發布者簽章與檔案完整性"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 24,
      "explanation": "只完成下載不足以信任韌體；應驗證來源與完整性，再依安全更新流程安裝。",
      "concept": "安全韌體更新",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-025",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t4",
      "stem": "3.3 V 微控制器的輸入腳位不耐 5 V，而感測器輸出為 5 V 邏輯。正確做法是？",
      "options": {
        "A": "採用符合訊號方向與速度的電平轉換",
        "B": "直接相接並期待軟體修正",
        "C": "只把變數名稱改成 3.3 V",
        "D": "將兩裝置所有電源短接"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 25,
      "explanation": "GPIO 耐壓是硬體限制，需要適當電平轉換或改用相容元件，不能靠程式修正。",
      "concept": "電氣相容性",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-026",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t4",
      "stem": "理想 10 位元 ADC 可提供多少個不同的數位輸出代碼？",
      "options": {
        "A": "10",
        "B": "1024",
        "C": "1000",
        "D": "1023"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 26,
      "explanation": "10 位元可形成 2¹⁰＝1024 種組合；若從 0 起算，最大代碼是 1023。",
      "concept": "ADC 位元數",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-027",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t5",
      "stem": "感測器補傳昨天的量測，今天才被平台接收。為正確呈現昨天的趨勢，應使用哪個時間？",
      "options": {
        "A": "瀏覽器開啟頁面的時間",
        "B": "報表下載完成的時間",
        "C": "資料實際量測的事件時間",
        "D": "資料庫重新啟動時間"
      },
      "answer": "C",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 27,
      "explanation": "趨勢應依實際事件時間排列；同時保留接收時間可分析延遲與補傳行為。",
      "concept": "事件時間",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-028",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t5",
      "stem": "同一筆資料可能重送，平台卻只能讓同一次量測計入一次。最合適的儲存設計是？",
      "options": {
        "A": "每次收到都建立新隨機 ID",
        "B": "只依訊息長度判斷重複",
        "C": "關閉所有備份",
        "D": "以穩定事件 ID 建立唯一性檢查"
      },
      "answer": "D",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 28,
      "explanation": "穩定事件 ID 讓平台辨識同一次量測的重送，唯一性檢查可避免重複資料。",
      "concept": "資料去重與冪等性",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-029",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t6",
      "stem": "某設備可用率 90%、性能率 80%、品質率 95%。OEE 是多少？",
      "options": {
        "A": "68.4%",
        "B": "88.3%",
        "C": "265%",
        "D": "76%"
      },
      "answer": "A",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 29,
      "explanation": "OEE＝0.90×0.80×0.95＝0.684，即 68.4%。比例應相乘，不能直接加總或取算術平均。",
      "concept": "OEE",
      "aiExplained": true
    },
    {
      "id": "aiot-study-a2-030",
      "subject": "A2",
      "subjectName": "物聯網系統與應用",
      "topic": "a2-t6",
      "stem": "改善後工廠總用電減少，但產量也大幅下降。要初步比較能源效率，最應再查看什麼？",
      "options": {
        "A": "辦公室椅子數",
        "B": "在可比較產品條件下的單位產出能耗",
        "C": "儀表板使用的色彩",
        "D": "監控畫面的像素數"
      },
      "answer": "B",
      "needsContext": false,
      "source": "依官方大綱編寫・章節自評",
      "sourceKind": "original-study",
      "srcUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf#page=8",
      "sourcePage": 8,
      "session": "study-115",
      "number": 30,
      "explanation": "總量受產量影響；將能源除以可比較產出並控制產品組合等條件，更有助判斷效率。",
      "concept": "效益量測",
      "aiExplained": true
    }
  ],
  "examInfo": {
    "verifiedAt": "2026-10-01",
    "level": "初級",
    "track": "物聯網類",
    "examDate": "2026-10-31",
    "minutesPerSubject": 75,
    "officialQuestionCount": null,
    "questionCountNote": "目前查得的官方簡章未載明學科題數；本站練習題數不代表正式考試題數。",
    "passingRule": "同次報考所屬類別兩科，平均達 70 分且每科至少 60 分；分次報考則每科均須達 70 分。",
    "otherTracks": [
      {
        "name": "機器聯網類",
        "subjects": [
          "AIoT 基礎概論",
          "機器聯網基礎應用實作"
        ],
        "practicalMinutes": 120
      },
      {
        "name": "感知系統類",
        "subjects": [
          "AIoT 基礎概論",
          "感測器信號調節實務應用"
        ],
        "practicalMinutes": 120
      }
    ],
    "sourceUrl": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf"
  },
  "sources": [
    {
      "name": "115 年度 AIoT 應用工程師能力鑑定簡章（初級）1150410 版",
      "url": "https://www.ipas.org.tw/api/proxy/uploads/certification/AIOT/115年度AIoT應用工程師能力鑑定簡章(初級)_1150410_20260410114755.pdf"
    },
    {
      "name": "AIoT 基礎概論官方學習指引（2026-05-28 上架）",
      "url": "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/33454d0f6a944794a82cee435c427a6d/AIoT應用工程師(初級)-學習指引-科目1_AIoT基礎概論_20260528092813.pdf"
    }
  ]
};

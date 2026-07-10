/* ============================================================
   ai.js — 多模型 AI 客戶端
   支援 OpenAI 相容 / Anthropic / Gemini 三種請求格式
   內建 MiniMax 國際版；連線可自動走 Netlify 代理以解決 CORS
   ============================================================ */
(function (global) {
  "use strict";

  var PROXY_URL = "/api/ai-proxy";

  // 供應商預設。shape 決定請求/解析格式。
  var PROVIDERS = {
    minimax:   { label: "MiniMax（國際版）", shape: "openai", baseUrl: "https://api.minimax.io/v1", path: "/text/chatcompletion_v2", model: "MiniMax-Text-01", showBase: false },
    openai:    { label: "OpenAI",            shape: "openai", baseUrl: "https://api.openai.com/v1",  path: "/chat/completions", model: "gpt-4o-mini", showBase: false },
    anthropic: { label: "Anthropic Claude",  shape: "anthropic", baseUrl: "https://api.anthropic.com", path: "/v1/messages", model: "claude-3-5-sonnet-latest", showBase: false },
    gemini:    { label: "Google Gemini",     shape: "gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", path: "", model: "gemini-1.5-flash", showBase: false },
    deepseek:  { label: "DeepSeek",          shape: "openai", baseUrl: "https://api.deepseek.com",   path: "/chat/completions", model: "deepseek-chat", showBase: false },
    openrouter:{ label: "OpenRouter",        shape: "openai", baseUrl: "https://openrouter.ai/api/v1", path: "/chat/completions", model: "openai/gpt-4o-mini", showBase: false },
    custom:    { label: "自訂（OpenAI 相容）", shape: "openai", baseUrl: "", path: "/chat/completions", model: "", showBase: true }
  };

  var _transport = null; // 快取自動判斷結果："direct" | "proxy"

  function cfg() {
    var a = Store.ai();
    var preset = PROVIDERS[a.provider] || PROVIDERS.custom;
    return {
      provider: a.provider,
      shape: preset.shape,
      key: (a.key || "").trim(),
      model: (a.model || preset.model || "").trim(),
      baseUrl: (a.baseUrl || preset.baseUrl || "").replace(/\/+$/, ""),
      path: (a.path || preset.path || ""),
      connMode: a.connMode || "auto"
    };
  }

  /* ---- 連線方式判斷 ---- */
  function decideTransport(mode) {
    if (mode === "direct") return Promise.resolve("direct");
    if (mode === "proxy") return Promise.resolve("proxy");
    if (_transport) return Promise.resolve(_transport);
    // auto：file:// 無函式 → 直連；否則探測代理健康狀態
    if (location.protocol === "file:") { _transport = "direct"; return Promise.resolve("direct"); }
    return fetch(PROXY_URL, { method: "GET" })
      .then(function (r) { _transport = (r.ok ? "proxy" : "direct"); return _transport; })
      .catch(function () { _transport = "direct"; return _transport; });
  }
  function resetTransport() { _transport = null; }

  /* ---- 組請求（依 shape）---- */
  function buildRequest(c, messages, opts) {
    var temp = (opts && opts.temperature != null) ? opts.temperature : 0.6;
    temp = Math.max(0.01, Math.min(1, temp));   // 多數供應商（含 MiniMax）要求 0 < temperature ≤ 1
    var maxT = (opts && opts.maxTokens) || 2600;
    var sys = "", chat = [];
    messages.forEach(function (m) {
      if (m.role === "system") sys += (sys ? "\n" : "") + m.content;
      else chat.push(m);
    });

    if (c.shape === "anthropic") {
      return {
        url: c.baseUrl + c.path,
        headers: { "content-type": "application/json", "x-api-key": c.key, "anthropic-version": "2023-06-01" },
        directHeaders: { "anthropic-dangerous-direct-browser-access": "true" },
        payload: { model: c.model, max_tokens: maxT, temperature: temp, system: sys,
          messages: chat.map(function (m) { return { role: m.role === "assistant" ? "assistant" : "user", content: m.content }; }) }
      };
    }
    if (c.shape === "gemini") {
      var contents = chat.map(function (m) {
        return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] };
      });
      var body = { contents: contents, generationConfig: { temperature: temp, maxOutputTokens: maxT } };
      if (sys) body.systemInstruction = { parts: [{ text: sys }] };
      return {
        url: c.baseUrl + "/models/" + encodeURIComponent(c.model) + ":generateContent?key=" + encodeURIComponent(c.key),
        headers: { "content-type": "application/json" },
        directHeaders: {},
        payload: body
      };
    }
    // openai 相容（含 MiniMax、DeepSeek、OpenRouter…）
    var msgs = [];
    if (sys) msgs.push({ role: "system", content: sys });
    chat.forEach(function (m) { msgs.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }); });
    var headers = { "content-type": "application/json", "authorization": "Bearer " + c.key };
    if (c.provider === "openrouter") { headers["HTTP-Referer"] = location.origin; headers["X-Title"] = "AI Planner Study"; }
    return {
      url: c.baseUrl + c.path,
      headers: headers,
      directHeaders: {},
      payload: { model: c.model, messages: msgs, temperature: temp, max_tokens: maxT }
    };
  }

  /* ---- 從各種內容形態取出文字 ---- */
  function pickText(content) {
    if (content == null) return "";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map(function (p) {
      return typeof p === "string" ? p : (p && (p.text || p.content)) || "";
    }).join("");
    if (typeof content === "object") return content.text || "";
    return "";
  }

  /* ---- 偵測「HTTP 200 但夾帶錯誤」的供應商回應 ---- */
  function softError(data) {
    if (!data || typeof data !== "object") return "";
    if (data.base_resp && data.base_resp.status_code && data.base_resp.status_code !== 0)
      return "MiniMax 回應錯誤 " + data.base_resp.status_code + "：" + (data.base_resp.status_msg || "請檢查金鑰、模型名稱或帳戶額度");
    if (data.error)
      return data.error.message || data.error.msg || (typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    if (data.promptFeedback && data.promptFeedback.blockReason)
      return "內容被安全機制封鎖：" + data.promptFeedback.blockReason;
    if ((data.code || data.code === 0) && (data.message || data.msg) && !data.choices && !data.candidates && !data.content && String(data.code) !== "0" && String(data.code) !== "200")
      return String(data.message || data.msg) + "（code " + data.code + "）";
    return "";
  }

  /* ---- 解析回應（依 shape）---- */
  function parseResponse(shape, data) {
    if (!data) return "";
    try {
      if (shape === "anthropic") {
        if (data.content) return pickText(data.content);
      } else if (shape === "gemini") {
        var cand = data.candidates && data.candidates[0];
        if (cand && cand.content && cand.content.parts) return cand.content.parts.map(function (p) { return p.text || ""; }).join("");
      } else {
        var ch = data.choices && data.choices[0];
        if (ch) { var m = ch.message || {}; return pickText(m.content) || m.reasoning_content || ch.text || ""; }
        if (data.reply) return pickText(data.reply);
        if (data.output && data.output.text) return data.output.text;
      }
    } catch (e) {}
    return "";
  }

  /* ---- 發送 ---- */
  function send(req, transport) {
    if (transport === "proxy") {
      return fetch(PROXY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ target: req.url, headers: req.headers, payload: req.payload })
      }).then(handleRes);
    }
    var h = Object.assign({}, req.headers, req.directHeaders || {});
    return fetch(req.url, { method: "POST", headers: h, body: JSON.stringify(req.payload) }).then(handleRes);
  }
  function handleRes(r) {
    return r.text().then(function (t) {
      var data; try { data = JSON.parse(t); } catch (e) { data = null; }
      if (!r.ok) {
        var msg = (data && (data.error && (data.error.message || data.error)) || data && data.message) || t || ("HTTP " + r.status);
        if (typeof msg !== "string") msg = JSON.stringify(msg);
        var err = new Error(msg.slice(0, 300)); err.status = r.status; throw err;
      }
      var soft = softError(data);
      if (soft) { var se = new Error(soft.slice(0, 300)); se.soft = true; throw se; }
      return data;
    });
  }

  /* ---- 核心：聊天 ---- */
  function chat(messages, opts) {
    var c = cfg();
    if (!c.key) return Promise.reject(new Error("尚未填入 API 金鑰（請在左側 AI 模型設定填寫）"));
    if (!c.model) return Promise.reject(new Error("尚未填入模型名稱"));
    if (!c.baseUrl) return Promise.reject(new Error("尚未設定 API 位址"));
    var req = buildRequest(c, messages, opts);
    return decideTransport(c.connMode).then(function (tp) {
      return send(req, tp).then(function (data) {
        var text = parseResponse(c.shape, data);
        if (!text) throw new Error(softError(data) || ("模型未回傳內容。請確認模型名稱是否正確。原始回應：" + (data ? JSON.stringify(data).slice(0, 180) : "空")));
        return text;
      }).catch(function (e) {
        // 自動模式直連失敗（常見 CORS）時，改用代理再試一次；但供應商夾帶錯誤(soft)不需重試
        if (c.connMode === "auto" && tp === "direct" && !e.soft && location.protocol !== "file:") {
          _transport = "proxy";
          return send(req, "proxy").then(function (data) {
            var text = parseResponse(c.shape, data);
            if (!text) throw new Error(softError(data) || "模型未回傳內容。請確認模型名稱是否正確。");
            return text;
          });
        }
        throw e;
      });
    });
  }

  /* ---- 從文字擷取 JSON ---- */
  function extractJSON(text) {
    var t = text.trim().replace(/^```(json)?/i, "").replace(/```$/,"").trim();
    // 找第一個 { 或 [ 到對應結尾
    var start = t.search(/[\[{]/);
    if (start < 0) throw new Error("回應中找不到 JSON");
    var open = t[start], close = open === "{" ? "}" : "]", depth = 0, inStr = false, esc = false;
    for (var i = start; i < t.length; i++) {
      var ch = t[i];
      if (inStr) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inStr = false; }
      else { if (ch === '"') inStr = true; else if (ch === open) depth++; else if (ch === close) { depth--; if (depth === 0) { return JSON.parse(t.slice(start, i + 1)); } } }
    }
    return JSON.parse(t.slice(start)); // 退而求其次
  }

  /* ---- 高階：AI 出題 ---- */
  function generateQuestions(params) {
    // params: { subjectName, chapterTitle, knowledge(str), samples([{stem,options,answer}]), count, difficulty }
    var count = params.count || 5;
    var diff = params.difficulty || "中等";
    var sampleText = (params.samples || []).slice(0, 3).map(function (q, i) {
      var os = ["A", "B", "C", "D"].map(function (k) { return "  (" + k + ") " + (q.options[k] || ""); }).join("\n");
      return "【歷屆範例" + (i + 1) + "】" + q.stem + "\n" + os + "\n  正解：" + q.answer;
    }).join("\n\n");

    var sys = "你是台灣「AI應用規劃師（中級）」能力鑑定的命題委員，精通該證照三科的官方知識與歷屆考點。" +
      "你出的題目為四選一單選題，情境化、專業、嚴謹，且與官方學習指引一致。";
    var user =
      "請依據以下【官方知識重點】與【歷屆範例】，命製 " + count + " 題全新的單選題（難度：" + diff + "）。\n\n" +
      "科目：" + params.subjectName + "\n主題：" + (params.chapterTitle || "綜合") + "\n\n" +
      "【官方知識重點】\n" + (params.knowledge || "（略）") + "\n\n" +
      (sampleText ? ("【歷屆範例（僅供風格與難度參考，不可照抄）】\n" + sampleText + "\n\n") : "") +
      "要求：\n" +
      "1. 每題四個選項，只有一個正確答案，誘答選項需具鑑別度。\n" +
      "2. 提供詳細解析：說明正解原因，並簡述其他選項為何錯誤。\n" +
      "3. 標註對應觀念（concept）。\n" +
      "4. 只輸出 JSON，不要任何多餘文字，格式如下：\n" +
      '{"questions":[{"stem":"題幹","options":{"A":"","B":"","C":"","D":""},"answer":"A","explanation":"解析","concept":"對應觀念"}]}';

    return chat([{ role: "system", content: sys }, { role: "user", content: user }], { temperature: 0.75, maxTokens: 3200 })
      .then(function (text) {
        var obj = extractJSON(text);
        var list = obj.questions || (Array.isArray(obj) ? obj : []);
        return list.filter(function (q) {
          return q && q.stem && q.options && ["A", "B", "C", "D"].indexOf(String(q.answer).trim().toUpperCase()) >= 0;
        }).map(function (q, i) {
          return {
            id: "ai-" + Date.now().toString(36) + "-" + i,
            subject: params.subjectCode || "AI", subjectName: params.subjectName,
            topic: params.chapterId || "", topicTitle: params.chapterTitle || "",
            stem: String(q.stem).trim(),
            options: { A: q.options.A || "", B: q.options.B || "", C: q.options.C || "", D: q.options.D || "" },
            answer: String(q.answer).trim().toUpperCase(),
            explanation: q.explanation || "", concept: q.concept || "",
            source: "AI 生成", generatedAt: new Date().toISOString(), needsContext: false
          };
        });
      });
  }

  /* ---- 高階：解析官方題目 ---- */
  function explainQuestion(q) {
    var os = ["A", "B", "C", "D"].map(function (k) { return "(" + k + ") " + (q.options[k] || ""); }).join("\n");
    var sys = "你是台灣「AI應用規劃師（中級）」的資深講師，擅長用清楚易懂的方式解析考題。";
    var user = "請解析下面這題（正解為 " + q.answer + "）。\n\n題目：" + q.stem + "\n" + os + "\n\n" +
      "請說明：1) 為什麼正解是對的；2) 其他選項為什麼錯；3) 這題背後的關鍵觀念。用繁體中文，條理清楚，避免冗長。";
    return chat([{ role: "system", content: sys }, { role: "user", content: user }], { temperature: 0.3, maxTokens: 900 });
  }

  global.Ai = {
    PROVIDERS: PROVIDERS,
    preset: function (id) { return PROVIDERS[id]; },
    chat: chat,
    generateQuestions: generateQuestions,
    explainQuestion: explainQuestion,
    resetTransport: resetTransport,
    testConnection: function () {
      return chat([{ role: "user", content: "請只回覆兩個字：正常" }], { temperature: 0.3, maxTokens: 60 });
    }
  };
})(window);

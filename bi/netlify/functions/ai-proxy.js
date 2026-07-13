/* ============================================================
   ai-proxy.js — Netlify Function
   讓前端可呼叫各家 AI API 而不受瀏覽器 CORS 限制。
   前端 POST { target, headers, payload }，本函式代為轉送。
   僅允許白名單內的 AI 服務網域（可用環境變數 EXTRA_AI_HOSTS 擴充）。
   金鑰由使用者自行填寫、隨請求帶入，本函式不儲存任何金鑰。
   ============================================================ */

const ALLOW = [
  "api.openai.com",
  "api.minimax.io", "api.minimaxi.chat",        // MiniMax 國際版
  "api.anthropic.com",
  "generativelanguage.googleapis.com",           // Google Gemini
  "api.deepseek.com",
  "openrouter.ai",
  "api.groq.com",
  "api.mistral.ai",
  "api.together.xyz",
  "api.x.ai",
  "dashscope.aliyuncs.com",                       // 阿里通義
  "dashscope-intl.aliyuncs.com",
  "api.moonshot.cn", "api.moonshot.ai",           // Moonshot / Kimi
  "ark.cn-beijing.volces.com"                     // 火山方舟
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function extraHosts() {
  return (process.env.EXTRA_AI_HOSTS || "")
    .split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: Object.assign({ "Content-Type": "application/json" }, CORS),
      body: JSON.stringify({ ok: true, service: "ai-proxy", version: 1 })
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };
  }

  let req;
  try { req = JSON.parse(event.body || "{}"); }
  catch (e) { return json(400, { error: "無效的 JSON 請求主體" }); }

  const target = req.target;
  if (!target || typeof target !== "string") return json(400, { error: "缺少 target" });

  let url;
  try { url = new URL(target); } catch (e) { return json(400, { error: "target 不是合法網址" }); }
  if (url.protocol !== "https:") return json(400, { error: "僅允許 https" });

  const host = url.hostname.toLowerCase();
  const allowed = ALLOW.concat(extraHosts());
  const ok = allowed.some(function (h) { return host === h || host.endsWith("." + h); });
  if (!ok) {
    return json(403, { error: "網域未在允許清單：" + host + "。若為自訂端點，請於 Netlify 環境變數 EXTRA_AI_HOSTS 加入此網域。" });
  }

  const headers = Object.assign({ "Content-Type": "application/json" }, req.headers || {});
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 60000);

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(req.payload || {}),
      signal: controller.signal
    });
    const text = await upstream.text();
    clearTimeout(timer);
    return {
      statusCode: upstream.status,
      headers: Object.assign({ "Content-Type": upstream.headers.get("content-type") || "application/json" }, CORS),
      body: text
    };
  } catch (e) {
    clearTimeout(timer);
    const msg = e.name === "AbortError" ? "上游請求逾時（60 秒）" : ("代理錯誤：" + e.message);
    return json(502, { error: msg });
  }
};

function json(code, obj) {
  return { statusCode: code, headers: Object.assign({ "Content-Type": "application/json" }, CORS), body: JSON.stringify(obj) };
}

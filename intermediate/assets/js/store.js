/* ============================================================
   store.js — 本地持久化（localStorage）
   多使用者、測驗紀錄、AI 設定、解析快取、匯出/匯入
   ============================================================ */
(function (global) {
  "use strict";
  var ROOT = "aipsc_v1";        // 主資料鍵
  var KEY_SECRET = "aipsc_key"; // API 金鑰（可能存 session）

  function uid() {
    return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function nowISO() { return new Date().toISOString(); }

  function readRoot() {
    try {
      var raw = localStorage.getItem(ROOT);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function writeRoot(data) {
    try { localStorage.setItem(ROOT, JSON.stringify(data)); return true; }
    catch (e) { console.error("儲存失敗", e); return false; }
  }

  function defaultRoot() {
    var id = uid();
    return {
      version: 1,
      profiles: [{ id: id, name: "使用者", avatar: "", createdAt: nowISO() }],
      currentId: id,
      ai: { provider: "minimax", model: "", key: "", baseUrl: "", path: "", connMode: "auto", remember: true },
      data: {}   // { profileId: { attempts:[], aiQuestions:[], explains:{} } }
    };
  }

  var _root = readRoot();
  if (!_root) { _root = defaultRoot(); writeRoot(_root); }
  // 遷移／補齊欄位
  if (!_root.data) _root.data = {};
  if (!_root.ai) _root.ai = { provider: "minimax", connMode: "auto", remember: true };
  if (dedupeProfiles()) writeRoot(_root);   // 開機清除同名重複使用者（同步殘留）

  var _warned = false;
  function persist() {
    if (typeof Cloud !== "undefined" && Cloud && Cloud.schedulePush) { try { Cloud.schedulePush(); } catch (eC) {} }
    var ok = writeRoot(_root);
    if (!ok && !_warned) {
      _warned = true;
      if (global.App && App.toast) App.toast("儲存空間已滿：請到「資料備份」匯出，或清除舊紀錄", "err");
      setTimeout(function () { _warned = false; }, 8000);
    }
    return ok;
  }
  var MAX_ATTEMPTS = 400, MAX_EXPLAINS = 800;

  function ensureBucket(pid) {
    if (!_root.data[pid]) _root.data[pid] = { attempts: [], aiQuestions: [], explains: {} };
    var b = _root.data[pid];
    if (!b.attempts) b.attempts = [];
    if (!b.aiQuestions) b.aiQuestions = [];
    if (!b.explains) b.explains = {};
    if (!b.bookmarks) b.bookmarks = [];
    if (!b.hidden) b.hidden = [];
    return b;
  }

  // 把 srcId 桶內的紀錄併進 dstId（以 id 去重，非破壞式），再刪除 src 桶
  function mergeBucket(dstId, srcId) {
    if (dstId === srcId || !_root.data[srcId]) return;
    var dst = ensureBucket(dstId), src = ensureBucket(srcId);
    var seen = {}; dst.attempts.forEach(function (a) { seen[a.id] = true; });
    src.attempts.forEach(function (a) { if (!seen[a.id]) dst.attempts.push(a); });
    var seenQ = {}; dst.aiQuestions.forEach(function (q) { seenQ[q.id] = true; });
    src.aiQuestions.forEach(function (q) { if (!seenQ[q.id]) dst.aiQuestions.push(q); });
    Object.keys(src.explains).forEach(function (k) { if (!(k in dst.explains)) dst.explains[k] = src.explains[k]; });
    src.bookmarks.forEach(function (id) { if (dst.bookmarks.indexOf(id) < 0) dst.bookmarks.push(id); });
    src.hidden.forEach(function (id) { if (dst.hidden.indexOf(id) < 0) dst.hidden.push(id); });
    delete _root.data[srcId];
  }
  // 合併「同名」的重複使用者（雲端同步＋跨 app 共用名機制可能造成同名多筆），資料併入先建立的那筆
  function dedupeProfiles() {
    var byName = {}, keep = [], changed = false;
    _root.profiles.forEach(function (p) {
      var k = (p.name || "").trim();
      if (byName[k]) {
        mergeBucket(byName[k].id, p.id);
        if (_root.currentId === p.id) _root.currentId = byName[k].id;
        changed = true;
      } else { byName[k] = p; keep.push(p); }
    });
    if (changed) _root.profiles = keep;
    return changed;
  }

  var Store = {
    /* ---- 使用者 ---- */
    profiles: function () { return _root.profiles.slice(); },
    currentId: function () { return _root.currentId; },
    current: function () {
      return _root.profiles.filter(function (p) { return p.id === _root.currentId; })[0] || _root.profiles[0];
    },
    switchProfile: function (id) {
      if (_root.data[id] || _root.profiles.some(function (p) { return p.id === id; })) {
        _root.currentId = id; persist();
      }
    },
    addProfile: function (name, avatar) {
      var p = { id: uid(), name: name || "學習者", avatar: avatar || "", createdAt: nowISO() };
      _root.profiles.push(p); _root.currentId = p.id; ensureBucket(p.id); persist();
      return p;
    },
    renameProfile: function (id, name) {
      var p = _root.profiles.filter(function (x) { return x.id === id; })[0];
      if (p) { p.name = name; persist(); }
    },
    deleteProfile: function (id) {
      if (_root.profiles.length <= 1) return false;   // 至少保留一位
      _root.profiles = _root.profiles.filter(function (p) { return p.id !== id; });
      delete _root.data[id];
      if (_root.currentId === id) _root.currentId = _root.profiles[0].id;
      persist(); return true;
    },

    /* ---- 測驗紀錄 ---- */
    bucket: function () { return ensureBucket(_root.currentId); },
    attempts: function () { return ensureBucket(_root.currentId).attempts.slice(); },
    addAttempt: function (attempt) {
      var b = ensureBucket(_root.currentId);
      attempt.id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      attempt.finishedAt = attempt.finishedAt || nowISO();
      b.attempts.push(attempt);
      if (b.attempts.length > MAX_ATTEMPTS) b.attempts = b.attempts.slice(-MAX_ATTEMPTS);  // 只保留最近 N 次
      persist();
      return attempt;
    },
    clearCurrentData: function () {
      _root.data[_root.currentId] = { attempts: [], aiQuestions: [], explains: {} };
      persist();
    },

    /* ---- AI 生成題庫（依 profile 保存）---- */
    aiQuestions: function () { return ensureBucket(_root.currentId).aiQuestions.slice(); },
    addAiQuestions: function (arr) {
      var b = ensureBucket(_root.currentId);
      arr.forEach(function (q) { b.aiQuestions.push(q); });
      persist();
    },
    removeAiQuestion: function (qid) {
      var b = ensureBucket(_root.currentId);
      b.aiQuestions = b.aiQuestions.filter(function (q) { return q.id !== qid; });
      persist();
    },

    /* ---- 官方題目的 AI 解析快取 ---- */
    getExplain: function (qid) { return ensureBucket(_root.currentId).explains[qid]; },
    setExplain: function (qid, text) {
      var b = ensureBucket(_root.currentId);
      var keys = Object.keys(b.explains);
      if (keys.length >= MAX_EXPLAINS) { delete b.explains[keys[0]]; }  // 淘汰最舊，避免無限成長
      b.explains[qid] = text; persist();
    },

    /* ---- 題目收藏 ---- */
    getBookmarks: function () { return ensureBucket(_root.currentId).bookmarks.slice(); },
    isBookmarked: function (qid) { return ensureBucket(_root.currentId).bookmarks.indexOf(qid) >= 0; },
    toggleBookmark: function (qid) {
      var b = ensureBucket(_root.currentId); var i = b.bookmarks.indexOf(qid);
      if (i >= 0) b.bookmarks.splice(i, 1); else b.bookmarks.push(qid);
      persist(); return i < 0;   // true = 已收藏
    },

    /* ---- 回報/隱藏題目（不再出現於題庫）---- */
    isHidden: function (qid) { return ensureBucket(_root.currentId).hidden.indexOf(qid) >= 0; },
    hideQuestion: function (qid) {
      var b = ensureBucket(_root.currentId);
      if (b.hidden.indexOf(qid) < 0) b.hidden.push(qid);
      var i = b.bookmarks.indexOf(qid); if (i >= 0) b.bookmarks.splice(i, 1);
      persist();
    },

    /* ---- AI 設定 ---- */
    ai: function () {
      var a = Object.assign({}, _root.ai);
      // 金鑰另存（可能在 sessionStorage）
      try {
        var k = localStorage.getItem(KEY_SECRET) || sessionStorage.getItem(KEY_SECRET);
        if (k) a.key = k;
      } catch (e) {}
      return a;
    },
    saveAi: function (cfg) {
      var key = cfg.key || "";
      _root.ai = {
        provider: cfg.provider, model: cfg.model || "", baseUrl: cfg.baseUrl || "",
        path: cfg.path || "", connMode: cfg.connMode || "auto", remember: !!cfg.remember, key: ""
      };
      persist();
      try {
        localStorage.removeItem(KEY_SECRET); sessionStorage.removeItem(KEY_SECRET);
        if (key) {
          if (cfg.remember) localStorage.setItem(KEY_SECRET, key);
          else sessionStorage.setItem(KEY_SECRET, key);
        }
      } catch (e) {}
    },

    /* ---- 匯出 / 匯入 ---- */
    exportAll: function () {
      var copy = JSON.parse(JSON.stringify(_root));
      if (copy.ai) copy.ai.key = "";        // 不匯出金鑰
      copy._exportedAt = nowISO();
      return copy;
    },
    importAll: function (obj, mode) {
      // mode: "merge" | "replace"
      if (!obj || !obj.profiles) throw new Error("檔案格式不正確");
      if (mode === "replace") {
        _root = { version: 1, profiles: obj.profiles, currentId: obj.currentId, ai: _root.ai, data: obj.data || {} };
      } else {
        // 合併：以 profile id 為主鍵
        var existing = {};
        _root.profiles.forEach(function (p) { existing[p.id] = true; });
        obj.profiles.forEach(function (p) {
          if (!existing[p.id]) _root.profiles.push(p);
        });
        Object.keys(obj.data || {}).forEach(function (pid) {
          if (!_root.data[pid]) { _root.data[pid] = obj.data[pid]; }
          else {
            // 合併 attempts（去重以 id）
            var seen = {};
            _root.data[pid].attempts.forEach(function (a) { seen[a.id] = true; });
            (obj.data[pid].attempts || []).forEach(function (a) { if (!seen[a.id]) _root.data[pid].attempts.push(a); });
            var seenQ = {};
            _root.data[pid].aiQuestions.forEach(function (q) { seenQ[q.id] = true; });
            (obj.data[pid].aiQuestions || []).forEach(function (q) { if (!seenQ[q.id]) _root.data[pid].aiQuestions.push(q); });
            Object.assign(_root.data[pid].explains, obj.data[pid].explains || {});
          }
        });
      }
      dedupeProfiles();   // 合併後清除同名重複使用者
      persist();
    }
  };

  global.Store = Store;
})(window);

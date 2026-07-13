/* ============================================================
   content-api.js — 課程內容/題庫存取層（建索引）
   依賴 window.APP_CONTENT（data/content.js，同步）
   擴充題庫 window.APP_BANK（data/bank.js，2.1MB）改為「按需延遲載入」，
   首屏只用官方題即可運作，避免阻塞。
   ============================================================ */
(function (global) {
  "use strict";
  var C = global.APP_CONTENT || { subjects: [], questions: [] };
  var BANK_VERSION = "18";

  var subjById = {}, chapterById = {};
  C.subjects.forEach(function (s) {
    subjById[s.code] = s;
    (s.chapters || []).forEach(function (ch) {
      ch.subjectCode = s.code; ch.subjectName = s.name;
      chapterById[ch.id] = ch;
    });
  });

  var BANK = [], ALL = [], qById = {}, bankMerged = false;

  function enrich(q) {
    q.generated = true;
    if (!q.needsContext) q.needsContext = false;
    if (!q.subjectName) q.subjectName = (subjById[q.subject] || {}).name || q.subject;
    if (!q.source) q.source = "AI 練習題";
  }
  function rebuild() {
    BANK = global.APP_BANK || [];
    BANK.forEach(enrich);
    ALL = C.questions.concat(BANK);
    qById = {};
    ALL.forEach(function (q) { qById[q.id] = q; });
  }
  rebuild();
  bankMerged = !!(global.APP_BANK && global.APP_BANK.length);

  var loading = false, waiters = [];
  function ensureBank(cb) {
    if (bankMerged || (global.APP_BANK && global.APP_BANK.length)) {
      if (!bankMerged) { rebuild(); bankMerged = true; }
      if (cb) cb(); return;
    }
    if (cb) waiters.push(cb);
    if (loading) return;
    loading = true;
    var s = document.createElement("script");
    s.src = "data/bank.js?v=" + BANK_VERSION;
    s.onload = function () {
      rebuild(); bankMerged = true; loading = false;
      try { document.dispatchEvent(new Event("bank-ready")); } catch (e) {}
      waiters.splice(0).forEach(function (f) { try { f(); } catch (e) {} });
    };
    s.onerror = function () { loading = false; waiters.splice(0).forEach(function (f) { try { f(); } catch (e) {} }); };
    document.head.appendChild(s);
  }

  function chapterQuestionCount(chId, onlyOfficial) {
    var n = 0; ALL.forEach(function (q) {
      if (q.topic === chId && !q.needsContext && !(onlyOfficial && q.generated)) n++;
    });
    return n;
  }

  var Content = {
    meta: { version: C.version, examSource: C.examSource, updatedAt: C.updatedAt },
    subjects: function () { return C.subjects; },
    subject: function (code) { return subjById[code]; },
    subjectName: function (code) { return (subjById[code] || {}).name || code; },
    chapters: function (code) { return (subjById[code] || {}).chapters || []; },
    chapter: function (id) { return chapterById[id]; },
    chapterTitle: function (id) { return (chapterById[id] || {}).title || "未分類"; },
    chapterQuestionCount: chapterQuestionCount,
    question: function (id) { return qById[id]; },
    ensureBank: ensureBank,
    bankReady: function () { return bankMerged; },

    // filter: {subject, topic, includeContext(bool), onlyOfficial(bool), ids([])}
    questions: function (filter) {
      filter = filter || {};
      var hidden = (global.Store && Store.isHidden) ? Store.isHidden : null;
      return ALL.filter(function (q) {
        if (filter.ids) return filter.ids.indexOf(q.id) >= 0;
        if (hidden && hidden(q.id)) return false;
        if (filter.subject && q.subject !== filter.subject) return false;
        if (filter.topic && q.topic !== filter.topic) return false;
        if (!filter.includeContext && q.needsContext) return false;
        if (filter.onlyOfficial && q.generated) return false;
        return true;
      });
    },
    allOfficial: function (includeContext, onlyOfficial) {
      var hidden = (global.Store && Store.isHidden) ? Store.isHidden : null;
      return ALL.filter(function (q) {
        if (hidden && hidden(q.id)) return false;
        if (!includeContext && q.needsContext) return false;
        if (onlyOfficial && q.generated) return false;
        return true;
      });
    },
    counts: function () {
      var official = C.questions.length;
      var generated = BANK.length;
      var answerable = ALL.filter(function (q) { return !q.needsContext; }).length;
      var officialAnswerable = C.questions.filter(function (q) { return !q.needsContext; }).length;
      return { official: official, generated: generated, total: official + generated,
        answerable: answerable, officialAnswerable: officialAnswerable,
        subjects: C.subjects.length, bankReady: bankMerged };
    }
  };
  global.Content = Content;
})(window);

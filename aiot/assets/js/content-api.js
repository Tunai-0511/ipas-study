/* ============================================================
   content-api.js — 課程內容/題庫存取層（建索引）
   依賴 window.APP_CONTENT（data/content.js，同步）
   延伸練習題庫 window.APP_BANK（data/bank.js）與指引自評題分開分類。
   ============================================================ */
(function (global) {
  "use strict";
  var C = global.APP_CONTENT || { subjects: [], questions: [] };
  var BANK_VERSION = "2";

  var subjById = {}, chapterById = {};
  C.subjects.forEach(function (s) {
    subjById[s.code] = s;
    (s.chapters || []).forEach(function (ch) {
      ch.subjectCode = s.code; ch.subjectName = s.name;
      chapterById[ch.id] = ch;
    });
  });

  var BANK = [], ALL = [], qById = {}, bankMerged = false;

  function enrich(q, kind) {
    q.sourceKind = q.sourceKind || kind;
    q.generated = q.sourceKind === "original-study" || q.sourceKind === "original-practice";
    q.topic = q.topic || q.chapter;
    q.srcUrl = q.srcUrl || q.sourceUrl;
    if (!q.subjectName) q.subjectName = (subjById[q.subject] || {}).name || q.subject;
    if (!q.source) q.source = q.generated ? "自編練習題" : kind === "official-guide" ? "官方指引練習題" : "舊制物聯網歷屆試題";
  }
  function rebuild() {
    BANK = global.APP_BANK || [];
    C.questions.forEach(function (q) { enrich(q, "original-study"); });
    BANK.forEach(function (q) { enrich(q, "original-practice"); });
    var guide = global.APP_OFFICIAL_GUIDE || [], legacy = global.APP_LEGACY_BANK || [];
    guide.forEach(function (q) { enrich(q, "official-guide"); });
    legacy.forEach(function (q) { enrich(q, "legacy-exam"); });
    ALL = C.questions.concat(BANK, guide, legacy);
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
      if (q.topic === chId && !q.needsContext && !q.needsReview && !(onlyOfficial && q.generated)) n++;
    });
    return n;
  }

  var Content = {
    meta: { version: C.version, examSource: C.examSource, updatedAt: C.updatedAt, examInfo: C.examInfo || {}, sources: C.sources || [] },
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
        if (q.needsReview) return false;
        if (filter.ids && filter.ids.indexOf(q.id) < 0) return false;
        if (filter.sourceKind && q.sourceKind !== filter.sourceKind) return false;
        if (hidden && hidden(q.id)) return false;
        if (filter.subject && q.subject !== filter.subject) return false;
        if (filter.topic && q.topic !== filter.topic) return false;
        if (!filter.includeContext && q.needsContext) return false;
        if (filter.onlyOfficial && q.generated) return false;
        if (filter.onlyGenerated && !q.generated) return false;
        return true;
      });
    },
    allOfficial: function (includeContext, onlyOfficial, onlyGenerated, sourceKind) {
      return Content.questions({ includeContext: includeContext, onlyOfficial: onlyOfficial, onlyGenerated: onlyGenerated, sourceKind: sourceKind });
    },
    reviewQuestions: function () { return ALL.filter(function (q) { return !!q.needsReview; }); },
    counts: function () {
      var guide = ALL.filter(function (q) { return q.sourceKind === "official-guide"; }).length;
      var legacy = ALL.filter(function (q) { return q.sourceKind === "legacy-exam"; }).length;
      var generated = ALL.filter(function (q) { return q.generated; }).length;
      var answerable = ALL.filter(function (q) { return !q.needsContext && !q.needsReview; }).length;
      var officialAnswerable = ALL.filter(function (q) { return !q.generated && !q.needsContext && !q.needsReview; }).length;
      return { official: guide + legacy, guide: guide, legacy: legacy, generated: generated, total: ALL.length,
        answerable: answerable, officialAnswerable: officialAnswerable, review: Content.reviewQuestions().length,
        subjects: C.subjects.length, bankReady: bankMerged };
    }

  };
  global.Content = Content;
})(window);

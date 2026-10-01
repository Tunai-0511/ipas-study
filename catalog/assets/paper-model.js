(function (global) {
  'use strict';
  function normalize(answer) { return Array.from(new Set(String(answer || '').toUpperCase().match(/[A-F]/g) || [])).sort().join(''); }
  function gradeable(q) { return !q.void && (/^[A-F]+$/.test(q.answer || '') || (q.acceptedAnswers || []).some(function (a) { return /^[A-F]+$/.test(a); })); }
  function score(paper, responses) {
    var valid = (paper.answers || []).filter(gradeable);
    var items = valid.map(function (q) {
      var chosen = normalize(responses[q.number]);
      var accepted = (q.acceptedAnswers || [q.answer]).map(normalize);
      return { number: q.number, chosen: chosen, answer: normalize(q.answer), acceptedAnswers: accepted, correct: !!chosen && accepted.includes(chosen), page: q.page };
    });
    var correct = items.filter(function (q) { return q.correct; }).length;
    return { total: items.length, correct: correct, percent: items.length ? Math.round(correct / items.length * 100) : null, items: items };
  }
  function merge(a, b) {
    a = a || {}; b = b || {};
    var attempts = new Map();
    (a.attempts || []).concat(b.attempts || []).forEach(function (attempt) { if (attempt && attempt.id) attempts.set(attempt.id, attempt); });
    var drafts = Object.assign({}, a.drafts || {});
    Object.keys(b.drafts || {}).forEach(function (id) {
      if (!drafts[id] || (b.drafts[id].updatedAt || '') > (drafts[id].updatedAt || '')) drafts[id] = b.drafts[id];
    });
    return { version: 1, attempts: Array.from(attempts.values()).sort(function (x, y) { return String(x.finishedAt).localeCompare(String(y.finishedAt)); }).slice(-400), drafts: drafts };
  }
  function asset(path, extension) {
    return typeof path === 'string' && /^assets\/papers\/(?:[a-z0-9_-]+\/)*[a-z0-9_.-]+$/i.test(path) && !path.includes('..') && extension.test(path) ? path : '';
  }
  global.IpasPaper = { normalize: normalize, gradeable: gradeable, score: score, merge: merge, asset: asset };
})(typeof window === 'undefined' ? globalThis : window);

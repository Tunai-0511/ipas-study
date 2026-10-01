(function (global) {
  'use strict';
  var norm = global.IpasPaper.normalize;
  function valid(q) { return q && q.id && q.subjectId && !q.needsReview && !q.void && global.IpasPaper.gradeable(q); }
  function pool(questions, filter, reviews, favorites) {
    filter = filter || {}; reviews = reviews || {}; favorites = favorites || {};
    return questions.filter(function (q) {
      return valid(q) && (!filter.subject || q.subjectId === filter.subject) && (!filter.level || q.levelId === filter.level) &&
        (!filter.source || q.sourceKind === filter.source) &&
        (filter.mode !== 'wrong' || (reviews[q.id] && reviews[q.id].correct === false)) &&
        (filter.mode !== 'favorites' || (favorites[q.id] && favorites[q.id].active));
    });
  }
  function select(questions, count, random, rng) {
    var items = questions.slice(); rng = rng || Math.random;
    if (random) for (var i = items.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var x = items[i]; items[i] = items[j]; items[j] = x; }
    return items.slice(0, count === 'all' ? items.length : Math.max(1, Number(count) || 10));
  }
  function grade(q, value) {
    var chosen = norm(value), accepted = (q.acceptedAnswers && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer]).map(norm);
    return { chosen: chosen, acceptedAnswers: accepted, correct: !!chosen && (!q.multiple ? chosen.length === 1 : true) && accepted.includes(chosen) };
  }
  function toggle(q, current, choice) {
    var labels = q.options || q.optionLabels || { A: '', B: '', C: '', D: '' };
    if (!Object.prototype.hasOwnProperty.call(labels, choice)) return norm(current);
    current = norm(current);
    return q.multiple ? norm(current.includes(choice) ? current.replace(choice, '') : current + choice) : current === choice ? '' : choice;
  }
  function result(questions, checked) {
    var items = questions.map(function (q) { var record = checked[q.id]; var graded = grade(q, record && record.chosen);
      return { id: q.id, number: q.id, chosen: graded.chosen, correct: !!record && graded.correct, acceptedAnswers: graded.acceptedAnswers, subjectId: q.subjectId }; });
    var correct = items.filter(function (q) { return q.correct; }).length;
    return { total: items.length, correct: correct, answered: items.filter(function (q) { return q.chosen; }).length, percent: items.length ? Math.round(100 * correct / items.length) : 0, items: items };
  }
  function restore(saved, questions) {
    if (!saved || saved.version !== 1 || saved.completed || !Array.isArray(saved.questionIds)) return null;
    var byId = new Map(questions.filter(valid).map(function (q) { return [q.id, q]; }));
    var ids = Array.from(new Set(saved.questionIds)).filter(function (id) { return byId.has(id); });
    if (!ids.length) return null;
    var responses = {}, checked = {};
    ids.forEach(function (id) {
      responses[id] = norm((saved.responses || {})[id]);
      if ((saved.checked || {})[id]) checked[id] = grade(byId.get(id), saved.checked[id].chosen);
    });
    return { version: 1, questionIds: ids, index: Math.min(Math.max(0, Number(saved.index) || 0), ids.length - 1), responses: responses,
      checked: checked, config: saved.config || {}, startedAt: saved.startedAt, completed: false };
  }
  function imagePath(path) { return typeof path === 'string' && /^assets\/questions\/[a-z0-9_./-]+\.(?:webp|png|jpg|svg)$/i.test(path) && !path.includes('..') ? path : ''; }
  global.IpasPracticeModel = { valid: valid, pool: pool, select: select, grade: grade, toggle: toggle, result: result, restore: restore, imagePath: imagePath };
})(typeof window === 'undefined' ? globalThis : window);

/* ============================================================
   analysis.js — 成績判讀與成長分析
   ============================================================ */
(function (global) {
  "use strict";

  function attempts() {
    return Store.attempts().slice().sort(function (a, b) {
      return new Date(a.finishedAt) - new Date(b.finishedAt);
    });
  }
  function mmdd(iso) { var d = new Date(iso); return (d.getMonth() + 1) + "/" + d.getDate(); }

  function overall() {
    var A = attempts();
    if (!A.length) return { count: 0 };
    var tq = 0, tc = 0, tt = 0, scores = [];
    A.forEach(function (a) { tq += a.total || 0; tc += a.correct || 0; tt += a.durationSec || 0; scores.push(a.score || 0); });
    // 連續練習天數
    var days = {};
    A.forEach(function (a) { days[mmdd(a.finishedAt) + "/" + new Date(a.finishedAt).getFullYear()] = true; });
    return {
      count: A.length, totalQuestions: tq, totalCorrect: tc,
      avgScore: Math.round(scores.reduce(function (s, x) { return s + x; }, 0) / scores.length),
      bestScore: Math.max.apply(null, scores),
      lastScore: scores[scores.length - 1],
      firstScore: scores[0],
      totalTimeSec: tt, activeDays: Object.keys(days).length
    };
  }

  function aggregate(keyFn, titleFn) {
    var map = {};
    attempts().forEach(function (a) {
      (a.items || []).forEach(function (it) {
        var k = keyFn(it); if (!k) return;
        if (!map[k]) map[k] = { key: k, title: titleFn(it, k), attempted: 0, correct: 0 };
        map[k].attempted++; if (it.isCorrect) map[k].correct++;
      });
    });
    return Object.keys(map).map(function (k) {
      var o = map[k]; o.accuracy = o.attempted ? Math.round(o.correct / o.attempted * 100) : 0; return o;
    });
  }

  function bySubject() {
    return aggregate(
      function (it) { return it.subject; },
      function (it, k) { return Content.subjectName(k) || (k === "MIX" ? "綜合" : k === "AI" ? "AI 生成" : k); }
    ).sort(function (a, b) { return b.attempted - a.attempted; });
  }

  function byTopic() {
    return aggregate(
      function (it) { return it.topic; },
      function (it, k) { return Content.chapterTitle(k); }
    );
  }

  function weakTopics(minAttempts, limit) {
    minAttempts = minAttempts || 2; limit = limit || 6;
    return byTopic()
      .filter(function (t) { return t.attempted >= minAttempts; })
      .sort(function (a, b) { return a.accuracy - b.accuracy || b.attempted - a.attempted; })
      .slice(0, limit);
  }
  function strongTopics(minAttempts, limit) {
    minAttempts = minAttempts || 2; limit = limit || 3;
    return byTopic()
      .filter(function (t) { return t.attempted >= minAttempts; })
      .sort(function (a, b) { return b.accuracy - a.accuracy; })
      .slice(0, limit);
  }

  /* 成長序列（每次測驗一個點）*/
  function growthSeries() {
    var A = attempts();
    var overall = A.map(function (a, i) { return { label: mmdd(a.finishedAt), y: a.score || 0, i: i }; });
    var subjMap = {};
    A.forEach(function (a) {
      // 每次測驗的每科正確率
      var per = {};
      (a.items || []).forEach(function (it) {
        var s = it.subject; if (!per[s]) per[s] = { c: 0, n: 0 }; per[s].n++; if (it.isCorrect) per[s].c++;
      });
      Object.keys(per).forEach(function (s) {
        if (!subjMap[s]) subjMap[s] = [];
        subjMap[s].push({ label: mmdd(a.finishedAt), y: Math.round(per[s].c / per[s].n * 100) });
      });
    });
    return { overall: overall, subjects: subjMap };
  }

  /* 加強建議：結合弱點章節的官方 keyPoints */
  function recommendations() {
    var weak = weakTopics(2, 4);
    return weak.map(function (t) {
      var ch = Content.chapter(t.key);
      var tips = ch && ch.keyPoints ? ch.keyPoints.slice(0, 3) : [];
      return { title: t.title, accuracy: t.accuracy, attempted: t.attempted, subject: ch ? ch.subjectName : "", tips: tips };
    });
  }
  function masterySummary() {
    var topicMap = {};
    byTopic().forEach(function (t) { topicMap[t.key] = t; });
    var out = { mastered: 0, review: 0, risk: 0, insufficient: 0, total: 0 };
    Content.subjects().forEach(function (s) {
      (s.chapters || []).forEach(function (ch) {
        out.total++;
        var t = topicMap[ch.id];
        if (!t || t.attempted < 3) out.insufficient++;
        else if (t.accuracy >= 85) out.mastered++;
        else if (t.accuracy >= 70) out.review++;
        else out.risk++;
      });
    });
    return out;
  }

  global.Analysis = {
    overall: overall, bySubject: bySubject, byTopic: byTopic,
    weakTopics: weakTopics, strongTopics: strongTopics,
    growthSeries: growthSeries, recommendations: recommendations, masterySummary: masterySummary,
    hasData: function () { return Store.attempts().length > 0; }
  };
})(window);

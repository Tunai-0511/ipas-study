/* ============================================================
   quiz.js — 測驗引擎（作答、計時、評分、檢討、解析）
   ============================================================ */
(function (global) {
  "use strict";
  var LETTERS = ["A", "B", "C", "D"];

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function pad2(n){ return n < 10 ? "0" + n : "" + n; }
  function fmtTime(sec){
    sec = Math.max(0, Math.floor(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? (h + ":" + pad2(m) + ":" + pad2(s)) : (pad2(m) + ":" + pad2(s));
  }

  var MODES = {
    official: { name: "題庫", icon: "bookOpen", desc: "依科目/章節練習真實考題，作答即對答與解析", immediate: true },
    mock:     { name: "模擬考",   icon: "target", desc: "單科計時模擬，完全比照官方（50 題／75 分鐘）", immediate: false },
    wrong:    { name: "錯題複習", icon: "loop", desc: "重做你之前答錯的題目，鞏固弱點", immediate: true },
    bookmark: { name: "收藏複習", icon: "flag", desc: "重做你按★收藏標記的題目", immediate: true }
  };

  /* ---- 組題 ---- */
  function aiQuestionMap() {
    var m = {}; Store.aiQuestions().forEach(function (q) { m[q.id] = q; }); return m;
  }
  function buildQuestions(config) {
    var qs = [];
    if (config.mode === "official") {
      qs = Content.questions({ subject: config.subject || null, topic: config.topic || null, includeContext: false, onlyOfficial: config.onlyOfficial, onlyGenerated: config.onlyGenerated });
    } else if (config.mode === "mock") {
      // 模擬考完全比照官方：單一科目。未指定科目時退回跨科（相容舊入口）
      qs = config.subject
        ? Content.questions({ subject: config.subject, includeContext: false, onlyOfficial: config.onlyOfficial, onlyGenerated: config.onlyGenerated })
        : Content.allOfficial(false, config.onlyOfficial, config.onlyGenerated);
    } else if (config.mode === "ai") {
      qs = Store.aiQuestions().filter(function (q) {
        if (config.subject && q.subject !== config.subject) return false;
        if (config.topic && q.topic !== config.topic) return false; return true;
      });
    } else if (config.mode === "wrong") {
      var wrongStats = {}, aimap = aiQuestionMap();
      Store.attempts().forEach(function (a) {
        var ts = Date.parse(a.finishedAt || a.startedAt || "") || 0;
        (a.items || []).forEach(function (it) {
          var s = wrongStats[it.qid] || (wrongStats[it.qid] = { wrong: 0, correct: 0, lastWrong: 0, lastSeen: 0 });
          s.lastSeen = Math.max(s.lastSeen, ts);
          if (it.isCorrect) s.correct++;
          else { s.wrong++; s.lastWrong = Math.max(s.lastWrong, ts); }
        });
      });
      Object.keys(wrongStats).map(function (id) {
        var s = wrongStats[id], q = Content.question(id) || aimap[id];
        if (!q || q.needsContext || (Store.isHidden && Store.isHidden(id)) || !s.wrong) return null;
        var recency = s.lastWrong ? s.lastWrong / 86400000 : 0;
        return { q: q, score: s.wrong * 4 - s.correct + recency };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).forEach(function (x) { qs.push(x.q); });
    } else if (config.mode === "bookmark") {
      var amap = aiQuestionMap();
      Store.getBookmarks().forEach(function (id) {
        var q = Content.question(id) || amap[id]; if (q && !q.needsContext) qs.push(q);
      });
    }
    if (config.mode !== "wrong") qs = shuffle(qs);
    var count = config.count || qs.length;
    return qs.slice(0, count);
  }

  /* ---- 執行器 ---- */
  function launch(config, mount, opts) {
    opts = opts || {};
    var questions = config.questions || buildQuestions(config);
    var mode = MODES[config.mode] || MODES.official;
    if (!questions.length) {
      mount.innerHTML = emptyState(config.mode);
      var b = mount.querySelector("[data-back]"); if (b) b.onclick = function () { opts.onExit && opts.onExit("quiz"); };
      return;
    }
    var immediate = mode.immediate;
    var idx = 0;
    var answers = new Array(questions.length).fill(null);
    var locked = new Array(questions.length).fill(false);
    var startTs = Date.now();
    var elapsed = 0, timer = null;
    var limitSec = config.limitSec || 0;   // >0：倒數計時，到時自動交卷
    function timeDisplay() { return limitSec ? fmtTime(Math.max(0, limitSec - elapsed)) : fmtTime(elapsed); }

    function tick() {
      elapsed = Math.floor((Date.now() - startTs) / 1000);
      var t = mount.querySelector("#qzTimer"); if (t) t.textContent = timeDisplay();
      if (limitSec) {
        var remain = limitSec - elapsed;
        var tw = mount.querySelector(".quiz-timer"); if (tw) tw.classList.toggle("warn", remain <= 60);
        if (remain <= 0) { clearInterval(timer); timer = null; if (global.App && App.toast) App.toast("時間到，自動交卷", "ok"); finish(); }
      }
    }
    tick();
    timer = setInterval(tick, 1000);

    function render() {
      var q = questions[idx];
      var ans = answers[idx];
      var isLocked = locked[idx];
      var showResult = immediate && isLocked;
      var pct = Math.round((idx) / questions.length * 100);
      var html =
        '<div class="quiz-runner">' +
          '<div class="quiz-bar">' +
            '<button class="btn btn-ghost btn-sm" id="qzExit">' + Icon.get("x") + '結束</button>' +
            '<div class="progress" role="progressbar" aria-label="測驗進度" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
            '<span class="quiz-count" aria-live="polite">' + (idx + 1) + ' / ' + questions.length + '</span>' +
            '<span class="quiz-timer" role="timer" aria-label="' + (limitSec ? "剩餘時間" : "已用時間") + '">' + Icon.get("clock") + '<span id="qzTimer">' + timeDisplay() + '</span></span>' +
          '</div>' +
          '<div class="qcard">' +
            '<div class="q-meta">' +
              '<span class="q-badge subj">' + esc(q.subjectName || Content.subjectName(q.subject) || "題目") + '</span>' +
              (q.topic ? '<span class="q-badge">' + esc(q.topicTitle || Content.chapterTitle(q.topic)) + '</span>' : '') +
              '<span class="q-badge">' + esc(q.source || "") + '</span>' +
              '<button class="qz-bm' + (Store.isBookmarked(q.id) ? ' on' : '') + '" id="qzBm" aria-label="收藏此題" title="收藏此題">' + Icon.get("flag") + '</button>' +
            '</div>' +
            '<div class="q-stem">' + esc(q.stem) + '</div>' +
            '<div class="options">' +
              LETTERS.map(function (k) {
                if (!q.options[k]) return "";
                var cls = "option";
                if (showResult) {
                  if (k === q.answer) cls += " correct";
                  else if (k === ans) cls += " wrong";
                } else if (k === ans) cls += " sel";
                return '<button class="' + cls + '" data-k="' + k + '"' + (isLocked ? " disabled" : "") + '>' +
                  '<span class="opt-key">' + k + '</span><span>' + esc(q.options[k]) + '</span></button>';
              }).join("") +
            '</div>' +
            (showResult ? explainBlock(q) : "") +
            '<div class="quiz-foot">' +
              '<button class="btn btn-ghost" id="qzPrev"' + (idx === 0 ? " disabled" : "") + '>← 上一題</button>' +
              nextBtn() +
            '</div>' +
          '</div>' +
        '</div>';
      mount.innerHTML = html;
      bind();
    }

    function nextBtn() {
      var last = idx === questions.length - 1;
      if (immediate && !locked[idx]) return '<button class="btn btn-ghost" id="qzSkip">跳過 →</button>';
      return '<button class="btn btn-primary" id="qzNext">' + (last ? "交卷看成績 ✓" : "下一題 →") + '</button>';
    }

    function explainBlock(q) {
      function head() {
        return '<div class="ex-head">' + Icon.get("bulb") + ' 解析　<span class="ex-ans">正解：' + q.answer + '</span></div>';
      }
      if (q.explanation) return '<div class="explain">' + head() + '<div>' + esc(q.explanation) + '</div>' +
        (q.concept ? '<div style="margin-top:6px;color:var(--text-mute);font-size:12.5px">觀念：' + esc(q.concept) + '</div>' : '') + '</div>';
      var cached = Store.getExplain(q.id);
      if (cached) return '<div class="explain">' + head() + '<div>' + esc(cached) + '</div></div>';
      return '<div class="explain">' + head() + '<div class="explain-loading">本題暫無解析。</div></div>';
    }

    function bind() {
      var opt = mount.querySelectorAll(".option");
      opt.forEach(function (el) {
        el.onclick = function () {
          if (locked[idx] && immediate) return;
          answers[idx] = el.getAttribute("data-k");
          if (immediate) { locked[idx] = true; }
          render();
        };
      });
      var exit = mount.querySelector("#qzExit"); if (exit) exit.onclick = confirmExit;
      var prev = mount.querySelector("#qzPrev"); if (prev) prev.onclick = function () { if (idx > 0) { idx--; render(); } };
      var next = mount.querySelector("#qzNext"); if (next) next.onclick = advance;
      var skip = mount.querySelector("#qzSkip"); if (skip) skip.onclick = advance;
      var exBtn = mount.querySelector("#exBtn"); if (exBtn) exBtn.onclick = function () { doExplain(questions[idx], exBtn); };
      var bm = mount.querySelector("#qzBm"); if (bm) bm.onclick = function () { var on = Store.toggleBookmark(questions[idx].id); bm.classList.toggle("on", on); };
    }

    // 鍵盤快速作答：1-4 選項、Enter 下一題/交卷、方向鍵上下題
    function onKey(e) {
      if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
      var q = questions[idx];
      if (e.key >= "1" && e.key <= "4") {
        var k = LETTERS[+e.key - 1];
        if (q.options[k] && !(locked[idx] && immediate)) { e.preventDefault(); answers[idx] = k; if (immediate) locked[idx] = true; render(); }
      } else if (e.key === "Enter") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (idx > 0) { idx--; render(); } }
    }
    document.addEventListener("keydown", onKey);

    function advance() {
      if (idx === questions.length - 1) return finish();
      idx++; render();
    }

    function doExplain(q, btn) {
      var body = mount.querySelector("#exBody");
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span> 產生中…';
      Ai.explainQuestion(q).then(function (txt) {
        Store.setExplain(q.id, txt);
        if (body) { body.classList.remove("explain-loading"); body.textContent = txt; }
        btn.remove();
      }).catch(function (e) {
        if (body) { body.classList.add("explain-loading"); body.textContent = "解析失敗：" + e.message; }
        btn.disabled = false; btn.textContent = "重試";
      });
    }

    function confirmExit() {
      if (global.App && App.confirm) {
        App.confirm("結束測驗？", "本次作答將不會被記錄。", function () { cleanup(); opts.onExit && opts.onExit("quiz"); });
      } else { cleanup(); opts.onExit && opts.onExit("quiz"); }
    }
    function cleanup() { if (timer) clearInterval(timer); document.removeEventListener("keydown", onKey); }

    function finish() {
      cleanup();
      var items = questions.map(function (q, i) {
        return {
          qid: q.id, subject: q.subject, subjectName: q.subjectName || Content.subjectName(q.subject),
          topic: q.topic || "", chosen: answers[i], correct: q.answer, isCorrect: answers[i] === q.answer
        };
      });
      var correct = items.filter(function (it) { return it.isCorrect; }).length;
      var score = Math.round(correct / questions.length * 100);
      var attempt = {
        mode: config.mode, modeName: mode.name,
        subject: config.subject || (config.mode === "mock" ? "MIX" : (config.mode === "ai" ? "AI" : "MIX")),
        subjectName: config.subjectName || mode.name,
        startedAt: new Date(startTs).toISOString(), finishedAt: new Date().toISOString(),
        durationSec: Math.floor((Date.now() - startTs) / 1000),
        total: questions.length, correct: correct, score: score, items: items
      };
      Store.addAttempt(attempt);
      renderResult(attempt, questions, answers);
    }

    function renderResult(attempt, qs, ans) {
      var verdict = attempt.score >= 80 ? "表現優異！" : attempt.score >= 60 ? "及格，繼續加油" : "需要多加練習";
      // 本次各科/章統計
      var byTopic = {};
      attempt.items.forEach(function (it) {
        var k = it.topic || it.subject; if (!k) return;
        if (!byTopic[k]) byTopic[k] = { title: it.topic ? Content.chapterTitle(it.topic) : (it.subjectName || "其他"), n: 0, c: 0 };
        byTopic[k].n++; if (it.isCorrect) byTopic[k].c++;
      });
      var barData = Object.keys(byTopic).map(function (k) { return { label: byTopic[k].title, value: Math.round(byTopic[k].c / byTopic[k].n * 100) }; })
        .sort(function (a, b) { return a.value - b.value; });

      var reviewHtml = qs.map(function (q, i) {
        var ok = ans[i] === q.answer;
        var yourTxt = ans[i] ? (ans[i] + ". " + (q.options[ans[i]] || "")) : "未作答";
        return '<div class="review-item">' +
          '<div class="ri-head"><span class="ri-status ' + (ok ? "ok" : "no") + '">' + (ok ? "✓" : "✕") + '</span>' +
          '<span class="ri-stem">' + (i + 1) + '. ' + esc(q.stem) + '</span></div>' +
          '<div class="ri-detail">你的答案：<b style="color:' + (ok ? "var(--ok)" : "var(--danger)") + '">' + esc(yourTxt) + '</b>' +
          (ok ? "" : '<br>正確答案：<b>' + q.answer + ". " + esc(q.options[q.answer] || "") + '</b>') + '</div>' +
          '<div class="ri-detail" data-exwrap="' + i + '">' +
            (q.explanation ? ('<div class="explain" style="margin-top:8px"><div class="ex-head">' + Icon.get("bulb") + ' 解析</div><div>' + esc(q.explanation) + '</div></div>')
              : (Store.getExplain(q.id) ? ('<div class="explain" style="margin-top:8px"><div class="ex-head">' + Icon.get("bulb") + ' 解析</div><div>' + esc(Store.getExplain(q.id)) + '</div></div>')
                : '<div style="margin-top:8px;color:var(--text-mute);font-size:13px">本題暫無解析</div>')) +
          '</div>' +
          '' +
        '</div>';
      }).join("");

      mount.innerHTML =
        '<div class="quiz-runner">' +
          '<div class="card card-pad result-hero">' +
            Charts.ring(attempt.score, 160) +
            '<div class="result-verdict">' + verdict + '</div>' +
            '<div class="result-sub">答對 ' + attempt.correct + ' / ' + attempt.total + ' 題　·　用時 ' + fmtTime(attempt.durationSec) + '</div>' +
          '</div>' +
          (barData.length ? ('<div class="section-title">本次各主題正確率</div><div class="card card-pad">' + Charts.bars(barData) + '</div>') : '') +
          '<div class="quiz-foot" style="margin:20px 0">' +
            '<button class="btn btn-ghost" id="rsWrong">' + Icon.get("loop") + '只複習錯題</button>' +
            '<div style="display:flex;gap:10px">' +
              '<button class="btn btn-ghost" id="rsAgain">再測一次</button>' +
              '<button class="btn btn-primary" id="rsDash">查看成長 →</button>' +
            '</div>' +
          '</div>' +
          '<div class="section-title">逐題檢討</div>' + reviewHtml +
        '</div>';

      mount.querySelector("#rsAgain").onclick = function () { launch(config, mount, opts); };
      mount.querySelector("#rsDash").onclick = function () { opts.onExit && opts.onExit("growth"); };
      var rw = mount.querySelector("#rsWrong");
      var wrongQs = qs.filter(function (q, i) { return ans[i] !== q.answer; });
      if (!wrongQs.length) { rw.disabled = true; rw.innerHTML = Icon.get("trophy") + "全對！"; }
      rw.onclick = function () { launch({ mode: "wrong", questions: shuffle(wrongQs), subjectName: "錯題複習" }, mount, opts); };

      mount.querySelectorAll("[data-exq]").forEach(function (btn) {
        btn.onclick = function () {
          var i = +btn.getAttribute("data-exq"); var q = qs[i];
          var wrap = mount.querySelector('[data-exwrap="' + i + '"]');
          btn.disabled = true; btn.innerHTML = '<span class="spin"></span> 產生中…';
          Ai.explainQuestion(q).then(function (txt) {
            Store.setExplain(q.id, txt);
            wrap.innerHTML = '<div class="explain" style="margin-top:8px">' + esc(txt) + '</div>';
          }).catch(function (e) { btn.disabled = false; btn.textContent = "重試（" + e.message.slice(0, 40) + "）"; });
        };
      });
      mount.querySelectorAll("[data-report]").forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute("data-report");
          Store.hideQuestion(id); Store.removeAiQuestion(id);
          btn.disabled = true; btn.textContent = "已回報，不再出現";
          if (global.App && App.toast) App.toast("已移除此題", "ok");
        };
      });
    }

    render();
  }

  function emptyState(mode) {
    var msg = mode === "wrong" ? "你目前沒有答錯的題目。先去做幾份測驗吧！"
      : mode === "ai" ? "還沒有 AI 生成的題目。請到「AI 出題」頁面產生題目。"
      : "此範圍暫無可作答的題目。";
    return '<div class="empty"><div class="e-ico">' + Icon.get("folder", "ic-xl") + '</div><div class="e-title">沒有題目</div>' +
      '<div class="e-sub">' + msg + '</div><br><button class="btn btn-primary" data-back>返回</button></div>';
  }

  global.Quiz = { MODES: MODES, buildQuestions: buildQuestions, launch: launch };
})(window);

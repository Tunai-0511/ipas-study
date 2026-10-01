(function (global) {
  'use strict';
  var M = global.IpasPracticeModel, esc = global.IpasCatalog.esc, epoch = 0;
  var sourceNames = { 'official-past': '官方歷屆', 'official-sample': '官方樣題', 'official-guide': '官方指引', 'legacy-exam': '舊制官方歷屆', 'original-practice': '自編圖文練習', 'original-study': '自編章節題' };
  function sourceLink(url, label) { var safe = global.IpasCatalog.safeUrl(url); return safe ? '<a href="' + esc(safe) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>' : ''; }
  async function open(cert, info, mount, onExit, subjectId) {
    var run = ++epoch, bank, session, questions, filter = { subject: subjectId || '', level: '', source: '', mode: 'practice', count: '10', random: true };
    var progress = global.CatalogProgress, draftId = 'practice-session:' + cert.id;
    var subjects = global.IpasCatalog.subjects(cert), byId;
    function alive() { return run === epoch && new URL(location.href).searchParams.get('practice') === cert.id; }
    mount.innerHTML = '<p class="loading">正在準備' + esc(cert.name) + '題庫…</p>';
    try {
      if (!info || !/^data\/practice\/[a-z0-9-]+\.json$/.test(info.path || '')) throw new Error('missing bank');
      var response = await fetch(info.path + '?v=' + encodeURIComponent(info.revision || '1')); if (!response.ok) throw new Error('unavailable bank');
      bank = (await response.json()).questions.filter(M.valid);
      await progress.ready;
      if (!alive()) return;
      if (!bank.length) throw new Error('empty bank');
      byId = new Map(bank.map(function (q) { return [q.id, q]; }));
      setup();
    } catch (_) {
      if (!alive()) return;
      mount.innerHTML = '<h1>題庫暫時無法載入</h1><p>請確認連線後重試，你的作答紀錄仍會保留。</p><button id="retryPractice" class="button primary">重新載入</button> <button id="exitPractice" class="button">返回考科</button>';
      mount.querySelector('#retryPractice').onclick = function () { open(cert, info, mount, onExit, subjectId); };
      mount.querySelector('#exitPractice').onclick = onExit;
    }
    function save() { progress.saveDraft(draftId, JSON.parse(JSON.stringify(session))); }
    function header() { return '<button id="exitPractice" class="back reader-back">← ' + esc(cert.name) + '</button>'; }
    function subjectName(id) { var found = subjects.find(function (s) { return s.id === id; }); return found ? found.levelName + ' · ' + found.name : ''; }
    function filtered() { return M.pool(bank, filter, progress.practice(), progress.favorites()); }
    function setup() {
      if (!alive()) return;
      document.title = cert.name + '刷題｜iPAS 備考學院';
      session = null;
      var reviews = progress.practice(), favorites = progress.favorites();
      var wrongCount = bank.filter(function (q) { return reviews[q.id] && reviews[q.id].correct === false; }).length;
      var savedCount = bank.filter(function (q) { return favorites[q.id] && favorites[q.id].active; }).length;
      var completed = bank.filter(function (q) { return reviews[q.id]; }).length;
      var draft = M.restore(progress.draft(draftId), bank), sources = Array.from(new Set(bank.map(function (q) { return q.sourceKind; })));
      var available = filtered();
      mount.innerHTML = header() + '<p class="eyebrow">圖文題庫 · 逐題練習</p><h1>' + esc(cert.name) + '</h1><p class="intro">每題作答後對答案，原始圖表可放大查看。依你的考科挑選範圍，練習結果會保留在帳號中。</p>' +
        (cert.status !== 'active' ? '<p class="note">歷史鑑定：練習保留舊制科目與來源，並非現行可報名考試。</p>' : '') +
        '<div class="summary"><span class="pill">' + bank.length + ' 題可練習</span><span class="pill">已練習 ' + completed + ' 題</span><span class="pill">待複習 ' + wrongCount + ' 題</span><span class="pill">收藏 ' + savedCount + ' 題</span></div>' +
        (draft ? '<div class="practice-resume"><div><strong>繼續上次練習</strong><p>' + Object.keys(draft.checked).length + ' / ' + draft.questionIds.length + ' 題已對答</p></div><button id="resumePractice" class="button">繼續作答 →</button></div>' : '') +
        '<div class="practice-settings"><div><h2>練習範圍</h2><div class="practice-fields"><label>級別<select id="practiceLevel"><option value="">全部級別</option>' + cert.levels.map(function (l) { return '<option value="' + l.id + '"' + (filter.level === l.id ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join('') + '</select></label>' +
        '<label>考科<select id="practiceSubject"><option value="">全部考科</option>' + subjects.filter(function (s) { return !filter.level || s.levelId === filter.level; }).map(function (s) { return '<option value="' + esc(s.id) + '"' + (filter.subject === s.id ? ' selected' : '') + '>' + esc(s.levelName + ' · ' + s.name) + '</option>'; }).join('') + '</select></label>' +
        '<label>題目來源<select id="practiceSource"><option value="">全部來源</option>' + sources.map(function (source) { return '<option value="' + esc(source) + '"' + (filter.source === source ? ' selected' : '') + '>' + esc(sourceNames[source] || source) + '</option>'; }).join('') + '</select></label>' +
        '<label>練習模式<select id="practiceMode">' + [{id:'practice',name:'全部題庫'},{id:'wrong',name:'錯題複習'},{id:'favorites',name:'收藏複習'}].map(function (mode) { return '<option value="' + mode.id + '"' + (filter.mode === mode.id ? ' selected' : '') + '>' + mode.name + '</option>'; }).join('') + '</select></label>' +
        '<label>題數<select id="practiceCount">' + ['10','25','50','all'].map(function (n) { return '<option value="' + n + '"' + (filter.count === n ? ' selected' : '') + '>' + (n === 'all' ? '全部題目' : n + ' 題') + '</option>'; }).join('') + '</select></label>' +
        '<label>出題順序<select id="practiceOrder"><option value="random"' + (filter.random ? ' selected' : '') + '>隨機出題</option><option value="ordered"' + (!filter.random ? ' selected' : '') + '>依來源順序</option></select></label></div></div>' +
        '<aside class="practice-start"><span class="eyebrow">本次練習</span><strong>' + available.length + '</strong><p>題符合目前範圍</p><button class="button primary" id="startPractice"' + (!available.length ? ' disabled' : '') + '>開始刷題 →</button>' + (!available.length ? '<p class="result-note">此範圍目前沒有題目。可改選其他來源，或先到全部題庫練習。</p>' : '') + '<p class="result-note" data-progress-status>' + esc(progress.status()) + '</p></aside></div>' +
        '<p class="verified">官方、自編與舊制題分別標示。術科題為圖解判讀與流程練習，不取代正式實作評量；練習正確率不等於證照成績。</p>';
      mount.querySelector('#exitPractice').onclick = onExit;
      [['practiceLevel','level'],['practiceSubject','subject'],['practiceSource','source'],['practiceMode','mode'],['practiceCount','count']].forEach(function (pair) {
        mount.querySelector('#' + pair[0]).onchange = function (e) { filter[pair[1]] = e.target.value; if (pair[1] === 'level') filter.subject = ''; setup(); };
      });
      mount.querySelector('#practiceOrder').onchange = function (e) { filter.random = e.target.value === 'random'; setup(); };
      mount.querySelector('#startPractice').onclick = function () { begin(M.select(filtered(), filter.count, filter.random)); };
      var resume = mount.querySelector('#resumePractice');
      if (resume) resume.onclick = function () { session = draft; filter = Object.assign({},filter,draft.config); questions = session.questionIds.map(function (id) { return byId.get(id); }); renderQuestion(); };
    }
    function begin(items) {
      if (!items.length) return;
      questions = items;
      session = { version:1, questionIds:items.map(function (q) { return q.id; }), index:0, responses:{}, checked:{}, config:Object.assign({},filter), startedAt:new Date().toISOString(), completed:false };
      save(); renderQuestion(); window.scrollTo(0,0);
    }
    function renderQuestion() {
      if (!alive() || !session) return;
      var q = questions[session.index], checked = session.checked[q.id] || (session.completed ? M.grade(q,'') : null), chosen = session.responses[q.id] || '';
      var starred = !!(progress.favorites()[q.id] || {}).active;
      var labels = q.optionLabels || {}, options = q.options || {A:'',B:'',C:'',D:''};
      var images = (q.images || []).filter(function (i) { return M.imagePath(i.path); });
      var source = sourceNames[q.sourceKind] || q.sourceKind;
      var hasOptionText = Object.values(options).some(function (s) { return !!s; });
      document.title = (session.index + 1) + '/' + questions.length + ' · ' + cert.name;
      mount.innerHTML = '<div class="practice-toolbar"><button class="back reader-back" id="leaveSession">← ' + (session.completed ? '返回練習結果' : '儲存並返回設定') + '</button><span data-progress-status>' + esc(progress.status()) + '</span></div>' +
        '<div class="practice-progress"><span>第 ' + (session.index + 1) + ' / ' + questions.length + ' 題</span><span>' + Object.keys(session.checked).length + ' 題已對答</span><progress value="' + Object.keys(session.checked).length + '" max="' + questions.length + '" aria-label="作答進度"></progress></div>' +
        '<article class="practice-question"><div class="practice-question-top"><div><span class="status">' + esc(source) + '</span><p class="result-note">' + esc(subjectName(q.subjectId)) + ' · ' + (q.multiple ? '複選題' : '單選題') + (q.printedNumber != null ? ' · 原題 ' + esc(q.printedNumber) : '') + '</p></div><button id="favoriteQuestion" class="favorite-button" aria-pressed="' + starred + '" aria-label="' + (starred ? '取消收藏此題' : '收藏此題') + '">' + (starred ? '★ 已收藏' : '☆ 收藏') + '</button></div>' +
        (q.practicalPreparation ? '<p class="practice-scope">術科準備 · 圖解判讀與流程練習</p>' : '') +
        (q.sourceFormattingNote ? '<p class="practice-scope">' + esc(q.sourceFormattingNote) + '</p>' : '') +
        (q.stem && hasOptionText ? '<h2 class="practice-stem">' + esc(q.stem) + '</h2>' : '<h2 class="practice-stem">請閱讀下方題目，選擇' + (q.multiple ? '所有正確選項' : '最適合的答案') + '。</h2>') +
        images.map(function (img, i) { return '<figure class="practice-figure"><a href="' + esc(img.path) + '" target="_blank" rel="noopener" aria-label="放大' + (img.role === 'context' ? '共用題組資料' : '題目圖片') + (i + 1) + '"><img src="' + esc(img.path) + '" alt="' + esc(img.alt || q.stem || '題目圖片') + '" decoding="async"></a><figcaption>' + (img.role === 'context' ? '共用題組資料 · ' : '') + '點擊圖片可放大查看</figcaption><p class="image-error" hidden>圖片尚未載入，請重新載入；也可從下方來源查看原題。</p></figure>'; }).join('') +
        (hasOptionText && images.some(function(img){return /\.svg$/.test(img.path);}) ? '<details class="practice-text"><summary>閱讀圖片中的資料</summary>' + images.map(function(img){return '<p>' + esc(img.alt || '') + '</p>';}).join('') + '</details>' : '') +
        (!hasOptionText && (q.promptText || q.stem) ? '<details class="practice-text"><summary>查看可選取的題目文字</summary><p class="result-note">文字版供選取；圖表與公式請以原圖為準。</p><p>' + esc(q.promptText || q.stem) + '</p></details>' : '') +
        '<div class="practice-options" role="group" aria-label="答案選項">' + Object.keys(options).map(function (key) {
          var selected = chosen.includes(key), correctChoice = checked && checked.acceptedAnswers.some(function (a) { return a.includes(key); });
          return '<button class="practice-option' + (selected ? ' selected' : '') + (checked ? correctChoice ? ' correct' : selected ? ' incorrect' : '' : '') + '" data-option="' + key + '" aria-pressed="' + selected + '"' + (checked ? ' disabled' : '') + '><span class="option-letter">' + esc(labels[key] || key) + '</span><span>' + esc(options[key] || ('選項 ' + (labels[key] || key))) + '</span>' + (checked && correctChoice ? '<span class="choice-mark">✓</span>' : '') + '</button>';
        }).join('') + '</div>' +
        (checked ? '<section class="practice-feedback ' + (checked.correct ? 'correct' : 'incorrect') + '" role="status"><strong>' + (checked.correct ? '答對了' : checked.chosen ? '再記一次這個觀念' : '此題未提交答案') + '</strong><p>正確答案：' + esc(checked.acceptedAnswers.map(function (answer) { return answer.split('').map(function (k) { return labels[k] || k; }).join('、'); }).join(' 或 ')) + '</p><p class="explanation">' + esc(q.explanation || '答案依原始官方試卷與已核對的更正公告。可開啟來源對照；本站未把自動產生的說明冒充官方解析。') + '</p></section>' : '<button id="checkPractice" class="button primary"' + (!chosen ? ' disabled' : '') + '>確認答案</button>') +
        '<div class="practice-source">' + esc(q.source || q.paperTitle || source) + (q.historicalNote ? '<p>' + esc(q.historicalNote) + '</p>' : '') +
        (checked ? '<div>' + (q.sources || [{url:q.sourceUrl,title:'原始來源'}]).map(function (item) { return sourceLink(item.url, item.title); }).join(' · ') + '</div>' : '<p>提交答案後可查看原始來源與答案說明。</p>') + '</div></article>' +
        '<nav class="practice-navigation" aria-label="題目導覽"><button class="button" id="previousQuestion"' + (!session.index ? ' disabled' : '') + '>← 上一題</button>' +
        (session.index < questions.length - 1 ? '<button class="button primary" id="nextQuestion">' + (checked ? '下一題 →' : '先跳過 →') + '</button>' : '<button class="button primary" id="finishPractice">完成練習</button>') + '</nav>';
      mount.querySelector('#leaveSession').onclick = function () { if(session.completed) { finishSession(); return; } save(); setup(); window.scrollTo(0,0); };
      mount.querySelector('#favoriteQuestion').onclick = function () { progress.favorite(q,!starred); renderQuestion(); };
      mount.querySelectorAll('[data-option]').forEach(function (button) { button.onclick = function () { if(checked)return; session.responses[q.id] = M.toggle(q,chosen,button.dataset.option); save(); renderQuestion(); }; });
      mount.querySelectorAll('.practice-figure img').forEach(function (img) { img.onerror = function () { var box = img.closest('figure'); box.querySelector('.image-error').hidden = false; var submit = mount.querySelector('#checkPractice'); if (submit) { submit.disabled = true; submit.textContent = '請先重新載入題目圖片'; } }; });
      var check = mount.querySelector('#checkPractice');
      if (check) check.onclick = function () {
        if(!session.responses[q.id] || session.completed)return;
        if(Array.from(mount.querySelectorAll('.practice-figure img')).some(function(img){return !img.complete || !img.naturalWidth;})) { check.textContent='圖片尚未載入，請稍後再試或重新載入'; return; }
        var r = M.grade(q, session.responses[q.id]); session.checked[q.id] = r; progress.recordPractice(q,r.chosen,r.correct); save(); renderQuestion(); mount.querySelector('.practice-feedback').scrollIntoView({block:'nearest',behavior:'smooth'});
      };
      mount.querySelector('#previousQuestion').onclick = function () { session.index--; save(); renderQuestion(); window.scrollTo(0,0); };
      var next = mount.querySelector('#nextQuestion'); if (next) next.onclick = function () { session.index++; save(); renderQuestion(); window.scrollTo(0,0); };
      var finish = mount.querySelector('#finishPractice'); if (finish) finish.onclick = finishSession;
    }
    function finishSession() {
      var result = M.result(questions,session.checked);
      if (!session.completed) {
        session.completed = true;
        progress.addAttempt({id:'practice:' + cert.id,title:cert.name + '刷題',certId:cert.id,modeName:session.config.mode === 'wrong' ? '錯題複習' : '圖文刷題'}, {total:result.total,correct:result.correct,answered:result.answered,percent:result.percent}); save();
      }
      mount.innerHTML = header() + '<p class="eyebrow">練習完成</p><h1>這次答對 ' + result.correct + ' / ' + result.total + ' 題</h1><p class="intro">已對答 ' + result.answered + ' 題，尚未作答 ' + (result.total - result.answered) + ' 題。這是本次練習正確率，不代表正式考試成績。</p>' +
        '<div class="practice-completion"><strong>' + result.percent + '%</strong><p data-progress-status>' + esc(progress.status()) + '</p><div class="detail-links"><button id="retryWrong" class="button primary"' + (result.correct === result.total ? ' disabled' : '') + '>重練錯題與未答題</button><button id="practiceSetup" class="button">選擇新的練習</button></div></div>' +
        '<h2>本次題目</h2><div class="practice-results">' + result.items.map(function (item,i) { var q=questions[i]; return '<button data-review="' + i + '" class="practice-result-item"><span>' + (i+1) + ' · ' + (item.correct ? '✓ 答對' : item.chosen ? '↺ 待複習' : '— 未作答') + '</span><strong>' + esc(q.options ? q.stem : q.paperTitle || subjectName(q.subjectId)) + '</strong></button>'; }).join('') + '</div>';
      mount.querySelector('#exitPractice').onclick=onExit;
      mount.querySelector('#practiceSetup').onclick=setup;
      mount.querySelector('#retryWrong').onclick=function(){ begin(questions.filter(function(q,i){return !result.items[i].correct;})); };
      mount.querySelectorAll('[data-review]').forEach(function(button){ button.onclick=function(){session.index=Number(button.dataset.review);renderQuestion();window.scrollTo(0,0);}; });
      window.scrollTo(0,0);
    }
  }
  global.IpasPractice = {open:open,cancel:function(){epoch++;}};
  document.addEventListener('catalog-auth-invalidated',function(){epoch++;});
})(window);

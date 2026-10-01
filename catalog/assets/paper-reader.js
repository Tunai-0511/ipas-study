(function (global) {
  'use strict';
  var model = global.IpasPaper, esc = global.IpasCatalog.esc;
  async function reader(paper, mount, onExit) {
    mount.innerHTML = '<p class="loading">正在載入原卷與你的研讀紀錄…</p>';
    await global.CatalogProgress.ready;
    if (new URL(location.href).searchParams.get('paper') !== paper.id) return;
    document.title = paper.title + '｜iPAS 原卷研讀';
    var page = 1, responses = Object.assign({}, global.CatalogProgress.draft(paper.id)), result = null;
    var pages = (paper.pages || []).map(function (path) { return model.asset(path, /\.(webp|png|jpg)$/i); });
    var pdf = model.asset(paper.path, /\.pdf$/i), answers = paper.answers || [];
    var gradeable = answers.filter(model.gradeable);
    var canScore = paper.answerStatus === 'verified' || paper.answerStatus === 'partial';
    function render() {
      var answered = gradeable.filter(function (q) { return !!responses[q.number]; }).length;
      mount.innerHTML = '<button class="back reader-back" id="exitPaper">← 返回考科與資源</button><p class="eyebrow">官方原卷研讀</p><h1 class="paper-title">' + esc(paper.title) + '</h1>' +
        '<div class="paper-notice">' + (paper.answerVisibility === 'hidden' ? '練習圖已遮住已確認的答案欄，原始 PDF 保留完整官方內容。' : '此為官方公開原卷，頁面可能包含答案。適合對照研讀；作答卡記錄的是本次自我練習正確率。') + ' 不代表正式考試成績或通過資格。</div>' +
        '<div class="paper-tools">' + (pdf ? '<a class="button" href="' + esc(pdf) + '#page=' + page + '" target="_blank" rel="noopener">開啟完整 PDF ↗</a>' : '') +
        (global.IpasCatalog.safeUrl(paper.sourceUrl) ? '<a class="button" href="' + esc(paper.sourceUrl) + '" target="_blank" rel="noopener noreferrer">官方來源 ↗</a>' : '') + '<span class="result-note" data-progress-status>' + esc(global.CatalogProgress.status()) + '</span></div>' +
        '<div class="paper-layout"><section class="paper-document" aria-label="試卷原頁"><div class="page-controls"><button id="previousPage" class="button" ' + (page === 1 ? 'disabled' : '') + '>← 上一頁</button><label>原卷頁碼 <select id="paperPage">' + pages.map(function (_, i) { return '<option value="' + (i + 1) + '" ' + (page === i + 1 ? 'selected' : '') + '>第 ' + (i + 1) + ' / ' + pages.length + ' 頁</option>'; }).join('') + '</select></label><button id="nextPage" class="button" ' + (page >= pages.length ? 'disabled' : '') + '>下一頁 →</button></div>' +
        (pages[page - 1] ? '<a class="paper-page" href="' + esc(pages[page - 1]) + '" target="_blank" rel="noopener" aria-label="開啟第 ' + page + ' 頁原圖"><img src="' + esc(pages[page - 1]) + '" alt="' + esc(paper.title) + '，第 ' + page + ' 頁" decoding="async"><span>點擊原頁可放大查看</span></a>' : '<p class="note">此卷請使用「開啟完整 PDF」閱讀。</p>') + '</section>' +
        '<aside class="answer-card"><h2>' + (canScore && gradeable.length ? '研讀作答卡' : '原卷閱讀') + '</h2>' +
        (canScore && gradeable.length ? '<p class="result-note">已作答 ' + answered + ' / ' + gradeable.length + ' 題' + (paper.answerStatus === 'partial' ? '；僅列出已核對答案的題目。' : '。') + '題號可跳至原卷頁面。</p>' +
        '<div class="answer-list">' + answers.map(function (q) {
          var row = result && result.items.find(function (item) { return item.number === q.number; });
          var labels = q.optionLabels || paper.optionLabels || {};
          var choices = q.choices || (Object.keys(labels).length ? Object.keys(labels) : ['A','B','C','D']);
          var printed = q.printedNumber == null ? q.number : q.printedNumber;
          var questionLabel = q.number === printed ? '第 ' + printed + ' 題' : '第 ' + q.number + ' 格 · 原題 ' + printed;
          if (q.sectionLabel) questionLabel = q.sectionLabel + ' · ' + questionLabel;
          var voided = !model.gradeable(q);
          return '<div class="answer-row' + (row ? row.correct ? ' is-correct' : ' is-wrong' : '') + '"><button class="question-jump" data-page="' + (q.page || 1) + '">' + esc(questionLabel) + '</button>' +
            (voided ? '<span class="result-note">' + (q.void ? '官方給分題，不計入正確率' : '未有可核對答案') + '</span>' : '<div class="answer-choices" role="group" aria-label="第 ' + esc(printed) + ' 題' + (q.multiple ? '複選' : '單選') + '">' + choices.map(function (choice) {
              var selected = model.normalize(responses[q.number]).includes(choice);
              return '<button class="choice' + (selected ? ' selected' : '') + '" data-question="' + esc(q.number) + '" data-choice="' + esc(choice) + '" aria-pressed="' + selected + '" ' + (result ? 'disabled' : '') + '>' + esc(labels[choice] || choice) + '</button>';
            }).join('') + '</div>' + (q.multiple ? '<small>複選題</small>' : '') + (row ? '<small>' + (row.correct ? '答對' : '正解：' + esc(row.acceptedAnswers.map(function (a) { return a.split('').map(function (letter) { return labels[letter] || letter; }).join('、'); }).join(' 或 '))) + '</small>' : '')) + '</div>';
        }).join('') + '</div>' +
        (result ? '<div class="paper-result" role="status"><strong>' + result.correct + ' / ' + result.total + ' 題答對 · ' + result.percent + '%</strong><p>本次研讀練習正確率；每道可判分題等權計算。</p><button class="button" id="restartPaper">重新練習</button></div>' : '<button class="button primary" id="scorePaper">檢查答案並儲存紀錄</button>') :
        '<p>此卷以完整原始文件提供。申論、術科或尚無完整答案的題目，請依官方說明研讀，不提供自動評分。</p>') +
        (global.CatalogProgress.attempts(paper.id).length ? '<details class="paper-notes"><summary>最近研讀紀錄</summary>' + global.CatalogProgress.attempts(paper.id).slice(-3).reverse().map(function (attempt) { return '<p>' + esc(new Date(attempt.finishedAt).toLocaleString('zh-TW')) + ' · ' + esc(attempt.result.correct) + ' / ' + esc(attempt.result.total) + ' 題答對</p>'; }).join('') + '</details>' : '') +
        (paper.notes ? '<details class="paper-notes"><summary>原卷與答案說明</summary><p>' + esc(Array.isArray(paper.notes) ? paper.notes.join('\n') : paper.notes) + '</p></details>' : '') + '</aside></div>';
      mount.querySelector('#exitPaper').onclick = onExit;
      mount.querySelector('#previousPage').onclick = function () { page = Math.max(1, page - 1); render(); };
      mount.querySelector('#nextPage').onclick = function () { page = Math.min(pages.length, page + 1); render(); };
      mount.querySelector('#paperPage').onchange = function (event) { page = Number(event.target.value); render(); };
      mount.querySelectorAll('[data-page]').forEach(function (button) { button.onclick = function () { page = Math.max(1, Math.min(pages.length, Number(button.dataset.page))); render(); mount.querySelector('.paper-document').scrollIntoView({ block: 'start' }); }; });
      mount.querySelectorAll('[data-question]').forEach(function (button) { button.onclick = function () {
        var q = answers.find(function (item) { return String(item.number) === button.dataset.question; }), choice = button.dataset.choice, current = responses[q.number] || '';
        responses[q.number] = q.multiple ? model.normalize(current.includes(choice) ? current.replace(choice, '') : current + choice) : current === choice ? '' : choice;
        global.CatalogProgress.saveDraft(paper.id, responses);
        var top = mount.querySelector('.answer-list').scrollTop;
        render(); mount.querySelector('.answer-list').scrollTop = top;
      }; });
      var submit = mount.querySelector('#scorePaper');
      if (submit) submit.onclick = function () {
        result = model.score(paper, responses); global.CatalogProgress.addAttempt(paper, result); render(); mount.querySelector('.paper-result').scrollIntoView({ block: 'nearest' });
      };
      var restart = mount.querySelector('#restartPaper');
      if (restart) restart.onclick = function () { result = null; responses = {}; global.CatalogProgress.saveDraft(paper.id, responses); render(); };
    }
    render();
  }
  global.IpasPaperReader = { open: reader };
})(window);

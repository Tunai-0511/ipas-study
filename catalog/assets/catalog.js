(function (global) {
  'use strict';
  var model = global.IpasCatalog, esc = model.esc, app = document.getElementById('catalogApp');
  var data, papers = [], practiceIndex = {certifications:[],totals:{}}, filter = { query: '', category: '', level: '', status: 'active' };
  var typeNames = { written: '學科', practical: '術科', oral: '口試', mixed: '綜合評量' };
  var kindNames = { guide: '學習指引', 'past-paper': '歷屆試題', syllabus: '考試簡章', course: '官方課程', sample: '參考試題', 'official-past': '官方歷屆試題', 'official-sample': '官方參考試題', 'official-guide': '官方學習指引', 'official-syllabus': '官方簡章', 'official-course': '官方課程' };
  function link(url, text, cls) {
    var safe = model.safeUrl(url);
    return safe ? '<a class="' + (cls || '') + '" href="' + esc(safe) + '" target="_blank" rel="noopener noreferrer">' + esc(text) + ' ↗</a>' : '';
  }
  function localLink(url, text, cls) {
    return /^\/(?:junior|intermediate|bi|aiot)\/(?:#\w+)?$/.test(url || '') ? '<a class="' + (cls || 'button primary') + '" href="' + esc(url) + '">' + esc(text) + '</a>' : '';
  }
  function navigate(id) {
    var url = new URL(location.href);
    url.searchParams.delete('paper');
    url.searchParams.delete('practice'); url.searchParams.delete('subject');
    if (id) url.searchParams.set('cert', id); else url.searchParams.delete('cert');
    history.pushState({}, '', url); render(); window.scrollTo(0, 0);
  }
  function bindLinks() {
    app.querySelectorAll('[data-practice]').forEach(function (a) { a.onclick = function (event) {
      if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      event.preventDefault(); history.pushState({},'',a.href); render(); window.scrollTo(0,0);
    }; });
    app.querySelectorAll('[data-cert]').forEach(function (a) { a.onclick = function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); navigate(a.dataset.cert);
    }; });
  }
  function practiceInfo(id) { return practiceIndex.certifications.find(function(c){return c.id===id;}); }
  function practiceLink(cert,subject,text,cls) {
    var info=practiceInfo(cert.id); if(!info || !info.total || (subject && !(info.subjects[subject] || {}).total))return '';
    return '<a class="' + (cls || 'button primary') + '" data-practice="' + esc(cert.id) + '" href="?practice=' + encodeURIComponent(cert.id) + (subject ? '&subject=' + encodeURIComponent(subject) : '') + '">' + esc(text || '進入圖文刷題') + ' →</a>';
  }
  function cards() {
    var certs = data.certifications.filter(function (cert) { return model.matches(cert, filter); });
    document.getElementById('resultNote').textContent = '找到 ' + certs.length + ' 項鑑定';
    document.getElementById('certGrid').innerHTML = certs.length ? certs.map(function (cert) {
      var all = model.subjects(cert), uniqueNames = Array.from(new Set(all.map(function (s) { return s.name; })));
      var practice = practiceInfo(cert.id);
      return '<article class="cert-card"><div class="category">' + esc(cert.category) + ' · ' + esc(cert.officialCode) + '</div><h2>' + esc(cert.name) + '</h2>' +
        '<p>' + esc((cert.levels || []).map(function (l) { return l.name; }).join(' / ')) + ' · ' + all.length + ' 門考科</p><span class="status">' + (cert.status !== 'active' ? '歷史鑑定 · ' : '') + (practice && practice.total ? practice.total + ' 題 · 圖文刷題' : '官方考科與準備資源') + '</span>' +
        '<ul class="subject-preview">' + uniqueNames.slice(0, 3).map(function (name) { return '<li>' + esc(name) + '</li>'; }).join('') + (uniqueNames.length > 3 ? '<li>另有 ' + (uniqueNames.length - 3) + ' 門考科</li>' : '') + '</ul>' +
        practiceLink(cert,'','開始刷題','card-link') + '<a class="card-link secondary-link" data-cert="' + esc(cert.id) + '" href="?cert=' + encodeURIComponent(cert.id) + '">考科與官方來源 →</a></article>';
    }).join('') : '<div class="empty"><p>找不到符合條件的考科。</p><button class="filter-reset" id="resetFilters">清除篩選</button></div>';
    var reset = document.getElementById('resetFilters');
    if (reset) reset.onclick = function () { filter = { query: '', category: '', level: '', status: 'active' }; directory(); };
    bindLinks();
  }
  function directory() {
    document.title = '全部 iPAS 考科｜iPAS 備考學院';
    var certs = data.certifications, categories = Array.from(new Set(certs.map(function (c) { return c.category; })));
    var levels = new Map(); certs.forEach(function (c) { (c.levels || []).forEach(function (l) { levels.set(l.id, l.name); }); });
    var active = certs.filter(function (c) { return c.status === 'active'; });
    var subjectCount = active.reduce(function (sum, c) { return sum + model.subjects(c).length; }, 0);
    app.innerHTML = '<p class="eyebrow">探索你的下一張證照</p><h1>全部 iPAS 考科</h1><p class="intro">選擇考科就能逐題練習、對答案，並收藏題目與複習錯題。官方原題保留圖表，自編補充題清楚標示來源。</p>' +
      '<div class="summary"><span class="pill">' + active.length + ' 項現行鑑定</span><span class="pill">' + subjectCount + ' 門級別考科</span><span class="pill">' + categories.length + ' 個領域</span><span class="pill">核對日期 ' + esc(data.updatedAt) + '</span></div>' +
      '<div class="filters"><label>搜尋考科<input id="catalogSearch" type="search" placeholder="例如：碳盤查、資安、電動車" value="' + esc(filter.query) + '"></label>' +
      '<label>領域<select id="categoryFilter"><option value="">全部領域</option>' + categories.map(function (category) { return '<option' + (filter.category === category ? ' selected' : '') + '>' + esc(category) + '</option>'; }).join('') + '</select></label>' +
      '<label>級別<select id="levelFilter"><option value="">全部級別</option>' + Array.from(levels).map(function (entry) { return '<option value="' + esc(entry[0]) + '"' + (filter.level === entry[0] ? ' selected' : '') + '>' + esc(entry[1]) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="status-filters">' + [{id:'active',label:'現行鑑定'},{id:'legacy',label:'歷史鑑定'},{id:'',label:'全部'}].map(function (item) { return '<button data-status="' + item.id + '" aria-pressed="' + (filter.status === item.id) + '">' + item.label + '</button>'; }).join('') + '</div>' +
      '<p id="resultNote" class="result-note" role="status"></p><div id="certGrid" class="cert-grid"></div><p class="verified">範圍依 iPAS 官方現行鑑定清單。選考組合、抵免及報考資格請以各項最新簡章為準。</p>';
    document.getElementById('catalogSearch').oninput = function (e) { filter.query = e.target.value; cards(); };
    document.getElementById('categoryFilter').onchange = function (e) { filter.category = e.target.value; cards(); };
    document.getElementById('levelFilter').onchange = function (e) { filter.level = e.target.value; cards(); };
    app.querySelectorAll('[data-status]').forEach(function (button) { button.onclick = function () { filter.status = button.dataset.status; directory(); }; });
    cards();
  }
  function paperList(cert) {
    var list = papers.filter(function (p) { return p.certId === cert.id; });
    if (!list.length) return '';
    return '<h2>原卷研讀與作答</h2><p class="result-note">保留完整原始版面與附圖。原卷可能含答案；作答卡僅針對已核對答案的題目記錄正確率。</p><div class="paper-list">' + list.map(function (paper) {
      var count = /^(verified|partial)$/.test(paper.answerStatus) ? (paper.answers || []).filter(global.IpasPaper.gradeable).length : 0;
      return '<article class="paper-item"><a href="?cert=' + encodeURIComponent(cert.id) + '&paper=' + encodeURIComponent(paper.id) + '">' + esc(paper.title) + ' →</a><span>' + esc(({junior:'初級',intermediate:'中級',advanced:'高級'})[paper.levelId] || paper.levelId || '') + ' · ' + (paper.pages || []).length + ' 頁原卷 · ' + (count ? count + ' 題可記錄作答' : '原卷閱讀') + '</span></article>';
    }).join('') + '</div>';
  }
  function detail(cert) {
    document.title = cert.name + '｜全部 iPAS 考科';
    var resources = cert.resources || [], info=practiceInfo(cert.id);
    app.innerHTML = '<a class="back" href="./" data-cert="">← 全部鑑定</a><p class="eyebrow">' + esc(cert.category) + ' · ' + esc(cert.officialCode) + '</p><h1>' + esc(cert.name) + '</h1>' +
      (cert.status !== 'active' ? '<p class="note">歷史鑑定：本頁保留原制別供查閱，並非現行可報名項目。' + esc(cert.statusNote || cert.coverageNote || '') + '</p>' : '') +
      '<div class="detail-links">' + practiceLink(cert,'') + localLink(cert.existingApp, '章節學習區','button') + link(cert.examInfoUrl || cert.officialUrl, '官方考試資訊', 'button') + link(cert.resourcesUrl, '官方學習資源', 'button') + '</div>' +
      (info && info.total ? '<p class="practice-entry">' + info.total + ' 題可練習 · 支援錯題複習、收藏與進度儲存。請在下方選擇考科，官方與自編題也可分開篩選。</p>' : '') +
      (cert.coverageNote ? '<p class="note">' + esc(cert.coverageNote) + '</p>' : '') +
      (cert.resourceNote ? '<p class="note">' + esc(cert.resourceNote) + '</p>' : '') +
      (cert.selectionNote ? '<p class="note">' + esc(cert.selectionNote) + '</p>' : '') +
      (cert.levels || []).map(function (level) { return '<section class="level"><h2>' + esc(level.name) + '</h2>' + (level.selectionNote ? '<p>' + esc(level.selectionNote) + '</p>' : '') +
        '<ul class="subject-list">' + (level.subjects || []).map(function (subject) { var stats=info && info.subjects[subject.id]; return '<li><div>' + esc(subject.name) + '<span class="subject-practice">' + (stats ? stats.total + ' 題 · ' : '') + esc(typeNames[subject.type] || subject.type || '') + '</span></div>' + practiceLink(cert,subject.id,'練習此科','button') + '</li>'; }).join('') + '</ul>' +
        '<div class="detail-links">' + localLink(level.existingApp, level.name + '章節學習區') + '</div>' + link(level.sourceUrl || cert.examInfoUrl, '考科官方依據', 'level-source') + '</section>'; }).join('') +
      paperList(cert) + '<h2>官方準備資源</h2><p class="result-note">指引、參考題與歷屆試題分別標示；術科請依官方實作要求準備。</p>' +
      (resources.length ? '<ul class="resource-list">' + resources.map(function (resource) { return '<li><div class="resource-kind">' + esc(kindNames[resource.sourceKind || resource.kind] || resource.kind || '官方資源') + (resource.level ? ' · ' + esc(({junior:'初級',intermediate:'中級',advanced:'高級'})[resource.level] || resource.level) : '') + '</div>' + link(resource.url, resource.title) + (resource.note ? '<p class="result-note">' + esc(resource.note) + '</p>' : '') + '</li>'; }).join('') + '</ul>' : '<p class="note">目前整理到的官方頁面未提供可直接連結的公開題卷；可從上方官方學習資源查看最新公告。</p>') +
      '<p class="verified">核對日期 ' + esc(data.updatedAt) + '。刷題的公開來源與自編內容均逐題標示；術科圖解練習不取代正式實作評量。</p>';
    bindLinks();
  }
  function render() {
    var params = new URL(location.href).searchParams, id = params.get('cert'), paperId = params.get('paper');
    var practiceId=params.get('practice');
    if(practiceId) {
      var practiceCert=data.certifications.find(function(c){return c.id===practiceId;});
      if(practiceCert) { global.IpasPractice.open(practiceCert,practiceInfo(practiceId),app,function(){navigate(practiceId);},params.get('subject')); return; }
      app.innerHTML='<h1>找不到這項題庫</h1><a class="button" href="./">返回全部考科</a>'; return;
    }
    global.IpasPractice.cancel();
    if (paperId) {
      var paper = papers.find(function (p) { return p.id === paperId; });
      if (paper) { global.IpasPaperReader.open(paper, app, function () { navigate(paper.certId); }); return; }
      app.innerHTML = '<h1>找不到這份試卷</h1><a class="button" href="./">返回完整目錄</a>'; return;
    }
    var cert = data.certifications.find(function (c) { return c.id === id; });
    if (id && !cert) {
      app.innerHTML = '<h1>找不到這項鑑定</h1><p>這個連結可能已變更，請從完整目錄重新選擇。</p><a href="./" data-cert="" class="button">返回全部考科</a>'; bindLinks(); return;
    }
    if (cert) detail(cert); else directory();
  }
  async function init() {
    if (!await global.IpasAuth.ready) return;
    try {
      var response = await fetch('data/certifications.json?v=2');
      if (!response.ok) throw new Error('catalog unavailable');
      data = await response.json();
      var paperResponse = await fetch('data/papers.json?v=1');
      if (!paperResponse.ok) throw new Error('paper catalog unavailable');
      var paperData = await paperResponse.json(); papers = paperData.papers || [];
      var practiceResponse=await fetch('data/practice-index.json?v=2',{cache:'no-cache'});
      if(!practiceResponse.ok)throw new Error('practice index unavailable');
      practiceIndex=await practiceResponse.json();
      if (!Array.isArray(data.certifications) || !data.certifications.length) throw new Error('catalog empty');
      render();
    } catch (_) {
      app.innerHTML = '<h1>考科目錄暫時無法載入</h1><p>請確認網路連線後重新載入。</p><button id="reloadCatalog" class="button">重新載入</button>';
      document.getElementById('reloadCatalog').onclick = init;
    }
  }
  document.getElementById('themeToggle').onclick = function () {
    var root = document.documentElement, current = root.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    root.dataset.theme = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('ipas_shared_theme', root.dataset.theme); } catch (_) {}
  };
  window.addEventListener('popstate', function () { if (data) render(); });
  window.addEventListener('storage', function (e) { if (e.key === 'ipas_shared_theme' && /^(dark|light)$/.test(e.newValue)) document.documentElement.dataset.theme = e.newValue; });
  init();
})(window);

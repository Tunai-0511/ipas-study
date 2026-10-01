(function (global) {
  'use strict';
  var state = { version: 1, attempts: [], drafts: {} }, userId, timer, syncing, revision = 0, generation = 0, resolveReady;
  var ready = new Promise(function (resolve) { resolveReady = resolve; });
  var status = '學習紀錄將儲存在你的帳號';
  function report(message) {
    status = message;
    document.querySelectorAll('[data-progress-status]').forEach(function (node) { node.textContent = status; });
  }
  function current(run) { return run.owner === userId && run.generation === generation; }
  function cache(owner) {
    try { localStorage.setItem('ipas_catalog_v1_' + owner, JSON.stringify(state)); } catch (_) {}
  }
  function cloudSnapshot() {
    var snapshot = JSON.parse(JSON.stringify(state)), user = global.IpasCatalogUser || {}, savedName = '';
    try { if (localStorage.getItem('ipas_shared_name_owner') === userId) savedName = localStorage.getItem('ipas_shared_name') || ''; } catch (_) {}
    var metadata = user.user_metadata || {};
    var name = savedName || metadata.full_name || metadata.name || (user.email || '').split('@')[0] || '學習者';
    // Keep the reader's state intact and project attempts into the existing admin RPC format.
    snapshot.profiles = [{ id: 'catalog', name: name }];
    snapshot.data = { catalog: { attempts: snapshot.attempts.map(function (attempt) {
      var result = attempt.result || {};
      return { id: attempt.id, subjectName: attempt.paperTitle || attempt.paperId || '原卷研讀', modeName: '原卷研讀',
        correct: result.correct || 0, total: result.total || 0, score: result.percent == null ? null : result.percent, finishedAt: attempt.finishedAt };
    }) } };
    return snapshot;
  }
  function persist() {
    if (!userId) return;
    revision++;
    try { localStorage.setItem('ipas_catalog_v1_' + userId, JSON.stringify(state)); report('已存本機，準備同步'); }
    catch (_) { report('本機儲存空間不足，正在嘗試雲端同步'); }
    clearTimeout(timer); timer = setTimeout(sync, 2000);
  }
  async function sync() {
    if (!userId) return;
    if (syncing && current(syncing)) return syncing.promise;
    clearTimeout(timer);
    timer = null;
    var run = { owner: userId, generation: generation, revision: revision };
    syncing = run;
    run.promise = (async function () {
      try {
        var result = await global.IpasClient.from('user_state').select('data').eq('user_id', run.owner).eq('app', 'catalog').maybeSingle();
        if (!current(run)) return;
        if (result.error) throw result.error;
        var remote = global.IpasPaper.merge(result.data && result.data.data);
        state = global.IpasPaper.merge(remote, state);
        cache(run.owner);
        run.revision = revision;
        // Only local changes need a write. Viewing a new account must not create an empty row.
        if ((!state.attempts.length && !Object.keys(state.drafts).length) || JSON.stringify(state) === JSON.stringify(remote)) {
          report('學習紀錄已就緒'); return;
        }
        var snapshot = cloudSnapshot();
        var saved = await global.IpasClient.from('user_state').upsert({ user_id: run.owner, app: 'catalog', data: snapshot, updated_at: new Date().toISOString() });
        if (!current(run)) return;
        if (saved.error) throw saved.error;
        cache(run.owner);
        report(revision === run.revision ? '學習紀錄已同步' : '已存本機，準備同步');
      } catch (_) { if (current(run)) report('已保留本機紀錄，連線恢復後重試同步'); }
      finally {
        if (syncing === run) syncing = null;
        if (current(run) && revision !== run.revision) { clearTimeout(timer); timer = setTimeout(sync, 0); }
      }
    })();
    return run.promise;
  }
  function invalidate() {
    generation++;
    clearTimeout(timer); timer = null;
    userId = null; syncing = null; revision = 0;
    state = global.IpasPaper.merge();
  }
  function init() {
    var user = global.IpasCatalogUser;
    if (!user || user.id === userId) return;
    invalidate();
    userId = user.id;
    try { state = global.IpasPaper.merge(null, JSON.parse(localStorage.getItem('ipas_catalog_v1_' + userId) || 'null')); } catch (_) { state = global.IpasPaper.merge(); }
    var started = generation;
    // This also uploads progress retained during an earlier offline visit.
    sync().finally(function () { if (generation === started) resolveReady(); });
  }
  global.CatalogProgress = {
    ready: ready,
    draft: function (id) { return (state.drafts[id] || {}).responses || {}; },
    saveDraft: function (id, responses) {
      if (!userId) return;
      var previous = Date.parse((state.drafts[id] || {}).updatedAt) || 0;
      var updatedAt = new Date(Math.max(new Date().getTime(), previous + 1)).toISOString();
      state.drafts[id] = { updatedAt: updatedAt, responses: Object.assign({}, responses) }; persist();
    },
    addAttempt: function (paper, result) {
      if (!userId) return;
      state.attempts.push({ id: crypto.randomUUID(), paperId: paper.id, paperTitle: paper.title, certId: paper.certId, levelId: paper.levelId, finishedAt: new Date().toISOString(), result: result });
      state.attempts = state.attempts.slice(-400); persist();
    },
    attempts: function (paperId) { return state.attempts.filter(function (attempt) { return attempt.paperId === paperId; }); },
    status: function () { return status; }, sync: sync
  };
  document.addEventListener('catalog-auth-ready', init);
  document.addEventListener('catalog-auth-invalidated', invalidate);
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && timer) sync(); });
  init();
})(window);

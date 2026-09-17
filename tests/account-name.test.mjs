import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const user = { id: 'account-a', email: 'tunai.study@gmail.com', user_metadata: {} };
const bucket = (id) => ({ attempts: [{ id }], aiQuestions: [], explains: {}, bookmarks: ['q1'], hidden: ['q2'] });
const saved = (name = '原來的名稱') => ({
  version: 1, currentId: 'saved-profile', profiles: [{ id: 'saved-profile', name }],
  data: { 'saved-profile': bucket('old-attempt') },
});

function setup(app, { account = user, rows = [], storage = {}, state, pull } = {}) {
  const values = new Map(Object.entries(storage));
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  const storeCode = readFileSync(new URL(`../${app}/assets/js/store.js`, import.meta.url), 'utf8');
  const rootKey = /var ROOT = "([^"]+)"/.exec(storeCode)[1];
  if (state) localStorage.setItem(rootKey, JSON.stringify(state));
  const labels = { userNameLabel: {}, userAvatar: {} };
  const writes = [], events = [], timers = new Map();
  let authHandler, timerId = 0, reads = 0;
  const client = {
    auth: {
      getUser: async () => ({ data: { user: account } }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (fn) => { authHandler = fn; },
    },
    from: () => ({
      select: () => ({ in: async () => { reads++; return pull ? pull() : { data: rows }; } }),
      upsert: async (data) => { writes.push(JSON.parse(JSON.stringify(data))); return {}; },
    }),
  };
  const context = vm.createContext({
    console, localStorage, sessionStorage: localStorage,
    location: { pathname: `/${app}/`, origin: 'https://example.test' },
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
    addEventListener() {},
    CustomEvent: class { constructor(type) { this.type = type; } },
    document: {
      readyState: 'complete', getElementById: (id) => labels[id] || null,
      addEventListener() {}, dispatchEvent: (event) => events.push(event.type),
      documentElement: { setAttribute() {} }, body: { setAttribute() {} },
    },
    supabase: { createClient: () => client },
    // Account-name tests start after the separately tested login guard accepts a session.
    IpasAuth: { check: () => ({ then: (callback) => callback(true) }) },
  });
  context.window = context;
  vm.runInContext(storeCode, context);
  vm.runInContext(readFileSync(new URL(`../${app}/assets/js/cloud.js`, import.meta.url), 'utf8'), context);
  return {
    context, localStorage, labels, writes, events, timers,
    get reads() { return reads; },
    auth: (event) => authHandler(event),
    async sync() { await context.Cloud.syncNow(); await new Promise(setImmediate); },
  };
}

for (const app of ['junior', 'intermediate', 'bi']) {
  test(`${app}: first email login names the existing profile and persists the account name`, async () => {
    const h = setup(app);
    const id = h.context.Store.currentId();
    await h.sync();
    assert.equal(h.context.Store.current().name, 'tunai.study');
    assert.equal(h.context.Store.currentId(), id);
    assert.equal(h.context.Store.profiles().length, 1);
    assert.equal(h.labels.userNameLabel.textContent, 'tunai.study');
    assert.ok(h.events.includes('profile-name-changed'));
    const shared = h.writes.at(-1).find((r) => r.app === 'shared').data;
    assert.equal(shared.name, 'tunai.study');
    assert.equal(shared.nameSource, 'account');
  });

  test(`${app}: existing account display metadata takes precedence over email`, async () => {
    const h = setup(app, { account: { ...user, user_metadata: { full_name: '王小明' } } });
    await h.sync();
    assert.equal(h.context.Store.current().name, '王小明');
  });

  test(`${app}: account names matching object properties survive reopening with progress intact`, async () => {
    const h = setup(app, { account: { ...user, email: 'constructor@gmail.com' } });
    await h.sync();
    h.context.Store.addAttempt({ score: 80 });
    const reopened = setup(app, { state: h.context.Store.exportAll() });
    assert.equal(reopened.context.Store.profiles().length, 1);
    assert.equal(reopened.context.Store.current().name, 'constructor');
    assert.equal(reopened.context.Store.attempts()[0].score, 80);
  });

  test(`${app}: legacy placeholder cloud names do not override login names`, async () => {
    const h = setup(app, { rows: [{ app: 'shared', data: { name: '使用者' } }] });
    await h.sync();
    assert.equal(h.context.Store.current().name, 'tunai.study');
  });

  test(`${app}: a new device restores the selected cloud profile and its learning history`, async () => {
    const h = setup(app, { rows: [
      { app: 'shared', data: { name: '保留我的名字' } },
      { app, data: saved() },
    ] });
    await h.sync();
    assert.equal(h.context.Store.current().name, '保留我的名字');
    assert.equal(h.context.Store.currentId(), 'saved-profile');
    assert.equal(h.context.Store.profiles().length, 1);
    assert.equal(h.context.Store.attempts()[0].id, 'old-attempt');
    assert.equal(h.context.Store.getBookmarks()[0], 'q1');
    assert.equal(h.context.Store.isHidden('q2'), true);
  });

  test(`${app}: name-only changes keep the current profile and its local records`, async () => {
    const h = setup(app, { state: saved('使用者') });
    await h.sync();
    assert.equal(h.context.Store.currentId(), 'saved-profile');
    assert.equal(h.context.Store.attempts()[0].id, 'old-attempt');
    assert.equal(h.context.Store.current().name, 'tunai.study');
  });

  for (const input of ['手動新名稱', '   ']) {
    test(`${app}: a rename dialog opened before cloud restore saves against the restored profile (${input.trim() ? 'new name' : 'blank name'})`, async () => {
      const h = setup(app, { rows: [
        { app, data: saved() },
        { app: 'shared', data: { name: '雲端名稱' } },
      ] });
      const controls = {
        '#rnName': { value: input, focus() {} }, '#mCancel': {}, '#mOk': {},
      };
      Object.assign(h.context, {
        $: (selector) => controls[selector], esc: (value) => value,
        modal() {}, closeModal() {}, refreshUserName() {}, toast() {},
      });
      // Run the production dialog handler with the real Store and cloud restore.
      const appCode = readFileSync(new URL(`../${app}/assets/js/app.js`, import.meta.url), 'utf8');
      const start = appCode.indexOf('  function renameDlg()');
      const end = appCode.indexOf('  /* AI 模型', start);
      assert.ok(start >= 0 && end > start);
      vm.runInContext(appCode.slice(start, end), h.context);
      h.context.renameDlg();
      const openedId = h.context.Store.currentId();

      await h.sync();
      assert.notEqual(h.context.Store.currentId(), openedId);
      controls['#mOk'].onclick();

      const expectedName = input.trim() || '雲端名稱';
      assert.equal(h.context.Store.currentId(), 'saved-profile');
      assert.equal(h.context.Store.current().name, expectedName);
      assert.equal(h.context.Store.attempts()[0].id, 'old-attempt');
      assert.equal(h.localStorage.getItem('ipas_shared_name'), expectedName);
      assert.equal(h.timers.size, 1, 'saving must schedule the updated name for cloud persistence');
      [...h.timers.values()][0]();
      await new Promise(setImmediate);
      assert.equal(h.writes.length, 2);
      const shared = h.writes.at(-1).find((row) => row.app === 'shared').data;
      assert.equal(shared.name, expectedName);
      assert.equal(shared.nameSource, 'custom');
    });
  }

  test(`${app}: a rename during a cloud pull wins over the older saved name`, async () => {
    let resolve;
    const h = setup(app, { pull: () => new Promise((r) => { resolve = r; }) });
    const syncing = h.sync();
    await new Promise(setImmediate);
    h.localStorage.setItem('ipas_shared_name', '剛修改的名字');
    h.localStorage.setItem('ipas_shared_name_source', 'custom');
    h.localStorage.setItem('ipas_shared_name_updated_at', '200');
    h.context.Store.renameProfile(h.context.Store.currentId(), '剛修改的名字');
    resolve({ data: [{ app: 'shared', data: { name: '旧名稱', nameSource: 'custom', nameUpdatedAt: 100 } }] });
    await syncing;
    assert.equal(h.context.Store.current().name, '剛修改的名字');
    assert.equal(h.writes.at(-1).find((r) => r.app === 'shared').data.nameUpdatedAt, 200);
  });

  test(`${app}: a newer custom cloud name wins and a deliberately chosen placeholder is retained`, async () => {
    const h = setup(app, {
      storage: { ipas_shared_name: '本機舊名', ipas_shared_name_source: 'custom', ipas_shared_name_updated_at: '100' },
      rows: [{ app: 'shared', data: { name: '使用者', nameSource: 'custom', nameUpdatedAt: 200 } }],
    });
    await h.sync();
    assert.equal(h.context.Store.current().name, '使用者');
    assert.equal(h.localStorage.getItem('ipas_shared_name_updated_at'), '200');
  });

  test(`${app}: guests keep the local name and do not write cloud data`, async () => {
    const h = setup(app, { account: null });
    await h.sync();
    assert.equal(h.context.Store.current().name, '使用者');
    assert.equal(h.writes.length, 0);
  });

  test(`${app}: repeated sync requests share one pull and auth callbacks defer async work`, async () => {
    const h = setup(app);
    h.auth('SIGNED_IN');
    assert.equal(h.reads, 0);
    await Promise.all([h.sync(), h.sync()]);
    assert.equal(h.reads, 1);
  });
}

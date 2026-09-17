import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const code = readFileSync(new URL('../assets/require-auth.js', import.meta.url), 'utf8');
const settle = () => new Promise(setImmediate);
const session = { user: { id: 'account-a' } };

function setup({ session: savedSession = session, initialize, getSession, values = {}, sdk = false } = {}) {
  const storage = new Map(Object.entries({ ipas_guest: '1', learning: 'saved-progress', ...values }));
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  };
  const sessionValues = new Map([['ipas_guest', '1'], ['keep-tab-state', 'present']]);
  const sessionStorage = {
    getItem: (key) => sessionValues.get(key) ?? null,
    setItem: (key, value) => sessionValues.set(key, String(value)),
    removeItem: (key) => sessionValues.delete(key),
  };
  const attrs = new Set(['data-auth-pending']);
  const elements = { authMessage: { textContent: '' }, authRetry: { hidden: true } };
  const listeners = new Map(), timers = new Map(), redirects = [], handlers = [];
  let timer = 0, reloads = 0, networkCalls = 0;
  const on = (type, handler) => { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(handler); };
  const context = vm.createContext({
    console, URL, URLSearchParams, crypto: webcrypto, Response, Headers, Request,
    TextEncoder, TextDecoder, WebSocket: class {}, navigator: {},
    location: { ...new URL('https://example.test/junior/'), href: 'https://example.test/junior/', hash: '',
      replace: (target) => redirects.push(target), reload: () => reloads++ },
    localStorage, sessionStorage,
    setTimeout: (fn) => { timers.set(++timer, fn); return timer; },
    clearTimeout: (id) => timers.delete(id), setInterval, clearInterval,
    addEventListener: on, removeEventListener() {},
    document: {
      visibilityState: 'visible', addEventListener: on,
      getElementById: (id) => elements[id] || null,
      documentElement: { setAttribute: (key) => attrs.add(key), removeAttribute: (key) => attrs.delete(key) },
    },
    fetch: async () => { networkCalls++; throw new Error('offline'); },
  });
  context.window = context;
  let client = { auth: {
    initialize: initialize || (async () => ({ error: null })),
    getSession: getSession || (async () => ({ data: { session: savedSession }, error: null })),
    onAuthStateChange: (handler) => handlers.push(handler),
  } };
  if (sdk) {
    vm.runInContext(readFileSync(new URL('../junior/assets/vendor/supabase.min.js', import.meta.url), 'utf8'), context);
    client = context.supabase.createClient('https://offline.supabase.co', 'test-anon-key', { auth: { autoRefreshToken: false } });
  }
  vm.runInContext(code, context);
  return {
    context, client, storage, sessionValues, elements, attrs, timers, redirects,
    check: () => context.IpasAuth.check(client),
    auth: (event) => handlers.forEach((handler) => handler(event)),
    emit: (type, event = {}) => (listeners.get(type) || []).forEach((handler) => handler(event)),
    get reloads() { return reloads; }, get networkCalls() { return networkCalls; },
  };
}

test('a legacy guest flag cannot enter, and redirect preserves local learning data', async () => {
  const h = setup({ session: null });
  assert.equal(await h.check(), false);
  assert.equal(await h.context.IpasAuth.ready, false);
  assert.deepEqual(h.redirects, ['/']);
  assert.equal(h.attrs.has('data-auth-pending'), true);
  assert.equal(h.storage.has('ipas_guest'), false);
  assert.equal(h.storage.get('learning'), 'saved-progress');
  assert.equal(h.sessionValues.has('ipas_guest'), false);
  assert.equal(h.sessionValues.get('keep-tab-state'), 'present');
});

test('only a successfully restored login opens the app and resolves bootstrap', async () => {
  let restore;
  const h = setup({ initialize: () => new Promise((resolve) => { restore = resolve; }) });
  const result = h.check();
  await settle();
  assert.equal(h.attrs.has('data-auth-pending'), true);
  restore({ error: null });
  assert.equal(await result, true);
  assert.equal(await h.context.IpasAuth.ready, true);
  assert.equal(h.attrs.has('data-auth-pending'), false);
  assert.equal(h.timers.size, 0);
});

for (const failure of [
  { initialize: async () => ({ error: new Error('private-auth-details') }) },
  { getSession: async () => ({ data: { session }, error: new Error('private-auth-details') }) },
  { getSession: async () => { throw new Error('private-auth-details'); } },
]) {
  test('auth failures stay closed with a retry action and do not create a redirect loop', async () => {
    const h = setup(failure);
    assert.equal(await h.check(), false);
    assert.equal(h.attrs.has('data-auth-pending'), true);
    assert.equal(h.elements.authRetry.hidden, false);
    assert.doesNotMatch(h.elements.authMessage.textContent, /private-auth-details/);
    assert.deepEqual(h.redirects, []);
    h.elements.authRetry.onclick();
    assert.equal(h.reloads, 1);
  });
}

test('a missing SDK or cloud module leaves the page closed with a working retry action', async () => {
  const h = setup();
  [...h.timers.values()][0]();
  assert.equal(await h.context.IpasAuth.ready, false);
  assert.equal(h.attrs.has('data-auth-pending'), true);
  assert.equal(h.elements.authRetry.hidden, false);
  assert.equal(await h.check(), false);
});

test('a login resolving after the timeout cannot reopen the app', async () => {
  let restore;
  const h = setup({ getSession: () => new Promise((resolve) => { restore = resolve; }) });
  const result = h.check();
  await settle();
  [...h.timers.values()][0]();
  restore({ data: { session }, error: null });
  assert.equal(await result, false);
  assert.equal(h.attrs.has('data-auth-pending'), true);
});

test('signout during restoration immediately masks the app and wins over a late session', async () => {
  let restore;
  const h = setup({ getSession: () => new Promise((resolve) => { restore = resolve; }) });
  const result = h.check();
  await settle();
  h.auth('SIGNED_OUT');
  restore({ data: { session }, error: null });
  assert.equal(await result, false);
  assert.equal(h.attrs.has('data-auth-pending'), true);
  assert.deepEqual(h.redirects, ['/']);
});

for (const [type, event] of [['pageshow', { persisted: true }], ['visibilitychange', {}], ['storage', { key: 'sb-project-auth-token' }]]) {
  test(`a ${type} check closes a previously open app when another tab has signed out`, async () => {
    let active = session;
    const h = setup({ getSession: async () => ({ data: { session: active }, error: null }) });
    await h.check();
    active = null;
    h.emit(type, event);
    assert.equal(h.attrs.has('data-auth-pending'), true);
    await settle();
    assert.deepEqual(h.redirects, ['/']);
  });
}

test('the bundled SDK keeps an unexpired saved login usable offline without fetching the user', async () => {
  const stored = {
    access_token: 'test-access-token', refresh_token: 'test-refresh-token', token_type: 'bearer',
    expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: 'account-a', email: 'learner@example.test' },
  };
  const h = setup({ sdk: true, values: { 'sb-offline-auth-token': JSON.stringify(stored) } });
  assert.equal(await h.check(), true);
  assert.equal(h.networkCalls, 0);
  assert.equal(h.attrs.has('data-auth-pending'), false);
  await h.client.auth.stopAutoRefresh();
});

for (const app of ['junior', 'intermediate', 'bi']) {
  test(`${app}: its real bootstrap cannot render or bind study controls before login`, async () => {
    const html = readFileSync(new URL(`../${app}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /<html[^>]+data-auth-pending/);
    assert.match(html, /html\[data-auth-pending\] body > :not\(#authLoading\)\{display:none!important\}/);
    assert.ok(html.indexOf('../assets/require-auth.js') < html.indexOf('assets/js/app.js'));
    const serviceWorker = readFileSync(new URL(`../${app}/service-worker.js`, import.meta.url), 'utf8');
    const guardURL = /src="([^\"]+require-auth\.js[^\"]*)"/.exec(html)[1];
    assert.ok(serviceWorker.includes(`"${guardURL}"`), 'the offline app shell must cache its login guard');
    const h = setup({ session: null });
    let queries = 0;
    h.context.document.querySelector = () => { queries++; throw new Error('study UI must not boot'); };
    vm.runInContext(readFileSync(new URL(`../${app}/assets/js/app.js`, import.meta.url), 'utf8'), h.context);
    assert.equal(queries, 0);
    await h.check();
    await settle();
    assert.equal(queries, 0);
    assert.equal(h.context.App, undefined);
  });
}

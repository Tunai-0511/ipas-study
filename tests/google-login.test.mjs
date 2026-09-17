import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const authCode = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1]).find((code) => code.includes('signInWithOtp'));
const settle = () => new Promise(setImmediate);
const plain = (value) => JSON.parse(JSON.stringify(value));

function setup({ settings = { external: { google: true } }, fetchSettings, oauth, url = 'https://example.test/', guest = false, session = null, sdkAvailable = true, sessionError = null, bundledSDK = false, userResponse } = {}) {
  const elements = new Map();
  for (const match of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)) {
    const classes = new Set(/class="([^"]*)"/.exec(match[0])?.[1].split(/\s+/) || []);
    elements.set(match[1], {
      hidden: /\bhidden\b/.test(match[0]), disabled: /\bdisabled\b/.test(match[0]),
      value: '', textContent: '', className: '', focus() {},
      setAttribute(key, value) { this[key] = String(value); },
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        contains: (name) => classes.has(name),
        toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
      },
    });
  }
  const root = { classList: elements.get('gate').classList };
  const values = new Map(guest ? [['ipas_guest', '1']] : []);
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  const listeners = new Map(), requests = [], oauthCalls = [], otpCalls = [], verifyCalls = [], clientArgs = [], historyCalls = [], timers = new Map();
  let authHandler, timerId = 0, realClient;
  const client = { auth: {
    initialize: async () => ({ error: null }),
    getSession: async () => ({ data: { session }, error: sessionError }),
    onAuthStateChange: (handler) => { authHandler = handler; },
    signInWithOAuth: (args) => { oauthCalls.push(plain(args)); return oauth ? oauth(args) : Promise.resolve({ data: { provider: 'google', url: 'https://accounts.google.com/o/oauth2/v2/auth' }, error: null }); },
    signInWithOtp: async (args) => { otpCalls.push(plain(args)); return { data: { user: null, session: null }, error: null }; },
    verifyOtp: async (args) => { verifyCalls.push(plain(args)); return { data: { user: null, session: null }, error: null }; },
    signOut: async () => { authHandler('SIGNED_OUT', null); return { error: null }; },
  } };
  const context = vm.createContext({
    console, URL, URLSearchParams, AbortController, location: new URL(url),
    crypto: webcrypto, Response, Headers, Request, TextEncoder, TextDecoder, WebSocket: class {}, navigator: {},
    history: { state: null, replaceState: (...args) => { historyCalls.push(args); context.location.href = new URL(args[2], context.location).href; } },
    document: { visibilityState: 'visible', getElementById: (id) => elements.get(id) || null, documentElement: root },
    sessionStorage: storage, localStorage: storage,
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
    setInterval, clearInterval, removeEventListener() {},
    addEventListener: (type, handler) => { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(handler); },
    fetch: async (requestUrl, options) => {
      requests.push({ url: requestUrl, options });
      if (bundledSDK && requestUrl.endsWith('/auth/v1/user')) {
        return userResponse ? userResponse() : new Response(JSON.stringify({ code: 'bad_jwt', message: 'private-token-detail' }), { status: 401, headers: { 'content-type': 'application/json' } });
      }
      if (!requestUrl.endsWith('/auth/v1/settings')) throw new Error('Unexpected fixture request');
      return fetchSettings ? fetchSettings(options) : { ok: true, json: async () => settings };
    },
    supabase: sdkAvailable ? { createClient: (...args) => { clientArgs.push(args); return client; } } : undefined,
  });
  context.window = context;
  if (bundledSDK) {
    vm.runInContext(readFileSync(new URL('../junior/assets/vendor/supabase.min.js', import.meta.url), 'utf8'), context);
    const createClient = context.supabase.createClient;
    context.supabase.createClient = (...args) => {
      clientArgs.push(args);
      realClient = createClient(...args, { auth: { autoRefreshToken: false } });
      return realClient;
    };
  }
  vm.runInContext(authCode, context);
  const emit = (type, event = {}) => (listeners.get(type) || []).forEach((handler) => handler(event));
  emit('DOMContentLoaded');
  return { elements, requests, oauthCalls, otpCalls, verifyCalls, historyCalls, clientArgs, storage, timers, emit, context, get realClient() { return realClient; }, auth: (...args) => authHandler(...args) };
}

test('Google stays unavailable until live provider settings confirm it is enabled', async () => {
  let resolve;
  const h = setup({ fetchSettings: () => new Promise((done) => { resolve = done; }) });
  assert.ok(h.elements.has('gateGoogle'), 'the login gate must offer a Google button');
  assert.equal(h.elements.get('gateGoogle').disabled, true);
  assert.equal(h.elements.get('gateGoogleWrap').hidden, true);
  h.elements.get('gateGoogle').onclick();
  assert.equal(h.oauthCalls.length, 0);
  resolve({ ok: true, json: async () => ({ external: { google: true } }) });
  await settle();
  assert.equal(h.elements.get('gateGoogle').disabled, false);
  assert.equal(h.elements.get('gateGoogleWrap').hidden, false);
  assert.equal(h.requests[0].url, `${h.clientArgs[0][0]}/auth/v1/settings`);
  assert.equal(h.requests[0].options.headers.apikey, h.clientArgs[0][1]);
});

for (const settings of [{ external: { google: false } }, { external: { google: 'true' } }, {}]) {
  test(`disabled or malformed provider settings keep Email OTP available: ${JSON.stringify(settings)}`, async () => {
    const h = setup({ settings });
    await settle();
    assert.ok(h.elements.has('gateGoogle'), 'the login gate must offer a Google button');
    assert.equal(h.elements.get('gateGoogleWrap').hidden, true);
    h.elements.get('gateGoogle').onclick();
    assert.equal(h.oauthCalls.length, 0);
    h.elements.get('gateEmail').value = ' learner@example.com ';
    h.elements.get('gateGo').onclick();
    await settle();
    assert.deepEqual(h.otpCalls, [{ email: 'learner@example.com', options: { emailRedirectTo: 'https://example.test/' } }]);
    h.elements.get('gateToken').value = '123456';
    h.elements.get('gateGo').onclick();
    await settle();
    assert.deepEqual(h.verifyCalls, [{ email: 'learner@example.com', token: '123456', type: 'email' }]);
    h.elements.get('gateGuest').onclick();
    assert.equal(h.storage.getItem('ipas_guest'), '1');
    assert.equal(h.elements.get('gate').classList.contains('gone'), true);
  });
}

for (const fetchSettings of [() => Promise.reject(new Error('offline')), () => ({ ok: false }), () => ({ ok: true, json: () => Promise.reject(new Error('invalid JSON')) })]) {
  test('settings request failures keep Google unavailable without disabling Email or guest', async () => {
    const h = setup({ fetchSettings });
    await settle();
    assert.ok(h.elements.has('gateGoogle'), 'the login gate must offer a Google button');
    assert.equal(h.elements.get('gateGoogle').disabled, true);
    assert.equal(h.elements.get('gateGoogleWrap').hidden, true);
    assert.equal(h.elements.get('gateGo').disabled, false);
    assert.equal(typeof h.elements.get('gateGuest').onclick, 'function');
    assert.equal(h.timers.size, 0);
  });
}

test('Google redirects to this portal without carrying query data or requesting extra scopes, and blocks double clicks', async () => {
  const h = setup({ url: 'https://example.test/index.html?next=https://evil.test/#private', guest: true });
  await settle();
  assert.ok(h.elements.has('gateGoogle'), 'the login gate must offer a Google button');
  h.elements.get('gateGoogle').onclick();
  h.elements.get('gateGoogle').onclick();
  await settle();
  assert.deepEqual(h.oauthCalls, [{ provider: 'google', options: { redirectTo: 'https://example.test/index.html', queryParams: { prompt: 'select_account' } } }]);
  assert.equal(h.elements.get('gateGoogle').disabled, true);
  assert.match(h.elements.get('gateGoogleLabel').textContent, /Google/);
  assert.notEqual(h.storage.getItem('ipas_guest'), '1');
  h.emit('pageshow', { persisted: true });
  await settle();
  assert.equal(h.elements.get('gateGoogle').disabled, false, 'returning from Google with browser Back must allow retry');
  h.elements.get('gateGoogle').onclick();
  assert.equal(h.oauthCalls.length, 2);
});

for (const oauth of [() => Promise.resolve({ data: { provider: 'google', url: null }, error: { message: 'private provider details' } }), () => Promise.reject(new Error('private provider details'))]) {
  test('OAuth errors return the Google button to a retryable state without showing provider details', async () => {
    const h = setup({ oauth });
    await settle();
    assert.ok(h.elements.has('gateGoogle'), 'the login gate must offer a Google button');
    h.elements.get('gateGoogle').onclick();
    await settle();
    assert.equal(h.elements.get('gateGoogle').disabled, false);
    assert.match(h.elements.get('gateOAuthStatus').textContent, /Google.*信箱/);
    assert.doesNotMatch(h.elements.get('gateOAuthStatus').textContent, /private provider details/);
    assert.equal(h.elements.get('gate').classList.contains('gone'), false);
    h.elements.get('gateGoogle').onclick();
    assert.equal(h.oauthCalls.length, 2);
  });
}

for (const suffix of ['?keep=1#error=access_denied&error_description=private-detail&access_token=private-token', '?keep=1&error=server_error&error_description=private-detail#view=study', '?keep=1#error=access_denied&error_code=otp_expired&error_description=private-detail']) {
  test(`OAuth callback failures remain visible even for previous guests and sanitize the address: ${suffix.split('error=')[1].split('&')[0]}`, async () => {
    const h = setup({ url: `https://example.test/${suffix}`, guest: true });
    await settle();
    assert.ok(h.elements.has('gateOAuthStatus'), 'the login gate must show an OAuth status');
    assert.match(h.elements.get('gateOAuthStatus').textContent, /登入/);
    assert.doesNotMatch(h.elements.get('gateOAuthStatus').textContent, /Google/, 'callback errors can also come from Email magic links');
    assert.doesNotMatch(h.elements.get('gateOAuthStatus').textContent, /private-detail|private-token/);
    assert.equal(h.elements.get('gate').classList.contains('gone'), false);
    assert.equal(h.historyCalls.length, 1);
    assert.match(h.historyCalls[0][2], /keep=1/);
    assert.doesNotMatch(h.historyCalls[0][2], /error|private-/);
  });
}

test('successful callbacks leave session parsing to Supabase and show the logged-in portal', async () => {
  const h = setup({ url: 'https://example.test/#access_token=sample&refresh_token=sample', session: { user: { email: 'learner@example.com' } } });
  await settle();
  assert.equal(h.historyCalls.length, 0);
  assert.equal(h.elements.get('gate').classList.contains('gone'), true);
  assert.equal(h.elements.get('chipMail').textContent, 'learner@example.com');
});

test('an unavailable auth library requires an explicit guest choice instead of hiding the login gate', async () => {
  const h = setup({ sdkAvailable: false, guest: true });
  await settle();
  assert.equal(h.elements.get('gate').classList.contains('gone'), false);
  assert.equal(h.elements.get('gateGo').disabled, true);
  assert.match(h.elements.get('gateStatus').textContent, /登入.*重新整理/);
  h.elements.get('gateGuest').onclick();
  assert.equal(h.elements.get('gate').classList.contains('gone'), true);
});

test('a failed session callback is visible and does not silently continue as a previous guest', async () => {
  const h = setup({ guest: true, sessionError: { message: 'private-token-detail' } });
  await settle();
  assert.equal(h.elements.get('gate').classList.contains('gone'), false);
  assert.match(h.elements.get('gateOAuthStatus').textContent, /登入/);
  assert.doesNotMatch(h.elements.get('gateOAuthStatus').textContent, /private-token-detail/);
});

test('a provider settings timeout aborts only that check and leaves other login choices working', async () => {
  const h = setup({ fetchSettings: ({ signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')));
  }) });
  assert.equal(h.timers.size, 1);
  [...h.timers.values()][0]();
  await settle();
  assert.equal(h.elements.get('gateGoogle').disabled, true);
  assert.equal(h.elements.get('gateGo').disabled, false);
  assert.equal(h.timers.size, 0);
});

for (const guest of [false, true]) {
  test(`bundled SDK: a rejected callback token is cleaned up and cannot become silent guest access (previous guest: ${guest})`, async () => {
    const h = setup({
      bundledSDK: true, guest,
      url: 'https://example.test/?keep=1#access_token=synthetic-token&refresh_token=synthetic-refresh&provider_token=synthetic-provider&expires_in=3600&token_type=bearer',
    });
    const initialized = await h.realClient.auth.initialize();
    await settle();
    assert.ok(initialized.error, 'the real bundled SDK must reject the synthetic user response');
    assert.ok(h.requests.some((request) => request.url.endsWith('/auth/v1/user')));
    assert.equal(h.elements.get('gate').classList.contains('gone'), false);
    assert.match(h.elements.get('gateOAuthStatus').textContent, /登入.*信箱/);
    assert.doesNotMatch(h.elements.get('gateOAuthStatus').textContent, /private-token-detail|synthetic-/);
    assert.equal(h.context.location.href, 'https://example.test/?keep=1');
    assert.equal(h.elements.get('gateGoogle').disabled, false);
  });
}

test('a cancelled callback takes precedence over an existing session until the user retries login', async () => {
  const h = setup({ url: 'https://example.test/#error=access_denied', session: { user: { email: 'existing@example.com' } } });
  await settle();
  assert.equal(h.elements.get('gate').classList.contains('gone'), false);
  h.auth('SIGNED_IN', { user: { email: 'existing@example.com' } });
  assert.equal(h.elements.get('gate').classList.contains('gone'), false);
  h.elements.get('gateEmail').value = 'retry@example.com';
  h.elements.get('gateGo').onclick();
  await settle();
  h.auth('SIGNED_IN', { user: { email: 'retry@example.com' } });
  assert.equal(h.elements.get('gate').classList.contains('gone'), true);
  assert.equal(h.elements.get('chipMail').textContent, 'retry@example.com');
});

test('Google retry clears a cancelled callback guard so a new successful login can enter', async () => {
  const h = setup({ url: 'https://example.test/#error=access_denied' });
  await settle();
  h.elements.get('gateGoogle').onclick();
  await settle();
  h.auth('SIGNED_IN', { user: { email: 'retry@example.com' } });
  assert.equal(h.elements.get('gate').classList.contains('gone'), true);
});

test('bundled SDK: a successful callback keeps normal session storage and opens the portal', async () => {
  const token = `${Buffer.from('{"alg":"HS256"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: 'synthetic-user', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.synthetic-signature`;
  const h = setup({
    bundledSDK: true,
    url: `https://example.test/#access_token=${token}&refresh_token=synthetic-refresh&expires_in=3600&token_type=bearer`,
    userResponse: () => new Response(JSON.stringify({ id: 'synthetic-user', email: 'learner@example.com', app_metadata: { provider: 'google' }, user_metadata: { full_name: '測試名稱' } }), { status: 200, headers: { 'content-type': 'application/json' } }),
  });
  assert.equal((await h.realClient.auth.initialize()).error, null);
  await settle();
  assert.equal(h.elements.get('gate').classList.contains('gone'), true);
  assert.equal(h.elements.get('chipMail').textContent, 'learner@example.com');
  assert.equal(h.elements.get('gateOAuthStatus').textContent, '');
  assert.equal(h.context.location.hash, '');
  const saved = await h.realClient.auth.getSession();
  assert.equal(saved.data.session.user.id, 'synthetic-user');
});

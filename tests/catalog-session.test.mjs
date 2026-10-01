import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code = readFileSync(new URL('../catalog/assets/session.js', import.meta.url), 'utf8');
const settle = () => new Promise(setImmediate);
function setup({ getSession } = {}) {
  const callbacks = [], attrs = new Set(), events = [], elements = { accountName: {}, authMessage: {}, authRetry: {} };
  let reloads = 0;
  const user = { id: 'A', email: 'a@example.test', user_metadata: { full_name: 'Learner A' } };
  const sb = { auth: {
    getSession: getSession || (async () => ({ data: { session: { user } }, error: null })),
    onAuthStateChange: fn => { callbacks.push(fn); return { data: { subscription: { unsubscribe() {} } } }; },
  } };
  const context = vm.createContext({
    supabase: { createClient: () => sb }, IpasAuth: { check: async () => true },
    localStorage: { getItem: () => null }, location: { reload: () => reloads++ }, Event: class { constructor(type) { this.type = type; } },
    document: { getElementById: id => elements[id], dispatchEvent: event => events.push(event.type), documentElement: { setAttribute: key => attrs.add(key) } },
  });
  context.window = context;
  vm.runInContext(code, context);
  return { context, attrs, events, elements, get reloads() { return reloads; }, auth(event, id) {
    callbacks.forEach(fn => fn(event, id ? { user: { id } } : null));
  } };
}

test('another tab signing into a different account masks and reloads the catalog before reusing progress', async () => {
  const h = setup(); await settle();
  assert.equal(h.context.IpasCatalogUser.id, 'A');
  h.auth('SIGNED_IN', 'B');
  assert.equal(h.attrs.has('data-auth-pending'), true);
  assert.equal(h.context.IpasCatalogUser, null);
  assert.ok(h.events.includes('catalog-auth-invalidated'));
  assert.equal(h.reloads, 1);
  h.auth('SIGNED_IN', 'B');
  assert.equal(h.reloads, 1);
});

test('same-account sign-in and token refresh do not interrupt the current paper', async () => {
  const h = setup(); await settle();
  h.auth('SIGNED_IN', 'A'); h.auth('TOKEN_REFRESHED', 'A');
  assert.equal(h.reloads, 0);
  assert.equal(h.context.IpasCatalogUser.id, 'A');
  assert.equal(h.elements.accountName.textContent, 'Learner A');
});

test('a session response captured before an account switch cannot publish the old user', async () => {
  let finish;
  const h = setup({ getSession: () => new Promise(resolve => { finish = resolve; }) });
  await settle();
  h.auth('SIGNED_IN', 'B');
  finish({ data: { session: { user: { id: 'A', email: 'a@example.test' } } }, error: null });
  await settle();
  assert.equal(h.context.IpasCatalogUser, null);
  assert.equal(h.reloads, 1);
  assert.equal(h.events.includes('catalog-auth-ready'), false);
});

test('signout invalidates progress immediately and cannot be undone by a late bootstrap', async () => {
  let finish;
  const h = setup({ getSession: () => new Promise(resolve => { finish = resolve; }) });
  await settle(); h.auth('SIGNED_OUT');
  finish({ data: { session: { user: { id: 'A' } } }, error: null });
  await settle();
  assert.equal(h.context.IpasCatalogUser, null);
  assert.ok(h.events.includes('catalog-auth-invalidated'));
  assert.equal(h.events.includes('catalog-auth-ready'), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

const source = name => readFileSync(new URL(`../catalog/assets/${name}.js`, import.meta.url), 'utf8');
const settle = () => new Promise(setImmediate);
const clone = value => JSON.parse(JSON.stringify(value));
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const draft = (answer, updatedAt = '2026-10-01T00:00:00Z') => ({ updatedAt, responses: { 1: answer } });
const progress = (id, answer = 'A') => ({ version: 1, attempts: [{ id, paperId: 'paper', finishedAt: '2026-10-01T00:00:00Z' }], drafts: { paper: draft(answer) } });

function setup({ local, remote = null, read, write, clock = Date } = {}) {
  const storage = new Map(local ? [['ipas_catalog_v1_A', JSON.stringify(local)]] : []);
  const listeners = new Map(), timers = new Map(), uploads = [];
  let timerId = 0;
  const on = (event, callback) => {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(callback);
  };
  const emit = event => (listeners.get(event) || []).forEach(fn => fn());
  const context = vm.createContext({
    crypto: webcrypto, Date: clock,
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    addEventListener: on,
    document: { addEventListener: on, querySelectorAll: () => [], visibilityState: 'visible' },
    IpasCatalogUser: { id: 'A', email: 'learner@example.test', user_metadata: { full_name: 'Learner A' } },
    IpasClient: {
      from() {
        const filters = {};
        return {
          select() { return this; },
          eq(key, value) { filters[key] = value; return this; },
          maybeSingle: () => read ? read(filters.user_id) : Promise.resolve({ data: remote ? { data: remote } : null, error: null }),
          upsert: row => {
            uploads.push(clone(row));
            return Promise.resolve(write ? write(row) : { error: null }).then(result => {
              if (!result.error) remote = clone(row.data);
              return result;
            });
          },
        };
      },
    },
  });
  context.window = context;
  vm.runInContext(source('paper-model'), context);
  vm.runInContext(source('progress'), context);
  return { context, api: context.CatalogProgress, storage, uploads, timers, emit,
    async runTimers() {
      const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); await settle();
    },
    changeUser(id) {
      context.IpasCatalogUser = id ? { id } : null;
      emit(id ? 'catalog-auth-ready' : 'catalog-auth-invalidated');
    },
  };
}

test('reopening online uploads the unsynced local attempt while retaining remote attempts', async () => {
  const h = setup({ local: progress('offline'), remote: progress('remote', 'B') });
  await h.api.ready;
  await h.runTimers();
  assert.equal(h.uploads.length, 1);
  assert.deepEqual(h.uploads[0].data.attempts.map(item => item.id).sort(), ['offline', 'remote']);
  assert.equal(h.uploads[0].user_id, 'A');
});

test('browsing an empty account and reconnecting never creates an empty cloud row', async () => {
  const h = setup();
  await h.api.ready;
  h.emit('online'); await settle(); await h.runTimers();
  assert.deepEqual(h.uploads, []);
});

test('practice reviews and favorite removal survive sync without an attempt', async () => {
  const h=setup(); await h.api.ready;
  const q={id:'sample',certId:'oia',subjectId:'oia-junior-1'};
  h.api.recordPractice(q,'A',false); h.api.favorite(q,true);
  await h.api.sync();
  assert.equal(h.uploads.length,1);
  assert.equal(h.uploads[0].data.practice.sample.correct,false);
  assert.equal(h.uploads[0].data.favorites.sample.active,true);
  const previous=h.api.favorites().sample.updatedAt;
  h.api.recordPractice(q,'C',true); h.api.favorite(q,false);
  await h.api.sync();
  assert.equal(h.uploads[1].data.practice.sample.correct,true);
  assert.equal(h.uploads[1].data.favorites.sample.active,false);
  assert.ok(h.uploads[1].data.favorites.sample.updatedAt>previous);
  const clone=h.api.practice(); clone.sample.correct=false;
  assert.equal(h.api.practice().sample.correct,true);
});

test('practice records clear on signout and cannot be written into the next account', async () => {
  const h=setup(); await h.api.ready;
  const q={id:'private',certId:'aiot',subjectId:'aiot-junior-1'};
  h.api.recordPractice(q,'D',false); h.api.favorite(q,true);
  h.changeUser(null);
  h.api.recordPractice(q,'A',true); h.api.favorite(q,false);
  assert.deepEqual(clone(h.api.practice()),{});
  assert.deepEqual(clone(h.api.favorites()),{});
  h.changeUser('B'); await settle();
  assert.deepEqual(clone(h.api.practice()),{});
  assert.deepEqual(clone(h.api.favorites()),{});
  assert.equal(JSON.parse(h.storage.get('ipas_catalog_v1_A')).practice.private.chosen,'D');
});

test('a local copy already present in the cloud does not trigger an unnecessary upload', async () => {
  const data = progress('saved');
  const h = setup({ local: data, remote: clone(data) });
  await h.api.ready; await h.runTimers();
  assert.equal(h.uploads.length, 0);
});

test('late initial reads cannot restore an invalidated account or accept more answers', async () => {
  const pending = deferred();
  const h = setup({ local: progress('local'), read: () => pending.promise });
  h.changeUser(null);
  pending.resolve({ data: { data: progress('remote-secret', 'D') }, error: null });
  await settle();
  h.api.saveDraft('paper', { 1: 'B' });
  await h.api.sync(); await h.runTimers();
  assert.deepEqual(clone(h.api.draft('paper')), {});
  assert.deepEqual(h.uploads, []);
  assert.equal(JSON.parse(h.storage.get('ipas_catalog_v1_A')).drafts.paper.responses[1], 'A');
});

test('late reads from the previous owner cannot merge into the new account', async () => {
  const pending = deferred();
  const h = setup({ read: owner => owner === 'A' ? pending.promise : Promise.resolve({ data: { data: progress('B-only', 'B') }, error: null }) });
  h.changeUser('B'); await settle();
  pending.resolve({ data: { data: progress('A-secret', 'A') }, error: null });
  await settle();
  assert.deepEqual(Array.from(h.api.attempts('paper'), item => item.id), ['B-only']);
  assert.equal(JSON.parse(h.storage.get('ipas_catalog_v1_B')).drafts.paper.responses[1], 'B');
  assert.deepEqual(h.uploads, []);
});

test('an upload completing after account invalidation cannot repopulate private state', async () => {
  const pending = deferred();
  const h = setup({ write: () => pending.promise });
  await h.api.ready;
  h.api.saveDraft('paper', { 1: 'C' });
  const syncing = h.api.sync(); await settle();
  assert.equal(h.uploads.length, 1);
  h.changeUser(null);
  pending.resolve({ error: null }); await syncing;
  assert.deepEqual(clone(h.api.draft('paper')), {});
  assert.equal(JSON.parse(h.storage.get('ipas_catalog_v1_A')).drafts.paper.responses[1], 'C');
  assert.equal(h.timers.size, 0);
});

test('answers made during an upload are kept locally and scheduled for a second upload', async () => {
  const pending = deferred(); let writes = 0;
  class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : ['2026-10-01T00:00:00Z'])); } }
  const h = setup({ clock: FixedDate, write: () => ++writes === 1 ? pending.promise : Promise.resolve({ error: null }) });
  await h.api.ready;
  h.api.saveDraft('paper', { 1: 'A' });
  const syncing = h.api.sync(); await settle();
  h.api.saveDraft('paper', { 1: 'D' });
  pending.resolve({ error: null }); await syncing;
  await h.runTimers();
  assert.equal(h.uploads.length, 2);
  assert.equal(h.uploads[0].data.drafts.paper.responses[1], 'A');
  assert.equal(h.uploads[1].data.drafts.paper.responses[1], 'D');
  assert.equal(JSON.parse(h.storage.get('ipas_catalog_v1_A')).drafts.paper.responses[1], 'D');
});

test('uploaded attempts retain reader results and expose the existing admin statistics shape', async () => {
  const h = setup(); await h.api.ready;
  h.api.addAttempt({ id: 'paper', certId: 'cpm', levelId: 'junior', title: '官方原卷標題' }, { total: 4, correct: 3, percent: 75, items: [{ number: 1, chosen: 'B', correct: true }] });
  await h.api.sync();
  const data = h.uploads[0].data;
  assert.equal(data.attempts[0].paperTitle, '官方原卷標題');
  assert.equal(data.attempts[0].result.items[0].chosen, 'B');
  assert.deepEqual(data.profiles, [{ id: 'catalog', name: 'Learner A' }]);
  const attempt = data.data.catalog.attempts[0];
  assert.equal(attempt.subjectName, '官方原卷標題');
  assert.equal(attempt.modeName, '原卷研讀');
  assert.equal(attempt.correct, 3);
  assert.equal(attempt.total, 4);
  assert.equal(attempt.score, 75);
  assert.equal(attempt.finishedAt, data.attempts[0].finishedAt);
});

test('existing administrator SQL counts catalog attempts and reads their titles and accuracy', async () => {
  const h = setup(); await h.api.ready;
  h.api.addAttempt({ id: 'paper', certId: 'cpm', title: '原卷 SQL 驗證' }, { total: 4, correct: 3, percent: 75, items: [] });
  await h.api.sync();
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated; create role service_role;
      create schema auth;
      create table auth.users (id uuid primary key, email text);
      create function auth.jwt() returns jsonb language sql stable as
        $$ select '{"email":"tunai0511edu@gmail.com"}'::jsonb $$;
      create function auth.uid() returns uuid language sql stable as
        $$ select null::uuid $$;
    `);
    await db.exec(readFileSync(new URL('../supabase-setup.sql', import.meta.url), 'utf8'));
    const id = '00000000-0000-4000-8000-000000000003';
    await db.query('insert into auth.users values ($1, $2)', [id, 'catalog@example.test']);
    await db.query('insert into public.user_state (user_id, app, data) values ($1, $2, $3)', [id, 'catalog', JSON.stringify(h.uploads[0].data)]);
    const stats = (await db.query('select public.usage_stats() as result')).rows[0].result;
    assert.equal(stats.by_app[0].attempts, 1);
    assert.equal(stats.users[0].name, 'Learner A');
    assert.equal(stats.users[0].accuracy, 75);
    const attempts = (await db.query('select public.user_attempts($1) as result', ['catalog@example.test'])).rows[0].result;
    assert.equal(attempts.length, 1);
    assert.equal(attempts[0].subject, '原卷 SQL 驗證');
    assert.equal(attempts[0].mode, '原卷研讀');
    assert.equal(attempts[0].score, '75');
  } finally { await db.close(); }
});

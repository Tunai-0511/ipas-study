import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Synthetic records only. Run against an isolated PostgreSQL engine, never production.
const db = new PGlite();
const setup = await readFile(new URL('../supabase-setup.sql', import.meta.url), 'utf8');
const learner = '00000000-0000-4000-8000-000000000001';
const other = '00000000-0000-4000-8000-000000000002';
const adminEmail = 'tunai0511edu@gmail.com'; // Existing project administrator allowlist.

before(async () => {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role;
    create schema auth;
    create table auth.users (id uuid primary key, email text);
    create function auth.jwt() returns jsonb language sql stable as
      $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as
      $$ select (auth.jwt()->>'sub')::uuid $$;
    grant usage on schema auth to anon, authenticated;
  `);
  await db.exec(setup);
  await db.query('insert into auth.users values ($1, $2), ($3, $4)',
    [learner, 'learner@example.test', other, 'other@example.test']);
  const data = { profiles: [{ id: 'p1', name: 'Synthetic learner' }], data: { p1: { attempts: [
    { subjectName: 'Test subject', modeName: 'Practice', correct: 8, total: 10, score: 80, finishedAt: '2026-09-15T01:00:00Z' }
  ] } } };
  await db.query('insert into public.user_state (user_id, app, data) values ($1, $2, $3), ($4, $2, $3)',
    [learner, 'junior', JSON.stringify(data), other]);
});
after(() => db.close());

async function asRole(role, claims, callback) {
  await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(claims)]);
  await db.exec(`set role ${role}`); // Roles are fixed test literals, not user input.
  try { return await callback(); }
  finally { await db.exec('reset role'); }
}

test('fresh setup lets the configured administrator read summaries and attempt details', async () => {
  await asRole('authenticated', { email: adminEmail }, async () => {
    const stats = (await db.query('select public.usage_stats() as value')).rows[0].value;
    assert.equal(stats.total_users, 2);
    assert.equal(stats.by_app[0].attempts, 2);
    assert.equal(stats.users.length, 2);
    assert.ok(stats.users.every(u => u.accuracy === 80));
    const attempts = (await db.query('select public.user_attempts($1) as value', ['learner@example.test'])).rows[0].value;
    assert.equal(attempts.length, 1);
    assert.equal(attempts[0].subject, 'Test subject');
    assert.equal(attempts[0].correct, '8');
    assert.deepEqual((await db.query('select public.user_attempts($1) as value', ['missing@example.test'])).rows[0].value, []);
  });
});

test('ordinary learners cannot call administrator reports', async () => {
  await asRole('authenticated', { sub: learner, email: 'learner@example.test' }, async () => {
    await assert.rejects(db.query('select public.usage_stats()'), /not authorized/);
    await assert.rejects(db.query('select public.user_attempts($1)', ['other@example.test']), /not authorized/);
  });
});

test('anonymous callers cannot execute administrator functions', async () => {
  await asRole('anon', {}, async () => {
    await assert.rejects(db.query('select public.usage_stats()'), /permission denied/);
    await assert.rejects(db.query('select public.user_attempts($1)', ['learner@example.test']), /permission denied/);
  });
});

test('row policies allow own progress and reject another learner or ownership reassignment', async () => {
  await asRole('authenticated', { sub: learner, email: 'learner@example.test' }, async () => {
    const visible = (await db.query('select user_id from public.user_state')).rows;
    assert.deepEqual(visible.map(r => r.user_id), [learner]);
    await db.query("update public.user_state set updated_at = now() where user_id = $1", [learner]);
    await assert.rejects(db.query("insert into public.user_state (user_id, app) values ($1, 'bi')", [other]), /row-level security/);
    await assert.rejects(db.query('update public.user_state set user_id = $1 where user_id = $2', [other, learner]), /row-level security/);
  });
});

test('re-running setup preserves existing progress and administrator access', async () => {
  await db.exec(setup);
  assert.equal((await db.query('select count(*)::int as count from public.user_state')).rows[0].count, 2);
  await asRole('authenticated', { email: adminEmail }, async () => {
    assert.equal((await db.query('select public.usage_stats() as value')).rows[0].value.total_users, 2);
  });
});

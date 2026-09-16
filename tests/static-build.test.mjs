import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, copyFile, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

test('a checkout inside a hidden worktree builds pages without publishing development files', async () => {
  const root = await mkdtemp(join(tmpdir(), '.ipas-build-'));
  async function put(path, text = path) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), text);
  }
  try {
    for (const path of ['index.html', 'admin/index.html', 'assets/logo.svg', 'media/hero.jpg',
      'supabase-setup.sql', '.env', 'README.md', 'assets/.secret']) await put(path);
    for (const app of ['junior', 'intermediate', 'bi']) {
      for (const path of ['index.html', 'manifest.webmanifest', 'service-worker.js',
        'assets/js/app.js', 'data/content.js', 'netlify/functions/ai-proxy.js']) await put(`${app}/${path}`);
    }
    await mkdir(join(root, 'scripts'));
    await copyFile(new URL('../scripts/build-static.mjs', import.meta.url), join(root, 'scripts/build-static.mjs'));
    execFileSync(process.execPath, [join(root, 'scripts/build-static.mjs')]);
    for (const path of ['index.html', 'admin/index.html', 'junior/index.html',
      'intermediate/assets/js/app.js', 'bi/data/content.js', 'assets/logo.svg', 'media/hero.jpg']) {
      assert.equal(await readFile(join(root, 'dist', path), 'utf8'), path);
    }
    for (const path of ['supabase-setup.sql', '.env', 'README.md', 'assets/.secret',
      'junior/netlify/functions/ai-proxy.js', 'scripts/build-static.mjs']) {
      await assert.rejects(access(join(root, 'dist', path)), { code: 'ENOENT' });
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});

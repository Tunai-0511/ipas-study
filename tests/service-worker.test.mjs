import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const prefixes = { junior: 'ipas-jr-v', intermediate: 'aipsc-v', bi: 'ipas-bi-v' };

for (const [app, prefix] of Object.entries(prefixes)) {
  test(`${app}: activating an update removes only its own old caches`, async () => {
    const handlers = new Map(), deleted = [];
    const keys = new Set([
      ...Object.values(prefixes).flatMap((value) => [value + '1', value + '2']),
      'other-app-cache', 'user-offline-files',
    ]);
    let claimed = false, activation;
    const context = vm.createContext({
      self: {
        addEventListener: (type, handler) => handlers.set(type, handler),
        clients: { claim: async () => { claimed = true; } },
      },
      caches: {
        keys: async () => [...keys],
        delete: async (key) => { deleted.push(key); return keys.delete(key); },
      },
    });
    vm.runInContext(readFileSync(new URL(`../${app}/service-worker.js`, import.meta.url), 'utf8'), context);
    keys.add(context.CACHE);
    const expected = [...keys].filter((key) => key !== prefix + '1' && key !== prefix + '2');
    handlers.get('activate')({ waitUntil: (promise) => { activation = promise; } });
    await activation;
    assert.deepEqual(deleted.sort(), [prefix + '1', prefix + '2']);
    assert.deepEqual([...keys].sort(), expected.sort());
    assert.equal(keys.has(context.CACHE), true);
    assert.equal(claimed, true);
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const prefixes = { junior: 'ipas-jr-v', intermediate: 'aipsc-v', bi: 'ipas-bi-v' };

function setupFetch(app) {
  const handlers = new Map(), cached = new Map(), writes = [];
  let network = () => new Response('<html>網站</html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  const keyOf = request => typeof request === 'string' ? request : request.url;
  const cache = {
    match: async request => cached.get(keyOf(request))?.clone(),
    put: async (request, response) => {
      const key = keyOf(request);
      writes.push({ key, type: response.headers.get('content-type') });
      cached.set(key, response.clone());
    },
  };
  const context = vm.createContext({
    URL, setTimeout: () => 1, clearTimeout() {},
    self: {
      location: new URL(`https://ipas.tun9i.com/${app}/service-worker.js`),
      addEventListener: (type, handler) => handlers.set(type, handler),
    },
    caches: { open: async () => cache, match: request => cache.match(request) },
    fetch: async request => network(request),
  });
  vm.runInContext(readFileSync(new URL(`../${app}/service-worker.js`, import.meta.url), 'utf8'), context);
  return {
    cached, writes,
    setNetwork: callback => { network = callback; },
    navigate(path = '') {
      let response;
      handlers.get('fetch')({
        request: { method: 'GET', mode: 'navigate', url: `https://ipas.tun9i.com/${app}/${path}` },
        respondWith: promise => { response = promise; },
      });
      return response;
    },
  };
}

for (const [app, prefix] of Object.entries(prefixes)) {
  test(`${app}: opening a question image preserves the HTML shell and caches the image separately`, async () => {
    const h = setupFetch(app);
    await h.navigate();
    h.setNetwork(() => new Response('PNG bytes', { headers: { 'Content-Type': 'image/png' } }));
    const imagePath = 'assets/questions/115-1/figure.png';
    assert.equal(await (await h.navigate(imagePath)).text(), 'PNG bytes');
    assert.equal(await h.cached.get('index.html').clone().text(), '<html>網站</html>');
    assert.equal(h.writes.at(-1).key, `https://ipas.tun9i.com/${app}/${imagePath}`);
    h.setNetwork(() => { throw new Error('offline'); });
    assert.equal(await (await h.navigate(imagePath)).text(), 'PNG bytes');
    const shell = await h.navigate();
    assert.match(shell.headers.get('content-type'), /^text\/html/);
    assert.equal(await shell.text(), '<html>網站</html>');
  });

  test(`${app}: root and index navigations cache HTML, but non-HTML responses cannot replace the shell`, async () => {
    const h = setupFetch(app);
    await h.navigate();
    h.setNetwork(() => new Response('<html>更新後</html>', { headers: { 'Content-Type': 'text/html' } }));
    await h.navigate('index.html?return=quiz');
    assert.equal(await h.cached.get('index.html').clone().text(), '<html>更新後</html>');
    h.setNetwork(() => new Response('not HTML', { headers: { 'Content-Type': 'image/png' } }));
    await h.navigate();
    assert.equal(await h.cached.get('index.html').clone().text(), '<html>更新後</html>');
  });

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

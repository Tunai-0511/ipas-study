import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const context = vm.createContext({ URL });
vm.runInContext(readFileSync(new URL('../catalog/assets/catalog-model.js', import.meta.url), 'utf8'), context);
const model = context.IpasCatalog;
const cert = { name: '資訊安全工程師', officialCode: 'ISE', category: '資訊類', levels: [
  { id: 'junior', name: '初級', subjects: [{ id: 'a', name: '資訊安全概論', type: 'written' }] },
  { id: 'intermediate', name: '中級', subjects: [{ id: 'b', name: '資訊安全實務', type: 'written' }] }
] };

test('catalog searches subject names and certification codes across all levels', () => {
  assert.equal(model.matches(cert, { query: '安全實務' }), true);
  assert.equal(model.matches(cert, { query: '資安' }), true);
  assert.equal(model.matches({ ...cert, aliases: ['機器聯網與應用工程師'] }, { query: '機器聯網與應用工程師' }), true);
  assert.equal(model.matches(cert, { query: ' ise ', level: 'junior' }), true);
  assert.equal(model.matches(cert, { query: '', category: '資訊類', level: 'intermediate' }), true);
  assert.equal(model.matches(cert, { query: '', category: '綠能科技類' }), false);
  assert.equal(model.matches(cert, { query: '', level: 'advanced' }), false);
  assert.deepEqual(Array.from(model.subjects(cert), q => q.levelName), ['初級', '中級']);
});

test('catalog renders source text as text and only accepts secure source links', () => {
  assert.equal(model.safeUrl('javascript:alert(1)'), '');
  assert.equal(model.safeUrl('data:text/html,test'), '');
  assert.equal(model.safeUrl('https://www.ipas.org.tw/test.pdf'), 'https://www.ipas.org.tw/test.pdf');
  assert.equal(model.esc('<script>"'), '&lt;script&gt;&quot;');
});

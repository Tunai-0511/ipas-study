import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

function load(app) {
  const context = { window: {} };
  for (const file of ['content', 'bank']) {
    vm.runInNewContext(readFileSync(new URL(`../${app}/data/${file}.js`, import.meta.url), 'utf8'), context);
  }
  return [...context.window.APP_CONTENT.questions, ...context.window.APP_BANK];
}

for (const app of ['junior', 'intermediate', 'bi']) {
  test(`${app}: answerable questions have complete choices and available local figures`, () => {
    const questions = load(app);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
    for (const q of questions) {
      assert.ok(q.stem.trim(), `${q.id}: empty stem`);
      if (!q.needsContext) for (const letter of ['A', 'B', 'C', 'D']) {
        assert.ok(q.options[letter]?.trim(), `${q.id}: empty choice ${letter}`);
      }
      for (const file of [...(q.images || []), ...(q.image ? [q.image] : [])]) {
        assert.match(file, /^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:png|jpe?g|webp|gif|avif)$/i);
        assert.ok(existsSync(new URL(`../${app}/${file}`, import.meta.url)), `${q.id}: missing ${file}`);
      }
    }
  });
}

test('115-1 shared scenarios are present on every standalone question, never in answer choices', () => {
  const questions = load('intermediate');
  for (const [subject, start, end] of [['s2',41,44],['s2',45,47],['s2',48,50],['s3',42,43],['s3',44,45],['s3',46,48],['s3',49,50]]) {
    const group = Array.from({length:end-start+1},(_,i)=>questions.find(q=>q.id===`${subject}-115-1-${start+i}`));
    assert.ok(group[0].context?.length > 30);
    assert.ok(group.every(q=>q.context===group[0].context), `${subject} ${start}-${end}: missing scenario`);
  }
  for (const q of questions.filter(q=>q.session==='115-1')) {
    for (const value of Object.values(q.options)) {
      assert.doesNotMatch(value, /請依據下方資訊回答第|請根據上述情境|請回答第\s*42/);
    }
  }
});

test('115-1 restored code questions retain placeholders, four options, and their figures', () => {
  const questions = load('intermediate');
  const get = id => questions.find(q=>q.id===id);
  assert.match(get('s3-115-1-40').stem, /\(A\).*\(B\)/);
  assert.match(get('s3-115-1-42').stem, /行\s*\(A\).*梯度/);
  for (const text of Object.values(get('s2-115-1-49').options)) {
    assert.match(text, /train_test_split[\s\S]*\n.*LogisticRegression[\s\S]*\n.*\.fit\(/);
  }
  const figures = ['s1-115-1-19', ...[2,8,19,23,39,40,41,43,48,49,50].map(n=>`s2-115-1-${n}`), ...[40,41,42,43,44,45,46,47,48,50].map(n=>`s3-115-1-${n}`)];
  for (const id of figures) {
    assert.ok(get(id).images?.length, `${id}: figure lost`);
    assert.equal(get(id).needsContext, false, `${id}: restored question excluded`);
  }
});

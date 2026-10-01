import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function load() {
  const context = vm.createContext({ window: {} });
  for (const name of ['content', 'bank']) {
    vm.runInContext(readFileSync(new URL(`../aiot/data/${name}.js`, import.meta.url), 'utf8'), context);
  }
  return context.window;
}

test('AIoT covers both subjects with distinct answerable questions mapped to real learning chapters', () => {
  const { APP_CONTENT: content, APP_BANK: bank } = load();
  assert.deepEqual(Array.from(content.subjects, subject => subject.code), ['A1', 'A2']);
  const all = content.questions.concat(bank);
  assert.equal(new Set(all.map(q => q.id)).size, all.length);
  assert.equal(new Set(all.map(q => q.stem.replace(/\s/g, ''))).size, all.length);
  for (const subject of content.subjects) {
    const chapters = new Set(subject.chapters.map(ch => ch.id));
    const questions = all.filter(q => q.subject === subject.code && !q.needsContext);
    assert.ok(questions.length >= 50, `${subject.code} needs enough questions for timed practice`);
    for (const q of questions) {
      assert.ok(chapters.has(q.topic), `${q.id} unknown chapter ${q.topic}`);
      assert.match(q.answer, /^[ABCD]$/);
      assert.deepEqual(Object.keys(q.options).sort(), ['A', 'B', 'C', 'D']);
      assert.equal(new Set(Object.values(q.options)).size, 4, `${q.id} has duplicate options`);
      assert.ok(q.explanation?.length >= 15, `${q.id} explanation is missing`);
      assert.ok(q.source?.length, `${q.id} source is missing`);
      assert.doesNotMatch(q.source, /官方原題|歷屆|考古/);
    }
    for (const ch of subject.chapters) {
      assert.ok(ch.summary && ch.keyPoints?.length && ch.concepts?.length, `${ch.id} incomplete lesson`);
      assert.ok(questions.some(q => q.topic === ch.id), `${ch.id} has no practice questions`);
    }
  }
  assert.ok(new Set(all.flatMap(q => q.images || [])).size >= 6, 'technical diagrams should be available');
});

test('AIoT separates guide self-assessment from extension practice without losing subject two', () => {
  const data = load();
  const context = vm.createContext({ window: data });
  vm.runInContext(readFileSync(new URL('../aiot/assets/js/content-api.js', import.meta.url), 'utf8'), context);
  const api = data.Content;
  assert.equal(api.bankReady(), true);
  const guided = api.questions({ onlyOfficial: true });
  const extended = api.questions({ onlyGenerated: true });
  assert.equal(guided.length + extended.length, api.questions().length);
  assert.ok(api.questions({ subject: 'A2' }).length >= 50);
  assert.ok(guided.every(q => !q.generated));
  assert.ok(extended.every(q => q.generated));
});

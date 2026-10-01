import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const context = vm.createContext({});
vm.runInContext(readFileSync(new URL('../catalog/assets/paper-model.js', import.meta.url), 'utf8'), context);
const paper = context.IpasPaper;

test('paper scoring requires all and only correct choices and omits void or unknown answers', () => {
  const result = paper.score({ answers: [{number:1,answer:'A'},{number:2,answer:'AC'},{number:3,answer:'D',void:true},{number:4,answer:''}] }, {1:'B',2:'CA',3:'D'});
  assert.equal(result.total, 2); assert.equal(result.correct, 1); assert.equal(result.percent, 50);
  assert.equal(paper.score({ answers: [{number:1,answer:'AC'}] }, {1:'A'}).correct, 0);
  assert.equal(paper.score({ answers: [] }, {}).percent, null);
  const disputed = { answers: [{ number: 1, answer: 'C', acceptedAnswers: ['C', 'D'], multiple: false }] };
  assert.equal(paper.score(disputed, {1:'D'}).correct, 1);
  assert.equal(paper.score(disputed, {1:'CD'}).correct, 0);
});

test('cloud progress merge keeps independent attempts and newer per-paper drafts', () => {
  const a = { attempts: [{id:'1',finishedAt:'2026-10-01'}], drafts:{p:{updatedAt:'2026-10-01',responses:{1:'A'}}} };
  const b = { attempts: [{id:'2',finishedAt:'2026-10-02'}], drafts:{p:{updatedAt:'2026-09-30',responses:{1:'C'}},q:{updatedAt:'2026-10-02',responses:{1:'B'}}} };
  const merged = paper.merge(a,b);
  assert.equal(merged.attempts.length,2);
  assert.equal(merged.drafts.p.responses[1],'A');
  assert.equal(merged.drafts.q.responses[1],'B');
  assert.equal(paper.merge(merged,b).attempts.length,2);
});

test('paper assets reject traversal and external or active content', () => {
  assert.equal(paper.asset('assets/papers/ise-jr/page-01.webp', /\.webp$/), 'assets/papers/ise-jr/page-01.webp');
  assert.equal(paper.asset('assets/papers/../bad.pdf', /\.pdf$/), '');
  assert.equal(paper.asset('https://example.com/file.pdf', /\.pdf$/), '');
  assert.equal(paper.asset('assets/papers/bad.html', /\.pdf$/), '');
});

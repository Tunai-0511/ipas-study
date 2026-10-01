import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function api() {
  const q = (id, extra = {}) => ({ id, subject: 'A1', topic: 'a1-t1', ...extra });
  const window = {
    APP_CONTENT: { subjects: [{ code: 'A1', name: '科一', chapters: [{ id: 'a1-t1' }] }], questions: [q('authored', { sourceKind: 'original-study' })] },
    APP_BANK: [q('bank')],
    APP_OFFICIAL_GUIDE: [q('guide'), q('disputed', { needsReview: true, reviewReason: '答案與解析不符', originalAnswer: 'A' })],
    APP_LEGACY_BANK: [q('legacy'), q('missing-figure', { needsContext: true })]
  };
  vm.runInNewContext(readFileSync(new URL('../aiot/assets/js/content-api.js', import.meta.url), 'utf8'), { window });
  return window.Content;
}

test('official, legacy and authored sources remain distinct and review questions never enter practice', () => {
  const c = api();
  assert.deepEqual(Array.from(c.questions(), q => q.id), ['authored', 'bank', 'guide', 'legacy']);
  assert.deepEqual(Array.from(c.questions({ sourceKind: 'official-guide' }), q => q.id), ['guide']);
  assert.deepEqual(Array.from(c.questions({ sourceKind: 'legacy-exam' }), q => q.id), ['legacy']);
  assert.deepEqual(Array.from(c.questions({ onlyGenerated: true }), q => q.id), ['authored', 'bank']);
  assert.deepEqual(Array.from(c.questions({ onlyOfficial: true }), q => q.id), ['guide', 'legacy']);
  assert.equal(c.questions({ ids: ['disputed'] }).length, 0);
  assert.equal(c.allOfficial(false).some(q => q.id === 'disputed'), false);
  assert.equal(c.chapterQuestionCount('a1-t1'), 4);
  assert.deepEqual(Array.from(c.reviewQuestions(), q => q.id), ['disputed']);
});

test('question counts distinguish archived, answerable and source totals', () => {
  const c = api().counts();
  assert.equal(c.total, 6);
  assert.equal(c.answerable, 4);
  assert.equal(c.guide, 2);
  assert.equal(c.legacy, 2);
  assert.equal(c.generated, 2);
  assert.equal(c.review, 1);
  assert.equal(c.officialAnswerable, 2);
});

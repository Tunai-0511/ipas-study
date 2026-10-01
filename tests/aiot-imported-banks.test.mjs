import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const appRoot = new URL('../aiot/', import.meta.url);
const pad = n => String(n).padStart(3, '0');

function load() {
  const context = vm.createContext({
    setInterval: () => 1,
    clearInterval() {},
    document: { addEventListener() {}, removeEventListener() {} },
    Icon: { get: () => '' },
    Charts: { ring: () => '', bars: () => '' },
  });
  context.window = context;
  for (const name of ['content', 'bank', 'official-guide', 'legacy-bank']) {
    vm.runInContext(readFileSync(new URL(`data/${name}.js`, appRoot), 'utf8'), context);
  }
  const authored = [...context.APP_CONTENT.questions, ...context.APP_BANK];
  const guide = Array.from(context.APP_OFFICIAL_GUIDE);
  const legacy = Array.from(context.APP_LEGACY_BANK);
  const all = [...authored, ...guide, ...legacy];
  context.Store = {
    isHidden: () => false,
    aiQuestions: () => [],
    isBookmarked: () => false,
    getExplain: () => '',
    addAttempt() {},
    // Seed old saved records with every real ID, including disputed questions.
    getBookmarks: () => all.map(q => q.id),
    attempts: () => [{
      finishedAt: '2026-10-01T00:00:00Z',
      items: all.map(q => ({ qid: q.id, isCorrect: false })),
    }],
  };
  for (const name of ['content-api', 'quiz']) {
    vm.runInContext(readFileSync(new URL(`assets/js/${name}.js`, appRoot), 'utf8'), context);
  }
  return { context, authored, guide, legacy, all, api: context.Content, quiz: context.Quiz };
}

function mount() {
  const buttons = new Map();
  const options = ['A', 'B', 'C', 'D'].map(k => ({ getAttribute: () => k }));
  return {
    innerHTML: '',
    querySelector(selector) {
      if (!buttons.has(selector)) buttons.set(selector, {});
      return buttons.get(selector);
    },
    querySelectorAll: selector => selector === '.option' ? options : [],
  };
}

test('AIoT real banks preserve all 1,260 IDs and the 130 pre-import authored IDs', () => {
  const { authored, guide, legacy, all, api } = load();
  assert.equal(guide.length, 80);
  assert.equal(legacy.length, 1050);
  assert.equal(all.length, 1260);
  assert.equal(new Set(all.map(q => q.id)).size, 1260);

  // Frozen pre-import ID families (2026-10-01); CI does not require Git history.
  const originalIds = [
    ...Array.from({ length: 18 }, (_, i) => `aiot-study-a1-${pad(i + 1)}`),
    ...Array.from({ length: 12 }, (_, i) => `aiot-study-a2-${pad(i + 19)}`),
    ...['a1', 'a2'].flatMap(subject =>
      Array.from({ length: 50 }, (_, i) => `practice-${subject}-${pad(i + 1)}`)),
  ];
  assert.deepEqual(authored.map(q => q.id).sort(), originalIds.sort());

  for (const q of all) {
    assert.equal(api.question(q.id), q, `${q.id}: no longer resolves to the original question`);
    assert.ok(api.chapter(q.topic), `${q.id}: unknown chapter ${q.topic}`);
    assert.ok(q.stem.trim(), `${q.id}: empty stem`);
    assert.deepEqual(Object.keys(q.options).sort(), ['A', 'B', 'C', 'D'], q.id);
    for (const value of Object.values(q.options)) assert.ok(value.trim(), `${q.id}: empty choice`);
    if (!q.needsReview) assert.match(q.answer, /^[ABCD]$/, `${q.id}: invalid answer`);
  }
  const papers = new Map();
  for (const q of legacy) {
    assert.equal(q.sourceKind, 'legacy-exam');
    const paper = `${q.year}-${q.examSession}-${q.originalSubjectCode}`;
    if (!papers.has(paper)) papers.set(paper, []);
    papers.get(paper).push(q.number);
  }
  assert.equal(papers.size, 21);
  for (const [paper, numbers] of papers) {
    assert.deepEqual(numbers.sort((a, b) => a - b), Array.from({ length: 50 }, (_, i) => i + 1), paper);
  }
});

test('AIoT real source pools and totals exclude all 23 disputed questions from scoring', () => {
  const { api, guide, legacy } = load();
  assert.equal(guide.filter(q => q.needsReview).length, 16);
  assert.equal(legacy.filter(q => q.needsReview).length, 7);
  const counts = api.counts();
  for (const [key, value] of Object.entries({
    guide: 80, legacy: 1050, generated: 130, total: 1260,
    answerable: 1237, officialAnswerable: 1107, review: 23,
  })) assert.equal(counts[key], value, key);
  for (const [filter, expected] of [
    [{ sourceKind: 'official-guide' }, 64],
    [{ sourceKind: 'legacy-exam' }, 1043],
    [{ onlyGenerated: true }, 130],
    [{ onlyOfficial: true }, 1107],
  ]) {
    const questions = api.questions(filter);
    assert.equal(questions.length, expected, JSON.stringify(filter));
    assert.ok(questions.every(q => !q.needsReview));
  }
  for (const q of api.reviewQuestions()) {
    assert.ok(api.question(q.id), `${q.id}: original must remain available for reference`);
    assert.equal(api.questions({ ids: [q.id], includeContext: true }).length, 0, q.id);
  }
});

test('AIoT imported grading amendments retain exact accepted answers without inventing a single answer', () => {
  const { api } = load();
  const amendments = [
    ['109-1-o12-011', 'C、D 均給分（原 A 已刪除）', ['C', 'D']],
    ['111-2-o11-006', 'C、D 皆給分', ['C', 'D']],
    ['111-2-o12-025', 'A、B 皆給分', ['A', 'B']],
    ['112-1-o11-007', 'B、D 皆給分', ['B', 'D']],
    ['112-1-o12-031', '皆給分', ['A', 'B', 'C', 'D']],
    ['112-2-o11-031', 'B 或 D', ['B', 'D']],
    ['113-2-o11-022', 'A、B、C、D（原卷並列）', ['A', 'B', 'C', 'D']],
  ];
  for (const [suffix, originalAnswer, acceptedAnswers] of amendments) {
    const q = api.question(`aiot-legacy-${suffix}`);
    assert.equal(q.type, 'single', q.id);
    assert.equal(q.needsReview, true, q.id);
    assert.equal(q.answer, '', q.id);
    assert.equal(q.originalAnswer, originalAnswer, q.id);
    assert.deepEqual(Array.from(q.acceptedAnswers), acceptedAnswers, q.id);
    assert.ok(q.reviewReason.length > 0, q.id);
  }
  const corrected = api.question('aiot-legacy-109-1-o12-011');
  assert.ok(!corrected.acceptedAnswers.includes('A'), 'struck-through old A is not accepted');
  assert.doesNotMatch(corrected.options.D, /委員釋[覆疑]結果/, 'grading note must not become option D');
  const phase = api.question('aiot-guide-a1-t9-q07');
  assert.equal(phase.originalAnswer, 'C');
  assert.equal(phase.needsReview, true);
  assert.match(phase.reviewReason, /90/);
});

test('AIoT all packaged question images are valid local PNGs and survive real quiz rendering', () => {
  const { all, legacy, quiz } = load();
  const images = q => [...(q.images || []), ...(q.image ? [q.image] : [])];
  assert.equal(legacy.filter(q => images(q).length).length, 16);
  const unique = new Set();
  for (const q of all) {
    for (const path of images(q)) {
      assert.match(path, /^assets\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.png$/i, q.id);
      const file = readFileSync(new URL(path, appRoot));
      assert.deepEqual(file.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), path);
      assert.equal(file.toString('ascii', 12, 16), 'IHDR', path);
      assert.ok(file.readUInt32BE(16) > 0 && file.readUInt32BE(20) > 0, `${path}: empty dimensions`);
      unique.add(path);
    }
    if (images(q).length) {
      const target = mount();
      quiz.launch({ mode: 'official', questions: [q] }, target);
      for (const path of images(q)) {
        assert.ok(target.innerHTML.includes(`<img src="${path}"`), `${q.id}: renderer rejected image`);
        assert.ok(target.innerHTML.includes(`href="${path}" target="_blank"`), `${q.id}: original image not accessible`);
      }
    }
  }
  assert.equal(unique.size, 22);
});

test('AIoT real quiz modes reject disputed questions even from saved wrong answers, bookmarks, or explicit lists', () => {
  const { api, quiz } = load();
  for (const mode of ['official', 'mock', 'wrong', 'bookmark']) {
    const questions = quiz.buildQuestions({ mode });
    assert.equal(questions.length, 1237, mode);
    assert.ok(questions.every(q => !q.needsReview), mode);
  }
  for (const q of api.reviewQuestions()) {
    const target = mount();
    quiz.launch({ mode: 'official', questions: [q] }, target);
    assert.match(target.innerHTML, /沒有題目/, q.id);
    assert.doesNotMatch(target.innerHTML, /class="option"/, q.id);
  }
});

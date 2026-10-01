import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const root = fileURLToPath(new URL('../catalog/', import.meta.url));
const data = JSON.parse(readFileSync(join(root, 'data/practice-official.json')));
const papers = JSON.parse(readFileSync(join(root, 'data/papers.json'))).papers;
const paperById = new Map(papers.map(p => [p.id, p]));
const byId = new Map(data.questions.map(q => [q.id, q]));
const q = (paper, number) => {
  const item = byId.get(`${paper}-q${number}`);
  assert.ok(item, `Missing ${paper} question ${number}`);
  return item;
};
const own = item => item.images.filter(image => image.role === 'question');
const contexts = item => item.images.filter(image => image.role === 'context');

test('all 6,852 scorable official items have individual practice records and original images', () => {
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.sourcePaperCount, 147);
  assert.equal(data.candidateCount, 6852);
  assert.equal(data.questions.length, 6852);
  assert.equal(byId.size, 6852);
  assert.deepEqual(data.rejected, []);
  assert.equal(new Set(data.questions.map(q => q.paperId)).size, 143);
  assert.equal(data.questions.reduce((n, q) => n + q.images.length, 0), 7489);
  for (const p of papers) {
    for (const answer of p.answers) {
      const actual = byId.get(`${p.id}-q${answer.number}`);
      if (answer.void) assert.equal(actual, undefined, 'All-credit items do not enter scoring practice');
      else assert.ok(actual, `${p.id} Q${answer.number}`);
    }
  }
});

test('practice keys preserve official answers, source identities, errata and question types exactly', () => {
  for (const item of data.questions) {
    const paper = paperById.get(item.paperId);
    const answer = paper.answers.find(a => a.number === item.number);
    assert.equal(item.id, `${paper.id}-q${answer.number}`);
    for (const field of ['answer', 'multiple', 'printedNumber', 'sectionLabel', 'acceptedAnswers', 'printedAnswer', 'correctionSourceUrl']) {
      assert.deepEqual(item[field] ?? null, answer[field] ?? null, `${item.id}: ${field}`);
    }
    assert.equal(item.sourcePdfSha256, paper.sha256);
    assert.equal(item.sourceUrl, `${paper.sourceUrl}#page=${answer.page}`);
    assert.equal(item.certId, paper.certId);
    assert.equal(item.levelId, paper.levelId);
    assert.equal(item.sourceKind, paper.sourceKind);
    assert.ok(['official-past', 'official-sample'].includes(item.sourceKind));
    if (!item.multiple && item.answer.length > 1) assert.deepEqual(item.acceptedAnswers, [...item.answer]);
  }
  assert.deepEqual(q('fqa-junior-past-541b6df8d010', 10).acceptedAnswers, ['C', 'D']);
  assert.equal(q('pcb-intermediate-past-5c7f8fead7df', 35).multiple, false);
  assert.equal(q('pcb-intermediate-past-5c7f8fead7df', 36).multiple, true);
  assert.equal(q('pcb-intermediate-past-5c7f8fead7df', 36).printedNumber, 1);
});

test('all crops exist as WebP files, match their hashes, and remain inside their source pages', () => {
  const used = new Set();
  for (const item of data.questions) {
    const paper = paperById.get(item.paperId);
    assert.ok(own(item).length >= 1, item.id);
    for (const image of item.images) {
      assert.match(image.path, new RegExp(`^assets/questions/official/${paper.id}/q\\d{3}-\\d{2}-[a-f0-9]{10}\\.webp$`));
      assert.ok(!used.has(image.path), `Duplicate image reference ${image.path}`);
      used.add(image.path);
      assert.ok(image.page >= 1 && image.page <= paper.pageCount, item.id);
      const [x0, y0, x1, y1] = image.rect;
      assert.ok([x0, y0, x1, y1].every(Number.isFinite), item.id);
      assert.ok(x0 >= 0 && y0 >= 0 && x1 > x0 && y1 > y0, item.id);
      const file = resolve(root, image.path);
      assert.ok(file.startsWith(join(root, 'assets/questions/official/')));
      const bytes = readFileSync(file);
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', image.path);
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP', image.path);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), image.sha256, image.path);
      assert.ok(bytes.length > 100, image.path);
    }
  }
  const files = readdirSync(join(root, 'assets/questions/official'), { recursive: true }).filter(p => p.endsWith('.webp'));
  assert.equal(files.length, used.size, 'No experimental or obsolete crop files remain');
});

test('every question has a key mask and accessible text never starts with the source answer prefix', () => {
  for (const item of data.questions) {
    assert.equal(item.answerHidden, true, item.id);
    assert.ok(item.maskRects.length > 0, item.id);
    assert.ok(item.promptText?.trim(), item.id);
    assert.equal(item.promptTextKind, 'pdf-text-extraction');
    assert.equal(item.stemKind, 'pdf-text-preview');
    assert.doesNotMatch(item.stem, /^[A-D]{1,4}\s*\d+[.、)]/, item.id);
    for (const mask of item.maskRects) {
      assert.ok(item.images.some(image => image.page === mask.page && image.rect[0] < mask.rect[2] && image.rect[2] > mask.rect[0] && image.rect[1] < mask.rect[3] && image.rect[3] > mask.rect[1]), item.id);
    }
    for (const image of item.images) {
      assert.ok(image.alt.includes('原卷第 '), item.id);
      assert.doesNotMatch(image.alt, /正確答案|答案為|答案是/, item.id);
    }
  }
});

test('PMAE sample answer styling is removed without changing the original text', () => {
  const audits = data.paperAudits.filter(a => a.styleNormalization);
  assert.equal(audits.length, 3);
  assert.equal(data.questions.filter(q => q.answerStyleNormalized).length, 116);
  for (const audit of audits) {
    assert.equal(audit.styleNormalization.originalTextUnchanged, true);
    assert.ok(audit.styleNormalization.textRuns > 0);
    assert.ok(audit.styleNormalization.underlines > 0);
  }
  const numeric = q('pmae-junior-sample-ac43043cf72f', 7);
  assert.deepEqual(numeric.optionLabels, { A: '1', B: '2', C: '3', D: '4' });
  assert.match(numeric.promptText, /\(1\)環氧樹脂/);
  assert.match(numeric.promptText, /\(4\)聚丙烯/);
});

test('original option-label misprints are explicit and do not expose the answer in the notice', () => {
  const plastic = q('pmae-intermediate-past-3d7315951b3d', 27);
  assert.deepEqual(plastic.optionLabels, { A: '1', B: '5', C: '3', D: '4' });
  assert.match(plastic.promptText, /\(5\)當擺錘/);
  const food = q('fqa-junior-past-a2aea8441017', 35);
  assert.deepEqual(food.optionLabels, { A: 'A', B: '2', C: 'C', D: 'D' });
  assert.match(food.promptText, /\(2\)7 公分/);
  for (const item of [plastic, food]) assert.doesNotMatch(item.sourceFormattingNote, /官方答案|正確答案|答案欄/);
});

test('cross-page formulas, wrapped last options and centered question numbers retain complete content', () => {
  const machine = q('mdmt-junior-past-cbe657a21c18', 38);
  assert.match(machine.promptText, /銑刀刃數的選擇考量/);
  assert.match(machine.promptText, /\(D\) 3 刃刀/);
  const circuit = q('emc-junior-past-f6b11e210639', 14);
  assert.ok(own(circuit)[0].rect[3] > 543.36, 'Include formula subscripts above/beside the table border');
  assert.match(circuit.promptText, /\(D\)/);
  const netZero = q('nz-intermediate-past-64fbd11063a6', 12);
  assert.ok(own(netZero).some(image => image.page === 6));
  assert.match(netZero.promptText, /對客戶還款能力的複合財務衝擊/);
  const food = q('fqa-junior-past-28d166ffc263', 20);
  assert.ok(own(food).some(image => image.page === 6));
  assert.match(food.promptText, /小分子可進入顆粒內小孔徑/);
});

test('all 27 shared cases and explicit previous-question dependencies accompany each affected item', () => {
  const groups = data.paperAudits.flatMap(a => (a.sharedContextGroups || []).map(group => ({ ...group, paperId: a.paperId })));
  assert.equal(groups.length, 27);
  for (const group of groups) {
    for (let n = group.printedRange[0]; n <= group.printedRange[1]; n++) {
      const item = data.questions.find(q => q.paperId === group.paperId && q.printedNumber === n);
      assert.ok(item && contexts(item).length >= group.parts.length, `${group.paperId} Q${n}`);
    }
  }
  const code = q('aiap-intermediate-past-34319ffb8c48', 42);
  assert.deepEqual([...new Set(contexts(code).map(image => image.page))], [11, 12, 13]);
  assert.match(code.promptText, /VGG16 是由牛津大學/);
  const regression = q('aiap-intermediate-past-c233bf5436b0', 48);
  assert.deepEqual(contexts(regression).map(image => image.page), [15, 16], 'Retain the image-only data-frame continuation');
  const titanic = q('aiap-intermediate-past-34319ffb8c48', 48);
  assert.deepEqual(contexts(titanic).map(image => image.page), [16, 17], 'Retain all three image-only code/data blocks');
  assert.ok(contexts(q('nz-intermediate-past-75db6479677a', 50)).length > 1);
  for (const item of data.questions) {
    const positions = item.images.map(image => `${image.page}:${image.rect.join(',')}`);
    assert.equal(new Set(positions).size, positions.length, `No duplicate shared passage ${item.id}`);
  }
});

test('figures placed on a following page remain attached even after all four option labels', () => {
  const converter = q('evm-junior-past-0a501ed206fd', 17);
  assert.deepEqual(own(converter).map(image => image.page), [3, 4]);
  const imagePage = own(converter)[1];
  assert.ok(imagePage.rect[1] <= 121.98 && imagePage.rect[3] >= 299.28, 'Full boost-converter original figure');
  const second = q('evm-junior-past-0a501ed206fd', 46);
  assert.deepEqual(own(second).map(image => image.page), [8, 9]);
});

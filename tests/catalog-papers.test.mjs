import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalogRoot = join(root, 'catalog');
const manifest = JSON.parse(readFileSync(join(catalogRoot, 'data/papers.json'), 'utf8'));
const papers = manifest.papers;
const byId = new Map(papers.map(p => [p.id, p]));
const paper = id => {
  assert.ok(byId.has(id), `Missing source paper ${id}`);
  return byId.get(id);
};
const answer = (id, number) => {
  const q = paper(id).answers.find(q => q.number === number);
  assert.ok(q, `${id} Q${number} missing`);
  return q;
};

test('official catalog snapshot contains 147 distinct papers and 1,608 pages', () => {
  assert.equal(manifest.updatedAt, '2026-10-01');
  assert.equal(papers.length, 147);
  assert.equal(byId.size, 147);
  assert.equal(new Set(papers.map(p => p.sourceUrl)).size, 147);
  assert.equal(new Set(papers.map(p => p.sha256)).size, 147);
  assert.equal(papers.reduce((n, p) => n + p.pageCount, 0), 1608);
  assert.equal(papers.reduce((n, p) => n + p.answers.length, 0), 6879);
  assert.equal(papers.filter(p => p.sourceKind === 'official-past').length, 135);
  assert.equal(papers.filter(p => p.sourceKind === 'official-sample').length, 12);
  assert.equal(papers.filter(p => p.answerStatus === 'verified').length, 107);
  assert.equal(papers.filter(p => p.answerStatus === 'partial').length, 36);
  assert.equal(papers.filter(p => p.answerStatus === 'unavailable').length, 4);
});

test('every original PDF matches its published manifest hash', () => {
  for (const p of papers) {
    assert.match(p.id, /^[a-z0-9]+-(junior|intermediate|advanced)-(past|sample)-[a-f0-9]{12}$/);
    assert.equal(p.path, `assets/papers/${p.id}.pdf`);
    const pdf = readFileSync(join(catalogRoot, p.path));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', p.id);
    assert.equal(createHash('sha256').update(pdf).digest('hex'), p.sha256, p.id);
    assert.equal(p.answerVisibility, 'visible', 'Original answer-bearing pages are study material');
  }
});

test('every declared mobile page is an existing nonempty WebP under the catalog', () => {
  const seen = new Set();
  for (const p of papers) {
    assert.equal(p.pages.length, p.pageCount, p.id);
    p.pages.forEach((ref, index) => {
      assert.equal(ref, `assets/papers/${p.id}/page-${String(index + 1).padStart(2, '0')}.webp`);
      const path = resolve(catalogRoot, ref);
      assert.ok(path.startsWith(catalogRoot + '/'));
      assert.ok(existsSync(path), ref);
      assert.ok(statSync(path).size > 512, ref);
      assert.ok(!seen.has(ref), `Duplicate page ${ref}`);
      seen.add(ref);
      const fd = openSync(path, 'r');
      const header = Buffer.alloc(12);
      try { readSync(fd, header, 0, 12, 0); } finally { closeSync(fd); }
      assert.equal(header.subarray(0, 4).toString(), 'RIFF', ref);
      assert.equal(header.subarray(8, 12).toString(), 'WEBP', ref);
    });
  }
  assert.equal(seen.size, 1608);
});

test('answer cards retain unique ordinal numbers and literal, valid answer metadata', () => {
  for (const p of papers) {
    const numbers = p.answers.map(q => q.number);
    assert.equal(new Set(numbers).size, numbers.length, p.id);
    assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b), p.id);
    for (const q of p.answers) {
      assert.ok(Number.isInteger(q.number) && q.number >= 1 && q.number <= p.questionCount, p.id);
      assert.ok(Number.isInteger(q.page) && q.page >= 1 && q.page <= p.pageCount, p.id);
      assert.match(q.answer, /^[A-D]{1,4}$/);
      assert.equal(new Set(q.answer).size, q.answer.length, p.id);
      assert.equal(typeof q.multiple, 'boolean');
      if (!q.multiple && q.answer.length > 1) {
        assert.deepEqual(q.acceptedAnswers, [...q.answer], `${p.id} Q${q.number}: alternatives are not multiple choice`);
      }
      if (q.multiple) assert.equal(q.acceptedAnswers, undefined, `${p.id} Q${q.number}`);
      if (q.void) {
        assert.equal(q.multiple, false);
        assert.deepEqual(q.acceptedAnswers, ['A', 'B', 'C', 'D']);
      }
    }
    if (p.answerStatus === 'verified') {
      assert.deepEqual(numbers, Array.from({ length: p.questionCount }, (_, i) => i + 1), p.id);
    }
    if (p.answerStatus === 'unavailable') assert.equal(p.answers.length, 0, p.id);
  }
});

test('new-section headings never convert the preceding single-choice question', () => {
  const groups = [
    ['emc', 30, 31], ['pcb', 35, 36], ['nz', 28, 29]
  ];
  for (const [certId, lastSingle, firstMultiple] of groups) {
    for (const p of papers.filter(p => p.certId === certId && p.levelId === 'intermediate')) {
      assert.equal(answer(p.id, lastSingle).multiple, false, `${p.id}: section boundary`);
      assert.equal(answer(p.id, firstMultiple).multiple, true, `${p.id}: first multiple choice`);
    }
  }
  assert.equal(answer('pcb-intermediate-past-5c7f8fead7df', 36).printedNumber, 1);
  assert.equal(answer('pcb-intermediate-past-5c7f8fead7df', 36).page, 7);
  assert.equal(answer('pcb-intermediate-past-5c7f8fead7df', 36).answer, 'ABCD');
  assert.match(answer('pcb-intermediate-past-5c7f8fead7df', 36).sectionLabel, /複選/);
  for (const p of papers.filter(p => p.certId === 'nz' && p.levelId === 'intermediate')) {
    assert.equal(answer(p.id, 39).multiple, false, `${p.id}: case-study section resets choice type`);
  }
  assert.equal(answer('nz-intermediate-past-75db6479677a', 45).multiple, true);
  assert.equal(answer('nz-intermediate-past-75db6479677a', 48).multiple, false);
  assert.equal(answer('ise-intermediate-past-fce711f2146a', 16).multiple, true, '複 and 選 wrap across lines in original');
  assert.equal(papers.reduce((n, p) => n + p.answers.filter(q => q.multiple).length, 0), 105);
});

test('official errata alternatives and all-credit items remain single choice', () => {
  const id = 'fqa-junior-past-541b6df8d010';
  assert.deepEqual(answer(id, 10).acceptedAnswers, ['C', 'D']);
  assert.equal(answer(id, 10).multiple, false);
  assert.equal(answer(id, 10).correctionSourceUrl, 'https://mms.firdi.org.tw/viewdetail/context/29');
  assert.equal(answer(id, 5).void, true);
  const ant = answer('ant-intermediate-past-d08acedcaee9', 7);
  assert.equal(ant.page, 2);
  assert.equal(ant.void, true);
  assert.equal(ant.multiple, false);
  const nz = answer('nz-intermediate-past-e8595d1c6774', 29);
  assert.equal(nz.answer, 'ABCD');
  assert.equal(nz.multiple, true);
  assert.equal(nz.void, undefined, 'ABCD in a true multiple-choice section is not an all-credit item');
});

test('numeric options, repeated printed numbering, and unnumbered samples preserve the original format', () => {
  const pmae = paper('pmae-junior-sample-91bb140519b7');
  assert.deepEqual(pmae.optionLabels, { A: '1', B: '2', C: '3', D: '4' });
  assert.equal(answer(pmae.id, 1).answer, 'A');
  assert.equal(answer(pmae.id, 1).printedAnswer, '1');
  const cpm = paper('cpm-junior-sample-f217eab6df34');
  assert.equal(cpm.questionCount, 48);
  assert.deepEqual(cpm.answers.filter(q => q.printedNumber === 1).map(q => q.number), [1, 9, 17, 25, 33, 41]);
  assert.match(answer(cpm.id, 33).sectionLabel, /L131/);
  const fqa = paper('fqa-junior-sample-585e9a499219');
  assert.equal(fqa.questionCount, 6);
  assert.equal(fqa.answers.map(q => q.answer).join(''), 'DDBAAD');
});

test('written-response questions and the missing official key are not fabricated as choice answers', () => {
  const food = papers.filter(p => p.certId === 'fqa' && p.levelId === 'intermediate');
  assert.equal(food.length, 33);
  for (const p of food) {
    assert.equal(p.questionCount, 40, p.id);
    assert.equal(p.answers.length, 30, p.id);
    assert.equal(p.answerStatus, 'partial', p.id);
  }
  const evm = paper('evm-intermediate-sample-88624d2b40e1');
  assert.equal(evm.questionCount, 71);
  assert.equal(evm.answers.length, 67);
  assert.equal(evm.answers.at(-1).printedNumber, 39);
  const oldFood = paper('fqa-junior-past-ee6c1027aa83');
  assert.equal(oldFood.questionCount, 80);
  assert.equal(oldFood.answers.length, 79);
  assert.equal(oldFood.answers.some(q => q.number === 60), false);
  assert.match(oldFood.notes.join(' '), /需修正題/);
  assert.equal(paper('mdmt-junior-past-2c5fcf93d079').questionCount, 9);
  const aoc = papers.filter(p => p.certId === 'aoc');
  assert.equal(aoc.length, 4);
  assert.equal(aoc.reduce((n, p) => n + p.answers.length, 0), 113);
});

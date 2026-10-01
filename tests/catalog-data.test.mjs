import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// The verified 115-year inventory is independent of the evolving paper manifest.
const repo = new URL('../', import.meta.url);
const data = JSON.parse(readFileSync(new URL('catalog/data/certifications.json', repo), 'utf8'));
const certs = data.certifications;
const current = certs.filter(cert => cert.status === 'active');
const sourceHosts = new Set(['ipd.nat.gov.tw', 'www.ipas.org.tw', 'aoc-ipas.org.tw']);
const subjectTypes = new Set(['written', 'practical', 'mixed', 'oral']);
const levelNames = { junior: '初級', intermediate: '中級', advanced: '高級' };
const sourceKinds = {
  syllabus: ['official-syllabus'],
  guide: ['official-guide', 'official-sample'],
  'past-paper': ['official-past'],
  course: ['official-course'],
};

function https(value, label, official = false) {
  assert.equal(typeof value, 'string', `${label}: missing URL`);
  assert.equal(value, value.trim(), `${label}: surrounding whitespace`);
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${label}: must use HTTPS`);
  assert.equal(url.username + url.password, '', `${label}: credentials are not allowed`);
  if (official) assert.ok(sourceHosts.has(url.hostname), `${label}: unexpected official source ${url.hostname}`);
  return url;
}

test('catalog real inventory contains 17 current official codes, 75 subjects, and 25 unique certifications', () => {
  assert.equal(certs.length, 25);
  assert.equal(new Set(certs.map(cert => cert.id)).size, 25);
  assert.equal(new Set(certs.map(cert => cert.officialCode.toLowerCase())).size, 25);
  assert.deepEqual(current.map(cert => cert.officialCode).sort(), [
    '3DP', 'AIAP', 'AIOT', 'ANT', 'CPM', 'CV', 'EMC', 'EVM', 'FQA',
    'ISE', 'MDMT', 'NZ', 'OIA', 'PCB', 'PMAE', 'SPE', 'aoc',
  ].sort());
  assert.equal(current.flatMap(cert => cert.levels).length, 30);
  assert.equal(current.flatMap(cert => cert.levels.flatMap(level => level.subjects)).length, 75);
  assert.deepEqual(certs.filter(cert => cert.status === 'legacy').map(cert => cert.officialCode).sort(),
    ['BDA', 'IOTA', 'IOTS', 'M2M', 'MAD', 'MAP', 'MGP', 'ML'].sort());
  for (const cert of certs) {
    assert.equal(cert.id, cert.officialCode.toLowerCase());
    assert.match(cert.id, /^[a-z0-9]+$/);
    assert.ok(cert.name.trim() && cert.category.trim(), cert.id);
    assert.ok(['active', 'legacy'].includes(cert.status), cert.id);
    if (cert.status === 'active') assert.equal(cert.effectiveYear, 2026, cert.id);
    if (cert.successorId) assert.ok(current.some(next => next.id === cert.successorId), cert.id);
  }
});

test('catalog levels and subjects have valid identities, order, and exam types', () => {
  const ids = new Set();
  for (const cert of certs) {
    assert.ok(cert.levels.length, cert.id);
    assert.equal(new Set(cert.levels.map(level => level.id)).size, cert.levels.length, cert.id);
    for (const level of cert.levels) {
      assert.ok(Object.hasOwn(levelNames, level.id), `${cert.id}: unsupported level ${level.id}`);
      assert.equal(level.name, levelNames[level.id], `${cert.id}/${level.id}`);
      assert.ok(level.subjects.length, `${cert.id}/${level.id}`);
      assert.ok(Number.isInteger(level.effectiveYear), `${cert.id}/${level.id}: missing source year`);
      assert.deepEqual(level.subjects.map(subject => subject.order),
        Array.from({ length: level.subjects.length }, (_, i) => i + 1), `${cert.id}/${level.id}`);
      for (const subject of level.subjects) {
        assert.equal(subject.id, `${cert.id}-${level.id}-${subject.order}`);
        assert.ok(!ids.has(subject.id), `${subject.id}: duplicate subject ID`);
        ids.add(subject.id);
        assert.ok(subject.name.trim(), subject.id);
        assert.ok(subjectTypes.has(subject.type), `${subject.id}: unsupported exam type`);
      }
    }
  }
});

test('catalog source and resource links use HTTPS and resource references belong to their certification', () => {
  https(data.sourceUrl, 'inventory source', true);
  for (const cert of certs) {
    for (const key of ['officialUrl', 'examInfoUrl', 'resourcesUrl']) https(cert[key], `${cert.id}.${key}`, true);
    if (cert.statusSourceUrl) https(cert.statusSourceUrl, `${cert.id}.statusSourceUrl`, true);
    for (const level of cert.levels) {
      https(level.sourceUrl, `${cert.id}/${level.id}.sourceUrl`, true);
      for (const subject of level.subjects) https(subject.sourceUrl, `${subject.id}.sourceUrl`, true);
    }
    assert.ok(Array.isArray(cert.resources), cert.id);
    for (const resource of cert.resources) {
      const label = `${cert.id}: ${resource.title}`;
      assert.ok(resource.title.trim(), label);
      // Official pages also link external courses/Drive files; their destination
      // need not be a government host, but the recorded listing page must be.
      https(resource.url, label);
      https(resource.sourceUrl, `${label} source`, true);
      assert.ok(sourceKinds[resource.kind]?.includes(resource.sourceKind), `${label}: inconsistent resource kind`);
      const level = resource.level && cert.levels.find(item => item.id === resource.level);
      if (resource.level) assert.ok(level, `${label}: unknown level`);
      if (resource.subject) {
        const candidates = level ? level.subjects : cert.levels.flatMap(item => item.subjects);
        assert.ok(candidates.some(subject => subject.id === resource.subject), `${label}: subject belongs to another level/certification`);
      }
    }
  }
});

test('catalog retains verified elective combinations and distinguishes practical subjects from written exams', () => {
  const get = (certId, levelId) => certs.find(cert => cert.id === certId).levels.find(level => level.id === levelId);
  const cases = [
    ['pcb', 'junior', [1, 2, 3], /科目一必考；科目二、三擇一/],
    ['pcb', 'intermediate', [1, 2, 3], /科目一必考；科目二、三擇一/],
    ['3dp', 'junior', [1, 2, 3, 4], /科目一必考；科目二、三、四擇一/],
    ['3dp', 'intermediate', [1, 2, 3], /科目一必考；科目二、三擇一/],
    ['spe', 'junior', [1, 2, 3], /科目一必考；科目二、三擇一/],
    ['aiap', 'intermediate', [1, 2, 3], /數據分析類：科目一＋二；機器學習類：科目一＋三/],
    ['cpm', 'junior', [1, 2, 3], /色彩計畫類：科目一＋二；色彩管理類：科目一＋三/],
    ['aiot', 'junior', [1, 2, 3, 4], /物聯網類：科目一＋二；機器聯網類：科目一＋三；感知系統類：科目一＋四/],
  ];
  for (const [certId, levelId, orders, note] of cases) {
    const level = get(certId, levelId);
    assert.ok(level, `${certId}/${levelId}`);
    assert.deepEqual(level.subjects.map(subject => subject.order), orders, `${certId}/${levelId}: missing elective subject`);
    assert.match(level.selectionNote, note, `${certId}/${levelId}: election rule lost`);
  }
  assert.deepEqual(get('aiot', 'junior').subjects.map(subject => subject.type), ['written', 'written', 'practical', 'practical']);
  assert.deepEqual(certs.find(cert => cert.id === 'aiot').levels.map(level => level.id), ['junior']);
  assert.equal(get('ant', 'junior').subjects[1].type, 'mixed');
  assert.equal(get('ant', 'intermediate').subjects[1].type, 'written');
  assert.equal(get('evm', 'intermediate').subjects[2].type, 'mixed');
  assert.equal(get('pmae', 'intermediate').subjects[2].type, 'written');
  assert.equal(get('cv', 'advanced').subjects.length, 3);
  assert.ok(get('cv', 'advanced').subjects.every(subject => subject.type !== 'oral'));
});

test('catalog preserves existing study app routes separately from official HTTPS source URLs', () => {
  const routes = new Set();
  for (const cert of certs) {
    for (const owner of [cert, ...cert.levels]) {
      if (!owner.existingApp) continue;
      assert.match(owner.existingApp, /^\/[a-z0-9-]+\/$/, `${cert.id}: unsafe local route`);
      assert.ok(existsSync(new URL(`${owner.existingApp.slice(1)}index.html`, repo)), `${owner.existingApp}: missing app`);
      routes.add(owner.existingApp);
    }
  }
  assert.deepEqual([...routes].sort(), ['/aiot/', '/bi/', '/intermediate/', '/junior/']);
  const aiap = certs.find(cert => cert.id === 'aiap');
  assert.equal(aiap.levels.find(level => level.id === 'junior').existingApp, '/junior/');
  assert.equal(aiap.levels.find(level => level.id === 'intermediate').existingApp, '/intermediate/');
  assert.equal(certs.find(cert => cert.id === 'oia').existingApp, '/bi/');
  assert.equal(certs.find(cert => cert.id === 'aiot').existingApp, '/aiot/');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const catalog=read('catalog/data/certifications.json');
const index=read('catalog/data/practice-index.json');
const shards=index.certifications.map(c=>read('catalog/'+c.path));
const questions=shards.flatMap(s=>s.questions);
const ctx=vm.createContext({});
for(const f of ['paper-model','practice-model'])vm.runInContext(readFileSync(path.join(root,'catalog/assets/'+f+'.js'),'utf8'),ctx);
test('every catalog certification and subject has playable illustrated practice',()=>{
 assert.equal(index.complete,true,'Partial builds cannot be released');
 assert.equal(index.certifications.length,catalog.certifications.length);
 const ids=new Set();let count=0;
 for(const c of catalog.certifications){
  const entry=index.certifications.find(i=>i.id===c.id);
  const shard=shards.find(s=>s.certId===c.id);
  assert.ok(entry && shard,c.id);assert.equal(entry.total,shard.questions.length);
  for(const l of c.levels)for(const s of l.subjects){
   count++; const qs=shard.questions.filter(q=>q.subjectId===s.id);
   assert.ok(qs.length>=10,s.id+' has at least 10 real questions');
   assert.ok(qs.some(q=>q.images?.length),s.id+' includes images');
   assert.equal(entry.subjects[s.id].total,qs.length);
   for(const q of qs){assert.equal(q.levelId,l.id);assert.equal(q.certId,c.id);assert.ok(!ids.has(q.id),q.id);ids.add(q.id);}
  }
 }
 assert.equal(count,100);assert.equal(ids.size,questions.length);
 assert.equal(index.totals.questions,questions.length);
 assert.equal(index.totals.subjects,count);
});
test('every practice question has valid answer semantics, source and local images',()=>{
 for(const q of questions){
  assert.ok(ctx.IpasPracticeModel.valid(q),q.id);
  const accepted=q.acceptedAnswers?.length?q.acceptedAnswers:[q.answer];
  for(const answer of accepted){assert.ok(ctx.IpasPracticeModel.grade(q,answer).correct,q.id+' '+answer);}
  assert.ok((q.sourceUrl||q.sources?.[0]?.url||'').startsWith('https://'),q.id+' source');
  for(const image of q.images||[]){assert.equal(ctx.IpasPracticeModel.imagePath(image.path),image.path,q.id);assert.ok(existsSync(path.join(root,'catalog',image.path)));assert.ok(image.alt?.length>4,q.id);}
 }
});
test('each extracted official question preserves the independently audited answer',()=>{
 const papers=read('catalog/data/papers.json').papers;
 const official=read('catalog/data/practice-official.json');
 const lookup=new Map(questions.map(q=>[q.id,q]));
 assert.equal(official.questions.length+official.rejected.length,official.candidateCount);
 assert.equal(official.candidateCount,6852);
 for(const q of official.questions){
  const answer=papers.find(p=>p.id===q.paperId).answers.find(a=>a.number===q.number);
  const built=lookup.get(q.id);assert.ok(built,q.id);
  assert.equal(built.answer,answer.answer,q.id);
  assert.equal(!!built.multiple,!!answer.multiple,q.id);
  assert.deepEqual(built.acceptedAnswers||[],answer.acceptedAnswers||[],q.id);
  assert.equal(q.answerHidden,true,q.id+' hides printed answers');
  assert.ok(q.images.length,q.id);assert.equal(q.sourcePdfSha256.length,64);
 }
});
test('new supplementary banks are labelled original and supply varied subject diagrams',()=>{
 for(const name of ['industrial','specialist','business']){
  const qs=read('catalog/data/practice-'+name+'.json').questions;
  const subs=new Map();
  for(const q of qs){
   assert.equal(q.sourceKind,'original-practice');
   assert.ok(typeof q.explanation==='string' && q.explanation.trim().length>4,q.id);
   assert.equal(Object.keys(q.options).length,4,q.id);
   assert.equal(new Set(Object.values(q.options)).size,4,q.id);
   assert.ok(q.options[q.answer],q.id);assert.ok(q.images.length>=1,q.id);
   assert.ok(q.sources?.length>=1,q.id);for(const s of q.sources)assert.match(s.url,/^https:\/\//,q.id);
   if(!subs.has(q.subjectId))subs.set(q.subjectId,[]);subs.get(q.subjectId).push(q);
  }
  for(const [id,items]of subs){assert.ok(items.length>=10,id);assert.ok(new Set(items.flatMap(q=>q.images.map(i=>i.path))).size>=3,id);}
 }
});
test('shared legacy imports retain answers and clearly identify the old certification',()=>{
 const legacy=questions.filter(q=>q.certId==='iota'&&q.sourceKind==='legacy-exam');
 assert.equal(legacy.length,1043);
 const aiot=new Map(questions.filter(q=>q.certId==='aiot').map(q=>[q.originalId,q]));
 for(const q of legacy){assert.equal(q.answer,aiot.get(q.originalId).answer);assert.equal(q.historical,true);assert.ok(q.historicalNote);}
});

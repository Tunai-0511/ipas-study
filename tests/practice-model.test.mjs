import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const ctx=vm.createContext({});for(const f of ['paper-model','practice-model'])vm.runInContext(readFileSync(new URL(`../catalog/assets/${f}.js`,import.meta.url),'utf8'),ctx);
const m=ctx.IpasPracticeModel;
const q=(id,extra={})=>({id,subjectId:'a-junior-1',levelId:'junior',sourceKind:'official-past',answer:'A',options:{A:'one',B:'two',C:'three',D:'four'},...extra});
const data=[q('a'),q('b',{multiple:true,answer:'AC'}),q('c',{answer:'CD',acceptedAnswers:['C','D']}),q('d',{void:true}),q('e',{needsReview:true}),q('f',{subjectId:'a-intermediate-1',levelId:'intermediate',sourceKind:'original-practice'})];
test('practice selection intersects subject, level, source and current review state',()=>{
 assert.deepEqual(Array.from(m.pool(data,{}, {},{}),x=>x.id),['a','b','c','f']);
 assert.deepEqual(Array.from(m.pool(data,{mode:'wrong'},{a:{correct:true},b:{correct:false},d:{correct:false}},{}),x=>x.id),['b']);
 assert.deepEqual(Array.from(m.pool(data,{mode:'favorites'},{},{a:{active:false},c:{active:true}}),x=>x.id),['c']);
 assert.equal(m.pool(data,{subject:'a-intermediate-1',source:'official-past'}).length,0);
 assert.equal(m.pool(data,{level:'intermediate',source:'original-practice'}).length,1);
});
test('single alternatives are distinct from multiple-choice sets',()=>{
 assert.equal(m.grade(data[2],'C').correct,true);assert.equal(m.grade(data[2],'D').correct,true);assert.equal(m.grade(data[2],'CD').correct,false);
 assert.equal(m.grade(data[1],'CA').correct,true);assert.equal(m.grade(data[1],'A').correct,false);assert.equal(m.grade(data[1],'ACD').correct,false);
 assert.equal(m.toggle(data[0],'A','B'),'B');assert.equal(m.toggle(data[1],'AC','C'),'A');assert.equal(m.toggle(data[0],'A','X'),'A');
});
test('random draw is without replacement and does not mutate source order',()=>{
 const original=data.slice();const selected=m.select(data,4,true,()=>0);assert.equal(new Set(selected).size,4);assert.deepEqual(data,original);
 assert.equal(m.select(data,'all',false).length,6);
});
test('draft restore drops removed/unsafe questions and rebuilds trusted results',()=>{
 const restored=m.restore({version:1,questionIds:['a','b','a','missing','d'],index:99,responses:{a:'B'},checked:{a:{chosen:'B',correct:true},b:{chosen:'AC'}},completed:false},data);
 assert.deepEqual(Array.from(restored.questionIds),['a','b']);assert.equal(restored.index,1);assert.equal(restored.checked.a.correct,false);
 assert.equal(m.restore({version:1,completed:true,questionIds:['a']},data),null);
 const result=m.result([data[0],data[1],data[2]],restored.checked);assert.equal(result.correct,1);assert.equal(result.total,3);assert.equal(result.answered,2);
});
test('question images reject traversal, external scripts and html assets',()=>{
 assert.equal(m.imagePath('assets/questions/official/paper-q1.webp'),'assets/questions/official/paper-q1.webp');
 for(const s of ['../aiot/a.png','assets/questions/../a.png','javascript:alert(1)','https://x/a.svg','assets/questions/a.html'])assert.equal(m.imagePath(s),'');
});
test('review and favorite records merge per question with deletion timestamps',()=>{
 const merged=ctx.IpasPaper.merge({practice:{a:{correct:false,updatedAt:'2026-01-01'}},favorites:{b:{active:true,updatedAt:'2026-01-01'}}},{practice:{c:{correct:true,updatedAt:'2026-01-03'}},favorites:{b:{active:false,updatedAt:'2026-01-02'}}});
 assert.equal(merged.practice.a.correct,false);assert.equal(merged.practice.c.correct,true);assert.equal(merged.favorites.b.active,false);
});

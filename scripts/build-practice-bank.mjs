import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write = (p,data) => { fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true}); fs.writeFileSync(path.join(root,p), JSON.stringify(data,null,2)+'\n'); };
const partial = process.argv.includes('--partial');
const catalog = read('catalog/data/certifications.json');
const papers = new Map(read('catalog/data/papers.json').papers.map(p=>[p.id,p]));
const subjects = new Map(catalog.certifications.flatMap(c=>c.levels.flatMap(l=>l.subjects.map(s=>[s.id,{...s,certId:c.id,levelId:l.id}]))));
const aliases = {
 '3dp|junior|3D製程與材料概論':'3dp-junior-2',
 'cv|junior|無形資產評價概論':'cv-junior-1',
 'cv|intermediate|無形資產評價概論':'cv-intermediate-3',
 'cv|intermediate|評價概論與評價準則':'cv-intermediate-1',
 'pmae|junior|高分子化性與物性模擬試題':'pmae-junior-1',
 'pmae|junior|高分子材料特性與加工概論模擬試題':'pmae-junior-2',
 'spe|intermediate|製造生產與作業管理之實務應用':'spe-intermediate-1'
};
export function mapSubject(p,q) {
 if(p.id==='cpm-junior-sample-f217eab6df34') return q.number<=32?'cpm-junior-1':'cpm-junior-3';
 if(p.id==='fqa-junior-sample-585e9a499219') return q.number===6?'fqa-junior-2':'fqa-junior-1';
 if(p.id==='pmae-intermediate-sample-df153d8c33e3') return q.number<=9?'pmae-intermediate-1':'pmae-intermediate-2';
 if(p.id==='evm-intermediate-sample-88624d2b40e1') {
   const section=q.sectionLabel||p.answers.find(a=>a.number===q.number)?.sectionLabel||'';
   if(section.includes('電能'))return 'evm-intermediate-1';
   if(section.includes('動力'))return 'evm-intermediate-2';
   if(section.includes('機電'))return 'evm-intermediate-3';
   throw new Error('Unknown EVM section: '+q.id+' '+section);
 }
 const exact=[...subjects.values()].find(s=>s.certId===p.certId && s.levelId===p.levelId && s.name===p.subjectName);
 return exact?.id || aliases[[p.certId,p.levelId,p.subjectName].join('|')];
}
const all=[];
for(const name of ['official','industrial','specialist','business']) {
 const file='catalog/data/practice-'+name+'.json';
 if(!fs.existsSync(path.join(root,file))) { if(partial)continue; throw new Error('Missing completed input: '+file); }
 for(const entry of read(file).questions) {
   const q={...entry};
   if(name==='official') {
     const p=papers.get(q.paperId); if(!p)throw new Error('Unknown paper '+q.paperId);
     q.subjectId=mapSubject(p,q); q.paperTitle=p.title; q.source=p.title;
     if(p.certId==='cpm' && q.number>32)q.historicalNote='原樣題科目為「色彩度量學」，本站對照至色彩管理相關主題。';
   }
   all.push(q);
 }
}
function loadScripts(files) { const ctx={window:{}}; vm.createContext(ctx); for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);return ctx.window; }
const aiot=loadScripts(['aiot/data/content.js','aiot/data/bank.js','aiot/data/official-guide.js','aiot/data/legacy-bank.js']);
const bi=loadScripts(['bi/data/bank.js']);
function importQuestions(list,certId,appId,kind) {
 for(const source of list) {
   if(source.needsReview || source.needsContext || source.void || !/^[A-F]+$/.test(source.answer||''))continue;
   const subjectId=certId+'-junior-'+(source.subject.endsWith('1')?'1':'2');
   const images=(source.images||[]).map((image,i)=>{
     const original=typeof image==='string'?image:image.path;
     if(!/^assets\/questions\/[a-z0-9_./-]+\.(png|webp|svg)$/i.test(original)||original.includes('..'))throw new Error('Invalid imported image '+original);
     const dest='assets/questions/imported/'+appId+'/'+original.slice('assets/questions/'.length);
     fs.mkdirSync(path.dirname(path.join(root,'catalog',dest)),{recursive:true});
     fs.copyFileSync(path.join(root,appId,original),path.join(root,'catalog',dest));
     return {path:dest,alt:source.imageAlt||source.stem+'（附圖 '+(i+1)+'）',role:'question'};
   });
   all.push({...source,id:'catalog-'+certId+'-'+source.id,originalId:source.id,certId,levelId:'junior',subjectId,
     sourceKind:source.sourceKind||kind,multiple:source.multiple===true,images,sourceUrl:source.sourceUrl||source.srcUrl,
     historical:certId==='iota', explanation:source.explanation,
     explanationKind:source.aiExplained?'editorial':'source'});
 }
}
importQuestions([...aiot.APP_CONTENT.questions,...aiot.APP_BANK,...aiot.APP_OFFICIAL_GUIDE,...aiot.APP_LEGACY_BANK],'aiot','aiot','original-practice');
importQuestions(aiot.APP_LEGACY_BANK,'iota','aiot','legacy-exam');
importQuestions(bi.APP_BANK,'oia','bi','official-guide');
const ids=new Set();
for(const q of all) {
 const s=subjects.get(q.subjectId);
 if(!s || s.certId!==q.certId || s.levelId!==q.levelId)throw new Error('Unmapped question '+q.id+': '+q.subjectId);
 if(ids.has(q.id))throw new Error('Duplicate question '+q.id); ids.add(q.id);
 if(q.needsReview || q.void || !/^[A-F]+$/.test(q.answer||''))throw new Error('Unusable question '+q.id);
 for(const image of q.images||[]) if(!fs.existsSync(path.join(root,'catalog',image.path)))throw new Error('Missing question image '+image.path);
}
const index={version:1,updatedAt:catalog.updatedAt,complete:!partial,totals:{certifications:0,subjects:0,questions:0,uniqueQuestions:new Set(all.map(q=>q.originalId||q.id)).size,illustrated:0},certifications:[]};
const outputs=[];
const sourceOrder=['official-past','official-sample','official-guide','legacy-exam','original-practice','original-study'];
all.sort((a,b)=>sourceOrder.indexOf(a.sourceKind)-sourceOrder.indexOf(b.sourceKind));
for(const c of catalog.certifications) {
 const questions=all.filter(q=>q.certId===c.id),entry={id:c.id,path:'data/practice/'+c.id+'.json',total:questions.length,illustrated:questions.filter(q=>q.images?.length).length,sourceCounts:{},subjects:{}};
 for(const q of questions)entry.sourceCounts[q.sourceKind]=(entry.sourceCounts[q.sourceKind]||0)+1;
 for(const l of c.levels)for(const s of l.subjects) {
   const items=questions.filter(q=>q.subjectId===s.id);
   entry.subjects[s.id]={total:items.length,illustrated:items.filter(q=>q.images?.length).length};
   if(!partial && (!items.length || !entry.subjects[s.id].illustrated))throw new Error('Missing illustrated practice for '+s.id);
   if(items.length)index.totals.subjects++;
 }
 const shard={version:1,certId:c.id,updatedAt:catalog.updatedAt,questions};
 entry.revision=createHash('sha256').update(JSON.stringify(shard)).digest('hex').slice(0,16);
 outputs.push(['catalog/'+entry.path,shard]);
 index.certifications.push(entry); if(questions.length)index.totals.certifications++;
 index.totals.questions+=questions.length; index.totals.illustrated+=entry.illustrated;
}
for(const [file,data] of outputs)write(file,data);
write('catalog/data/practice-index.json',index);
console.log(JSON.stringify({partial,...index.totals}));

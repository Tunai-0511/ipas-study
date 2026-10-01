#!/usr/bin/env python3
"""Render individually answer-hidden official questions from immutable paper PDFs.

Requires PyMuPDF and Pillow. Existing official answer keys remain authoritative.
Only this script's practice manifest / question-image directory are written.
"""
from __future__ import annotations
import argparse, hashlib, importlib.util, json, re, unicodedata
from collections import Counter, defaultdict
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import pymupdf as fitz
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'catalog/assets/questions/official'
DATE='2026-10-01'
REUSE_IMAGES=False

def norm(s):return unicodedata.normalize('NFKC',s)
def compact(s):return re.sub(r'\s+','',norm(s))
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def rounded(rect):return [round(float(x),3) for x in rect]
def union(rects):
    rects=list(rects)
    return fitz.Rect(min(r[0] for r in rects),min(r[1] for r in rects),max(r[2] for r in rects),max(r[3] for r in rects))

def lines(page):
    out=[]
    for b in page.get_text('rawdict')['blocks']:
        for l in b.get('lines',[]):
            chars=[c for s in l['spans'] for c in s['chars']]
            text=''.join(c['c'] for c in chars).strip()
            if text:out.append({'text':norm(text),'bbox':list(l['bbox']),'chars':chars})
    return sorted(out,key=lambda r:(round(r['bbox'][1],1),r['bbox'][0]))

def import_parser():
    spec=importlib.util.spec_from_file_location('official_paper_parser',ROOT/'scripts/import-catalog-papers.py')
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def number_box(row, printed):
    chars=[];mapped=[]
    for c in row['chars']:
        for ch in norm(c['c']):chars.append(ch);mapped.append(c['bbox'])
    text=''.join(chars)
    m=re.search(r'(?<!\d)'+str(printed)+r'(?!\d)',text)
    if not m:return fitz.Rect(row['bbox'])
    return union(mapped[m.start():m.end()])

def anchors_for(doc,paper,page_lines):
    parser=import_parser()
    e={'id':paper['id'],'cert':paper['certId'].upper(),'kind':paper['sourceKind']}
    _,_,locations,evidence,problems=parser.parse_answers(doc,e)
    if problems:raise ValueError('Existing authoritative parser reports '+str(problems))
    evidence_by={x['number']:x for x in evidence}
    anchors=[];last_position=(0,-1)
    if paper['id']=='fqa-junior-sample-585e9a499219':
        cells=[r for r in page_lines[0] if re.fullmatch('[A-D]',r['text']) and r['bbox'][0]<100]
        if len(cells)!=6:raise ValueError('Unnumbered sample does not have exactly six keys')
        for i,c in enumerate(cells):
            nearby=[r for r in page_lines[0] if r['bbox'][0]>c['bbox'][2]+3 and abs(r['bbox'][1]-c['bbox'][1])<12]
            if not nearby:raise ValueError('Unnumbered sample stem missing')
            row=min(nearby,key=lambda r:r['bbox'][1]);r=fitz.Rect(row['bbox'])
            anchors.append({'number':i+1,'printedNumber':None,'page':1,'bbox':rounded(r),'numberRect':rounded(r),
                            'rowText':row['text'],'inlineMask':None,'keyRect':c['bbox']})
        return anchors
    for loc in locations:
        ev=evidence_by.get(loc['number']);target=None
        if ev:target=ev['text'].split(' | ',1)[-1]
        candidates=[]
        for r in page_lines[loc['page']-1]:
            if target:
                match=r['text']==target or (len(target)==120 and r['text'].startswith(target))
            else:
                match=bool(re.match(r'^'+str(loc['printedNumber'])+r'[.、)]',r['text'])) and r['bbox'][0]<150
            if match and (loc['page'],r['bbox'][1])>last_position:candidates.append(r)
        if not candidates:raise ValueError(f"Cannot locate Q{loc['number']} on page {loc['page']}: {target}")
        row=min(candidates,key=lambda r:(r['bbox'][1],r['bbox'][0]));r=fitz.Rect(row['bbox'])
        nr=number_box(row,loc['printedNumber']);mask=None
        if ev and ev['pattern']=='answer-number-inline' and r.x0<nr.x0-2:
            mask=[r.x0-1,r.y0-1,nr.x0-1,r.y1+1]
        # PMAE samples put the answer after the printed number, inside a shared line.
        if paper['certId']=='pmae' and paper['sourceKind']=='official-sample':
            if re.search(r'\([1-4]\)',row['text']):
                # Original table answer column has a fixed right edge < 86 pt.
                mask=[nr.x1+1,r.y0-1,min(r.x1+1,86),r.y1+1]
            else:
                cells=[c for c in page_lines[loc['page']-1] if re.fullmatch(r'\([1-4]\)',compact(c['text']))
                    and nr.x1+2<c['bbox'][0]<85 and abs(c['bbox'][1]-r.y0)<3]
                if len(cells)==1:mask=rounded(fitz.Rect(cells[0]['bbox'])+(-1,-1,1,1))
                else:raise ValueError('Numeric sample key position ambiguous')
        anchors.append({**loc,'bbox':rounded(r),'numberRect':rounded(nr),'rowText':row['text'],'inlineMask':mask})
        last_position=(loc['page'],r.y0)
    return anchors

def horizontal_rules(page):
    rules=[]
    for path in page.get_drawings():
        for item in path['items']:
            if item[0]=='l':
                p1,p2=item[1:3]
                if abs(p1.y-p2.y)<1 and abs(p2.x-p1.x)>60:rules.append((min(p1.x,p2.x),max(p1.x,p2.x),(p1.y+p2.y)/2))
            elif item[0]=='re':
                r=item[1]
                if r.width>60 and r.height<2:rules.append((r.x0,r.x1,(r.y0+r.y1)/2))
                elif r.width>60:
                    rules.extend([(r.x0,r.x1,r.y0),(r.x0,r.x1,r.y1)])
    return sorted(set((round(a,2),round(b,2),round(y,2)) for a,b,y in rules),key=lambda v:v[2])

def page_limits(page,rows):
    top=25;bottom=page.rect.height-20
    for r in rows:
        t=compact(r['text']);box=r['bbox']
        header=bool(re.search(r'^(?:第\d+頁|考試日期|試題公告|科目[一二三四0-9]*[:：]|第[一二三四]科[:：])',t)) or '能力鑑定' in t or t in ('答案','題目','答','案','題','號','答案題號','試題')
        if header and box[1]<150:top=max(top,box[3]+3)
        if box[1]>page.rect.height*.85 and (re.search(r'第\d+頁',t) or (re.fullmatch(r'\d{1,3}',t) and page.rect.width*.35<box[0]<page.rect.width*.65)):
            bottom=min(bottom,box[1]-0.7)
    return top,bottom

def start_y(anchor,rules,rows):
    r=anchor['numberRect'];y=anchor['bbox'][1];rule_x=anchor.get('ruleX',r[0])
    near=[h[2] for h in rules if h[0]<rule_x+6 and h[1]>anchor.get('ruleRight',rule_x+80) and y-anchor.get('lookAbove',65)<h[2]<=y+1]
    if near:
        candidate=max(near)+0.4
        prior_option=any(re.match(r'^\([A-D1-4]\)',compact(row['text'])) and candidate<row['bbox'][1]<y-8 for row in rows)
        if anchor.get('centeredNumber') or not prior_option:return candidate
    stem=[row['bbox'][1] for row in rows if row['bbox'][0]>=rule_x-5 and abs(row['bbox'][1]-y)<11 and not re.match(r'^\([A-D1-4]\)',compact(row['text']))]
    return max(0,min([y]+stem)-2)

def text_in(rows,rect,masks=()):
    r=fitz.Rect(rect);result=[]
    for line in rows:
        lr=fitz.Rect(line['bbox'])
        if lr.y1<r.y0 or lr.y0>r.y1 or lr.x1<=r.x0 or lr.x0>=r.x1:continue
        # Work at character precision: inline answer and question may share a line.
        s=''
        for c in line['chars']:
            cr=fitz.Rect(c['bbox']);mid=fitz.Point((cr.x0+cr.x1)/2,(cr.y0+cr.y1)/2)
            if r.contains(mid) and not any(fitz.Rect(m).contains(mid) for m in masks):s+=c['c']
        if s.strip():result.append(norm(s.strip()))
    return '\n'.join(result)

def option_labels(text,numeric=False):
    vals='1234' if numeric else 'ABCD'
    return set(re.findall(r'\(\s*(['+vals+r'])\s*\)',norm(text)))

def normalize_pmae_styles(doc):
    """Remove only explicit red answer styling; leave original glyph strings intact."""
    before=''.join(p.get_text() for p in doc)
    changes={'textRuns':0,'underlines':0,'boldFonts':0,'syntheticBold':0}
    for page in doc:
        fonts=page.get_fonts(full=True)
        regular=[f for f in fonts if f[3]=='TimesNewRomanPSMT' and f[5]=='WinAnsiEncoding']
        bold=[f for f in fonts if f[3]=='TimesNewRomanPS-BoldMT' and f[5]=='WinAnsiEncoding']
        font_map={f[4]:regular[0][4] for f in bold} if regular else {}
        for xref in page.get_contents():
            stream=doc.xref_stream(xref).decode('latin1')
            def text_run(m):
                block=m.group()
                if not re.search(r'1\s+0\s+0\s+rg\b',block):return block
                changes['textRuns']+=1
                block=re.sub(r'1\s+0\s+0\s+rg\b','0 g',block)
                block=re.sub(r'1\s+0\s+0\s+RG\b','0 G',block)
                block,n=re.subn(r'2\s+Tr\b','0 Tr',block);changes['syntheticBold']+=n
                for old,new in font_map.items():
                    block,n=re.subn('/'+re.escape(old)+r'(?=\s+[0-9.]+\s+Tf\b)','/'+new,block);changes['boldFonts']+=n
                return block
            stream=re.sub(r'\bBT\b.*?\bET\b',text_run,stream,flags=re.S)
            # Word-generated underline rectangles are red, thin, and outside BT/ET.
            pattern=r'1\s+0\s+0\s+rg\s+([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s+re\s+f\*?'
            def underline(m):
                if 0<float(m.group(4))<=2 and float(m.group(3))>3:
                    changes['underlines']+=1;return '0 g\n'
                return m.group()
            stream=re.sub(pattern,underline,stream)
            doc.update_stream(xref,stream.encode('latin1'))
    after=''.join(p.get_text() for p in doc)
    if compact(before)!=compact(after):raise ValueError('Style normalization changed PDF text')
    for page in doc:
        for b in page.get_text('dict')['blocks']:
            for line in b.get('lines',[]):
                for span in line['spans']:
                    if span['color']==0xff0000:raise ValueError('Red answer-style text remains')
        if any(d['fill']==(1,0,0) and d['rect'].height<2 for d in page.get_drawings()):raise ValueError('Red answer underline remains')
    changes['originalTextUnchanged']=True
    return changes

def make_segments(doc,paper,anchors,page_lines,rules,limits,masks):
    segments={};texts={};errors={}
    for i,a in enumerate(anchors):
        nxt=anchors[i+1] if i+1<len(anchors) else None
        begin=a['page'];end=nxt['page'] if nxt else len(doc)
        parts=[];combined=[];wanted=set('1234' if paper.get('optionLabels') else 'ABCD')
        for pn in range(begin,end+1):
            page=doc[pn-1];top,bottom=limits[pn-1]
            if pn==begin:top=start_y(a,rules[pn-1],page_lines[pn-1])
            if nxt and pn==nxt['page']:bottom=min(bottom,start_y(nxt,rules[pn-1],page_lines[pn-1])-0.5)
            # Never include the following written-response section in the last MC item.
            for r in page_lines[pn-1]:
                if top<r['bbox'][1]<bottom and re.match(r'^(?:[二三]、)?(?:簡答|申論|問答)題',compact(r['text'])):
                    bottom=min(bottom,r['bbox'][1]-3)
            # Select a closing table rule only after all options are inside it.
            # Figures and sub-tables can have earlier horizontal rules within a question.
            rule_x=a.get('ruleX',a['numberRect'][0])
            candidates=[h[2]+1.2 for h in rules[pn-1] if h[0]<rule_x+6 and h[1]>a.get('ruleRight',rule_x+100) and top+15<h[2]<=bottom+1]
            for candidate in candidates:
                candidate_text='\n'.join(combined+[text_in(page_lines[pn-1],[26,top,page.rect.width-20,candidate],masks[pn])])
                if option_labels(candidate_text,bool(paper.get('optionLabels'))) >= wanted:
                    bottom=candidate;break
            if bottom<=top+4:continue
            # Full original question width preserves diagrams reaching into table margins.
            left=26;right=page.rect.width-20
            rect=[left,max(top,0),right,min(bottom,page.rect.height)]
            txt=text_in(page_lines[pn-1],rect,masks[pn])
            if len(compact(txt))<2:continue
            parts.append({'page':pn,'rect':rounded(rect),'role':'question'})
            combined.append(txt)
            if option_labels('\n'.join(combined),bool(paper.get('optionLabels'))) >= wanted:break
        segments[a['number']]=parts;texts[a['number']]='\n'.join(combined)
        found=option_labels(texts[a['number']],bool(paper.get('optionLabels')))
        if paper['id']=='pmae-intermediate-past-3d7315951b3d' and a['number']==27 and '(5)' in texts[a['number']]:found.add('2')
        if paper['id']=='fqa-junior-past-a2aea8441017' and a['number']==35 and '(2)' in texts[a['number']]:found.add('B')
        if found<wanted:errors[a['number']]='原卷裁切中未能驗證完整四個選項：'+''.join(sorted(found))
        if not parts:errors[a['number']]='沒有可驗證的題目裁切區域'
    return segments,texts,errors

# These four shared case passages begin on the continuation page of the prior item.
# Their original opening lines were verified in the PDFs, rather than inferred from keys.
MANUAL_CONTEXTS={
 'aiap-intermediate-past-c233bf5436b0':[(43,47,13,'一間遊戲市場研究公司'),(48,50,15,'使用銷售資料集')],
 'aiap-intermediate-past-34319ffb8c48':[(42,45,11,'VGG16 是由牛津大學'),(48,50,16,'使用鐵達尼號')],
}

def split_manual_contexts(doc,paper,anchors,segments,page_lines,limits):
    contexts=defaultdict(list);details=[]
    for lo,hi,pn,prefix in MANUAL_CONTEXTS.get(paper['id'],[]):
        rows=[r for r in page_lines[pn-1] if r['text'].startswith(prefix)]
        assert len(rows)==1,(paper['id'],prefix)
        y=rows[0]['bbox'][1]-3
        first=next(a for a in anchors if a['printedNumber']==lo)
        end=segments[first['number']][0]
        chunks=[]
        for pg in range(pn,end['page']+1):
            top=y if pg==pn else limits[pg-1][0]
            bottom=end['rect'][1]-0.2 if pg==end['page'] else limits[pg-1][1]
            if bottom>top+5:chunks.append({'page':pg,'rect':rounded([26,top,doc[pg-1].rect.width-20,bottom]),'role':'context'})
        for a in anchors:
            if lo<=a['printedNumber']<=hi:contexts[a['number']].extend(chunks)
        previous=next(a for a in anchors if a['number']==first['number']-1)
        trimmed=[]
        for p in segments[previous['number']]:
            if p['page']>pn:continue
            if p['page']==pn:p={**p,'rect':[p['rect'][0],p['rect'][1],p['rect'][2],y-0.2]}
            if p['rect'][3]>p['rect'][1]+4:trimmed.append(p)
        segments[previous['number']]=trimmed
        details.append({'first':first['number'],'printedRange':[lo,hi],'parts':chunks,'boundaryVerified':True})
    return contexts,details

def context_groups(doc,paper,anchors,segments,page_lines,limits,masks):
    contexts=defaultdict(list);details=[]
    for i,a in enumerate(anchors):
        if not i:continue
        prev=anchors[i-1];oldparts=segments.get(prev['number'],[])
        if not oldparts:continue
        start=oldparts[-1];end_page=a['page'];end_y=segments[a['number']][0]['rect'][1] if segments.get(a['number']) else a['bbox'][1]-10
        chunks=[];texts=[]
        for pn in range(start['page'],end_page+1):
            top=start['rect'][3]+0.2 if pn==start['page'] else limits[pn-1][0]
            bottom=end_y-0.2 if pn==end_page else limits[pn-1][1]
            if bottom<top+5:continue
            rect=[26,top,doc[pn-1].rect.width-20,bottom]
            t=text_in(page_lines[pn-1],rect,masks[pn])
            if len(compact(t))<8:continue
            chunks.append({'page':pn,'rect':rounded(rect),'role':'context'});texts.append(t)
        text=compact('\n'.join(texts))
        matches=list(re.finditer(r'(\d{1,3})[~～\-－至到](\d{1,3})題',text))
        match=next((m for m in matches if int(m.group(1))==a['printedNumber'] and 0<int(m.group(2))-int(m.group(1))<15),None)
        if match:
            low,high=map(int,match.groups());count=high-low+1
            for target in anchors[i:i+count]:contexts[target['number']].extend(chunks)
            details.append({'first':a['number'],'printedRange':[low,high],'parts':chunks})
    return contexts,details

def retain_wrapped_option_continuations(doc,anchors,segments,contexts,page_lines,limits,masks):
    retained=[]
    all_contexts=[p for ps in contexts.values() for p in ps]
    image_infos=[p.get_image_info(hashes=True) for p in doc]
    image_counts=Counter(i['digest'] for infos in image_infos for i in infos)
    for current,nxt in zip(anchors,anchors[1:]):
        parts=segments[current['number']]
        if not parts or parts[-1]['page']>=nxt['page']:continue
        last=parts[-1];nextpart=segments[nxt['number']][0]
        for pn in range(last['page']+1,nxt['page']+1):
            top=limits[pn-1][0];bottom=nextpart['rect'][1]-0.5 if pn==nxt['page'] else limits[pn-1][1]
            if bottom<=top+4:continue
            rect=[26,top,doc[pn-1].rect.width-20,bottom]
            if any(c['page']==pn and fitz.Rect(c['rect']).intersects(fitz.Rect(rect)) for c in all_contexts):continue
            text=text_in(page_lines[pn-1],rect,masks[pn])
            text=re.sub(r'第[一二三四五六七八九十]+[、.].*','',text)
            figures=[im for im in image_infos[pn-1] if image_counts[im['digest']]<max(2,len(doc)*.5)
                     and (fitz.Rect(im['bbox']) & fitz.Rect(rect)).get_area()/max(1,fitz.Rect(im['bbox']).get_area())>.8]
            vector_figure=any(any(it[0]=='c' or (it[0]=='l' and abs(it[1].x-it[2].x)>3 and abs(it[1].y-it[2].y)>3) for it in path['items'])
                             and fitz.Rect(rect).contains(path['rect']) and path['rect'].get_area()>100 for path in doc[pn-1].get_drawings())
            if len(compact(text))<2 and not figures and not vector_figure:continue
            if re.search(r'^(?:[一二三四]、)?(?:複選|多選|單選|申論|簡答|問答)題',compact(text)):continue
            parts.append({'page':pn,'rect':rounded(rect),'role':'question'})
            retained.append({'number':current['number'],'page':pn,'reason':'保留已列四個選項後的跨頁文字或原圖'})
    return retained

def render_part(doc,paper,number,part,idx,render=True):
    pn=part['page'];rect=fitz.Rect(part['rect'])
    digest=hashlib.sha256(json.dumps(['answer-hidden-v1-1400-q84',paper['sha256'],pn,part['rect'],part['role']],separators=(',',':')).encode()).hexdigest()[:10]
    name=f'q{number:03}-{idx:02}-{digest}.webp'
    rel=f'assets/questions/official/{paper["id"]}/{name}'
    path=ROOT/'catalog'/rel
    if render and not (REUSE_IMAGES and path.exists()):
        path.parent.mkdir(parents=True,exist_ok=True)
        pix=doc[pn-1].get_pixmap(matrix=fitz.Matrix(1400/rect.width,1400/rect.width),clip=rect,colorspace=fitz.csRGB,alpha=False)
        Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(path,'WEBP',quality=84,method=4)
    return {'path':rel,'alt':f'{paper["subjectName"]}原卷第 {number} 題'+('共用題組背景' if part['role']=='context' else '題目與選項'),
            'page':pn,'rect':part['rect'],'role':part['role'],'sha256':sha(path) if path.exists() else None}

def process_paper(args):
    paper,render,reuse=args
    global REUSE_IMAGES
    REUSE_IMAGES=reuse
    if not paper['answers']:return {'questions':[],'rejected':[],'audit':{'paperId':paper['id'],'candidateCount':0}}
    original=ROOT/'catalog'/paper['path'];doc=fitz.open(original)
    assert sha(original)==paper['sha256']
    page_lines=[lines(p) for p in doc];rules=[horizontal_rules(p) for p in doc];limits=[page_limits(p,rs) for p,rs in zip(doc,page_lines)]
    anchors=anchors_for(doc,paper,page_lines)
    option_xs=Counter(round(r['bbox'][0]/5)*5 for rows in page_lines for r in rows
                      if re.match(r'^\([A-D1-4]\)',compact(r['text'])) and len(compact(r['text']))>4)
    body_x=option_xs.most_common(1)[0][0] if option_xs else 125
    right_edges=Counter(round(h[1]/2)*2 for page_rules in rules for h in page_rules if h[0]<body_x+6 and h[1]>body_x+200)
    table_right=right_edges.most_common(1)[0][0]-5 if right_edges else doc[0].rect.width-70
    for a in anchors:
        a['ruleX']=body_x-2;a['ruleRight']=table_right
        if (paper['certId']=='pmae' and paper['sourceKind']=='official-sample') or paper['certId'] in ('mdmt','cpm'):
            a['lookAbove']=1000;a['centeredNumber']=True
    anchor_by={a['number']:a for a in anchors}
    masks=defaultdict(list)
    for box in paper.get('answerBoxes',[]):masks[box['page']].append(rounded(fitz.Rect(box['rect'])+(-1,-1,1,1)))
    for a in anchors:
        if a.get('inlineMask'):masks[a['page']].append(a['inlineMask'])
        if a.get('keyRect'):masks[a['page']].append(rounded(fitz.Rect(a['keyRect'])+(-1,-1,1,1)))
    # The all-credit ANT key is split into two letter lines plus an explanatory line.
    if paper['id']=='ant-intermediate-past-d08acedcaee9':
        a=anchor_by[7];next_a=anchor_by[8]
        for row in page_lines[1]:
            if row['bbox'][2]<a['numberRect'][0] and a['bbox'][1]-15<row['bbox'][1]<next_a['bbox'][1]:
                masks[2].append(rounded(fitz.Rect(row['bbox'])+(-1,-1,1,1)))
    segments,texts,errors=make_segments(doc,paper,anchors,page_lines,rules,limits,masks)
    manual,manual_groups=split_manual_contexts(doc,paper,anchors,segments,page_lines,limits)
    # Recompute previews after removing the following case from the preceding item.
    texts={n:'\n'.join(text_in(page_lines[p['page']-1],p['rect'],masks[p['page']]) for p in ps) for n,ps in segments.items()}
    contexts,groups=context_groups(doc,paper,anchors,segments,page_lines,limits,masks)
    for n,ps in manual.items():contexts[n]=ps
    manual_first={g['first'] for g in manual_groups}
    groups=[g for g in groups if g['first'] not in manual_first]+manual_groups
    continuations=retain_wrapped_option_continuations(doc,anchors,segments,contexts,page_lines,limits,masks)
    texts={n:'\n'.join(text_in(page_lines[p['page']-1],p['rect'],masks[p['page']]) for p in ps) for n,ps in segments.items()}
    # Explicit dependencies retain the preceding question as context without its key.
    dependencies=[]
    for i,a in enumerate(anchors):
        stem=texts.get(a['number'],'').split('(A)',1)[0]
        ref=None
        if i and re.search('承上題|承前題|根據上題|同上題|依上題|接續上題',compact(stem)):ref=anchors[i-1]
        m=re.search(r'(?:參考|根據|依照|承接|如)第(\d{1,3})題',compact(stem))
        if m:ref=next((q for q in reversed(anchors[:i]) if q['printedNumber']==int(m.group(1))),ref)
        if ref:
            contexts[a['number']].extend([{**p,'role':'context'} for p in contexts.get(ref['number'],[])+segments.get(ref['number'],[])])
            dependencies.append({'number':a['number'],'dependsOn':ref['number']})
    style_changes=None
    if paper['certId']=='pmae' and paper['sourceKind']=='official-sample':style_changes=normalize_pmae_styles(doc)
    for pn,rects in masks.items():
        for rect in rects:doc[pn-1].draw_rect(fitz.Rect(rect),color=None,fill=(1,1,1),overlay=True)
    questions=[];rejected=[]
    for key in paper['answers']:
        if key.get('void'):continue
        number=key['number'];ident=paper['id']+'-q'+str(number)
        if number not in anchor_by or number in errors:
            rejected.append({'id':ident,'paperId':paper['id'],'number':number,'page':key['page'],
                'reason':errors.get(number,'未定位原卷題號'),'sourceUrl':paper['sourceUrl']+'#page='+str(key['page'])});continue
        parts=[];seen=set()
        for part in contexts.get(number,[])+segments[number]:
            fingerprint=(part['page'],tuple(part['rect']))
            if fingerprint not in seen:parts.append(part);seen.add(fingerprint)
        imgs=[render_part(doc,paper,number,p,i+1,render) for i,p in enumerate(parts)]
        preview=texts[number]
        # Accessible text is explicitly a preview; original equations and layout are in images.
        preview=re.split(r'\(\s*[A1]\s*\)',preview,maxsplit=1)[0]
        preview=re.sub(r'^\s*'+str(key.get('printedNumber') or number)+r'[.、)]?\s*','',preview).strip()
        preview='\n'.join(preview.splitlines()[:12])[:900]
        item={'id':ident,'certId':paper['certId'],'levelId':paper['levelId'],'paperId':paper['id'],
            'subjectName':paper['subjectName'],'number':number,'printedNumber':key.get('printedNumber'),
            'sectionLabel':key.get('sectionLabel'),'multiple':key['multiple'],'answer':key['answer'],
            'sourceKind':paper['sourceKind'],'sourceUrl':paper['sourceUrl']+'#page='+str(key['page']),
            'page':key['page'],'promptText':'\n\n'.join(text_in(page_lines[p['page']-1],p['rect'],masks[p['page']]) for p in parts),
            'promptTextKind':'pdf-text-extraction','stem':preview or '請依官方原題圖片作答。','stemKind':'pdf-text-preview','images':imgs,
            'sourcePdfSha256':paper['sha256'],'answerHidden':True,
            'maskRects':[{'page':pn,'rect':r} for pn,rs in masks.items() for r in rs if any(p['page']==pn and fitz.Rect(r).intersects(fitz.Rect(p['rect'])) for p in parts)]}
        for field in ('acceptedAnswers','printedAnswer','correctionSourceUrl'):
            if field in key:item[field]=key[field]
        if paper.get('optionLabels'):item['optionLabels']=paper['optionLabels']
        if paper['id']=='pmae-intermediate-past-3d7315951b3d' and number==27:
            item['optionLabels']={'A':'1','B':'5','C':'3','D':'4'}
            item['sourceFormattingNote']='原卷第二個選項誤印為 (5)；作答時依第二個選項的位置對應 B，原圖與原印字保留。'
        if paper['id']=='fqa-junior-past-a2aea8441017' and number==35:
            item['optionLabels']={'A':'A','B':'2','C':'C','D':'D'}
            item['sourceFormattingNote']='原卷第二個選項印為 (2)，依位置對應 B；原圖與原印字保留。'
        if style_changes:item['answerStyleNormalized']=True
        questions.append(item)
    audit={'paperId':paper['id'],'candidateCount':sum(not a.get('void',False) for a in paper['answers']),
           'anchorCount':len(anchors),'questionCount':len(questions),'rejectedCount':len(rejected),
           'crossPageQuestions':[n for n,ps in segments.items() if len(ps)>1], 'sharedContextGroups':groups,
           'dependencies':dependencies,'retainedContinuations':continuations,'styleNormalization':style_changes}
    doc.close();return {'questions':questions,'rejected':rejected,'audit':audit}

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--plan-only',action='store_true');ap.add_argument('--workers',type=int,default=3);ap.add_argument('--paper',action='append',default=[]);ap.add_argument('--reuse-images',action='store_true',help='Reuse existing images only when crop recipe and source hash match')
    args=ap.parse_args();all_papers=json.loads((ROOT/'catalog/data/papers.json').read_text())['papers']
    papers=[p for p in all_papers if not args.paper or p['id'] in args.paper]
    results=[]
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        for i,result in enumerate(pool.map(process_paper,[(p,not args.plan_only,args.reuse_images) for p in papers]),1):
            results.append(result);a=result['audit'];print(i,len(papers),a['paperId'],a.get('questionCount',0),a.get('rejectedCount',0),flush=True)
    data={'updatedAt':DATE,'schemaVersion':1,'imageRecipe':'answer-hidden-v1-1400-q84','sourcePaperCount':len(all_papers),'candidateCount':sum(sum(not a.get('void',False) for a in p['answers']) for p in papers),
          'questions':[q for r in results for q in r['questions']],'rejected':[q for r in results for q in r['rejected']],
          'paperAudits':[r['audit'] for r in results]}
    if args.plan_only or args.paper:
        out=Path('/tmp/ipas-practice-official-plan.json')
    else:out=ROOT/'catalog/data/practice-official.json'
    out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print('COMPLETE',len(data['questions']),'rejected',len(data['rejected']),str(out),flush=True)

if __name__=='__main__':main()

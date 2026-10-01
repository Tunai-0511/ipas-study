#!/usr/bin/env python3
"""Import official iPAS paper PDFs and literal answer keys, without OCR guessing.

Dependencies: PyMuPDF, Pillow, beautifulsoup4. Downloads use system curl/TLS trust.
Run with --source-dir pointing to the saved official learning-resource JSON files.
The original PDFs are immutable; page images intentionally retain visible answers.
"""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unicodedata
from urllib.parse import quote

LEVELS = {1: 'junior', 2: 'intermediate', 3: 'advanced'}
FQA_INDEX = 'https://mms.firdi.org.tw/viewdetail/context/29'
LICENSE_URL = 'https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation'
FQA_SUBJECTS = ['食品品保概論', '食品科學概論', '食品品保管理', '食品工廠管理', '統計製程品管']

def compact(s):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', s))

def get_bytes(url, target):
    target = Path(target)
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_bytes().startswith(b'%PDF-'):
        return
    encoded = quote(url, safe=':/?&=%+@')
    temp = target.with_suffix(target.suffix + '.part')
    subprocess.run(['curl', '--location', '--fail', '--silent', '--show-error',
                    '--retry', '2', '--connect-timeout', '20', '--max-time', '120',
                    encoded, '-o', str(temp)], check=True, capture_output=True)
    if target.suffix.lower() == '.pdf' and not temp.read_bytes().startswith(b'%PDF-'):
        raise ValueError('Response is not a PDF: ' + url)
    temp.replace(target)

def fqa_records(source_dir):
    from bs4 import BeautifulSoup
    html = source_dir / 'fqa-pasts.html'
    if not html.exists(): get_bytes(FQA_INDEX, html)
    soup = BeautifulSoup(html.read_text(), 'html.parser')
    first = soup.find('h1', string=re.compile('年度考古題'))
    content = first.parent
    groups, current = [], None
    for node in content.children:
        if not getattr(node, 'name', None): continue
        txt = node.get_text(' ', strip=True)
        if re.search(r'\d{3}年.*食品.*(?:考試|鑑定)', txt) and node.name == 'h2' and not node.find('a'):
            current = {'title': txt, 'texts': [], 'files': []}
            groups.append(current)
        elif current is not None:
            if node.name in ('h1', 'h2') and '考前準備' in txt: current = None; continue
            current['texts'].append(txt)
            for a in node.find_all('a', href=True):
                if '.pdf' not in a['href'].lower(): continue
                subject = next((s for s in FQA_SUBJECTS if s in a.get_text(' ', strip=True)), None) or next((s for s in FQA_SUBJECTS if s in a['href']), None) or next((s for s in FQA_SUBJECTS if s in txt), None)
                if subject is None: raise ValueError('FQA subject not found: ' + txt)
                current['files'].append({'name': current['title'] + ' - ' + subject,
                                         'url': a['href'], 'subject': subject})
    out = []
    for group in groups:
        corrections = {}
        subject = None
        for line in group['texts']:
            txt = compact(line).replace('統計製程管理', '統計製程品管').replace('統計製成品管', '統計製程品管')
            found = next((s for s in FQA_SUBJECTS if s in txt), None)
            if found: subject = found
            if subject is None or '疑義' not in txt and not re.search(r'第\d+題',txt): continue
            for m in re.finditer(r'第(\d+)題[^。\n]*', txt):
                letters = ''.join(dict.fromkeys(re.findall(r'\(([A-D])\)', m.group())))
                if letters: corrections.setdefault(subject, {})[int(m.group(1))] = letters
            if '疑義題成立' in txt or '疑義成立' in txt:
                for m in re.finditer(r'\((\d+)\)([A-D](?:[.、,]?[A-D])*)', txt):
                    corrections.setdefault(subject, {})[int(m.group(1))] = ''.join(re.findall('[A-D]',m.group(2)))
        for f in group['files']:
            out.append({'cert': 'FQA', 'level': 2 if '中級' in group['title'] else 1,
                        'kind': 'official-past', 'title': f['name'], 'url': f['url'],
                        'subject': f['subject'], 'indexUrl': FQA_INDEX,
                        'corrections': corrections.get(f['subject'], {}),
                        'notice': '原卷及官方疑義公告依當時法規；官方提醒不同梯次答案可能因法規變動而不同。'})
    return out

def discover(source_dir):
    entries = []
    for p in sorted(source_dir.glob('*-learning-resources.data.json')):
        cert = p.name.split('-')[0]
        if cert == 'AIOT': continue
        resource = json.loads(p.read_text())['resource']
        for key, kind in [('pasts', 'official-past'), ('samples', 'official-sample')]:
            for group in resource.get(key, []):
                for f in group.get('files', []):
                    if '.pdf' not in f['url'].lower(): continue
                    entries.append({'cert': cert, 'level': group['level'], 'kind': kind,
                                    'title': re.sub(r'\.pdf$', '', f['name'], flags=re.I),
                                    'url': f['url'], 'groupTitle': group['title'],
                                    'indexUrl': f'https://ipd.nat.gov.tw/ipas/certification/{cert}/learning-resources'})
    entries += fqa_records(source_dir)
    catalog = Path(__file__).resolve().parents[1] / 'catalog/data/certifications.json'
    if catalog.exists():
        aoc = next((c for c in json.loads(catalog.read_text())['certifications'] if c['id']=='aoc'),None)
        if aoc:
            for r in aoc.get('resources',[]):
                if r.get('sourceKind')=='official-sample' and '.pdf' in r['url'].lower():
                    entries.append({'cert':'AOC','level':1,'kind':'official-sample','title':r['title'],
                        'url':r['url'],'indexUrl':r['sourceUrl'],
                        'subject':'品牌管理概論' if r.get('subject')=='aoc-junior-1' else '行銷企劃實務'})
    seen, out = set(), []
    for e in entries:
        if e['url'] in seen: continue
        seen.add(e['url'])
        digest = hashlib.sha256(e['url'].encode()).hexdigest()[:12]
        e['id'] = f'{e["cert"].lower()}-{LEVELS[e["level"]]}-{e["kind"].removeprefix("official-")}-{digest}'
        out.append(e)
    return out

def fetch_entry(e, repo):
    path = repo / 'catalog/assets/papers' / (e['id'] + '.pdf')
    get_bytes(e['url'], path)
    return e['id'], len(path.read_bytes())

def subject_name(e, texts):
    if e.get('subject'): return e['subject']
    if e['id']=='ant-junior-sample-85fd8cd00b03': return '天線設計實務'
    if e['id']=='spe-junior-sample-bb36f88ba927': return '智慧生產與管理實務'
    if e['cert']=='CPM': return '色彩學／色彩度量學'
    if e['id']=='evm-intermediate-sample-88624d2b40e1': return '電動車電能系統／動力驅動系統／機電整合實務'
    if e['id']=='fqa-junior-sample-585e9a499219': return '食品品保概論／食品科學概論'
    title = e['title']
    patterns = [r'第[一二三四1234]科[_：:]*([^_（(]+)', r'考科[一二三四1234][_.：:]?([^_（(]+)',
                r'[_-]L\d\d[_]?([^_（(]+)', r'[_-]0[123]([^_（(]+)', r'公告試題[_]([^_（(]+)']
    for pattern in patterns:
        m = re.search(pattern, title)
        if m: return m.group(1).strip().removesuffix('-正式版考題')
    head = '\n'.join(texts[:2])
    m = re.search(r'(?:考科|科目)\s*[一二三四1234]?\s*[：:]\s*([^\n]+)', head)
    if m: return re.sub(r'\s+', '', m.group(1))
    return title

def normalized_lines(page):
    # Spatial order and boxes permit independent inspection of answer-column matches.
    rows = []
    for b in page.get_text('dict')['blocks']:
        if 'lines' not in b: continue
        for line in b['lines']:
            text = ''.join(s['text'] for s in line['spans']).strip()
            if text: rows.append({'text': unicodedata.normalize('NFKC', text), 'bbox': list(line['bbox'])})
    return rows

def parse_answers(doc, e):
    """Read literal answer-column cells. Geometry prevents option text becoming keys.

    Printed numbers may restart in another section; public numbers are global ordinals.
    Evidence retains the printed number, page and original answer cell for audit.
    """
    pages = [normalized_lines(page) for page in doc]
    candidates, cells, sections = [], [], []
    for pi, (page, rows) in enumerate(zip(doc, pages)):
        for row in rows:
            t, r = row['text'].strip(), row['bbox']
            raw = compact(t)
            section=re.match(r'^([一二三四五六]、(?:單選|複選|多選|情境|題組|綜合|選擇|簡答|申論)[^。]{0,20})',raw)
            if section: sections.append({'page':pi+1,'y':r[1],'label':section.group(1)})
            # PMAE sample table reverses the usual columns: question number, then key.
            if e['cert']=='PMAE' and e['kind']=='official-sample' and r[0]<60:
                numeric_pair=re.match(r'^(\d{1,3})\s+\(([1-4])\)',t)
                bare_num=re.fullmatch(r'\d{1,3}',t)
                if numeric_pair:
                    candidates.append({'page':pi+1,'row':row,'printedNumber':int(numeric_pair.group(1)),
                                       'inlineAnswer':'ABCD'[int(numeric_pair.group(2))-1],'numeric':True})
                    continue
                if bare_num:
                    right=[rr for rr in rows if re.fullmatch(r'\([1-4]\)',compact(rr['text']))
                           and r[2]+2<rr['bbox'][0]<85 and abs(rr['bbox'][1]-r[1])<3]
                    if len(right)==1:
                        candidates.append({'page':pi+1,'row':row,'printedNumber':int(t),
                            'inlineAnswer':'ABCD'[int(compact(right[0]['text'])[1])-1],'numeric':True})
                        continue
            letters = re.fullmatch(r'\(?([A-D](?:[,、/.]?[A-D]){0,3})\)?', raw)
            numeric = re.fullmatch(r'\(([1-4])\)',raw) if e['cert'] == 'PMAE' else None
            if letters or numeric:
                answer = ''.join(re.findall('[A-D]',letters.group(1))) if letters else 'ABCD'[int(numeric.group(1))-1]
                cells.append({'page':pi+1,'row':row,'answer':answer,'numeric':bool(numeric)})
            inline = re.match(r'^([A-D](?:[,、/. ]?[A-D]){0,3})\s*(\d{1,3})\s*[.、)](?!\d)',t)
            number = re.match(r'^(\d{1,3})\s*[.、)](?!\d)',t)
            if e['id']=='aiap-intermediate-past-c233bf5436b0' and 95<r[0]<106 and r[1]>90:
                number=re.match(r'^(\d{1,3})(?:\.|\s)',t)
            if e['id']=='aiap-intermediate-past-c233bf5436b0' and 70<r[0]<80:
                inline=re.match(r'^([A-D])\s+(\d{1,3})(?:\s|$)',t)
            if e['id']=='fqa-junior-past-53b9d59e6375' and 90<r[0]<98 and t.startswith('30 '):
                number=re.match(r'^(\d+)',t)
            if e['cert']=='FQA' and '皆可' in t:
                inline=re.match(r'^([A-D]{2,4})\s*皆可\s*(\d{1,3})[.]',t)
            if e['cert']=='AOC' and 80<r[0]<113 and re.fullmatch(r'\d{1,2}',t):
                number=re.match(r'^(\d+)',t)
            if e['id']=='evm-intermediate-sample-88624d2b40e1':
                inline=re.match(r'^(?:L\d{3}\s+)?([A-D])\s+(\d{1,3})(?:\.|\s|$)',t)
                if 88<r[0]<98:number=re.match(r'^(\d{1,3})(?:\.|\s|$)',t)
            if e['cert'] == 'CPM' and re.fullmatch(r'\d{1,2}',t) and .30*page.rect.width < r[0] < .36*page.rect.width:
                number = re.match(r'^(\d+)',t)
            if inline and r[0] < page.rect.width*.30:
                candidates.append({'page':pi+1,'row':row,'printedNumber':int(inline.group(2)),
                    'inlineAnswer':''.join(re.findall('[A-D]',inline.group(1)))})
            elif number and r[0] < page.rect.width*.42 and 1 <= int(number.group(1)) <= 150:
                candidates.append({'page':pi+1,'row':row,'printedNumber':int(number.group(1))})
    # The dominant left edge is the question-number column; reject numbered sublists.
    plain = [q for q in candidates if 'inlineAnswer' not in q]
    if plain:
        columns = Counter(round(q['row']['bbox'][0]/10)*10 for q in plain)
        starts=[q for q in plain if q['printedNumber']==1 and any(c['page']==q['page']
            and 8<q['row']['bbox'][0]-c['row']['bbox'][2]<95
            and -10<(c['row']['bbox'][1]+c['row']['bbox'][3])/2-q['row']['bbox'][1]<125 for c in cells)]
        main_x = starts[0]['row']['bbox'][0] if starts else columns.most_common(1)[0][0]
        candidates = [q for q in candidates if 'inlineAnswer' in q or abs(q['row']['bbox'][0]-main_x) <= 9
            or (e['cert']=='FQA' and any(c['page']==q['page']
                and 4<q['row']['bbox'][0]-c['row']['bbox'][2]<65
                and abs(c['row']['bbox'][1]-q['row']['bbox'][1])<9 for c in cells))]
    candidates.sort(key=lambda q:(q['page'],q['row']['bbox'][1],q['row']['bbox'][0]))
    # FQA written-answer sections contain numbered sublists, not additional MC keys.
    if e['cert'] == 'FQA':
        essay_start = next(((i+1,r['bbox'][1]) for i,rs in enumerate(pages) for r in rs
                            if re.match(r'^(?:[二三]、)?(?:簡答|申論|問答)題',compact(r['text']))),None)
        if essay_start: candidates = [q for q in candidates if (q['page'],q['row']['bbox'][1]) < essay_start]
    answers, boxes, evidence, locations, anomalies = [], [], [], [], []
    previous, offset = 0, 0
    for qi,q in enumerate(candidates):
        printed = q['printedNumber']
        if printed <= previous:
            if printed == 1: offset += previous
            else:
                anomalies.append('Unexpected printed number '+str(printed)+' on page '+str(q['page']))
                continue
        number = offset+printed
        if previous and printed != previous+1 and printed != 1:
            anomalies.append('Question-number gap before '+str(number))
        previous = printed
        r = q['row']['bbox']; page_no = q['page']; page = doc[page_no-1]
        nextq = candidates[qi+1] if qi+1 < len(candidates) else None
        bottom = nextq['row']['bbox'][1]-2 if nextq and nextq['page']==page_no else page.rect.height-30
        possible = [c for c in cells if c['page']==page_no and c['row']['bbox'][2] < r[0]-3
                    and r[1]-10 <= (c['row']['bbox'][1]+c['row']['bbox'][3])/2 < bottom]
        answer, cell = q.get('inlineAnswer'), None
        if not answer and len(possible)==1:
            cell=possible[0];answer=cell['answer']
        body_end = nextq['row']['bbox'][1]-12 if nextq and nextq['page']==page_no else bottom
        body='\n'.join(rr['text'] for rr in pages[page_no-1] if r[1]-10 <= rr['bbox'][1] < body_end)
        if nextq and nextq['page']>page_no:
            for continuation in range(page_no,nextq['page']):
                end=nextq['row']['bbox'][1]-12 if continuation==nextq['page']-1 else doc[continuation].rect.height-30
                body+='\n'+'\n'.join(rr['text'] for rr in pages[continuation] if rr['bbox'][1]<end)
        preceding=[sec for sec in sections if (sec['page'],sec['y']) <= (page_no,r[1])]
        section_label=preceding[-1]['label'] if preceding else ''
        multiple=bool(re.search(r'\((?:複選|多選)\)',compact(body))) or ('複選' in section_label or '多選' in section_label)
        if re.search(r'情境|綜合|題組',section_label): multiple=bool(re.search(r'\((?:複選|多選)\)',compact(body)))
        locations.append({'number':number,'printedNumber':printed,'page':page_no})
        if answer:
            item={'number':number,'printedNumber':printed,'answer':answer,'page':page_no,'multiple':multiple}
            if section_label:item['sectionLabel']=section_label
            if e['cert']=='CPM':
                item['sectionLabel']=['L111 色彩學基礎知識','L112 色彩應用基礎知識','L113 色彩感覺','L114 配色的基本法則','L131 CIE 表色系統','L132 色彩量測'][(number-1)//8]
            if e['id']=='evm-intermediate-sample-88624d2b40e1':
                item['sectionLabel']='電動車電能系統' if page_no<=5 else '電動車動力驅動系統' if page_no<=12 else '電動車機電整合實務'
            if q.get('numeric'):item['printedAnswer']=str('ABCD'.index(answer)+1)
            if cell and cell['numeric']: item['printedAnswer']=compact(cell['row']['text']).strip('()')
            if len(answer)>1 and not multiple:item['acceptedAnswers']=list(answer)
            if e['id']=='ant-intermediate-past-d08acedcaee9' and printed==7:
                item.update(answer='ABCD',acceptedAnswers=list('ABCD'),void=True,multiple=False)
                item['correctionNote']='原卷答案欄明列 A、B、C、D 均給分。'
            answers.append(item)
            if cell:
                boxes.append({'page':page_no,'rect':cell['row']['bbox'],'pageWidth':page.rect.width,'pageHeight':page.rect.height})
            evidence.append({'page':page_no,'number':number,'printedNumber':printed,
                'text':(cell['row']['text']+' | ' if cell else '')+q['row']['text'][:120],
                'pattern':'left-answer-cell' if cell else 'answer-number-inline'})
    return answers, boxes, locations, evidence, anomalies

def analyze_entry(e, repo, source_dir):
    import pymupdf as fitz
    path = repo / 'catalog/assets/papers' / (e['id']+'.pdf')
    doc = fitz.open(path)
    texts = [p.get_text(sort=True) for p in doc]
    cache = source_dir / 'paper-analysis'; cache.mkdir(exist_ok=True)
    (cache/(e['id']+'.txt')).write_text('\n\f\n'.join(texts))
    answers, boxes, locations, evidence, anomalies = parse_answers(doc,e)
    full = '\n'.join(texts)
    all_compact=compact(full)
    expected = max((q['number'] for q in locations),default=None)
    # Headings explicitly enumerate written-response questions beyond MC numbering.
    essay_counts=re.findall(r'(?:簡答|申論|問答)題[(:：]?([0-9]{1,3})題',all_compact)
    essay_count=max(map(int,essay_counts),default=0)
    if e['cert']=='FQA' and e['level']==2 and not essay_count and '二、簡答題' in all_compact:
        tail=all_compact.split('二、簡答題',1)[1]
        if all(x+'、' in tail for x in ['一','二','三','四','五','六','七','八','九','十']):essay_count=10
    if expected is not None: expected += essay_count
    if e['id']=='evm-intermediate-sample-88624d2b40e1':expected=71;essay_count=4
    if e['id']=='pmae-intermediate-sample-df153d8c33e3':expected=17;essay_count=1
    if e['id']=='mdmt-junior-past-2c5fcf93d079':expected=9;anomalies=[]
    if e['id'] in ('ant-junior-sample-85fd8cd00b03','spe-junior-sample-bb36f88ba927'):
        expected=None;answers=[];anomalies=[]
    kind='mixed' if essay_count or any(a['multiple'] for a in answers) else 'single'
    if not answers and re.search('申論題|簡答題',full):kind='practical'
    if re.search('實作|術科|評分標準|機械製圖',e['title']) and not answers: kind='practical'
    # Sample table has six unnumbered questions; use the original top-to-bottom order.
    if e['id']=='fqa-junior-sample-585e9a499219':
        answers=[{'number':i+1,'printedNumber':None,'answer':a,'page':1,'multiple':False} for i,a in enumerate('DDBAAD')]
        expected=6;anomalies=[]
        evidence=[{'page':1,'pattern':'visually-checked-unnumbered-sample','answerSequence':'D,D,B,A,A,D'}]
    status='verified' if answers and expected==len(answers) and [a['number'] for a in answers]==list(range(1,expected+1)) and not anomalies else 'partial' if answers else 'unavailable'
    notes=['官方原卷含答案時，頁面保留可見答案，供研讀使用。']
    if e.get('notice'):notes.append(e['notice'])
    if e['cert'] in ('AOC','FQA'):
        notes.append('官方主辦／執行單位公開備考原卷；外站未另見明示的整站開放再利用授權，來源及利用範圍見資料校核文件。')
    if e['id']=='fqa-junior-past-ee6c1027aa83':
        notes.append('原卷第 60 題答案欄為「需修正題」，沒有可採用的選項答案；保留原題但不自動計分。')
    if e['cert']=='FQA' and e['level']==2 and e['title'].startswith('106年') and e.get('subject')=='統計製程品管':
        notes.append('官方疑義公告另載簡答第 5 題題目數字有誤、疑義成立；本卷簡答題均不自動計分。')
    if anomalies:notes.append('題號索引需保守使用：'+'；'.join(anomalies))
    if any(a.get('printedNumber') not in (None,a['number']) for a in answers):
        notes.append('原卷部分科目／題型重新從 1 編號；答題卡以全卷順序編號，printedNumber 保留原題號。')
    if e['id']=='fqa-junior-sample-585e9a499219':notes.append('原樣題未印題號，依原卷由上到下順序編為 1–6。')
    corrections=e.get('corrections',{})
    for item in answers:
        override=corrections.get(item['printedNumber']) or corrections.get(str(item['printedNumber']))
        if override:
            item['printedAnswer']=item['answer'];item['answer']=override;item['correctionSourceUrl']=FQA_INDEX
        if len(item['answer'])>1 and e['cert']=='FQA':
            item['multiple']=False;item['acceptedAnswers']=list(item['answer'])
            if set(item['answer'])==set('ABCD'):item['void']=True
    if corrections:notes.append('答案卡已對照食品所該梯次疑義公告；acceptedAnswers 表示單選題任一指定選項均可接受，不是複選。')
    if essay_count:notes.append(f'原卷另含 {essay_count} 題簡答／申論，保留題目供自行研讀，未轉為選擇題。')
    if status=='unavailable':notes.append('未擷取到可驗證的逐題選擇題答案；僅提供原卷閱讀，不自動計分。')
    if status=='partial':notes.append('僅 answers 內的選擇題有可核對的答案；其餘題目不猜答案、不自動計分。')
    if kind=='practical':notes.append('實作／術科題目或評分規準，保留原卷閱讀。')
    paper={'id':e['id'],'certId':e['cert'].lower(),'levelId':LEVELS[e['level']],
        'title':e['title'],'sourceKind':e['kind'],'sourceUrl':e['url'],
        'sourceIndexUrl':e['indexUrl'],'path':'assets/papers/'+e['id']+'.pdf',
        'subjectName':subject_name(e,texts),'questionCount':expected,'answers':answers,
        'answerStatus':status,'type':kind,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
        'notes':notes,'answerVisibility':'visible','pageCount':len(doc),
        'pages':['assets/papers/'+e['id']+f'/page-{i+1:02}.webp' for i in range(len(doc))],
        'answerBoxes':boxes,'licenseUrl':LICENSE_URL if e['cert'] not in ('AOC','FQA') else None}
    if e['cert']=='PMAE' and any(a.get('printedAnswer') in list('1234') for a in answers):
        paper['optionLabels']={'A':'1','B':'2','C':'3','D':'4'}
        paper['notes'].append('原卷選項以 1–4 編號；答題卡 A–D 依序對應 1–4。')
    (cache/(e['id']+'.json')).write_text(json.dumps({'paper':paper,'evidence':evidence,'locations':locations,'entry':e},ensure_ascii=False,indent=2))
    doc.close()
    return paper

def render_entry(args):
    import pymupdf as fitz
    from PIL import Image
    ident, repo_s, width, quality = args
    repo = Path(repo_s)
    path = repo/'catalog/assets/papers'/(ident+'.pdf')
    target = path.with_suffix('');target.mkdir(exist_ok=True)
    doc = fitz.open(path)
    for i,page in enumerate(doc):
        out = target/f'page-{i+1:02}.webp'
        if out.exists(): continue
        pix = page.get_pixmap(matrix=fitz.Matrix(width/page.rect.width,width/page.rect.width),colorspace=fitz.csRGB,alpha=False)
        Image.frombytes('RGB',(pix.width,pix.height),pix.samples).save(out,'WEBP',quality=quality,method=4)
    return ident,len(doc)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source-dir',type=Path,required=True)
    ap.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[1])
    ap.add_argument('--phase',choices=['fetch','analyze','render','all'],default='all')
    ap.add_argument('--workers',type=int,default=4)
    args=ap.parse_args()
    entries=discover(args.source_dir)
    (args.source_dir/'paper-sources.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2))
    print('DISCOVERED',len(entries),dict(Counter(e['cert'] for e in entries)),flush=True)
    if args.phase in ('fetch','all'):
        failures=[]
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            fs={pool.submit(fetch_entry,e,args.repo):e for e in entries}
            for i,f in enumerate(as_completed(fs),1):
                try:f.result()
                except Exception as ex:failures.append({'id':fs[f]['id'],'url':fs[f]['url'],'error':str(ex)})
                if i%20==0: print('FETCH',i,'/',len(entries),flush=True)
        (args.source_dir/'paper-download-errors.json').write_text(json.dumps(failures,ensure_ascii=False,indent=2))
        print('FETCH_COMPLETE',len(entries)-len(failures),'failed',len(failures),flush=True)
        if failures: raise RuntimeError('Some PDFs failed; see paper-download-errors.json')
    if args.phase in ('analyze','all'):
        papers=[]
        for e in entries:
            p=analyze_entry(e,args.repo,args.source_dir);papers.append(p)
            print('ANALYZE',p['id'],p['questionCount'],len(p['answers']),p['answerStatus'],p['type'],flush=True)
        out=args.repo/'catalog/data/papers.json';out.parent.mkdir(exist_ok=True)
        out.write_text(json.dumps({'updatedAt':'2026-10-01','papers':papers},ensure_ascii=False,indent=2)+'\n')
        print('ANSWER_STATUS',dict(Counter(p['answerStatus'] for p in papers)),flush=True)
    if args.phase in ('render','all'):
        jobs=[(e['id'],str(args.repo),1500,82) for e in entries]
        with ProcessPoolExecutor(max_workers=args.workers) as pool:
            for i,result in enumerate(pool.map(render_entry,jobs),1):
                if i%10==0:print('RENDER',i,'/',len(jobs),flush=True)
        print('RENDER_COMPLETE',len(jobs),flush=True)

if __name__=='__main__':main()

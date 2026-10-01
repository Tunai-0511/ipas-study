#!/usr/bin/env python3
"""Import the preserved 108–113 official junior IoT papers.

Inputs are the 21 unmodified PDFs from the pinned source archive documented in
``docs/aiot-legacy-bank-audit.md``. Requires pdfplumber, pypdfium2 and Pillow.
No network, OCR guessing, generated figures, or third-party explanations are used.

    python scripts/import-iot-legacy.py --input /path/to/歷屆

Question bounds are determined from the printed answer/number column. Cross-page
questions are joined before splitting A–D; source crops omit the answer column.
"""
from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import quote

import pdfplumber
import pypdfium2 as pdfium
from PIL import Image

ARCHIVE_COMMIT = 'a73511f419c96fcccc4eeb9bf615ee891f248423'
ARCHIVE_FILE = '108~113 歷屆試題.7z'
MIRROR = ('https://github.com/ZEO-Lab/IPAS-IOT-Engineer/blob/' +
          ARCHIVE_COMMIT + '/' + quote(ARCHIVE_FILE))
OFFICIAL = 'https://ipd.nat.gov.tw/ipas/certification/AIOT/learning-resources'
POLICY = 'https://www.ida.gov.tw/ctlr?PRO=default.OpenInformation'
TITLES = {'O11': '物聯網基礎架構概論', 'O12': '物聯網系統與應用'}
# The answer-column audit includes amendments printed on separate lines.
# In 109-1 O12 Q11 the old A is struck through; red text supersedes it.
REVIEW_ANSWERS = {
    '109-1-o12-011': ('C、D 均給分（原 A 已刪除）', ['C', 'D']),
    '111-2-o11-006': ('C、D 皆給分', ['C', 'D']),
    '111-2-o12-025': ('A、B 皆給分', ['A', 'B']),
    '112-1-o11-007': ('B、D 皆給分', ['B', 'D']),
    '112-1-o12-031': ('皆給分', ['A', 'B', 'C', 'D']),
    '112-2-o11-031': ('B 或 D', ['B', 'D']),
    '113-2-o11-022': ('A、B、C、D（原卷並列）', ['A', 'B', 'C', 'D']),
}
# Raw margin tokens deliberately retain the struck-through A in the first case.
# These assertions prevent silently taking only the first line of an amendment.
REVIEW_MARGIN_TOKENS = {
    '109-1-o12-011': 'ACD給分',
    '111-2-o11-006': 'CD皆給分',
    '111-2-o12-025': 'AB皆給分',
    '112-1-o11-007': 'BD皆給分',
    '112-1-o12-031': '皆給分',
    '112-2-o11-031': 'B或D',
    '113-2-o11-022': 'ABCD',
}
# These 16 figures were visually inspected against rendered original pages.
FIGURE_IDS = set('''
108-2-o12-043 109-1-o12-013 109-1-o12-044
110-2-o12-009 110-2-o12-030 110-2-o12-035
111-2-o11-002 111-2-o11-017 111-2-o12-015 111-2-o12-022
111-2-o12-027 112-1-o12-027 112-2-o11-014 112-2-o11-025
113-2-o12-033 113-2-o12-035
'''.split())


def normalise(text):
    # Unify CJK compatibility glyphs without destroying superscripts/symbols.
    return ''.join(unicodedata.normalize('NFKC', c)
                   if '\uf900' <= c <= '\ufaff' else c for c in text)


def clean(text):
    text = normalise(text).strip()
    text = re.sub(r'(?<=[\u3400-\u9fff，。；：！？、）》」』])\s+'
                  r'(?=[\u3400-\u9fff，。；：！？、（《「『])', '', text)
    text = re.sub(r'(?<=[A-Za-z])\n(?=[A-Za-z])', ' ', text)
    # Verified Symbol/Wingdings glyph mappings, not inferred missing content.
    return text.replace('\uf0e0', '→').replace('\uf06c', '●').strip()


def chapter(subject, stem, options):
    """Editorial crosswalk to the new syllabus; never a new-exam classification."""
    s = stem + ' ' + ' '.join(options.values())
    if subject == 'A1':
        rules = [
            (7, r'資安|安全威脅|密碼|金鑰|加密|解密|隱私|存取權|憑證|攻擊|Authentication|Authorization|TLS|個人資料'),
            (5, r'EPC|RFID.*標準|LLRP|ONS|ISO.?1[58]|OPC|MTConnect|資訊模型'),
            (6, r'雲|Cloud|SaaS|PaaS|IaaS|Serverless|中介|平台|Apache|MongoDB|SQL|AWS|Azure'),
            (9, r'UART|I.?C|SPI|GPIO|取樣|量化|ADC|DAC|類比|數位訊號|電磁|SAR|輻射|電場|磁場'),
            (4, r'通訊|網路|RFID|NFC|Wi.?Fi|LoRa|NB.IoT|ZigBee|Zigbee|Bluetooth|MQTT|TCP|UDP|HTTP|GPS|UWB|頻段|頻譜|無線|拓樸|乙太'),
            (8, r'感測|感應|霍爾|溫度|濕度|壓力|雷達|雷射|磁簧|紅外線|pH|PIR|光敏|電阻'),
            (2, r'智慧|智能|醫療|物流|城市|農業|零售|支付|停車|應用層'),
            (1, r'機器學習|深度學習|神經網路|人工智慧|模型訓練'),
        ]
        fallback = 3
    else:
        rules = [
            (3, r'資安|安全威脅|密碼|金鑰|加密|解密|隱私|憑證|攻擊|TLS|SSL|VPN|WPA|WEP|IPSec|個人資料|個資|防火牆|存取限制|不可否認'),
            (2, r'故障|排除|不亮|無法讀|沒有回應|亂碼|燒毀|突然|過熱|不足|電量|問題.*原因|time out'),
            (4, r'Arduino|Raspberry|樹莓|嵌入式|微控制|GPIO|UART|SPI|I.?C|RS.?232|RS.?485|PWM|ADC|DAC|電阻|電壓|電流|LED|類比|數位.*接腳|接腳|硬體|按鈕|TTL|鮑率|電路|感測器|感測元件'),
            (5, r'JSON|XML|CSV|SQL|資料庫|雲|Cloud|SaaS|PaaS|IaaS|API|HTTP|WebSocket|MQTT|CoAP|資料交換|開放資料|開源|授權|GPL|BSD|Apache|Linux|軟體|Copyleft|Shareware'),
            (6, r'製造|生產|工廠|成本|效益|流程優化|良率|OEE|預測.*維護|保養'),
        ]
        fallback = 1
    for n, pattern in rules:
        if re.search(pattern, s, re.I):
            return f'{subject.lower()}-t{n}'
    return f'{subject.lower()}-t{fallback}'


def extract(file):
    year, session = map(int, re.match(r'(\d+)-(\d+)', file.name).groups())
    old = 'O11' if ('概論' in file.name or 'L11' in file.name) else 'O12'
    with pdfplumber.open(file) as doc:
        starts, headers, lefts = [], [], []
        for i, page in enumerate(doc.pages):
            words = page.extract_words()
            lines = page.extract_text_lines()
            header = next(x for x in lines if x['text'].startswith('考試日期'))
            headers.append(header['bottom'] + 2)
            for line in lines:
                m = re.match(r'^([A-D]|皆)\s+(\d{1,2})\.\s', line['text'])
                if not m:
                    continue
                answer, number = m.groups()
                number = int(number)
                token = next(w for w in words if w['text'] == f'{number}.'
                             and abs(w['top'] - line['top']) < 2)
                lefts.append(token['x0'] - 2)
                starts.append(dict(answer=answer, n=number, p=i, top=line['top'] - 1))
        assert [x['n'] for x in starts] == list(range(1, 51)), file.name
        left = min(lefts)
        questions = []
        for index, start in enumerate(starts):
            nxt = starts[index + 1] if index + 1 < 50 else dict(p=len(doc.pages) - 1, top=790)
            regions, chunks, answer_tokens = [], [], []
            for pno in range(start['p'], nxt['p'] + 1):
                top = start['top'] if pno == start['p'] else headers[pno]
                bottom = nxt['top'] - 2 if pno == nxt['p'] else 790
                if bottom <= top + 1:
                    continue
                page = doc.pages[pno]
                margin = page.crop((65, top, left - 1, bottom)).extract_text() or ''
                answer_tokens.extend(re.findall(r'[ABCD]|皆|給|分|或', margin))
                box = (left, top, page.width - 60, bottom)
                text = page.crop(box).extract_text() or ''
                text = '\n'.join(line for line in text.splitlines()
                                 if not re.match(r'^(單選題|科目|考試日期|\d+\s*年度)', line))
                chunks.append(text)
                regions.append(dict(page=pno + 1, box=box))
            full = normalise('\n'.join(chunks))
            full = re.sub(r'^\d+\.\s*', '', full)
            marks = list(re.finditer(r'(?:^|\n)[ \t]*[（(]([A-D])[)）][ \t]*', full))
            assert [m[1] for m in marks] == list('ABCD'), (file.name, start['n'])
            stem = clean(full[:marks[0].start()])
            options = {m[1]: clean(full[m.end():marks[j+1].start() if j + 1 < 4 else len(full)])
                       for j, m in enumerate(marks)}
            key = f'{year}-{session}-{old.lower()}-{start["n"]:03d}'
            expected_margin = REVIEW_MARGIN_TOKENS.get(key, start['answer'])
            assert ''.join(answer_tokens) == expected_margin, (key, answer_tokens, expected_margin)
            if key == '109-1-o12-011':
                # The printed red amendment is an answer note, not option D.
                options['D'] = options['D'].split('委員釋覆結果')[0].strip()
                options['D'] = options['D'].split('委員釋疑結果')[0].strip()
            # Visually checked formula text embedded as original PDF images.
            if key == '111-2-o11-002':
                options = {'A': '氫離子（H⁺）', 'B': '氫負離子（H⁻）',
                           'C': '氧離子（O²⁻）', 'D': '氯離子（Cl⁻）'}
            elif key == '111-2-o12-036':
                options['A'] = 'I²C（Inter-Integrated Circuit）'
            elif key == '111-2-o12-040':
                stem = stem.replace('關於（Inter-Integrated Circuit）', '關於 I²C（Inter-Integrated Circuit）')
                options = {k: ('I²C ' + v) for k, v in options.items()}
            elif key == '108-2-o11-025':
                options['D'] = 'CO、CO₂ 感測器感測周圍 CO、CO₂ 的濃度'
            assert stem and all(options.values()), (file.name, start['n'])
            assert len(set(options.values())) == 4, (file.name, start['n'])
            assert not re.search(r'[\ue000-\uf8ff\ufffd]', stem + ''.join(options.values()))
            subject = 'A1' if old == 'O11' else 'A2'
            low_alignment = bool(re.search(r'EPCglobal|EPCIS|SGTIN|SSCC|LLRP|EPC.?編碼|電磁波|SAR|游離輻射|致癌|環境保護署|原子能委員會', stem, re.I))
            original_answer = REVIEW_ANSWERS[key][0] if key in REVIEW_ANSWERS else start['answer']
            review = key in REVIEW_ANSWERS
            q = dict(
                id='aiot-legacy-' + key, subject=subject,
                subjectName='AIoT 基礎概論' if subject == 'A1' else '物聯網系統與應用',
                topic=chapter(subject, stem, options), stem=stem, options=options,
                answer='' if review else original_answer, originalAnswer=original_answer,
                type='single', needsContext=False, generated=False,
                source=f'舊制官方試題 {year} 年第 {session} 次・{old} {TITLES[old]}',
                sourceKind='legacy-exam', year=year, examSession=session,
                session=f'legacy-{year}-{session}', number=start['n'],
                originalSubject=TITLES[old], originalSubjectCode=old,
                srcUrl=MIRROR, sourceUrl=MIRROR, officialSourceUrl=OFFICIAL,
                sourceFile=file.name, sourceSha256=hashlib.sha256(file.read_bytes()).hexdigest(),
                page=start['p']+1, sourcePage=start['p']+1,
                explanation=(
                    f'本題原官方疑義答案為「{original_answer}」，未指定唯一正解；保留單選題原貌，僅供查閱，不納入單一答案練習評分。'
                    if review else f'原官方試卷標示答案為 {original_answer}。本題保留舊制物聯網考試的題文與當年度答案；此處未收錄第三方解析。'
                ),
                concept=TITLES[old] + '・舊制歷屆補充',
                syllabusAlignment='lower' if low_alignment else 'related',
                syllabusNote=('舊制範圍；與新版 AIoT 大綱關聯較低，供延伸參考。'
                              if low_alignment else '依內容對應新版 AIoT 章節，屬舊制補充題，非新版 AIoT 歷屆題。'),
                historicalNote='保留當年度用語與公告答案；產品規格、服務、法規與標準可能已更新。',
            )
            if review:
                q.update(needsReview=True, acceptedAnswers=REVIEW_ANSWERS[key][1], reviewReason=('官方公告皆給分，不納入單一答案練習評分' if original_answer == '皆給分' else '官方疑義公告接受多個單選答案，不納入單一答案練習評分'))
            if key in FIGURE_IDS:
                q['images'] = [f'assets/questions/legacy/{q["id"]}.png']
            questions.append((q, regions))
        return questions, dict(file=file.name, year=year, session=session,
                               subject=old, pages=len(doc.pages),
                               sha256=hashlib.sha256(file.read_bytes()).hexdigest())


def render_question(file, regions, destination):
    """Preserve source figure and surrounding labels; no answer-column pixels."""
    doc = pdfium.PdfDocument(str(file))
    parts = []
    for region in regions:
        image = doc[region['page']-1].render(scale=2).to_pil()
        parts.append(image.crop(tuple(round(v*2) for v in region['box'])).convert('RGB'))
    result = Image.new('RGB', (max(p.width for p in parts), sum(p.height for p in parts) + 12*(len(parts)-1)), 'white')
    top = 0
    for part in parts:
        result.paste(part, (0, top))
        top += part.height + 12
    result.save(destination, optimize=True)
    doc.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    all_questions, sources = [], []
    figure_dir = args.repo/'aiot/assets/questions/legacy'
    figure_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(args.input.glob('*.pdf'))
    assert len(files) == 21, f'Expected the reviewed 21-PDF archive, got {len(files)}'
    for file in files:
        rows, source = extract(file)
        for question, regions in rows:
            if question.get('images'):
                render_question(file, regions, args.repo/'aiot'/question['images'][0])
            all_questions.append(question)
        source.update(questions=len(rows), gradable=sum(not q.get('needsReview') for q, _ in rows),
                      figures=sum(bool(q.get('images')) for q, _ in rows))
        sources.append(source)
    all_questions.sort(key=lambda q: (-q['year'], -q['examSession'], q['originalSubjectCode'], q['number']))
    assert len(all_questions) == 1050
    assert len({q['id'] for q in all_questions}) == 1050
    assert sum(bool(q.get('images')) for q in all_questions) == 16
    assert sum(bool(q.get('needsReview')) for q in all_questions) == 7
    data_file = args.repo/'aiot/data/legacy-bank.js'
    data_file.write_text('// Original official legacy IoT papers; see docs/aiot-legacy-bank-audit.md.\n'
                         'window.APP_LEGACY_BANK = ' + json.dumps(all_questions, ensure_ascii=False, indent=2) + ';\n')
    audit = args.repo/'docs/aiot-legacy-bank-audit.md'
    lines = [
        '# 舊制物聯網官方歷屆題匯入稽核', '',
        '核對日期：2026-10-01。此資料集保留舊制「物聯網應用工程師」初級考卷身分，並非 115 年新制 AIoT 歷屆題。', '',
        '## 範圍與結果', '',
        '- 21 卷、1,050 題；A1 對應舊 O11 共 500 題，A2 對應舊 O12 共 550 題。',
        '- 可評分 1,043 題。7 題官方疑義答案為多個單選答案或「皆給分」，保留原題與 acceptedAnswers，但以 needsReview 排除單一答案評分。',
        '- 16 題附原 PDF 裁切圖。保留圖中標籤、表格、程式與題意所需上下文；裁切避開左側官方答案欄。沒有生成或猜補官方圖片。',
        '- 所有題目按原卷四選一處理；沒有從第三方網站複製個人解析。解析欄僅說明原官方答案及舊制範圍。',
        '- 章節歸屬是本站對新版 15 章的編輯對照，並非官方宣稱該題仍屬新制命題範圍。EPC 細節、電磁波法規等舊大綱內容另標「大綱關聯較低」。', '',
        '## 來源及使用依據', '',
        f'- 原試卷主管單位：經濟部產業發展署／iPAS。現行官方學習資源頁：{OFFICIAL}',
        f'- 原官方 PDF 保存鏡像：{MIRROR}（固定提交 {ARCHIVE_COMMIT}）。每題保留卷名、年度、場次、原科目、頁碼、PDF SHA-256 與鏡像出處。',
        f'- 政府網站資料開放宣告：{POLICY}。聲明允許標示出處後重製、改作、編輯及公開傳輸，且不得暗示機關背書；另外特別聲明須同意的資料不在一般授權內。',
        '- 本次已核對 iPAS 現行頁尾版權歸經濟部產業發展署，21 卷均為帶官方考試抬頭、日期、頁次及答案的原卷，未見另行限制重製聲明。套用的是主管機關網站開放宣告，並未把 GitHub 程式碼的 MIT 授權誤當官方試題授權。',
        '- GitHub 個人筆記另有非商用說明；本次完全不匯入個人筆記、筆記圖或解題心得。第三方圖示僅隨原試題整體呈現，不作為本站標誌、商標授權或官方背書。',
        '- 因舊 DownloadFile.ashx 下載連結已失效，未聲稱已將鏡像 PDF 雜湊與現行官方伺服器逐位元比對；來源身分以原卷文件與歷史保存記錄確認。', '',
        '## 每卷清單', '',
        '| 年度場次 | 舊科目 | 題數 | 可評分 | 圖題 | PDF 頁數 | PDF SHA-256 |',
        '|---|---|---:|---:|---:|---:|---|',
    ]
    for item in sorted(sources, key=lambda x: (-x['year'], -x['session'], x['subject'])):
        lines.append(f'| {item["year"]}-{item["session"]} | {item["subject"]} {TITLES[item["subject"]]} | {item["questions"]} | {item["gradable"]} | {item["figures"]} | {item["pages"]} | `{item["sha256"]}` |')
    lines += ['', '## 原卷檔名', '']
    lines += ['- '+item['file'] for item in sources]
    lines += [
        '', '## 提取與人工校對', '',
        '- 逐卷驗證題號嚴格為 1–50、四選項齊全、原答案欄有效、固定 ID 不重複。跨頁題以幾何區塊接合，不把頁首、頁碼或下一題內容混入。',
        '- 1,050 題均以 PDF 印刷答案欄為準；完整掃描了整個答案欄，並對 7 題跨行疑義答案逐張看圖，不只讀每題第一行。109-1 O12 第 11 題原 A 有刪除線，紅字更正為 C/D 均給分；題幹、選項保留原文字與疑義釋義版本，不自行改寫成現行技術結論。',
        '- 統一 CJK 相容字形；依原圖將 Symbol 字型箭頭轉成 →、項目符號轉成 ●。未對題目做自動繁簡改寫或猜測式 OCR。',
        '- 108-2 O11 第 25 題：比對原 PDF 上下標位置，還原 CO₂ 字樣，避免文字提取把下標 2 移到下一行。',
        '- 111-2 O11 第 2 題：四個離子公式原為嵌入圖片，逐項看原圖轉錄為 H⁺、H⁻、O²⁻、Cl⁻，同時保留原圖。',
        '- 111-2 O12 第 36、40 題：I²C 原為行內圖片，依原頁補回遺失的 I²C 字樣。第 40 題各選項皆含該字樣；未改原答案。',
        '- 111-1 O12 第 26 題：所稱附圖實為兩行規格文字，兩行工作溫度、探頭量測範圍已完整保留在題幹。',
        '- 已逐張目視檢查 16 張最終裁切來源、箭頭／接線／標籤與跨頁接合，沒有把相鄰題的答案帶入圖片。', '',
        '## 未取得與不計分清單', '',
        '- 114 年：本保存來源沒有 114 年試卷；舊官方下載網址回傳 404。目前不以搜尋摘要或阿摩個人解析拼湊整卷，留待可取得完整原卷後匯入。',
        '- 109 年第 1 次 O11：保存來源未提供，未推測或生成補足。',
        '- 108 年第 1 次及更早年度：不在本保存檔範圍內，未聲稱已收齊。',
        '- 7 題皆保留 answer 空字串、originalAnswer 公告文字、acceptedAnswers 與 needsReview:true；題文可查閱，排除練習及模擬考評分。',
        *[f'- `aiot-legacy-{key}`：{value[0]}。' for key, value in REVIEW_ANSWERS.items()], '',
        '## 重現', '',
        '以檔案清單與 SHA-256 核對解壓後的 21 份原 PDF，再執行：', '',
        '```sh', 'python scripts/import-iot-legacy.py --input /path/to/歷屆', '```', '',
        '依賴：pdfplumber、pypdfium2、Pillow。腳本只讀本機原卷，不連網、不 OCR、不使用不明答案。',
    ]
    audit.write_text('\n'.join(lines)+'\n')
    print(json.dumps(dict(total=len(all_questions), gradable=1043, figures=16,
                          subjects=dict(Counter(q['subject'] for q in all_questions)),
                          topics=dict(Counter(q['topic'] for q in all_questions))), ensure_ascii=False))


if __name__ == '__main__':
    main()

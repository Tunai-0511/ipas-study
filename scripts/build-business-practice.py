"""Small original diagram exercises complement the official OIA guide bank."""
import json, html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'catalog/assets/questions/business'
OUT.mkdir(parents=True,exist_ok=True)
data=json.loads((ROOT/'catalog/data/certifications.json').read_text())
cert=next(c for c in data['certifications'] if c['id']=='oia')
syllabus=cert['levels'][0]['sourceUrl']
sql='https://www.postgresql.org/docs/17/tutorial-agg.html'
star='https://learn.microsoft.com/en-us/power-bi/guidance/star-schema'
questions=[]
def diagram(name,title,headers,rows,note):
    width=900; height=160+len(rows)*62
    def text(x,y,s,size=23):return f'<text x="{x}" y="{y}" font-size="{size}">{html.escape(str(s))}</text>'
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title"><title id="title">{html.escape(title)}</title>', '<rect width="100%" height="100%" fill="#fff"/><g font-family="sans-serif" fill="#18383d">',text(30,42,title,28)]
    step=840/len(headers)
    parts.append('<rect x="25" y="65" width="850" height="48" rx="8" fill="#e3f3ed"/>')
    for i,h in enumerate(headers):parts.append(text(40+i*step,96,h))
    for r,row in enumerate(rows):
        y=145+r*62
        for i,value in enumerate(row):parts.append(text(40+i*step,y,value))
        parts.append(f'<path d="M30 {y+16} H870" stroke="#d5dfdf"/>')
    parts += [text(30,height-20,note,19),'</g></svg>']
    (OUT/(name+'.svg')).write_text(''.join(parts))
    return {'path':'assets/questions/business/'+name+'.svg','alt':title+'；'+'；'.join('、'.join(map(str,r)) for r in rows)+'。'+note}
def add(sub,img,stem,opts,answer,explanation,topic,ref=sql):
    n=1+sum(q['subjectId']==f'oia-junior-{sub}' for q in questions)
    questions.append(dict(id=f'practice-oia-junior-{sub}-{n:03}',certId='oia',levelId='junior',subjectId=f'oia-junior-{sub}',sourceKind='original-practice',source='自編圖文練習｜情境數據為教學假設',stem=stem,options=dict(zip('ABCD',opts)),answer=answer,multiple=False,explanation=explanation,images=[img],topic=topic,practicalPreparation=False,sources=[{'title':'iPAS 營運智慧分析師官方考綱','url':syllabus},{'title':'計算與建模原理參考','url':ref}]))

img=diagram('sales','同一門市三個月銷售紀錄',['月份','營收（萬元）','訂單數'],[['一月',100,50],['二月',150,100],['三月',120,60]],'每筆訂單僅計一次；營收皆為新臺幣，已扣除退貨。')
add(1,img,'依圖表，第一季總營收是多少？',['120 萬元','150 萬元','370 萬元','420 萬元'],'C','100＋150＋120＝370 萬元。月份是分組維度，營收可依本題口徑加總。','彙總與指標')
add(1,img,'以一月為基期，二月營收成長率是多少？',['50%','33.3%','150%','20%'],'A','（150－100）÷100＝50%。基期分母是一月營收。','成長率')
add(1,img,'將三個月合併，整季平均每筆訂單營收最接近多少？',['1.50 萬元','2.00 萬元','1.83 萬元','1.76 萬元'],'D','總營收 370 萬元 ÷ 總訂單 210 筆 ≈ 1.76 萬元。不能直接平均三個月份的客單價。','加權平均')
add(1,img,'想依「月份」計算營收總額，SQL 中哪個組合符合圖表口徑？',['COUNT(營收) 且不分組','SUM(營收) 並 GROUP BY 月份','MAX(月份) 並 GROUP BY 訂單編號','AVG(月份) 並 GROUP BY 營收'],'B','依月份分組後加總該組的營收；COUNT 計算筆數，並不是營收。','資料彙總')
img=diagram('model','訂單明細與維度關聯',['資料表','一列代表','鍵／度量'],[['日期維度','一天','日期鍵（唯一）'],['產品維度','一項產品','產品鍵（唯一）'],['銷售事實','一張訂單的一項明細','日期鍵、產品鍵、金額']],'日期維度 1 → 多筆銷售；產品維度 1 → 多筆銷售。')
add(1,img,'此圖中銷售事實表的資料粒度是什麼？',['每月一家門市','每張訂單的每項明細','所有產品合計','每個產品類別'],'B','圖中定義一列為一張訂單的一項明細；分析時須維持一致粒度。','事實表粒度',star)
add(1,img,'要按照「產品類別」篩選銷售金額，產品類別最適合放在哪裡？',['把金額欄改成類別文字','只放在報表截圖','日期維度的日期鍵','產品維度的描述欄位'],'D','產品維度描述產品屬性，類別可用來篩選及分組，再彙總關聯的銷售金額。','維度篩選',star)
add(1,img,'產品維度同一產品鍵意外出現兩列。直接以該鍵連接銷售明細後加總，應優先檢查什麼？',['連接造成明細重複、金額被重算','營收必然減半','所有日期自動消失','數值型別必然變成文字'],'A','維度唯一鍵重複可能把一筆事實配對多次，導致重算；應先驗證維度唯一性及關聯基數。','關聯與重複',star)
add(1,img,'同一張訂單可含三項明細，若要算「訂單數」而非明細數，應採用哪個口徑？',['直接加總產品鍵','對金額取最大值','對訂單編號去重後計數','把日期天數當訂單數'],'C','一訂單多明細時，直接計數明細列會高估訂單數；應依訂單編號去重計數。','指標粒度',star)
img=diagram('quality','匯入前資料檢查表',['訂單 ID','原始金額','幣別'],[['A01','100','TWD'],['A01','100','TWD'],['A02','10','USD'],['A03','缺漏','TWD']],'兩筆 A01 是同一次重送；此練習固定匯率 1 USD＝32 TWD。')
add(1,img,'若只彙總圖中金額完整且去重後的交易，新臺幣總額是多少？',['210 元','420 元','520 元','110 元'],'B','A01 僅計一次 100 元；A02 換算 10×32＝320 元；A03 缺值不納入此題的完整交易合計，故 420 元。','清理與換算')
add(1,img,'A03 的金額缺漏，建立營收報表時何種處理較適合？',['直接假設為最大交易金額','無聲改成 0 並聲稱資料完整','刪除所有月份資料','標記缺漏並回查來源，說明目前統計範圍'],'D','未知不等於零。應保留品質狀態、回查來源，並標示報表只含金額已確認的交易。','缺漏值管理')
add(1,img,'重送 A01 的檢查規則，最適合使用哪個欄位識別同一筆交易？',['已確認具有交易唯一性的訂單 ID','只比較金額是否相同','只比較幣別是否相同','只比較列在檔案中的位置'],'A','本題已明確 A01 為同次重送；應依穩定的交易識別鍵去重，不能把不同但等額的交易誤刪。','去重策略')
add(1,img,'若未先轉換幣別，就對原始金額直接加總，主要問題是什麼？',['SUM 函數一定報錯','所有數字必然為負數','混合不同單位，總額失去一致意義','交易 ID 自動被修改'],'C','TWD 與 USD 代表不同貨幣單位。須依明確匯率與日期口徑統一單位後彙總。','資料標準化')
img=diagram('process','單一訂單處理路徑',['順序','工作站','單件作業時間'],[[1,'收單',2],[2,'揀貨',6],[3,'包裝',3]],'時間單位：分鐘。各站一人；本題忽略等待、移轉及停機。')
add(2,img,'一筆訂單連續完成三站，最短作業時間是多少？',['6 分鐘','9 分鐘','11 分鐘','18 分鐘'],'C','依題設沒有等待與移轉，作業時間為 2＋6＋3＝11 分鐘。','流程時間')
add(2,img,'穩定流水作業且各站可同時處理不同訂單時，哪一站形成此模型的瓶頸？',['收單','揀貨','包裝','三站完全相同'],'B','揀貨每件耗時 6 分鐘，服務速率最低，限制模型中的產出速率。','瓶頸分析')
add(2,img,'依圖示單站容量，忽略所有停機，流水線長期最大產出率是多少？',['每小時 30 件','每小時 20 件','每小時 60 件','每小時 10 件'],'D','瓶頸為每件 6 分鐘的揀貨，60÷6＝10 件／小時。這是題設理想容量，不是實際承諾。','產能估算')
add(2,img,'導入掃碼後，揀貨降為每件 3 分鐘，其餘不變。新的理想瓶頸週期是多少？',['3 分鐘／件','2 分鐘／件','8 分鐘／件','11 分鐘／件'],'A','各站變為 2、3、3 分鐘，最長單站週期為 3 分鐘；揀貨與包裝共同限制產出。','數位化流程改善')
img=diagram('stock','示範補貨規則與即時庫存',['項目','數值','單位'],[['每日需求',20,'件／日'],['交貨前置時間',3,'日'],['安全庫存',15,'件'],['目前庫存部位',70,'件']],'補貨點＝日需求×前置時間＋安全庫存；庫存部位低於補貨點即提醒。')
add(2,img,'依本題規則，補貨點是多少？',['35 件','60 件','75 件','105 件'],'C','20×3＋15＝75 件。這是題目提供的簡化規則，不代表所有企業都適用同一補貨政策。','庫存指標')
add(2,img,'目前庫存部位為 70 件，系統應如何處理？',['發出補貨提醒','不提醒，因為 70 大於 15','自動認定庫存為零','把日需求改成 0'],'A','70 低於規則補貨點 75，應發出提醒。是否實際下單仍可另設授權流程。','事件驅動提醒')
add(2,img,'若前置時間改為 4 日，其他數值不變，新補貨點是多少？',['80 件','95 件','75 件','60 件'],'B','20×4＋15＝95 件；前置時間增加會提高此模型的補貨點。','情境分析')
add(2,img,'若想讓提醒使用可信的庫存部位，下列何者最重要？',['固定每天補一張庫存截圖','只使用三個月前盤點','讓所有人任意覆寫庫存值','統一入出庫事件與更新時間，並核對漏傳或重送'],'D','提醒品質依賴輸入資料。統一事件、時間及重送處理才能減少錯誤警報。','作業資料治理')
img=diagram('service','客服流程改版前後的觀察',['期間','已結案件數','總處理分鐘'],[['改版前',100,800],['改版後',120,720]],'兩期各一週；案件難度與人力可能不同，尚未做控制實驗。')
add(2,img,'改版後平均每件處理時間是多少？',['6 分鐘','8 分鐘','10 分鐘','12 分鐘'],'A','720÷120＝6 分鐘／件。總處理時間與結案件數需來自相同範圍。','服務效率')
add(2,img,'平均每件處理時間從改版前到改版後減少多少百分比？',['20%','33.3%','50%','25%'],'D','改版前 800÷100＝8 分鐘，改版後 6 分鐘；（8－6）÷8＝25%。','績效比較')
add(2,img,'單憑這張圖，何種結論最合理？',['改版是改善的唯一原因','所有員工工作量都下降 25%','觀察到平均處理時間下降，但原因仍需檢查','已證明所有案件滿意度提升'],'C','資料顯示前後差異，但案件難度、人力等尚未控制，不能僅憑此表斷定唯一因果，也沒有滿意度數據。','評估界線')
add(2,img,'為避免只追求速度而犧牲品質，後續應搭配哪個指標？',['報表配色數量','重開案件率或已定義的服務品質指標','電腦桌布大小','辦公室樓層數'],'B','效率與品質需要一起觀察。重開率能提示一次結案是否實際解決問題，仍應明確定義分子分母。','平衡績效')
assert len(questions)==24
(ROOT/'catalog/data/practice-business.json').write_text(json.dumps({'version':1,'questions':questions},ensure_ascii=False,indent=2)+'\n')
print('24 original questions / 6 diagrams')

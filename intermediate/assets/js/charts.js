/* ============================================================
   charts.js — 純 SVG 圖表（零相依，可離線）
   ============================================================ */
(function (global) {
  "use strict";

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function color(pct){ return pct>=80?"var(--ok)":pct>=60?"var(--primary)":pct>=40?"var(--warn)":"var(--danger)"; }

  /* 分數環（回傳 SVG 字串）*/
  function ring(pct, size){
    size = size || 150;
    var r = size/2 - 12, cx = size/2, cy = size/2, C = 2*Math.PI*r;
    var off = C * (1 - Math.max(0,Math.min(100,pct))/100);
    var col = color(pct);
    return '<svg class="chart" role="img" aria-label="得分 '+Math.round(pct)+' 分" viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'">'+
      '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--surface-2)" stroke-width="12"/>'+
      '<circle class="ring-progress" style="--ringc:'+C.toFixed(1)+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="12" stroke-linecap="round" '+
        'stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 '+cx+' '+cy+')"/>'+
      '<text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" font-size="'+(size*0.26)+'" font-weight="800" fill="var(--text)">'+Math.round(pct)+'</text>'+
      '<text x="'+cx+'" y="'+(cy+size*0.16)+'" text-anchor="middle" font-size="'+(size*0.093)+'" font-weight="700" fill="var(--text-mute)">分</text>'+
      '</svg>';
  }

  /* 折線圖：series=[{name,color,points:[{label,y}]}] y:0-100 */
  function line(series, opts){
    opts = opts || {};
    var W=760, H=320, pad={l:38,r:18,t:18,b:44};
    var plotW=W-pad.l-pad.r, plotH=H-pad.t-pad.b;
    var allLen = Math.max.apply(null,[1].concat(series.map(function(s){return s.points.length;})));
    var n = allLen;
    function X(i){ return n<=1 ? pad.l+plotW/2 : pad.l + plotW*(i/(n-1)); }
    function Y(v){ return pad.t + plotH*(1 - Math.max(0,Math.min(100,v))/100); }

    var svg='<svg class="chart" role="img" aria-label="分數趨勢折線圖" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet">';
    // 格線 + y 標
    [0,25,50,75,100].forEach(function(g){
      var y=Y(g);
      svg+='<line x1="'+pad.l+'" y1="'+y+'" x2="'+(W-pad.r)+'" y2="'+y+'" stroke="var(--border)" stroke-width="1"/>';
      svg+='<text x="'+(pad.l-7)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="var(--text-mute)">'+g+'</text>';
    });
    // x 標（取自第一組較長的 series）
    var base = series.reduce(function(a,b){return b.points.length>=a.points.length?b:a;}, series[0]||{points:[]});
    var step = Math.ceil(base.points.length/7)||1;
    base.points.forEach(function(p,i){
      if(i%step===0 || i===base.points.length-1){
        svg+='<text x="'+X(i)+'" y="'+(H-pad.b+18)+'" text-anchor="middle" font-size="10.5" fill="var(--text-mute)">'+esc(p.label||(i+1))+'</text>';
      }
    });
    // 各線
    series.forEach(function(s){
      if(!s.points.length) return;
      var pts=s.points.map(function(p,i){return X(i)+','+Y(p.y);}).join(" ");
      if(s.points.length>1)
        svg+='<polyline class="line-path" pathLength="1" points="'+pts+'" fill="none" stroke="'+s.color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
      s.points.forEach(function(p,i){
        svg+='<circle class="line-dot" style="animation-delay:'+(0.5+i*0.08).toFixed(2)+'s" cx="'+X(i)+'" cy="'+Y(p.y)+'" r="4" fill="var(--surface)" stroke="'+s.color+'" stroke-width="2.5">'+
             '<title>'+esc(s.name)+'｜'+esc(p.label||(i+1))+'：'+Math.round(p.y)+'分</title></circle>';
      });
    });
    svg+='</svg>';
    // 圖例
    var legend='<div class="legend">'+series.map(function(s){
      return '<span class="legend-item"><span class="legend-dot" style="background:'+s.color+'"></span>'+esc(s.name)+'</span>';
    }).join("")+'</div>';
    return '<div class="chart-wrap">'+svg+'</div>'+(series.length>1?legend:"");
  }

  /* 長條圖（科目命中率等）：data=[{label,value,max}] 直式 */
  function bars(data, opts){
    opts=opts||{};
    var W=760, barH=opts.barH||30, gap=16, padL=opts.padL||150, padR=54, padT=8;
    var H=padT*2 + data.length*(barH+gap);
    var plotW=W-padL-padR;
    var svg='<svg class="chart" role="img" aria-label="各項正確率長條圖" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet">';
    data.forEach(function(d,i){
      var y=padT+i*(barH+gap);
      var pct=Math.max(0,Math.min(100,d.value));
      var w=plotW*pct/100;
      svg+='<text x="'+(padL-10)+'" y="'+(y+barH/2+4)+'" text-anchor="end" font-size="12.5" font-weight="700" fill="var(--text)">'+esc(d.label)+'</text>';
      svg+='<rect x="'+padL+'" y="'+y+'" width="'+plotW+'" height="'+barH+'" rx="7" fill="var(--surface-2)"/>';
      svg+='<rect class="bar-fill" style="animation-delay:'+(i*0.07).toFixed(2)+'s" x="'+padL+'" y="'+y+'" width="'+w.toFixed(1)+'" height="'+barH+'" rx="7" fill="'+color(pct)+'"><title>'+esc(d.label)+'：'+Math.round(pct)+'%</title></rect>';
      svg+='<text x="'+(padL+plotW+8)+'" y="'+(y+barH/2+4)+'" font-size="12.5" font-weight="800" fill="var(--text-soft)">'+Math.round(pct)+'%</text>';
    });
    svg+='</svg>';
    return '<div class="chart-wrap">'+svg+'</div>';
  }

  global.Charts = { ring: ring, line: line, bars: bars, color: color };
})(window);

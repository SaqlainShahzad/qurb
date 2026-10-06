# -*- coding: utf-8 -*-
with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_js = """    // Progress is based on the time from the previous prayer to the next one.
    var prevTime=null;
    for(var j=prayers.length-1;j>=0;j--){
      if(prayers[j].displayOnly) continue;
      var prev=new Date(now.getFullYear(),now.getMonth(),now.getDate(),prayers[j].h,prayers[j].m,0);
      if(prev.getTime()<next.t.getTime()){prevTime=prev;break;}
    }
    if(!prevTime){var y=new Date(next.t);y.setDate(y.getDate()-1);prevTime=y;}
    var span=next.t.getTime()-prevTime.getTime();
    var elapsed=now.getTime()-prevTime.getTime();
    pr.style.width=Math.max(0,Math.min(100,(elapsed/span)*100))+'%';"""

new_js = """// --- PROGRESS BAR CALCULATION FIX ---
    if (pr && next && next.t) {
      var prevTime = null;

      // Search backwards for the most recent valid Farz prayer time today
      for (var j = prayers.length - 1; j >= 0; j--) {
        if (prayers[j].displayOnly) continue;
        var pt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayers[j].h, prayers[j].m, 0);
        if (pt.getTime() <= now.getTime()) {
          prevTime = pt;
          break;
        }
      }

      // If before Fajr or between midnight & Fajr, fall back to yesterday's Isha
      if (!prevTime) {
        for (var k = prayers.length - 1; k >= 0; k--) {
          if (!prayers[k].displayOnly) {
            prevTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, prayers[k].h, prayers[k].m, 0);
            break;
          }
        }
      }

      if (prevTime) {
        var totalSpan = next.t.getTime() - prevTime.getTime();
        var timePassed = now.getTime() - prevTime.getTime();

        if (totalSpan > 0) {
          var pct = Math.max(0, Math.min(100, (timePassed / totalSpan) * 100));
          pr.style.width = pct.toFixed(1) + '%';
        }
      }
    }"""

old_css = """.lpw-progress {
  width: 100% !important;
  height: 6px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 999px !important;
  overflow: hidden !important;
  margin-bottom: 8px !important;
}
.lpw-progress span {
  display: block !important;
  height: 100% !important;
  width: 0% !important;
  background: linear-gradient(90deg, #d4af37, #f1d08c) !important;
  border-radius: 999px !important;
  transition: width 0.4s ease !important;
}"""

new_css = """.lpw-progress {
  width: 100% !important;
  height: 4px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 999px !important;
  overflow: hidden !important;
  margin-bottom: 8px !important;
}
.lpw-progress span,
#livePrayerProgress {
  display: block !important;
  height: 100% !important;
  background: linear-gradient(90deg, #d4af37, #f1d08c) !important;
  border-radius: 999px !important;
  transition: width 0.4s ease !important;
}"""

if old_js in content:
    content = content.replace(old_js, new_js)
    print("JS replace OK")
else:
    print("JS old text not found")

if old_css in content:
    content = content.replace(old_css, new_css)
    print("CSS replace OK")
else:
    print("CSS old text not found")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

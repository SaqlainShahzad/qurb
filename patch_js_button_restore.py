import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_js = """  window.openNativeSettings = function() {
    try {
      if(window.QurbBridge) {
        window.QurbBridge.postMessage(JSON.stringify({
          action: 'openNativeSettings',
          times: {}
        }));
      } else {
        alert("Native bridge not found!");
      }
    } catch(e) {
      alert("Error: " + e.message);
    }
  };"""

new_js = """  window.openNativeSettings = function() {
    var en = document.documentElement.getAttribute('lang')==='en';
    var tFajr='—', tSun='—', tMakS='—', tMakE='—', tDhuhr='—', tAsr='—', tMaghrib='—', tIsha='—';
    try {
      var t = todayTimes(new Date());
      if(t) {
        tFajr = to12(t.fajr[0], t.fajr[1]);
        tDhuhr = to12(t.dhuhr[0], t.dhuhr[1]);
        tAsr = to12(t.asr[0], t.asr[1]);
        tMaghrib = to12(t.maghrib[0], t.maghrib[1]);
        tIsha = to12(t.isha[0], t.isha[1]);
      }
      var s = exactSpecialTimes(new Date());
      if(s) {
        tSun = to12(s.sunrise.start.getHours(), s.sunrise.start.getMinutes());
        tMakS = to12(s.sunrise.start.getHours(), s.sunrise.start.getMinutes()) + ' / ' + to12(s.sunset.start.getHours(), s.sunset.start.getMinutes());
        tMakE = to12(s.sunrise.end.getHours(), s.sunrise.end.getMinutes()) + ' / ' + to12(s.sunset.end.getHours(), s.sunset.end.getMinutes());
      }
    } catch(e) {
       console.log("Error computing times for native modal: ", e);
    }
    
    try {
      if(window.QurbBridge) {
        window.QurbBridge.postMessage(JSON.stringify({
          action: 'openNativeSettings',
          times: { fajr: tFajr, sunrise: tSun, makruhStart: tMakS, makruhEnd: tMakE, dhuhr: tDhuhr, asr: tAsr, maghrib: tMaghrib, isha: tIsha }
        }));
      }
    } catch(e) {}
  };"""

if old_js in content:
    content = content.replace(old_js, new_js)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Restored openNativeSettings")
else:
    print("Could not find old JS")

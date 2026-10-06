import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the loose binding
content = re.sub(r'var configBtn = document\.getElementById\(\'configNativeBtn\'\);\s*if\(configBtn\) \{.*?\}\);.*?\}', '', content, flags=re.DOTALL)

# Inject it at the start of init()
init_start = "  function init(){"
new_init = """  function init(){
    var configBtn = document.getElementById('configNativeBtn');
    if(configBtn) {
      configBtn.addEventListener('click', function() {
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
        } catch(e) {}
        try {
          if(window.QurbBridge) {
            window.QurbBridge.postMessage(JSON.stringify({ 
              action: 'openNativeSettings', 
              times: { fajr: tFajr, sunrise: tSun, makruhStart: tMakS, makruhEnd: tMakE, dhuhr: tDhuhr, asr: tAsr, maghrib: tMaghrib, isha: tIsha } 
            }));
          }
        } catch(e) {}
      });
    }"""

if init_start in content:
    content = content.replace(init_start, new_init)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected into init() successfully")
else:
    print("init() not found")

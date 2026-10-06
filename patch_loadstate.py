import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_loadState = "function loadState(){var d={enabled:false,lead:0,prayers:{fajr:true,dhuhr:true,asr:true,maghrib:true,isha:true},special:{sunrise:true,makruhStart:true,makruhEnd:true},serverId:'',serverToken:''};try{var x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(x){d.enabled=!!x.enabled;d.lead=inArrayLead(x.lead)?x.lead:0;PRAYER_KEYS.forEach(function(k){d.prayers[k]=x.prayers&&x.prayers[k]!==undefined?!!x.prayers[k]:true;});d.special={sunrise:x.special&&x.special.sunrise!==undefined?!!x.special.sunrise:SPECIAL_DEFAULTS.sunrise,makruhStart:x.special&&x.special.makruhStart!==undefined?!!x.special.makruhStart:(x.special&&x.special.makruh!==undefined?!!x.special.makruh:SPECIAL_DEFAULTS.makruhStart),makruhEnd:x.special&&x.special.makruhEnd!==undefined?!!x.special.makruhEnd:(x.special&&x.special.makruh!==undefined?!!x.special.makruh:SPECIAL_DEFAULTS.makruhEnd)};d.serverId=x.serverId||'';d.serverToken=x.serverToken||'';}}catch(e){}return d;}"

new_loadState = "function loadState(){var d={enabled:false,lead:0,prayers:{fajr:'adhan',dhuhr:'adhan',asr:'adhan',maghrib:'adhan',isha:'adhan'},special:{sunrise:'off',makruhStart:'off',makruhEnd:'off'},dawah:{morning:false,maghrib:false,sleep:false},serverId:'',serverToken:''};try{var x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(x){d.enabled=!!x.enabled;d.lead=inArrayLead(x.lead)?x.lead:0;PRAYER_KEYS.forEach(function(k){var v=x.prayers&&x.prayers[k]!==undefined?x.prayers[k]:'adhan';d.prayers[k]=(v===true)?'adhan':(v===false?'off':v);});var ss=x.special||{};var sr=ss.sunrise!==undefined?ss.sunrise:'off';var m1=ss.makruhStart!==undefined?ss.makruhStart:(ss.makruh!==undefined?ss.makruh:'off');var m2=ss.makruhEnd!==undefined?ss.makruhEnd:(ss.makruh!==undefined?ss.makruh:'off');d.special.sunrise=(sr===true)?'adhan':(sr===false?'off':sr);d.special.makruhStart=(m1===true)?'silent':(m1===false?'off':m1);d.special.makruhEnd=(m2===true)?'silent':(m2===false?'off':m2);var dw=x.dawah||{};d.dawah.morning=!!dw.morning;d.dawah.maghrib=!!dw.maghrib;d.dawah.sleep=!!dw.sleep;d.serverId=x.serverId||'';d.serverToken=x.serverToken||'';}}catch(e){}return d;}"

if old_loadState in content:
    content = content.replace(old_loadState, new_loadState)
    print("loadState patched successfully.")
else:
    print("loadState block not found!")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

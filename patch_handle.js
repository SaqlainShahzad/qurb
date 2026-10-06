const fs = require('fs');
const file = 'assets/web/index.html';
let content = fs.readFileSync(file, 'utf8');

// Fix handleNotificationSettingChange
content = content.replace(
  "var val = (el.tagName.toLowerCase() === 'select') ? el.value : el.checked;",
  "var val = (el.tagName.toLowerCase() === 'select' || el.type === 'range') ? (el.type === 'range' ? parseInt(el.value) : el.value) : el.checked;"
);

// Fix slider HTML
content = content.replace(
  '<input type="range" id="preAdhanSlider" min="0" max="60" step="5" value="15" onchange="updatePreAdhan(this.value)" class="notif-range">',
  '<input type="range" id="preAdhanSlider" data-kind="special" data-key="preAdhanMinutes" min="0" max="60" step="5" value="15" onchange="updatePreAdhan(this.value); window.handleNotificationSettingChange(this)" class="notif-range">'
);

// Fix updatePreAdhan to remove duplicate bridge call
content = content.replace(
  `                function updatePreAdhan(val) {
                  document.getElementById('preAdhanLabel').textContent = val + ' minutes before';
                  if(!window.state) window.state = {};
                  if(!window.state.special) window.state.special = {};
                  window.state.special.preAdhanMinutes = parseInt(val);
                  if(window.__syncNativePrayerNotifications) {
                    window.__syncNativePrayerNotifications(window.state);
                  }
                }`,
  `                function updatePreAdhan(val) {
                  document.getElementById('preAdhanLabel').textContent = val + ' minutes before';
                  if(!window.state) window.state = {};
                  if(!window.state.special) window.state.special = {};
                  window.state.special.preAdhanMinutes = parseInt(val);
                }`
);

// Fix loadState to parse special keys
const originalLoadState = `  function loadState(){var d={enabled:true,lead:0,prayers:{fajr:'adhan',dhuhr:'adhan',asr:'adhan',maghrib:'adhan',isha:'adhan'},special:{sunrise:'off',makruhStart:'off',makruhEnd:'off'},dawah:{morning:false,maghrib:false,sleep:false},serverId:'',serverToken:''};try{var x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(x){d.enabled=!!x.enabled;d.lead=inArrayLead(x.lead)?x.lead:0;PRAYER_KEYS.forEach(function(k){var v=x.prayers&&x.prayers[k]!==undefined?x.prayers[k]:'adhan';d.prayers[k]=(v===true)?'adhan':(v===false?'off':v);});var ss=x.special||{};var sr=ss.sunrise!==undefined?ss.sunrise:'off';var m1=ss.makruhStart!==undefined?ss.makruhStart:(ss.makruh!==undefined?ss.makruh:'off');var m2=ss.makruhEnd!==undefined?ss.makruhEnd:(ss.makruh!==undefined?ss.makruh:'off');d.special.sunrise=(sr===true)?'adhan':(sr===false?'off':sr);d.special.makruhStart=(m1===true)?'silent':(m1===false?'off':m1);d.special.makruhEnd=(m2===true)?'silent':(m2===false?'off':m2);var dw=x.dawah||{};d.dawah.morning=!!dw.morning;d.dawah.maghrib=!!dw.maghrib;d.dawah.sleep=!!dw.sleep;d.serverId=x.serverId||'';d.serverToken=x.serverToken||'';}}catch(e){}return d;}`;
const newLoadState = `  function loadState(){var d={enabled:true,lead:0,prayers:{fajr:'adhan',dhuhr:'adhan',asr:'adhan',maghrib:'adhan',isha:'adhan'},special:{sunrise:'off',makruhStart:'off',makruhEnd:'off',preAdhanMinutes:15,iqamahAlert:false,jummahAlert:true},dawah:{morning:false,maghrib:false,sleep:false},serverId:'',serverToken:''};try{var x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(x){d.enabled=!!x.enabled;d.lead=inArrayLead(x.lead)?x.lead:0;PRAYER_KEYS.forEach(function(k){var v=x.prayers&&x.prayers[k]!==undefined?x.prayers[k]:'adhan';d.prayers[k]=(v===true)?'adhan':(v===false?'off':v);});var ss=x.special||{};var sr=ss.sunrise!==undefined?ss.sunrise:'off';var m1=ss.makruhStart!==undefined?ss.makruhStart:(ss.makruh!==undefined?ss.makruh:'off');var m2=ss.makruhEnd!==undefined?ss.makruhEnd:(ss.makruh!==undefined?ss.makruh:'off');d.special.sunrise=(sr===true)?'adhan':(sr===false?'off':sr);d.special.makruhStart=(m1===true)?'silent':(m1===false?'off':m1);d.special.makruhEnd=(m2===true)?'silent':(m2===false?'off':m2);d.special.preAdhanMinutes=ss.preAdhanMinutes!==undefined?ss.preAdhanMinutes:15;d.special.iqamahAlert=ss.iqamahAlert!==undefined?ss.iqamahAlert:false;d.special.jummahAlert=ss.jummahAlert!==undefined?ss.jummahAlert:true;var dw=x.dawah||{};d.dawah.morning=!!dw.morning;d.dawah.maghrib=!!dw.maghrib;d.dawah.sleep=!!dw.sleep;d.serverId=x.serverId||'';d.serverToken=x.serverToken||'';}}catch(e){}return d;}`;

content = content.replace(originalLoadState, newLoadState);

fs.writeFileSync(file, content);
console.log('Fixed assets/web/index.html');

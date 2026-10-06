// Mock DOM
const dom = {
  els: {
    list: { innerHTML: '', querySelectorAll: () => [] },
    title: {}, sub: {}, masterTitle: {}, masterSub: {}, note: {},
    permission: {}, permissionBtn: {}, master: {}, serverStatus: {}
  },
  document: {
    documentElement: { getAttribute: () => 'en' },
    getElementById: (id) => ({ textContent: '', style: {}, setAttribute: () => {} }),
    querySelector: () => ({ style: {}, setAttribute: () => {} })
  }
};

const window = {};
const isEnglish = () => true;
const PRAYER_KEYS = ['fajr','dhuhr','asr','maghrib','isha'];
const PRAYER_EN = {fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
const PRAYER_UR = {fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
const to12 = (h, m) => '12:00 PM';
const esc = (s) => s;
const icon = (k) => '<svg></svg>';

function todayTimes() { return {fajr:[5,30], dhuhr:[12,30], asr:[15,30], maghrib:[18,30], isha:[20,30]}; }
function exactSpecialTimes() { 
  const d = new Date(); 
  return {sunrise:{start:d, end:d}, sunset:{start:d, end:d}}; 
}

let state = {
  enabled: true,
  prayers: {fajr:'adhan',dhuhr:'adhan',asr:'adhan',maghrib:'adhan',isha:'adhan'},
  special: {sunrise:'beep',makruhStart:'beep',makruhEnd:'beep'},
  dawah: {morning:true, maghrib:true, sleep:true}
};

function permissionText() { return 'text'; }
function permissionClass() { return 'class'; }
function permissionButtonText() { return 'btn'; }

function render() {
  const els = dom.els;
  const document = dom.document;
  if(!els.list)return;
    var en=isEnglish();
    els.title.textContent=en?'Prayer Notifications':'نماز کی اطلاعات';
    els.sub.textContent=en?'Manage prayer, sunrise and Makruh notification and reminder options.':'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
    els.masterTitle.textContent=en?'All Notifications':'تمام notifications';
    els.masterSub.textContent=en?'Master switch for all prayer, sunrise and Makruh notifications.':'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
    els.note.textContent=en?'For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.':'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔ Server push + cron کے بعد منتخب notifications app بند یا phone lock ہونے پر بھی آ سکتی ہیں۔';
    els.permission.textContent=permissionText();
    els.permission.className='notification-status '+permissionClass();
    els.permissionBtn.textContent=permissionButtonText();
    var title=document.getElementById('notifIndividualTitle');
    var sub=document.getElementById('notifIndividualSub');
    if(title)title.textContent=en?'Individual Notifications':'ہر notification الگ On/Off کریں';
    if(sub)sub.textContent=en?'Turn each prayer, sunrise and Makruh alert on or off separately.':'فجر، ظہر، عصر، مغرب، عشاء، طلوعِ شمس، مکروہ شروع اور مکروہ ختم۔';
    els.master.checked=!!state.enabled;
    var panel=document.querySelector('.notification-settings');
    if(panel){panel.style.direction=en?'ltr':'rtl';panel.style.textAlign=en?'left':'right';panel.setAttribute('dir',en?'ltr':'rtl');}

    var times=null, special=null;
    try{times=todayTimes(new Date());}catch(e){times=null;}
    try{special=exactSpecialTimes(new Date());}catch(e){special=null;}
    var rows=[];
    PRAYER_KEYS.forEach(function(k){
      var t=times?times[k]:null;
      var val = state.prayers[k];
      if(val === true) val = 'adhan';
      if(val === false) val = 'off';
      if(!val) val = 'adhan';
      rows.push({kind:'prayer',key:k,name:en?PRAYER_EN[k]:PRAYER_UR[k],sub:en?'Notification when prayer time begins.':'نماز کا وقت داخل ہوتے ہی notification۔',time:t?to12(t[0],t[1]):'—',val:val});
    });
    var sSunrise = state.special.sunrise; if(sSunrise===true) sSunrise='beep'; if(sSunrise===false) sSunrise='off'; if(!sSunrise) sSunrise='beep';
    var sMakruhS = state.special.makruhStart; if(sMakruhS===true) sMakruhS='beep'; if(sMakruhS===false) sMakruhS='off'; if(!sMakruhS) sMakruhS='beep';
    var sMakruhE = state.special.makruhEnd; if(sMakruhE===true) sMakruhE='beep'; if(sMakruhE===false) sMakruhE='off'; if(!sMakruhE) sMakruhE='beep';

    rows.push({kind:'special',key:'sunrise',name:en?'Sunrise': 'طلوعِ شمس',sub:en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes()):'—',val:sSunrise});
    rows.push({kind:'special',key:'makruhStart',name:en?'Makruh Time Start':'مکروہ وقت شروع',sub:en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes())+' / '+to12(special.sunset.start.getHours(),special.sunset.start.getMinutes()):'—',val:sMakruhS});
    rows.push({kind:'special',key:'makruhEnd',name:en?'Makruh Time End':'مکروہ وقت ختم',sub:en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔',time:special?to12(special.sunrise.end.getHours(),special.sunrise.end.getMinutes())+' / '+to12(special.sunset.end.getHours(),special.sunset.end.getMinutes()):'—',val:sMakruhE});

    var dwMorn = state.dawah ? !!state.dawah.morning : false;
    var dwMagh = state.dawah ? !!state.dawah.maghrib : false;
    var dwSleep = state.dawah ? !!state.dawah.sleep : false;

    rows.push({kind:'dawah', key:'morning', name:en?'Morning Motivation':'صبح کی نصیحت', sub:en?'Spiritual reminder at Fajr time.':'نماز فجر کے وقت روحانی یاد دہانی۔', time:times?to12(times.fajr[0],times.fajr[1]):'—', val:dwMorn});
    rows.push({kind:'dawah', key:'maghrib', name:en?'Post-Maghrib Adhkar':'مغرب کے بعد وظائف', sub:en?'Surah and Salawat reminder 15 mins after Maghrib.':'مغرب کے 15 منٹ بعد درود شریف اور مسنون سورتیں۔', time:'+15 mins', val:dwMagh});
    rows.push({kind:'dawah', key:'sleep', name:en?'Sunnah Sleep Reminder':'عشاء کے بعد سنتِ نیند', sub:en?'Sleep reminder 60 mins after Isha.':'عشاء کے ایک گھنٹہ بعد سونے کی سنت کی یاد دہانی۔', time:'+60 mins', val:dwSleep});

    els.list.innerHTML=rows.map(function(r){
      var controlHtml = '';
      if(r.kind === 'dawah') {
         controlHtml = '<label class="notif-switch" aria-label="'+esc(r.name)+'"><input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="'+r.key+'" '+(r.val?'checked':'')+'><span class="notif-slider"></span></label>';
      } else {
         controlHtml = '<select class="notif-select" style="padding:6px;border-radius:6px;background:#ffffff;color:#111111;border:1px solid #ddd;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
           '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
           '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
           '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
           '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
         '</select>';
      }
      return '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
    }).join('');

    console.log("Success! HTML Length:", els.list.innerHTML.length);
}

try {
  render();
} catch(e) {
  console.error(e);
}

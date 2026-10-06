with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We will replace the innerHTML generation with a foolproof version.
import re
match = re.search(r'var rows=\[\];(.*?)els\.list\.innerHTML=rows\.map\(function\(r\)\{(.*?)\}\)\.join\(\'\'\);', content, re.DOTALL)
if match:
    old_body = match.group(0)
    
    new_body = """var rows=[];
    try {
      PRAYER_KEYS.forEach(function(k){
        var t=times?times[k]:null;
        var val = (state && state.prayers) ? state.prayers[k] : 'adhan';
        if(val === true) val = 'adhan';
        if(val === false) val = 'off';
        if(!val) val = 'adhan';
        rows.push({kind:'prayer',key:k,name:en?PRAYER_EN[k]:PRAYER_UR[k],sub:en?'Notification when prayer time begins.':'نماز کا وقت داخل ہوتے ہی notification۔',time:t?to12(t[0],t[1]):'—',val:val});
      });
      
      var sSunrise = (state && state.special) ? state.special.sunrise : 'beep'; if(sSunrise===true) sSunrise='beep'; if(sSunrise===false) sSunrise='off'; if(!sSunrise) sSunrise='beep';
      var sMakruhS = (state && state.special) ? state.special.makruhStart : 'beep'; if(sMakruhS===true) sMakruhS='beep'; if(sMakruhS===false) sMakruhS='off'; if(!sMakruhS) sMakruhS='beep';
      var sMakruhE = (state && state.special) ? state.special.makruhEnd : 'beep'; if(sMakruhE===true) sMakruhE='beep'; if(sMakruhE===false) sMakruhE='off'; if(!sMakruhE) sMakruhE='beep';

      var tSunrise = '—', tMakruhS = '—', tMakruhE = '—';
      if(special && special.sunrise && special.sunset) {
         try { tSunrise = to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes()); } catch(e){}
         try { tMakruhS = to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes())+' / '+to12(special.sunset.start.getHours(),special.sunset.start.getMinutes()); } catch(e){}
         try { tMakruhE = to12(special.sunrise.end.getHours(),special.sunrise.end.getMinutes())+' / '+to12(special.sunset.end.getHours(),special.sunset.end.getMinutes()); } catch(e){}
      }

      rows.push({kind:'special',key:'sunrise',name:en?'Sunrise': 'طلوعِ شمس',sub:en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔',time:tSunrise,val:sSunrise});
      rows.push({kind:'special',key:'makruhStart',name:en?'Makruh Time Start':'مکروہ وقت شروع',sub:en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔',time:tMakruhS,val:sMakruhS});
      rows.push({kind:'special',key:'makruhEnd',name:en?'Makruh Time End':'مکروہ وقت ختم',sub:en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔',time:tMakruhE,val:sMakruhE});

      var dwMorn = (state && state.dawah) ? !!state.dawah.morning : false;
      var dwMagh = (state && state.dawah) ? !!state.dawah.maghrib : false;
      var dwSleep = (state && state.dawah) ? !!state.dawah.sleep : false;

      var tFajr = '—';
      if(times && times.fajr) {
         try { tFajr = to12(times.fajr[0],times.fajr[1]); } catch(e){}
      }

      rows.push({kind:'dawah', key:'morning', name:en?'Morning Motivation':'صبح کی نصیحت', sub:en?'Spiritual reminder at Fajr time.':'نماز فجر کے وقت روحانی یاد دہانی۔', time:tFajr, val:dwMorn});
      rows.push({kind:'dawah', key:'maghrib', name:en?'Post-Maghrib Adhkar':'مغرب کے بعد وظائف', sub:en?'Surah and Salawat reminder 15 mins after Maghrib.':'مغرب کے 15 منٹ بعد درود شریف اور مسنون سورتیں۔', time:'+15 mins', val:dwMagh});
      rows.push({kind:'dawah', key:'sleep', name:en?'Sunnah Sleep Reminder':'عشاء کے بعد سنتِ نیند', sub:en?'Sleep reminder 60 mins after Isha.':'عشاء کے ایک گھنٹہ بعد سونے کی سنت کی یاد دہانی۔', time:'+60 mins', val:dwSleep});

      var finalHtml = '';
      rows.forEach(function(r) {
        try {
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
          finalHtml += '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
        } catch(rowErr) {}
      });
      els.list.innerHTML = finalHtml;
    } catch(err) {
      els.list.innerHTML = '<div style="color:red;padding:10px;">Render Error: ' + err.message + '</div>';
    }"""
    
    content = content.replace(old_body, new_body)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Match failed.")

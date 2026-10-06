import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the entire render() function
start_marker = "  function render(){"
end_marker = "  function testNotification(){"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_render = """  function render(){
    if(!els.list) return;
    try {
      var en = isEnglish();
      if(els.title) els.title.textContent = en ? 'Prayer Notifications' : 'نماز کی اطلاعات';
      if(els.sub) els.sub.textContent = en ? 'Manage prayer, sunrise and Makruh notification and reminder options.' : 'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
      if(els.masterTitle) els.masterTitle.textContent = en ? 'All Notifications' : 'تمام notifications';
      if(els.masterSub) els.masterSub.textContent = en ? 'Master switch for all prayer, sunrise and Makruh notifications.' : 'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
      if(els.note) els.note.textContent = en ? 'For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.' : 'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔ Server push + cron کے بعد منتخب notifications app بند یا phone lock ہونے پر بھی آ سکتی ہیں۔';
      
      if(els.permission) {
          els.permission.textContent = permissionText();
          els.permission.className = 'notification-status ' + permissionClass();
      }
      if(els.permissionBtn) els.permissionBtn.textContent = permissionButtonText();
      
      var title = document.getElementById('notifIndividualTitle');
      var sub = document.getElementById('notifIndividualSub');
      if(title) title.textContent = en ? 'Individual Notifications' : 'ہر notification الگ On/Off کریں';
      if(sub) sub.textContent = en ? 'Turn each prayer, sunrise and Makruh alert on or off separately.' : 'فجر، ظہر، عصر، مغرب، عشاء، طلوعِ شمس، مکروہ شروع اور مکروہ ختم۔';
      
      if(els.master) els.master.checked = !!state.enabled;

      var times = null, special = null;
      try{ times = todayTimes(new Date()); } catch(e){}
      try{ special = exactSpecialTimes(new Date()); } catch(e){}
      
      var rows = [];
      for(var i = 0; i < PRAYER_KEYS.length; i++) {
        var k = PRAYER_KEYS[i];
        var t = times ? times[k] : null;
        var val = (state && state.prayers) ? state.prayers[k] : 'adhan';
        if(val === true) val = 'adhan';
        if(val === false) val = 'off';
        if(!val) val = 'adhan';
        var tStr = t ? to12(t[0], t[1]) : '—';
        rows.push({kind:'prayer', key:k, name:(en?PRAYER_EN[k]:PRAYER_UR[k]), sub:(en?'Notification when prayer time begins.':'نماز کا وقت داخل ہوتے ہی notification۔'), time:tStr, val:val});
      }
      
      var sSunrise = (state && state.special) ? state.special.sunrise : 'beep'; if(sSunrise===true) sSunrise='beep'; if(sSunrise===false) sSunrise='off'; if(!sSunrise) sSunrise='beep';
      var sMakruhS = (state && state.special) ? state.special.makruhStart : 'beep'; if(sMakruhS===true) sMakruhS='beep'; if(sMakruhS===false) sMakruhS='off'; if(!sMakruhS) sMakruhS='beep';
      var sMakruhE = (state && state.special) ? state.special.makruhEnd : 'beep'; if(sMakruhE===true) sMakruhE='beep'; if(sMakruhE===false) sMakruhE='off'; if(!sMakruhE) sMakruhE='beep';

      var tSunrise = '—', tMakruhS = '—', tMakruhE = '—';
      if(special && special.sunrise && special.sunset) {
         try { tSunrise = to12(special.sunrise.start.getHours(), special.sunrise.start.getMinutes()); } catch(e){}
         try { tMakruhS = to12(special.sunrise.start.getHours(), special.sunrise.start.getMinutes()) + ' / ' + to12(special.sunset.start.getHours(), special.sunset.start.getMinutes()); } catch(e){}
         try { tMakruhE = to12(special.sunrise.end.getHours(), special.sunrise.end.getMinutes()) + ' / ' + to12(special.sunset.end.getHours(), special.sunset.end.getMinutes()); } catch(e){}
      }

      rows.push({kind:'special', key:'sunrise', name:(en?'Sunrise':'طلوعِ شمس'), sub:(en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔'), time:tSunrise, val:sSunrise});
      rows.push({kind:'special', key:'makruhStart', name:(en?'Makruh Time Start':'مکروہ وقت شروع'), sub:(en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔'), time:tMakruhS, val:sMakruhS});
      rows.push({kind:'special', key:'makruhEnd', name:(en?'Makruh Time End':'مکروہ وقت ختم'), sub:(en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔'), time:tMakruhE, val:sMakruhE});

      var dwMorn = (state && state.dawah) ? !!state.dawah.morning : false;
      var dwMagh = (state && state.dawah) ? !!state.dawah.maghrib : false;
      var dwSleep = (state && state.dawah) ? !!state.dawah.sleep : false;
      var tFajr = '—';
      if(times && times.fajr) {
         try { tFajr = to12(times.fajr[0], times.fajr[1]); } catch(e){}
      }

      rows.push({kind:'dawah', key:'morning', name:(en?'Morning Motivation':'صبح کی نصیحت'), sub:(en?'Spiritual reminder at Fajr time.':'نماز فجر کے وقت روحانی یاد دہانی۔'), time:tFajr, val:dwMorn});
      rows.push({kind:'dawah', key:'maghrib', name:(en?'Post-Maghrib Adhkar':'مغرب کے بعد وظائف'), sub:(en?'Surah and Salawat reminder 15 mins after Maghrib.':'مغرب کے 15 منٹ بعد درود شریف اور مسنون سورتیں۔'), time:'+15 mins', val:dwMagh});
      rows.push({kind:'dawah', key:'sleep', name:(en?'Sunnah Sleep Reminder':'عشاء کے بعد سنتِ نیند'), sub:(en?'Sleep reminder 60 mins after Isha.':'عشاء کے ایک گھنٹہ بعد سونے کی سنت کی یاد دہانی۔'), time:'+60 mins', val:dwSleep});

      var finalHtml = '';
      var dawahHtml = '';
      
      for(var j = 0; j < rows.length; j++) {
        var r = rows[j];
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
        var rowMarkup = '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
        
        if(r.kind === 'dawah') {
            dawahHtml += rowMarkup;
        } else {
            finalHtml += rowMarkup;
        }
      }
      
      els.list.innerHTML = finalHtml || '<div style="color:red;padding:10px;">Final HTML is empty</div>';
      if(els.dawahList) els.dawahList.innerHTML = dawahHtml || '<div style="color:red;padding:10px;">Dawah HTML is empty</div>';
      
      var inputs = document.querySelectorAll('.notif-toggle, .notif-select');
      for(var x = 0; x < inputs.length; x++) {
        inputs[x].addEventListener('change', function(){
          var key = this.dataset.key;
          var val = (this.tagName.toLowerCase() === 'select') ? this.value : this.checked;
          if(this.dataset.kind === 'prayer') state.prayers[key] = val;
          else if(this.dataset.kind === 'dawah') {
              if(!state.dawah) state.dawah = {morning:false, maghrib:false, sleep:false};
              state.dawah[key] = val;
          }
          else state.special[key] = val;
          saveState();
          if(isNativeBridge()){
            if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(state);
          } else {
            if(state.enabled) syncServer();
          }
        });
      }
      
      if(isNativeBridge()){
        setServerStatus(en ? 'Native notification active.' : 'اینڈرائیڈ نوٹیفیکیشنز فعال ہیں۔', 'ok');
      } else if(state.serverId){
        setServerStatus(en ? 'Server push connected.' : 'Server push connected.', 'ok');
      } else {
        setServerStatus(en ? 'Server push not connected yet.' : 'Server push is not connected yet.', '');
      }
    } catch(err) {
      els.list.innerHTML = '<div style="color:red;font-size:16px;font-weight:bold;padding:20px;background:#fff;border-radius:10px;">CRITICAL RENDER ERROR: ' + err.message + '</div>';
    }
  }
"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_render + content[end_idx:]
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched completely!")
else:
    print("Could not find boundaries")

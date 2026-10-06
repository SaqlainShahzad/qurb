with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "  function render(){"
end_marker = "    function testNotification(){"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_render_code = """  function render(){
    try {
      var en = isEnglish();
      if(els.title) els.title.textContent = en ? 'Prayer Notifications' : 'نماز کی اطلاعات';
      if(els.sub) els.sub.textContent = en ? 'Manage prayer, sunrise and Makruh notification and reminder options.' : 'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
      if(els.masterTitle) els.masterTitle.textContent = en ? 'All Notifications' : 'تمام notifications';
      if(els.masterSub) els.masterSub.textContent = en ? 'Master switch for all prayer, sunrise and Makruh notifications.' : 'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
      if(els.note) els.note.textContent = en ? 'For best results, install the app on your Home Screen and allow notifications.' : 'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔';
      
      if(els.permission) {
          els.permission.textContent = isNativeBridge() ? (en ? 'Native notifications active.' : 'اینڈرائیڈ نوٹیفیکیشنز فعال ہیں۔') : permissionText();
          els.permission.className = 'notification-status ' + (isNativeBridge() ? 'ok' : permissionClass());
      }
      if(els.permissionBtn) els.permissionBtn.textContent = permissionButtonText();
      
      var title = document.getElementById('notifIndividualTitle');
      var sub = document.getElementById('notifIndividualSub');
      if(title) title.textContent = en ? 'Individual Prayer & Event Toggles (نماز کے نوٹیفکیشن)' : 'نماز اور اوقات کے نوٹیفکیشن';
      if(sub) sub.textContent = en ? 'Turn each prayer, sunrise and Makruh alert on or off separately.' : 'فجر، ظہر، عصر، مغرب، عشاء، طلوعِ شمس، مکروہ شروع اور مکروہ ختم۔';
      
      if(els.master) els.master.checked = !!state.enabled;

      // Sync prayer and special selects in static HTML
      var selects = document.querySelectorAll('.notif-select');
      for(var i = 0; i < selects.length; i++) {
        var sel = selects[i];
        var kind = sel.dataset.kind;
        var key = sel.dataset.key;
        var val = 'adhan';
        if(kind === 'prayer' && state.prayers && state.prayers[key] !== undefined) {
          val = state.prayers[key];
        } else if(kind === 'special' && state.special && state.special[key] !== undefined) {
          val = state.special[key];
        }
        if(val === true) val = (kind === 'prayer' ? 'adhan' : 'beep');
        if(val === false) val = 'off';
        if(val) sel.value = val;
      }

      // Sync Da'wah toggles in static HTML
      var toggles = document.querySelectorAll('.notif-toggle');
      for(var j = 0; j < toggles.length; j++) {
        var tog = toggles[j];
        var dKey = tog.dataset.key;
        if(state.dawah && state.dawah[dKey] !== undefined) {
          tog.checked = !!state.dawah[dKey];
        }
      }

      if(isNativeBridge()){
        setServerStatus(en ? 'Native notification active.' : 'اینڈرائیڈ نوٹیفیکیشنز فعال ہیں۔', 'ok');
      }
    } catch(err) {
      console.error("Render sync error:", err);
    }
  }

  function bindNotificationEvents(){
    var inputs = document.querySelectorAll('.notif-toggle, .notif-select');
    for(var x = 0; x < inputs.length; x++) {
      inputs[x].onchange = function(){
        var key = this.dataset.key;
        var kind = this.dataset.kind;
        var val = (this.tagName.toLowerCase() === 'select') ? this.value : this.checked;
        if(kind === 'prayer') {
          if(!state.prayers) state.prayers = {};
          state.prayers[key] = val;
        } else if(kind === 'dawah') {
          if(!state.dawah) state.dawah = {};
          state.dawah[key] = val;
        } else if(kind === 'special') {
          if(!state.special) state.special = {};
          state.special[key] = val;
        }
        saveState();
        sendNotificationBridge('saveNotificationPreferences', { preferences: state });
        sendNotificationBridge('savePreference', { key: key, value: val });
      };
    }
  }
\n"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_render_code + content[end_idx:]
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced render with clean static sync successfully!")
else:
    print("Indices not found:", start_idx, end_idx)

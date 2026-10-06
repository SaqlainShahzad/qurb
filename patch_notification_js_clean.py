import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the notification JS logic from permissionText to init
js_start = "  function permissionText(){"
js_end = "  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();"

new_js = """  function permissionText(){
    if(isNativeBridge()) return 'Notifications are active.';
    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return 'Notifications are not supported in this browser.';
    if(window.Notification.permission==='granted') return 'Notifications are allowed.';
    if(window.Notification.permission==='denied') return 'Notifications are blocked in settings.';
    return 'Notifications are off. Allow to receive reminders.';
  }
  function permissionClass(){
    if(isNativeBridge()) return 'ok';
    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification || window.Notification.permission==='denied') return 'bad';
    if(window.Notification.permission==='granted') return 'ok';
    return 'warn';
  }
  function permissionButtonText(){
    return 'Allow / Grant Permission';
  }
  function enablePush(){
    if(isNativeBridge()){
      state.enabled = true;
      saveState();
      sendNotificationBridge('requestPermissions');
      sendNotificationBridge('saveNotificationPreferences', { preferences: state });
      if(window.__syncNativePrayerNotifications){
        window.__syncNativePrayerNotifications(state);
      }
      bindNotificationEvents();
      render();
      return Promise.resolve(true);
    }
    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return Promise.reject(new Error('Notifications are not supported in this browser.'));
    if(window.Notification.permission==='denied') return Promise.reject(new Error('Allow notifications in your device or browser settings.'));
    var ask = window.Notification.permission==='granted' ? Promise.resolve('granted') : window.Notification.requestPermission();
    return ask.then(function(p){
      if(p!=='granted') throw new Error('Notification permission was not granted.');
      state.enabled=true;
      saveState();
      return subscribeServer();
    });
  }

  function setServerStatus(msg, cls){
    if(!els || !els.serverStatus) return;
    els.serverStatus.textContent = msg || "";
    els.serverStatus.className = "notification-status" + (cls ? " " + cls : "");
  }

  function disablePush(){
    state.enabled=false;
    saveState();
    if(isNativeBridge()){
      sendNotificationBridge('cancelAllNotifications');
      sendNotificationBridge('saveNotificationPreferences', { preferences: state });
    } else {
      syncServer();
    }
  }

  function render(){
    try {
      if(els.title) els.title.textContent = 'Prayer Notifications';
      if(els.sub) els.sub.textContent = 'All prayer notification and reminder options';
      if(els.masterTitle) els.masterTitle.textContent = 'All Notifications';
      if(els.masterSub) els.masterSub.textContent = 'Master switch for all prayer, sunrise, and Makruh notifications';
      if(els.note) els.note.textContent = 'For best results, allow notifications so reminders can arrive on exact times.';
      
      if(els.permission) {
          els.permission.textContent = isNativeBridge() ? 'Notifications are active.' : permissionText();
          els.permission.className = 'notification-status ' + (isNativeBridge() ? 'ok' : permissionClass());
      }
      if(els.permissionBtn) els.permissionBtn.textContent = 'Allow / Grant Permission';
      
      var title = document.getElementById('notifIndividualTitle');
      var sub = document.getElementById('notifIndividualSub');
      if(title) title.textContent = 'Individual Prayer & Event Alerts';
      if(sub) sub.textContent = 'Turn each prayer, sunrise, and Makruh alert on or off separately.';
      
      var dTitle = document.getElementById('notifDawahTitle');
      var dSub = document.getElementById('notifDawahSub');
      if(dTitle) dTitle.textContent = 'Daily Spiritual Reminders';
      if(dSub) dSub.textContent = 'Independent notifications for daily motivation and sunnah practices.';

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
        setServerStatus('Native notifications are active.', 'ok');
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

  function testNotification(){
    console.log("Triggering test notification bridge...");
    if(isNativeBridge()){
      sendNotificationBridge('test_notification', {
        title: 'Qurb - Prayer Alerts & Reminders',
        body: 'Prayer alerts and daily spiritual reminders are working properly!'
      });
      return;
    }
    if(!state.serverId||!state.serverToken){
      enablePush().then(function(){return testNotification();}).catch(function(e){setServerStatus(e.message,'bad');});
      return;
    }
    var testBtn = document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn');
    if(testBtn) testBtn.disabled=true;
    setServerStatus('Sending test notification…');
    api('push-test.php',{id:state.serverId,token:state.serverToken}).then(function(){
      setServerStatus('Test notification sent.','ok');
    }).catch(function(e){
      setServerStatus(e.message,'bad');
    }).finally(function(){
      if(testBtn) testBtn.disabled=false;
    });
  }

  function init(){
    els={
      title:document.getElementById('notifTitle'),
      sub:document.getElementById('notifSubtitle'),
      masterTitle:document.getElementById('notifMasterTitle'),
      masterSub:document.getElementById('notifMasterSub'),
      master:document.getElementById('notifMaster'),
      permission:document.getElementById('notifStatus'),
      permissionBtn:document.getElementById('notifPermissionBtn'),
      list:document.getElementById('notificationList'),
      dawahList:document.getElementById('dawahList'),
      note:document.getElementById('notifNote'),
      testBtn:document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn'),
      serverStatus:document.getElementById('notifServerStatus')
    };

    if(els.master){
      els.master.addEventListener('change',function(){
        if(els.master.checked){
          enablePush().then(render).catch(function(e){
            state.enabled=false;
            saveState();
            bindNotificationEvents();
            render();
            setServerStatus(e.message,'bad');
          });
        } else {
          disablePush();
          bindNotificationEvents();
          render();
        }
      });
    }

    if(els.permissionBtn){
      els.permissionBtn.addEventListener('click',function(){
        enablePush().then(render).catch(function(e){
          setServerStatus(e.message,'bad');
          bindNotificationEvents();
          render();
        });
      });
    }

    var testBtn = document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn');
    if(testBtn){
      testBtn.addEventListener('click', function(e){
        e.preventDefault();
        testNotification();
      });
    }

    var langBtn=document.getElementById('langToggle');
    if(langBtn) langBtn.addEventListener('click',function(){ setTimeout(render,50); });

    bindNotificationEvents();
    render();

    if(isNativeBridge()){
      if(state.enabled && window.__syncNativePrayerNotifications){
        window.__syncNativePrayerNotifications(state);
      }
    } else {
      if(state.enabled && (typeof window !== 'undefined' && window.Notification && window.Notification.permission==='granted') && state.serverId){
        syncServer();
      }
    }
  }

"""

start_pos = content.find(js_start)
end_pos = content.find(js_end)

if start_pos != -1 and end_pos != -1:
    content = content[:start_pos] + new_js + content[end_pos:]
    print("Replaced notification JS with 100% English & robust test trigger")
else:
    print("Could not find JS start/end:", start_pos, end_pos)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

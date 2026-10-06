import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Helper function to send bridge message
bridge_fn = """
  function isNativeBridge(){
    return typeof window !== 'undefined' && (!!window.FlutterNotificationBridge || !!window.QurbBridge);
  }

  function sendNotificationBridge(action, payload){
    var data = Object.assign({ action: action }, payload || {});
    var msg = JSON.stringify(data);
    try {
      if(window.FlutterNotificationBridge && window.FlutterNotificationBridge.postMessage){
        window.FlutterNotificationBridge.postMessage(msg);
      }
    } catch(e) { console.error("FlutterNotificationBridge error:", e); }
    try {
      if(window.QurbBridge && window.QurbBridge.postMessage){
        window.QurbBridge.postMessage(msg);
      }
    } catch(e) { console.error("QurbBridge error:", e); }
  }
  window.sendNotificationBridge = sendNotificationBridge;
"""

# Replace isNativeBridge definition
content = re.sub(r'function isNativeBridge\(\)\{.*?\}', bridge_fn, content, count=1, flags=re.DOTALL)

# Replace testNotification definition
test_notif_fn = """  function testNotification(){
    var en = isEnglish();
    if(isNativeBridge()){
      sendNotificationBridge('testNotification', {
        title: 'Qurb Prayer Times',
        body: en ? 'Prayer notifications are active.' : 'نماز کے اوقات کی نوٹیفیکیشنز فعال ہیں۔'
      });
      return;
    }
    if(!state.serverId||!state.serverToken){
      enablePush().then(function(){return testNotification();}).catch(function(e){setServerStatus(e.message,'bad');});
      return;
    }
    if(els.testBtn) els.testBtn.disabled=true;
    setServerStatus(en?'Sending test notification…':'Test notification بھیجی جا رہی ہے…');
    api('push-test.php',{id:state.serverId,token:state.serverToken}).then(function(){
      setServerStatus(en?'Test notification sent.':'Test notification بھیج دی گئی۔','ok');
    }).catch(function(e){
      setServerStatus(e.message,'bad');
    }).finally(function(){
      if(els.testBtn) els.testBtn.disabled=false;
    });
  }"""

content = re.sub(r'function testNotification\(\)\{.*?finally\s*\(function\(\)\{\s*els\.testBtn\.disabled=false;\s*\}\);\s*\}', test_notif_fn, content, count=1, flags=re.DOTALL)

# Replace enablePush requestPermission part
enable_push_fn = """    if(isNativeBridge()){
      state.enabled=true;
      saveState();
      sendNotificationBridge('requestPermissions');
      sendNotificationBridge('saveNotificationPreferences', { preferences: state });
      render();
      return Promise.resolve(true);
    }"""
content = re.sub(r'if\(isNativeBridge\(\)\)\{\s*state\.enabled=true;\s*saveState\(\);\s*if\(window\.__syncNativePrayerNotifications\).*?return Promise\.resolve\(true\);\s*\}', enable_push_fn, content, count=1, flags=re.DOTALL)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched notification JS successfully.")

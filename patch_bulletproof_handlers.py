with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ensure global bridge functions exist at the top of scripts
global_script = """<script>
// BULLETPROOF GLOBAL NOTIFICATION BRIDGE HANDLERS
window.triggerTestNotification = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  console.log("Global triggerTestNotification executed");
  var payload = JSON.stringify({ action: 'test_notification' });
  try {
    if (window.FlutterNotificationBridge && window.FlutterNotificationBridge.postMessage) {
      window.FlutterNotificationBridge.postMessage(payload);
    }
  } catch(err) { console.error("FlutterNotificationBridge error:", err); }
  try {
    if (window.QurbBridge && window.QurbBridge.postMessage) {
      window.QurbBridge.postMessage(payload);
    }
  } catch(err) { console.error("QurbBridge error:", err); }
};

window.triggerRequestPermissions = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  console.log("Global triggerRequestPermissions executed");
  var payload = JSON.stringify({ action: 'requestPermissions' });
  try {
    if (window.FlutterNotificationBridge && window.FlutterNotificationBridge.postMessage) {
      window.FlutterNotificationBridge.postMessage(payload);
    }
  } catch(err) {}
  try {
    if (window.QurbBridge && window.QurbBridge.postMessage) {
      window.QurbBridge.postMessage(payload);
    }
  } catch(err) {}
};

window.handleNotificationSettingChange = function(el) {
  if (!el) return;
  var key = el.getAttribute('data-key');
  var kind = el.getAttribute('data-kind');
  var val = (el.tagName.toLowerCase() === 'select') ? el.value : el.checked;
  var stored = {};
  try {
    stored = JSON.parse(localStorage.getItem('salah_prayer_notifications_v3') || '{}');
  } catch(e) {}
  if (!stored.prayers) stored.prayers = {};
  if (!stored.special) stored.special = {};
  if (!stored.dawah) stored.dawah = {};
  
  if (kind === 'prayer') stored.prayers[key] = val;
  else if (kind === 'dawah') stored.dawah[key] = val;
  else if (kind === 'special') stored.special[key] = val;
  
  try {
    localStorage.setItem('salah_prayer_notifications_v3', JSON.stringify(stored));
  } catch(e) {}
  
  var msg = JSON.stringify({
    action: 'saveNotificationPreferences',
    preferences: stored
  });
  try {
    if (window.FlutterNotificationBridge && window.FlutterNotificationBridge.postMessage) {
      window.FlutterNotificationBridge.postMessage(msg);
    }
  } catch(e) {}
  try {
    if (window.QurbBridge && window.QurbBridge.postMessage) {
      window.QurbBridge.postMessage(msg);
    }
  } catch(e) {}
};
</script>
"""

if "window.triggerTestNotification = function" not in content:
    content = content.replace("</head>", global_script + "\n</head>")

# 2. Add inline onclick to test button
content = content.replace(
    'id="testNotificationBtn" type="button"',
    'id="testNotificationBtn" type="button" onclick="window.triggerTestNotification(event)"'
)

# 3. Add inline onclick to permission button
content = content.replace(
    'id="notifPermissionBtn" type="button"',
    'id="notifPermissionBtn" type="button" onclick="window.triggerRequestPermissions(event)"'
)

# 4. Add inline onchange to notif-select
content = content.replace(
    'class="notif-select"',
    'class="notif-select" onchange="window.handleNotificationSettingChange(this)"'
)

# 5. Add inline onchange to notif-toggle
content = content.replace(
    'class="notif-toggle"',
    'class="notif-toggle" onchange="window.handleNotificationSettingChange(this)"'
)

# 6. Remove any ?. from line 12052 or elsewhere in index.html
content = content.replace(
    "document.querySelector('#notification-section .test-btn')?.addEventListener",
    "var testBtnSection = document.querySelector('#notification-section .test-btn'); if(testBtnSection) testBtnSection.addEventListener"
)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied bulletproof handlers and removed optional chaining syntax")

import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the event listener to the script block in notification-container
js_logic = """
                document.getElementById('adhkarToggle').addEventListener('change', function(e) {
                   if(!window.state) window.state = {};
                   if(!window.state.dawah) window.state.dawah = {};
                   window.state.dawah.morning = e.target.checked;
                   if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(window.state);
                });

                document.getElementById('testNotificationBtn')?.addEventListener('click', function(e) {
                  e.preventDefault();
                  if (window.FlutterNotificationBridge) {
                    FlutterNotificationBridge.postMessage(JSON.stringify({ action: 'test_notification' }));
                  } else if (window.QurbBridge) {
                    window.QurbBridge.postMessage(JSON.stringify({ action: 'test_notification' }));
                  }
                });
"""

content = content.replace("                document.getElementById('adhkarToggle').addEventListener('change', function(e) {\n                   if(!window.state) window.state = {};\n                   if(!window.state.dawah) window.state.dawah = {};\n                   window.state.dawah.morning = e.target.checked;\n                   if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(window.state);\n                });", js_logic.strip())

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

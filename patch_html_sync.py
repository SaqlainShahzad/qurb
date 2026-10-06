import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_sync = """  window.syncNativeToWeb = function() {
    state = loadState();
    if(state.enabled) {
      syncServer();
    } else {
      disablePush();
    }
  };"""

new_sync = """  window.syncNativeToWeb = function() {
    state = loadState();
    if(state.enabled) {
      if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(state);
    } else {
      disablePush();
    }
  };"""

if old_sync in content:
    content = content.replace(old_sync, new_sync)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed syncNativeToWeb successfully.")
else:
    print("syncNativeToWeb not found")

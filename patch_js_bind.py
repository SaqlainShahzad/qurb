import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_button = 'onclick="openNativeSettings()"'
new_button = 'id="configNativeBtn"'

if old_button in content:
    content = content.replace(old_button, new_button)
    
    js_inject = """
  var configBtn = document.getElementById('configNativeBtn');
  if(configBtn) {
    configBtn.addEventListener('click', function() {
      try {
        if(window.QurbBridge) {
          window.QurbBridge.postMessage(JSON.stringify({ action: 'openNativeSettings', times: {} }));
        } else {
          console.error("No native bridge");
        }
      } catch(e) {}
    });
  }
"""
    content = content.replace("  window.openNativeSettings = function() {", js_inject + "\n  window.openNativeSettings = function() {")
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Bound button using addEventListener.")
else:
    print("Button onclick not found.")

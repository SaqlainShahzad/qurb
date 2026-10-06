with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add id="notification-section" and class="test-btn"
content = content.replace('<div class="notification-settings">', '<div class="notification-settings" id="notification-section">')
content = content.replace('<button class="notification-server-btn" id="testNotificationBtn" type="button">', '<button class="notification-server-btn test-btn" id="testNotificationBtn" type="button">')

# 2. Add exact click listener
old_test_js = """    var testBtn = document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn');
    if(testBtn){
      testBtn.addEventListener('click', function(e){
        e.preventDefault();
        testNotification();
      });
    }"""

new_test_js = """    document.querySelector('#notification-section .test-btn')?.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.FlutterNotificationBridge) {
        FlutterNotificationBridge.postMessage(JSON.stringify({ action: 'test_notification' }));
      }
      if (window.QurbBridge) {
        QurbBridge.postMessage(JSON.stringify({ action: 'test_notification' }));
      }
    });

    var testBtn = document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn');
    if(testBtn){
      testBtn.addEventListener('click', function(e){
        e.preventDefault();
        testNotification();
      });
    }"""

if old_test_js in content:
    content = content.replace(old_test_js, new_test_js)
    print("Replaced test button event listener successfully")
else:
    print("Could not find old_test_js")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_btn = """
                <div class="notif-test-wrapper">
                  <button class="notif-test-btn test-btn" id="testNotificationBtn" type="button" onclick="window.triggerTestNotification(event)">
                    🔔 Test Notification
                  </button>
"""

content = content.replace("""
                <div class="notif-test-wrapper">
                  <button class="notif-test-btn test-btn" type="button">
                    🔔 Test Notification
                  </button>
""".strip('\n'), new_btn.strip('\n'))

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the button container with the full UI containers
old_html = r'<div style="padding: 30px 15px; text-align: center;">.*?Configure Native Notifications.*?</button>.*?</div>'
new_html = """
                  <div class="notification-master">
                    <div class="notification-master-copy">
                      <strong id="notifMasterTitle">تمام نمازوں کی notifications</strong>
                      <span id="notifMasterSub">فعال کرنے کے بعد فجر، ظہر، عصر، مغرب اور عشاء کی یاد دہانی ہوگی۔</span>
                    </div>
                    <label class="notif-switch" aria-label="Enable notifications">
                      <input id="notifMaster" type="checkbox">
                      <span class="notif-slider"></span>
                    </label>
                  </div>
                  
                  <div class="notification-permission">
                    <div class="notification-status warn" id="notifStatus">Notifications بند ہیں۔ اجازت دیں تاکہ reminders موصول ہوں۔</div>
                    <button class="notification-permission-btn" id="notifPermissionBtn" type="button">Allow / Grant Permission</button>
                  </div>

                  <div class="notification-server-actions" style="margin-bottom: 16px;">
                    <button class="notification-server-btn" id="notifTestBtn" type="button" style="width: 100%; padding: 12px; font-weight: bold;">🔔 Test Notification</button>
                  </div>

                  <div class="notification-section-title">
                    <strong id="notifIndividualTitle">Individual Prayer & Event Toggles</strong>
                    <span id="notifIndividualSub">Turn each prayer, sunrise and Makruh alert on or off separately.</span>
                  </div>
                  
                  <div class="notification-list" id="notificationList"></div>

                  <div class="notification-section-title" style="margin-top: 16px;">
                    <strong id="notifDawahTitle">Daily Da'wah & Spiritual Reminders</strong>
                    <span id="notifDawahSub">Independent toggle switches for motivation and sunnah reminders.</span>
                  </div>
                  
                  <div class="notification-list" id="dawahList"></div>
"""

content = re.sub(old_html, new_html, content, flags=re.DOTALL)

# 2. Rewrite the JS logic for `render()` to populate these lists and bind events
js_inject = """
  var configBtn = document.getElementById('configNativeBtn');
"""
content = re.sub(r'var configBtn = document\.getElementById\(\'configNativeBtn\'\);.*?\}\);.*?\}', '', content, flags=re.DOTALL)
content = re.sub(r'window\.openNativeSettings = function\(\) \{.*?\};', '', content, flags=re.DOTALL)

# Add robust render function
# We will just inject it inside the IIFE. Wait, `function render(){` might already exist or not.
# We need to make sure we replace the existing `function render(){` cleanly.

import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to replace the inside of <div class="notification-settings">
pattern = r'(<div class="notification-settings">).*?(</div>\s*</div>\s*</div>\s*</section>)'

new_html = r"""\1
                <div class="notification-hero">
                  <div class="notification-hero-top">
                    <div class="notification-bell" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg></div>
                    <div><h2 class="notification-title" id="notifTitle">Prayer Notifications</h2><p class="notification-subtitle" id="notifSubtitle">Manage prayer, sunrise and Makruh notification and reminder options.</p></div>
                  </div>
                  
                  <div class="notification-master">
                    <div class="notification-master-copy">
                      <strong id="notifMasterTitle">All Notifications</strong>
                      <span id="notifMasterSub">Master switch for all prayer, sunrise and Makruh notifications.</span>
                    </div>
                    <label class="notif-switch" aria-label="Enable notifications">
                      <input id="notifMaster" type="checkbox">
                      <span class="notif-slider"></span>
                    </label>
                  </div>

                  <div class="notification-permission" style="margin-top: 10px;">
                    <div class="notification-status warn" id="notifStatus">Notifications are disabled. Allow to receive reminders.</div>
                    <button class="notification-permission-btn" id="notifPermissionBtn" type="button">Allow / Grant Permission</button>
                  </div>

                  <div class="notification-server-actions" style="margin-bottom: 16px; margin-top: 10px;">
                    <button class="notification-server-btn" id="notifTestBtn" type="button" style="width: 100%; padding: 12px; font-weight: bold; background: #D48A56; color: white; border: none; border-radius: 8px; cursor: pointer;">🔔 Test Notification</button>
                  </div>

                  <div class="notification-section-title" style="margin-top: 20px;">
                    <strong id="notifIndividualTitle">Individual Prayer & Event Toggles</strong>
                    <span id="notifIndividualSub">Turn each prayer, sunrise and Makruh alert on or off separately.</span>
                  </div>
                  <div class="notification-list" id="notificationList"></div>

                  <div class="notification-section-title" style="margin-top: 24px;">
                    <strong id="notifDawahTitle">Daily Da'wah & Spiritual Reminders</strong>
                    <span id="notifDawahSub">Independent toggle switches for motivation and sunnah reminders.</span>
                  </div>
                  <div class="notification-list" id="dawahList"></div>
                  
                </div>
\2"""

if re.search(pattern, content, flags=re.DOTALL):
    content = re.sub(pattern, new_html, content, flags=re.DOTALL)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Pattern not found")

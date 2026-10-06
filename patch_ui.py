import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_html = """
              <div class="notification-settings" id="notification-container" data-theme="dark">
                <!-- Top Header & Theme Mode -->
                <div class="notif-header">
                  <h2 class="notif-title" data-i18n="notifSettingsTitle">Notification Settings</h2>
                  <div class="theme-segmented-control">
                    <button class="theme-btn" id="lightThemeBtn" type="button" onclick="setNotifTheme('light')">Light Mode</button>
                    <button class="theme-btn active" id="darkThemeBtn" type="button" onclick="setNotifTheme('dark')">Dark Mode</button>
                  </div>
                </div>
                
                <!-- Master Control Card -->
                <div class="notif-card master-card">
                  <div class="notif-card-text">
                    <strong data-i18n="notifMasterTitle">Master Prayer Alerts</strong>
                    <span data-i18n="notifMasterSub">Toggle all Adhan and prayer reminders.</span>
                  </div>
                  <label class="notif-switch">
                    <input id="notifMaster" type="checkbox" onchange="window.handleNotificationSettingChange(this)" checked>
                    <span class="notif-slider"></span>
                  </label>
                </div>

                <!-- Individual Prayer Notifications -->
                <div class="notif-section-title" data-i18n="notifIndivTitle">Individual Prayer Notifications</div>
                <div class="notif-card indiv-card">
                  
                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">☾</span><span class="notif-name" data-i18n="fajr">Fajr</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="fajr" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="fajr" onchange="window.handleNotificationSettingChange(this)">
                        <option value="adhan">Full Adhan</option><option value="takbeer">Soft Takbeer</option><option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">☼</span><span class="notif-name" data-i18n="dhuhr">Dhuhr</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="dhuhr" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="dhuhr" onchange="window.handleNotificationSettingChange(this)">
                        <option value="adhan">Full Adhan</option><option value="takbeer">Soft Takbeer</option><option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">☼</span><span class="notif-name" data-i18n="asr">Asr</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="asr" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="asr" onchange="window.handleNotificationSettingChange(this)">
                        <option value="adhan">Full Adhan</option><option value="takbeer">Soft Takbeer</option><option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">☾</span><span class="notif-name" data-i18n="maghrib">Maghrib</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="maghrib" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="maghrib" onchange="window.handleNotificationSettingChange(this)">
                        <option value="adhan">Full Adhan</option><option value="takbeer">Soft Takbeer</option><option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">☾</span><span class="notif-name" data-i18n="isha">Isha</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="isha" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="isha" onchange="window.handleNotificationSettingChange(this)">
                        <option value="adhan">Full Adhan</option><option value="takbeer">Soft Takbeer</option><option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-left">
                      <span class="notif-icon">🌅</span><span class="notif-name" data-i18n="sunrise">Sunrise</span>
                    </div>
                    <div class="notif-row-right">
                      <label class="notif-switch small"><input type="checkbox" class="indiv-toggle" data-key="sunrise" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                      <select class="notif-select" data-key="sunrise" onchange="window.handleNotificationSettingChange(this)">
                        <option value="beep">Simple Beep</option><option value="vibrate">Vibration Only</option><option value="mute">Mute</option>
                      </select>
                    </div>
                  </div>

                </div>

                <!-- Additional Alerts -->
                <div class="notif-section-title" data-i18n="notifAdditionalTitle">Additional Alerts</div>
                <div class="notif-card additional-card">
                  
                  <div class="notif-slider-row">
                    <div class="notif-row-text">
                      <strong data-i18n="preAdhan">Pre-Adhan Reminder</strong>
                      <span id="preAdhanLabel">15 minutes before</span>
                    </div>
                    <input type="range" id="preAdhanSlider" min="0" max="60" step="5" value="15" onchange="updatePreAdhan(this.value)" class="notif-range">
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-text">
                      <strong data-i18n="iqamahAlert">Iqamah Alert</strong>
                      <span data-i18n="iqamahAlertSub">Before/after prayer</span>
                    </div>
                    <label class="notif-switch"><input type="checkbox" id="iqamahToggle" data-kind="special" data-key="iqamahAlert" onchange="window.handleNotificationSettingChange(this)"><span class="notif-slider"></span></label>
                  </div>

                  <div class="notif-row">
                    <div class="notif-row-text">
                      <strong data-i18n="jummahAlert">Friday Prayer Special Notification</strong>
                      <span data-i18n="jummahAlertSub">Custom options notifications</span>
                    </div>
                    <label class="notif-switch"><input type="checkbox" id="jummahToggle" data-kind="special" data-key="jummahAlert" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                  </div>
                  
                  <div class="notif-row">
                    <div class="notif-row-text">
                      <strong data-i18n="dailySpiritual">Daily Spiritual Reminder</strong>
                      <span data-i18n="dailySpiritualSub">Morning & Evening Adhkar</span>
                    </div>
                    <label class="notif-switch"><input type="checkbox" id="adhkarToggle" data-kind="dawah" data-key="morning" onchange="window.handleNotificationSettingChange(this)" checked><span class="notif-slider"></span></label>
                  </div>

                </div>
                
                <div class="notif-test-wrapper">
                  <button class="notif-test-btn test-btn" type="button">
                    🔔 Test Notification
                  </button>
                  <button class="notif-test-btn" type="button" onclick="window.triggerRequestPermissions(event)">
                    ⚙️ Grant Permissions
                  </button>
                </div>
              </div>

              <script>
                function setNotifTheme(mode) {
                  var container = document.getElementById('notification-container');
                  var darkBtn = document.getElementById('darkThemeBtn');
                  var lightBtn = document.getElementById('lightThemeBtn');
                  if(mode === 'light') {
                    container.setAttribute('data-theme', 'light');
                    lightBtn.classList.add('active');
                    darkBtn.classList.remove('active');
                  } else {
                    container.setAttribute('data-theme', 'dark');
                    darkBtn.classList.add('active');
                    lightBtn.classList.remove('active');
                  }
                }

                function updatePreAdhan(val) {
                  document.getElementById('preAdhanLabel').textContent = val + ' minutes before';
                  if(!window.state) window.state = {};
                  if(!window.state.special) window.state.special = {};
                  window.state.special.preAdhanMinutes = parseInt(val);
                  if(window.__syncNativePrayerNotifications) {
                    window.__syncNativePrayerNotifications(window.state);
                  }
                }
              </script>
"""

# Replace HTML
html_pattern = re.compile(
    r'<div class="notification-settings" id="notification-container">.*?(?=<!-- Update App — always last -->)',
    re.DOTALL
)

if html_pattern.search(content):
    content = html_pattern.sub(new_html.strip() + '\n            </div>\n          </div>\n        </section>\n        ', content)
    print("Replaced HTML.")
else:
    print("Failed to replace HTML")


with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

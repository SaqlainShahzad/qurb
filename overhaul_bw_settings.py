import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. REPLACE CSS FOR NOTIFICATION SETTINGS (lines ~1548 to 1715)
css_start = "/* ================= PRAYER NOTIFICATION SETTINGS ================= */"
css_end = "/* ================= APP UPDATE CARD — SETTINGS ONLY ================= */"

new_css = """/* ================= PRAYER NOTIFICATION SETTINGS (MINIMALIST B&W) ================= */
.notification-settings{width:100%;max-width:100%;margin:0;padding:10px 0 calc(110px + env(safe-area-inset-bottom));direction:ltr !important;text-align:left !important;min-width:0;overflow-x:hidden}
.notification-hero{position:relative;width:100%;max-width:100%;min-width:0;overflow:hidden;border:1px solid #27272A !important;border-radius:20px !important;padding:18px !important;background:#121212 !important;box-shadow:0 10px 30px rgba(0,0,0,0.5) !important}
.notification-hero:before{display:none !important}
.notification-hero-top{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}
.notification-hero-top>div:first-child{min-width:0;flex:1}
.notification-bell{width:44px;height:44px;flex:0 0 44px;border-radius:12px;display:grid;place-items:center;background:#1E1E1E !important;color:#FFFFFF !important;border:1px solid #2E2E32 !important;box-shadow:none !important}
.notification-bell svg{width:22px;height:22px}
.notification-title{margin:0;font-size:18px;font-weight:700;color:#FFFFFF !important;overflow-wrap:anywhere}
.notification-subtitle{margin:4px 0 0;color:#A1A1AA !important;font-size:12px;line-height:1.5}
.notification-master{position:relative;margin-top:16px;padding:14px 16px;border-radius:14px;background:#18181B !important;border:1px solid #27272A !important;display:flex;align-items:center;justify-content:space-between;gap:12px}
.notification-master-copy{min-width:0;flex:1}
.notification-master-copy strong{display:block;color:#FFFFFF !important;font-size:14px;font-weight:600;overflow-wrap:anywhere}
.notification-master-copy span{display:block;color:#A1A1AA !important;font-size:12px;margin-top:2px;line-height:1.4;overflow-wrap:anywhere}
.notif-switch{position:relative;width:50px;height:28px;flex:0 0 50px}
.notif-switch input{opacity:0;width:0;height:0}
.notif-slider{position:absolute;inset:0;border-radius:999px;background:#27272A !important;border:1px solid #3F3F46 !important;cursor:pointer;transition:.2s ease}
.notif-slider:before{content:"";position:absolute;width:20px;height:20px;top:3px;left:3px !important;right:auto !important;border-radius:50%;background:#A1A1AA !important;box-shadow:0 1px 4px rgba(0,0,0,0.4);transition:.2s ease}
.notif-switch input:checked + .notif-slider{background:#FFFFFF !important;border-color:#FFFFFF !important}
.notif-switch input:checked + .notif-slider:before{background:#121212 !important;transform:translateX(22px) !important}
.notification-permission{margin-top:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:12px;background:#18181B !important;border:1px solid #27272A !important;min-width:0}
.notification-status{font-size:12px;color:#A1A1AA !important;line-height:1.5;min-width:0;overflow-wrap:anywhere}
.notification-status.ok{color:#4ADE80 !important;font-weight:500}
.notification-status.warn{color:#FBBF24 !important}
.notification-status.bad{color:#F87171 !important}
.notification-permission-btn{border:1px solid #3F3F46 !important;border-radius:8px !important;padding:8px 14px !important;font-weight:600 !important;font-size:12px !important;cursor:pointer;background:#27272A !important;color:#FFFFFF !important;white-space:nowrap;transition:.15s ease}
.notification-permission-btn:active{transform:scale(0.97)}
.notification-server-actions{display:flex;flex-direction:column;gap:6px;margin-top:14px}
.notification-server-btn{border:none !important;background:#FFFFFF !important;color:#000000 !important;border-radius:10px !important;padding:13px 16px !important;font-weight:700 !important;font-size:14px !important;cursor:pointer;width:100% !important;box-shadow:0 4px 14px rgba(0,0,0,0.4) !important;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s ease,opacity .15s ease}
.notification-server-btn:active{transform:scale(0.98);opacity:0.9}
.notification-btn-sub{display:block;font-size:11px;color:#A1A1AA;text-align:center;margin-top:4px}
.notification-section-title{margin-top:22px;margin-bottom:8px;padding:0 2px}
.notification-section-title strong{display:block;color:#FFFFFF !important;font-size:14px;font-weight:700}
.notification-section-title span{display:block;margin-top:2px;color:#A1A1AA !important;font-size:12px;line-height:1.4}
.notification-list{margin-top:8px;display:grid;gap:8px}
.notification-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:12px;background:#18181B !important;border:1px solid #27272A !important;box-shadow:0 2px 8px rgba(0,0,0,0.2)}
.notification-row-main{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.notification-row-name{color:#FFFFFF !important;font-weight:600;font-size:14px}
.notification-row-time{color:#A1A1AA !important;font-size:11px;margin-top:2px;line-height:1.4}
.notif-select{background:#27272A !important;color:#FFFFFF !important;border:1px solid #3F3F46 !important;border-radius:8px !important;padding:7px 12px !important;font-size:12px;font-weight:500;outline:none;cursor:pointer;transition:border-color .15s ease}
.notif-select:focus{border-color:#FFFFFF !important}
@media(max-width:560px){#tab-settings .notification-settings{padding:6px 6px calc(100px + env(safe-area-inset-bottom))}.notification-hero{padding:15px;border-radius:16px}.notification-permission{flex-direction:column;align-items:stretch;gap:8px}.notification-permission-btn{width:100%;min-height:38px}}

"""

c_start = content.find(css_start)
c_end = content.find(css_end)
if c_start != -1 and c_end != -1:
    content = content[:c_start] + new_css + content[c_end:]
    print("Replaced notification CSS successfully")
else:
    print("Error finding CSS markers:", c_start, c_end)

# Also clean up the bottom force LTR CSS overrides if they had brown colors
pattern_force_ltr = r'/\* ================= NOTIFICATION SETTINGS — FORCE LTR ================= \*/.*?/\* ===== HERO FULL SCREEN'
replacement_force_ltr = """/* ================= NOTIFICATION SETTINGS — FORCE LTR ================= */
#tab-settings .notification-settings,
#tab-settings .notification-settings *{
  direction:ltr !important;
  text-align:left !important;
}

/* ===== HERO FULL SCREEN"""
content = re.sub(pattern_force_ltr, replacement_force_ltr, content, flags=re.DOTALL)

# 2. REPLACE HTML FOR NOTIFICATION PANEL
html_pattern = r'(<div class="notification-settings">).*?(</div>\s*</div>\s*</div>\s*</section>)'

new_html = r"""\1
                <div class="notification-hero">
                  <div class="notification-hero-top">
                    <div>
                      <h2 class="notification-title" id="notifTitle">Prayer Notifications</h2>
                      <p class="notification-subtitle" id="notifSubtitle">All prayer notification and reminder options</p>
                    </div>
                    <div class="notification-bell" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                        <path d="M10 21h4"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Master Switch -->
                  <div class="notification-master">
                    <div class="notification-master-copy">
                      <strong id="notifMasterTitle">All Notifications</strong>
                      <span id="notifMasterSub">Master switch for all prayer, sunrise, and Makruh notifications</span>
                    </div>
                    <label class="notif-switch" aria-label="All Notifications">
                      <input id="notifMaster" type="checkbox" checked>
                      <span class="notif-slider"></span>
                    </label>
                  </div>

                  <!-- Permission Status -->
                  <div class="notification-permission">
                    <div class="notification-status ok" id="notifStatus">Notifications are active.</div>
                    <button class="notification-permission-btn" id="notifPermissionBtn" type="button">Allow / Grant Permission</button>
                  </div>

                  <!-- Test Notification -->
                  <div class="notification-server-actions">
                    <button class="notification-server-btn" id="testNotificationBtn" type="button">
                      <span>🔔</span>
                      <span>Test Notification</span>
                    </button>
                    <span class="notification-btn-sub">Instantly test notification sound and banner</span>
                  </div>

                  <!-- Section 1: Individual Prayer & Event Alerts -->
                  <div class="notification-section-title">
                    <strong id="notifIndividualTitle">Individual Prayer & Event Alerts</strong>
                    <span id="notifIndividualSub">Turn each prayer, sunrise, and Makruh alert on or off separately.</span>
                  </div>
                  
                  <div class="notification-list" id="notificationList">
                    <!-- 1. Fajr -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Fajr</div>
                          <div class="notification-row-time">Notification when Fajr time begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="fajr">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 2. Sunrise -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Sunrise</div>
                          <div class="notification-row-time">Notification at sunrise</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="sunrise">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 3. Makruh Start -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Makruh Start</div>
                          <div class="notification-row-time">Morning and sunset Makruh begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="makruhStart">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 4. Makruh End -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Makruh End</div>
                          <div class="notification-row-time">Morning and sunset Makruh ends</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="makruhEnd">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 5. Dhuhr -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Dhuhr</div>
                          <div class="notification-row-time">Notification when Dhuhr time begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="dhuhr">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 6. Asr -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Asr</div>
                          <div class="notification-row-time">Notification when Asr time begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="asr">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 7. Maghrib -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Maghrib</div>
                          <div class="notification-row-time">Notification when Maghrib time begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="maghrib">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 8. Isha -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Isha</div>
                          <div class="notification-row-time">Notification when Isha time begins</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="isha">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Daily Spiritual Reminders -->
                  <div class="notification-section-title">
                    <strong id="notifDawahTitle">Daily Spiritual Reminders</strong>
                    <span id="notifDawahSub">Independent notifications for daily motivation and sunnah practices.</span>
                  </div>
                  
                  <div class="notification-list" id="dawahList">
                    <!-- Morning Motivation -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Morning Motivation (05:30 AM)</div>
                          <div class="notification-row-time">Daily spiritual reminder at Fajr time</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <label class="notif-switch" aria-label="Morning Motivation">
                          <input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="morning">
                          <span class="notif-slider"></span>
                        </label>
                      </div>
                    </div>

                    <!-- Post-Maghrib Surahs -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Post-Maghrib Surahs (15 min after Maghrib)</div>
                          <div class="notification-row-time">Surah As-Sajdah, Al-Waqi'ah & Al-Mulk reminder</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <label class="notif-switch" aria-label="Post-Maghrib Surahs">
                          <input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="maghrib">
                          <span class="notif-slider"></span>
                        </label>
                      </div>
                    </div>

                    <!-- Sunnah Sleep Reminder -->
                    <div class="notification-row">
                      <div class="notification-row-main">
                        <div>
                          <div class="notification-row-name">Sunnah Sleep Reminder (60 min after Isha)</div>
                          <div class="notification-row-time">Sunnah of early sleep and nightly adhkar</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <label class="notif-switch" aria-label="Sunnah Sleep Reminder">
                          <input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="sleep">
                          <span class="notif-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                </div>
\2"""

if re.search(html_pattern, content, flags=re.DOTALL):
    content = re.sub(html_pattern, new_html, content, flags=re.DOTALL)
    print("Replaced notification HTML successfully")
else:
    print("Error finding notification HTML pattern")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

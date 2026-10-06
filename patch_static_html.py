import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the notification settings container with rich static HTML
pattern = r'(<div class="notification-settings">).*?(</div>\s*</div>\s*</div>\s*</section>)'

static_html = r"""\1
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
                      <input id="notifMaster" type="checkbox" checked>
                      <span class="notif-slider"></span>
                    </label>
                  </div>

                  <div class="notification-permission" style="margin-top: 10px;">
                    <div class="notification-status ok" id="notifStatus">Native notifications are active.</div>
                    <button class="notification-permission-btn" id="notifPermissionBtn" type="button">Allow / Grant Permission</button>
                  </div>

                  <div class="notification-server-actions" style="margin-bottom: 16px; margin-top: 10px;">
                    <button class="notification-server-btn" id="notifTestBtn" type="button" style="width: 100%; padding: 13px; font-weight: bold; background: #D4AF37; color: #000000; border: none; border-radius: 9px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; gap: 8px;">
                      <span>🔔</span>
                      <span>Test Notification (ٹیسٹ کریں)</span>
                    </button>
                  </div>

                  <div class="notification-section-title" style="margin-top: 20px;">
                    <strong id="notifIndividualTitle">Individual Prayer & Event Toggles (نماز کے نوٹیفکیشن)</strong>
                    <span id="notifIndividualSub">Turn each prayer, sunrise and Makruh alert on or off separately.</span>
                  </div>
                  
                  <div class="notification-list" id="notificationList">
                    <!-- 1. Fajr -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Fajr (فجر)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification when prayer time begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="fajr" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 2. Sunrise -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Sunrise (طلوعِ آفتاب)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification at sunrise.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="sunrise" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 3. Makruh Start -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Makruh Start (مکروہ وقت شروع)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Morning and sunset Makruh begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="makruhStart" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 4. Makruh End -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Makruh End (مکروہ وقت ختم)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Morning and sunset Makruh ends.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="special" data-key="makruhEnd" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan">Full Adhan</option>
                          <option value="beep" selected>Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 5. Dhuhr -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Dhuhr (ظہر)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification when prayer time begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="dhuhr" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 6. Asr -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Asr (عصر)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification when prayer time begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="asr" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 7. Maghrib -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Maghrib (مغرب)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification when prayer time begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="maghrib" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>

                    <!-- 8. Isha -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Isha (عشاء)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Notification when prayer time begins.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <select class="notif-select" data-kind="prayer" data-key="isha" style="background: #2C1810; color: #ffffff; border: 1px solid rgba(212,175,55,0.5); border-radius: 8px; padding: 6px 10px; font-size: 12px; outline: none; cursor: pointer;">
                          <option value="adhan" selected>Full Adhan</option>
                          <option value="beep">Beep / Tone</option>
                          <option value="silent">Silent</option>
                          <option value="off">Off</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="notification-section-title" style="margin-top: 24px;">
                    <strong id="notifDawahTitle">Daily Da'wah & Spiritual Reminders (دعوتی پیغامات)</strong>
                    <span id="notifDawahSub">Independent toggle switches for motivation and sunnah reminders.</span>
                  </div>
                  
                  <div class="notification-list" id="dawahList">
                    <!-- Morning Motivation -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Morning Motivation (صبح کا آغاز / 05:30 AM)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Daily spiritual reminder at Fajr time.</div>
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
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Post-Maghrib Surahs (مغرب + 15 min)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Surah and Salawat reminder 15 mins after Maghrib.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <label class="notif-switch" aria-label="Post-Maghrib Surahs">
                          <input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="maghrib">
                          <span class="notif-slider"></span>
                        </label>
                      </div>
                    </div>

                    <!-- Sunnah Early Sleep -->
                    <div class="notification-row" style="background: rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                      <div class="notification-row-main" style="display: flex; align-items: center; gap: 10px;">
                        <div>
                          <div class="notification-row-name" style="color: #ffffff; font-weight: bold; font-size: 14px;">Sunnah Sleep Reminder (عشاء کے بعد سنتِ نیند)</div>
                          <div class="notification-row-time" style="color: rgba(255,255,255,0.6); font-size: 11px; margin-top: 2px;">Sleep reminder 60 mins after Isha.</div>
                        </div>
                      </div>
                      <div class="notif-control">
                        <label class="notif-switch" aria-label="Sunnah Early Sleep">
                          <input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="sleep">
                          <span class="notif-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                </div>
\2"""

if re.search(pattern, content, flags=re.DOTALL):
    content = re.sub(pattern, static_html, content, flags=re.DOTALL)
    print("Injected static HTML for notification settings successfully!")
else:
    print("Error: Could not match notification-settings container")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

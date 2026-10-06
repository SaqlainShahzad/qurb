import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inner contents of .notification-settings with the Native Launch Button
# But we must keep the surrounding div so the accordion works.

old_html = """                  <div class="notification-master">
                    <div class="notification-master-copy"><strong id="notifMasterTitle">تمام نمازوں کی notifications</strong><span id="notifMasterSub">فعال کرنے کے بعد فجر، ظہر، عصر، مغرب اور عشاء کی یاد دہانی ہوگی۔</span></div>
                    <label class="notif-switch" aria-label="Enable prayer notifications"><input id="notifMaster" type="checkbox"><span class="notif-slider"></span></label>
                  </div>
                  <div class="notification-permission">
                    <div class="notification-status warn" id="notifStatus">Notifications بند ہیں۔ اجازت دیں تاکہ reminders موصول ہوں۔</div>
                    <button class="notification-permission-btn" id="notifPermissionBtn" type="button">Allow Notifications</button>
                  </div>
                  <div class="notification-section-title">
                    <strong id="notifIndividualTitle">Individual Notifications</strong>
                    <span id="notifIndividualSub">Turn each prayer, sunrise and Makruh alert on or off separately.</span>
                  </div>
                  <div class="notification-list" id="notificationList"></div>
                  <div class="notification-server-actions"><button class="notification-server-btn" id="notifTestBtn" type="button">🔔 Test Notification</button><div class="notification-server-status" id="notifServerStatus">Server push is not connected yet.</div></div>
                  <div class="notification-note" id="notifNote">For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.</div>"""

new_html = """                  <div style="padding: 30px 15px; text-align: center;">
                    <button type="button" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: #fff; padding: 16px 20px; width: 100%; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" onclick="openNativeSettings()">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      Configure Native Notifications
                    </button>
                    <div style="margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5;">
                      Opens the advanced device notification controller.<br>All preferences are securely saved natively on your device.
                    </div>
                  </div>"""

if old_html in content:
    content = content.replace(old_html, new_html)
    print("Replaced HTML successfully")
else:
    print("Old HTML not found. Trying regex.")
    match = re.search(r'<div class="notification-master">.*?id="notifNote".*?</div>', content, re.DOTALL)
    if match:
        content = content.replace(match.group(0), new_html)
        print("Replaced via regex")

js_inject = """
  window.openNativeSettings = function() {
    var en = isEnglish();
    var tFajr='—', tSun='—', tMakS='—', tMakE='—', tDhuhr='—', tAsr='—', tMaghrib='—', tIsha='—';
    try {
      var t = todayTimes(new Date());
      if(t) {
        tFajr = to12(t.fajr[0], t.fajr[1]);
        tDhuhr = to12(t.dhuhr[0], t.dhuhr[1]);
        tAsr = to12(t.asr[0], t.asr[1]);
        tMaghrib = to12(t.maghrib[0], t.maghrib[1]);
        tIsha = to12(t.isha[0], t.isha[1]);
      }
      var s = exactSpecialTimes(new Date());
      if(s) {
        tSun = to12(s.sunrise.start.getHours(), s.sunrise.start.getMinutes());
        tMakS = to12(s.sunrise.start.getHours(), s.sunrise.start.getMinutes()) + ' / ' + to12(s.sunset.start.getHours(), s.sunset.start.getMinutes());
        tMakE = to12(s.sunrise.end.getHours(), s.sunrise.end.getMinutes()) + ' / ' + to12(s.sunset.end.getHours(), s.sunset.end.getMinutes());
      }
    } catch(e) {}
    
    if(window.QurbBridge) {
      window.QurbBridge.postMessage(JSON.stringify({
        action: 'openNativeSettings',
        times: { fajr: tFajr, sunrise: tSun, makruhStart: tMakS, makruhEnd: tMakE, dhuhr: tDhuhr, asr: tAsr, maghrib: tMaghrib, isha: tIsha }
      }));
    }
  };

  window.syncNativeToWeb = function() {
    state = loadState();
    if(state.enabled) {
      syncServer();
    } else {
      disablePush();
    }
  };
"""

content = content.replace("function render(){", js_inject + "\n  function render(){")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)


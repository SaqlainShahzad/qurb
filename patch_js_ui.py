import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace missing data-kind attributes
content = content.replace('data-key="fajr"', 'data-kind="prayer" data-key="fajr"')
content = content.replace('data-key="dhuhr"', 'data-kind="prayer" data-key="dhuhr"')
content = content.replace('data-key="asr"', 'data-kind="prayer" data-key="asr"')
content = content.replace('data-key="maghrib"', 'data-kind="prayer" data-key="maghrib"')
content = content.replace('data-key="isha"', 'data-kind="prayer" data-key="isha"')
content = content.replace('data-key="sunrise"', 'data-kind="special" data-key="sunrise"')

# Add JS logic for the master toggle and others to the script at the bottom of notification-container
js_logic = """
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

                document.getElementById('notifMaster').addEventListener('change', function(e) {
                   var isChecked = e.target.checked;
                   var toggles = document.querySelectorAll('.indiv-toggle');
                   toggles.forEach(function(t) {
                      t.checked = isChecked;
                      window.handleNotificationSettingChange(t);
                   });
                });
                
                document.getElementById('iqamahToggle').addEventListener('change', function(e) {
                   if(!window.state) window.state = {};
                   if(!window.state.special) window.state.special = {};
                   window.state.special.iqamahAlert = e.target.checked;
                   if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(window.state);
                });
                
                document.getElementById('jummahToggle').addEventListener('change', function(e) {
                   if(!window.state) window.state = {};
                   if(!window.state.special) window.state.special = {};
                   window.state.special.jummahAlert = e.target.checked;
                   if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(window.state);
                });
                
                document.getElementById('adhkarToggle').addEventListener('change', function(e) {
                   if(!window.state) window.state = {};
                   if(!window.state.dawah) window.state.dawah = {};
                   window.state.dawah.morning = e.target.checked;
                   if(window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications(window.state);
                });
              </script>
"""

script_pattern = re.compile(r'<script>\s*function setNotifTheme.*?</script>', re.DOTALL)
content = script_pattern.sub(js_logic.strip(), content)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

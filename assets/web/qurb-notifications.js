/* Qurb: notification settings + native schedule builder */
/* ================= SERVER-BASED PRAYER WEB PUSH =================
       Browser -> Push subscription -> PHP server -> Push service -> Service Worker.
       The server cron is responsible for the prayer-time schedule, so the page does
       not need to stay open for reminders.
    */
    (function () {
      var STORAGE = 'salah_prayer_notifications_v3';
      var PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      var SPECIAL_DEFAULTS = { sunrise: true, makruhStart: true, makruhEnd: true };
      var PRAYER_UR = { fajr: 'فجر', dhuhr: 'ظہر', asr: 'عصر', maghrib: 'مغرب', isha: 'عشاء' };
      var PRAYER_EN = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
      var state = loadState(), els = {}, serverConfig = null, syncing = false;
      function inArrayLead(v) { v = Number(v); return v === 0 || v === 5 || v === 10 || v === 15 ? v : 0; }
      function loadState() { var d = { enabled: true, lead: 0, prayers: { fajr: 'adhan', dhuhr: 'adhan', asr: 'adhan', maghrib: 'adhan', isha: 'adhan' }, special: { sunrise: 'off', makruhStart: 'off', makruhEnd: 'off', preAdhanMinutes: 15, iqamahAlert: false, jummahAlert: true }, dawah: { morning: false, maghrib: false, sleep: false }, serverId: '', serverToken: '' }; try { var x = JSON.parse(localStorage.getItem(STORAGE) || 'null'); if (x) { d.enabled = !!x.enabled; d.lead = inArrayLead(x.lead) ? x.lead : 0; PRAYER_KEYS.forEach(function (k) { var v = x.prayers && x.prayers[k] !== undefined ? x.prayers[k] : 'adhan'; d.prayers[k] = (v === true) ? 'adhan' : (v === false ? 'off' : v); }); var ss = x.special || {}; var sr = ss.sunrise !== undefined ? ss.sunrise : 'off'; var m1 = ss.makruhStart !== undefined ? ss.makruhStart : (ss.makruh !== undefined ? ss.makruh : 'off'); var m2 = ss.makruhEnd !== undefined ? ss.makruhEnd : (ss.makruh !== undefined ? ss.makruh : 'off'); d.special.sunrise = (sr === true) ? 'adhan' : (sr === false ? 'off' : sr); d.special.makruhStart = (m1 === true) ? 'silent' : (m1 === false ? 'off' : m1); d.special.makruhEnd = (m2 === true) ? 'silent' : (m2 === false ? 'off' : m2); d.special.preAdhanMinutes = ss.preAdhanMinutes !== undefined ? ss.preAdhanMinutes : 15; d.special.iqamahAlert = ss.iqamahAlert !== undefined ? ss.iqamahAlert : false; d.special.jummahAlert = ss.jummahAlert !== undefined ? ss.jummahAlert : true; var dw = x.dawah || {}; d.dawah.morning = !!dw.morning; d.dawah.maghrib = !!dw.maghrib; d.dawah.sleep = !!dw.sleep; d.serverId = x.serverId || ''; d.serverToken = x.serverToken || ''; } } catch (e) { } return d; }
      function saveState() {
        try {
          localStorage.setItem(STORAGE, JSON.stringify(state));
          if (isNativeBridge() && window.__syncNativePrayerNotifications) {
            window.__syncNativePrayerNotifications(state);
          }
        } catch (e) { }
      }
      function isEnglish() { return document.documentElement.getAttribute('lang') === 'en'; }
      function txt(ur, en) { return isEnglish() ? en : ur; }
      function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
      function icon(key) { var icons = { fajr: '<path d="M12 3v3M4.2 11H2m20 0h-2.2M5.6 5.6l1.6 1.6m9.6-1.6-1.6 1.6M4 19h16M7 15a5 5 0 0 1 10 0"/>', dhuhr: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 12h-2M21.8 12h-2M5.9 5.9l1.4 1.4M16.7 16.7l1.4 1.4M5.9 18.1l1.4-1.4M16.7 7.3l1.4-1.4"/>', asr: '<circle cx="12" cy="15" r="4"/><path d="M12 3v2.2M4.5 8.5l1.5 1.5M19.5 8.5 18 10M2.5 15h2M19.5 15h2"/>', maghrib: '<path d="M4 17h16M6 17a6 6 0 0 1 12 0M9 6l3-3 3 3M12 3v9"/>', isha: '<path d="M18 12.5A7 7 0 1 1 11.5 6 5.4 5.4 0 0 0 18 12.5Z"/>', sunrise: '<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 4v4M5.6 7.6l1.8 1.8M18.4 7.6l-1.8 1.8M2.5 13h2M19.5 13h2"/>', makruhStart: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>', makruhEnd: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.3 2.3 4.7-5"/>', morning: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>', sleep: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' }; return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (icons[key] || '') + '</svg>'; }
      function to12(h, m) { var ap = h < 12 ? 'AM' : 'PM', hh = h % 12 || 12; return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ap; }
      function pad2(n) { n = Number(n) || 0; return n < 10 ? '0' + n : '' + n; }

      function padTime(h, m) {
        h = Number(h) || 0; m = Number(m) || 0;
        return { h: h, m: m };
      }
      function makeDateAt(base, h, m) {
        var d = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Number(h) || 0, Number(m) || 0, 0, 0);
        return d;
      }
      function parseMakruhDuration(panel) {
        if (!panel) return null;
        var boxes = panel.querySelectorAll('.note-box[data-nb-tpl="t5"]');
        if (!boxes || boxes.length < 2) return null;
        function duration(box) {
          var txt = box.textContent || '';
          var m = txt.match(/(\d+)\s*(?:منٹ|min)\s*(\d+)\s*(?:سیکنڈ|sec)/);
          if (!m) return null;
          return Number(m[1]) * 60 + Number(m[2]);
        }
        var sunriseSec = duration(boxes[0]), sunsetSec = duration(boxes[1]);
        if (sunriseSec == null || sunsetSec == null) return null;
        return { sunriseSeconds: sunriseSec, sunsetSeconds: sunsetSec };
      }
      function todayRow() {
        var d = new Date(), midx = d.getMonth(), day = d.getDate();
        var months = window.__SALAH_MONTHS;
        var order = window.__SALAH_MONTH_ORDER;
        var days = months && order ? months[order[midx]] : null;
        if (!days || !days[day - 1]) return null;
        return { row: days[day - 1], midx: midx, day: day, date: d, location: false };
      }

      var __makruhDurCache = {};
  function makruhDurations(midx) {
    if (!__makruhDurCache[midx]) __makruhDurCache[midx] =
      parseMakruhDuration(document.getElementById('panel-cm' + midx)) || { sunriseSeconds: 1200, sunsetSeconds: 1200 };
    return __makruhDurCache[midx];
  }
  function exactSpecialTimes(date) {
    date = date || new Date();
    var months = window.__SALAH_MONTHS, order = window.__SALAH_MONTH_ORDER;
    var days = months && order ? months[order[date.getMonth()]] : null;
    var row = days && days[date.getDate() - 1];
    if (!row) return null;
    var dur = makruhDurations(date.getMonth());
    var sunrise = makeDateAt(date, row[2], row[3]);
    var sunset = makeDateAt(date, row[8] + 12, row[9]);
    return {
      sunrise: { start: sunrise, end: new Date(sunrise.getTime() + dur.sunriseSeconds * 1000) },
      sunset: { start: new Date(sunset.getTime() - dur.sunsetSeconds * 1000), end: sunset }
    };
  }


      function getTahajjudTime(targetDate, fajrHour, fajrMin) {
        var fajrDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), fajrHour, fajrMin, 0, 0);
        // Tahajjud reminder: 60 minutes before Fajr
        return new Date(fajrDate.getTime() - 60 * 60000);
      }

      function specialNotificationPayload() {
        var date = new Date();
        var specialTimes = exactSpecialTimes(date);
        return {
          sunrise: !!state.special.sunrise,
          makruhStart: !!state.special.makruhStart,
          makruhEnd: !!state.special.makruhEnd,
          prayerMessages: {
            fajr: { ur: 'فجر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔', en: 'Fajr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.' },
            dhuhr: { ur: 'ظہر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔', en: 'Dhuhr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.' },
            asr: { ur: 'عصر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔', en: 'Asr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.' },
            maghrib: { ur: 'مغرب کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔', en: 'Maghrib time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.' },
            isha: { ur: 'عشاء کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔', en: 'Isha time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.' }
          },
          sunriseMessage: { ur: 'سورج طلوع ہوگیا۔', en: 'The sun has risen.' },
          makruhStartMessage: { ur: 'یہ وقت مکروہ ہے۔', en: 'This is a Makruh time.' },
          makruhEndMessage: { ur: 'اب مکروہ وقت ختم ہوا۔', en: 'The Makruh time has ended.' },
          exact: {
            date: date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()),
            sunrise: specialTimes ? { start: specialTimes.sunrise.start.toISOString(), end: specialTimes.sunrise.end.toISOString() } : null,
            sunset: specialTimes ? { start: specialTimes.sunset.start.toISOString(), end: specialTimes.sunset.end.toISOString() } : null
          }
        };
      }

      function todayTimes(date) {
        date = date || new Date();
        var monthNames = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
        var months = window.__SALAH_MONTHS;
        var days = months ? months[monthNames[date.getMonth()]] : null;
        var row = days && days[date.getDate() - 1];
        if (!row) return null;
        return { fajr: [row[0], row[1]], dhuhr: [row[4], row[5]], asr: [row[6] + 12, row[7]], maghrib: [row[8] + 12, row[9]], isha: [row[10] + 12, row[11]] };
      }


      function isNativeBridge() {
        return typeof window !== 'undefined' && (!!window.FlutterNotificationBridge || !!window.QurbBridge || !!window.flutter_inappwebview || !!window.__QURB_NATIVE__ || !!window.isNativeApp);
      }

      function sendNotificationBridge(action, payload) {
        window.__qurbPost(Object.assign({ action: action }, payload || {}));
      }
      window.sendNotificationBridge = sendNotificationBridge;


      window.__syncNativePrayerNotifications = function (prefState) {
        if (!isNativeBridge()) return;
        var s = prefState || state;
        if (!s) return;

        sendNotificationBridge('saveNotificationPreferences', { preferences: s });

        if (!s.enabled) {
          sendNotificationBridge('cancelAllNotifications');
          return;
        }

        try {
          var monthNames = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
          var months = window.__SALAH_MONTHS;
          if (!months) return;

          var prayerNamesUr = { fajr: 'فجر', dhuhr: 'ظہر', asr: 'عصر', maghrib: 'مغرب', isha: 'عشاء' };
          var prayerNamesEn = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
          var en = isEnglish();

          var batch = [];
          var now = new Date();

          for (var dayOffset = 0; dayOffset < 14; dayOffset++) {
            var targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
            var midx = targetDate.getMonth();
            var dayNum = targetDate.getDate();
            var mName = monthNames[midx];
            var mDays = months[mName];
            if (!mDays || !mDays[dayNum - 1]) continue;
            var row = mDays[dayNum - 1];

            var prayers = {
              fajr: [row[0], row[1]],
              dhuhr: [row[4], row[5]],
              asr: [row[6] + 12, row[7]],
              maghrib: [row[8] + 12, row[9]],
              isha: [row[10] + 12, row[11]]
            };

            var baseId = (midx * 10000 + dayNum * 100);

            // 5 Daily Farz Prayers strictly on 'prayer_azan_channel' (Azan Sound)
            var pKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            for (var i = 0; i < pKeys.length; i++) {
              var pKey = pKeys[i];
              var val = (s.prayers && s.prayers[pKey] !== undefined) ? s.prayers[pKey] : 'adhan';
              if (val === false || val === 'off') continue;

              var pHour = prayers[pKey][0];
              var pMin = prayers[pKey][1];
              var pDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), pHour, pMin, 0, 0);

              if (pDate.getTime() <= (now.getTime() + 10000)) continue;

              var pTitle = en ? (prayerNamesEn[pKey] + ' Prayer Time') : ('نمازِ ' + prayerNamesUr[pKey] + ' کا وقت');
              var pBody = en
                ? (prayerNamesEn[pKey] + ' time has entered. Prepare for prayer.')
                : (prayerNamesUr[pKey] + ' کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔');

              var cId = 'prayer_azan_channel';
              if (val === 'beep') cId = 'qurb_prayer_channel';
              else if (val === 'silent') cId = 'prayer_silent_channel';

              batch.push({
                id: baseId + (i + 1),
                prayerKey: pKey,
                title: pTitle,
                body: pBody,
                time: pDate.toISOString(),
                hour: pHour,
                minute: pMin,
                channelId: cId,
                isPrayer: true
              });
            }

            // Sunrise Reminder
            var vSun = s.special ? s.special.sunrise : 'beep';
            if (vSun !== false && vSun !== 'off') {
              var sHour = row[2];
              var sMin = row[3];
              var sDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), sHour, sMin, 0, 0);
              if (sDate.getTime() > (now.getTime() + 10000)) {
                var cId = 'qurb_prayer_channel';
                if (vSun === 'adhan') cId = 'prayer_azan_channel';
                else if (vSun === 'silent') cId = 'prayer_silent_channel';
                batch.push({
                  id: baseId + 7,
                  prayerKey: 'sunrise',
                  title: en ? 'Sunrise' : 'طلوعِ شمس',
                  body: en ? 'The sun has risen. Fajr prayer time has ended.' : 'سورج طلوع ہوگیا، نمازِ فجر کا وقت ختم ہوا۔',
                  time: sDate.toISOString(),
                  hour: sHour,
                  minute: sMin,
                  channelId: cId,
                  isPrayer: false
                });
              }
            }

            // Makruh Start Reminder
            var vMakruhStart = s.special ? s.special.makruhStart : 'beep';
            if (vMakruhStart !== false && vMakruhStart !== 'off') {
              try {
                var sTimes = exactSpecialTimes(targetDate);
                if (sTimes && sTimes.sunrise && sTimes.sunrise.start) {
                  if (sTimes.sunrise.start.getTime() > (now.getTime() + 10000)) {
                    var cIdStart = 'qurb_prayer_channel';
                    if (vMakruhStart === 'adhan') cIdStart = 'prayer_azan_channel';
                    else if (vMakruhStart === 'silent') cIdStart = 'prayer_silent_channel';
                    batch.push({
                      id: baseId + 8,
                      prayerKey: 'makruhStart',
                      title: en ? 'Makruh Time Start' : 'مکروہ وقت شروع',
                      body: en ? 'Morning Makruh period has begun.' : 'صبح کا مکروہ وقت شروع ہوگیا۔',
                      time: sTimes.sunrise.start.toISOString(),
                      hour: sTimes.sunrise.start.getHours(),
                      minute: sTimes.sunrise.start.getMinutes(),
                      channelId: cIdStart,
                      isPrayer: false
                    });
                  }
                }
              } catch (e) { }
            }

            // Makruh End Reminder
            var vMakruhEnd = s.special ? s.special.makruhEnd : 'beep';
            if (vMakruhEnd !== false && vMakruhEnd !== 'off') {
              try {
                var sTimesEnd = exactSpecialTimes(targetDate);
                if (sTimesEnd && sTimesEnd.sunrise && sTimesEnd.sunrise.end) {
                  if (sTimesEnd.sunrise.end.getTime() > (now.getTime() + 10000)) {
                    var cIdEnd = 'qurb_prayer_channel';
                    if (vMakruhEnd === 'adhan') cIdEnd = 'prayer_azan_channel';
                    else if (vMakruhEnd === 'silent') cIdEnd = 'prayer_silent_channel';
                    batch.push({
                      id: baseId + 9,
                      prayerKey: 'makruhEnd',
                      title: en ? 'Makruh Time End' : 'مکروہ وقت ختم',
                      body: en ? 'Morning Makruh period has ended.' : 'صبح کا مکروہ وقت ختم ہوگیا۔',
                      time: sTimesEnd.sunrise.end.toISOString(),
                      hour: sTimesEnd.sunrise.end.getHours(),
                      minute: sTimesEnd.sunrise.end.getMinutes(),
                      channelId: cIdEnd,
                      isPrayer: false
                    });
                  }
                }
              } catch (e) { }
            }

            // Tahajjud Alert (60 minutes before Fajr)
            var vTahajjud = s.special ? (s.special.tahajjud !== undefined ? s.special.tahajjud : 'adhan') : 'adhan';
            if (vTahajjud !== false && vTahajjud !== 'off') {
              var tahajjudDate = getTahajjudTime(targetDate, prayers.fajr[0], prayers.fajr[1]);
              if (tahajjudDate.getTime() > (now.getTime() + 10000)) {
                var cIdTahajjud = 'prayer_azan_channel';
                if (vTahajjud === 'beep') cIdTahajjud = 'qurb_prayer_channel';
                else if (vTahajjud === 'silent') cIdTahajjud = 'prayer_silent_channel';
                batch.push({
                  id: baseId + 10,
                  prayerKey: 'tahajjud',
                  title: en ? 'Tahajjud Prayer Time' : 'نمازِ تہجد کا وقت',
                  body: en ? 'Tahajjud time is now. Seek closeness to Allah through night prayer.' : 'تہجد کا وقت داخل ہوگیا، اللہ کے حضور سجدہ ریز ہو کر دعائیں مانگیں۔',
                  time: tahajjudDate.toISOString(),
                  hour: tahajjudDate.getHours(),
                  minute: tahajjudDate.getMinutes(),
                  channelId: cIdTahajjud,
                  isPrayer: true
                });
              }
            }

            var dMorn = s.dawah ? s.dawah.morning : false;
            if (dMorn) {
              var pFajrDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), prayers.fajr[0], prayers.fajr[1], 0, 0);
              if (pFajrDate.getTime() > now.getTime() + 10000) {
                batch.push({
                  id: baseId + 11,
                  title: en ? 'A New Blessing' : 'آج کا دن ایک نیا موقع',
                  body: en ? 'Today is a new blessing from Allah, and could be the last. Spend it in His obedience and pray on time.' : 'آج کا دن اللہ کا دیا نیا موقع ہے، شاید یہ زندگی کا آخری دن ہو۔ اپنا دن اللہ کی اطاعت اور نمازوں کی پابندی میں گزاریں۔',
                  time: pFajrDate.toISOString(),
                  channelId: 'qurb_adhkar_channel',
                  isPrayer: false
                });
              }
            }

            var dMaghrib = s.dawah ? s.dawah.maghrib : false;
            if (dMaghrib) {
              var pMaghribDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), prayers.maghrib[0], prayers.maghrib[1], 0, 0);
              pMaghribDate = new Date(pMaghribDate.getTime() + 15 * 60000);
              if (pMaghribDate.getTime() > now.getTime() + 10000) {
                batch.push({
                  id: baseId + 12,
                  title: en ? 'Daily Adhkar & Surahs' : 'درود شریف اور مسنون سورتیں',
                  body: en ? "Did you send Salawat today? Remember to recite Surah As-Sajdah, Surah Al-Waqi'ah, and Surah Al-Mulk." : 'کیا آج آپ نے درود شریف پڑھا ہے؟ سورۃ السجدہ، سورۃ الواقعہ اور سورۃ الملک پڑھنا نہ بھولیں۔',
                  time: pMaghribDate.toISOString(),
                  channelId: 'qurb_adhkar_channel',
                  isPrayer: false
                });
              }
            }

            var dSleep = s.dawah ? s.dawah.sleep : false;
            if (dSleep) {
              var pIshaDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), prayers.isha[0], prayers.isha[1], 0, 0);
              pIshaDate = new Date(pIshaDate.getTime() + 60 * 60000);
              if (pIshaDate.getTime() > now.getTime() + 10000) {
                batch.push({
                  id: baseId + 13,
                  title: en ? 'Sunnah of Early Sleep' : 'سنتِ نبوی پر عمل',
                  body: en ? 'Complete your daily adhkar and sleep early. Sleeping early after Isha is a Sunnah.' : 'اپنے معمولات اور وظائف مکمل کر کے جلدی سو جائیں۔ عشاء کے بعد جلدی سونا سنت ہے۔',
                  time: pIshaDate.toISOString(),
                  channelId: 'qurb_adhkar_channel',
                  isPrayer: false
                });
              }
            }

            // Pre-Adhan Reminder (slider value minutes before each Farz prayer)
            var preAdhanMins = (s.special && s.special.preAdhanMinutes) ? parseInt(s.special.preAdhanMinutes) : 0;
            if (preAdhanMins > 0) {
              for (var pi = 0; pi < pKeys.length; pi++) {
                var ppKey = pKeys[pi];
                var ppVal = (s.prayers && s.prayers[ppKey] !== undefined) ? s.prayers[ppKey] : 'adhan';
                if (ppVal === false || ppVal === 'off') continue;
                var ppDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), prayers[ppKey][0], prayers[ppKey][1], 0, 0);
                ppDate = new Date(ppDate.getTime() - preAdhanMins * 60000);
                if (ppDate.getTime() > (now.getTime() + 10000)) {
                  batch.push({
                    id: baseId + 14 + pi,
                    title: en ? (prayerNamesEn[ppKey] + ' in ' + preAdhanMins + ' minutes') : (prayerNamesUr[ppKey] + ' تک ' + preAdhanMins + ' منٹ باقی'),
                    body: en ? ('Prepare for ' + prayerNamesEn[ppKey] + ' prayer. Time is approaching.') : (prayerNamesUr[ppKey] + ' کی نماز کا وقت قریب ہے، تیاری کریں۔'),
                    time: ppDate.toISOString(),
                    channelId: 'qurb_prayer_channel',
                    isPrayer: false
                  });
                }
              }
            }

            // Iqamah Alert (+15 minutes after each Farz prayer)
            var iqamahEnabled = s.special ? !!s.special.iqamahAlert : false;
            if (iqamahEnabled) {
              for (var qi = 0; qi < pKeys.length; qi++) {
                var qKey = pKeys[qi];
                var qVal = (s.prayers && s.prayers[qKey] !== undefined) ? s.prayers[qKey] : 'adhan';
                if (qVal === false || qVal === 'off') continue;
                var qDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), prayers[qKey][0], prayers[qKey][1], 0, 0);
                qDate = new Date(qDate.getTime() + 15 * 60000);
                if (qDate.getTime() > (now.getTime() + 10000)) {
                  batch.push({
                    id: baseId + 19 + qi,
                    title: en ? ('Iqamah – ' + prayerNamesEn[qKey]) : ('اقامت – ' + prayerNamesUr[qKey]),
                    body: en ? ('Iqamah Alert: ' + prayerNamesEn[qKey] + ' prayer congregation is starting.') : (prayerNamesUr[qKey] + ' کی نماز باجماعت شروع ہونے والی ہے۔'),
                    time: qDate.toISOString(),
                    channelId: 'qurb_prayer_channel',
                    isPrayer: false
                  });
                }
              }
            }

            // Jummah (Friday) Special Alert – 11:30 AM every Friday
            var jummahEnabled = s.special ? !!s.special.jummahAlert : false;
            if (jummahEnabled && targetDate.getDay() === 5) {
              var jDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 11, 30, 0, 0);
              if (jDate.getTime() > (now.getTime() + 10000)) {
                batch.push({
                  id: baseId + 24,
                  title: en ? 'Jumu\'ah Reminder' : 'جمعہ مبارک کی تیاری',
                  body: en ? 'Friday Preparation: Recite Surah Al-Kahf, perform Ghusl, apply fragrance, and go early for Jumu\'ah.' : 'سورۃ الکہف کی تلاوت، غسل، خوشبو لگائیں اور جمعہ کے لیے جلدی جائیں۔',
                  time: jDate.toISOString(),
                  channelId: 'qurb_adhkar_channel',
                  isPrayer: false
                });
              }
            }
          }

          // Dispatch daily prayers schedule specifically for today
          var todayBatch = batch.filter(function (b) {
            var bd = new Date(b.time);
            return bd.getDate() === now.getDate() && bd.getMonth() === now.getMonth() && bd.getFullYear() === now.getFullYear();
          });

          var todayInfo = todayRow();
          var todayRowData = todayInfo ? todayInfo.row : null;
          var todayP = todayTimes(now);
          var todaySpecial = exactSpecialTimes(now);
          var todayTahajjud = todayP ? getTahajjudTime(now, todayP.fajr[0], todayP.fajr[1]) : null;

          if (todayP && todayRowData) {
            var dailyPayload = {
              action: 'scheduleDailyPrayers',
              date: now.toISOString(),
              prayers: {
                fajr: { hour: todayP.fajr[0], minute: todayP.fajr[1] },
                dhuhr: { hour: todayP.dhuhr[0], minute: todayP.dhuhr[1] },
                asr: { hour: todayP.asr[0], minute: todayP.asr[1] },
                maghrib: { hour: todayP.maghrib[0], minute: todayP.maghrib[1] },
                isha: { hour: todayP.isha[0], minute: todayP.isha[1] }
              },
              special: {
                sunrise: { hour: todayRowData[2], minute: todayRowData[3] },
                tahajjud: todayTahajjud ? { hour: todayTahajjud.getHours(), minute: todayTahajjud.getMinutes() } : null,
                makruhStart: todaySpecial && todaySpecial.sunrise && todaySpecial.sunrise.start ? { hour: todaySpecial.sunrise.start.getHours(), minute: todaySpecial.sunrise.start.getMinutes() } : null,
                makruhEnd: todaySpecial && todaySpecial.sunrise && todaySpecial.sunrise.end ? { hour: todaySpecial.sunrise.end.getHours(), minute: todaySpecial.sunrise.end.getMinutes() } : null
              },
              items: todayBatch
            };

            // sendNotificationBridge('scheduleDailyPrayers', dailyPayload);
          }

          if (batch.length > 0) {
          batch.sort(function (a, b) { return a.time < b.time ? -1 : (a.time > b.time ? 1 : 0); });
          var sigStr = JSON.stringify([s.enabled, s.prayers, s.special, s.dawah, en]), sig = 5381;
          for (var si = 0; si < sigStr.length; si++) sig = ((sig << 5) + sig + sigStr.charCodeAt(si)) | 0;
          sendNotificationBridge('schedulePrayerBatch', { items: batch.slice(0, 400), sig: String(sig) });
        }
        } catch (e) {
          console.error('Error generating native prayer schedule:', e);
        }
      };

      // Har tarah ki sync requests (toggle, launch, Dart) 1.5 sec mein ek ho jaati hain
  var __realSync = window.__syncNativePrayerNotifications, __syncTimer = null;
  window.__syncNativePrayerNotifications = function () {
    clearTimeout(__syncTimer);
    __syncTimer = setTimeout(function () {
      try { state = loadState(); } catch (e) {}
      __realSync(state);
    }, 1500);
  };

  window.syncNativeToWeb = function () {
        try {
          state = loadState();
          render();
          if (window.__syncNativePrayerNotifications) {
            window.__syncNativePrayerNotifications(state);
          }
        } catch (e) {
          console.error("syncNativeToWeb error:", e);
        }
      };

      function permissionText() {
        if (isNativeBridge()) return 'Notifications are active.';
        if (typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return 'Notifications are not supported in this browser.';
        if (window.Notification.permission === 'granted') return 'Notifications are allowed.';
        if (window.Notification.permission === 'denied') return 'Notifications are blocked in settings.';
        return 'Notifications are off. Allow to receive reminders.';
      }
      function permissionClass() {
        if (isNativeBridge()) return 'ok';
        if (typeof window === 'undefined' || !('Notification' in window) || !window.Notification || window.Notification.permission === 'denied') return 'bad';
        if (window.Notification.permission === 'granted') return 'ok';
        return 'warn';
      }
      function permissionButtonText() {
        return 'Allow / Grant Permission';
      }
      function enablePush() {
        if (isNativeBridge()) {
          state.enabled = true;
          saveState();
          sendNotificationBridge('requestPermissions');
          sendNotificationBridge('saveNotificationPreferences', { preferences: state });
          if (window.__syncNativePrayerNotifications) {
            window.__syncNativePrayerNotifications(state);
          }
          bindNotificationEvents();
          render();
          return Promise.resolve(true);
        }
        if (typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return Promise.reject(new Error('Notifications are not supported in this browser.'));
        if (window.Notification.permission === 'denied') return Promise.reject(new Error('Allow notifications in your device or browser settings.'));
        var ask = window.Notification.permission === 'granted' ? Promise.resolve('granted') : window.Notification.requestPermission();
        return ask.then(function (p) {
          if (p !== 'granted') throw new Error('Notification permission was not granted.');
          state.enabled = true;
          saveState();
          return subscribeServer();
        });
      }

      function setServerStatus(msg, cls) {
        if (!els || !els.serverStatus) return;
        els.serverStatus.textContent = msg || "";
        els.serverStatus.className = "notification-status" + (cls ? " " + cls : "");
      }

      function disablePush() {
        state.enabled = false;
        saveState();
        if (isNativeBridge()) {
          sendNotificationBridge('cancelAllNotifications');
          sendNotificationBridge('saveNotificationPreferences', { preferences: state });
        } else {
          syncServer();
        }
      }

      function render() {
        try {
          if (els.title) els.title.textContent = 'Prayer Notifications';
          if (els.sub) els.sub.textContent = 'All prayer notification and reminder options';
          if (els.masterTitle) els.masterTitle.textContent = 'All Notifications';
          if (els.masterSub) els.masterSub.textContent = 'Master switch for all prayer, sunrise, and Makruh notifications';
          if (els.note) els.note.textContent = 'For best results, allow notifications so reminders can arrive on exact times.';

          if (els.permission) {
            els.permission.textContent = isNativeBridge() ? 'Notifications are active.' : permissionText();
            els.permission.className = 'notification-status ' + (isNativeBridge() ? 'ok' : permissionClass());
          }
          if (els.permissionBtn) els.permissionBtn.textContent = 'Allow / Grant Permission';

          var title = document.getElementById('notifIndividualTitle');
          var sub = document.getElementById('notifIndividualSub');
          if (title) title.textContent = 'Individual Prayer & Event Alerts';
          if (sub) sub.textContent = 'Turn each prayer, sunrise, and Makruh alert on or off separately.';

          var dTitle = document.getElementById('notifDawahTitle');
          var dSub = document.getElementById('notifDawahSub');
          if (dTitle) dTitle.textContent = 'Daily Spiritual Reminders';
          if (dSub) dSub.textContent = 'Independent notifications for daily motivation and sunnah practices.';

          if (els.master) els.master.checked = !!state.enabled;

          // Master Toggle
          var master = document.getElementById('notifMaster');
          if (master) master.checked = !!state.enabled;

          // Sync custom toggles & selects
          var selects = document.querySelectorAll('.notif-select');
          for (var i = 0; i < selects.length; i++) {
            var sel = selects[i];
            var kind = sel.dataset.kind;
            var key = sel.dataset.key;
            var val = 'adhan';
            if (kind === 'prayer' && state.prayers) val = state.prayers[key] !== undefined ? state.prayers[key] : 'adhan';
            if (kind === 'special' && state.special) val = state.special[key] !== undefined ? state.special[key] : 'beep';

            // Find corresponding toggle
            var toggle = document.querySelector('.indiv-toggle[data-key="' + key + '"]');
            if (toggle) {
              toggle.checked = (val !== false && val !== 'off' && val !== 'mute');
              sel.value = (val === false || val === 'off' || val === 'mute') ? 'adhan' : val;
            } else {
              sel.value = val;
            }
          }

          // Sync Additional Alerts
          if (state.special) {
            if (document.getElementById('preAdhanSlider') && state.special.preAdhanMinutes !== undefined) {
              document.getElementById('preAdhanSlider').value = state.special.preAdhanMinutes;
              document.getElementById('preAdhanLabel').textContent = state.special.preAdhanMinutes + ' minutes before';
            }
            if (document.getElementById('iqamahToggle')) document.getElementById('iqamahToggle').checked = !!state.special.iqamahAlert;
            if (document.getElementById('jummahToggle')) document.getElementById('jummahToggle').checked = !!state.special.jummahAlert;
          }
          if (state.dawah && document.getElementById('adhkarToggle')) {
            document.getElementById('adhkarToggle').checked = !!state.dawah.morning;
          }

          // Sync Da'wah toggles in static HTML
          var toggles = document.querySelectorAll('.notif-toggle');
          for (var j = 0; j < toggles.length; j++) {
            var tog = toggles[j];
            var dKey = tog.dataset.key;
            if (state.dawah && state.dawah[dKey] !== undefined) {
              tog.checked = !!state.dawah[dKey];
            }
          }

          if (isNativeBridge()) {
            setServerStatus('Native notifications are active.', 'ok');
          }
        } catch (err) {
          console.error("Render sync error:", err);
        }
      }

      function bindNotificationEvents() {
        var inputs = document.querySelectorAll('.notif-toggle, .notif-select');
        for (var x = 0; x < inputs.length; x++) {
          inputs[x].onchange = function () {
            var key = this.dataset.key;
            var kind = this.dataset.kind;
            var val = (this.tagName.toLowerCase() === 'select') ? this.value : this.checked;
            if (kind === 'prayer') {
              if (!state.prayers) state.prayers = {};
              state.prayers[key] = val;
            } else if (kind === 'dawah') {
              if (!state.dawah) state.dawah = {};
              state.dawah[key] = val;
            } else if (kind === 'special') {
              if (!state.special) state.special = {};
              state.special[key] = val;
            }
            saveState();
            sendNotificationBridge('saveNotificationPreferences', { preferences: state });
            sendNotificationBridge('savePreference', { key: key, value: val });
          };
        }
      }

      function testNotification() {
        console.log("Triggering test notification bridge...");
        if (isNativeBridge()) {
          sendNotificationBridge('test_notification', {
            title: 'Qurb - Prayer Alerts & Reminders',
            body: 'Prayer alerts and daily spiritual reminders are working properly!'
          });
          return;
        }
        if (!state.serverId || !state.serverToken) {
          enablePush().then(function () { return testNotification(); }).catch(function (e) { setServerStatus(e.message, 'bad'); });
          return;
        }
        var testBtn = document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn');
        if (testBtn) testBtn.disabled = true;
        setServerStatus('Sending test notification…');
        api('push-test.php', { id: state.serverId, token: state.serverToken }).then(function () {
          setServerStatus('Test notification sent.', 'ok');
        }).catch(function (e) {
          setServerStatus(e.message, 'bad');
        }).finally(function () {
          if (testBtn) testBtn.disabled = false;
        });
      }

      function init() {
        els = {
          title: document.getElementById('notifTitle'),
          sub: document.getElementById('notifSubtitle'),
          masterTitle: document.getElementById('notifMasterTitle'),
          masterSub: document.getElementById('notifMasterSub'),
          master: document.getElementById('notifMaster'),
          permission: document.getElementById('notifStatus'),
          permissionBtn: document.getElementById('notifPermissionBtn'),
          list: document.getElementById('notificationList'),
          dawahList: document.getElementById('dawahList'),
          note: document.getElementById('notifNote'),
          testBtn: document.getElementById('testNotificationBtn') || document.getElementById('notifTestBtn'),
          serverStatus: document.getElementById('notifServerStatus')
        };

        if (els.master) {
          els.master.addEventListener('change', function () {
            if (els.master.checked) {
              enablePush().then(render).catch(function (e) {
                state.enabled = false;
                saveState();
                bindNotificationEvents();
                render();
                setServerStatus(e.message, 'bad');
              });
            } else {
              disablePush();
              bindNotificationEvents();
              render();
            }
          });
        }

        if (els.permissionBtn) {
          els.permissionBtn.addEventListener('click', function () {
            enablePush().then(render).catch(function (e) {
              setServerStatus(e.message, 'bad');
              bindNotificationEvents();
              render();
            });
          });
        }

      
        var langBtn = document.getElementById('langToggle');
        if (langBtn) langBtn.addEventListener('click', function () { setTimeout(render, 50); });

        bindNotificationEvents();
        render();

        if (isNativeBridge()) {
          if (state.enabled && window.__syncNativePrayerNotifications) {
            window.__syncNativePrayerNotifications(state);
          }
        } else {
          if (state.enabled && (typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted') && state.serverId) {
            syncServer();
          }
        }
      }

      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

      // Signal Flutter wrapper that DOM is ready so splash screen immediately transitions
      function notifyAppReady() {
        if (window.QurbBridge && window.QurbBridge.postMessage) {
          try {
            window.QurbBridge.postMessage(JSON.stringify({ action: 'appReady' }));
          } catch (e) { }
        }
      }
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        notifyAppReady();
      } else {
        window.addEventListener('DOMContentLoaded', notifyAppReady);
        window.addEventListener('load', notifyAppReady);
      }

      // --- Launch: Flutter ko batao page ready hai. Pehli sync init() karta hai (debounced) ---
  window.addEventListener('DOMContentLoaded', function () {
    notifyAppReady();
    try { if (!localStorage.getItem(STORAGE)) saveState(); } catch (e) {}
  });
    })();

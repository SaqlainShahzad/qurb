/* Qurb main app: home, tabs, duas, hadith, library, qibla(web), articles */
(function () {
      var MONTHS = window.QURB_DATA.MONTHS;
      var monthOrder = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
      // Expose the calendar data to the independent server-push module below.
      // The original page keeps MONTHS/monthOrder inside its first IIFE, so the
      // server-push IIFE cannot access them directly.
      window.__SALAH_MONTHS = MONTHS;
      window.__SALAH_MONTH_ORDER = monthOrder;
      var weekdays = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
      var gregMonths = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];
      var weekdaysEN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var gregMonthsEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var PNAMES = { fajr: { ur: "فجر", en: "Fajr" }, sunrise: { ur: "طلوعِ شمس", en: "Sunrise" }, dhuhr: { ur: "ظہر", en: "Dhuhr" }, asr: { ur: "عصر", en: "Asr" }, maghrib: { ur: "مغرب", en: "Maghrib" }, isha: { ur: "عشاء", en: "Isha" } };

      /* ============ i18n (EN/UR) ============ */
      var LANG_KEY = "app_lang_v1";
      var lang = "ur";
      try { var savedLang = localStorage.getItem(LANG_KEY); if (savedLang === "en" || savedLang === "ur") lang = savedLang; } catch (e) { }

      var EN = {
        subtitleMain: "Permanent Prayer Timetable - District Swat",
        subtitleSub: "Hazrat Maulana Fazal Muhammad (رحمہ اللہ)",
        hijriLabel: "Hijri", gregLabel: "Gregorian",
        livePrayerKicker: "Next Prayer",
        quranLabel: "Quran Recitation", quranStart: "Start reading Quran", quranChip: "114 Surahs • IndoPak", soonChip: "Coming soon",
        quickAccess: "Quick Access",
        todayNotes: "Today's Rulings",
        qaTimes: "Prayer Times", qaLibrary: "Library", qaCalendar: "Calendar", qaQibla: "Qibla", qaNotes: "Manzil", qaDhikr: "Dhikr", qiblaTitle: "Next-Gen Qibla Finder", qiblaSubtitle: "Use your camera to guide you toward the Kaaba", qiblaArMode: "🌍 AR Qibla", qiblaCompassMode: "🧭 Compass", qiblaArBadge: "LIVE AR QIBLA", qiblaArStartText: "Start the camera and slowly turn your phone.", qiblaStatusStart: "Location, camera and compass permission are required.", qiblaStart: "Start AR Qibla", qiblaCalibrate: "Calibrate Compass", qiblaBearingLabel: "Qibla bearing", qiblaLocationLabel: "Your location", qiblaReady: "AR Qibla is active. Turn until the Kaaba appears in the center.", qiblaLocationDenied: "Location permission was denied. Please allow it and try again.", qiblaCameraDenied: "Camera permission was denied. Please allow camera access and try again.", qiblaCompassUnavailable: "Your device does not provide a usable compass.", qiblaNeedPermission: "Please allow motion/orientation access to use the live direction.", qiblaCalibrateText: "Slowly rotate your phone in a figure-eight motion, then hold it flat.", qiblaWavePrompt: "Wave phone in a figure-8 motion to calibrate compass", qiblaFrozenBanner: "Compass sensor is frozen or unchanged. Wave phone in figure-8.", qiblaOpenNative: "Open Native Compass", qiblaAligned: "✓ Qibla aligned — you are facing the Kaaba", qiblaTurn: "Turn toward the Kaaba", qiblaNoCamera: "Camera AR is unavailable on this device; Compass mode is ready.",
        qaMosques: "Mosques", qaDuas: "Duas", qaArticles: "Articles", qaHadith: "Hadith", qaAbout: "About Us", qaQuran: "Quran",
        calTitle: "Permanent Prayer Timetable",
        thDay: "Day", thFajr: "Fajr", thSunrise: "Sunrise", thDhuhr: "Dhuhr", thAsr: "Asr", thMaghrib: "Maghrib", thIsha: "Isha",
        mJan: "January", mFeb: "February", mMar: "March", mApr: "April", mMay: "May", mJun: "June",
        mJul: "July", mAug: "August", mSep: "September", mOct: "October", mNov: "November", mDec: "December",
        nbIshraq: "Ishraq Prayer", nbSawm: "Fasting Niyyah", nbIshaMustahab: "Isha (Mustahab Time)",
        nbMaghribMin: "Maghrib (Minimum)", nbSunriseMakruh: "Sunrise (Makruh)", nbSunsetMakruh: "Sunset (Makruh)",
        navHome: "Home", navPrayerTimes: "Prayer Times", navCalendar: "Calendar", navQuran: "Quran", navHadith: "Hadith", navSettings: "Settings", settingsPrayerTitle: "Prayer Notifications", settingsPrayerSub: "All prayer notification and reminder options", settingsUpdateTitle: "Update App", settingsUpdateSub: "Check and install the latest app version", settingsUpdateCardTitle: "Update App", settingsUpdateCardSub: "Check for the latest version and update", settingsUpdateBtn: "Update",
        backHome: "Back to Home",
        quranTitle: "The Holy Quran",
        quranSub: "IndoPak Script — Complete 114 Surahs with Urdu & English Translations",
        quranDownload: "Save Offline",
        toggleUrdu: "Urdu Translation",
        toggleEn: "English",
        hadithHeaderTitle: "40 Short Hadiths",
        hadithHeaderSub: "Curated Authentic Hadiths by Mufti Maaz Haroon with Urdu & English Translations",
        aboutName: "Mufti Maaz Haroon",
        aboutTag: "Pakistani Islamic scholar, author and web developer",
        aboutP1: "Mufti Maaz Haroon is a Pakistani Islamic scholar and author. He won a national-level Qira'at competition, for which he was awarded an Umrah ticket as a prize.",
        aboutP2: "At just 12 years of age, without ever completing the Nazira stage, he memorised the entire Quran in only 2 years. He then completed the 8-year Dars-e-Nizami syllabus and earned a specialization (Takhassus) in Fiqh. He holds a graduation and Ifta certificate from Jamia Mazahir-ul-Uloom (JMU), along with a Master's degree in Arabic Literature.",
        aboutP3: "He has a special devotion to Tasawwuf and holds permission (Ijazah) in the Naqshbandiyya Sirajiyya order from senior spiritual guide Peer Barkatullah Sahib.",
        aboutP4: 'Mufti Sahib is the author of the book <b>"Khulasat-ul-Quran li-Ibn-e-Haroon"</b> and teaches at Jamia Taleem-ul-Quran, Khyber Pakhtunkhwa. He is also an accomplished computer programmer and web developer. Thousands of followers on social media are drawn to his simple, engaging style, especially his well-known series <b>"40 Short Hadiths"</b>, which received immense appreciation.',
        aboutQuote: 'His mission is to spread the simple yet profound message of "enjoining good and forbidding evil" across the country and around the world.',
        linkWebsite: "Website: muftimaazharoon.com", linkFacebook: "Facebook", linkInstagram: "Instagram", linkYoutube: "YouTube",
        soonQuranTitle: "Quran section", soonQuranBody: "Quran reader is ready.",
        soonHadithTitle: "Hadith section", soonHadithBody: "40 Hadiths collection is ready.",
        soonSettingsTitle: "Settings coming soon", soonSettingsBody: "Location, notifications and other preferences will be added here in the future.",
        articlesSource: "from muftimaazharoon.com",
        a2hsTitle: "Install on your phone home screen", a2hsSub: "Open instantly even without internet, just like a regular app",
        a2hsInstall: "Install in one click", a2hsLater: "Later",
        a2hsStep1: "Tap the Share", a2hsStep1b: "button below",
        a2hsStep2: 'Select "Add to Home Screen"', a2hsStep3: 'Tap "Add" — done', a2hsGotIt: "Got it"
      };

      var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
      var URDU_SNAPSHOT = {};
      i18nEls.forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (!(k in URDU_SNAPSHOT)) URDU_SNAPSHOT[k] = el.innerHTML;
      });

      var noteBoxes = Array.prototype.slice.call(document.querySelectorAll(".note-box[data-nb-tpl]"));
      function nbUrText(div) {
        var t = "";
        div.childNodes.forEach(function (n) { if (n.nodeType === 3) t += n.textContent; });
        return t;
      }
      function nbEnText(tpl, urText) {
        var m;
        if (tpl === "t1") {
          m = urText.match(/(\d{1,2}:\d{2})/);
          if (m) return "Until " + m[1] + " AM";
        }
        else if (tpl === "t3") {
          m = urText.match(/(\d{1,2}:\d{2})/);
          if (m) return "Before " + m[1] + " PM";
        }
        else if (tpl === "t4") {
          m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
          if (m) return "Min duration: " + m[1] + " min " + m[2] + " sec";
          m = urText.match(/(\d+)\s*منٹ/);
          if (m) return "Min duration: " + m[1] + " min";
        }
        else if (tpl === "t5") {
          m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
          if (m) return m[1] + " min " + m[2] + " sec";
          m = urText.match(/(\d+)\s*منٹ/);
          if (m) return m[1] + " min";
        }
        return urText;
      }
      function nbUrClean(tpl, urText) {
        var m;
        if (tpl === "t1") {
          m = urText.match(/(\d{1,2}:\d{2})/);
          if (m) return m[1] + " بجے تک";
        }
        else if (tpl === "t3") {
          m = urText.match(/(\d{1,2}:\d{2})/);
          if (m) return m[1] + " بجے سے پہلے تک";
        }
        else if (tpl === "t4") {
          m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
          if (m) return m[1] + " منٹ " + m[2] + " سیکنڈ";
          m = urText.match(/(\d+)\s*منٹ/);
          if (m) return m[1] + " منٹ";
        }
        else if (tpl === "t5") {
          m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
          if (m) return m[1] + " منٹ " + m[2] + " سیکنڈ";
          m = urText.match(/(\d+)\s*منٹ/);
          if (m) return m[1] + " منٹ";
        }
        return urText;
      }
      var nbUrdu = noteBoxes.map(nbUrText);
      var nbEnglish = noteBoxes.map(function (div, i) { return nbEnText(div.getAttribute("data-nb-tpl"), nbUrdu[i]); });
      var nbUrduClean = noteBoxes.map(function (div, i) { return nbUrClean(div.getAttribute("data-nb-tpl"), nbUrdu[i]); });
      function setNbText(div, text) {
        var toRemove = [];
        div.childNodes.forEach(function (n) { if (n.nodeType === 3) toRemove.push(n); });
        toRemove.forEach(function (n) { div.removeChild(n); });
        div.appendChild(document.createTextNode(text));
      }

      var EN_TITLES = { nbIshraq: "Ishraq Prayer", nbSawm: "Fasting Niyyah", nbIshaMustahab: "Isha (Mustahab Time)", nbMaghribMin: "Maghrib (Minimum)", nbSunriseMakruh: "Sunrise (Makruh)", nbSunsetMakruh: "Sunset (Makruh)" };
      var UR_TITLES = { nbIshraq: "نمازِ اشراق", nbSawm: "روزے کی نیت", nbIshaMustahab: "عشاء (مستحب وقت)", nbMaghribMin: "مغرب (کم از کم)", nbSunriseMakruh: "طلوعِ آفتاب (مکروہ وقت)", nbSunsetMakruh: "غروبِ آفتاب (مکروہ وقت)" };

      function renderHomeNotes() {
        var info = todayRow();
        var wrap = document.getElementById('homeNotesGrid');
        if (!info || !wrap) return;
        var panel = document.getElementById('panel-cm' + info.midx);
        var srcGrid = panel ? panel.querySelector('.notes-grid') : null;
        if (!srcGrid) { wrap.innerHTML = ''; return; }

        // SVGs for the cards
        var svgMoon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        var svgSunHalf = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><path d="M16 12a4 4 0 1 1-8 0"/></svg>';
        var svgSunFull = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
        var svgClock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

        // Mapping original items to their respective theme and icon
        var configMap = {
          nbSawm: { theme: 1, icon: svgMoon, hasPill: false },
          nbIshraq: { theme: 2, icon: svgSunHalf, hasPill: false },
          nbMaghribMin: { theme: 3, icon: svgSunHalf, hasPill: false },
          nbIshaMustahab: { theme: 4, icon: svgMoon, hasPill: false },
          nbSunsetMakruh: { theme: 5, icon: svgSunFull, hasPill: false },
          nbSunriseMakruh: { theme: 6, icon: svgSunHalf, hasPill: false }
        };

        var htmlOut = '';
        var srcBoxes = srcGrid.querySelectorAll('.note-box[data-nb-tpl]');

        srcBoxes.forEach(function (div) {
          var tpl = div.getAttribute('data-nb-tpl');
          var bEl = div.querySelector('b[data-i18n]');
          var i18nKey = bEl ? bEl.getAttribute('data-i18n') : null;
          var rawUr = '';
          div.childNodes.forEach(function (n) { if (n.nodeType === 3) rawUr += n.textContent; });
          rawUr = rawUr.replace(/^:\s*/, '').trim();

          var finalTitle = '';
          var finalSub = '';
          var finalVal = '';

          if (lang === 'en') {
            finalTitle = (i18nKey && EN_TITLES[i18nKey]) ? EN_TITLES[i18nKey] : (bEl ? bEl.textContent : '');
            var enText = nbEnText(tpl, rawUr);
            if (enText.indexOf('Until ') === 0) { finalSub = 'Until'; finalVal = enText.substring(6); }
            else if (enText.indexOf('Before ') === 0) { finalSub = 'Before'; finalVal = enText.substring(7); }
            else if (enText.indexOf('Min duration: ') === 0) { finalSub = 'Minduration: ' + enText.substring(14); finalVal = enText.substring(14); }
            else { finalSub = ''; finalVal = enText; }
          } else {
            finalTitle = (i18nKey && UR_TITLES[i18nKey]) ? UR_TITLES[i18nKey] : (bEl ? bEl.textContent : '');
            var urText = nbUrClean(tpl, rawUr);
            if (urText.indexOf('بجے تک') !== -1) { finalSub = 'بجے تک'; finalVal = urText.replace(' بجے تک', '').replace('بجے تک', ''); }
            else if (urText.indexOf('بجے سے پہلے تک') !== -1) { finalSub = 'بجے سے پہلے تک'; finalVal = urText.replace(' بجے سے پہلے تک', '').replace('بجے سے پہلے تک', ''); }
            else if (urText.indexOf('منٹ') !== -1) { finalSub = 'دورانیہ:'; finalVal = urText; }
            else { finalSub = ''; finalVal = urText; }
          }

          var cnf = (i18nKey && configMap[i18nKey]) ? configMap[i18nKey] : { theme: 1, icon: svgMoon, hasPill: false };

          var pillHtml = cnf.hasPill ? '<div class="mrc-pill">' + svgClock + ' ' + finalVal + '</div>' : '<div class="mrc-value">' + finalVal + '</div>';
          var subtitleHtml = finalSub ? '<div class="mrc-subtitle">' + finalSub + '</div>' : '';

          htmlOut += '<div class="modern-ruling-card mrc-theme-' + cnf.theme + '">' +
            '  <div class="mrc-gradient"></div>' +
            '  <div class="mrc-bg-graphic"></div>' +
            '  <div class="mrc-content">' +
            '    <div class="mrc-top">' +
            '      <div class="mrc-icon-circle">' + cnf.icon + '</div>' +
            '      <div class="mrc-title">' + finalTitle + '</div>' +
            '    </div>' +
            '    <div class="mrc-bottom">' +
            subtitleHtml +
            pillHtml +
            '    </div>' +
            '  </div>' +
            '</div>';
        });

        wrap.innerHTML = htmlOut;
      }

      function applyLang() {
        i18nEls.forEach(function (el) {
          var k = el.getAttribute("data-i18n");
          el.innerHTML = lang === "en" ? (EN[k] !== undefined ? EN[k] : URDU_SNAPSHOT[k]) : URDU_SNAPSHOT[k];
        });
        noteBoxes.forEach(function (div, i) { setNbText(div, lang === "en" ? nbEnglish[i] : nbUrdu[i]); });
        document.documentElement.setAttribute("lang", lang === "en" ? "en" : "ur");
        var toggleBtn = document.getElementById("langToggle");
        if (toggleBtn) toggleBtn.textContent = lang === "en" ? "UR" : "EN";
        renderDateLine();
        cachedPrayers = renderPrayerRow();
        updateCountdown(cachedPrayers);
        updateLivePrayerWidget(cachedPrayers);
        renderHomeNotes();
      }

      var PICONS = {
        fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v3M4.2 11H2m20 0h-2.2M5.6 5.6l1.6 1.6m9.6-1.6-1.6 1.6M4 19h16M7 15a5 5 0 0 1 10 0"/></svg>',
        sunrise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="17" r="3.2"/><path d="M12 9.5V7M6.3 11.8l-1.6-1.6M17.7 11.8l1.6-1.6M2.5 17h2M19.5 17h2M4 21h16"/></svg>',
        dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 12h-2M21.8 12h-2M5.9 5.9l1.4 1.4M16.7 16.7l1.4 1.4M5.9 18.1l1.4-1.4M16.7 7.3l1.4-1.4"/></svg>',
        asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="15" r="4"/><path d="M12 3v2.2M4.5 8.5l1.5 1.5M19.5 8.5 18 10M2.5 15h2M19.5 15h2"/></svg>',
        maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 17h16M6 17a6 6 0 0 1 12 0M9 6l3-3 3 3M12 3v9"/></svg>',
        isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M18 12.5A7 7 0 1 1 11.5 6 5.4 5.4 0 0 0 18 12.5Z"/></svg>'
      };

      function pad2(n) { return n < 10 ? "0" + n : "" + n; }


      function todayRow() {
        var d = new Date(), midx = d.getMonth(), day = d.getDate();
        var days = MONTHS[monthOrder[midx]];
        if (!days || !days[day - 1]) return null;
        return { row: days[day - 1], midx: midx, day: day, date: d, location: false };
      }

      function to12(h) {
        var ampm = h < 12 ? "AM" : "PM";
        var hh = h % 12; if (hh === 0) hh = 12;
        return { hh: hh, ampm: ampm };
      }

      function renderPrayerRow() {
        var info = todayRow();
        var wrap = document.getElementById('prayerRow');
        if (!info) { wrap.innerHTML = ''; return; }
        var row = info.row;
        var fh = row[0], fm = row[1], sh = row[2], sm = row[3], zh = row[4], zm = row[5], ah = row[6] + 12, am = row[7], mh = row[8] + 12, mm = row[9], ih = row[10] + 12, im = row[11];

        var prayers = [
          { key: 'fajr', name: PNAMES.fajr[lang], h: fh, m: fm },
          { key: 'sunrise', name: PNAMES.sunrise[lang], h: sh, m: sm, displayOnly: true },
          { key: 'dhuhr', name: PNAMES.dhuhr[lang], h: zh, m: zm },
          { key: 'asr', name: PNAMES.asr[lang], h: ah, m: am },
          { key: 'maghrib', name: PNAMES.maghrib[lang], h: mh, m: mm },
          { key: 'isha', name: PNAMES.isha[lang], h: ih, m: im }
        ];

        var now = info.date;
        var nowMin = now.getHours() * 60 + now.getMinutes();
        var currentIdx = -1;
        for (var i = 0; i < prayers.length; i++) {
          if (prayers[i].displayOnly) continue;
          var pm = prayers[i].h * 60 + prayers[i].m;
          if (nowMin >= pm) currentIdx = i;
        }

        var html = '';
        prayers.forEach(function (p, idx) {
          var t12 = to12(p.h);
          var cls = 'p-card';
          if (p.displayOnly) cls += ' sunrise';
          else if (idx === currentIdx) {
            cls += ' current';
            cls += ' time-' + p.key;
          }
          html += '<div class="' + cls + '">'
            + '<div class="pt-ampm">' + t12.ampm + '</div>'
            + '<div class="pt-time">' + t12.hh + ':' + pad2(p.m) + '</div>'
            + '<div class="pt-icon">' + PICONS[p.key] + '</div>'
            + '<div class="pt-name">' + p.name + '</div>'
            + '</div>';
        });
        wrap.innerHTML = html;
        return prayers;
      }

      // Write text only when it actually changed: an identical textContent write still
      // replaces the text node and invalidates layout.
      function _setTxt(el, t) {
        if (el && el.textContent !== t) el.textContent = t;
      }

      function updateCountdown(prayers) {
        var el = document.getElementById('countdownLine');
        if (!prayers) { el.textContent = ''; return; }
        var now = new Date();
        var next = null;
        for (var i = 0; i < prayers.length; i++) {
          if (prayers[i].displayOnly) continue;
          var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayers[i].h, prayers[i].m, 0);
          if (t.getTime() > now.getTime()) { next = { name: prayers[i].name, t: t }; break; }
        }
        if (!next) {
          // tomorrow's fajr
          var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          var midx = tmr.getMonth(), day = tmr.getDate();
          var days = MONTHS[monthOrder[midx]];
          if (days && days[day - 1]) {
            var row = days[day - 1];
            next = { name: PNAMES.fajr[lang], t: new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), row[0], row[1], 0) };
          }
        }
        if (!next) { el.textContent = ''; return; }
        var diff = Math.max(0, next.t.getTime() - now.getTime());
        var s = Math.floor(diff / 1000);
        var hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
        var label = lang === 'en' ? ('until ' + next.name) : (next.name + ' تک');

        var timeEl = el.querySelector('.cd-time');
        var labelEl = el.querySelector('.cd-label');
        if (!timeEl || !labelEl) {
          el.innerHTML = '<span class="cd-time"></span> <span class="cd-label"></span>';
          timeEl = el.querySelector('.cd-time');
          labelEl = el.querySelector('.cd-label');
        }
        _setTxt(timeEl, pad2(hh) + ':' + pad2(mm) + ':' + pad2(ss));
        _setTxt(labelEl, '· ' + label);
      }

      function renderDateLine() {
        var d = new Date();
        var wk = lang === 'en' ? weekdaysEN[d.getDay()] : weekdays[d.getDay()];
        var gm = lang === 'en' ? gregMonthsEN[d.getMonth()] : gregMonths[d.getMonth()];
        var g = d.getDate() + ' - ' + (d.getMonth() + 1) + ' - ' + d.getFullYear();

        var dateLineEl = document.getElementById('dateLine');
        if (dateLineEl) {
          dateLineEl.textContent = wk + ' • ' + g;
          dateLineEl.style.direction = 'ltr';
          dateLineEl.style.unicodeBidi = 'isolate';
          dateLineEl.setAttribute('dir', 'ltr');
        }

        var gregEl = document.getElementById('gregValue');
        if (gregEl) {
          var day = d.getDate();
          var year = d.getFullYear();
          // Enforce Day Month Year order with LTR isolation (e.g., 26 August 2026)
          gregEl.textContent = day + ' ' + gm + ' ' + year;
          gregEl.style.direction = 'ltr';
          gregEl.style.unicodeBidi = 'isolate';
          gregEl.setAttribute('dir', 'ltr');
        }

        var hijriEl = document.getElementById('hijriValue');

        // Android-safe Gregorian → Hijri conversion.
        function gregorianToHijri(date) {
          var gy = date.getFullYear();
          var gm = date.getMonth() + 1;
          var gd = date.getDate();

          var a = Math.floor((14 - gm) / 12);
          var y = gy + 4800 - a;
          var m = gm + 12 * a - 3;

          var jd = gd
            + Math.floor((153 * m + 2) / 5)
            + 365 * y
            + Math.floor(y / 4)
            - Math.floor(y / 100)
            + Math.floor(y / 400)
            - 32045;

          var l = jd - 1948440 + 10632;
          var n = Math.floor((l - 1) / 10631);
          l = l - 10631 * n + 354;

          var j =
            (Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719))
            + (Math.floor(l / 5670) * Math.floor((43 * l) / 15238));

          l = l
            - (Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50))
            - (Math.floor(j / 16) * Math.floor((15238 * j) / 43))
            + 29;

          var hm = Math.floor((24 * l) / 709);
          var hd = l - Math.floor((709 * hm) / 24);
          var hy = 30 * n + j - 30;

          return { day: hd, month: hm, year: hy };
        }

        var hijriMonthsEN = [
          'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
          'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha’ban',
          'Ramadan', 'Shawwal', 'Dhu al-Qi’dah', 'Dhu al-Hijjah'
        ];

        var hijriMonthsUR = [
          'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی',
          'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان',
          'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'
        ];

        try {
          var h = gregorianToHijri(d);
          var hm = lang === 'en'
            ? hijriMonthsEN[h.month - 1]
            : hijriMonthsUR[h.month - 1];
          hijriEl.textContent = h.day + ' ' + hm + ' ' + h.year;
        } catch (e) {
          hijriEl.textContent = '—';
        }
      }

      function updateLivePrayerWidget(prayers) {
        var box = document.getElementById('livePrayerWidget');
        if (!box || !prayers) return;
        var now = new Date(), next = null, current = null;
        for (var i = 0; i < prayers.length; i++) {
          if (prayers[i].displayOnly) continue;
          var pt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayers[i].h, prayers[i].m, 0);
          if (pt.getTime() <= now.getTime()) current = prayers[i];
          if (!next && pt.getTime() > now.getTime()) next = { p: prayers[i], t: pt };
        }
        if (!next) {
          var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), info = todayRow();
          var days = MONTHS[monthOrder[tmr.getMonth()]], row = days && days[tmr.getDate() - 1];
          if (row) next = { p: { key: 'fajr', name: PNAMES.fajr[lang], h: row[0], m: row[1] }, t: new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), row[0], row[1], 0) };
        }
        if (!next) return;
        var diff = Math.max(0, next.t.getTime() - now.getTime()), total = Math.floor(diff / 1000);
        var hh = Math.floor(total / 3600), mm = Math.floor((total % 3600) / 60), ss = total % 60;
        var name = document.getElementById('livePrayerName'), cd = document.getElementById('livePrayerCountdown'), tm = document.getElementById('livePrayerTime'), nx = document.getElementById('livePrayerNext'), pr = document.getElementById('livePrayerProgress'), status = document.getElementById('livePrayerStatus');
        _setTxt(name, next.p.name);
        _setTxt(cd, pad2(hh) + ':' + pad2(mm) + ':' + pad2(ss));
        var t12 = to12(next.p.h);
        _setTxt(tm, t12.hh + ':' + pad2(next.p.m) + ' ' + t12.ampm);
        if (current) _setTxt(nx, (lang === 'en' ? 'Current: ' + current.name + ' • Next prayer' : 'موجودہ: ' + current.name + ' • اگلی نماز: ' + next.p.name));
        else _setTxt(nx, (lang === 'en' ? 'Next prayer' : 'اگلی نماز') + ' • ' + next.p.name);
        _setTxt(status, 'LIVE');
        // --- PROGRESS BAR CALCULATION FIX ---
        if (pr && next && next.t) {
          var prevTime = null;

          // Search backwards for the most recent valid Farz prayer time today
          for (var j = prayers.length - 1; j >= 0; j--) {
            if (prayers[j].displayOnly) continue;
            var pt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayers[j].h, prayers[j].m, 0);
            if (pt.getTime() <= now.getTime()) {
              prevTime = pt;
              break;
            }
          }

          // If before Fajr or between midnight & Fajr, fall back to yesterday's Isha
          if (!prevTime) {
            for (var k = prayers.length - 1; k >= 0; k--) {
              if (!prayers[k].displayOnly) {
                prevTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, prayers[k].h, prayers[k].m, 0);
                break;
              }
            }
          }

          if (prevTime) {
            var totalSpan = next.t.getTime() - prevTime.getTime();
            var timePassed = now.getTime() - prevTime.getTime();

            if (totalSpan > 0) {
              var pct = Math.max(0, Math.min(100, (timePassed / totalSpan) * 100));
              pr.style.transform = 'scaleX(' + (pct / 100).toFixed(4) + ')';
            }
          }
        }
      }

      function renderClock() {
        var d = new Date();
        _setTxt(document.getElementById('liveClock'), pad2(d.getHours()) + ':' + pad2(d.getMinutes()));
      }

      var cachedPrayers = null;
      var lastPrayerRenderKey = '';
      function prayerRenderKey() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes();
      }
      function tick() {
        renderClock();
        var key = prayerRenderKey();
        // Prayer cards are time-sensitive. Re-render them automatically when the
        // minute changes so the highlighted card changes at the actual prayer
        // entry time without requiring Settings -> Update.
        if (key !== lastPrayerRenderKey) {
          cachedPrayers = renderPrayerRow();
          lastPrayerRenderKey = key;
          renderHomeNotes();
        }
        updateCountdown(cachedPrayers);
        updateLivePrayerWidget(cachedPrayers);
      }

      function highlightTodayInCalendar() {
        var d = new Date();
        var midx = d.getMonth();
        var day = d.getDate();

        // Automatically select the current month.
        var monthRadio = document.getElementById('cm' + midx);
        if (monthRadio) monthRadio.checked = true;

        // Remove any previous date highlight, then highlight today.
        document.querySelectorAll('.cal-table tbody tr.calendar-today').forEach(function (row) {
          row.classList.remove('calendar-today');
        });

        var panel = document.getElementById('panel-cm' + midx);
        if (!panel) return;
        var todayRowEl = panel.querySelector('tbody tr[data-day="' + day + '"]');
        if (todayRowEl) todayRowEl.classList.add('calendar-today');
      }

      function stopHomeTicker() {
        if (window._homeInterval) {
          clearInterval(window._homeInterval);
          window._homeInterval = null;
        }
      }

      function initHome() {
        highlightTodayInCalendar();
        applyLang();
        tick();
        if (!window._homeInterval) {
          window._homeInterval = setInterval(function () {
            // Never spend JS/layout time updating the hidden home tab.
            var home = document.getElementById('tab-home');
            if (!home || !home.classList.contains('active') || document.hidden) return;
            tick();
          }, 1000);
        }
      }
      // Initialize home immediately so all DOM prayer times & cards are rendered under the splash screen
      try { initHome(); } catch (e) { }

      var langToggleBtn = document.getElementById('langToggle');
      if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function () {
          lang = lang === 'en' ? 'ur' : 'en';
          try { localStorage.setItem(LANG_KEY, lang); } catch (e) { }
          applyLang();
        });
      }

      // ---- Tabs ----
      /* Manzil reading font-size control */
      (function () {
        var key = "manzil_font_size_v1";
        var allowed = ["24", "27", "30"];
        var saved = null;
        try { saved = localStorage.getItem(key); } catch (e) { }
        if (allowed.indexOf(saved) < 0) saved = "27";
        document.documentElement.style.setProperty("--manzil-font-size", saved + "px");

        function setManzilFontSize(size) {
          if (allowed.indexOf(String(size)) < 0) return;
          document.documentElement.style.setProperty("--manzil-font-size", String(size) + "px");
          try { localStorage.setItem(key, String(size)); } catch (e) { }
          document.querySelectorAll("[data-manzil-font]").forEach(function (btn) {
            btn.classList.toggle("active", btn.getAttribute("data-manzil-font") === String(size));
          });
        }

        document.addEventListener("click", function (e) {
          var btn = e.target.closest && e.target.closest("[data-manzil-font]");
          if (btn) setManzilFontSize(btn.getAttribute("data-manzil-font"));
        });

        setManzilFontSize(saved);
      })();

      var tabs = ['home', 'calendar', 'hadith', 'settings', 'about', 'articles', 'qibla', 'zikr', 'manzil', 'duas', 'library'];

      // === UTILITY: escapeHtml ===
      function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      // === TAB SWITCHING ===
      function showTab(name) {
        // Open native Qibla Screen directly
        if (name === 'qibla') {
          if (window.QurbBridge && typeof window.QurbBridge.postMessage === 'function') {
            try {
              window.QurbBridge.postMessage(JSON.stringify({ action: 'openQibla' }));
              return;
            } catch (e) {
              console.warn('Bridge openQibla error:', e);
            }
          }
        }

        tabs.forEach(function (t) {
          var panel = document.getElementById('tab-' + t);
          if (panel) panel.classList.toggle('active', t === name);
        });
        document.querySelectorAll('.glass-nav-item').forEach(function (btn) {
          btn.classList.toggle('active', btn.dataset.tab === name);
        });
        window.scrollTo(0, 0);

        if (name === 'home') {
          if (typeof initHome === 'function') initHome();
        } else if (typeof stopHomeTicker === 'function') {
          stopHomeTicker();
        }

        if (name !== 'qibla') {
          if (typeof qStopCamera === 'function') qStopCamera();
          if (typeof qStopOrientation === 'function') qStopOrientation();
        }

        if (name === 'hadith' && typeof initHadith === 'function') initHadith();
        if (name === 'duas' && typeof initDuasLibrary === 'function') initDuasLibrary();
        if (name === 'library' && typeof initLibrary === 'function') initLibrary();
        if (name === 'qibla' && typeof startQiblaFinder === 'function') startQiblaFinder();
        if (name === 'manzil' && typeof initManzil === 'function') initManzil();
        if (name === 'zikr' && typeof initZikrBook === 'function') initZikrBook();
        if (name === 'articles' && typeof loadArticles === 'function') loadArticles();
        if (name === 'calendar' && typeof highlightTodayInCalendar === 'function') highlightTodayInCalendar();
      }

      // App theme state (formerly tied to the removed Quran module).
      var appThemeState = { theme: 'dark' };

      // === NAV BAR CLICK HANDLER ===
      document.querySelectorAll('.glass-nav-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = btn.getAttribute('data-tab');
          if (tab === 'qibla' && typeof qRequestMotionPermissionOnGesture === 'function') {
            qRequestMotionPermissionOnGesture();
          }
          if (tab) showTab(tab);
        });
      });

      // === SHOW TOAST HELPER (if not already defined) ===
      if (typeof window.showToast !== 'function') {
        window.showToast = function (msg) {
          var t = document.getElementById('toast');
          if (!t) {
            t = document.createElement('div');
            t.id = 'toast';
            t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1C130D;color:#D4AF37;padding:10px 24px;border-radius:20px;border:1px solid #382517;font-size:0.85rem;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;text-align:center;max-width:90vw;';
            document.body.appendChild(t);
          }
          t.textContent = msg;
          t.style.opacity = '1';
          clearTimeout(t._timer);
          t._timer = setTimeout(function () { t.style.opacity = '0'; }, 2500);
        };
      }



      // ================= 40 MASNOON DUAS CURATED OFFLINE DATASET =================

      // ================= COMPLETE ISLAMIC DATASETS =================
      var MASNOON_40_DUAS = window.QURB_DATA.MASNOON_40_DUAS;

      var HADITH_NAWAWI_40 = window.QURB_DATA.HADITH_NAWAWI_40;



      // ================= 1. KUTTUB KHANA / STITCH ISLAMIC DIGITAL LIBRARY & READER =================
      var ISLAMIC_LIBRARY_BOOKS = [
        {
          id: "hisn_muslim",
          category: "duas",
          categoryUr: "دعائیں و اذکار",
          title: "حصن المسلم — مسنون دعائیں",
          author: "فضیلۃ الشیخ سعید بن علی بن وہف القحطانیؒ",
          pages: 132,
          size: "3.4 MB",
          icon: "📖",
          tag: "عربی مع اردو ترجمہ",
          desc: "قرآن و سنت کی مستند دعاؤں کا جامع مجموعہ",
          progress: 65
        },
        {
          id: "arbain_nawawi",
          category: "hadith",
          categoryUr: "حدیث شریف",
          title: "الأربعون النووية — 40 احادیث نبویہ",
          author: "امام ابو زکریا یحییٰ بن شرف النوویؒ",
          pages: 48,
          size: "2.1 MB",
          icon: "📜",
          tag: "مستند احادیث",
          desc: "دینِ اسلام کے بنیادی اصولوں پر مشتمل چالیس جامع احادیث",
          progress: 100
        },
        {
          id: "subah_sham_azkar",
          category: "duas",
          categoryUr: "دعائیں و اذکار",
          title: "صبح و شام کے مسنون اذکار",
          author: "تالیف: مفتی معاذ ہارون حفظہ اللہ",
          pages: 24,
          size: "1.5 MB",
          icon: "🤲",
          tag: "حفاظت و برکت",
          desc: "صبح و شام حفاظت اور برکت کے مسنون اذکار و وظائف",
          progress: 40
        },
        {
          id: "quran_tajweed",
          category: "quran",
          categoryUr: "قرآنی علوم",
          title: "قرآن مجید تجوید و قواعد",
          author: "ادارہ تجوید القرآن الکریم",
          pages: 64,
          size: "2.8 MB",
          icon: "📗",
          tag: "تجوید و مخارج",
          desc: "قرآن مجید کو درست مخارج اور صفات کے ساتھ پڑھنے کے قواعد",
          progress: 25
        },
        {
          id: "masail_salah",
          category: "fiqh",
          categoryUr: "فقہ و مسائل",
          title: "مسائلِ نماز و طہارت",
          author: "مفتی معاذ ہارون حفظہ اللہ",
          pages: 96,
          size: "3.1 MB",
          icon: "🕌",
          tag: "فقہی رہنمائی",
          desc: "وضو، غسل اور نماز کے ضروری مسائل و احکام",
          progress: 10
        },
        {
          id: "seerat_nabi",
          category: "seerat",
          categoryUr: "سیرتِ طیبہ",
          title: "سیرت النبی ﷺ کا خلاصہ",
          author: "مولانا صفی الرحمن مبارکپوریؒ",
          pages: 80,
          size: "2.9 MB",
          icon: "✨",
          tag: "حیاتِ طیبہ",
          desc: "رسول اللہ ﷺ کی حیاتِ مبارکہ کا جامع اور دلنشین خلاصہ",
          progress: 0
        }
      ];

      var libState = {
        activeCategory: 'all',
        searchQuery: '',
        customBooks: [],
        blobUrls: {},
        activeReaderUrl: null
      };

      // --- IndexedDB for Persistent PDF File Storage ---
      var pdfDbPromise = null;
      function getPdfDb() {
        if (pdfDbPromise) return pdfDbPromise;
        pdfDbPromise = new Promise(function (resolve, reject) {
          if (!window.indexedDB) { resolve(null); return; }
          var req = indexedDB.open('qurb_pdf_storage_v1', 1);
          req.onupgradeneeded = function (e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains('pdf_blobs')) {
              db.createObjectStore('pdf_blobs', { keyPath: 'id' });
            }
          };
          req.onsuccess = function (e) { resolve(e.target.result); };
          req.onerror = function () { resolve(null); };
        });
        return pdfDbPromise;
      }

      function storePdfBlob(id, fileBlob) {
        return getPdfDb().then(function (db) {
          if (!db) return false;
          return new Promise(function (resolve) {
            try {
              var tx = db.transaction(['pdf_blobs'], 'readwrite');
              var store = tx.objectStore('pdf_blobs');
              store.put({ id: id, blob: fileBlob, date: Date.now() });
              tx.oncomplete = function () { resolve(true); };
              tx.onerror = function () { resolve(false); };
            } catch (e) { resolve(false); }
          });
        });
      }

      function retrievePdfBlob(id) {
        return getPdfDb().then(function (db) {
          if (!db) return null;
          return new Promise(function (resolve) {
            try {
              var tx = db.transaction(['pdf_blobs'], 'readonly');
              var store = tx.objectStore('pdf_blobs');
              var req = store.get(id);
              req.onsuccess = function (e) {
                resolve(e.target.result ? e.target.result.blob : null);
              };
              req.onerror = function () { resolve(null); };
            } catch (e) { resolve(null); }
          });
        });
      }

      function loadCustomBooks() {
        try {
          var saved = localStorage.getItem('qurb_custom_library_books_v1');
          if (saved) {
            libState.customBooks = JSON.parse(saved) || [];
          }
        } catch (e) { }
      }

      function saveCustomBooks() {
        try {
          localStorage.setItem('qurb_custom_library_books_v1', JSON.stringify(libState.customBooks));
        } catch (e) { }
      }

      function initLibrary() {
        loadCustomBooks();
        renderLibraryCategories();
        renderRecentlyRead();
        renderLibraryGrid();
        initPdfReaderModal();

        var countBadge = document.getElementById('libBookCount');
        if (countBadge) {
          countBadge.textContent = (ISLAMIC_LIBRARY_BOOKS.length + libState.customBooks.length);
        }

        var search = document.getElementById('librarySearch');
        if (search && !search.dataset.bound) {
          search.dataset.bound = '1';
          search.addEventListener('input', function () {
            libState.searchQuery = search.value.toLowerCase().trim();
            renderLibraryGrid();
          });
        }

        var importCard = document.getElementById('stitchImportCard');
        var importBtn = document.getElementById('libImportPdfBtn');
        var fileInput = document.getElementById('libFileInput');

        function triggerImport() {
          if (window.QurbBridge) {
            window.QurbBridge.postMessage(JSON.stringify({ action: 'openPdfLibrary' }));
          } else if (fileInput) {
            fileInput.click();
          }
        }

        if (importBtn && !importBtn.dataset.bound) {
          importBtn.dataset.bound = '1';
          importBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            triggerImport();
          });
        }

        if (importCard && !importCard.dataset.bound) {
          importCard.dataset.bound = '1';
          importCard.addEventListener('click', function () {
            triggerImport();
          });
        }

        if (fileInput && !fileInput.dataset.bound) {
          fileInput.dataset.bound = '1';
          fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files[0]) {
              var f = fileInput.files[0];
              var bookId = 'custom_' + Date.now();
              var objectUrl = URL.createObjectURL(f);
              libState.blobUrls[bookId] = objectUrl;

              // Store in IndexedDB for permanent access across reloads
              storePdfBlob(bookId, f);

              var newBook = {
                id: bookId,
                category: 'imported',
                categoryUr: 'مقامی کتب',
                title: f.name.replace(/\.pdf$/i, ''),
                author: 'مقامی امپورٹ شدہ کتاب',
                pages: 1,
                size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
                icon: '📄',
                tag: 'مقامی فائل',
                desc: 'آپ کی امپورٹ کردہ PDF کتاب',
                dateAdded: Date.now(),
                progress: 10
              };
              libState.customBooks.unshift(newBook);
              saveCustomBooks();
              renderRecentlyRead();
              renderLibraryGrid();
              if (countBadge) countBadge.textContent = (ISLAMIC_LIBRARY_BOOKS.length + libState.customBooks.length);
              showToast('کتاب لائبریری میں شامل ہوگئی: ' + newBook.title);

              // Immediately open the imported PDF
              openPdfInReader(objectUrl, newBook.title);
            }
          });
        }
      }

      function initPdfReaderModal() {
        var closeBtn = document.getElementById('stitchReaderCloseBtn');
        var newTabBtn = document.getElementById('stitchReaderNewTabBtn');
        var aaBtn = document.getElementById('appleBooksAaBtn');
        var popover = document.getElementById('appleBooksAppearancePopover');
        var modal = document.getElementById('stitchPdfReaderModal');
        var frame = document.getElementById('stitchPdfFrame');
        var topbar = document.getElementById('appleBooksTopbar');
        var scrubber = document.getElementById('appleBooksScrubber');
        var viewport = document.getElementById('stitchReaderViewport');

        if (closeBtn && !closeBtn.dataset.bound) {
          closeBtn.dataset.bound = '1';
          closeBtn.addEventListener('click', function () {
            if (modal) modal.classList.remove('show');
            if (frame) frame.src = 'about:blank';
            if (popover) popover.classList.remove('show');
          });
        }

        if (newTabBtn && !newTabBtn.dataset.bound) {
          newTabBtn.dataset.bound = '1';
          newTabBtn.addEventListener('click', function () {
            if (libState.activeReaderUrl) {
              window.open(libState.activeReaderUrl, '_blank');
            }
          });
        }

        if (aaBtn && popover && !aaBtn.dataset.bound) {
          aaBtn.dataset.bound = '1';
          aaBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            popover.classList.toggle('show');
          });
        }

        // Theme Switchers
        if (popover && !popover.dataset.bound) {
          popover.dataset.bound = '1';
          Array.prototype.forEach.call(popover.querySelectorAll('.apple-theme-dot'), function (dot) {
            dot.addEventListener('click', function (e) {
              e.stopPropagation();
              var t = dot.getAttribute('data-theme');
              if (modal) {
                modal.className = 'show theme-' + t;
              }
              Array.prototype.forEach.call(popover.querySelectorAll('.apple-theme-dot'), function (d) {
                d.classList.remove('active');
              });
              dot.classList.add('active');
              try { localStorage.setItem('apple_books_web_theme', t); } catch (e) { }
            });
          });
        }

        // Tap on viewport to toggle controls (Apple Books Chrome)
        if (viewport && !viewport.dataset.bound) {
          viewport.dataset.bound = '1';
          viewport.addEventListener('click', function (e) {
            if (popover && popover.classList.contains('show')) {
              popover.classList.remove('show');
              return;
            }
            if (topbar) topbar.classList.toggle('hide-controls');
            if (scrubber) scrubber.classList.toggle('hide-controls');
          });
        }
      }

      function openPdfInReader(url, title) {
        var modal = document.getElementById('stitchPdfReaderModal');
        var frame = document.getElementById('stitchPdfFrame');
        var titleEl = document.getElementById('stitchReaderTitle');

        if (titleEl) titleEl.textContent = title || 'PDF Document';
        libState.activeReaderUrl = url;

        if (frame) {
          frame.src = url;
        }
        if (modal) {
          modal.classList.add('show');
        }
      }

      function renderRecentlyRead() {
        var sec = document.getElementById('stitchRecentSection');
        var scroll = document.getElementById('stitchRecentScroll');
        if (!sec || !scroll) return;

        var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
        var recent = allBooks.filter(function (b) { return (b.progress && b.progress > 0); });

        if (!recent.length) {
          sec.style.display = 'none';
          return;
        }

        sec.style.display = 'block';
        scroll.innerHTML = recent.map(function (b) {
          return '<div class="stitch-recent-card" data-bookid="' + b.id + '">' +
            '<div class="stitch-recent-top">' +
            '<div class="stitch-recent-thumb">' + b.icon + '</div>' +
            '<div class="stitch-recent-info">' +
            '<div class="stitch-recent-book-title">' + escapeHtml(b.title) + '</div>' +
            '<div class="stitch-recent-meta">' + escapeHtml(b.size) + ' • ' + escapeHtml(b.pages + ' pages') + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="stitch-progress-wrap">' +
            '<div class="stitch-progress-labels">' +
            '<span>Reading</span>' +
            '<span>' + b.progress + '%</span>' +
            '</div>' +
            '<div class="stitch-progress-track">' +
            '<div class="stitch-progress-bar" style="width:' + b.progress + '%;"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        }).join('');

        Array.prototype.forEach.call(scroll.querySelectorAll('.stitch-recent-card'), function (card) {
          card.addEventListener('click', function () {
            var id = card.getAttribute('data-bookid');
            openLibraryBook(id);
          });
        });
      }

      function renderLibraryCategories() {
        var wrap = document.getElementById('libraryCategoryFilters');
        if (!wrap) return;
        var cats = [
          { id: 'all', label: 'All (تمام کتب)' },
          { id: 'quran', label: 'Quran (قرآنی علوم)' },
          { id: 'hadith', label: 'Hadith (حدیث شریف)' },
          { id: 'duas', label: 'Duas (دعائیں و اذکار)' },
          { id: 'fiqh', label: 'Fiqh (فقہ و مسائل)' },
          { id: 'seerat', label: 'Seerat (سیرتِ طیبہ)' },
          { id: 'imported', label: 'Imported (امپورٹ شدہ)' }
        ];

        wrap.innerHTML = cats.map(function (c) {
          var isAct = (c.id === libState.activeCategory);
          return '<button type="button" class="stitch-chip ' + (isAct ? 'active' : '') + '" data-libcat="' + c.id + '">' + c.label + '</button>';
        }).join('');

        Array.prototype.forEach.call(wrap.querySelectorAll('.stitch-chip'), function (btn) {
          btn.addEventListener('click', function () {
            libState.activeCategory = btn.getAttribute('data-libcat');
            renderLibraryCategories();
            renderLibraryGrid();
          });
        });
      }

      function renderLibraryGrid() {
        var grid = document.getElementById('libraryBooksGrid');
        if (!grid) return;

        var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
        var filtered = allBooks.filter(function (b) {
          var matchCat = (libState.activeCategory === 'all' || b.category === libState.activeCategory);
          if (!matchCat) return false;
          if (!libState.searchQuery) return true;
          var blob = [b.title, b.author, b.desc, b.categoryUr, b.tag].join(' ').toLowerCase();
          return blob.indexOf(libState.searchQuery) >= 0;
        });

        if (!filtered.length) {
          grid.innerHTML = '<div class="stitch-empty-library">کوئی کتاب نہیں ملی۔ (No books found)</div>';
          return;
        }

        grid.innerHTML = filtered.map(function (b) {
          return '<div class="stitch-book-card" data-bookid="' + b.id + '">' +
            '<div class="stitch-book-cover">' +
            '<span>' + b.icon + '</span>' +
            '<span class="stitch-book-badge">' + escapeHtml(b.categoryUr) + '</span>' +
            '</div>' +
            '<div class="stitch-book-body">' +
            '<div>' +
            '<h4 class="stitch-book-title">' + escapeHtml(b.title) + '</h4>' +
            '<p class="stitch-book-author">' + escapeHtml(b.author) + '</p>' +
            '</div>' +
            '<div class="stitch-book-meta">' +
            '<span>' + escapeHtml(b.pages + ' صفحات') + '</span>' +
            '<span>' + escapeHtml(b.size) + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        }).join('');

        Array.prototype.forEach.call(grid.querySelectorAll('.stitch-book-card'), function (card) {
          card.addEventListener('click', function () {
            var id = card.getAttribute('data-bookid');
            openLibraryBook(id);
          });
        });
      }

      function openLibraryBook(bookId) {
        if (window.QurbBridge) {
          window.QurbBridge.postMessage(JSON.stringify({ action: 'openPdfLibrary', bookId: bookId }));
          return;
        }
        var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
        var book = allBooks.find(function (b) { return b.id === bookId; });
        if (!book) return;

        if (book.category === 'imported' || bookId.indexOf('custom_') === 0) {
          // Open imported PDF from memory or IndexedDB
          if (libState.blobUrls[bookId]) {
            openPdfInReader(libState.blobUrls[bookId], book.title);
          } else {
            retrievePdfBlob(bookId).then(function (blob) {
              if (blob) {
                var url = URL.createObjectURL(blob);
                libState.blobUrls[bookId] = url;
                openPdfInReader(url, book.title);
              } else {
                showToast('PDF فائل لوڈ کی جارہی ہے: ' + book.title);
                openPdfInReader('about:blank', book.title);
              }
            });
          }
          return;
        }

        if (bookId === 'arbain_nawawi') {
          showTab('hadith');
          initHadith();
        } else if (bookId === 'hisn_muslim' || bookId === 'subah_sham_azkar') {
          showTab('duas');
          initDuasLibrary();
        } else if (bookId === 'quran_tajweed') {
          showToast('قرآن ریڈر اس ورژن میں دستیاب نہیں ہے۔');
        } else {
          showToast('مطالعہ کتاب: ' + book.title);
        }
      }
      window.initLibrary = initLibrary;
      window.openLibraryBook = openLibraryBook;

      // ================= 2. DUA MODULE (40 MASNOON DUAS SLIDING CAROUSEL) =================
      var duaCarouselState = {
        currentIndex: 0,
        filteredItems: (typeof MASNOON_40_DUAS !== 'undefined' ? MASNOON_40_DUAS.slice() : []),
        activeCategory: 'all'
      };

      function initDuasLibrary() {
        if (typeof MASNOON_40_DUAS !== 'undefined' && (!duaCarouselState.filteredItems || !duaCarouselState.filteredItems.length)) {
          duaCarouselState.filteredItems = MASNOON_40_DUAS.slice();
        }
        renderDuaCategoryFilters();
        renderDuasCarousel();
        setupDuaGestures();
      }

      function renderDuaCategoryFilters() {
        var filterWrap = document.getElementById('duasCategoryFilters');
        if (!filterWrap) return;
        var categories = [
          { id: 'all', label: 'تمام دعائیں (40)' },
          { id: 'صبح و شام', label: 'صبح و شام' },
          { id: 'روزمرہ', label: 'روزمرہ' },
          { id: 'نماز و وضو', label: 'نماز و وضو' },
          { id: 'کھانا و پینا', label: 'کھانا پینا' },
          { id: 'سفر و سواری', label: 'سفر' },
          { id: 'پریشانی و حفاظت', label: 'حفاظت و استعاذہ' },
          { id: 'استغفار و توبہ', label: 'استغفار' },
          { id: 'قرآنی دعائیں', label: 'قرآنی دعائیں' }
        ];

        filterWrap.innerHTML = categories.map(function (c) {
          var isAct = (c.id === duaCarouselState.activeCategory);
          return '<button type="button" class="duas-filter-pill ' + (isAct ? 'active' : '') + '" data-duacat="' + c.id + '">' + c.label + '</button>';
        }).join('');

        Array.prototype.forEach.call(filterWrap.querySelectorAll('.duas-filter-pill'), function (btn) {
          btn.addEventListener('click', function () {
            duaCarouselState.activeCategory = btn.getAttribute('data-duacat');
            duaCarouselState.currentIndex = 0;
            filterDuas();
            renderDuaCategoryFilters();
          });
        });

        var search = document.getElementById('duasSearch');
        if (search && !search.dataset.bound) {
          search.dataset.bound = '1';
          search.addEventListener('input', function () {
            filterDuas();
          });
        }
      }

      function filterDuas() {
        var search = document.getElementById('duasSearch');
        var query = (search ? search.value : '').toLowerCase().trim();
        var cat = duaCarouselState.activeCategory;

        duaCarouselState.filteredItems = MASNOON_40_DUAS.filter(function (d) {
          var matchCat = (cat === 'all' || d.category === cat);
          if (!matchCat) return false;
          if (!query) return true;
          var blob = [d.titleUr, d.titleEn, d.arabic, d.transliteration, d.urdu, d.translation, d.source, d.category].join(' ').toLowerCase();
          return blob.indexOf(query) >= 0;
        });

        duaCarouselState.currentIndex = 0;
        renderDuasCarousel();
      }

      function renderDuasCarousel() {
        var container = document.getElementById('duasContainer');
        if (!container) return;

        var items = duaCarouselState.filteredItems;
        if (!items.length) {
          container.innerHTML = '<div style="text-align:center;padding:40px 10px;color:#d1beac;">کوئی دعا نہیں ملی۔ (No Duas found)</div>';
          return;
        }

        var total = items.length;
        var idx = Math.min(Math.max(duaCarouselState.currentIndex, 0), total - 1);
        duaCarouselState.currentIndex = idx;
        var d = items[idx];

        var cardHtml = '<div class="dua-white-card" id="duaCardActive">' +
          '<div class="dua-card-top">' +
          '<span class="dua-badge-index">دعا ' + (d.id) + ' از 40</span>' +
          '<span class="dua-badge-cat">' + escapeHtml(d.category) + '</span>' +
          '<button type="button" class="dua-card-copy" onclick="copyDuaText(' + d.id + ')">' +
          '📋 کاپی (Copy)' +
          '</button>' +
          '</div>' +
          '<div class="dua-card-title-ur">' + escapeHtml(d.titleUr) + '</div>' +
          '<div class="dua-card-title-en">' + escapeHtml(d.titleEn) + '</div>' +
          '<div class="dua-arabic-box">' +
          '<p class="dua-card-arabic">' + escapeHtml(d.arabic) + '</p>' +
          '</div>' +
          '<div class="dua-card-translit">' + escapeHtml(d.transliteration) + '</div>' +
          '<div class="dua-card-urdu-trans">' + escapeHtml(d.urdu) + '</div>' +
          '<div class="dua-card-en-trans">' + escapeHtml(d.translation) + '</div>' +
          '<div class="dua-card-source">حوالہ: ' + escapeHtml(d.source) + '</div>' +
          '</div>';

        var navHtml = '<div class="duas-nav-bar">' +
          '<button type="button" class="duas-nav-btn" id="duaPrevBtn" title="Previous Dua">‹</button>' +
          '<div class="duas-nav-counter" id="duaCounterText">دعا ' + (idx + 1) + ' از ' + total + '</div>' +
          '<button type="button" class="duas-nav-btn" id="duaNextBtn" title="Next Dua">›</button>' +
          '</div>';

        container.innerHTML = cardHtml + navHtml;

        var prev = document.getElementById('duaPrevBtn');
        var next = document.getElementById('duaNextBtn');
        if (prev) {
          prev.addEventListener('click', function () {
            if (duaCarouselState.currentIndex > 0) {
              duaCarouselState.currentIndex--;
            } else {
              duaCarouselState.currentIndex = duaCarouselState.filteredItems.length - 1;
            }
            renderDuasCarousel();
          });
        }
        if (next) {
          next.addEventListener('click', function () {
            if (duaCarouselState.currentIndex < duaCarouselState.filteredItems.length - 1) {
              duaCarouselState.currentIndex++;
            } else {
              duaCarouselState.currentIndex = 0;
            }
            renderDuasCarousel();
          });
        }
      }

      function setupDuaGestures() {
        var container = document.getElementById('duasContainer');
        if (!container || container.dataset.touchBound) return;
        container.dataset.touchBound = '1';

        var touchStartX = 0;
        var touchEndX = 0;

        container.addEventListener('touchstart', function (e) {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', function (e) {
          touchEndX = e.changedTouches[0].screenX;
          var diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 45) {
            if (diff > 0) {
              if (duaCarouselState.currentIndex > 0) {
                duaCarouselState.currentIndex--;
              } else {
                duaCarouselState.currentIndex = duaCarouselState.filteredItems.length - 1;
              }
            } else {
              if (duaCarouselState.currentIndex < duaCarouselState.filteredItems.length - 1) {
                duaCarouselState.currentIndex++;
              } else {
                duaCarouselState.currentIndex = 0;
              }
            }
            renderDuasCarousel();
          }
        }, { passive: true });
      }

      function copyDuaText(id) {
        var d = MASNOON_40_DUAS.find(function (item) { return item.id === id; });
        if (!d) return;
        var text = d.titleUr + " (" + d.titleEn + ")\n\n" +
          d.arabic + "\n\n" +
          "تلفظ: " + d.transliteration + "\n\n" +
          "اردو: " + d.urdu + "\n\n" +
          "English: " + d.translation + "\n\n" +
          "حوالہ: " + d.source + " — Qurb Islamic App";

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showToast('دعا کاپی ہوگئی (Copied)');
          }).catch(function () {
            showToast('دعا کاپی ہوگئی');
          });
        } else {
          showToast('دعا کاپی ہوگئی');
        }
      }
      window.copyDuaText = copyDuaText;
      window.initDuasLibrary = initDuasLibrary;

      // ================= 4. HADITH MODULE (COMPLETE 40 HADITH AN-NAWAWI) =================
      var hadithFilterState = {
        activeCategory: 'all',
        searchQuery: ''
      };

      function initHadith() {
        renderHadithCategories();
        renderHadith();

        var search = document.getElementById('hadithSearch');
        if (search && !search.dataset.bound) {
          search.dataset.bound = '1';
          search.addEventListener('input', function () {
            hadithFilterState.searchQuery = search.value.toLowerCase().trim();
            renderHadith();
          });
        }
      }

      function renderHadithCategories() {
        var wrap = document.getElementById('hadithCategoryFilters');
        if (!wrap) return;
        var cats = [
          { id: 'all', label: 'تمام احادیث (40)' },
          { id: 'eman', label: 'ایمان و نیت' },
          { id: 'pillars', label: 'ارکانِ اسلام' },
          { id: 'halal', label: 'حلال و حرام' },
          { id: 'character', label: 'حسنِ اخلاق و احسان' },
          { id: 'taqwa', label: 'تقویٰ و ذکر' },
          { id: 'rights', label: 'حقوق العباد' }
        ];

        wrap.innerHTML = cats.map(function (c) {
          var isAct = (c.id === hadithFilterState.activeCategory);
          return '<button type="button" class="lib-chip ' + (isAct ? 'active' : '') + '" data-hcat="' + c.id + '">' + c.label + '</button>';
        }).join('');

        Array.prototype.forEach.call(wrap.querySelectorAll('.lib-chip'), function (btn) {
          btn.addEventListener('click', function () {
            hadithFilterState.activeCategory = btn.getAttribute('data-hcat');
            renderHadithCategories();
            renderHadith();
          });
        });
      }

      function renderHadith() {
        var wrap = document.getElementById('hadithList');
        if (!wrap) return;
        var q = hadithFilterState.searchQuery;
        var cat = hadithFilterState.activeCategory;
        wrap.innerHTML = '';
        var any = false;

        HADITH_NAWAWI_40.forEach(function (h) {
          var matchCat = (cat === 'all' || h.category === cat);
          if (!matchCat) return;

          var matchQuery = !q || (String(h.num) === q) ||
            (h.arabic.toLowerCase().indexOf(q) >= 0) ||
            (h.urdu.toLowerCase().indexOf(q) >= 0) ||
            (h.en.toLowerCase().indexOf(q) >= 0) ||
            (h.sourceUr.toLowerCase().indexOf(q) >= 0) ||
            (h.sourceEn.toLowerCase().indexOf(q) >= 0);

          if (!matchQuery) return;
          any = true;

          var card = document.createElement('article');
          card.className = 'hadith-card';
          card.innerHTML = '<div class="hadith-card-top">' +
            '<span class="hadith-badge">الحدیث ' + h.num + ' / 40</span>' +
            '<span class="hadith-source-badge">' + escapeHtml(h.sourceUr) + '</span>' +
            '</div>' +
            '<div class="hadith-arabic">' + escapeHtml(h.arabic) + '</div>' +
            '<div class="hadith-urdu">' + escapeHtml(h.urdu) + '</div>' +
            '<div class="hadith-en">' + escapeHtml(h.en) + '</div>' +
            '<div class="hadith-actions">' +
            '<button type="button" class="hadith-act-btn" data-hact="copy">کاپی حدیث (Copy)</button>' +
            '<button type="button" class="hadith-act-btn" data-hact="share">شیئر (Share)</button>' +
            '</div>';

          card.querySelector('[data-hact="copy"]').addEventListener('click', function () {
            var textToCopy = "الأربعون النووية — حدیث " + h.num + "\n\n" +
              h.arabic + "\n\n" +
              "اردو ترجمہ: " + h.urdu + "\n\n" +
              "English: " + h.en + "\n\n" +
              "حوالہ: " + h.sourceUr + "\n\n" +
              "— Qurb App";

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(textToCopy).then(function () {
                showToast('حدیث کاپی ہوگئی (Copied)');
              }).catch(function () {
                showToast('کاپی نہیں ہو سکی');
              });
            } else {
              showToast('حدیث کاپی ہوگئی');
            }
          });

          card.querySelector('[data-hact="share"]').addEventListener('click', function () {
            var textToShare = "الأربعون النووية — حدیث " + h.num + "\n\n" +
              h.arabic + "\n\n" +
              "اردو ترجمہ: " + h.urdu + "\n\n" +
              "English: " + h.en + "\n\n" +
              "حوالہ: " + h.sourceUr + "\n\n" +
              "— Qurb App";

            if (navigator.share) {
              navigator.share({ title: 'Hadith ' + h.num, text: textToShare }).catch(function () { });
            } else {
              showToast('حدیث کاپی ہوگئی');
            }
          });

          wrap.appendChild(card);
        });

        if (!any) {
          wrap.innerHTML = '<div style="text-align:center;padding:40px 10px;color:#d1beac;">کوئی حدیث نہیں ملی۔ (No Hadith found)</div>';
        }
      }
      window.initHadith = initHadith;
      window.renderHadith = renderHadith;


      // ================= 5. QIBLA COMPASS & AR DIRECTION FINDER =================
      var KAABA_LAT = 21.422487;
      var KAABA_LON = 39.826206;

      var qiblaState = {
        bearing: null,
        distanceKm: null,
        latitude: null,
        longitude: null,
        heading: null,
        stream: null,
        listening: false,
        active: false,
        aligned: false,
        lastHaptic: 0,
        startTime: 0,
        lastEventTime: 0,
        lastChangeTime: 0,
        isFrozen: false,
        sensorsAvailable: false,
        permissionGranted: false,
        permissionDenied: false
      };

      function qNorm(v) {
        var n = parseFloat(v);
        if (!isFinite(n)) return 0;
        n = n % 360;
        return n < 0 ? n + 360 : n;
      }

      // Exact Great Circle Initial Bearing (Forward Azimuth)
      function qBearing(lat, lon) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        if (!isFinite(lat) || !isFinite(lon)) return 0;
        var phi1 = lat * Math.PI / 180.0;
        var phi2 = KAABA_LAT * Math.PI / 180.0;
        var deltaLambda = (KAABA_LON - lon) * Math.PI / 180.0;
        var y = Math.sin(deltaLambda) * Math.cos(phi2);
        var x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
        return qNorm(Math.atan2(y, x) * 180.0 / Math.PI);
      }

      // Exact Great Circle Distance (Haversine Formula) in Kilometers
      function qDistance(lat, lon) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        if (!isFinite(lat) || !isFinite(lon)) return 0;
        var R = 6371; // Mean Earth radius in km
        var phi1 = lat * Math.PI / 180.0;
        var phi2 = KAABA_LAT * Math.PI / 180.0;
        var deltaPhi = (KAABA_LAT - lat) * Math.PI / 180.0;
        var deltaLambda = (KAABA_LON - lon) * Math.PI / 180.0;
        var a = Math.sin(deltaPhi / 2.0) * Math.sin(deltaPhi / 2.0) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda / 2.0) * Math.sin(deltaLambda / 2.0);
        var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1.0 - a)));
        return Math.round(R * c);
      }

      function qDir(d) {
        var e = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
        var u = ['شمال', 'شمال مشرق', 'مشرق', 'جنوب مشرق', 'جنوب', 'جنوب مغرب', 'مغرب', 'شمال مغرب'];
        return (typeof lang !== 'undefined' && lang === 'en' ? e : u)[Math.round(qNorm(d) / 45) % 8];
      }

      function qText(k) {
        if (typeof lang !== 'undefined' && lang === 'en') {
          return (typeof EN !== 'undefined' && EN[k] !== undefined) ? EN[k] : k;
        }
        var urduTexts = {
          qiblaAligned: '✓ قبلہ رخ درست ہے — آپ خانۂ کعبہ کے سامنے ہیں',
          qiblaTurn: 'خانۂ کعبہ کی سمت رخ کریں',
          qiblaReady: 'قبلہ رخ فعال ہے۔ فون کو گھمائیں جب تک کعبہ سامنے نہ آ جائے۔',
          qiblaCalibrateText: 'فون کو ہوا میں 8 کی شکل میں گھمائیں، پھر سیدھا رکھیں۔',
          qiblaNeedPermission: 'سمت معلوم کرنے کے لیے موشن/کمپاس کی اجازت درکار ہے۔',
          qiblaLocationDenied: 'مقام کی اجازت نہیں ملی۔ ڈیفالٹ مقام استعمال ہو رہا ہے۔',
          qiblaCameraDenied: 'کیمرہ کی اجازت نہیں ملی۔ کمپاس موڈ تیار ہے۔',
          qiblaCompassUnavailable: 'اس ڈیوائس پر کمپاس سنسر دستیاب نہیں ہے۔',
          qiblaNoCamera: 'اس ڈیوائس پر کیمرہ دستیاب نہیں، کمپاس موڈ تیار ہے۔',
          qiblaOpenNative: 'نیٹِو کمپاس کھولیں (Native Compass)'
        };
        if (urduTexts[k]) return urduTexts[k];
        return (typeof URDU_SNAPSHOT !== 'undefined' && URDU_SNAPSHOT[k] !== undefined) ? URDU_SNAPSHOT[k] : k;
      }

      function qStatus(t, c) {
        var e = document.getElementById('qiblaStatus');
        if (e) {
          e.textContent = t;
          e.className = 'qibla-status' + (c ? ' ' + c : '');
        }
      }

      function qHaptic() {
        if (!navigator.vibrate) return;
        var now = Date.now();
        if (now - qiblaState.lastHaptic < 1200) return;
        qiblaState.lastHaptic = now;
        try { navigator.vibrate([70, 35, 70]); } catch (e) { try { navigator.vibrate(120); } catch (e2) { } }
      }

      function qShowCalibrationBanner(msg, isWarn) {
        var banner = document.getElementById('qiblaCalBanner');
        var textEl = document.getElementById('qiblaCalText');
        if (textEl && msg) textEl.textContent = msg;
        if (banner) {
          banner.classList.remove('hidden');
          banner.classList.toggle('warn', !!isWarn);
        }
      }

      function qHideCalibrationBanner() {
        var banner = document.getElementById('qiblaCalBanner');
        if (banner) banner.classList.add('hidden');
      }

      // --- iOS 13+ USER GESTURE PERMISSION HANDLER ---
      function qRequestMotionPermissionOnGesture() {
        try {
          if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            return DeviceOrientationEvent.requestPermission().then(function (res) {
              var granted = (res === 'granted');
              qiblaState.permissionGranted = granted;
              if (granted) {
                qiblaState.permissionDenied = false;
                qStartOrientation();
                qHideCalibrationBanner();
              } else {
                qiblaState.permissionDenied = true;
                qStatus(qText('qiblaNeedPermission'), 'warn');
                qShowCalibrationBanner(qText('qiblaNeedPermission'), true);
              }
              return granted;
            }).catch(function (err) {
              console.warn('DeviceOrientationEvent.requestPermission error:', err);
              return false;
            });
          }
        } catch (e) {
          console.warn('Motion permission request error:', e);
        }
        return Promise.resolve(true);
      }

      // --- SENSOR & SMOOTH LOW-PASS TRACKING STATE ---
      var _rawHeading = null;
      var _targetHeading = null;
      var _smoothedHeading = null;
      var _needleContinuousAngle = null;
      var _dialContinuousAngle = null;
      var _lastAbsoluteEventTime = 0;
      var _orientationListenersAttached = false;
      var _animFrameId = null;
      var _animRunning = false;
      var _lastRenderedDeg = null;
      var _lastHeadingValue = null;
      var _lastChangeTime = 0;
      var _sensorHealthTimer = null;
      var _isManualDrag = false;

      function getScreenOrientationAngle() {
        var angle = 0;
        try {
          if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
            angle = window.screen.orientation.angle;
          } else if (typeof window.orientation === 'number') {
            angle = window.orientation;
          }
        } catch (e) { }
        angle = (Number(angle) || 0) % 360;
        return angle < 0 ? angle + 360 : angle;
      }

      function qSetRawHeading(raw) {
        if (raw === null || !isFinite(raw)) return;
        var now = Date.now();
        qiblaState.lastEventTime = now;
        qiblaState.sensorsAvailable = true;

        _rawHeading = qNorm(raw);
        _targetHeading = qNorm(_rawHeading + getScreenOrientationAngle());

        // Check if heading changed significantly (at least 0.25 deg) to detect frozen vs live movement
        if (_lastHeadingValue === null || Math.abs(((_targetHeading - _lastHeadingValue + 540) % 360) - 180) >= 0.25) {
          _lastHeadingValue = _targetHeading;
          _lastChangeTime = now;
          if (qiblaState.isFrozen) {
            qiblaState.isFrozen = false;
            qHideCalibrationBanner();
            if (qiblaState.bearing !== null) {
              qStatus(qText('qiblaReady'), 'ok');
            }
          }
        }

        if (_smoothedHeading === null) {
          _smoothedHeading = _targetHeading;
          qiblaState.heading = _smoothedHeading;
          if (qiblaState.bearing !== null) {
            _needleContinuousAngle = qiblaState.bearing - _smoothedHeading;
          }
          _dialContinuousAngle = -_smoothedHeading;
          qRenderFrame();
        }
        qStartAnimLoop();
      }

      function onScreenOrientationChange() {
        if (_rawHeading !== null) {
          _targetHeading = qNorm(_rawHeading + getScreenOrientationAngle());
        }
        qStartAnimLoop();
        qRenderFrame();
      }

      function onAbsoluteOrientation(e) {
        if (!e) return;
        if (typeof e.alpha === 'number' && isFinite(e.alpha)) {
          _lastAbsoluteEventTime = Date.now();
          var heading = (360 - e.alpha) % 360;
          if (heading < 0) heading += 360;
          qSetRawHeading(heading);
        }
      }

      function onStandardOrientation(e) {
        if (!e) return;

        // 1. Apple iOS: webkitCompassHeading directly represents true or magnetic heading in degrees (0..360)
        if (typeof e.webkitCompassHeading === 'number' && isFinite(e.webkitCompassHeading) && e.webkitCompassHeading >= 0) {
          qSetRawHeading(e.webkitCompassHeading);
          return;
        }

        // 2. Android: When absolute orientation events are actively firing (within 1500ms),
        // prevent standard relative orientation events from clobbering the heading.
        if (Date.now() - _lastAbsoluteEventTime < 1500) {
          return;
        }

        // 3. Fallback when absolute orientation is unavailable
        if (typeof e.alpha === 'number' && isFinite(e.alpha)) {
          var heading = (360 - e.alpha) % 360;
          if (heading < 0) heading += 360;
          qSetRawHeading(heading);
        }
      }

      // --- HEALTH & FROZEN SENSOR CHECKER (Fires every 400ms) ---
      function _checkSensorHealth() {
        if (!qiblaState.active) return;
        var now = Date.now();

        // 1. Check if sensors never produced an event within 2.5s
        if (!qiblaState.lastEventTime) {
          if (now - qiblaState.startTime >= 2500) {
            qiblaState.sensorsAvailable = false;
            qiblaState.isFrozen = true;
            var unavailableMsg = qText('qiblaCompassUnavailable') + ' — ' + qText('qiblaCalibrateText');
            qShowCalibrationBanner(unavailableMsg, true);
            qStatus(unavailableMsg, 'warn');
            var ins = document.getElementById('qiblaArInstruction');
            if (ins && qiblaState.heading === null) {
              ins.textContent = qText('qiblaCompassUnavailable');
            }
          }
          return;
        }

        // 2. Sensor values unchanged or frozen for > 2.5 seconds
        var elapsed = now - (_lastChangeTime || qiblaState.lastEventTime || qiblaState.startTime);
        if (elapsed >= 2500) {
          if (!qiblaState.isFrozen) {
            qiblaState.isFrozen = true;
            var freezeMsg = qText('qiblaCalibrateText');
            qShowCalibrationBanner(freezeMsg, false);
            qStatus(freezeMsg, 'warn');
            var ins2 = document.getElementById('qiblaArInstruction');
            if (ins2 && !qiblaState.aligned) {
              ins2.textContent = qText('qiblaCalibrateText');
            }
          }
        }
      }

      function qCalibrateCompass() {
        qHaptic();
        qRequestMotionPermissionOnGesture();
        var now = Date.now();
        _lastChangeTime = now;
        _lastHeadingValue = null;
        qiblaState.isFrozen = false;
        qShowCalibrationBanner(qText('qiblaCalibrateText'), false);
        qStatus(qText('qiblaCalibrateText'), 'ok');
        var ins = document.getElementById('qiblaArInstruction');
        if (ins) ins.textContent = qText('qiblaCalibrateText');

        qDetachListeners();
        setTimeout(function () {
          qAttachListeners();
        }, 80);
      }

      // --- 60FPS SMOOTH ANGULAR LOW-PASS INTERPOLATION (RAF LOOP) ---
      function qAnimLoop() {
        if (!_animRunning) return;

        var needsRender = false;

        // 1. Interpolate heading towards target using shortest angular path across 0/360 wrap boundary
        if (_targetHeading !== null) {
          if (_smoothedHeading === null) {
            _smoothedHeading = _targetHeading;
            qiblaState.heading = _smoothedHeading;
            needsRender = true;
          } else {
            var hDiff = ((_targetHeading - _smoothedHeading + 540) % 360) - 180;
            if (Math.abs(hDiff) > 0.04) {
              _smoothedHeading = qNorm(_smoothedHeading + hDiff * 0.20);
              qiblaState.heading = _smoothedHeading;
              needsRender = true;
            } else if (Math.abs(hDiff) > 0.001) {
              _smoothedHeading = _targetHeading;
              qiblaState.heading = _smoothedHeading;
              needsRender = true;
            }
          }
        }

        // 2. Smooth needle angle (shortest angular path, prevents needle jumping across 0/360)
        if (_smoothedHeading !== null && qiblaState.bearing !== null) {
          var targetNeedle = qiblaState.bearing - _smoothedHeading;
          if (_needleContinuousAngle === null) {
            _needleContinuousAngle = targetNeedle;
            needsRender = true;
          } else {
            var nDiff = ((targetNeedle - _needleContinuousAngle + 540) % 360) - 180;
            if (Math.abs(nDiff) > 0.04) {
              _needleContinuousAngle += nDiff * 0.20;
              needsRender = true;
            } else if (Math.abs(nDiff) > 0.001) {
              _needleContinuousAngle = targetNeedle;
              needsRender = true;
            }
          }
          if (Math.abs(_needleContinuousAngle) > 720) {
            _needleContinuousAngle = (_needleContinuousAngle % 360 + 360) % 360;
          }
        }

        // 3. Smooth dial angle (rotates N, E, S, W seamlessly with physical device heading)
        if (_smoothedHeading !== null) {
          var targetDial = -_smoothedHeading;
          if (_dialContinuousAngle === null) {
            _dialContinuousAngle = targetDial;
            needsRender = true;
          } else {
            var dDiff = ((targetDial - _dialContinuousAngle + 540) % 360) - 180;
            if (Math.abs(dDiff) > 0.04) {
              _dialContinuousAngle += dDiff * 0.20;
              needsRender = true;
            } else if (Math.abs(dDiff) > 0.001) {
              _dialContinuousAngle = targetDial;
              needsRender = true;
            }
          }
          if (Math.abs(_dialContinuousAngle) > 720) {
            _dialContinuousAngle = (_dialContinuousAngle % 360 + 360) % 360;
          }
        }

        if (needsRender) {
          qRenderFrame();
        }

        _animFrameId = requestAnimationFrame(qAnimLoop);
      }

      function qStartAnimLoop() {
        if (_animRunning) return;
        _animRunning = true;
        _animFrameId = requestAnimationFrame(qAnimLoop);
      }

      function qStopAnimLoop() {
        _animRunning = false;
        if (_animFrameId) {
          cancelAnimationFrame(_animFrameId);
          _animFrameId = null;
        }
      }

      // --- RENDERING & UI UPDATE ---
      function qRenderFrame() {
        if (qiblaState.bearing === null) return;

        var b = Math.round(qiblaState.bearing);
        var currentHeading = (qiblaState.heading !== null && isFinite(qiblaState.heading)) ? qiblaState.heading : qiblaState.bearing;
        var signed = ((qiblaState.bearing - currentHeading + 540) % 360) - 180;
        var diff = Math.abs(signed);

        // 1. Compass Needle (points to Kaaba)
        var arrow = document.getElementById('qiblaArrow');
        if (arrow) {
          var needleAngle = _needleContinuousAngle !== null ? _needleContinuousAngle : (qiblaState.bearing - currentHeading);
          arrow.style.transform = 'translate(-50%,-100%) rotate(' + needleAngle.toFixed(2) + 'deg)';
        }

        // 2. Compass Dial (rotates N, E, S, W to true North)
        var dirDial = document.getElementById('qiblaDial') || document.querySelector('.qibla-dir');
        if (dirDial) {
          var dialAngle = _dialContinuousAngle !== null ? _dialContinuousAngle : -currentHeading;
          dirDial.style.transform = 'rotate(' + dialAngle.toFixed(2) + 'deg)';
        }

        // 3. Degree and Direction Text
        var roundedHeading = (qiblaState.heading !== null && isFinite(qiblaState.heading)) ? Math.round(qiblaState.heading) : b;
        if (_lastRenderedDeg !== roundedHeading) {
          _lastRenderedDeg = roundedHeading;
          var deg = document.getElementById('qiblaDegrees');
          if (deg) deg.textContent = roundedHeading + '°';
          var dir = document.getElementById('qiblaDirection');
          if (dir) dir.textContent = qDir(roundedHeading);
        }

        var qb = document.getElementById('qiblaBearing');
        if (qb) {
          var distStr = qiblaState.distanceKm ? (' • ' + qiblaState.distanceKm.toLocaleString() + ' km') : '';
          qb.textContent = b + '° (' + qDir(qiblaState.bearing) + ')' + distStr;
        }

        // 4. AR Badges
        var ab = document.getElementById('qiblaArBearing');
        if (ab) ab.textContent = (typeof lang !== 'undefined' && lang === 'en' ? 'Qibla ' : 'قبلہ ') + b + '°';
        var ah = document.getElementById('qiblaArHeading');
        if (ah) ah.textContent = (qiblaState.heading === null || !isFinite(qiblaState.heading)) ? '—°' : Math.round(qiblaState.heading) + '°';

        // 5. AR 3D Kaaba Wrap
        var wrap = document.getElementById('qibla3dWrap');
        if (wrap && qiblaState.heading !== null) {
          var x = Math.max(-42, Math.min(42, signed * 1.8));
          wrap.style.transform = 'translate(calc(-50% + ' + x.toFixed(2) + '%),-50%)';
          wrap.classList.toggle('offscreen', diff > 55);
          wrap.classList.toggle('qibla-aligned', diff <= 5);
        }

        // 6. AR Instruction and Alignment feedback
        var ins = document.getElementById('qiblaArInstruction');
        var stage = document.getElementById('qiblaArStage');
        if (qiblaState.heading !== null && !qiblaState.isFrozen) {
          if (diff <= 5) {
            if (ins) {
              ins.textContent = qText('qiblaAligned');
              ins.classList.add('qibla-aligned-text');
            }
            if (stage) stage.classList.add('qibla-is-aligned');
            if (!qiblaState.aligned) {
              qiblaState.aligned = true;
              qHaptic();
            }
            qStatus(qText('qiblaAligned'), 'ok');
          } else {
            if (ins) {
              ins.textContent = qText('qiblaTurn');
              ins.classList.remove('qibla-aligned-text');
            }
            if (stage) stage.classList.remove('qibla-is-aligned');
            qiblaState.aligned = false;
          }
        }
      }

      function qUpdate() {
        qRenderFrame();
      }

      function qHeading(e) {
        if (!e) return null;
        if (typeof e.webkitCompassHeading === 'number' && isFinite(e.webkitCompassHeading) && e.webkitCompassHeading >= 0) {
          return qNorm(e.webkitCompassHeading);
        }
        if (typeof e.alpha === 'number' && isFinite(e.alpha)) {
          return qNorm(360 - e.alpha);
        }
        return null;
      }

      function qApplyHeading(targetHeading) {
        if (targetHeading === null || !isFinite(targetHeading)) return;
        qSetRawHeading(targetHeading);
      }

      // --- LISTENER LIFECYCLE (PASSIVE LISTENERS) ---
      function qAttachListeners() {
        if (_orientationListenersAttached) return;

        var opts = { passive: true };

        try {
          window.addEventListener('deviceorientationabsolute', onAbsoluteOrientation, opts);
        } catch (e) {
          try { window.addEventListener('deviceorientationabsolute', onAbsoluteOrientation, false); } catch (e2) { }
        }

        try {
          window.addEventListener('deviceorientation', onStandardOrientation, opts);
        } catch (e) {
          try { window.addEventListener('deviceorientation', onStandardOrientation, false); } catch (e2) { }
        }

        try {
          window.addEventListener('orientationchange', onScreenOrientationChange, opts);
        } catch (e) {
          try { window.addEventListener('orientationchange', onScreenOrientationChange, false); } catch (e2) { }
        }

        try {
          if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
            window.screen.orientation.addEventListener('change', onScreenOrientationChange, opts);
          }
        } catch (e) { }

        _orientationListenersAttached = true;
        qiblaState.listening = true;
        qStartAnimLoop();
      }

      function qDetachListeners() {
        try { window.removeEventListener('deviceorientationabsolute', onAbsoluteOrientation); } catch (e) { }
        try { window.removeEventListener('deviceorientation', onStandardOrientation); } catch (e) { }
        try { window.removeEventListener('orientationchange', onScreenOrientationChange); } catch (e) { }
        try {
          if (window.screen && window.screen.orientation && window.screen.orientation.removeEventListener) {
            window.screen.orientation.removeEventListener('change', onScreenOrientationChange);
          }
        } catch (e) { }

        _orientationListenersAttached = false;
        qiblaState.listening = false;
        qStopAnimLoop();
      }

      function qStartOrientation() {
        qiblaState.active = true;
        qiblaState.startTime = Date.now();
        _lastChangeTime = Date.now();
        qiblaState.isFrozen = false;

        if (!_sensorHealthTimer) {
          _sensorHealthTimer = setInterval(_checkSensorHealth, 400);
        }

        qAttachListeners();
        return true;
      }

      function qStopOrientation() {
        qiblaState.active = false;
        if (_sensorHealthTimer) {
          clearInterval(_sensorHealthTimer);
          _sensorHealthTimer = null;
        }
        qHideCalibrationBanner();
        qDetachListeners();
      }

      function qMotionPermission() {
        return qRequestMotionPermissionOnGesture();
      }

      function qApplyLocation(lat, lon, label) {
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        if (!isFinite(lat) || !isFinite(lon)) return;

        qiblaState.latitude = lat;
        qiblaState.longitude = lon;
        qiblaState.bearing = qBearing(lat, lon);
        qiblaState.distanceKm = qDistance(lat, lon);

        try {
          localStorage.setItem('qurb_cached_lat', String(lat));
          localStorage.setItem('qurb_cached_lon', String(lon));
        } catch (e) { }

        var c = document.getElementById('qiblaCoords');
        if (c) c.textContent = lat.toFixed(4) + '°, ' + lon.toFixed(4) + '°' + (label ? ' ' + label : '');

        var qb = document.getElementById('qiblaBearing');
        if (qb) {
          var distStr = qiblaState.distanceKm ? (' • ' + qiblaState.distanceKm.toLocaleString() + ' km') : '';
          qb.textContent = Math.round(qiblaState.bearing) + '° (' + qDir(qiblaState.bearing) + ')' + distStr;
        }

        qRenderFrame();
      }

      // Native GPS Bridge Callback
      window.onNativeLocationReceived = function (lat, lon) {
        qApplyLocation(lat, lon, '(GPS Live)');
        qStatus(qText('qiblaReady'), 'ok');
      };

      function qLocation() {
        // 1. First check if cached GPS location is present for instant load
        var cachedLat = null, cachedLon = null;
        try {
          cachedLat = parseFloat(localStorage.getItem('qurb_cached_lat'));
          cachedLon = parseFloat(localStorage.getItem('qurb_cached_lon'));
        } catch (e) { }

        if (isFinite(cachedLat) && isFinite(cachedLon)) {
          qApplyLocation(cachedLat, cachedLon, '(محفوظ شدہ)');
        }

        // 2. Request native bridge location if running inside app
        if (window.QurbBridge && typeof window.QurbBridge.postMessage === 'function') {
          try {
            window.QurbBridge.postMessage(JSON.stringify({ action: 'getLocation' }));
          } catch (e) { }
        }

        if (!navigator.geolocation) {
          if (!isFinite(cachedLat)) {
            qApplyLocation(35.2227, 72.4258, '(ڈیفالٹ: سوات)');
          }
          qStatus(qText('qiblaLocationDenied'), 'warn');
          return;
        }

        navigator.geolocation.getCurrentPosition(function (p) {
          qApplyLocation(p.coords.latitude, p.coords.longitude, '');
          qStatus(qText('qiblaReady'), 'ok');
        }, function (err) {
          if (qiblaState.latitude === null) {
            // Fallback to Swat, Pakistan (35.2227° N, 72.4258° E)
            qApplyLocation(35.2227, 72.4258, '(ڈیفالٹ: سوات)');
          }
          qStatus(qText('qiblaLocationDenied'), 'warn');
        }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 });
      }

      function qStartCamera() {
        var v = document.getElementById('qiblaVideo');
        if (!v) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          qStatus(qText('qiblaNoCamera'), 'warn');
          return;
        }

        // Ensure mandatory attributes for inline video rendering inside WebView
        v.setAttribute('autoplay', '');
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.muted = true;

        if (qiblaState.stream) {
          qiblaState.stream.getTracks().forEach(function (t) { t.stop(); });
          qiblaState.stream = null;
        }

        var constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints)
          .then(function (stream) {
            qiblaState.stream = stream;
            v.srcObject = stream;
            v.onloadedmetadata = function () {
              v.play().catch(function (e) {
                console.warn('Playback error:', e);
              });
            };
            qStatus(qText('qiblaReady'), 'ok');
          })
          .catch(function (err) {
            console.error('Camera stream error:', err);
            qStatus(qText('qiblaCameraDenied'), 'warn');
          });
      }

      var modelViewerPromise = null;
      function loadQiblaModelViewer() {
        if (window.customElements && customElements.get('model-viewer')) {
          return Promise.resolve();
        }
        if (modelViewerPromise) return modelViewerPromise;
        modelViewerPromise = new Promise(function (resolve, reject) {
          var s = document.createElement('script');
          s.type = 'module';
          s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
          s.onload = function () { resolve(); };
          s.onerror = function () { reject(new Error('model-viewer-load-failed')); };
          document.head.appendChild(s);
        });
        return modelViewerPromise;
      }

      function loadQibla3DModel() {
        var model = document.getElementById('qiblaModel');
        if (!model) return;
        var src = model.getAttribute('data-src');
        if (src && !model.getAttribute('src')) model.setAttribute('src', src);
      }

      function startQiblaFinder() {
        qiblaState.aligned = false;
        qiblaState.lastHaptic = 0;
        if (window.QurbBridge) {
          try {
            window.QurbBridge.postMessage(JSON.stringify({ action: 'requestCamera' }));
            window.QurbBridge.postMessage(JSON.stringify({ action: 'requestSensors' }));
          } catch (e) { }
        }
        loadQiblaModelViewer().then(loadQibla3DModel).catch(function () { });
        qRequestMotionPermissionOnGesture().then(function (ok) {
          if (!ok) {
            qStatus(qText('qiblaNeedPermission'), 'warn');
            qShowCalibrationBanner(qText('qiblaNeedPermission'), true);
            return;
          }
          qStartOrientation();
          qLocation();
          qStartCamera();
        });
      }

      function qStopCamera() {
        if (qiblaState.stream) {
          qiblaState.stream.getTracks().forEach(function (t) { t.stop(); });
          qiblaState.stream = null;
        }
        var v = document.getElementById('qiblaVideo');
        if (v) v.srcObject = null;
      }

      function qSetMode(mode) {
        var ar = (mode === 'ar');
        var arStage = document.getElementById('qiblaArStage');
        var compPanel = document.getElementById('qiblaCompassPanel');
        var arBtn = document.getElementById('qiblaArMode');
        var compBtn = document.getElementById('qiblaCompassMode');

        if (arStage) arStage.classList.toggle('show', ar);
        if (compPanel) compPanel.classList.toggle('show', !ar);
        if (arBtn) arBtn.classList.toggle('active', ar);
        if (compBtn) compBtn.classList.toggle('active', !ar);

        if (ar) {
          startQiblaFinder();
        } else {
          qStopCamera();
          qRequestMotionPermissionOnGesture().then(function () {
            qLocation();
            qStartOrientation();
          });
        }
      }

      // --- MANUAL COMPASS DRAG/INTERACTION FOR MISSING SENSORS / TESTING ---
      (function initManualCompassInteraction() {
        var comp = document.getElementById('qiblaCompass');
        if (!comp) return;

        function handleDrag(e) {
          var rect = comp.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
          var clientY = (e.touches && e.touches.length) ? e.touches[0].clientY : e.clientY;
          var dx = clientX - cx;
          var dy = clientY - cy;
          var angleRad = Math.atan2(dx, -dy); // 0 at top, 90 at right
          var angleDeg = (angleRad * 180 / Math.PI + 360) % 360;
          qSetRawHeading(angleDeg);
        }

        comp.addEventListener('mousedown', function (e) {
          _isManualDrag = true;
          handleDrag(e);
        });
        window.addEventListener('mousemove', function (e) {
          if (_isManualDrag) handleDrag(e);
        });
        window.addEventListener('mouseup', function () {
          _isManualDrag = false;
        });

        comp.addEventListener('touchstart', function (e) {
          _isManualDrag = true;
          handleDrag(e);
        }, { passive: true });
        comp.addEventListener('touchmove', function (e) {
          if (_isManualDrag) handleDrag(e);
        }, { passive: true });
        comp.addEventListener('touchend', function () {
          _isManualDrag = false;
        });
      })();

      // Bind Qibla controls
      (function () {
        var qb = document.getElementById('qiblaStartBtn');
        if (qb) {
          qb.addEventListener('click', function () {
            qRequestMotionPermissionOnGesture();
            startQiblaFinder();
          });
        }
        var qam = document.getElementById('qiblaArMode');
        if (qam) {
          qam.addEventListener('click', function () {
            qRequestMotionPermissionOnGesture();
            qSetMode('ar');
          });
        }
        var qcm = document.getElementById('qiblaCompassMode');
        if (qcm) {
          qcm.addEventListener('click', function () {
            qRequestMotionPermissionOnGesture();
            qSetMode('compass');
          });
        }
        var qcb = document.getElementById('qiblaCalibrateBtn');
        if (qcb) {
          qcb.addEventListener('click', function () {
            qRequestMotionPermissionOnGesture();
            qCalibrateCompass();
          });
        }
        var qcbb = document.getElementById('qiblaCalBannerBtn');
        if (qcbb) {
          qcbb.addEventListener('click', function () {
            qRequestMotionPermissionOnGesture();
            qCalibrateCompass();
          });
        }
        var qnb = document.getElementById('qiblaNativeBtn');
        if (qnb) {
          if (typeof window.__QURB_NATIVE__ !== 'undefined' || window.QurbBridge) {
            qnb.style.display = 'block';
          }
          qnb.addEventListener('click', function () {
            if (window.QurbBridge && typeof window.QurbBridge.postMessage === 'function') {
              window.QurbBridge.postMessage(JSON.stringify({ action: 'openQibla' }));
            }
          });
        }
        var qbb = document.getElementById('qiblaBackBtn');
        if (qbb) {
          qbb.addEventListener('click', function () {
            qStopCamera();
            qStopOrientation();
            showTab('home');
          });
        }
      })();

      window.qRequestMotionPermissionOnGesture = qRequestMotionPermissionOnGesture;
      window.qCalibrateCompass = qCalibrateCompass;
      window.startQiblaFinder = startQiblaFinder;
      window.qStopCamera = qStopCamera;
      window.qStopOrientation = qStopOrientation;
      window.qStartOrientation = qStartOrientation;
      window.qApplyHeading = qApplyHeading;
      window.qSetMode = qSetMode;

      // ================= 6. MANZIL READING MODULE =================
      function initManzil() {
        var key = "manzil_font_size_v1";
        var saved = "27";
        try { saved = localStorage.getItem(key) || "27"; } catch (e) { }
        document.documentElement.style.setProperty("--manzil-font-size", saved + "px");
        document.querySelectorAll("[data-manzil-font]").forEach(function (btn) {
          btn.classList.toggle("active", btn.getAttribute("data-manzil-font") === String(saved));
        });
      }
      window.initManzil = initManzil;

      // ================= 7. ARTICLES MODULE (WP REST API & OFFLINE CACHE) =================
      var ARTICLES_API = 'https://muftimaazharoon.com/wp-json/wp/v2/posts?per_page=8&_fields=id,date,link,title,content';
      var ARTICLES_CACHE_KEY = 'articles_cache_v2';
      var articlesLoaded = false;

      function stripHtml(html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
      }

      function looksRtl(text) {
        return /[\u0600-\u06FF]/.test(text);
      }

      function formatDate(iso) {
        try {
          var d = new Date(iso);
          var months = typeof lang !== 'undefined' && lang === 'en' ? gregMonthsEN : gregMonths;
          return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        } catch (e) { return ''; }
      }

      function articleContentHtml(html) {
        var box = document.createElement('div');
        box.innerHTML = html || '';
        box.querySelectorAll('script,style,link,object,embed').forEach(function (el) { el.remove(); });
        box.querySelectorAll('*').forEach(function (el) {
          Array.from(el.attributes).forEach(function (attr) {
            if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
          });
        });
        box.querySelectorAll('img,iframe').forEach(function (el) { el.loading = 'lazy'; el.decoding = 'async'; });
        return box.innerHTML.trim();
      }

      function renderArticles(posts, fromCache) {
        var list = document.getElementById('articlesList');
        var status = document.getElementById('articlesStatus');
        if (!list) return;
        list.innerHTML = '';
        if (!posts || !posts.length) {
          if (status) {
            status.className = 'articles-status';
            status.textContent = typeof lang !== 'undefined' && lang === 'en' ? 'No articles available yet.' : 'ابھی کوئی آرٹیکل دستیاب نہیں۔';
          }
          return;
        }
        if (status) {
          status.className = 'articles-status';
          status.textContent = fromCache ? (typeof lang !== 'undefined' && lang === 'en' ? 'Offline — showing saved articles' : 'آف لائن — محفوظ شدہ آرٹیکلز دکھائے جا رہے ہیں') : '';
        }

        posts.slice(0, 15).forEach(function (post) {
          var title = stripHtml(post.title && post.title.rendered ? post.title.rendered : '');
          var dir = looksRtl(title) ? 'rtl' : 'ltr';
          var article = document.createElement('article');
          article.className = 'article-card';
          article.setAttribute('dir', dir);

          var body = document.createElement('div');
          body.className = 'article-body';

          var heading = document.createElement('h3');
          heading.className = 'article-title';
          heading.textContent = title;

          var meta = document.createElement('div');
          meta.className = 'article-meta';
          meta.innerHTML = '<span>' + formatDate(post.date) + '</span><span class="article-readmore">' + (dir === 'rtl' ? 'مکمل مضمون' : 'Full article') + '</span>';

          var content = document.createElement('div');
          content.className = 'article-content';
          content.innerHTML = articleContentHtml(post.content && post.content.rendered ? post.content.rendered : '');

          var share = document.createElement('div');
          share.className = 'article-share';
          share.setAttribute('dir', 'ltr');
          share.innerHTML =
            '<div class="article-share-label">' + (dir === 'rtl' ? 'مضمون شیئر کریں' : 'Share article') + '</div>' +
            '<button type="button" class="article-share-btn whatsapp" data-share="whatsapp" aria-label="WhatsApp">WhatsApp</button>' +
            '<button type="button" class="article-share-btn facebook" data-share="facebook" aria-label="Facebook">Facebook</button>' +
            '<button type="button" class="article-share-btn telegram" data-share="telegram" aria-label="Telegram">Telegram</button>' +
            '<button type="button" class="article-share-btn xshare" data-share="x" aria-label="X">𝕏</button>' +
            '<button type="button" class="article-share-btn copy" data-share="copy" aria-label="Copy link">' + (dir === 'rtl' ? 'لنک کاپی' : 'Copy link') + '</button>' +
            '<button type="button" class="article-share-btn" data-share="native" aria-label="More sharing options">' + (dir === 'rtl' ? 'مزید' : 'More') + '</button>';

          share.querySelectorAll('[data-share]').forEach(function (btn) {
            btn.addEventListener('click', function (ev) {
              ev.preventDefault();
              ev.stopPropagation();
              shareArticle(btn.getAttribute('data-share'), post, title, dir);
            });
          });

          body.appendChild(heading);
          body.appendChild(meta);
          body.appendChild(content);
          body.appendChild(share);
          article.appendChild(body);
          list.appendChild(article);
        });
      }

      function shareArticle(type, post, title, dir) {
        var url = (post && post.link) ? post.link : location.href;
        var text = title || '';
        var encodedUrl = encodeURIComponent(url);
        var encodedText = encodeURIComponent(text);

        if (type === 'copy') {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(function () {
              showToast(dir === 'rtl' ? 'لنک کاپی ہوگیا' : 'Link copied');
            }).catch(function () { fallbackCopy(url, dir); });
          } else {
            fallbackCopy(url, dir);
          }
          return;
        }

        if (type === 'native') {
          if (navigator.share) {
            navigator.share({ title: title || 'Salah Article', text: text, url: url }).catch(function () { });
          } else {
            fallbackCopy(url, dir);
          }
          return;
        }

        var shareUrl = '';
        if (type === 'whatsapp') {
          shareUrl = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + url);
        } else if (type === 'facebook') {
          shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
        } else if (type === 'telegram') {
          shareUrl = 'https://t.me/share/url?url=' + encodedUrl + '&text=' + encodedText;
        } else if (type === 'x') {
          shareUrl = 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl;
        }
        if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer,width=640,height=720');
      }

      function fallbackCopy(text, dir) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showToast(dir === 'rtl' ? 'لنک کاپی ہوگیا' : 'Link copied'); }
        catch (e) { showToast(dir === 'rtl' ? 'لنک کاپی نہیں ہو سکا' : 'Could not copy link'); }
        document.body.removeChild(ta);
      }

      function loadArticles() {
        if (articlesLoaded) return;
        var status = document.getElementById('articlesStatus');
        var list = document.getElementById('articlesList');
        if (list) {
          list.innerHTML = '<div style="text-align:center;padding:30px;color:#d1beac;">آرٹیکلز لوڈ ہو رہے ہیں...</div>';
        }

        fetch(ARTICLES_API)
          .then(function (res) {
            if (!res.ok) throw new Error('bad-response');
            return res.json();
          })
          .then(function (posts) {
            articlesLoaded = true;
            try { localStorage.setItem(ARTICLES_CACHE_KEY, JSON.stringify({ posts: posts, ts: Date.now() })); } catch (e) { }
            renderArticles(posts, false);
          })
          .catch(function () {
            var cached = null;
            try { cached = JSON.parse(localStorage.getItem(ARTICLES_CACHE_KEY)); } catch (e) { }
            if (cached && cached.posts && cached.posts.length) {
              articlesLoaded = true;
              renderArticles(cached.posts, true);
            } else {
              if (list) list.innerHTML = '';
              if (status) {
                status.className = 'articles-status error';
                status.textContent = typeof lang !== 'undefined' && lang === 'en' ? 'Could not load articles. Check your internet connection.' : 'آرٹیکلز لوڈ نہیں ہو سکے۔ انٹرنیٹ کنکشن چیک کریں۔';
              }
            }
          });
      }
      window.loadArticles = loadArticles;

      // ================= 8. ZIKR BOOK (SUBAH SHAM AZKAR OFFLINE VIEWER) =================
      var ZIKR_PDF_URL = 'https://maktabahsalafiyyah.org/wp-content/uploads/2025/01/Subah-Sham-Azkar-card.pdf';
      var ZIKR_DB = 'salah_zikr_book_v1';
      var ZIKR_STORE = 'book';
      var ZIKR_KEY = 'subah-sham-azkar';
      var pdfjsPromise = null, zikrInitialized = false, zikrPages = [], zikrCurrent = 0, zikrTouchStartX = null;

      function zikrIdbOpen() {
        return new Promise(function (resolve, reject) {
          var req = indexedDB.open(ZIKR_DB, 1);
          req.onupgradeneeded = function () {
            var db = req.result;
            if (!db.objectStoreNames.contains(ZIKR_STORE)) db.createObjectStore(ZIKR_STORE);
          };
          req.onsuccess = function () { resolve(req.result); };
          req.onerror = function () { reject(req.error); };
        });
      }

      function zikrIdbGet(key) {
        return zikrIdbOpen().then(function (db) {
          return new Promise(function (resolve, reject) {
            var tx = db.transaction(ZIKR_STORE, 'readonly'), r = tx.objectStore(ZIKR_STORE).get(key);
            r.onsuccess = function () { resolve(r.result || null); };
            r.onerror = function () { reject(r.error); };
          });
        });
      }

      function zikrIdbPut(key, value) {
        return zikrIdbOpen().then(function (db) {
          return new Promise(function (resolve, reject) {
            var tx = db.transaction(ZIKR_STORE, 'readwrite');
            tx.objectStore(ZIKR_STORE).put(value, key);
            tx.oncomplete = function () { resolve(); };
            tx.onerror = function () { reject(tx.error); };
          });
        });
      }

      function zikrStatus(msg, bad) {
        var el = document.getElementById('zikrDownloadStatus');
        if (el) { el.textContent = msg || ''; el.style.color = bad ? '#ef4444' : '#D4AF37'; }
      }

      function zikrSetOfflineBadge(show) {
        var el = document.getElementById('zikrOfflineBadge');
        if (el) el.classList.toggle('show', !!show);
      }

      function showZikrPage(i) {
        if (!zikrPages.length) return;
        zikrCurrent = Math.max(0, Math.min(zikrPages.length - 1, i));
        var img = document.getElementById('zikrPageImage');
        if (img) {
          var old = img.getAttribute('data-url');
          if (old) { try { URL.revokeObjectURL(old); } catch (e) { } }
          var url = URL.createObjectURL(zikrPages[zikrCurrent].blob);
          img.src = url;
          img.setAttribute('data-url', url);
        }
        var countEl = document.getElementById('zikrPageCount');
        if (countEl) countEl.textContent = (zikrCurrent + 1) + ' / ' + zikrPages.length;
        var pillEl = document.getElementById('zikrPagePill');
        if (pillEl) pillEl.textContent = 'صفحہ ' + (zikrCurrent + 1);
        var progEl = document.getElementById('zikrProgress');
        if (progEl) progEl.style.width = ((zikrCurrent + 1) / zikrPages.length * 100) + '%';
        var prev = document.getElementById('zikrPrev');
        if (prev) prev.disabled = (zikrCurrent === 0);
        var next = document.getElementById('zikrNext');
        if (next) next.disabled = (zikrCurrent === zikrPages.length - 1);
      }

      function showZikrViewer() {
        var v = document.getElementById('zikrViewer');
        if (v) v.classList.add('show');
        showZikrPage(zikrCurrent);
      }

      function readZikrStored() {
        return zikrIdbGet(ZIKR_KEY).then(function (data) {
          if (!data || !data.pages || !data.pages.length) return false;
          zikrPages = data.pages;
          zikrCurrent = 0;
          showZikrViewer();
          zikrSetOfflineBadge(true);
          return true;
        });
      }

      function initZikrBook() {
        if (zikrInitialized) return;
        zikrInitialized = true;

        var prev = document.getElementById('zikrPrev');
        if (prev) prev.addEventListener('click', function () { showZikrPage(zikrCurrent - 1); });
        var next = document.getElementById('zikrNext');
        if (next) next.addEventListener('click', function () { showZikrPage(zikrCurrent + 1); });

        var slide = document.getElementById('zikrSlide');
        if (slide) {
          slide.addEventListener('touchstart', function (e) { zikrTouchStartX = e.changedTouches[0].clientX; }, { passive: true });
          slide.addEventListener('touchend', function (e) {
            if (zikrTouchStartX === null) return;
            var dx = e.changedTouches[0].clientX - zikrTouchStartX;
            if (Math.abs(dx) > 45) {
              if (dx > 0) showZikrPage(zikrCurrent - 1);
              else showZikrPage(zikrCurrent + 1);
            }
            zikrTouchStartX = null;
          }, { passive: true });
        }

        readZikrStored().catch(function () { });
      }
      window.initZikrBook = initZikrBook;


      // ================= UNIFIED GLOBAL ROUTING DISPATCHER =================
      document.addEventListener('click', function (e) {
        var actEl = e.target.closest('[data-action]');
        if (!actEl) return;
        var act = actEl.getAttribute('data-action') || '';

        if (act === 'soon') {
          showToast(typeof lang !== 'undefined' && lang === 'en' ? 'Feature coming soon, InshaAllah' : 'یہ فیچر جلد شامل ہوگا، ان شاء اللہ');
          return;
        }

        if (act.indexOf('tab:') === 0) {
          var tabId = act.slice(4);
          if (tabId === 'qibla' && typeof qRequestMotionPermissionOnGesture === 'function') {
            qRequestMotionPermissionOnGesture();
          }
          if (tabId === 'library' && window.QurbBridge) {
            window.QurbBridge.postMessage(JSON.stringify({ action: 'openPdfLibrary' }));
            return;
          }
          showTab(tabId);
        }
      });

      // Safe DOMContentLoaded Auto Init
      // IMPORTANT: Do not initialize heavy hidden tabs during startup.
      // Library, Duas and Hadith are initialized only when opened.
      window.addEventListener('DOMContentLoaded', function () {
        if (typeof setNotifTheme === 'function') {
          setNotifTheme(appThemeState.theme);
        }
      });

      // ---- Toast for "coming soon" ----
      var toastTimer = null;
      function showToast(msg) {
        var el = document.getElementById('toast');
        if (!el) {
          el = document.createElement('div');
          el.id = 'toast';
          el.className = 'toast';
          document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
      }
      window.showToast = showToast;

      

      

      if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('./sw.js').catch(function () { });
        });
      }

      /* ================= APP UPDATE — SETTINGS ONLY ================= */
      (function () {
        var updateBtn = document.getElementById('appUpdateBtn');
        var updateStatus = document.getElementById('appUpdateStatus');
        if (!updateBtn) return;

        function setUpdateState(buttonText, statusText, disabled) {
          updateBtn.textContent = buttonText;
          updateBtn.disabled = !!disabled;
          if (updateStatus) updateStatus.textContent = statusText;
        }

        updateBtn.addEventListener('click', function () {
          setUpdateState('Checking…', 'Checking for the latest version…', true);

          if (!('serviceWorker' in navigator)) {
            window.location.reload();
            return;
          }

          navigator.serviceWorker.getRegistration('./').then(function (reg) {
            if (!reg) {
              window.location.reload();
              return;
            }

            return reg.update().then(function () {
              var waiting = reg.waiting;

              if (waiting) {
                setUpdateState('Updating…', 'New version found. Updating the app…', true);

                var reloadDone = false;
                var reload = function () {
                  if (reloadDone) return;
                  reloadDone = true;
                  window.location.reload();
                };

                navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
                waiting.postMessage({ type: 'SKIP_WAITING' });

                setTimeout(reload, 5000);
                return;
              }

              // No waiting worker means the current version is already the newest
              // available to this browser. Reload once to fetch the latest app files.
              setUpdateState('Refreshing…', 'App is already up to date. Refreshing…', true);
              setTimeout(function () { window.location.reload(); }, 500);
            }).catch(function () {
              setUpdateState('Update', 'Could not check right now. Please try again.', false);
            });
          }).catch(function () {
            setUpdateState('Update', 'Could not check right now. Please try again.', false);
          });
        });
      })();
    })();

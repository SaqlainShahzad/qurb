1119:<script>
1120-(function(){
1121-  /* =========================================================
1122-     SALAH PWA — GOOGLE ANALYTICS 4
1123-     Measurement ID: G-QN7YL6W531
1124-     ========================================================= */
1125-  window.dataLayer = window.dataLayer || [];
1126-  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
1127-  gtag('js', new Date());
1128-  gtag('config', 'G-QN7YL6W531', {
1129-    send_page_view: true
1130-  });
1131-
1132-  var s = document.createElement('script');
1133-  s.async = true;
1134-  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-QN7YL6W531';
1135-  document.head.appendChild(s);
1136-
1137-  /* Safe helper: events can be sent even before gtag.js finishes loading. */
1138-  window.salahAnalytics = function(name, params){
1139-    try { gtag('event', name, params || {}); } catch(e) {}
1140-  };
1141-
1142-  /* App opened */
1143-  salahAnalytics('app_open', {
1144-    app_name: 'Salah',
1145-    app_version: '1.0'
1146-  });
1147-
1148-  /* Installed PWA opened */
1149-  var isStandalone = false;
1150-  try {
1151-    isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
1152-  } catch(e) {}
1153-  if(isStandalone){
1154-    salahAnalytics('installed_app_open', { app_name: 'Salah' });
1155-  }
1156-
1157-  /* PWA installation */
1158-  window.addEventListener('appinstalled', function(){
1159-    salahAnalytics('pwa_install', {
1160-      app_name: 'Salah',
1161-      install_source: 'pwa'
1162-    });
1163-  });
1164-
1165-  /* Useful display-mode information */
1166-  salahAnalytics('app_display_mode', {
1167-    mode: isStandalone ? 'standalone' : 'browser'
1168-  });
1169-
1170-  /* ---------------------------------------------------------
1171-     Feature / navigation tracking without changing app logic.
1172-     Uses the existing data-tab and data-action attributes.
1173-     --------------------------------------------------------- */
1174-  function featureName(tab){
1175-    return ({
1176-      home:'Home',
1177-      calendar:'Prayer Times',
1178-      qibla:'Qibla',
1179-      quran:'Quran',
1180-      settings:'Settings',
1181-      manzil:'Manzil',
1182-      zikr:'Dhikr',
1183-      duas:'Duas',
1184-      articles:'Articles'
1185-    })[tab] || tab;
1186-  }
1187-
1188-  document.addEventListener('click', function(ev){
1189-    var nav = ev.target.closest ? ev.target.closest('.nav-item[data-tab]') : null;
1190-    if(nav){
1191-      var tab = nav.getAttribute('data-tab');
1192-      var name = featureName(tab);
1193-      salahAnalytics('navigation_click', { section: name });
1194-      salahAnalytics('feature_open', { feature: name });
1195-      if(tab === 'calendar') salahAnalytics('prayer_times_open');
1196-      if(tab === 'qibla') salahAnalytics('qibla_open');
1197-      if(tab === 'quran') salahAnalytics('quran_open');
1198-      if(tab === 'settings') salahAnalytics('settings_open');
1199-      if(tab === 'manzil') salahAnalytics('manzil_open');
1200-      if(tab === 'zikr') salahAnalytics('azkar_open');
1201-      if(tab === 'duas') salahAnalytics('duas_open');
1202-      return;
1203-    }
1204-
1205-    var qa = ev.target.closest ? ev.target.closest('.qa-card[data-action]') : null;
1206-    if(qa){
1207-      var action = qa.getAttribute('data-action') || '';
1208-      if(action.indexOf('tab:') === 0){
1209-        var qtab = action.slice(4);
1210-        var qname = featureName(qtab);
1211-        salahAnalytics('quick_access_click', { feature: qname });
1212-        salahAnalytics('feature_open', { feature: qname });
1213-        if(qtab === 'calendar') salahAnalytics('prayer_times_open');
1214-        if(qtab === 'qibla') salahAnalytics('qibla_open');
1215-        if(qtab === 'manzil') salahAnalytics('manzil_open');
1216-        if(qtab === 'zikr') salahAnalytics('azkar_open');
1217-        if(qtab === 'duas') salahAnalytics('duas_open');
1218-      }
1219-      return;
1220-    }
1221-
1222-    /* Zikr book download */
1223-    var dl = ev.target.closest ? ev.target.closest('#zikrDownloadBtn') : null;
1224-    if(dl){
1225-      salahAnalytics('book_download', { book: 'Subah-Sham-Azkar' });
1226-    }
1227-
1228-    /* App update */
1229-    var upd = ev.target.closest ? ev.target.closest('#appUpdateBtn') : null;
1230-    if(upd){
1231-      salahAnalytics('app_update');
1232-    }
1233-
1234-    /* App share */
1235-    var share = ev.target.closest ? ev.target.closest('#shareAppBtn') : null;
1236-    if(share){
1237-      salahAnalytics('share_app');
1238-    }
1239-  }, true);
1240-
1241-  /* Prayer / special notification switches */
1242-  document.addEventListener('change', function(ev){
1243-    var input = ev.target;
1244-    if(!input) return;
1245-
1246-    if(input.id === 'notifMaster'){
1247-      salahAnalytics('notification_setting', {
1248-        prayer: 'All',
1249-        enabled: input.checked ? 'true' : 'false'
1250-      });
1251-      return;
1252-    }
1253-
1254-    if(input.classList && input.classList.contains('notif-toggle')){
1255-      var key = input.getAttribute('data-key') || 'unknown';
1256-      var kind = input.getAttribute('data-kind') || 'prayer';
1257-      salahAnalytics('notification_setting', {
1258-        prayer: key,
1259-        type: kind,
1260-        enabled: input.checked ? 'true' : 'false'
1261-      });
1262-    }
1263-  }, true);
1264-
1265-  /* Page visibility / return-to-app usage */
1266-  document.addEventListener('visibilitychange', function(){
1267-    if(document.visibilityState === 'visible'){
1268-      salahAnalytics('app_foreground', { app_name: 'Salah' });
1269-    }
1270-  });
1271-})();
1272-</script>
1747:<script>
1748-(function () {
1749-  // Prevent multi-touch pinch-to-zoom safely
1750-  document.addEventListener('touchmove', function (e) {
1751-    if (e.touches && e.touches.length > 1) {
1752-      e.preventDefault();
1753-    }
1754-  }, { passive: false });
1755-
1756-  // Prevent Ctrl/Meta + mouse-wheel zoom
1757-  document.addEventListener('wheel', function (e) {
1758-    if (e.ctrlKey || e.metaKey) {
1759-      e.preventDefault();
1760-    }
1761-  }, { passive: false });
1762-
1763-  // Prevent keyboard zoom shortcuts
1764-  document.addEventListener('keydown', function (e) {
1765-    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
1766-      e.preventDefault();
1767-    }
1768-  });
1769-})();
1770-</script>
7583:<script>
7584-(function(){
7585-  var MONTHS = {"جنوری": [[5, 47, 7, 18, 12, 14, 3, 32, 5, 15, 6, 40], [5, 47, 7, 18, 12, 15, 3, 33, 5, 15, 6, 41], [5, 47, 7, 18, 12, 15, 3, 34, 5, 16, 6, 42], [5, 47, 7, 18, 12, 16, 3, 34, 5, 17, 6, 43], [5, 47, 7, 18, 12, 16, 3, 35, 5, 18, 6, 43], [5, 48, 7, 18, 12, 16, 3, 36, 5, 19, 6, 44], [5, 48, 7, 18, 12, 17, 3, 37, 5, 20, 6, 45], [5, 48, 7, 18, 12, 17, 3, 38, 5, 20, 6, 46], [5, 48, 7, 18, 12, 18, 3, 39, 5, 21, 6, 46], [5, 48, 7, 18, 12, 18, 3, 40, 5, 22, 6, 47], [5, 48, 7, 18, 12, 19, 3, 41, 5, 23, 6, 48], [5, 48, 7, 18, 12, 19, 3, 41, 5, 24, 6, 49], [5, 48, 7, 18, 12, 19, 3, 42, 5, 25, 6, 50], [5, 48, 7, 18, 12, 20, 3, 43, 5, 26, 6, 50], [5, 48, 7, 18, 12, 20, 3, 44, 5, 27, 6, 51], [5, 47, 7, 17, 12, 20, 3, 45, 5, 28, 6, 52], [5, 47, 7, 17, 12, 21, 3, 46, 5, 29, 6, 53], [5, 47, 7, 16, 12, 21, 3, 47, 5, 30, 6, 54], [5, 47, 7, 16, 12, 21, 3, 48, 5, 31, 6, 55], [5, 46, 7, 15, 12, 22, 3, 49, 5, 32, 6, 56], [5, 46, 7, 15, 12, 22, 3, 50, 5, 33, 6, 57], [5, 46, 7, 15, 12, 22, 3, 51, 5, 34, 6, 58], [5, 45, 7, 14, 12, 23, 3, 52, 5, 35, 6, 59], [5, 45, 7, 14, 12, 23, 3, 53, 5, 36, 7, 0], [5, 44, 7, 13, 12, 23, 3, 54, 5, 37, 7, 1], [5, 44, 7, 12, 12, 23, 3, 55, 5, 38, 7, 2], [5, 44, 7, 12, 12, 24, 3, 56, 5, 39, 7, 2], [5, 43, 7, 11, 12, 24, 3, 57, 5, 40, 7, 3], [5, 43, 7, 10, 12, 24, 3, 58, 5, 41, 7, 4], [5, 42, 7, 10, 12, 24, 3, 59, 5, 42, 7, 4], [5, 42, 7, 10, 12, 24, 4, 0, 5, 43, 7, 5]], "فروری": [[5, 41, 7, 9, 12, 24, 4, 1, 5, 44, 7, 6], [5, 41, 7, 8, 12, 24, 4, 2, 5, 45, 7, 7], [5, 40, 7, 7, 12, 24, 4, 3, 5, 46, 7, 8], [5, 39, 7, 7, 12, 25, 4, 4, 5, 47, 7, 9], [5, 39, 7, 6, 12, 25, 4, 5, 5, 48, 7, 9], [5, 38, 7, 5, 12, 25, 4, 6, 5, 49, 7, 10], [5, 37, 7, 4, 12, 25, 4, 7, 5, 50, 7, 11], [5, 36, 7, 3, 12, 25, 4, 8, 5, 51, 7, 12], [5, 36, 7, 2, 12, 25, 4, 9, 5, 52, 7, 13], [5, 35, 7, 1, 12, 25, 4, 10, 5, 53, 7, 14], [5, 34, 7, 0, 12, 25, 4, 11, 5, 54, 7, 15], [5, 33, 6, 59, 12, 25, 4, 11, 5, 55, 7, 15], [5, 32, 6, 58, 12, 25, 4, 12, 5, 56, 7, 16], [5, 31, 6, 57, 12, 25, 4, 13, 5, 57, 7, 17], [5, 30, 6, 56, 12, 25, 4, 14, 5, 58, 7, 18], [5, 29, 6, 55, 12, 25, 4, 15, 5, 59, 7, 19], [5, 28, 6, 54, 12, 25, 4, 16, 6, 0, 7, 20], [5, 27, 6, 53, 12, 24, 4, 17, 6, 1, 7, 21], [5, 26, 6, 52, 12, 24, 4, 18, 6, 2, 7, 21], [5, 25, 6, 51, 12, 24, 4, 18, 6, 3, 7, 22], [5, 24, 6, 50, 12, 24, 4, 19, 6, 4, 7, 23], [5, 22, 6, 48, 12, 24, 4, 20, 6, 5, 7, 24], [5, 21, 6, 47, 12, 24, 4, 21, 6, 6, 7, 25], [5, 20, 6, 46, 12, 24, 4, 22, 6, 7, 7, 26], [5, 19, 6, 45, 12, 23, 4, 22, 6, 8, 7, 27], [5, 17, 6, 44, 12, 23, 4, 23, 6, 9, 7, 27], [5, 16, 6, 42, 12, 23, 4, 24, 6, 10, 7, 28], [5, 15, 6, 41, 12, 23, 4, 25, 6, 11, 7, 29], [5, 15, 6, 40, 12, 23, 4, 26, 6, 11, 7, 30]], "مارچ": [[5, 15, 6, 40, 12, 23, 4, 26, 6, 11, 7, 30], [5, 14, 6, 39, 12, 23, 4, 26, 6, 11, 7, 31], [5, 12, 6, 37, 12, 23, 4, 27, 6, 12, 7, 32], [5, 11, 6, 36, 12, 22, 4, 28, 6, 13, 7, 33], [5, 10, 6, 35, 12, 22, 4, 28, 6, 14, 7, 33], [5, 9, 6, 33, 12, 22, 4, 29, 6, 15, 7, 34], [5, 7, 6, 32, 12, 22, 4, 30, 6, 16, 7, 35], [5, 6, 6, 31, 12, 21, 4, 30, 6, 17, 7, 36], [5, 5, 6, 29, 12, 21, 4, 31, 6, 17, 7, 37], [5, 3, 6, 28, 12, 21, 4, 32, 6, 18, 7, 38], [5, 2, 6, 27, 12, 21, 4, 32, 6, 19, 7, 39], [5, 0, 6, 25, 12, 20, 4, 33, 6, 20, 7, 39], [4, 59, 6, 24, 12, 20, 4, 34, 6, 21, 7, 40], [4, 58, 6, 23, 12, 20, 4, 34, 6, 22, 7, 41], [4, 56, 6, 21, 12, 19, 4, 35, 6, 22, 7, 42], [4, 55, 6, 20, 12, 19, 4, 35, 6, 23, 7, 43], [4, 53, 6, 18, 12, 19, 4, 36, 6, 24, 7, 44], [4, 52, 6, 17, 12, 19, 4, 37, 6, 25, 7, 45], [4, 50, 6, 16, 12, 18, 4, 37, 6, 26, 7, 45], [4, 49, 6, 14, 12, 18, 4, 38, 6, 26, 7, 46], [4, 47, 6, 13, 12, 18, 4, 38, 6, 27, 7, 47], [4, 46, 6, 12, 12, 17, 4, 39, 6, 28, 7, 48], [4, 44, 6, 10, 12, 17, 4, 39, 6, 29, 7, 49], [4, 43, 6, 9, 12, 17, 4, 40, 6, 30, 7, 50], [4, 41, 6, 7, 12, 17, 4, 40, 6, 30, 7, 51], [4, 40, 6, 6, 12, 16, 4, 41, 6, 31, 7, 52], [4, 38, 6, 5, 12, 16, 4, 41, 6, 32, 7, 53], [4, 37, 6, 3, 12, 16, 4, 42, 6, 33, 7, 54], [4, 35, 6, 2, 12, 15, 4, 42, 6, 34, 7, 55], [4, 34, 6, 0, 12, 15, 4, 43, 6, 34, 7, 55], [4, 32, 5, 59, 12, 15, 4, 43, 6, 35, 7, 56]], "اپریل": [[4, 31, 5, 58, 12, 14, 4, 44, 6, 36, 7, 57], [4, 29, 5, 56, 12, 14, 4, 44, 6, 37, 7, 58], [4, 28, 5, 55, 12, 14, 4, 45, 6, 38, 7, 59], [4, 26, 5, 53, 12, 14, 4, 45, 6, 38, 8, 0], [4, 24, 5, 52, 12, 13, 4, 46, 6, 39, 8, 1], [4, 23, 5, 51, 12, 13, 4, 46, 6, 40, 8, 2], [4, 21, 5, 49, 12, 13, 4, 47, 6, 41, 8, 3], [4, 20, 5, 48, 12, 12, 4, 47, 6, 41, 8, 4], [4, 18, 5, 47, 12, 12, 4, 48, 6, 42, 8, 5], [4, 17, 5, 45, 12, 12, 4, 48, 6, 43, 8, 6], [4, 15, 5, 44, 12, 12, 4, 49, 6, 44, 8, 7], [4, 14, 5, 43, 12, 11, 4, 49, 6, 45, 8, 8], [4, 12, 5, 41, 12, 11, 4, 50, 6, 45, 8, 9], [4, 11, 5, 40, 12, 11, 4, 50, 6, 46, 8, 10], [4, 9, 5, 39, 12, 11, 4, 51, 6, 47, 8, 11], [4, 7, 5, 38, 12, 10, 4, 51, 6, 48, 8, 12], [4, 6, 5, 36, 12, 10, 4, 51, 6, 49, 8, 13], [4, 4, 5, 35, 12, 10, 4, 52, 6, 49, 8, 15], [4, 3, 5, 34, 12, 10, 4, 52, 6, 50, 8, 16], [4, 1, 5, 33, 12, 9, 4, 52, 6, 51, 8, 17], [4, 0, 5, 31, 12, 9, 4, 53, 6, 52, 8, 18], [3, 58, 5, 30, 12, 9, 4, 53, 6, 53, 8, 19], [3, 57, 5, 29, 12, 9, 4, 53, 6, 53, 8, 20], [3, 55, 5, 28, 12, 9, 4, 54, 6, 54, 8, 21], [3, 54, 5, 27, 12, 8, 4, 54, 6, 55, 8, 22], [3, 53, 5, 25, 12, 8, 4, 54, 6, 56, 8, 23], [3, 51, 5, 24, 12, 8, 4, 55, 6, 57, 8, 24], [3, 50, 5, 23, 12, 8, 4, 55, 6, 57, 8, 26], [3, 48, 5, 22, 12, 8, 4, 56, 6, 58, 8, 27], [3, 47, 5, 21, 12, 8, 4, 56, 6, 59, 8, 28]], "مئی": [[3, 45, 5, 20, 12, 8, 4, 57, 7, 0, 8, 29], [3, 44, 5, 19, 12, 7, 4, 57, 7, 1, 8, 30], [3, 43, 5, 18, 12, 7, 4, 58, 7, 1, 8, 31], [3, 41, 5, 17, 12, 7, 4, 58, 7, 2, 8, 32], [3, 40, 5, 16, 12, 7, 4, 58, 7, 3, 8, 33], [3, 39, 5, 15, 12, 7, 4, 59, 7, 4, 8, 35], [3, 37, 5, 14, 12, 7, 4, 59, 7, 5, 8, 36], [3, 36, 5, 13, 12, 7, 5, 0, 7, 5, 8, 37], [3, 35, 5, 12, 12, 7, 5, 0, 7, 6, 8, 38], [3, 34, 5, 11, 12, 7, 5, 0, 7, 7, 8, 39], [3, 33, 5, 11, 12, 7, 5, 1, 7, 8, 8, 40], [3, 31, 5, 10, 12, 7, 5, 1, 7, 9, 8, 41], [3, 30, 5, 9, 12, 7, 5, 1, 7, 9, 8, 43], [3, 29, 5, 8, 12, 7, 5, 2, 7, 10, 8, 44], [3, 28, 5, 7, 12, 7, 5, 2, 7, 11, 8, 45], [3, 27, 5, 7, 12, 7, 5, 3, 7, 12, 8, 46], [3, 26, 5, 6, 12, 7, 5, 3, 7, 13, 8, 47], [3, 25, 5, 5, 12, 7, 5, 3, 7, 13, 8, 48], [3, 24, 5, 4, 12, 7, 5, 4, 7, 14, 8, 49], [3, 23, 5, 4, 12, 7, 5, 4, 7, 15, 8, 50], [3, 22, 5, 3, 12, 7, 5, 5, 7, 15, 8, 51], [3, 21, 5, 3, 12, 7, 5, 5, 7, 16, 8, 52], [3, 20, 5, 2, 12, 7, 5, 5, 7, 17, 8, 54], [3, 19, 5, 1, 12, 7, 5, 6, 7, 18, 8, 55], [3, 18, 5, 1, 12, 7, 5, 6, 7, 18, 8, 56], [3, 17, 5, 0, 12, 8, 5, 7, 7, 19, 8, 57], [3, 17, 5, 0, 12, 8, 5, 7, 7, 20, 8, 58], [3, 16, 5, 0, 12, 8, 5, 7, 7, 20, 8, 59], [3, 15, 4, 59, 12, 8, 5, 8, 7, 21, 8, 59], [3, 15, 4, 59, 12, 8, 5, 8, 7, 22, 9, 0], [3, 14, 4, 58, 12, 8, 5, 8, 7, 22, 9, 1]], "جون": [[3, 13, 4, 58, 12, 8, 5, 9, 7, 23, 9, 2], [3, 13, 4, 58, 12, 8, 5, 9, 7, 23, 9, 3], [3, 12, 4, 58, 12, 9, 5, 10, 7, 24, 9, 4], [3, 12, 4, 57, 12, 9, 5, 10, 7, 25, 9, 5], [3, 11, 4, 57, 12, 9, 5, 10, 7, 25, 9, 5], [3, 11, 4, 57, 12, 9, 5, 11, 7, 26, 9, 6], [3, 10, 4, 57, 12, 9, 5, 11, 7, 26, 9, 7], [3, 10, 4, 57, 12, 9, 5, 11, 7, 27, 9, 8], [3, 10, 4, 56, 12, 10, 5, 12, 7, 27, 9, 8], [3, 10, 4, 56, 12, 10, 5, 12, 7, 28, 9, 9], [3, 9, 4, 56, 12, 10, 5, 12, 7, 28, 9, 10], [3, 9, 4, 56, 12, 10, 5, 13, 7, 29, 9, 10], [3, 9, 4, 56, 12, 11, 5, 13, 7, 29, 9, 11], [3, 9, 4, 56, 12, 11, 5, 13, 7, 29, 9, 11], [3, 9, 4, 56, 12, 11, 5, 14, 7, 30, 9, 12], [3, 9, 4, 56, 12, 11, 5, 14, 7, 30, 9, 12], [3, 9, 4, 57, 12, 12, 5, 14, 7, 31, 9, 13], [3, 9, 4, 57, 12, 12, 5, 14, 7, 31, 9, 13], [3, 9, 4, 57, 12, 12, 5, 15, 7, 31, 9, 13], [3, 9, 4, 57, 12, 12, 5, 15, 7, 31, 9, 13], [3, 9, 4, 57, 12, 12, 5, 15, 7, 31, 9, 14], [3, 10, 4, 57, 12, 12, 5, 15, 7, 32, 9, 14], [3, 10, 4, 57, 12, 13, 5, 15, 7, 32, 9, 14], [3, 10, 4, 58, 12, 13, 5, 15, 7, 32, 9, 14], [3, 11, 4, 58, 12, 13, 5, 16, 7, 32, 9, 14], [3, 11, 4, 58, 12, 13, 5, 16, 7, 32, 9, 14], [3, 11, 4, 58, 12, 14, 5, 16, 7, 32, 9, 14], [3, 12, 4, 59, 12, 14, 5, 16, 7, 32, 9, 14], [3, 12, 4, 59, 12, 14, 5, 16, 7, 32, 9, 14], [3, 13, 5, 0, 12, 14, 5, 16, 7, 32, 9, 14]], "جولائی": [[3, 13, 5, 0, 12, 14, 5, 16, 7, 32, 9, 14], [3, 14, 5, 1, 12, 14, 5, 16, 7, 32, 9, 13], [3, 15, 5, 1, 12, 15, 5, 16, 7, 32, 9, 13], [3, 15, 5, 2, 12, 15, 5, 17, 7, 32, 9, 13], [3, 16, 5, 2, 12, 15, 5, 17, 7, 32, 9, 13], [3, 17, 5, 3, 12, 15, 5, 17, 7, 32, 9, 12], [3, 17, 5, 3, 12, 15, 5, 17, 7, 31, 9, 12], [3, 18, 5, 4, 12, 16, 5, 17, 7, 31, 9, 11], [3, 19, 5, 4, 12, 16, 5, 17, 7, 31, 9, 11], [3, 20, 5, 5, 12, 16, 5, 16, 7, 31, 9, 10], [3, 20, 5, 5, 12, 16, 5, 16, 7, 30, 9, 10], [3, 21, 5, 6, 12, 16, 5, 16, 7, 30, 9, 9], [3, 22, 5, 7, 12, 16, 5, 16, 7, 30, 9, 8], [3, 23, 5, 7, 12, 16, 5, 16, 7, 29, 9, 8], [3, 24, 5, 8, 12, 16, 5, 16, 7, 29, 9, 7], [3, 25, 5, 9, 12, 17, 5, 16, 7, 28, 9, 6], [3, 26, 5, 9, 12, 17, 5, 16, 7, 28, 9, 5], [3, 27, 5, 10, 12, 17, 5, 16, 7, 27, 9, 5], [3, 28, 5, 10, 12, 17, 5, 15, 7, 27, 9, 4], [3, 29, 5, 11, 12, 17, 5, 15, 7, 26, 9, 3], [3, 30, 5, 12, 12, 17, 5, 15, 7, 26, 9, 2], [3, 31, 5, 13, 12, 17, 5, 14, 7, 25, 9, 1], [3, 32, 5, 13, 12, 17, 5, 14, 7, 24, 9, 0], [3, 33, 5, 14, 12, 17, 5, 14, 7, 24, 8, 59], [3, 34, 5, 15, 12, 17, 5, 13, 7, 23, 8, 58], [3, 35, 5, 15, 12, 17, 5, 13, 7, 22, 8, 57], [3, 36, 5, 16, 12, 17, 5, 13, 7, 22, 8, 56], [3, 37, 5, 17, 12, 17, 5, 12, 7, 21, 8, 55], [3, 38, 5, 18, 12, 17, 5, 12, 7, 20, 8, 54], [3, 39, 5, 18, 12, 17, 5, 12, 7, 19, 8, 53], [3, 40, 5, 19, 12, 17, 5, 11, 7, 18, 8, 51]], "اگست": [[3, 41, 5, 20, 12, 17, 5, 11, 7, 18, 8, 50], [3, 43, 5, 20, 12, 17, 5, 10, 7, 17, 8, 49], [3, 44, 5, 21, 12, 17, 5, 10, 7, 16, 8, 48], [3, 45, 5, 22, 12, 17, 5, 9, 7, 15, 8, 46], [3, 46, 5, 23, 12, 16, 5, 9, 7, 14, 8, 45], [3, 47, 5, 23, 12, 16, 5, 8, 7, 13, 8, 44], [3, 48, 5, 24, 12, 16, 5, 7, 7, 12, 8, 42], [3, 49, 5, 25, 12, 16, 5, 7, 7, 11, 8, 41], [3, 50, 5, 26, 12, 16, 5, 6, 7, 10, 8, 40], [3, 51, 5, 27, 12, 16, 5, 5, 7, 9, 8, 38], [3, 52, 5, 28, 12, 16, 5, 5, 7, 8, 8, 37], [3, 53, 5, 29, 12, 16, 5, 4, 7, 7, 8, 36], [3, 54, 5, 29, 12, 15, 5, 3, 7, 6, 8, 34], [3, 56, 5, 30, 12, 15, 5, 3, 7, 5, 8, 33], [3, 57, 5, 31, 12, 15, 5, 2, 7, 3, 8, 31], [3, 58, 5, 32, 12, 15, 5, 1, 7, 2, 8, 30], [3, 59, 5, 32, 12, 15, 5, 0, 7, 1, 8, 28], [4, 0, 5, 32, 12, 14, 5, 0, 7, 0, 8, 27], [4, 1, 5, 33, 12, 14, 4, 59, 6, 59, 8, 25], [4, 2, 5, 34, 12, 14, 4, 58, 6, 58, 8, 24], [4, 3, 5, 35, 12, 14, 4, 57, 6, 56, 8, 22], [4, 4, 5, 35, 12, 13, 4, 56, 6, 55, 8, 21], [4, 5, 5, 36, 12, 13, 4, 55, 6, 54, 8, 19], [4, 6, 5, 37, 12, 13, 4, 55, 6, 53, 8, 18], [4, 7, 5, 38, 12, 13, 4, 54, 6, 51, 8, 16], [4, 8, 5, 38, 12, 12, 4, 53, 6, 50, 8, 15], [4, 9, 5, 39, 12, 12, 4, 52, 6, 49, 8, 13], [4, 10, 5, 40, 12, 12, 4, 51, 6, 47, 8, 11], [4, 11, 5, 41, 12, 11, 4, 50, 6, 46, 8, 10], [4, 12, 5, 41, 12, 11, 4, 49, 6, 45, 8, 8], [4, 13, 5, 42, 12, 11, 4, 48, 6, 43, 8, 7]], "ستمبر": [[4, 15, 5, 43, 12, 11, 4, 47, 6, 42, 8, 5], [4, 15, 5, 43, 12, 10, 4, 46, 6, 41, 8, 4], [4, 16, 5, 44, 12, 10, 4, 45, 6, 39, 8, 2], [4, 17, 5, 45, 12, 10, 4, 44, 6, 38, 8, 0], [4, 18, 5, 46, 12, 9, 4, 43, 6, 36, 7, 59], [4, 18, 5, 46, 12, 9, 4, 42, 6, 35, 7, 57], [4, 19, 5, 47, 12, 9, 4, 41, 6, 34, 7, 56], [4, 20, 5, 48, 12, 8, 4, 39, 6, 32, 7, 54], [4, 21, 5, 48, 12, 8, 4, 38, 6, 31, 7, 53], [4, 22, 5, 49, 12, 8, 4, 37, 6, 29, 7, 51], [4, 23, 5, 50, 12, 7, 4, 36, 6, 28, 7, 49], [4, 24, 5, 51, 12, 7, 4, 35, 6, 27, 7, 48], [4, 25, 5, 51, 12, 6, 4, 34, 6, 25, 7, 46], [4, 26, 5, 52, 12, 6, 4, 33, 6, 24, 7, 45], [4, 26, 5, 53, 12, 6, 4, 32, 6, 22, 7, 43], [4, 27, 5, 54, 12, 5, 4, 30, 6, 21, 7, 41], [4, 28, 5, 55, 12, 5, 4, 29, 6, 19, 7, 40], [4, 29, 5, 56, 12, 5, 4, 28, 6, 18, 7, 38], [4, 30, 5, 56, 12, 4, 4, 27, 6, 17, 7, 37], [4, 31, 5, 57, 12, 4, 4, 26, 6, 15, 7, 35], [4, 31, 5, 58, 12, 4, 4, 25, 6, 14, 7, 34], [4, 32, 5, 59, 12, 3, 4, 23, 6, 12, 7, 32], [4, 33, 5, 59, 12, 3, 4, 22, 6, 11, 7, 31], [4, 34, 6, 0, 12, 3, 4, 21, 6, 9, 7, 29], [4, 35, 6, 1, 12, 2, 4, 20, 6, 8, 7, 28], [4, 36, 6, 2, 12, 2, 4, 19, 6, 7, 7, 26], [4, 36, 6, 2, 12, 2, 4, 17, 6, 5, 7, 25], [4, 37, 6, 2, 12, 1, 4, 16, 6, 4, 7, 23], [4, 38, 6, 3, 12, 1, 4, 15, 6, 2, 7, 22], [4, 39, 6, 4, 12, 1, 4, 14, 6, 1, 7, 20]], "اکتوبر": [[4, 40, 6, 5, 12, 0, 4, 13, 6, 0, 7, 19], [4, 40, 6, 5, 12, 0, 4, 11, 5, 58, 7, 17], [4, 41, 6, 6, 12, 0, 4, 10, 5, 57, 7, 16], [4, 42, 6, 7, 11, 59, 4, 9, 5, 55, 7, 15], [4, 43, 6, 8, 11, 59, 4, 8, 5, 54, 7, 13], [4, 43, 6, 8, 11, 59, 4, 7, 5, 53, 7, 12], [4, 44, 6, 9, 11, 58, 4, 5, 5, 51, 7, 11], [4, 45, 6, 10, 11, 58, 4, 4, 5, 50, 7, 9], [4, 46, 6, 11, 11, 58, 4, 3, 5, 49, 7, 8], [4, 47, 6, 12, 11, 58, 4, 2, 5, 47, 7, 7], [4, 47, 6, 12, 11, 57, 4, 1, 5, 46, 7, 5], [4, 48, 6, 13, 11, 57, 3, 59, 5, 45, 7, 4], [4, 49, 6, 14, 11, 57, 3, 58, 5, 43, 7, 3], [4, 50, 6, 15, 11, 57, 3, 57, 5, 42, 7, 1], [4, 51, 6, 16, 11, 56, 3, 56, 5, 41, 7, 0], [4, 51, 6, 16, 11, 56, 3, 55, 5, 39, 6, 59], [4, 52, 6, 17, 11, 56, 3, 54, 5, 38, 6, 58], [4, 53, 6, 18, 11, 56, 3, 53, 5, 37, 6, 57], [4, 54, 6, 19, 11, 55, 3, 51, 5, 36, 6, 55], [4, 54, 6, 20, 11, 55, 3, 50, 5, 35, 6, 54], [4, 55, 6, 21, 11, 55, 3, 49, 5, 33, 6, 53], [4, 56, 6, 22, 11, 55, 3, 48, 5, 32, 6, 52], [4, 57, 6, 22, 11, 55, 3, 47, 5, 31, 6, 51], [4, 58, 6, 23, 11, 55, 3, 46, 5, 30, 6, 50], [4, 58, 6, 24, 11, 55, 3, 45, 5, 29, 6, 49], [4, 59, 6, 25, 11, 55, 3, 44, 5, 28, 6, 48], [5, 0, 6, 26, 11, 54, 3, 43, 5, 27, 6, 47], [5, 1, 6, 27, 11, 54, 3, 42, 5, 25, 6, 46], [5, 2, 6, 28, 11, 54, 3, 41, 5, 24, 6, 45], [5, 2, 6, 29, 11, 54, 3, 40, 5, 23, 6, 44], [5, 3, 6, 30, 11, 54, 3, 39, 5, 22, 6, 43]], "نومبر": [[5, 4, 6, 31, 11, 54, 3, 38, 5, 21, 6, 42], [5, 5, 6, 32, 11, 54, 3, 37, 5, 20, 6, 41], [5, 6, 6, 32, 11, 54, 3, 36, 5, 19, 6, 41], [5, 7, 6, 33, 11, 54, 3, 35, 5, 19, 6, 40], [5, 7, 6, 34, 11, 54, 3, 35, 5, 18, 6, 39], [5, 8, 6, 35, 11, 54, 3, 34, 5, 17, 6, 38], [5, 9, 6, 36, 11, 54, 3, 33, 5, 16, 6, 38], [5, 10, 6, 37, 11, 54, 3, 32, 5, 15, 6, 37], [5, 11, 6, 38, 11, 54, 3, 31, 5, 14, 6, 36], [5, 12, 6, 39, 11, 54, 3, 31, 5, 13, 6, 36], [5, 12, 6, 40, 11, 55, 3, 30, 5, 13, 6, 35], [5, 13, 6, 41, 11, 55, 3, 29, 5, 12, 6, 34], [5, 14, 6, 42, 11, 55, 3, 29, 5, 11, 6, 34], [5, 15, 6, 43, 11, 55, 3, 28, 5, 10, 6, 33], [5, 16, 6, 44, 11, 55, 3, 27, 5, 9, 6, 32], [5, 17, 6, 45, 11, 55, 3, 27, 5, 9, 6, 32], [5, 17, 6, 46, 11, 56, 3, 26, 5, 8, 6, 31], [5, 18, 6, 47, 11, 56, 3, 26, 5, 8, 6, 31], [5, 19, 6, 48, 11, 56, 3, 25, 5, 7, 6, 30], [5, 20, 6, 49, 11, 56, 3, 25, 5, 7, 6, 31], [5, 21, 6, 50, 11, 57, 3, 24, 5, 6, 6, 30], [5, 22, 6, 51, 11, 57, 3, 24, 5, 6, 6, 30], [5, 22, 6, 52, 11, 57, 3, 23, 5, 6, 6, 30], [5, 23, 6, 53, 11, 57, 3, 23, 5, 6, 6, 29], [5, 24, 6, 54, 11, 58, 3, 22, 5, 5, 6, 29], [5, 25, 6, 55, 11, 58, 3, 22, 5, 5, 6, 29], [5, 26, 6, 56, 11, 58, 3, 22, 5, 5, 6, 29], [5, 26, 6, 56, 11, 58, 3, 22, 5, 4, 6, 29], [5, 27, 6, 57, 11, 59, 3, 22, 5, 4, 6, 29], [5, 28, 6, 58, 11, 59, 3, 21, 5, 4, 6, 29]], "دسمبر": [[5, 29, 6, 59, 12, 0, 3, 21, 5, 4, 6, 29], [5, 30, 7, 0, 12, 0, 3, 21, 5, 4, 6, 29], [5, 30, 7, 1, 12, 0, 3, 21, 5, 4, 6, 29], [5, 31, 7, 2, 12, 1, 3, 21, 5, 4, 6, 29], [5, 32, 7, 3, 12, 1, 3, 21, 5, 4, 6, 29], [5, 33, 7, 3, 12, 2, 3, 21, 5, 4, 6, 29], [5, 33, 7, 4, 12, 2, 3, 21, 5, 4, 6, 29], [5, 34, 7, 5, 12, 2, 3, 21, 5, 4, 6, 29], [5, 35, 7, 6, 12, 3, 3, 21, 5, 4, 6, 29], [5, 35, 7, 7, 12, 3, 3, 21, 5, 4, 6, 30], [5, 36, 7, 7, 12, 4, 3, 22, 5, 4, 6, 30], [5, 37, 7, 8, 12, 4, 3, 22, 5, 4, 6, 30], [5, 37, 7, 9, 12, 5, 3, 22, 5, 5, 6, 30], [5, 38, 7, 10, 12, 5, 3, 22, 5, 5, 6, 31], [5, 39, 7, 10, 12, 6, 3, 23, 5, 6, 6, 31], [5, 39, 7, 11, 12, 6, 3, 23, 5, 6, 6, 32], [5, 40, 7, 12, 12, 7, 3, 23, 5, 6, 6, 32], [5, 41, 7, 12, 12, 7, 3, 24, 5, 7, 6, 33], [5, 41, 7, 13, 12, 8, 3, 24, 5, 7, 6, 33], [5, 42, 7, 13, 12, 8, 3, 24, 5, 7, 6, 33], [5, 42, 7, 14, 12, 9, 3, 25, 5, 8, 6, 34], [5, 43, 7, 14, 12, 9, 3, 25, 5, 8, 6, 34], [5, 43, 7, 15, 12, 10, 3, 26, 5, 9, 6, 35], [5, 44, 7, 15, 12, 10, 3, 27, 5, 9, 6, 35], [5, 44, 7, 16, 12, 11, 3, 27, 5, 10, 6, 36], [5, 44, 7, 16, 12, 11, 3, 28, 5, 10, 6, 36], [5, 45, 7, 16, 12, 12, 3, 28, 5, 11, 6, 37], [5, 45, 7, 17, 12, 12, 3, 29, 5, 12, 6, 38], [5, 46, 7, 17, 12, 13, 3, 30, 5, 12, 6, 38], [5, 46, 7, 17, 12, 13, 3, 30, 5, 13, 6, 39], [5, 46, 7, 18, 12, 14, 3, 31, 5, 14, 6, 40]]};
7586-  var monthOrder = ["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"];
7587-  // Expose the calendar data to the independent server-push module below.
7588-  // The original page keeps MONTHS/monthOrder inside its first IIFE, so the
7589-  // server-push IIFE cannot access them directly.
7590-  window.__SALAH_MONTHS = MONTHS;
7591-  window.__SALAH_MONTH_ORDER = monthOrder;
7592-  var weekdays = ["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"];
7593-  var gregMonths = ["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"];
7594-  var weekdaysEN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
7595-  var gregMonthsEN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
7596-  var PNAMES = { fajr:{ur:"فجر",en:"Fajr"}, sunrise:{ur:"طلوعِ شمس",en:"Sunrise"}, dhuhr:{ur:"ظہر",en:"Dhuhr"}, asr:{ur:"عصر",en:"Asr"}, maghrib:{ur:"مغرب",en:"Maghrib"}, isha:{ur:"عشاء",en:"Isha"} };
7597-
7598-  /* ============ i18n (EN/UR) ============ */
7599-  var LANG_KEY = "app_lang_v1";
7600-  var lang = "ur";
7601-  try{ var savedLang = localStorage.getItem(LANG_KEY); if(savedLang==="en"||savedLang==="ur") lang = savedLang; }catch(e){}
7602-
7603-  var EN = {
7604-    subtitleMain:"Permanent Prayer Timetable - District Swat",
7605-    subtitleSub:"Hazrat Maulana Fazal Muhammad (رحمہ اللہ)",
7606-    hijriLabel:"Hijri", gregLabel:"Gregorian",
7607-    livePrayerKicker:"Next Prayer",
7608-    quranLabel:"Quran Recitation", quranStart:"Start reading Quran", quranChip:"114 Surahs • IndoPak", soonChip:"Coming soon",
7609-    quickAccess:"Quick Access",
7610-    todayNotes:"Today's Rulings",
7611-    qaTimes:"Prayer Times", qaCalendar:"Calendar", qaQibla:"Qibla", qaNotes:"Manzil", qaDhikr:"Dhikr", qiblaTitle:"Next-Gen Qibla Finder", qiblaSubtitle:"Use your camera to guide you toward the Kaaba", qiblaArMode:"🌍 AR Qibla", qiblaCompassMode:"🧭 Compass", qiblaArBadge:"LIVE AR QIBLA", qiblaArStartText:"Start the camera and slowly turn your phone.", qiblaStatusStart:"Location, camera and compass permission are required.", qiblaStart:"Start AR Qibla", qiblaCalibrate:"Calibrate Compass", qiblaBearingLabel:"Qibla bearing", qiblaLocationLabel:"Your location", qiblaReady:"AR Qibla is active. Turn until the Kaaba appears in the center.", qiblaLocationDenied:"Location permission was denied. Please allow it and try again.", qiblaCameraDenied:"Camera permission was denied. Please allow camera access and try again.", qiblaCompassUnavailable:"Your device does not provide a usable compass.", qiblaNeedPermission:"Please allow motion/orientation access to use the live direction.", qiblaCalibrateText:"Slowly rotate your phone in a figure-eight motion, then hold it flat.", qiblaAligned:"✓ Qibla aligned — you are facing the Kaaba", qiblaTurn:"Turn toward the Kaaba", qiblaNoCamera:"Camera AR is unavailable on this device; Compass mode is ready.",
7612-    qaMosques:"Mosques", qaDuas:"Duas", qaArticles:"Articles", qaHadith:"Hadith", qaAbout:"About Us", qaQuran:"Quran",
7613-    calTitle:"Permanent Prayer Timetable",
7614-    thDay:"Day", thFajr:"Fajr", thSunrise:"Sunrise", thDhuhr:"Dhuhr", thAsr:"Asr", thMaghrib:"Maghrib", thIsha:"Isha",
7615-    mJan:"January", mFeb:"February", mMar:"March", mApr:"April", mMay:"May", mJun:"June",
7616-    mJul:"July", mAug:"August", mSep:"September", mOct:"October", mNov:"November", mDec:"December",
7617-    nbIshraq:"Ishraq Prayer", nbSawm:"Fasting Niyyah", nbIshaMustahab:"Isha (Mustahab Time)",
7618-    nbMaghribMin:"Maghrib (Minimum)", nbSunriseMakruh:"Sunrise (Makruh)", nbSunsetMakruh:"Sunset (Makruh)",
7619-    navHome:"Home", navPrayerTimes:"Prayer Times", navCalendar:"Calendar", navQuran:"Quran", navHadith:"Hadith", navSettings:"Settings", settingsPrayerTitle:"Prayer Notifications", settingsPrayerSub:"All prayer notification and reminder options", settingsUpdateTitle:"Update App", settingsUpdateSub:"Check and install the latest app version", settingsUpdateCardTitle:"Update App", settingsUpdateCardSub:"Check for the latest version and update", settingsUpdateBtn:"Update",
7620-    backHome:"Back to Home",
7621-    quranTitle:"The Holy Quran",
7622-    quranSub:"IndoPak Script — Complete 114 Surahs with Urdu & English Translations",
7623-    quranDownload:"Save Offline",
7624-    toggleUrdu:"Urdu Translation",
7625-    toggleEn:"English",
7626-    hadithHeaderTitle:"40 Short Hadiths",
7627-    hadithHeaderSub:"Curated Authentic Hadiths by Mufti Maaz Haroon with Urdu & English Translations",
7628-    aboutName:"Mufti Maaz Haroon",
7629-    aboutTag:"Pakistani Islamic scholar, author and web developer",
7630-    aboutP1:"Mufti Maaz Haroon is a Pakistani Islamic scholar and author. He won a national-level Qira'at competition, for which he was awarded an Umrah ticket as a prize.",
7631-    aboutP2:"At just 12 years of age, without ever completing the Nazira stage, he memorised the entire Quran in only 2 years. He then completed the 8-year Dars-e-Nizami syllabus and earned a specialization (Takhassus) in Fiqh. He holds a graduation and Ifta certificate from Jamia Mazahir-ul-Uloom (JMU), along with a Master's degree in Arabic Literature.",
7632-    aboutP3:"He has a special devotion to Tasawwuf and holds permission (Ijazah) in the Naqshbandiyya Sirajiyya order from senior spiritual guide Peer Barkatullah Sahib.",
7633-    aboutP4:'Mufti Sahib is the author of the book <b>"Khulasat-ul-Quran li-Ibn-e-Haroon"</b> and teaches at Jamia Taleem-ul-Quran, Khyber Pakhtunkhwa. He is also an accomplished computer programmer and web developer. Thousands of followers on social media are drawn to his simple, engaging style, especially his well-known series <b>"40 Short Hadiths"</b>, which received immense appreciation.',
7634-    aboutQuote:'His mission is to spread the simple yet profound message of "enjoining good and forbidding evil" across the country and around the world.',
7635-    linkWebsite:"Website: muftimaazharoon.com", linkFacebook:"Facebook", linkInstagram:"Instagram", linkYoutube:"YouTube",
7636-    soonQuranTitle:"Quran section", soonQuranBody:"Quran reader is ready.",
7637-    soonHadithTitle:"Hadith section", soonHadithBody:"40 Hadiths collection is ready.",
7638-    soonSettingsTitle:"Settings coming soon", soonSettingsBody:"Location, notifications and other preferences will be added here in the future.",
7639-    articlesSource:"from muftimaazharoon.com",
7640-    a2hsTitle:"Install on your phone home screen", a2hsSub:"Open instantly even without internet, just like a regular app",
7641-    a2hsInstall:"Install in one click", a2hsLater:"Later",
7642-    a2hsStep1:"Tap the Share", a2hsStep1b:"button below",
7643-    a2hsStep2:'Select "Add to Home Screen"', a2hsStep3:'Tap "Add" — done', a2hsGotIt:"Got it"
7644-  };
7645-
7646-  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
7647-  var URDU_SNAPSHOT = {};
7648-  i18nEls.forEach(function(el){
7649-    var k = el.getAttribute("data-i18n");
7650-    if(!(k in URDU_SNAPSHOT)) URDU_SNAPSHOT[k] = el.innerHTML;
7651-  });
7652-
7653-  var noteBoxes = Array.prototype.slice.call(document.querySelectorAll(".note-box[data-nb-tpl]"));
7654-  function nbUrText(div){
7655-    var t = "";
7656-    div.childNodes.forEach(function(n){ if(n.nodeType===3) t += n.textContent; });
7657-    return t;
7658-  }
7659-  function nbEnText(tpl, urText){
7660-    var m;
7661-    if(tpl==="t1"){
7662-      m = urText.match(/(\d{1,2}:\d{2})[^\d]+(\d+)/);
7663-      if(m) return "Until "+m[1]+" AM ("+m[2]+" mins left)";
7664-    }
7665-    else if(tpl==="t3"){
7666-      m = urText.match(/(\d{1,2}:\d{2})/);
7667-      if(m) return "Before "+m[1]+" PM";
7668-    }
7669-    else if(tpl==="t4"){
7670-      m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
7671-      if(m) return "Not less than "+m[1]+" min "+m[2]+" sec";
7672-      m = urText.match(/(\d+)\s*منٹ/);
7673-      if(m) return "Not less than "+m[1]+" mins";
7674-    }
7675-    else if(tpl==="t5"){
7676-      m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
7677-      if(m) return m[1]+" min "+m[2]+" sec";
7678-    }
7679-    return urText;
7680-  }
7681-  function nbUrClean(tpl, urText){
7682-    var m;
7683-    if(tpl==="t1"){
7684-      m = urText.match(/(\d{1,2}:\d{2})[^\d]+(\d+)/);
7685-      if(m) return m[1]+" بجے تک ("+m[2]+" منٹ باقی)";
7686-    }
7687-    else if(tpl==="t3"){
7688-      m = urText.match(/(\d{1,2}:\d{2})/);
7689-      if(m) return m[1]+" بجے سے پہلے تک";
7690-    }
7691-    else if(tpl==="t4"){
7692-      m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
7693-      if(m) return m[1]+" منٹ "+m[2]+" سیکنڈ سے کم نہ ہو";
7694-      m = urText.match(/(\d+)\s*منٹ/);
7695-      if(m) return m[1]+" منٹ سے کم نہ ہو";
7696-    }
7697-    else if(tpl==="t5"){
7698-      m = urText.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
7699-      if(m) return m[1]+" منٹ "+m[2]+" سیکنڈ";
7700-    }
7701-    return urText;
7702-  }
7703-  var nbUrdu = noteBoxes.map(nbUrText);
7704-  var nbEnglish = noteBoxes.map(function(div,i){ return nbEnText(div.getAttribute("data-nb-tpl"), nbUrdu[i]); });
7705-  var nbUrduClean = noteBoxes.map(function(div,i){ return nbUrClean(div.getAttribute("data-nb-tpl"), nbUrdu[i]); });
7706-  function setNbText(div, text){
7707-    var toRemove = [];
7708-    div.childNodes.forEach(function(n){ if(n.nodeType===3) toRemove.push(n); });
7709-    toRemove.forEach(function(n){ div.removeChild(n); });
7710-    div.appendChild(document.createTextNode(text));
7711-  }
7712-
7713-  var EN_TITLES = {nbIshraq:"Ishraq Prayer", nbSawm:"Fasting Niyyah", nbIshaMustahab:"Isha (Mustahab Time)", nbMaghribMin:"Maghrib (Minimum)", nbSunriseMakruh:"Sunrise (Makruh)", nbSunsetMakruh:"Sunset (Makruh)"};
7714-  var UR_TITLES = {nbIshraq:"نمازِ اشراق", nbSawm:"روزے کی نیت", nbIshaMustahab:"عشاء (مستحب وقت)", nbMaghribMin:"مغرب (کم از کم)", nbSunriseMakruh:"طلوعِ آفتاب (مکروہ وقت)", nbSunsetMakruh:"غروبِ آفتاب (مکروہ وقت)"};
7715-
7716-  function renderHomeNotes(){
7717-    var info = todayRow();
7718-    var wrap = document.getElementById('homeNotesGrid');
7719-    if(!info || !wrap) return;
7720-    var panel = document.getElementById('panel-cm'+info.midx);
7721-    var srcGrid = panel ? panel.querySelector('.notes-grid') : null;
7722-    if(!srcGrid){ wrap.innerHTML = ''; return; }
7723-    wrap.innerHTML = srcGrid.innerHTML;
7724-
7725-    var homeBoxes = wrap.querySelectorAll('.note-box[data-nb-tpl]');
7726-    homeBoxes.forEach(function(div){
7727-      var tpl = div.getAttribute('data-nb-tpl');
7728-      var bEl = div.querySelector('b[data-i18n]');
7729-      var i18nKey = bEl ? bEl.getAttribute('data-i18n') : null;
7730-      var rawUr = '';
7731-      div.childNodes.forEach(function(n){ if(n.nodeType===3) rawUr += n.textContent; });
7732-      rawUr = rawUr.replace(/^:\s*/, '');
7733-
7734-      if(lang==='en'){
7735-        if(bEl && i18nKey && EN_TITLES[i18nKey]) bEl.textContent = EN_TITLES[i18nKey];
7736-        var enVal = nbEnText(tpl, rawUr);
7737-        var toRm = [];
7738-        div.childNodes.forEach(function(n){ if(n.nodeType===3) toRm.push(n); });
7739-        toRm.forEach(function(n){ div.removeChild(n); });
7740-        div.appendChild(document.createTextNode(enVal));
7741-      } else {
7742-        if(bEl && i18nKey && UR_TITLES[i18nKey]) bEl.textContent = UR_TITLES[i18nKey];
7743-        var urVal = nbUrClean(tpl, rawUr);
7744-        var toRm2 = [];
7745-        div.childNodes.forEach(function(n){ if(n.nodeType===3) toRm2.push(n); });
7746-        toRm2.forEach(function(n){ div.removeChild(n); });
7747-        div.appendChild(document.createTextNode(urVal));
7748-      }
7749-    });
7750-  }
7751-
7752-  function applyLang(){
7753-    i18nEls.forEach(function(el){
7754-      var k = el.getAttribute("data-i18n");
7755-      el.innerHTML = lang==="en" ? (EN[k]!==undefined?EN[k]:URDU_SNAPSHOT[k]) : URDU_SNAPSHOT[k];
7756-    });
7757-    noteBoxes.forEach(function(div,i){ setNbText(div, lang==="en" ? nbEnglish[i] : nbUrdu[i]); });
7758-    document.documentElement.setAttribute("lang", lang==="en"?"en":"ur");
7759-    var toggleBtn = document.getElementById("langToggle");
7760-    if(toggleBtn) toggleBtn.textContent = lang==="en" ? "UR" : "EN";
7761-    renderDateLine();
7762-    cachedPrayers = renderPrayerRow();
7763-    updateCountdown(cachedPrayers);
7764-    updateLivePrayerWidget(cachedPrayers);
7765-    renderHomeNotes();
7766-  }
7767-
7768-  var PICONS = {
7769-    fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3v3M4.2 11H2m20 0h-2.2M5.6 5.6l1.6 1.6m9.6-1.6-1.6 1.6M4 19h16M7 15a5 5 0 0 1 10 0"/></svg>',
7770-    sunrise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="17" r="3.2"/><path d="M12 9.5V7M6.3 11.8l-1.6-1.6M17.7 11.8l1.6-1.6M2.5 17h2M19.5 17h2M4 21h16"/></svg>',
7771-    dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 12h-2M21.8 12h-2M5.9 5.9l1.4 1.4M16.7 16.7l1.4 1.4M5.9 18.1l1.4-1.4M16.7 7.3l1.4-1.4"/></svg>',
7772-    asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="15" r="4"/><path d="M12 3v2.2M4.5 8.5l1.5 1.5M19.5 8.5 18 10M2.5 15h2M19.5 15h2"/></svg>',
7773-    maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 17h16M6 17a6 6 0 0 1 12 0M9 6l3-3 3 3M12 3v9"/></svg>',
7774-    isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M18 12.5A7 7 0 1 1 11.5 6 5.4 5.4 0 0 0 18 12.5Z"/></svg>'
7775-  };
7776-
7777-  function pad2(n){ return n<10 ? "0"+n : ""+n; }
7778-
7779-
7780-  function todayRow(){
7781-    var d=new Date(),midx=d.getMonth(),day=d.getDate();
7782-    var days=MONTHS[monthOrder[midx]];
7783-    if(!days||!days[day-1])return null;
7784-    return {row:days[day-1],midx:midx,day:day,date:d,location:false};
7785-  }
7786-
7787-  function to12(h){
7788-    var ampm = h < 12 ? "AM" : "PM";
7789-    var hh = h % 12; if(hh===0) hh = 12;
7790-    return { hh: hh, ampm: ampm };
7791-  }
7792-
7793-    function renderPrayerRow(){
7794-    var info = todayRow();
7795-    var wrap = document.getElementById('prayerRow');
7796-    if(!info){ wrap.innerHTML = ''; return; }
7797-    var row = info.row;
7798-    var fh=row[0],fm=row[1], sh=row[2],sm=row[3], zh=row[4],zm=row[5], ah=row[6]+12,am=row[7], mh=row[8]+12,mm=row[9], ih=row[10]+12,im=row[11];
7799-
7800-    var prayers = [
7801-      {key:'fajr', name:PNAMES.fajr[lang], h:fh, m:fm},
7802-      {key:'sunrise', name:PNAMES.sunrise[lang], h:sh, m:sm, displayOnly:true},
7803-      {key:'dhuhr', name:PNAMES.dhuhr[lang], h:zh, m:zm},
7804-      {key:'asr', name:PNAMES.asr[lang], h:ah, m:am},
7805-      {key:'maghrib', name:PNAMES.maghrib[lang], h:mh, m:mm},
7806-      {key:'isha', name:PNAMES.isha[lang], h:ih, m:im}
7807-    ];
7808-
7809-    var now = info.date;
7810-    var nowMin = now.getHours()*60 + now.getMinutes();
7811-    var currentIdx = -1;
7812-    for(var i=0;i<prayers.length;i++){
7813-      if(prayers[i].displayOnly) continue;
7814-      var pm = prayers[i].h*60 + prayers[i].m;
7815-      if(nowMin >= pm) currentIdx = i;
7816-    }
7817-
7818-    var html = '';
7819-    prayers.forEach(function(p, idx){
7820-      var t12 = to12(p.h);
7821-      var cls = 'p-card';
7822-      if(p.displayOnly) cls += ' sunrise';
7823-      else if(idx === currentIdx) {
7824-        cls += ' current';
7825-        cls += ' time-' + p.key;
7826-      }
7827-      html += '<div class="'+cls+'">'
7828-        + '<div class="pt-ampm">'+t12.ampm+'</div>'
7829-        + '<div class="pt-time">'+t12.hh+':'+pad2(p.m)+'</div>'
7830-        + '<div class="pt-icon">'+PICONS[p.key]+'</div>'
7831-        + '<div class="pt-name">'+p.name+'</div>'
7832-        + '</div>';
7833-    });
7834-    wrap.innerHTML = html;
7835-    return prayers;
7836-  }
7837-
7838-  function updateCountdown(prayers){
7839-    var el = document.getElementById('countdownLine');
7840-    if(!prayers){ el.textContent=''; return; }
7841-    var now = new Date();
7842-    var next = null;
7843-    for(var i=0;i<prayers.length;i++){
7844-      if(prayers[i].displayOnly) continue;
7845-      var t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), prayers[i].h, prayers[i].m, 0);
7846-      if(t.getTime() > now.getTime()){ next = {name: prayers[i].name, t: t}; break; }
7847-    }
7848-    if(!next){
7849-      // tomorrow's fajr
7850-      var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
7851-      var midx = tmr.getMonth(), day = tmr.getDate();
7852-      var days = MONTHS[monthOrder[midx]];
7853-      if(days && days[day-1]){
7854-        var row = days[day-1];
7855-        next = {name:PNAMES.fajr[lang], t: new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), row[0], row[1], 0)};
7856-      }
7857-    }
7858-    if(!next){ el.textContent = ''; return; }
7859-    var diff = Math.max(0, next.t.getTime() - now.getTime());
7860-    var s = Math.floor(diff/1000);
7861-    var hh = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60;
7862-    var label = lang==='en' ? ('until '+next.name) : (next.name+' تک');
7863-    el.innerHTML = '<span class="cd-time">'+pad2(hh)+':'+pad2(mm)+':'+pad2(ss)+'</span> <span class="cd-label">&middot; '+label+'</span>';
7864-  }
7865-
7866-  function renderDateLine(){
7867-    var d = new Date();
7868-    var wk = lang==='en' ? weekdaysEN[d.getDay()] : weekdays[d.getDay()];
7869-    var gm = lang==='en' ? gregMonthsEN[d.getMonth()] : gregMonths[d.getMonth()];
7870-    var g = d.getDate()+' - '+(d.getMonth()+1)+' - '+d.getFullYear();
7871-
7872-    var dateLineEl = document.getElementById('dateLine');
7873-    if (dateLineEl) {
7874-      dateLineEl.textContent = wk + ' • ' + g;
7875-      dateLineEl.style.direction = 'ltr';
7876-      dateLineEl.style.unicodeBidi = 'isolate';
7877-      dateLineEl.setAttribute('dir', 'ltr');
7878-    }
7879-
7880-    var gregEl = document.getElementById('gregValue');
7881-    if (gregEl) {
7882-      var day = d.getDate();
7883-      var year = d.getFullYear();
7884-      // Enforce Day Month Year order with LTR isolation (e.g., 26 August 2026)
7885-      gregEl.textContent = day + ' ' + gm + ' ' + year;
7886-      gregEl.style.direction = 'ltr';
7887-      gregEl.style.unicodeBidi = 'isolate';
7888-      gregEl.setAttribute('dir', 'ltr');
7889-    }
7890-
7891-    var hijriEl = document.getElementById('hijriValue');
7892-
7893-    // Android-safe Gregorian → Hijri conversion.
7894-    function gregorianToHijri(date){
7895-      var gy = date.getFullYear();
7896-      var gm = date.getMonth() + 1;
7897-      var gd = date.getDate();
7898-
7899-      var a = Math.floor((14 - gm) / 12);
7900-      var y = gy + 4800 - a;
7901-      var m = gm + 12 * a - 3;
7902-
7903-      var jd = gd
7904-        + Math.floor((153 * m + 2) / 5)
7905-        + 365 * y
7906-        + Math.floor(y / 4)
7907-        - Math.floor(y / 100)
7908-        + Math.floor(y / 400)
7909-        - 32045;
7910-
7911-      var l = jd - 1948440 + 10632;
7912-      var n = Math.floor((l - 1) / 10631);
7913-      l = l - 10631 * n + 354;
7914-
7915-      var j =
7916-        (Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719))
7917-        + (Math.floor(l / 5670) * Math.floor((43 * l) / 15238));
7918-
7919-      l = l
7920-        - (Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50))
7921-        - (Math.floor(j / 16) * Math.floor((15238 * j) / 43))
7922-        + 29;
7923-
7924-      var hm = Math.floor((24 * l) / 709);
7925-      var hd = l - Math.floor((709 * hm) / 24);
7926-      var hy = 30 * n + j - 30;
7927-
7928-      return {day: hd, month: hm, year: hy};
7929-    }
7930-
7931-    var hijriMonthsEN = [
7932-      'Muharram','Safar','Rabi al-Awwal','Rabi al-Thani',
7933-      'Jumada al-Awwal','Jumada al-Thani','Rajab','Sha’ban',
7934-      'Ramadan','Shawwal','Dhu al-Qi’dah','Dhu al-Hijjah'
7935-    ];
7936-
7937-    var hijriMonthsUR = [
7938-      'محرم','صفر','ربیع الاول','ربیع الثانی',
7939-      'جمادی الاول','جمادی الثانی','رجب','شعبان',
7940-      'رمضان','شوال','ذوالقعدہ','ذوالحجہ'
7941-    ];
7942-
7943-    try{
7944-      var h = gregorianToHijri(d);
7945-      var hm = lang === 'en'
7946-        ? hijriMonthsEN[h.month - 1]
7947-        : hijriMonthsUR[h.month - 1];
7948-      hijriEl.textContent = h.day + ' ' + hm + ' ' + h.year;
7949-    }catch(e){
7950-      hijriEl.textContent = '—';
7951-    }
7952-  }
7953-
7954-  function updateLivePrayerWidget(prayers){
7955-    var box=document.getElementById('livePrayerWidget');
7956-    if(!box || !prayers) return;
7957-    var now=new Date(), next=null, current=null;
7958-    for(var i=0;i<prayers.length;i++){
7959-      if(prayers[i].displayOnly) continue;
7960-      var pt=new Date(now.getFullYear(),now.getMonth(),now.getDate(),prayers[i].h,prayers[i].m,0);
7961-      if(pt.getTime()<=now.getTime()) current=prayers[i];
7962-      if(!next && pt.getTime()>now.getTime()) next={p:prayers[i],t:pt};
7963-    }
7964-    if(!next){
7965-      var tmr=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1), info=todayRow();
7966-      var days=MONTHS[monthOrder[tmr.getMonth()]], row=days&&days[tmr.getDate()-1];
7967-      if(row) next={p:{key:'fajr',name:PNAMES.fajr[lang],h:row[0],m:row[1]},t:new Date(tmr.getFullYear(),tmr.getMonth(),tmr.getDate(),row[0],row[1],0)};
7968-    }
7969-    if(!next) return;
7970-    var diff=Math.max(0,next.t.getTime()-now.getTime()), total=Math.floor(diff/1000);
7971-    var hh=Math.floor(total/3600), mm=Math.floor((total%3600)/60), ss=total%60;
7972-    var name=document.getElementById('livePrayerName'), cd=document.getElementById('livePrayerCountdown'), tm=document.getElementById('livePrayerTime'), nx=document.getElementById('livePrayerNext'), pr=document.getElementById('livePrayerProgress'), status=document.getElementById('livePrayerStatus');
7973-    name.textContent=next.p.name;
7974-    cd.textContent=pad2(hh)+':'+pad2(mm)+':'+pad2(ss);
7975-    var t12=to12(next.p.h);
7976-    tm.textContent=t12.hh+':'+pad2(next.p.m)+' '+t12.ampm;
7977-    if(current) nx.textContent=(lang==='en'?'Current: '+current.name+' • Next prayer':'موجودہ: '+current.name+' • اگلی نماز: '+next.p.name);
7978-    else nx.textContent=(lang==='en'?'Next prayer':'اگلی نماز')+' • '+next.p.name;
7979-    status.textContent='LIVE';
7980-    // Progress is based on the time from the previous prayer to the next one.
7981-    var prevTime=null;
7982-    for(var j=prayers.length-1;j>=0;j--){
7983-      if(prayers[j].displayOnly) continue;
7984-      var prev=new Date(now.getFullYear(),now.getMonth(),now.getDate(),prayers[j].h,prayers[j].m,0);
7985-      if(prev.getTime()<next.t.getTime()){prevTime=prev;break;}
7986-    }
7987-    if(!prevTime){var y=new Date(next.t);y.setDate(y.getDate()-1);prevTime=y;}
7988-    var span=next.t.getTime()-prevTime.getTime();
7989-    var elapsed=now.getTime()-prevTime.getTime();
7990-    pr.style.width=Math.max(0,Math.min(100,(elapsed/span)*100))+'%';
7991-  }
7992-
7993-  function renderClock(){
7994-    var d = new Date();
7995-    document.getElementById('liveClock').textContent = pad2(d.getHours())+':'+pad2(d.getMinutes());
7996-  }
7997-
7998-  var cachedPrayers = null;
7999-  var lastPrayerRenderKey = '';
8000-  function prayerRenderKey(){
8001-    var d = new Date();
8002-    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'-'+d.getHours()+'-'+d.getMinutes();
8003-  }
8004-  function tick(){
8005-    renderClock();
8006-    var key = prayerRenderKey();
8007-    // Prayer cards are time-sensitive. Re-render them automatically when the
8008-    // minute changes so the highlighted card changes at the actual prayer
8009-    // entry time without requiring Settings -> Update.
8010-    if(key !== lastPrayerRenderKey){
8011-      cachedPrayers = renderPrayerRow();
8012-      lastPrayerRenderKey = key;
8013-      renderHomeNotes();
8014-    }
8015-    updateCountdown(cachedPrayers);
8016-    updateLivePrayerWidget(cachedPrayers);
8017-  }
8018-
8019-  function highlightTodayInCalendar(){
8020-    var d = new Date();
8021-    var midx = d.getMonth();
8022-    var day = d.getDate();
8023-
8024-    // Automatically select the current month.
8025-    var monthRadio = document.getElementById('cm' + midx);
8026-    if(monthRadio) monthRadio.checked = true;
8027-
8028-    // Remove any previous date highlight, then highlight today.
8029-    document.querySelectorAll('.cal-table tbody tr.calendar-today').forEach(function(row){
8030-      row.classList.remove('calendar-today');
8031-    });
8032-
8033-    var panel = document.getElementById('panel-cm' + midx);
8034-    if(!panel) return;
8035-    var todayRowEl = panel.querySelector('tbody tr[data-day="' + day + '"]');
8036-    if(todayRowEl) todayRowEl.classList.add('calendar-today');
8037-  }
8038-
8039-  function initHome(){
8040-    highlightTodayInCalendar();
8041-    applyLang();
8042-    tick();
8043-    setInterval(tick, 1000);
8044-  }
8045-
8046-  var langToggleBtn = document.getElementById('langToggle');
8047-  if(langToggleBtn){
8048-    langToggleBtn.addEventListener('click', function(){
8049-      lang = lang === 'en' ? 'ur' : 'en';
8050-      try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
8051-      applyLang();
8052-    });
8053-  }
8054-
8055-  // ---- Tabs ----
8056-  /* Manzil reading font-size control */
8057-  (function(){
8058-    var key = "manzil_font_size_v1";
8059-    var allowed = ["24","27","30"];
8060-    var saved = null;
8061-    try{ saved = localStorage.getItem(key); }catch(e){}
8062-    if(allowed.indexOf(saved)<0) saved = "27";
8063-    document.documentElement.style.setProperty("--manzil-font-size", saved+"px");
8064-
8065-    function setManzilFontSize(size){
8066-      if(allowed.indexOf(String(size))<0) return;
8067-      document.documentElement.style.setProperty("--manzil-font-size", String(size)+"px");
8068-      try{ localStorage.setItem(key, String(size)); }catch(e){}
8069-      document.querySelectorAll("[data-manzil-font]").forEach(function(btn){
8070-        btn.classList.toggle("active", btn.getAttribute("data-manzil-font")===String(size));
8071-      });
8072-    }
8073-
8074-    document.addEventListener("click", function(e){
8075-      var btn = e.target.closest && e.target.closest("[data-manzil-font]");
8076-      if(btn) setManzilFontSize(btn.getAttribute("data-manzil-font"));
8077-    });
8078-
8079-    setManzilFontSize(saved);
8080-  })();
8081-
8082-  var tabs = ['home','calendar','quran','hadith','settings','about','articles','qibla','zikr','manzil','duas','library'];
8083-
8084-  // === UTILITY: escapeHtml ===
8085-  function escapeHtml(str) {
8086-    if (str == null) return '';
8087-    return String(str)
8088-      .replace(/&/g, '&amp;')
8089-      .replace(/</g, '&lt;')
8090-      .replace(/>/g, '&gt;')
8091-      .replace(/"/g, '&quot;')
8092-      .replace(/'/g, '&#039;');
8093-  }
8094-
8095-  // === TAB SWITCHING ===
8096-  function showTab(name) {
8097-    if (name === 'quran') {
8098-      if (window.QurbBridge && typeof window.QurbBridge.postMessage === 'function') {
8099-        try {
8100-          window.QurbBridge.postMessage(JSON.stringify({ action: 'openQuran' }));
8101-          return;
8102-        } catch(e) {
8103-          console.warn('Bridge openQuran error:', e);
8104-        }
8105-      }
8106-    }
8107-
8108-    tabs.forEach(function(t) {
8109-      var panel = document.getElementById('tab-' + t);
8110-      if (panel) panel.classList.toggle('active', t === name);
8111-    });
8112-    document.querySelectorAll('.nav-item').forEach(function(btn) {
8113-      btn.classList.toggle('active', btn.dataset.tab === name);
8114-    });
8115-    window.scrollTo(0, 0);
8116-
8117-    if (name === 'home' && typeof initHome === 'function') initHome();
8118-    if (name === 'quran' && typeof initQuran === 'function') initQuran();
8119-    if (name === 'hadith' && typeof initHadith === 'function') initHadith();
8120-    if (name === 'duas' && typeof initDuasLibrary === 'function') initDuasLibrary();
8121-    if (name === 'library' && typeof initLibrary === 'function') initLibrary();
8122-    if (name === 'qibla' && typeof startQiblaFinder === 'function') startQiblaFinder();
8123-    if (name === 'manzil' && typeof initManzil === 'function') initManzil();
8124-    if (name === 'zikr' && typeof initZikrBook === 'function') initZikrBook();
8125-    if (name === 'articles' && typeof loadArticles === 'function') loadArticles();
8126-    if (name === 'calendar' && typeof highlightTodayInCalendar === 'function') highlightTodayInCalendar();
8127-  }
8128-
8129-  // === QURAN STATE ===
8130-  var quranState = {
8131-    current: null,
8132-    fontSize: 1.55,
8133-    showUrdu: true,
8134-    showEn: true
8135-  };
8136-
8137-  // === QURAN CACHING (IndexedDB) ===
8138-  var QURAN_DB_NAME = 'qurb_quran_cache';
8139-  var QURAN_DB_VERSION = 1;
8140-  var QURAN_STORE = 'surahs';
8141-
8142-  function quranOpenDB() {
8143-    return new Promise(function(resolve, reject) {
8144-      try {
8145-        var req = indexedDB.open(QURAN_DB_NAME, QURAN_DB_VERSION);
8146-        req.onupgradeneeded = function(e) {
8147-          var db = e.target.result;
8148-          if (!db.objectStoreNames.contains(QURAN_STORE)) {
8149-            db.createObjectStore(QURAN_STORE, { keyPath: 'num' });
8150-          }
8151-        };
8152-        req.onsuccess = function(e) { resolve(e.target.result); };
8153-        req.onerror = function() { reject(new Error('IndexedDB open failed')); };
8154-      } catch(err) { reject(err); }
8155-    });
8156-  }
8157-
8158-  function quranGetCached(n) {
8159-    return quranOpenDB().then(function(db) {
8160-      return new Promise(function(resolve, reject) {
8161-        var tx = db.transaction(QURAN_STORE, 'readonly');
8162-        var store = tx.objectStore(QURAN_STORE);
8163-        var req = store.get(n);
8164-        req.onsuccess = function() { resolve(req.result ? req.result.data : null); };
8165-        req.onerror = function() { reject(new Error('IDB get error')); };
8166-      });
8167-    });
8168-  }
8169-
8170-  function quranPutCached(n, data) {
8171-    return quranOpenDB().then(function(db) {
8172-      return new Promise(function(resolve, reject) {
8173-        var tx = db.transaction(QURAN_STORE, 'readwrite');
8174-        var store = tx.objectStore(QURAN_STORE);
8175-        store.put({ num: n, data: data });
8176-        tx.oncomplete = function() { resolve(); };
8177-        tx.onerror = function() { reject(new Error('IDB put error')); };
8178-      });
8179-    });
8180-  }
8181-
8182-  function quranDownloadAll() {
8183-    var statusEl = document.getElementById('quranDownloadStatus');
8184-    var dlBtn = document.getElementById('quranDownloadBtn');
8185-    if (dlBtn) dlBtn.disabled = true;
8186-    
8187-    var total = 114;
8188-    var done = 0;
8189-    var failed = [];
8190-    
8191-    if (statusEl) statusEl.innerHTML = '<span style="color:#D4AF37;">⏳ ڈاؤن لوڈ شروع... 0/' + total + '</span>';
8192-    
8193-    function downloadNext(i) {
8194-      if (i > total) {
8195-        if (dlBtn) dlBtn.disabled = false;
8196-        var msg = failed.length 
8197-          ? '⚠️ ' + (total - failed.length) + '/' + total + ' سورتیں محفوظ ہوگئیں۔ (' + failed.length + ' ناکام)'
8198-          : '✅ تمام ' + total + ' سورتیں آف لائن محفوظ ہوگئیں!';
8199-        if (statusEl) statusEl.innerHTML = '<span style="color:' + (failed.length ? '#f59e0b' : '#16a34a') + ';">' + msg + '</span>';
8200-        return;
8201-      }
8202-      
8203-      var url = 'https://api.alquran.cloud/v1/surah/' + i + '/editions/quran-uthmani,ur.jalandhry,en.sahih';
8204-      fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined })
8205-        .then(function(r) { return r.json(); })
8206-        .then(function(raw) {
8207-          if (raw && raw.code === 200 && raw.data && raw.data.length >= 3) {
8208-            var ayahs = raw.data[0].ayahs.map(function(a, idx) {
8209-              return {
8210-                number: a.number,
8211-                numberInSurah: a.numberInSurah,
8212-                arabic: a.text,
8213-                urdu: raw.data[1].ayahs[idx] ? raw.data[1].ayahs[idx].text : '',
8214-                translation: raw.data[2].ayahs[idx] ? raw.data[2].ayahs[idx].text : ''
8215-              };
8216-            });
8217-            var payload = { surahNum: i, ayahs: ayahs };
8218-            return quranPutCached(i, payload).catch(function(){}).then(function() {
8219-              try { localStorage.setItem('qurb_surah_cache_' + i, JSON.stringify(payload)); } catch(e) {}
8220-            });
8221-          }
8222-        })
8223-        .catch(function() { failed.push(i); })
8224-        .then(function() {
8225-          done++;
8226-          if (statusEl) statusEl.innerHTML = '<span style="color:#D4AF37;">⏳ ڈاؤن لوڈ... ' + done + '/' + total + '</span>';
8227-          setTimeout(function() { downloadNext(i + 1); }, 200);
8228-        });
8229-    }
8230-    
8231-    downloadNext(1);
8232-  }
8233-
8234-  // === NAV BAR CLICK HANDLER ===
8235-  document.querySelectorAll('.nav-item').forEach(function(btn) {
8236-    btn.addEventListener('click', function() {
8237-      var tab = btn.getAttribute('data-tab');
8238-      if (tab) showTab(tab);
8239-    });
8240-  });
8241-
8242-  // === SHOW TOAST HELPER (if not already defined) ===
8243-  if (typeof window.showToast !== 'function') {
8244-    window.showToast = function(msg) {
8245-      var t = document.getElementById('toast');
8246-      if (!t) {
8247-        t = document.createElement('div');
8248-        t.id = 'toast';
8249-        t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1C130D;color:#D4AF37;padding:10px 24px;border-radius:20px;border:1px solid #382517;font-size:0.85rem;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;text-align:center;max-width:90vw;';
8250-        document.body.appendChild(t);
8251-      }
8252-      t.textContent = msg;
8253-      t.style.opacity = '1';
8254-      clearTimeout(t._timer);
8255-      t._timer = setTimeout(function() { t.style.opacity = '0'; }, 2500);
8256-    };
8257-  }
8258-
8259-
8260-
8261-    // ================= 40 MASNOON DUAS CURATED OFFLINE DATASET =================
8262-    
8263-  // ================= COMPLETE ISLAMIC DATASETS =================
8264-  var MASNOON_40_DUAS = [
8265-    {
8266-      id: 1,
8267-      category: "صبح و شام",
8268-      categoryEn: "Morning & Evening",
8269-      titleUr: "سو کر بیدار ہونے کی دعا",
8270-      titleEn: "Upon Waking Up",
8271-      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
8272-      transliteration: "Alhamdu lillahil-ladhee ahyana ba'da ma amatana wa-ilayhin-nushoor.",
8273-      urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف اٹھ کر جانا ہے۔",
8274-      translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
8275-      source: "صحیح البخاری: 6312"
8276-    },
8277-    {
8278-      id: 2,
8279-      category: "صبح و شام",
8280-      categoryEn: "Morning & Evening",
8281-      titleUr: "سوتے وقت کی دعا",
8282-      titleEn: "Before Sleeping",
8283-      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
8284-      transliteration: "Bismika Allahumma amootu wa-ahya.",
8285-      urdu: "اے اللہ! میں تیرے نام کے ساتھ مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔",
8286-      translation: "In Your name, O Allah, I die and I live.",
8287-      source: "صحیح البخاری: 6324"
8288-    },
8289-    {
8290-      id: 3,
8291-      category: "روزمرہ",
8292-      categoryEn: "Daily Life",
8293-      titleUr: "بیت الخلاء میں داخل ہونے کی دعا",
8294-      titleEn: "Entering the Washroom",
8295-      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
8296-      transliteration: "Allahumma innee a'oodhu bika minal-khubuthi wal-khabaa'ith.",
8297-      urdu: "اے اللہ! میں ناپاک جنوں اور جننیوں (تمام نجاستوں) سے تیری پناہ مانگتا ہوں۔",
8298-      translation: "O Allah, I seek refuge in You from evil and evil spirits (all impurity).",
8299-      source: "صحیح البخاری: 142"
8300-    },
8301-    {
8302-      id: 4,
8303-      category: "روزمرہ",
8304-      categoryEn: "Daily Life",
8305-      titleUr: "بیت الخلاء سے نکلنے کی دعا",
8306-      titleEn: "Leaving the Washroom",
8307-      arabic: "غُفْرَانَكَ ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
8308-      transliteration: "Ghufranaka, alhamdu lillahil-ladhee adhhaba 'annil-adha wa 'aafanee.",
8309-      urdu: "اے اللہ! تیری بخشش طلب کرتا ہوں، تمام تعریفیں اللہ کے لیے ہیں جس نے مجھ سے تکلیف دور کی اور عافیت بخشی۔",
8310-      translation: "I seek Your forgiveness. All praise is for Allah who removed harm from me and granted me health.",
8311-      source: "سنن ابو داؤد: 17، سنن ابن ماجہ: 301"
8312-    },
8313-    {
8314-      id: 5,
8315-      category: "نماز و وضو",
8316-      categoryEn: "Prayer & Wudu",
8317-      titleUr: "وضو شروع کرنے کی دعا",
8318-      titleEn: "Starting Wudu (Ablution)",
8319-      arabic: "بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ",
8320-      transliteration: "Bismillahir-Rahmanir-Raheem.",
8321-      urdu: "اللہ کے نام سے شروع جو نہایت مہربان بہت رحم والا ہے۔",
8322-      translation: "In the name of Allah, the Most Gracious, the Most Merciful.",
8323-      source: "سنن ابو داؤد: 101"
8324-    },
8325-    {
8326-      id: 6,
8327-      category: "نماز و وضو",
8328-      categoryEn: "Prayer & Wudu",
8329-      titleUr: "وضو کے بعد کی دعا",
8330-      titleEn: "After Completing Wudu",
8331-      arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
8332-      transliteration: "Ash-hadu an la ilaha illallahu wahdahu la shareeka lahu wa ash-hadu anna Muhammadan 'abduhu wa rasooluh. Allahummaj-'alnee minat-tawwabeena waj-'alnee minal-mutatahhireen.",
8333-      urdu: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے خوب توبہ کرنے والوں اور پاکیزگی اختیار کرنے والوں میں شامل فرما۔",
8334-      translation: "I bear witness that none has the right to be worshipped except Allah alone, without partner, and Muhammad is His slave and Messenger. O Allah, make me of those who repent and purify themselves.",
8335-      source: "صحیح مسلم: 234، جامع الترمذی: 55"
8336-    },
8337-    {
8338-      id: 7,
8339-      category: "کھانا و پینا",
8340-      categoryEn: "Food & Drink",
8341-      titleUr: "کھانا شروع کرنے کی دعا",
8342-      titleEn: "Before Eating",
8343-      arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
8344-      transliteration: "Bismillahi wa 'ala barakatillah.",
8345-      urdu: "اللہ کے نام کے ساتھ اور اللہ کی برکت پر (کھانا شروع کرتا ہوں)۔",
8346-      translation: "In the name of Allah and with the blessings of Allah.",
8347-      source: "المستدرک للحاکم: 7084"
8348-    },
8349-    {
8350-      id: 8,
8351-      category: "کھانا و پینا",
8352-      categoryEn: "Food & Drink",
8353-      titleUr: "کھانے کے درمیان یاد آنے پر دعا",
8354-      titleEn: "If Forgotten at Start of Eating",
8355-      arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
8356-      transliteration: "Bismillahi awwalahu wa aakhirahu.",
8357-      urdu: "اللہ کے نام کے ساتھ اس کے اول اور آخر میں۔",
8358-      translation: "In the name of Allah at its beginning and its end.",
8359-      source: "سنن ابو داؤد: 3767، جامع الترمذی: 1858"
8360-    },
8361-    {
8362-      id: 9,
8363-      category: "کھانا و پینا",
8364-      categoryEn: "Food & Drink",
8365-      titleUr: "کھانا کھانے کے بعد کی دعا",
8366-      titleEn: "After Finishing Meal",
8367-      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
8368-      transliteration: "Alhamdu lillahil-ladhee at'amana wa saqana wa ja'alana muslimeen.",
8369-      urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمان بنایا۔",
8370-      translation: "All praise belongs to Allah who fed us and gave us drink and made us Muslims.",
8371-      source: "سنن ابو داؤد: 3850، جامع الترمذی: 3457"
8372-    },
8373-    {
8374-      id: 10,
8375-      category: "کھانا و پینا",
8376-      categoryEn: "Food & Drink",
8377-      titleUr: "دودھ پینے کے بعد کی دعا",
8378-      titleEn: "After Drinking Milk",
8379-      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
8380-      transliteration: "Allahumma barik lana feehi wa zidna minh.",
8381-      urdu: "اے اللہ! ہمارے لیے اس میں برکت عطا فرما اور ہمیں اس سے مزید عطا فرما۔",
8382-      translation: "O Allah, bless it for us and give us more of it.",
8383-      source: "سنن ابو داؤد: 3730، جامع الترمذی: 3455"
8384-    },
8385-    {
8386-      id: 11,
8387-      category: "روزمرہ",
8388-      categoryEn: "Daily Life",
8389-      titleUr: "گھر میں داخل ہونے کی دعا",
8390-      titleEn: "Entering the House",
8391-      arabic: "بِسْمِ اللَّهِ وَلَجْنَا ، وَبِسْمِ اللَّهِ خَرَجْنَا ، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
8392-      transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala rabbina tawakkalna.",
8393-      urdu: "اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ کے نام کے ساتھ ہم نکلے اور اپنے رب پر ہم نے بھروسہ کیا۔",
8394-      translation: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.",
8395-      source: "سنن ابو داؤد: 5096"
8396-    },
8397-    {
8398-      id: 12,
8399-      category: "روزمرہ",
8400-      categoryEn: "Daily Life",
8401-      titleUr: "گھر سے نکلتے وقت کی دعا",
8402-      titleEn: "Leaving the House",
8403-      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
8404-      transliteration: "Bismillahi tawakkaltu 'alallah, la hawla wa la quwwata illa billah.",
8405-      urdu: "اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، برائی سے بچنے اور نیکی کرنے کی طاقت صرف اللہ کی مدد سے ہے۔",
8406-      translation: "In the name of Allah, I trust in Allah; there is no power and no strength except with Allah.",
8407-      source: "سنن ابو داؤد: 5095، جامع الترمذی: 3426"
8408-    },
8409-    {
8410-      id: 13,
8411-      category: "نماز و وضو",
8412-      categoryEn: "Prayer & Wudu",
8413-      titleUr: "مسجد میں داخل ہونے کی دعا",
8414-      titleEn: "Entering the Mosque",
8415-      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
8416-      transliteration: "Allahummaf-tah lee abwaba rahmatik.",
8417-      urdu: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
8418-      translation: "O Allah, open for me the doors of Your mercy.",
8419-      source: "صحیح مسلم: 713"
8420-    },
8421-    {
8422-      id: 14,
8423-      category: "نماز و وضو",
8424-      categoryEn: "Prayer & Wudu",
8425-      titleUr: "مسجد سے نکلنے کی دعا",
8426-      titleEn: "Leaving the Mosque",
8427-      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
8428-      transliteration: "Allahumma innee as'aluka min fadlik.",
8429-      urdu: "اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔",
8430-      translation: "O Allah, I ask You from Your bounty.",
8431-      source: "صحیح مسلم: 713"
8432-    },
8433-    {
8434-      id: 15,
8435-      category: "روزمرہ",
8436-      categoryEn: "Daily Life",
8437-      titleUr: "نیا لباس پہننے کی دعا",
8438-      titleEn: "Wearing New Clothes",
8439-      arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هٰذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
8440-      transliteration: "Alhamdu lillahil-ladhee kasanee hadhath-thawba wa razaqaneehi min ghayri hawlin minnee wa la quwwah.",
8441-      urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کپڑا پہنایا اور میری کسی طاقت کے بغیر مجھے یہ عطا فرمایا۔",
8442-      translation: "Praise be to Allah who has clothed me with this garment and provided it for me without any power or strength on my part.",
8443-      source: "سنن ابو داؤد: 4023"
8444-    },
8445-    {
8446-      id: 16,
8447-      category: "روزمرہ",
8448-      categoryEn: "Daily Life",
8449-      titleUr: "آئینہ دیکھنے کی دعا",
8450-      titleEn: "Looking into the Mirror",
8451-      arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
8452-      transliteration: "Allahumma anta hassanta khalqee fahassin khuluqee.",
8453-      urdu: "اے اللہ! جیسا تو نے میری صورت کو خوبصورت بنایا ہے، ویسے ہی میرے اخلاق کو بھی اچھا بنا دے۔",
8454-      translation: "O Allah, just as You made my external form beautiful, make my character beautiful as well.",
8455-      source: "مسند احمد: 24392"
8456-    },
8457-    {
8458-      id: 17,
8459-      category: "سفر و سواری",
8460-      categoryEn: "Travel",
8461-      titleUr: "سواری پر سوار ہونے کی دعا",
8462-      titleEn: "Mounting a Vehicle / Travel",
8463-      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
8464-      transliteration: "Subhanal-ladhee sakh-khara lana hadha wa ma kunna lahu muqrineen, wa inna ila rabbina lamunqaliboon.",
8465-      urdu: "پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے تابع کیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور یقیناً ہم اپنے رب ہی کی طرف لوٹ کر جانے والے ہیں۔",
8466-      translation: "Glory to Him who has subjected this to us, and we could never have achieved it by ourselves. And verily, unto our Lord we are to return.",
8467-      source: "القرآن: الزخرف 13-14، صحیح مسلم: 1342"
8468-    },
8469-    {
8470-      id: 18,
8471-      category: "سفر و سواری",
8472-      categoryEn: "Travel",
8473-      titleUr: "مسافر کو رخصت کرنے کی دعا",
8474-      titleEn: "Bidding Farewell to a Traveler",
8475-      arabic: "أَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ",
8476-      transliteration: "Astawdi'ullaha deenaka wa amanataka wa khawateema 'amalik.",
8477-      urdu: "میں تمہارے دین، تمہاری امانت اور تمہارے آخری اعمال کو اللہ کی حفاظت میں سونپتا ہوں۔",
8478-      translation: "I entrust to Allah your religion, your trust, and the end of your deeds.",
8479-      source: "سنن ابو داؤد: 2600، جامع الترمذی: 3443"
8480-    },
8481-    {
8482-      id: 19,
8483-      category: "سفر و سواری",
8484-      categoryEn: "Travel",
8485-      titleUr: "سفر سے واپسی کی دعا",
8486-      titleEn: "Returning from Travel",
8487-      arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
8488-      transliteration: "Aayiboona, ta'iboona, 'aabidoona, li-rabbina hamidoon.",
8489-      urdu: "ہم واپس آنے والے ہیں، توبہ کرنے والے ہیں، عبادت گزار ہیں اور اپنے رب کی تعریف کرنے والے ہیں۔",
8490-      translation: "We are returning, repenting, worshipping, and praising our Lord.",
8491-      source: "صحیح مسلم: 1342"
8492-    },
8493-    {
8494-      id: 20,
8495-      category: "نماز و وضو",
8496-      categoryEn: "Prayer & Wudu",
8497-      titleUr: "اذان کے بعد کی مسنون دعا",
8498-      titleEn: "Dua After the Adhan",
8499-      arabic: "اللَّهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
8500-      transliteration: "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, aati Muhammadanil-waseelata wal-fadeelah, wab'athhu maqamam-mahmoodanilladhee wa'adtah.",
8501-      urdu: "اے اللہ! اس کامل پکار اور قائم ہونے والی نماز کے رب! حضرت محمد ﷺ کو وسیلہ اور فضیلت عطا فرما اور انہیں اس مقامِ محمود پر فائز فرما جس کا تو نے ان سے وعدہ فرمایا ہے۔",
8502-      translation: "O Allah, Lord of this perfect call and established prayer, grant Muhammad the station of intercession and nobility, and raise him to the praised station which You have promised him.",
8503-      source: "صحیح البخاری: 614"
8504-    },
8505-    {
8506-      id: 21,
8507-      category: "نماز و وضو",
8508-      categoryEn: "Prayer & Wudu",
8509-      titleUr: "دونوں سجدوں کے درمیان کی دعا",
8510-      titleEn: "Between Two Prostrations",
8511-      arabic: "رَبِّ اغْفِرْ لِي ، اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي",
8512-      transliteration: "Rabbigh-fir lee, Allahummagh-fir lee war-hamnee wah-dinee wa 'aafinee war-zuqnee.",
8513-      urdu: "اے میرے رب! مجھے بخش دے۔ اے اللہ! مجھے بخش دے، مجھ پر رحم فرما، مجھے ہدایت دے، عافیت بخش اور رزق عطا فرما۔",
8514-      translation: "O my Lord, forgive me. O Allah, forgive me, have mercy on me, guide me, grant me health, and provide for me.",
8515-      source: "سنن ابو داؤد: 850، جامع الترمذی: 284"
8516-    },
8517-    {
8518-      id: 22,
8519-      category: "نماز و وضو",
8520-      categoryEn: "Prayer & Wudu",
8521-      titleUr: "دعائے استخارہ",
8522-      titleEn: "Dua for Istikhara",
8523-      arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ وَتَعْلَمُ وَلَا أَعْلَمُ وَأَنْتَ عَلَّامُ الْغُيُوبِ",
8524-      transliteration: "Allahumma innee astakheeruka bi-'ilmika wa astaqdiruka bi-qudratika wa as'aluka min fadlikal-'azeem, fa-innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa anta 'Allamul-ghuyoob.",
8525-      urdu: "اے اللہ! میں تیرے علم کی برکت سے تجھ سے بھلائی طلب کرتا ہوں اور تیری قدرت سے طاقت مانگتا ہوں اور تیرے عظیم فضل کا سوال کرتا ہوں کیونکہ تو قدرت رکھتا ہے اور میں نہیں رکھتا، تو جانتا ہے اور میں نہیں جانتا اور تو تمام غیبوں کا خوب جاننے والا ہے۔",
8526-      translation: "O Allah, I seek Your counsel through Your knowledge, and I seek ability through Your power, and I beg of Your immense bounty. For You are capable and I am not, You know and I do not, and You are the Knower of the unseen.",
8527-      source: "صحیح البخاری: 1162"
8528-    },
8529-    {
8530-      id: 23,
8531-      category: "روزمرہ",
8532-      categoryEn: "Daily Life",
8533-      titleUr: "افطار کے وقت کی دعا",
8534-      titleEn: "Breaking the Fast (Iftar)",
8535-      arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
8536-      transliteration: "Dhahabadh-zhama'u wabtallatil-'urooqu wa thabatal-ajru in sha Allah.",
8537-      urdu: "پیاس چلی گئی، رگیں تر ہو گئیں اور اجر ثابت ہو گیا اگر اللہ نے چاہا۔",
8538-      translation: "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
8539-      source: "سنن ابو داؤد: 2357"
8540-    },
8541-    {
8542-      id: 24,
8543-      category: "استغفار و توبہ",
8544-      categoryEn: "Forgiveness",
8545-      titleUr: "شب قدر کی مسنون دعا",
8546-      titleEn: "Dua for Laylatul Qadr",
8547-      arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
8548-      transliteration: "Allahumma innaka 'Afuwwun tuhibbul-'afwa fa'fu 'annee.",
8549-      urdu: "اے اللہ! بے شک تو معاف فرمانے والا ہے، معافی کو پسند فرماتا ہے، پس مجھے معاف فرما دے۔",
8550-      translation: "O Allah, You are Most Forgiving, and You love forgiveness, so forgive me.",
8551-      source: "جامع الترمذی: 3513، سنن ابن ماجہ: 3850"
8552-    },
8553-    {
8554-      id: 25,
8555-      category: "روزمرہ",
8556-      categoryEn: "Daily Life",
8557-      titleUr: "بازار میں داخل ہونے کی دعا",
8558-      titleEn: "Entering the Marketplace",
8559-      arabic: "لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
8560-      transliteration: "La ilaha illallahu wahdahu la shareeka lahu, lahul-mulku wa lahul-hamdu yuhyee wa yumeetu wa huwa hayyun la yamootu biyadihil-khayru wa huwa 'ala kulli shay'in qadeer.",
8561-      urdu: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تمام تعریفیں ہیں، وہی زندہ کرتا ہے اور مارتا ہے اور وہ ہمیشہ زندہ ہے جسے کبھی موت نہیں، تمام بھلائی اسی کے ہاتھ میں ہے اور وہ ہر چیز پر پوری قدرت رکھنے والا ہے۔",
8562-      translation: "None has the right to be worshipped except Allah alone without partner; to Him belongs all sovereignty and praise; He gives life and causes death, and He is living and never dies; in His hand is all good, and He is over all things capable.",
8563-      source: "جامع الترمذی: 3428"
8564-    },
8565-    {
8566-      id: 26,
8567-      category: "روزمرہ",
8568-      categoryEn: "Daily Life",
8569-      titleUr: "مریض کی عیادت کی دعا",
8570-      titleEn: "Visiting the Sick",
8571-      arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ ، أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
8572-      transliteration: "La ba'sa tahoorun in sha Allah. As'alullahal-'Azeema Rabbal-'Arshil-'Azeemi an yashfiyak.",
8573-      urdu: "کوئی حرج نہیں، یہ بیماری گناہوں سے پاک کرنے والی ہے اگر اللہ نے چاہا۔ میں عظمت والے اللہ، عرشِ عظیم کے رب سے دعا کرتا ہوں کہ وہ آپ کو شفا عطا فرمائے۔",
8574-      translation: "Do not worry; it is a purification, if Allah wills. I ask Allah the Almighty, Lord of the Magnificent Throne, to cure you.",
8575-      source: "صحیح البخاری: 3616، سنن ابو داؤد: 3106"
8576-    },
8577-    {
8578-      id: 27,
8579-      category: "پریشانی و حفاظت",
8580-      categoryEn: "Protection & Relief",
8581-      titleUr: "غم، پریشانی اور قرض سے نجات کی دعا",
8582-      titleEn: "Relief from Grief, Worry & Debt",
8583-      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
8584-      transliteration: "Allahumma innee a'oodhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali wal-jubni wal-bukhli wa dala'id-dayni wa ghalabatir-rijal.",
8585-      urdu: "اے اللہ! میں غم و فکر، عاجزی و سستی، بزدلی و کنجوسی، قرض کے بوجھ اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔",
8586-      translation: "O Allah, I seek refuge in You from anxiety, grief, incapacity, laziness, cowardice, miserliness, the burden of debt, and being overpowered by people.",
8587-      source: "صحیح البخاری: 2893"
8588-    },
8589-    {
8590-      id: 28,
8591-      category: "پریشانی و حفاظت",
8592-      categoryEn: "Protection & Relief",
8593-      titleUr: "حضرت یونس علیہ السلام کی دعا (آیت کریمہ)",
8594-      titleEn: "Dua of Yunus AS in Distress",
8595-      arabic: "لَّا إِلٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
8596-      transliteration: "La ilaha illa Anta subhanaka innee kuntu minaz-zalimeen.",
8597-      urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصورواروں میں سے تھا۔",
8598-      translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
8599-      source: "القرآن: الانبیاء 87، جامع الترمذی: 3505"
8600-    },
8601-    {
8602-      id: 29,
8603-      category: "روزمرہ",
8604-      categoryEn: "Daily Life",
8605-      titleUr: "غصہ آنے پر مسنون دعا",
8606-      titleEn: "When Angry",
8607-      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
8608-      transliteration: "A'oodhu billahi minash-shaytanir-rajeem.",
8609-      urdu: "میں شیطان مردود سے اللہ کی پناہ مانگتا ہوں۔",
8610-      translation: "I seek refuge in Allah from Satan the outcast.",
8611-      source: "صحیح البخاری: 6115، صحیح مسلم: 2610"
8612-    },
8613-    {
8614-      id: 30,
8615-      category: "روزمرہ",
8616-      categoryEn: "Daily Life",
8617-      titleUr: "مصیبت زدہ کو دیکھ کر دعا",
8618-      titleEn: "Seeing Afflicted Person",
8619-      arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا",
8620-      transliteration: "Alhamdu lillahil-ladhee 'aafanee mimmabtalaaka bihee wa faddalanee 'ala katheerin mimman khalaqa tafdeela.",
8621-      urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے اس آزمائش سے بچایا جس میں تجھے مبتلا کیا اور مجھے اپنی بہت سی مخلوقات پر فضیلت بخشی۔",
8622-      translation: "All praise is for Allah who saved me from what He tested you with and blessed me over much of His creation.",
8623-      source: "جامع الترمذی: 3431"
8624-    },
8625-    {
8626-      id: 31,
8627-      category: "روزمرہ",
8628-      categoryEn: "Daily Life",
8629-      titleUr: "بارش برستے وقت کی دعا",
8630-      titleEn: "When it Rains",
8631-      arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
8632-      transliteration: "Allahumma sayyiban naafi'an.",
8633-      urdu: "اے اللہ! نفع بخش بارش برسا۔",
8634-      translation: "O Allah, make it a beneficial downpour.",
8635-      source: "صحیح البخاری: 1032"
8636-    },
8637-    {
8638-      id: 32,
8639-      category: "روزمرہ",
8640-      categoryEn: "Daily Life",
8641-      titleUr: "بجلی اور بادل کی گرج پر دعا",
8642-      titleEn: "When Hearing Thunder",
8643-      arabic: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",
8644-      transliteration: "Subhanal-ladhee yusabbihur-ra'du bi-hamdihee wal-malaa'ikatu min kheefatih.",
8645-      urdu: "پاک ہے وہ ذات جس کی تسبیح و حمد گرج کرتی ہے اور فرشتے اس کے خوف سے اس کی تسبیح کرتے ہیں۔",
8646-      translation: "Glory be to Him whom thunder glorifies with His praise, and the angels out of fear of Him.",
8647-      source: "مؤطا امام مالک: 1808"
8648-    },
8649-    {
8650-      id: 33,
8651-      category: "پریشانی و حفاظت",
8652-      categoryEn: "Protection & Relief",
8653-      titleUr: "دشمن یا ظالم کے خوف کے وقت دعا",
8654-      titleEn: "Fear of Enemies or Oppressors",
8655-      arabic: "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
8656-      transliteration: "Allahumma inna naj'aluka fee nuhoorihim wa na'oodhu bika min shuroorihim.",
8657-      urdu: "اے اللہ! ہم تجھے ان کے مقابلے میں لاتے ہیں اور ان کے شرور سے تیری پناہ مانگتے ہیں۔",
8658-      translation: "O Allah, we make You our shield against them, and we seek refuge in You from their evils.",
8659-      source: "سنن ابو داؤد: 1537"
8660-    },
8661-    {
8662-      id: 34,
8663-      category: "پریشانی و حفاظت",
8664-      categoryEn: "Protection & Relief",
8665-      titleUr: "مشکل کام کو آسان بنانے کی دعا",
8666-      titleEn: "When Facing Difficulties",
8667-      arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
8668-      transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla.",
8669-      urdu: "اے اللہ! کوئی کام آسان نہیں سوائے اس کے جسے تو آسان بنا دے، اور تو جب چاہے مشکل کو آسان بنا دیتا ہے۔",
8670-      translation: "O Allah, there is no ease except what You make easy, and You make hardship easy when You will.",
8671-      source: "صحیح ابن حبان: 974"
8672-    },
8673-    {
8674-      id: 35,
8675-      category: "قرآنی دعائیں",
8676-      categoryEn: "Quranic Duas",
8677-      titleUr: "والدین کے لیے قرآنی دعا",
8678-      titleEn: "Dua for Parents",
8679-      arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
8680-      transliteration: "Rabbir-hamhuma kama rabbayanee sagheera.",
8681-      urdu: "اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں مجھے پالا۔",
8682-      translation: "My Lord, have mercy upon them as they brought me up when I was small.",
8683-      source: "القرآن: الاسراء 24"
8684-    },
8685-    {
8686-      id: 36,
8687-      category: "قرآنی دعائیں",
8688-      categoryEn: "Quranic Duas",
8689-      titleUr: "بخشش اور رحمت کی قرآنی دعا",
8690-      titleEn: "Dua for Forgiveness & Mercy",
8691-      arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
8692-      transliteration: "Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna lanakoonanna minal-khasireen.",
8693-      urdu: "اے ہمارے رب! ہم نے اپنی جانوں پر ظلم کیا اور اگر تو نے ہمیں نہ بخشا اور ہم پر رحم نہ فرمایا تو ہم ضرور نقصان اٹھانے والوں میں سے ہو جائیں گے۔",
8694-      translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
8695-      source: "القرآن: الاعراف 23"
8696-    },
8697-    {
8698-      id: 37,
8699-      category: "قرآنی دعائیں",
8700-      categoryEn: "Quranic Duas",
8701-      titleUr: "دنیا و آخرت کی بھلائی کی جامع دعا",
8702-      titleEn: "Comprehensive Dua for Both Worlds",
8703-      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
8704-      transliteration: "Rabbana aatina fid-dunya hasanatan wa fil-aakhirati hasanatan wa qina 'adhaban-nar.",
8705-      urdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔",
8706-      translation: "Our Lord, grant us in this world good and in the Hereafter good and protect us from the punishment of the Fire.",
8707-      source: "القرآن: البقرہ 201، صحیح البخاری: 4522"
8708-    },
8709-    {
8710-      id: 38,
8711-      category: "استغفار و توبہ",
8712-      categoryEn: "Forgiveness",
8713-      titleUr: "مجلس کے اختتام کی دعا (کفارہ مجلس)",
8714-      titleEn: "Expiation of Assembly (Kaffarah)",
8715-      arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
8716-      transliteration: "Subhanakallahumma wa bi-hamdika, ash-hadu an la ilaha illa Anta, astaghfiruka wa atoobu ilayk.",
8717-      urdu: "اے اللہ! تو اپنی تعریفوں سمیت پاک ہے، میں گواہی دیتا ہوں کہ تیرے سوا کوئی معبود نہیں، میں تجھ سے بخشش چاہتا ہوں اور تیرے حضور توبہ کرتا ہوں۔",
8718-      translation: "Glory is to You, O Allah, and praise; I bear witness that none has the right to be worshipped but You; I seek Your forgiveness and repent to You.",
8719-      source: "جامع الترمذی: 3433"
8720-    },
8721-    {
8722-      id: 39,
8723-      category: "صبح و شام",
8724-      categoryEn: "Morning & Evening",
8725-      titleUr: "صبح و شام حفاظت کی دعا (3 بار)",
8726-      titleEn: "Morning & Evening Protection",
8727-      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
8728-      transliteration: "Bismillahil-ladhee la yadurru ma'as-mihee shay'un fil-ardi wa la fis-samaa'i wa Huwas-Samee'ul-'Aleem.",
8729-      urdu: "اللہ کے نام کے ساتھ جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہی خوب سننے والا اور جاننے والا ہے۔",
8730-      translation: "In the name of Allah, with whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
8731-      source: "سنن ابو داؤد: 5088، جامع الترمذی: 3388"
8732-    },
8733-    {
8734-      id: 40,
8735-      category: "استغفار و توبہ",
8736-      categoryEn: "Forgiveness",
8737-      titleUr: "سید الاستغفار (توبہ کی عظیم دعا)",
8738-      titleEn: "Sayyidul Istighfar (Chief of Forgiveness)",
8739-      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ ، خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي ، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
8740-      transliteration: "Allahumma Anta Rabbee la ilaha illa Anta, khalaqtanee wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'oodhu bika min sharri ma sana'tu, aboo'u laka bi-ni'matika 'alayya, wa aboo'u laka bi-dhanbee faghfir lee, fa-innahu la yaghfirudh-dhunooba illa Ant.",
8741-      urdu: "اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمت کا اعتراف کرتا ہوں اور اپنے گناہ کا اقرار کرتا ہوں، پس مجھے بخش دے، کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔",
8742-      translation: "O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.",
8743-      source: "صحیح البخاری: 6306"
8744-    }
8745-  ];
8746-
8747-  var HADITH_NAWAWI_40 = [
8748-  {
8749-    "num": 1,
8750-    "category": "eman",
8751-    "category": "eman",
8752-    "arabic": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
8753-    "urdu": "اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کے لیے ہو تو اس کی ہجرت اللہ اور اس کے رسول کے لیے ہے، اور جس کی ہجرت دنیا حاصل کرنے یا کسی عورت سے نکاح کے لیے ہو تو اس کی ہجرت اسی کے لیے ہے جس کی طرف اس نے ہجرت کی۔",
8754-    "en": "Actions are but by intentions, and every man shall have only that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was to achieve some worldly benefit or to take some woman in marriage, his migration was for that which he migrated.",
8755-    "sourceUr": "صحیح البخاری: 1، صحیح مسلم: 1907",
8756-    "sourceEn": "Sahih al-Bukhari: 1, Sahih Muslim: 1907"
8757-  },
8758-  {
8759-    "num": 2,
8760-    "category": "pillars",
8761-    "category": "pillars",
8762-    "arabic": "بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ ﷺ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعْرِ... قَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ... قَالَ: أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...",
8763-    "urdu": "حضرت عمر بن خطابؓ سے روایت ہے کہ ایک دن ہم رسول اللہ ﷺ کے پاس بیٹھے تھے کہ اچانک ایک شخص نمودار ہوا جس کے کپڑے انتہائی سفید اور بال نہایت سیاہ تھے... اس نے پوچھا: اے محمد! مجھے اسلام کے بارے میں بتائیے؟ آپ ﷺ نے فرمایا: اسلام یہ ہے کہ تم گواہی دو کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرو، زکوٰۃ ادا کرو، رمضان کے روزے رکھو اور اگر استطاعت ہو تو بیت اللہ کا حج کرو۔",
8764-    "en": "Hadith Jibril: While we were sitting with the Messenger of Allah ﷺ, there appeared before us a man with very white clothing and very black hair... He said: 'O Muhammad, tell me about Islam...' The Prophet said: 'Islam is to testify that there is no god but Allah and that Muhammad is the Messenger of Allah, to establish prayer, give zakah, fast Ramadan, and perform pilgrimage if you are able.'",
8765-    "sourceUr": "صحیح مسلم: 8",
8766-    "sourceEn": "Sahih Muslim: 8"
8767-  },
8768-  {
8769-    "num": 3,
8770-    "category": "pillars",
8771-    "category": "pillars",
8772-    "arabic": "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.",
8773-    "urdu": "اسلام کی بنیاد پانچ ستونوں پر رکھی گئی ہے: اس بات کی گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ دینا، بیت اللہ کا حج کرنا اور رمضان کے روزے رکھنا۔",
8774-    "en": "Islam has been built on five [pillars]: testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing the prayer, paying the zakah, making the pilgrimage to the House, and fasting in Ramadan.",
8775-    "sourceUr": "صحیح البخاری: 8، صحیح مسلم: 16",
8776-    "sourceEn": "Sahih al-Bukhari: 8, Sahih Muslim: 16"
8777-  },
8778-  {
8779-    "num": 4,
8780-    "category": "eman",
8781-    "category": "eman",
8782-    "arabic": "إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا... ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٌّ أَوْ سَعِيدٌ.",
8783-    "urdu": "تم میں سے ہر ایک کی تخلیق اس کی ماں کے پیٹ میں چالیس دن نطفہ کی صورت میں جمع رہتی ہے... پھر اللہ ایک فرشتہ بھیجتا ہے جو اس میں روح پھونکتا ہے اور اسے چار باتوں کا حکم دیا جاتا ہے: اس کا رزق، اس کی عمر، اس کا عمل اور یہ کہ وہ بدبخت ہوگا یا نیک بخت۔",
8784-    "en": "Verily the creation of each one of you is brought together in his mother's belly for forty days in the form of a seed... Then an angel is sent to him who breathes the soul into him, and who is commanded with four matters: to write down his sustenance, his life span, his actions, and whether he will be happy or wretched.",
8785-    "sourceUr": "صحیح البخاری: 3208، صحیح مسلم: 2643",
8786-    "sourceEn": "Sahih al-Bukhari: 3208, Sahih Muslim: 2643"
8787-  },
8788-  {
8789-    "num": 5,
8790-    "category": "eman",
8791-    "category": "eman",
8792-    "arabic": "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ.",
8793-    "urdu": "جس نے ہمارے اس دین کے معاملے میں کوئی ایسی نئی بات نکالی جو اس میں سے نہیں ہے، تو وہ مردود ہے۔",
8794-    "en": "He who innovates something in this matter of ours (Islam) that is not of it will have it rejected.",
8795-    "sourceUr": "صحیح البخاری: 2697، صحیح مسلم: 1718",
8796-    "sourceEn": "Sahih al-Bukhari: 2697, Sahih Muslim: 1718"
8797-  },
8798-  {
8799-    "num": 6,
8800-    "category": "halal",
8801-    "category": "halal",
8802-    "arabic": "إِنَّ الْحَلاَلَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ... أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلاَ وَهِيَ الْقَلْبُ.",
8803-    "urdu": "حلال بھی واضح ہے اور حرام بھی واضح ہے اور ان دونوں کے درمیان کچھ مشتبہ چیزیں ہیں جنہیں بہت سے لوگ نہیں جانتے... سن لو! جسم میں گوشت کا ایک لوتھڑا ہے، اگر وہ درست ہو جائے تو پورا جسم درست ہو جاتا ہے اور اگر وہ خراب ہو جائے تو پورا جسم خراب ہو جاتا ہے، سن لو وہ دل ہے!",
8804-    "en": "Verily the halal is clear and the haram is clear, and between them are doubtful matters about which many people have no knowledge... Truly in the body there is a morsel of flesh which, if it be whole, all the body is whole, and which, if it be diseased, all of it is diseased. Truly, it is the heart.",
8805-    "sourceUr": "صحیح البخاری: 52، صحیح مسلم: 1599",
8806-    "sourceEn": "Sahih al-Bukhari: 52, Sahih Muslim: 1599"
8807-  },
8808-  {
8809-    "num": 7,
8810-    "category": "character",
8811-    "category": "character",
8812-    "arabic": "الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ.",
8813-    "urdu": "دین خیرخواہی کا نام ہے۔ ہم نے عرض کیا: کس کے لیے؟ آپ ﷺ نے فرمایا: اللہ کے لیے، اس کی کتاب کے لیے، اس کے رسول کے لیے، مسلمانوں کے حکمرانوں اور عام مسلمانوں کے لیے۔",
8814-    "en": "Religion is sincerity (nasihah). We said: 'To whom?' He said: 'To Allah and to His Book, and to His Messenger, and to the leaders of the Muslims and their common folk.'",
8815-    "sourceUr": "صحیح مسلم: 55",
8816-    "sourceEn": "Sahih Muslim: 55"
8817-  },
8818-  {
8819-    "num": 8,
8820-    "category": "pillars",
8821-    "category": "pillars",
8822-    "arabic": "أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَيُقِيمُوا الصَّلاَةَ، وَيُؤْتُوا الزَّكَاةَ...",
8823-    "urdu": "مجھے حکم دیا گیا ہے کہ میں لوگوں سے اس وقت تک لڑوں جب تک وہ گواہی نہ دیں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، اور نماز قائم کریں اور زکوٰۃ دیں۔",
8824-    "en": "I have been commanded to fight the people until they testify that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, and establish prayer and pay zakah...",
8825-    "sourceUr": "صحیح البخاری: 25، صحیح مسلم: 22",
8826-    "sourceEn": "Sahih al-Bukhari: 25, Sahih Muslim: 22"
8827-  },
8828-  {
8829-    "num": 9,
8830-    "category": "taqwa",
8831-    "category": "taqwa",
8832-    "arabic": "مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ.",
8833-    "urdu": "جس چیز سے میں تمہیں منع کروں اس سے بچو، اور جس بات کا تمہیں حکم دوں اس پر اپنی طاقت کے مطابق عمل کرو۔",
8834-    "en": "What I have forbidden you, avoid; and what I have ordered you to do, do as much of it as you can.",
8835-    "sourceUr": "صحیح البخاری: 7288، صحیح مسلم: 1337",
8836-    "sourceEn": "Sahih al-Bukhari: 7288, Sahih Muslim: 1337"
8837-  },
8838-  {
8839-    "num": 10,
8840-    "category": "halal",
8841-    "category": "halal",
8842-    "arabic": "إِنَّ اللَّهَ طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا... ثُمَّ ذَكَرَ الرَّجُلَ يُطِيلُ السَّفَرَ أَشْعَثَ أَغْبَرَ يَمُدُّ يَدَيْهِ إِلَى السَّمَاءِ: يَا رَبِّ يَا رَبِّ، وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِيَ بِالْحَرَامِ، فَأَنَّى يُسْتَجَابُ لِذَلِكَ؟",
8843-    "urdu": "بے شک اللہ پاک ہے اور وہ پاکیزہ مال ہی قبول کرتا ہے... پھر آپ ﷺ نے ایک ایسے مسافر کا ذکر فرمایا جو لمبے سفر کے بعد پراگندہ بال، غبار آلود چہرے کے ساتھ ہاتھ اٹھا کر دعا کرتا ہے: اے میرے رب! اے میرے رب! حالانکہ اس کا کھانا حرام، پینا حرام، لباس حرام اور پرورش حرام سے ہوئی ہو، تو اس کی دعا کیسے قبول ہو سکتی ہے؟",
8844-    "en": "Allah the Almighty is Pure and accepts only that which is pure... Then he mentioned a man who, having journeyed far, is disheveled and dusty, and who stretches out his hands to the sky saying 'O Lord! O Lord!' while his food is haram, his drink is haram, his clothing is haram, and he has been nourished with haram; so how can he be answered?",
8845-    "sourceUr": "صحیح مسلم: 1015",
8846-    "sourceEn": "Sahih Muslim: 1015"
8847-  },
8848-  {
8849-    "num": 11,
8850-    "category": "taqwa",
8851-    "category": "taqwa",
8852-    "arabic": "دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ.",
8853-    "urdu": "جو چیز تمہیں شک میں ڈالے اسے چھوڑ دو اور وہ چیز اختیار کرو جو تمہیں شک میں نہ ڈالے۔",
8854-    "en": "Leave that which makes you doubt for that which does not make you doubt.",
8855-    "sourceUr": "جامع الترمذی: 2518، سنن النسائی: 5711",
8856-    "sourceEn": "Jami` at-Tirmidhi: 2518, Sunan an-Nasa'i: 5711"
8857-  },
8858-  {
8859-    "num": 12,
8860-    "category": "character",
8861-    "category": "character",
8862-    "arabic": "مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ.",
8863-    "urdu": "انسان کے اسلام کی اچھائی اور حسن یہ ہے کہ وہ فضول اور لا یعنی باتوں کو چھوڑ دے۔",
8864-    "en": "Part of the perfection of one's Islam is his leaving that which does not concern him.",
8865-    "sourceUr": "جامع الترمذی: 2317، سنن ابن ماجہ: 3976",
8866-    "sourceEn": "Jami` at-Tirmidhi: 2317, Sunan Ibn Majah: 3976"
8867-  },
8868-  {
8869-    "num": 13,
8870-    "category": "rights",
8871-    "category": "rights",
8872-    "arabic": "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
8873-    "urdu": "تم میں سے کوئی شخص اس وقت تک سچا مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
8874-    "en": "None of you truly believes until he loves for his brother what he loves for himself.",
8875-    "sourceUr": "صحیح البخاری: 13، صحیح مسلم: 45",
8876-    "sourceEn": "Sahih al-Bukhari: 13, Sahih Muslim: 45"
8877-  },
8878-  {
8879-    "num": 14,
8880-    "category": "rights",
8881-    "category": "rights",
8882-    "arabic": "لاَ يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ إِلاَّ بِإِحْدَى ثَلاَثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ الْمُفَارِقُ لِلْجَمَاعَةِ.",
8883-    "urdu": "کسی مسلمان کا خون جو یہ گواہی دیتا ہو کہ اللہ کے سوا کوئی معبود نہیں اور میں اللہ کا رسول ہوں، تین صورتوں کے علاوہ حلال نہیں: شادی شدہ زانی، جان کے بدلے جان (قصاص)، اور دین کو چھوڑ کر جماعت سے الگ ہو جانے والا۔",
8884-    "en": "The blood of a Muslim who confesses that there is no god but Allah and that I am the Messenger of Allah cannot lawfully be shed except for one of three reasons: a life for a life, a married person who commits adultery, and one who abandons his religion.",
8885-    "sourceUr": "صحیح البخاری: 6878، صحیح مسلم: 1676",
8886-    "sourceEn": "Sahih al-Bukhari: 6878, Sahih Muslim: 1676"
8887-  },
8888-  {
8889-    "num": 15,
8890-    "category": "character",
8891-    "category": "character",
8892-    "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.",
8893-    "urdu": "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہو اسے چاہیے کہ اچھی بات کہے ورنہ خاموش رہے، اور جو اللہ اور آخرت کے دن پر ایمان رکھتا ہو اسے اپنے پڑوسی کی عزت کرنی چاہیے، اور جو اللہ اور آخرت کے دن پر ایمان رکھتا ہو اسے اپنے مہمان کی عزت کرنی چاہیے۔",
8894-    "en": "Whoever believes in Allah and the Last Day should speak a good word or remain silent. And whoever believes in Allah and the Last Day should be generous to his neighbor. And whoever believes in Allah and the Last Day should be generous to his guest.",
8895-    "sourceUr": "صحیح البخاری: 6018، صحیح مسلم: 47",
8896-    "sourceEn": "Sahih al-Bukhari: 6018, Sahih Muslim: 47"
8897-  },
8898-  {
8899-    "num": 16,
8900-    "category": "character",
8901-    "category": "character",
8902-    "arabic": "أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ ﷺ: أَوْصِنِي. قَالَ: لاَ تَغْضَبْ. فَرَدَّدَ مِرَارًا، قَالَ: لاَ تَغْضَبْ.",
8903-    "urdu": "ایک شخص نے نبی کریم ﷺ سے عرض کیا: مجھے نصیحت فرمائیے۔ آپ ﷺ نے فرمایا: غصہ مت کرو۔ اس نے بار بار اپنی درخواست دہرائی، آپ ﷺ نے ہر بار فرمایا: غصہ مت کرو۔",
8904-    "en": "A man said to the Prophet ﷺ: 'Counsel me.' He said: 'Do not become angry.' The man repeated his request several times, and each time he said: 'Do not become angry.'",
8905-    "sourceUr": "صحیح البخاری: 6116",
8906-    "sourceEn": "Sahih al-Bukhari: 6116"
8907-  },
8908-  {
8909-    "num": 17,
8910-    "category": "character",
8911-    "category": "character",
8912-    "arabic": "إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذَّبْحَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ.",
8913-    "urdu": "بے شک اللہ نے ہر چیز میں احسان اور بھلائی کا حکم دیا ہے، پس جب تم قتل کرو تو اچھے طریقے سے کرو اور جب ذبح کرو تو اچھے طریقے سے کرو، اور تم میں سے ہر ایک کو اپنی چھری تیز کر لینی چاہیے اور اپنے ذبیحہ کو راحت پہنچانی چاہیے۔",
8914-    "en": "Verily Allah has prescribed excellence (ihsan) in all things. So if you kill, kill well; and if you slaughter, slaughter well. Let each one of you sharpen his blade and let him spare pain to the animal he slaughters.",
8915-    "sourceUr": "صحیح مسلم: 1955",
8916-    "sourceEn": "Sahih Muslim: 1955"
8917-  },
8918-  {
8919-    "num": 18,
8920-    "category": "taqwa",
8921-    "category": "taqwa",
8922-    "arabic": "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
8923-    "urdu": "تم جہاں کہیں بھی ہو اللہ سے ڈرو، اور گناہ کے بعد فوراً نیکی کرو وہ اس گناہ کو مٹا دے گی، اور لوگوں کے ساتھ حسنِ اخلاق سے پیش آؤ۔",
8924-    "en": "Fear Allah wherever you may be, and follow up an evil deed with a good deed which will wipe it out, and behave toward people with good character.",
8925-    "sourceUr": "جامع الترمذی: 1987",
8926-    "sourceEn": "Jami` at-Tirmidhi: 1987"
8927-  },
8928-  {
8929-    "num": 19,
8930-    "category": "eman",
8931-    "category": "eman",
8932-    "arabic": "يَا غُلاَمُ إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ...",
8933-    "urdu": "اے لڑکے! میں تمہیں چند اہم باتیں سکھاتا ہوں: اللہ کے احکام کی حفاظت کرو اللہ تمہاری حفاظت فرمائے گا، اللہ کو یاد رکھو تم اسے اپنے سامنے پاؤ گے، جب مانگو تو صرف اللہ سے مانگو، جب مدد چاہو تو صرف اللہ سے مدد طلب کرو، اور جان لو کہ اگر تمام لوگ مل کر بھی تمہیں کوئی فائدہ پہنچانا چاہیں تو نہیں پہنچا سکتے مگر وہی جو اللہ نے تمہارے مقدر میں لکھ دیا ہے...",
8934-    "en": "O boy! I will teach you some words: Be mindful of Allah and He will protect you. Be mindful of Allah and you will find Him in front of you. If you ask, ask of Allah; if you seek help, seek help of Allah. And know that if the nation were to gather together to benefit you with something, they could not benefit you except with what Allah had already prescribed for you...",
8935-    "sourceUr": "جامع الترمذی: 2516",
8936-    "sourceEn": "Jami` at-Tirmidhi: 2516"
8937-  },
8938-  {
8939-    "num": 20,
8940-    "category": "character",
8941-    "category": "character",
8942-    "arabic": "إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلاَمِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحْيِ فَاصْنَعْ مَا شِئْتَ.",
8943-    "urdu": "پچھلے انبیاء کے کلام سے جو بات لوگوں تک پہنچی ہے ان میں سے ایک یہ ہے: جب تم میں حیا ہی نہ رہے تو جو چاہو کرو۔",
8944-    "en": "Verily, among the words that people obtained from the early prophecy are: If you feel no shame, then do whatever you wish.",
8945-    "sourceUr": "صحیح البخاری: 3484",
8946-    "sourceEn": "Sahih al-Bukhari: 3484"
8947-  },
8948-  {
8949-    "num": 21,
8950-    "category": "eman",
8951-    "category": "eman",
8952-    "arabic": "قُلْ: آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ.",
8953-    "urdu": "کہو: میں اللہ پر ایمان لایا، پھر اس پر ثابت قدم رہو۔",
8954-    "en": "Say: 'I believe in Allah,' and then remain steadfast.",
8955-    "sourceUr": "صحیح مسلم: 38",
8956-    "sourceEn": "Sahih Muslim: 38"
8957-  },
8958-  {
8959-    "num": 22,
8960-    "category": "pillars",
8961-    "category": "pillars",
8962-    "arabic": "أَرَأَيْتَ إِذَا صَلَّيْتُ الْمَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الْحَلاَلَ، وَحَرَّمْتُ الْحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الْجَنَّةَ؟ قَالَ: نَعَمْ.",
8963-    "urdu": "ایک صحابی نے عرض کیا: آپ بتائیے اگر میں فرض نمازیں ادا کروں، رمضان کے روزے رکھوں، حلال کو حلال اور حرام کو حرام جانوں اور اس پر کچھ زیادہ نہ کروں، تو کیا میں جنت میں داخل ہوں گا؟ آپ ﷺ نے فرمایا: ہاں۔",
8964-    "en": "Do you see if I pray the prescribed prayers, fast Ramadan, treat the lawful as lawful and the unlawful as unlawful, and do not increase upon that at all, shall I enter Paradise? He ﷺ said: 'Yes.'",
8965-    "sourceUr": "صحیح مسلم: 15",
8966-    "sourceEn": "Sahih Muslim: 15"
8967-  },
8968-  {
8969-    "num": 23,
8970-    "category": "pillars",
8971-    "category": "pillars",
8972-    "arabic": "الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلآنِ - أَوْ تَمْلأُ - مَا بَيْنَ السَّمَاوَاتِ وَالأَرْضِ، وَالصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ.",
8973-    "urdu": "پاکیزگی آدھا ایمان ہے، اور 'الحمد لله' میزان کو بھر دیتا ہے، اور 'سبحان الله' اور 'الحمد لله' زمین و آسمان کے درمیانی خلا کو بھر دیتے ہیں، اور نماز نور ہے، صدقہ دلیل ہے، صبر روشنی ہے، اور قرآن تمہارے حق میں یا تمہارے خلاف حجت ہے۔",
8974-    "en": "Purity is half of iman (faith). 'Al-hamdu lillah' fills the scale, and 'Subhan-Allah and al-hamdu lillah' fill up what is between the heavens and the earth. Prayer is a light, charity is a proof, patience is illumination, and the Quran is a proof for you or against you.",
8975-    "sourceUr": "صحیح مسلم: 223",
8976-    "sourceEn": "Sahih Muslim: 223"
8977-  },
8978-  {
8979-    "num": 24,
8980-    "category": "rights",
8981-    "category": "rights",
8982-    "arabic": "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلاَ تَظَالَمُوا... يَا عِبَادِي كُلُّكُمْ ضَالٌّ إِلاَّ مَنْ هَدَيْتُهُ فَاسْتَهْدُونِي أَهْدِكُمْ.",
8983-    "urdu": "حدیثِ قدسی: اے میرے بندو! میں نے ظلم کو اپنے اوپر حرام کیا ہے اور تمہارے درمیان بھی اسے حرام ٹھہرایا ہے، پس آپس میں ایک دوسرے پر ظلم نہ کرو... اے میرے بندو! تم سب گمراہ ہو سوائے اس کے جسے میں ہدایت دوں، پس مجھ سے ہدایت مانگو میں تمہیں ہدایت دوں گا۔",
8984-    "en": "Hadith Qudsi: O My servants, I have forbidden injustice for Myself and have made it forbidden amongst you, so do not oppress one another... O My servants, all of you are astray except for those I have guided, so seek guidance of Me and I shall guide you.",
8985-    "sourceUr": "صحیح مسلم: 2577",
8986-    "sourceEn": "Sahih Muslim: 2577"
8987-  },
8988-  {
8989-    "num": 25,
8990-    "category": "taqwa",
8991-    "category": "taqwa",
8992-    "arabic": "إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ.",
8993-    "urdu": "ہر بار 'سبحان اللہ' کہنا صدقہ ہے، ہر بار 'اللہ اکبر' کہنا صدقہ ہے، ہر بار 'الحمد للہ' کہنا صدقہ ہے، ہر بار 'لا الہ الا اللہ' کہنا صدقہ ہے، نیکی کا حکم دینا صدقہ ہے اور برائی سے روکنا صدقہ ہے۔",
8994-    "en": "Every tasbihah (saying Subhan-Allah) is a charity, every takbirah (saying Allahu-Akbar) is a charity, every tahmidah (saying Al-hamdu lillah) is a charity, every tahlilah (saying La ilaha illallah) is a charity, enjoining the good is a charity, and forbidding the evil is a charity.",
8995-    "sourceUr": "صحیح مسلم: 1006",
8996-    "sourceEn": "Sahih Muslim: 1006"
8997-  },
8998-  {
8999-    "num": 26,
9000-    "category": "rights",
9001-    "category": "rights",
9002-    "arabic": "كُلُّ سُلاَمَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ الاِثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَكُلُّ خَطْوَةٍ تَمْشِيهَا إِلَى الصَّلاَةِ صَدَقَةٌ، وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ.",
9003-    "urdu": "انسان کے ہر جوڑ پر ہر اس دن کا صدقہ لازم ہے جس میں سورج طلوع ہوتا ہے: دو آدمیوں کے درمیان انصاف کرنا صدقہ ہے، کسی آدمی کی سواری میں مدد کرنا یا اس کا سامان لادنا صدقہ ہے، اچھی بات کہنا صدقہ ہے، نماز کے لیے اٹھنے والا ہر قدم صدقہ ہے، اور راستے سے تکلیف دہ چیز کو ہٹا دینا صدقہ ہے۔",
9004-    "en": "Every joint of a person must perform a charity on each day that the sun rises: to judge justly between two people is a charity, to help a man with his mount is a charity, a good word is a charity, every step taken towards prayer is a charity, and removing a harmful object from the road is a charity.",
9005-    "sourceUr": "صحیح البخاری: 2989، صحیح مسلم: 1009",
9006-    "sourceEn": "Sahih al-Bukhari: 2989, Sahih Muslim: 1009"
9007-  },
9008-  {
9009-    "num": 27,
9010-    "category": "character",
9011-    "category": "character",
9012-    "arabic": "الْبِرُّ حُسْنُ الْخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي نَفْسِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ.",
9013-    "urdu": "نیکی حسنِ اخلاق کا نام ہے، اور گناہ وہ ہے جو تمہارے دل میں کھٹکے اور تم ناپسند کرو کہ لوگوں کو اس کی خبر ہو۔",
9014-    "en": "Righteousness is in good character, and wrongdoing is that which wavers in your heart and which you dislike people to find out about.",
9015-    "sourceUr": "صحیح مسلم: 2553",
9016-    "sourceEn": "Sahih Muslim: 2553"
9017-  },
9018-  {
9019-    "num": 28,
9020-    "category": "eman",
9021-    "category": "eman",
9022-    "arabic": "أُوصِيكُمْ بِتَقْوَى اللَّهِ وَالسَّمْعِ وَالطَّاعَةِ وَإِنْ عَبْدًا حَبَشِيًّا، فَإِنَّهُ مَنْ يَعِشْ مِنْكُمْ بَعْدِي فَسَيَرَى اخْتِلاَفًا كَثِيرًا، فَعَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الْخُلَفَاءِ الْمَهْدِيِّينَ الرَّاشِدِينَ، تَمَسَّكُوا بِهَا وَعَضُّوا عَلَيْهَا بِالنَّوَاجِذِ.",
9023-    "urdu": "میں تمہیں اللہ کے تقویٰ اور امیر کی بات سننے اور اطاعت کرنے کی وصیت کرتا ہوں چاہے وہ حبشی غلام ہی کیوں نہ ہو، کیونکہ میرے بعد تم میں سے جو زندہ رہے گا وہ بہت سے اختلافات دیکھے گا، پس میری سنت اور ہدایت یافتہ خلفائے راشدین کی سنت کو لازم پکڑو اور اسے دانتوں سے مضبوطی سے تھام لو۔",
9024-    "en": "I counsel you to have taqwa of Allah, and to listen and obey even if a slave were to rule over you. Verily he among you who lives after me will see much difference, so you must hold fast to my sunnah and the sunnah of the Rightly-Guided Caliphs; cling to it tightly.",
9025-    "sourceUr": "سنن ابو داؤد: 4607، جامع الترمذی: 2676",
9026-    "sourceEn": "Sunan Abu Dawood: 4607, Jami` at-Tirmidhi: 2676"
9027-  },
9028-  {
9029-    "num": 29,
9030-    "category": "pillars",
9031-    "category": "pillars",
9032-    "arabic": "قُلْتُ: يَا رَسُولَ اللَّهِ، أَخْبِرْنِي بِعَمَلٍ يُدْخِلُنِي الْجَنَّةَ وَيُبَاعِدُنِي عَنِ النَّارِ... فَقَالَ: أَلاَ أُخْبِرُكَ بِمَلاَكِ ذَلِكَ كُلِّهِ؟ قُلْتُ: بَلَى يَا نَبِيَّ اللَّهِ. فَأَخَذَ بِلِسَانِهِ وَقَالَ: كُفَّ عَلَيْكَ هَذَا.",
9033-    "urdu": "حضرت معاذ بن جبلؓ نے عرض کیا: یا رسول اللہ! مجھے کوئی ایسا عمل بتائیے جو مجھے جنت میں داخل کر دے اور جہنم سے دور کر دے... آپ ﷺ نے فرمایا: کیا میں تمہیں ان تمام نیکیوں کی جڑ نہ بتاؤں؟ میں نے کہا: ہاں یا رسول اللہ! آپ ﷺ نے اپنی زبان مبارک پکڑ کر فرمایا: اسے قابو میں رکھو۔",
9034-    "en": "Mu'adh ibn Jabal said: 'O Messenger of Allah, tell me of an act which will take me into Paradise and keep me away from the Fire...' He said: 'Shall I not tell you of the foundation of all of that?' I said: 'Yes, O Prophet of Allah.' So he took hold of his tongue and said: 'Restrain this.'",
9035-    "sourceUr": "جامع الترمذی: 2616",
9036-    "sourceEn": "Jami` at-Tirmidhi: 2616"
9037-  },
9038-  {
9039-    "num": 30,
9040-    "category": "halal",
9041-    "category": "halal",
9042-    "arabic": "إِنَّ اللَّهَ تَعَالَى فَرَضَ فَرَائِضَ فَلاَ تُضَيِّعُوهَا، وَحَدَّ حُدُودًا فَلاَ تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلاَ تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلاَ تَبْحَثُوا عَنْهَا.",
9043-    "urdu": "اللہ تعالیٰ نے کچھ فرائض مقرر کیے ہیں انہیں ضائع نہ کرو، کچھ حدود مقرر کی ہیں ان سے تجاوز نہ کرو، کچھ چیزوں کو حرام کیا ہے ان کا ارتکاب نہ کرو، اور کچھ چیزوں کے بارے میں خاموشی اختیار فرمائی ہے بھولے بغیر محض تمہاری رحمت کے لیے، پس ان کی کھوج میں نہ پڑو۔",
9044-    "en": "Verily Allah has laid down religious obligations, so do not neglect them; and He has set boundaries, so do not overstep them; and He has forbidden some things, so do not violate them; and He has remained silent about some things out of mercy for you, not out of forgetfulness, so do not seek after them.",
9045-    "sourceUr": "سنن الدارقطنی: 4316",
9046-    "sourceEn": "Sunan al-Daraqutni: 4316"
9047-  },
9048-  {
9049-    "num": 31,
9050-    "category": "taqwa",
9051-    "category": "taqwa",
9052-    "arabic": "ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا فِي أَيْدِي النَّاسِ يُحِبَّكَ النَّاسُ.",
9053-    "urdu": "دنیا سے بے رغبتی اختیار کرو اللہ تم سے محبت کرے گا، اور جو کچھ لوگوں کے ہاتھوں میں ہے اس سے بے نیازی اختیار کرو لوگ تم سے محبت کریں گے۔",
9054-    "en": "Renounce the world and Allah will love you, and renounce what people possess and people will love you.",
9055-    "sourceUr": "سنن ابن ماجہ: 4102",
9056-    "sourceEn": "Sunan Ibn Majah: 4102"
9057-  },
9058-  {
9059-    "num": 32,
9060-    "category": "rights",
9061-    "category": "rights",
9062-    "arabic": "لاَ ضَرَرَ وَلاَ ضِرَارَ.",
9063-    "urdu": "نہ کسی کو نقصان پہنچانا جائز ہے اور نہ نقصان کا بدلہ نقصان سے دینا جائز ہے۔",
9064-    "en": "There should be neither harming nor reciprocating harm.",
9065-    "sourceUr": "سنن ابن ماجہ: 2340، مؤطا امام مالک: 1435",
9066-    "sourceEn": "Sunan Ibn Majah: 2340, Muwatta Malik: 1435"
9067-  },
9068-  {
9069-    "num": 33,
9070-    "category": "rights",
9071-    "category": "rights",
9072-    "arabic": "لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ، لاَدَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ، لَكِنِ الْبَيِّنَةُ عَلَى الْمُدَّعِي، وَالْيَمِينُ عَلَى مَنْ أَنْكَرَ.",
9073-    "urdu": "اگر لوگوں کو محض ان کے دعوے پر دے دیا جائے تو لوگ دوسروں کے جان و مال کا دعویٰ کر بیٹھیں، لیکن دلیل و گواہ پیش کرنا مدعی کے ذمے ہے اور قسم کھانا منکر کے ذمے ہے۔",
9074-    "en": "Were people to be given everything that they claimed, men would claim the wealth and lives of other people. But the onus of proof is upon the claimant, and the taking of an oath is upon him who denies.",
9075-    "sourceUr": "سنن البیہقی: 10/252، صحیح البخاری: 4552",
9076-    "sourceEn": "Sunan al-Bayhaqi: 10/252, Sahih al-Bukhari: 4552"
9077-  },
9078-  {
9079-    "num": 34,
9080-    "category": "character",
9081-    "category": "character",
9082-    "arabic": "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الإِيمَانِ.",
9083-    "urdu": "تم میں سے جو شخص کسی برائی کو دیکھے تو اسے اپنے ہاتھ سے روکے، اگر اس کی طاقت نہ ہو تو اپنی زبان سے روکے، اور اگر اس کی بھی طاقت نہ ہو تو اپنے دل میں اسے برا سمجھے اور یہ ایمان کا سب سے کمزور درجہ ہے۔",
9084-    "en": "Whoever among you sees an evil, let him change it with his hand; if he is not able to, then with his tongue; if he is not able to, then with his heart, and that is the weakest of faith.",
9085-    "sourceUr": "صحیح مسلم: 49",
9086-    "sourceEn": "Sahih Muslim: 49"
9087-  },
9088-  {
9089-    "num": 35,
9090-    "category": "rights",
9091-    "category": "rights",
9092-    "arabic": "لاَ تَحَاسَدُوا، وَلاَ تَنَاجَشُوا، وَلاَ تَبَاغَضُوا، وَلاَ تَدَابَرُوا... كُونُوا عِبَادَ اللَّهِ إِخْوَانًا، الْمُسْلِمُ أَخُو الْمُسْلِمِ: لاَ يَظْلِمُهُ، وَلاَ يَخْذُلُهُ، وَلاَ يَحْقِرُهُ، التَّقْوَى هَاهُنَا - وَيُشِيرُ إِلَى صَدْرِهِ ثَلاَثَ مَرَّاتٍ.",
9093-    "urdu": "ایک دوسرے سے حسد نہ کرو، دھوکے بازی نہ کرو، بغض نہ رکھو، پیٹھ پیچھے دشمنی نہ کرو... اللہ کے بندے اور آپس میں بھائی بھائی بن جاؤ، مسلمان مسلمان کا بھائی ہے: نہ اس پر ظلم کرے، نہ اسے بے یار و مددگار چھوڑے، نہ اسے حقیر سمجھے، تقویٰ یہاں ہے - اور آپ ﷺ نے تین بار اپنے سینہ مبارک کی طرف اشارہ فرمایا۔",
9094-    "en": "Do not envy one another, do not inflate prices for one another, do not hate one another, do not turn away from one another... Be worshippers of Allah and brothers. A Muslim is the brother of a Muslim: he does not oppress him, nor does he fail him, nor does he despise him. Taqwa is right here (and he pointed to his chest three times).",
9095-    "sourceUr": "صحیح مسلم: 2564",
9096-    "sourceEn": "Sahih Muslim: 2564"
9097-  },
9098-  {
9099-    "num": 36,
9100-    "category": "rights",
9101-    "category": "rights",
9102-    "arabic": "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللَّهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ، وَمَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ، وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ.",
9103-    "urdu": "جس شخص نے کسی مومن کی دنیاوی تکلیفوں میں سے کوئی تکلیف دور کی، اللہ تعالیٰ قیامت کے دن کی تکلیفوں میں سے اس کی تکلیف دور فرمائے گا، اور جس نے کسی تنگدست کے لیے آسانی کی، اللہ تعالیٰ دنیا اور آخرت میں اس کے لیے آسانی فرمائے گا، اور جس نے کسی مسلمان کا پردہ رکھا، اللہ تعالیٰ دنیا اور آخرت میں اس کی پردہ پوشی فرمائے گا، اور اللہ اپنے بندے کی مدد میں رہتا ہے جب تک بندہ اپنے بھائی کی مدد میں لگا رہتا ہے۔",
9104-    "en": "Whoever relieves a believer of one of the distresses of the world, Allah will relieve him of one of the distresses of the Day of Resurrection. Whoever makes things easy for an insolvent person, Allah will make things easy for him in this world and the hereafter. Whoever conceals the faults of a Muslim, Allah will conceal his faults in this world and the hereafter. Allah continues to assist a servant so long as the servant assists his brother.",
9105-    "sourceUr": "صحیح مسلم: 2699",
9106-    "sourceEn": "Sahih Muslim: 2699"
9107-  },
9108-  {
9109-    "num": 37,
9110-    "category": "eman",
9111-    "category": "eman",
9112-    "arabic": "إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ: فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ لَهُ عِنْدَهُ حَسَنَةً كَامِلَةً، فَإِنْ هُوَ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ لَهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ...",
9113-    "urdu": "بے شک اللہ نے نیکیاں اور برائیاں لکھ رکھی ہیں پھر ان کی وضاحت فرمائی: پس جس نے کسی نیکی کا ارادہ کیا اور اس پر عمل نہ کر سکا تو اللہ اس کے لیے اپنے پاس ایک مکمل نیکی لکھ دیتا ہے، اور اگر ارادہ کر کے اس پر عمل بھی کر لیا تو اللہ اس کے لیے دس نیکیوں سے لے کر سات سو گنا اور اس سے بھی کئی گنا زیادہ ثواب لکھ دیتا ہے...",
9114-    "en": "Verily Allah has written down the good deeds and the evil deeds, and then explained it: Whosoever intended to perform a good deed, but did not do it, Allah writes it down with Himself as a complete good deed. And if he intended to do it and performed it, Allah writes it down with Himself as ten good deeds up to seven hundred times, or even more...",
9115-    "sourceUr": "صحیح البخاری: 6491، صحیح مسلم: 131",
9116-    "sourceEn": "Sahih al-Bukhari: 6491, Sahih Muslim: 131"
9117-  },
9118-  {
9119-    "num": 38,
9120-    "category": "taqwa",
9121-    "category": "taqwa",
9122-    "arabic": "مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ كُنْتُ سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَلَئِنْ سَأَلَنِي لأُعْطِيَنَّهُ، وَلَئِنِ اسْتَعَاذَنِي لأُعِيذَنَّهُ.",
9123-    "urdu": "حدیثِ قدسی: جس نے میرے کسی ولی سے دشمنی کی میں اس کے خلاف اعلانِ جنگ کرتا ہوں، اور میرا بندہ کسی چیز کے ذریعے میرا اتنا قرب حاصل نہیں کرتا جتنا ان فرائض کے ذریعے جو میں نے اس پر لازم کیے ہیں، اور میرا بندہ مسلسل نوافل کے ذریعے میرا قرب حاصل کرتا رہتا ہے یہاں تک کہ میں اس سے محبت کرنے لگتا ہوں، اور جب میں اس سے محبت کرتا ہوں تو میں اس کے کان بن جاتا ہوں جس سے وہ سنتا ہے، اس کی آنکھ بن جاتا ہوں جس سے وہ دیکھتا ہے، اس کا ہاتھ بن جاتا ہوں جس سے وہ پکڑتا ہے اور اس کا پاؤں بن جاتا ہوں جس سے وہ چلتا ہے، اگر وہ مجھ سے مانگے تو میں اسے ضرور دیتا ہوں اور اگر مجھ سے پناہ چاہے تو میں اسے ضرور پناہ دیتا ہوں۔",
9124-    "en": "Hadith Qudsi: Whosoever shows enmity to someone devoted to Me, I shall be at war with him. My servant draws not near to Me with anything more loved by Me than the duties I have enjoined upon him, and My servant continues to draw near to Me with optional works so that I shall love him. When I love him I am his hearing with which he hears, his seeing with which he sees, his hand with which he strikes and his foot with which he walks. Were he to ask [something] of Me, I would surely give it to him, and were he to ask for refuge, I would surely grant him it.",
9125-    "sourceUr": "صحیح البخاری: 6502",
9126-    "sourceEn": "Sahih al-Bukhari: 6502"
9127-  },
9128-  {
9129-    "num": 39,
9130-    "category": "taqwa",
9131-    "category": "taqwa",
9132-    "arabic": "إِنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي: الْخَطَأَ، وَالنِّسْيَانَ، وَمَا اسْتُكْرِهُوا عَلَيْهِ.",
9133-    "urdu": "بے شک اللہ تعالیٰ نے میری امت سے بھول چوک، غلطی اور جس کام پر انہیں مجبور کر دیا جائے، معاف فرما دیا ہے۔",
9134-    "en": "Verily Allah has pardoned for my nation their mistakes, their forgetfulness, and that which they have been forced to do under duress.",
9135-    "sourceUr": "سنن ابن ماجہ: 2045، سنن البیہقی: 7/356",
9136-    "sourceEn": "Sunan Ibn Majah: 2045, Sunan al-Bayhaqi: 7/356"
9137-  },
9138-  {
9139-    "num": 40,
9140-    "category": "taqwa",
9141-    "category": "taqwa",
9142-    "arabic": "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ. وَكَانَ ابْنُ عُمَرَ يَقُولُ: إِذَا أَمْسَيْتَ فَلاَ تَنْتَظِرِ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلاَ تَنْتَظِرِ الْمَسَاءَ، وَخُذْ مِنْ صِحَّتِكَ لِمَرَضِكَ، وَمِنْ حَيَاتِكَ لِمَوْتِكَ.",
9143-    "urdu": "رسول اللہ ﷺ نے میرا کندھا پکڑ کر فرمایا: دنیا میں اس طرح رہو جیسے تم کوئی اجنبی ہو یا راہ چلتے مسافر ہو۔ اور ابن عمرؓ فرمایا کرتے تھے: جب شام ہو جائے تو صبح کا انتظار نہ کرو اور جب صبح ہو جائے تو شام کا انتظار نہ کرو، اور اپنی تندرستی کو اپنی بیماری سے پہلے اور اپنی زندگی کو اپنی موت سے پہلے غنیمت جانو۔",
9144-    "en": "The Messenger of Allah ﷺ took me by the shoulder and said: 'Be in this world as though you were a stranger or a wayfarer.' And Ibn Umar used to say: 'In the evening do not expect to see the morning, and in the morning do not expect to see the evening. Take from your health for your sickness, and from your life for your death.'",
9145-    "sourceUr": "صحیح البخاری: 6416",
9146-    "sourceEn": "Sahih al-Bukhari: 6416"
9147-  }
9148-];
9149-
9150-  var QURAN_META = [
9151-  {
9152-    "num": 1,
9153-    "nameAr": "الفاتحة",
9154-    "nameEn": "Al-Fatihah",
9155-    "ayahs": 7,
9156-    "type": "مکی"
9157-  },
9158-  {
9159-    "num": 2,
9160-    "nameAr": "البقرة",
9161-    "nameEn": "Al-Baqarah",
9162-    "ayahs": 286,
9163-    "type": "مدنی"
9164-  },
9165-  {
9166-    "num": 3,
9167-    "nameAr": "آل عمران",
9168-    "nameEn": "Aal-Imran",
9169-    "ayahs": 200,
9170-    "type": "مدنی"
9171-  },
9172-  {
9173-    "num": 4,
9174-    "nameAr": "النساء",
9175-    "nameEn": "An-Nisa",
9176-    "ayahs": 176,
9177-    "type": "مدنی"
9178-  },
9179-  {
9180-    "num": 5,
9181-    "nameAr": "المائدة",
9182-    "nameEn": "Al-Ma'idah",
9183-    "ayahs": 120,
9184-    "type": "مدنی"
9185-  },
9186-  {
9187-    "num": 6,
9188-    "nameAr": "الأنعام",
9189-    "nameEn": "Al-An'am",
9190-    "ayahs": 165,
9191-    "type": "مکی"
9192-  },
9193-  {
9194-    "num": 7,
9195-    "nameAr": "الأعراف",
9196-    "nameEn": "Al-A'raf",
9197-    "ayahs": 206,
9198-    "type": "مکی"
9199-  },
9200-  {
9201-    "num": 8,
9202-    "nameAr": "الأنفال",
9203-    "nameEn": "Al-Anfal",
9204-    "ayahs": 75,
9205-    "type": "مدنی"
9206-  },
9207-  {
9208-    "num": 9,
9209-    "nameAr": "التوبة",
9210-    "nameEn": "At-Tawbah",
9211-    "ayahs": 129,
9212-    "type": "مدنی"
9213-  },
9214-  {
9215-    "num": 10,
9216-    "nameAr": "يونس",
9217-    "nameEn": "Yunus",
9218-    "ayahs": 109,
9219-    "type": "مکی"
9220-  },
9221-  {
9222-    "num": 11,
9223-    "nameAr": "هود",
9224-    "nameEn": "Hud",
9225-    "ayahs": 123,
9226-    "type": "مکی"
9227-  },
9228-  {
9229-    "num": 12,
9230-    "nameAr": "يوسف",
9231-    "nameEn": "Yusuf",
9232-    "ayahs": 111,
9233-    "type": "مکی"
9234-  },
9235-  {
9236-    "num": 13,
9237-    "nameAr": "الرعد",
9238-    "nameEn": "Ar-Ra'd",
9239-    "ayahs": 43,
9240-    "type": "مدنی"
9241-  },
9242-  {
9243-    "num": 14,
9244-    "nameAr": "إبراهيم",
9245-    "nameEn": "Ibrahim",
9246-    "ayahs": 52,
9247-    "type": "مکی"
9248-  },
9249-  {
9250-    "num": 15,
9251-    "nameAr": "الحجر",
9252-    "nameEn": "Al-Hijr",
9253-    "ayahs": 99,
9254-    "type": "مکی"
9255-  },
9256-  {
9257-    "num": 16,
9258-    "nameAr": "النحل",
9259-    "nameEn": "An-Nahl",
9260-    "ayahs": 128,
9261-    "type": "مکی"
9262-  },
9263-  {
9264-    "num": 17,
9265-    "nameAr": "الإسراء",
9266-    "nameEn": "Al-Isra",
9267-    "ayahs": 111,
9268-    "type": "مکی"
9269-  },
9270-  {
9271-    "num": 18,
9272-    "nameAr": "الكهف",
9273-    "nameEn": "Al-Kahf",
9274-    "ayahs": 110,
9275-    "type": "مکی"
9276-  },
9277-  {
9278-    "num": 19,
9279-    "nameAr": "مريم",
9280-    "nameEn": "Maryam",
9281-    "ayahs": 98,
9282-    "type": "مکی"
9283-  },
9284-  {
9285-    "num": 20,
9286-    "nameAr": "طه",
9287-    "nameEn": "Ta-Ha",
9288-    "ayahs": 135,
9289-    "type": "مکی"
9290-  },
9291-  {
9292-    "num": 21,
9293-    "nameAr": "الأنبياء",
9294-    "nameEn": "Al-Anbiya",
9295-    "ayahs": 112,
9296-    "type": "مکی"
9297-  },
9298-  {
9299-    "num": 22,
9300-    "nameAr": "الحج",
9301-    "nameEn": "Al-Hajj",
9302-    "ayahs": 78,
9303-    "type": "مدنی"
9304-  },
9305-  {
9306-    "num": 23,
9307-    "nameAr": "المؤمنون",
9308-    "nameEn": "Al-Mu'minun",
9309-    "ayahs": 118,
9310-    "type": "مکی"
9311-  },
9312-  {
9313-    "num": 24,
9314-    "nameAr": "النور",
9315-    "nameEn": "An-Nur",
9316-    "ayahs": 64,
9317-    "type": "مدنی"
9318-  },
9319-  {
9320-    "num": 25,
9321-    "nameAr": "الفرقان",
9322-    "nameEn": "Al-Furqan",
9323-    "ayahs": 77,
9324-    "type": "مکی"
9325-  },
9326-  {
9327-    "num": 26,
9328-    "nameAr": "الشعراء",
9329-    "nameEn": "Ash-Shu'ara",
9330-    "ayahs": 227,
9331-    "type": "مکی"
9332-  },
9333-  {
9334-    "num": 27,
9335-    "nameAr": "النمل",
9336-    "nameEn": "An-Naml",
9337-    "ayahs": 93,
9338-    "type": "مکی"
9339-  },
9340-  {
9341-    "num": 28,
9342-    "nameAr": "القصص",
9343-    "nameEn": "Al-Qasas",
9344-    "ayahs": 88,
9345-    "type": "مکی"
9346-  },
9347-  {
9348-    "num": 29,
9349-    "nameAr": "العنكبوت",
9350-    "nameEn": "Al-Ankabut",
9351-    "ayahs": 69,
9352-    "type": "مکی"
9353-  },
9354-  {
9355-    "num": 30,
9356-    "nameAr": "الروم",
9357-    "nameEn": "Ar-Rum",
9358-    "ayahs": 60,
9359-    "type": "مکی"
9360-  },
9361-  {
9362-    "num": 31,
9363-    "nameAr": "لقمان",
9364-    "nameEn": "Luqman",
9365-    "ayahs": 34,
9366-    "type": "مکی"
9367-  },
9368-  {
9369-    "num": 32,
9370-    "nameAr": "السجدة",
9371-    "nameEn": "As-Sajdah",
9372-    "ayahs": 30,
9373-    "type": "مکی"
9374-  },
9375-  {
9376-    "num": 33,
9377-    "nameAr": "الأحزاب",
9378-    "nameEn": "Al-Ahzab",
9379-    "ayahs": 73,
9380-    "type": "مدنی"
9381-  },
9382-  {
9383-    "num": 34,
9384-    "nameAr": "سبأ",
9385-    "nameEn": "Saba",
9386-    "ayahs": 54,
9387-    "type": "مکی"
9388-  },
9389-  {
9390-    "num": 35,
9391-    "nameAr": "فاطر",
9392-    "nameEn": "Fatir",
9393-    "ayahs": 45,
9394-    "type": "مکی"
9395-  },
9396-  {
9397-    "num": 36,
9398-    "nameAr": "يس",
9399-    "nameEn": "Ya-Sin",
9400-    "ayahs": 83,
9401-    "type": "مکی"
9402-  },
9403-  {
9404-    "num": 37,
9405-    "nameAr": "الصافات",
9406-    "nameEn": "As-Saffat",
9407-    "ayahs": 182,
9408-    "type": "مکی"
9409-  },
9410-  {
9411-    "num": 38,
9412-    "nameAr": "ص",
9413-    "nameEn": "Sad",
9414-    "ayahs": 88,
9415-    "type": "مکی"
9416-  },
9417-  {
9418-    "num": 39,
9419-    "nameAr": "الزمر",
9420-    "nameEn": "Az-Zumar",
9421-    "ayahs": 75,
9422-    "type": "مکی"
9423-  },
9424-  {
9425-    "num": 40,
9426-    "nameAr": "غافر",
9427-    "nameEn": "Ghafir",
9428-    "ayahs": 85,
9429-    "type": "مکی"
9430-  },
9431-  {
9432-    "num": 41,
9433-    "nameAr": "فصلت",
9434-    "nameEn": "Fussilat",
9435-    "ayahs": 54,
9436-    "type": "مکی"
9437-  },
9438-  {
9439-    "num": 42,
9440-    "nameAr": "الشورى",
9441-    "nameEn": "Ash-Shura",
9442-    "ayahs": 53,
9443-    "type": "مکی"
9444-  },
9445-  {
9446-    "num": 43,
9447-    "nameAr": "الزخرف",
9448-    "nameEn": "Az-Zukhruf",
9449-    "ayahs": 89,
9450-    "type": "مکی"
9451-  },
9452-  {
9453-    "num": 44,
9454-    "nameAr": "الدخان",
9455-    "nameEn": "Ad-Dukhan",
9456-    "ayahs": 59,
9457-    "type": "مکی"
9458-  },
9459-  {
9460-    "num": 45,
9461-    "nameAr": "الجاثية",
9462-    "nameEn": "Al-Jathiyah",
9463-    "ayahs": 37,
9464-    "type": "مکی"
9465-  },
9466-  {
9467-    "num": 46,
9468-    "nameAr": "الأحقاف",
9469-    "nameEn": "Al-Ahqaf",
9470-    "ayahs": 35,
9471-    "type": "مکی"
9472-  },
9473-  {
9474-    "num": 47,
9475-    "nameAr": "محمد",
9476-    "nameEn": "Muhammad",
9477-    "ayahs": 38,
9478-    "type": "مدنی"
9479-  },
9480-  {
9481-    "num": 48,
9482-    "nameAr": "الفتح",
9483-    "nameEn": "Al-Fath",
9484-    "ayahs": 29,
9485-    "type": "مدنی"
9486-  },
9487-  {
9488-    "num": 49,
9489-    "nameAr": "الحجرات",
9490-    "nameEn": "Al-Hujurat",
9491-    "ayahs": 18,
9492-    "type": "مدنی"
9493-  },
9494-  {
9495-    "num": 50,
9496-    "nameAr": "ق",
9497-    "nameEn": "Qaf",
9498-    "ayahs": 45,
9499-    "type": "مکی"
9500-  },
9501-  {
9502-    "num": 51,
9503-    "nameAr": "الذاريات",
9504-    "nameEn": "Adh-Dhariyat",
9505-    "ayahs": 60,
9506-    "type": "مکی"
9507-  },
9508-  {
9509-    "num": 52,
9510-    "nameAr": "الطور",
9511-    "nameEn": "At-Tur",
9512-    "ayahs": 49,
9513-    "type": "مکی"
9514-  },
9515-  {
9516-    "num": 53,
9517-    "nameAr": "النجم",
9518-    "nameEn": "An-Najm",
9519-    "ayahs": 62,
9520-    "type": "مکی"
9521-  },
9522-  {
9523-    "num": 54,
9524-    "nameAr": "القمر",
9525-    "nameEn": "Al-Qamar",
9526-    "ayahs": 55,
9527-    "type": "مکی"
9528-  },
9529-  {
9530-    "num": 55,
9531-    "nameAr": "الرحمن",
9532-    "nameEn": "Ar-Rahman",
9533-    "ayahs": 78,
9534-    "type": "مدنی"
9535-  },
9536-  {
9537-    "num": 56,
9538-    "nameAr": "الواقعة",
9539-    "nameEn": "Al-Waqi'ah",
9540-    "ayahs": 96,
9541-    "type": "مکی"
9542-  },
9543-  {
9544-    "num": 57,
9545-    "nameAr": "الحديد",
9546-    "nameEn": "Al-Hadid",
9547-    "ayahs": 29,
9548-    "type": "مدنی"
9549-  },
9550-  {
9551-    "num": 58,
9552-    "nameAr": "المجادلة",
9553-    "nameEn": "Al-Mujadila",
9554-    "ayahs": 22,
9555-    "type": "مدنی"
9556-  },
9557-  {
9558-    "num": 59,
9559-    "nameAr": "الحشر",
9560-    "nameEn": "Al-Hashr",
9561-    "ayahs": 24,
9562-    "type": "مدنی"
9563-  },
9564-  {
9565-    "num": 60,
9566-    "nameAr": "الممتحنة",
9567-    "nameEn": "Al-Mumtahanah",
9568-    "ayahs": 13,
9569-    "type": "مدنی"
9570-  },
9571-  {
9572-    "num": 61,
9573-    "nameAr": "الصف",
9574-    "nameEn": "As-Saff",
9575-    "ayahs": 14,
9576-    "type": "مدنی"
9577-  },
9578-  {
9579-    "num": 62,
9580-    "nameAr": "الجمعة",
9581-    "nameEn": "Al-Jumu'ah",
9582-    "ayahs": 11,
9583-    "type": "مدنی"
9584-  },
9585-  {
9586-    "num": 63,
9587-    "nameAr": "المنافقون",
9588-    "nameEn": "Al-Munafiqun",
9589-    "ayahs": 11,
9590-    "type": "مدنی"
9591-  },
9592-  {
9593-    "num": 64,
9594-    "nameAr": "التغابن",
9595-    "nameEn": "At-Taghabun",
9596-    "ayahs": 18,
9597-    "type": "مدنی"
9598-  },
9599-  {
9600-    "num": 65,
9601-    "nameAr": "الطلاق",
9602-    "nameEn": "At-Talaq",
9603-    "ayahs": 12,
9604-    "type": "مدنی"
9605-  },
9606-  {
9607-    "num": 66,
9608-    "nameAr": "التحريم",
9609-    "nameEn": "At-Tahrim",
9610-    "ayahs": 12,
9611-    "type": "مدنی"
9612-  },
9613-  {
9614-    "num": 67,
9615-    "nameAr": "الملك",
9616-    "nameEn": "Al-Mulk",
9617-    "ayahs": 30,
9618-    "type": "مکی"
9619-  },
9620-  {
9621-    "num": 68,
9622-    "nameAr": "القلم",
9623-    "nameEn": "Al-Qalam",
9624-    "ayahs": 52,
9625-    "type": "مکی"
9626-  },
9627-  {
9628-    "num": 69,
9629-    "nameAr": "الحاقة",
9630-    "nameEn": "Al-Haqqah",
9631-    "ayahs": 52,
9632-    "type": "مکی"
9633-  },
9634-  {
9635-    "num": 70,
9636-    "nameAr": "المعارج",
9637-    "nameEn": "Al-Ma'arij",
9638-    "ayahs": 44,
9639-    "type": "مکی"
9640-  },
9641-  {
9642-    "num": 71,
9643-    "nameAr": "نوح",
9644-    "nameEn": "Nuh",
9645-    "ayahs": 28,
9646-    "type": "مکی"
9647-  },
9648-  {
9649-    "num": 72,
9650-    "nameAr": "الجن",
9651-    "nameEn": "Al-Jinn",
9652-    "ayahs": 28,
9653-    "type": "مکی"
9654-  },
9655-  {
9656-    "num": 73,
9657-    "nameAr": "المزمل",
9658-    "nameEn": "Al-Muzzammil",
9659-    "ayahs": 20,
9660-    "type": "مکی"
9661-  },
9662-  {
9663-    "num": 74,
9664-    "nameAr": "المدثر",
9665-    "nameEn": "Al-Muddaththir",
9666-    "ayahs": 56,
9667-    "type": "مکی"
9668-  },
9669-  {
9670-    "num": 75,
9671-    "nameAr": "القيامة",
9672-    "nameEn": "Al-Qiyamah",
9673-    "ayahs": 40,
9674-    "type": "مکی"
9675-  },
9676-  {
9677-    "num": 76,
9678-    "nameAr": "الإنسان",
9679-    "nameEn": "Al-Insan",
9680-    "ayahs": 31,
9681-    "type": "مدنی"
9682-  },
9683-  {
9684-    "num": 77,
9685-    "nameAr": "المرسلات",
9686-    "nameEn": "Al-Mursalat",
9687-    "ayahs": 50,
9688-    "type": "مکی"
9689-  },
9690-  {
9691-    "num": 78,
9692-    "nameAr": "النبأ",
9693-    "nameEn": "An-Naba",
9694-    "ayahs": 40,
9695-    "type": "مکی"
9696-  },
9697-  {
9698-    "num": 79,
9699-    "nameAr": "النازعات",
9700-    "nameEn": "An-Nazi'at",
9701-    "ayahs": 46,
9702-    "type": "مکی"
9703-  },
9704-  {
9705-    "num": 80,
9706-    "nameAr": "عبس",
9707-    "nameEn": "Abasa",
9708-    "ayahs": 42,
9709-    "type": "مکی"
9710-  },
9711-  {
9712-    "num": 81,
9713-    "nameAr": "التكوير",
9714-    "nameEn": "At-Takwir",
9715-    "ayahs": 29,
9716-    "type": "مکی"
9717-  },
9718-  {
9719-    "num": 82,
9720-    "nameAr": "الانفطار",
9721-    "nameEn": "Al-Infitar",
9722-    "ayahs": 19,
9723-    "type": "مکی"
9724-  },
9725-  {
9726-    "num": 83,
9727-    "nameAr": "المطففين",
9728-    "nameEn": "Al-Mutaffifin",
9729-    "ayahs": 36,
9730-    "type": "مکی"
9731-  },
9732-  {
9733-    "num": 84,
9734-    "nameAr": "الانشقاق",
9735-    "nameEn": "Al-Inshiqaq",
9736-    "ayahs": 25,
9737-    "type": "مکی"
9738-  },
9739-  {
9740-    "num": 85,
9741-    "nameAr": "البروج",
9742-    "nameEn": "Al-Buruj",
9743-    "ayahs": 22,
9744-    "type": "مکی"
9745-  },
9746-  {
9747-    "num": 86,
9748-    "nameAr": "الطارق",
9749-    "nameEn": "At-Tariq",
9750-    "ayahs": 17,
9751-    "type": "مکی"
9752-  },
9753-  {
9754-    "num": 87,
9755-    "nameAr": "الأعلى",
9756-    "nameEn": "Al-A'la",
9757-    "ayahs": 19,
9758-    "type": "مکی"
9759-  },
9760-  {
9761-    "num": 88,
9762-    "nameAr": "الغاشية",
9763-    "nameEn": "Al-Ghashiyah",
9764-    "ayahs": 26,
9765-    "type": "مکی"
9766-  },
9767-  {
9768-    "num": 89,
9769-    "nameAr": "الفجر",
9770-    "nameEn": "Al-Fajr",
9771-    "ayahs": 30,
9772-    "type": "مکی"
9773-  },
9774-  {
9775-    "num": 90,
9776-    "nameAr": "البلد",
9777-    "nameEn": "Al-Balad",
9778-    "ayahs": 20,
9779-    "type": "مکی"
9780-  },
9781-  {
9782-    "num": 91,
9783-    "nameAr": "الشمس",
9784-    "nameEn": "Ash-Shams",
9785-    "ayahs": 15,
9786-    "type": "مکی"
9787-  },
9788-  {
9789-    "num": 92,
9790-    "nameAr": "الليل",
9791-    "nameEn": "Al-Layl",
9792-    "ayahs": 21,
9793-    "type": "مکی"
9794-  },
9795-  {
9796-    "num": 93,
9797-    "nameAr": "الضحى",
9798-    "nameEn": "Ad-Duha",
9799-    "ayahs": 11,
9800-    "type": "مکی"
9801-  },
9802-  {
9803-    "num": 94,
9804-    "nameAr": "الشرح",
9805-    "nameEn": "Ash-Sharh",
9806-    "ayahs": 8,
9807-    "type": "مکی"
9808-  },
9809-  {
9810-    "num": 95,
9811-    "nameAr": "التين",
9812-    "nameEn": "At-Tin",
9813-    "ayahs": 8,
9814-    "type": "مکی"
9815-  },
9816-  {
9817-    "num": 96,
9818-    "nameAr": "العلق",
9819-    "nameEn": "Al-Alaq",
9820-    "ayahs": 19,
9821-    "type": "مکی"
9822-  },
9823-  {
9824-    "num": 97,
9825-    "nameAr": "القدر",
9826-    "nameEn": "Al-Qadr",
9827-    "ayahs": 5,
9828-    "type": "مکی"
9829-  },
9830-  {
9831-    "num": 98,
9832-    "nameAr": "البينة",
9833-    "nameEn": "Al-Bayyinah",
9834-    "ayahs": 8,
9835-    "type": "مدنی"
9836-  },
9837-  {
9838-    "num": 99,
9839-    "nameAr": "الزلزلة",
9840-    "nameEn": "Az-Zalzalah",
9841-    "ayahs": 8,
9842-    "type": "مدنی"
9843-  },
9844-  {
9845-    "num": 100,
9846-    "nameAr": "العاديات",
9847-    "nameEn": "Al-Adiyat",
9848-    "ayahs": 11,
9849-    "type": "مکی"
9850-  },
9851-  {
9852-    "num": 101,
9853-    "nameAr": "القارعة",
9854-    "nameEn": "Al-Qari'ah",
9855-    "ayahs": 11,
9856-    "type": "مکی"
9857-  },
9858-  {
9859-    "num": 102,
9860-    "nameAr": "التكاثر",
9861-    "nameEn": "At-Takathur",
9862-    "ayahs": 8,
9863-    "type": "مکی"
9864-  },
9865-  {
9866-    "num": 103,
9867-    "nameAr": "العصر",
9868-    "nameEn": "Al-Asr",
9869-    "ayahs": 3,
9870-    "type": "مکی"
9871-  },
9872-  {
9873-    "num": 104,
9874-    "nameAr": "الهمزة",
9875-    "nameEn": "Al-Humazah",
9876-    "ayahs": 9,
9877-    "type": "مکی"
9878-  },
9879-  {
9880-    "num": 105,
9881-    "nameAr": "الفيل",
9882-    "nameEn": "Al-Fil",
9883-    "ayahs": 5,
9884-    "type": "مکی"
9885-  },
9886-  {
9887-    "num": 106,
9888-    "nameAr": "قريش",
9889-    "nameEn": "Quraysh",
9890-    "ayahs": 4,
9891-    "type": "مکی"
9892-  },
9893-  {
9894-    "num": 107,
9895-    "nameAr": "الماعون",
9896-    "nameEn": "Al-Ma'un",
9897-    "ayahs": 7,
9898-    "type": "مکی"
9899-  },
9900-  {
9901-    "num": 108,
9902-    "nameAr": "الكوثر",
9903-    "nameEn": "Al-Kawthar",
9904-    "ayahs": 3,
9905-    "type": "مکی"
9906-  },
9907-  {
9908-    "num": 109,
9909-    "nameAr": "الكافرون",
9910-    "nameEn": "Al-Kafirun",
9911-    "ayahs": 6,
9912-    "type": "مکی"
9913-  },
9914-  {
9915-    "num": 110,
9916-    "nameAr": "النصر",
9917-    "nameEn": "An-Nasr",
9918-    "ayahs": 3,
9919-    "type": "مدنی"
9920-  },
9921-  {
9922-    "num": 111,
9923-    "nameAr": "المسد",
9924-    "nameEn": "Al-Masad",
9925-    "ayahs": 5,
9926-    "type": "مکی"
9927-  },
9928-  {
9929-    "num": 112,
9930-    "nameAr": "الإخلاص",
9931-    "nameEn": "Al-Ikhlas",
9932-    "ayahs": 4,
9933-    "type": "مکی"
9934-  },
9935-  {
9936-    "num": 113,
9937-    "nameAr": "الفلق",
9938-    "nameEn": "Al-Falaq",
9939-    "ayahs": 5,
9940-    "type": "مکی"
9941-  },
9942-  {
9943-    "num": 114,
9944-    "nameAr": "الناس",
9945-    "nameEn": "An-Nas",
9946-    "ayahs": 6,
9947-    "type": "مکی"
9948-  }
9949-];
9950-
9951-
9952-        // ================= 1. KUTTUB KHANA / STITCH ISLAMIC DIGITAL LIBRARY & READER =================
9953-  var ISLAMIC_LIBRARY_BOOKS = [
9954-    {
9955-      id: "hisn_muslim",
9956-      category: "duas",
9957-      categoryUr: "دعائیں و اذکار",
9958-      title: "حصن المسلم — مسنون دعائیں",
9959-      author: "فضیلۃ الشیخ سعید بن علی بن وہف القحطانیؒ",
9960-      pages: 132,
9961-      size: "3.4 MB",
9962-      icon: "📖",
9963-      tag: "عربی مع اردو ترجمہ",
9964-      desc: "قرآن و سنت کی مستند دعاؤں کا جامع مجموعہ",
9965-      progress: 65
9966-    },
9967-    {
9968-      id: "arbain_nawawi",
9969-      category: "hadith",
9970-      categoryUr: "حدیث شریف",
9971-      title: "الأربعون النووية — 40 احادیث نبویہ",
9972-      author: "امام ابو زکریا یحییٰ بن شرف النوویؒ",
9973-      pages: 48,
9974-      size: "2.1 MB",
9975-      icon: "📜",
9976-      tag: "مستند احادیث",
9977-      desc: "دینِ اسلام کے بنیادی اصولوں پر مشتمل چالیس جامع احادیث",
9978-      progress: 100
9979-    },
9980-    {
9981-      id: "subah_sham_azkar",
9982-      category: "duas",
9983-      categoryUr: "دعائیں و اذکار",
9984-      title: "صبح و شام کے مسنون اذکار",
9985-      author: "تالیف: مفتی معاذ ہارون حفظہ اللہ",
9986-      pages: 24,
9987-      size: "1.5 MB",
9988-      icon: "🤲",
9989-      tag: "حفاظت و برکت",
9990-      desc: "صبح و شام حفاظت اور برکت کے مسنون اذکار و وظائف",
9991-      progress: 40
9992-    },
9993-    {
9994-      id: "quran_tajweed",
9995-      category: "quran",
9996-      categoryUr: "قرآنی علوم",
9997-      title: "قرآن مجید تجوید و قواعد",
9998-      author: "ادارہ تجوید القرآن الکریم",
9999-      pages: 64,
10000-      size: "2.8 MB",
10001-      icon: "📗",
10002-      tag: "تجوید و مخارج",
10003-      desc: "قرآن مجید کو درست مخارج اور صفات کے ساتھ پڑھنے کے قواعد",
10004-      progress: 25
10005-    },
10006-    {
10007-      id: "masail_salah",
10008-      category: "fiqh",
10009-      categoryUr: "فقہ و مسائل",
10010-      title: "مسائلِ نماز و طہارت",
10011-      author: "مفتی معاذ ہارون حفظہ اللہ",
10012-      pages: 96,
10013-      size: "3.1 MB",
10014-      icon: "🕌",
10015-      tag: "فقہی رہنمائی",
10016-      desc: "وضو، غسل اور نماز کے ضروری مسائل و احکام",
10017-      progress: 10
10018-    },
10019-    {
10020-      id: "seerat_nabi",
10021-      category: "seerat",
10022-      categoryUr: "سیرتِ طیبہ",
10023-      title: "سیرت النبی ﷺ کا خلاصہ",
10024-      author: "مولانا صفی الرحمن مبارکپوریؒ",
10025-      pages: 80,
10026-      size: "2.9 MB",
10027-      icon: "✨",
10028-      tag: "حیاتِ طیبہ",
10029-      desc: "رسول اللہ ﷺ کی حیاتِ مبارکہ کا جامع اور دلنشین خلاصہ",
10030-      progress: 0
10031-    }
10032-  ];
10033-
10034-  var libState = {
10035-    activeCategory: 'all',
10036-    searchQuery: '',
10037-    customBooks: [],
10038-    blobUrls: {},
10039-    activeReaderUrl: null
10040-  };
10041-
10042-  // --- IndexedDB for Persistent PDF File Storage ---
10043-  var pdfDbPromise = null;
10044-  function getPdfDb() {
10045-    if (pdfDbPromise) return pdfDbPromise;
10046-    pdfDbPromise = new Promise(function(resolve, reject) {
10047-      if (!window.indexedDB) { resolve(null); return; }
10048-      var req = indexedDB.open('qurb_pdf_storage_v1', 1);
10049-      req.onupgradeneeded = function(e) {
10050-        var db = e.target.result;
10051-        if (!db.objectStoreNames.contains('pdf_blobs')) {
10052-          db.createObjectStore('pdf_blobs', { keyPath: 'id' });
10053-        }
10054-      };
10055-      req.onsuccess = function(e) { resolve(e.target.result); };
10056-      req.onerror = function() { resolve(null); };
10057-    });
10058-    return pdfDbPromise;
10059-  }
10060-
10061-  function storePdfBlob(id, fileBlob) {
10062-    return getPdfDb().then(function(db) {
10063-      if (!db) return false;
10064-      return new Promise(function(resolve) {
10065-        try {
10066-          var tx = db.transaction(['pdf_blobs'], 'readwrite');
10067-          var store = tx.objectStore('pdf_blobs');
10068-          store.put({ id: id, blob: fileBlob, date: Date.now() });
10069-          tx.oncomplete = function() { resolve(true); };
10070-          tx.onerror = function() { resolve(false); };
10071-        } catch(e) { resolve(false); }
10072-      });
10073-    });
10074-  }
10075-
10076-  function retrievePdfBlob(id) {
10077-    return getPdfDb().then(function(db) {
10078-      if (!db) return null;
10079-      return new Promise(function(resolve) {
10080-        try {
10081-          var tx = db.transaction(['pdf_blobs'], 'readonly');
10082-          var store = tx.objectStore('pdf_blobs');
10083-          var req = store.get(id);
10084-          req.onsuccess = function(e) {
10085-            resolve(e.target.result ? e.target.result.blob : null);
10086-          };
10087-          req.onerror = function() { resolve(null); };
10088-        } catch(e) { resolve(null); }
10089-      });
10090-    });
10091-  }
10092-
10093-  function loadCustomBooks() {
10094-    try {
10095-      var saved = localStorage.getItem('qurb_custom_library_books_v1');
10096-      if (saved) {
10097-        libState.customBooks = JSON.parse(saved) || [];
10098-      }
10099-    } catch(e) {}
10100-  }
10101-
10102-  function saveCustomBooks() {
10103-    try {
10104-      localStorage.setItem('qurb_custom_library_books_v1', JSON.stringify(libState.customBooks));
10105-    } catch(e) {}
10106-  }
10107-
10108-  function initLibrary() {
10109-    loadCustomBooks();
10110-    renderLibraryCategories();
10111-    renderRecentlyRead();
10112-    renderLibraryGrid();
10113-    initPdfReaderModal();
10114-
10115-    var countBadge = document.getElementById('libBookCount');
10116-    if (countBadge) {
10117-      countBadge.textContent = (ISLAMIC_LIBRARY_BOOKS.length + libState.customBooks.length);
10118-    }
10119-
10120-    var search = document.getElementById('librarySearch');
10121-    if (search && !search.dataset.bound) {
10122-      search.dataset.bound = '1';
10123-      search.addEventListener('input', function() {
10124-        libState.searchQuery = search.value.toLowerCase().trim();
10125-        renderLibraryGrid();
10126-      });
10127-    }
10128-
10129-    var importCard = document.getElementById('stitchImportCard');
10130-    var importBtn = document.getElementById('libImportPdfBtn');
10131-    var fileInput = document.getElementById('libFileInput');
10132-
10133-    function triggerImport() {
10134-      if (window.QurbBridge) {
10135-        window.QurbBridge.postMessage(JSON.stringify({ action: 'openPdfLibrary' }));
10136-      } else if (fileInput) {
10137-        fileInput.click();
10138-      }
10139-    }
10140-
10141-    if (importBtn && !importBtn.dataset.bound) {
10142-      importBtn.dataset.bound = '1';
10143-      importBtn.addEventListener('click', function(e) {
10144-        e.stopPropagation();
10145-        triggerImport();
10146-      });
10147-    }
10148-
10149-    if (importCard && !importCard.dataset.bound) {
10150-      importCard.dataset.bound = '1';
10151-      importCard.addEventListener('click', function() {
10152-        triggerImport();
10153-      });
10154-    }
10155-
10156-    if (fileInput && !fileInput.dataset.bound) {
10157-      fileInput.dataset.bound = '1';
10158-      fileInput.addEventListener('change', function() {
10159-        if (fileInput.files && fileInput.files[0]) {
10160-          var f = fileInput.files[0];
10161-          var bookId = 'custom_' + Date.now();
10162-          var objectUrl = URL.createObjectURL(f);
10163-          libState.blobUrls[bookId] = objectUrl;
10164-
10165-          // Store in IndexedDB for permanent access across reloads
10166-          storePdfBlob(bookId, f);
10167-
10168-          var newBook = {
10169-            id: bookId,
10170-            category: 'imported',
10171-            categoryUr: 'مقامی کتب',
10172-            title: f.name.replace(/\.pdf$/i, ''),
10173-            author: 'مقامی امپورٹ شدہ کتاب',
10174-            pages: 1,
10175-            size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
10176-            icon: '📄',
10177-            tag: 'مقامی فائل',
10178-            desc: 'آپ کی امپورٹ کردہ PDF کتاب',
10179-            dateAdded: Date.now(),
10180-            progress: 10
10181-          };
10182-          libState.customBooks.unshift(newBook);
10183-          saveCustomBooks();
10184-          renderRecentlyRead();
10185-          renderLibraryGrid();
10186-          if (countBadge) countBadge.textContent = (ISLAMIC_LIBRARY_BOOKS.length + libState.customBooks.length);
10187-          showToast('کتاب لائبریری میں شامل ہوگئی: ' + newBook.title);
10188-
10189-          // Immediately open the imported PDF
10190-          openPdfInReader(objectUrl, newBook.title);
10191-        }
10192-      });
10193-    }
10194-  }
10195-
10196-  function initPdfReaderModal() {
10197-    var closeBtn = document.getElementById('stitchReaderCloseBtn');
10198-    var newTabBtn = document.getElementById('stitchReaderNewTabBtn');
10199-    var aaBtn = document.getElementById('appleBooksAaBtn');
10200-    var popover = document.getElementById('appleBooksAppearancePopover');
10201-    var modal = document.getElementById('stitchPdfReaderModal');
10202-    var frame = document.getElementById('stitchPdfFrame');
10203-    var topbar = document.getElementById('appleBooksTopbar');
10204-    var scrubber = document.getElementById('appleBooksScrubber');
10205-    var viewport = document.getElementById('stitchReaderViewport');
10206-
10207-    if (closeBtn && !closeBtn.dataset.bound) {
10208-      closeBtn.dataset.bound = '1';
10209-      closeBtn.addEventListener('click', function() {
10210-        if (modal) modal.classList.remove('show');
10211-        if (frame) frame.src = 'about:blank';
10212-        if (popover) popover.classList.remove('show');
10213-      });
10214-    }
10215-
10216-    if (newTabBtn && !newTabBtn.dataset.bound) {
10217-      newTabBtn.dataset.bound = '1';
10218-      newTabBtn.addEventListener('click', function() {
10219-        if (libState.activeReaderUrl) {
10220-          window.open(libState.activeReaderUrl, '_blank');
10221-        }
10222-      });
10223-    }
10224-
10225-    if (aaBtn && popover && !aaBtn.dataset.bound) {
10226-      aaBtn.dataset.bound = '1';
10227-      aaBtn.addEventListener('click', function(e) {
10228-        e.stopPropagation();
10229-        popover.classList.toggle('show');
10230-      });
10231-    }
10232-
10233-    // Theme Switchers
10234-    if (popover && !popover.dataset.bound) {
10235-      popover.dataset.bound = '1';
10236-      Array.prototype.forEach.call(popover.querySelectorAll('.apple-theme-dot'), function(dot) {
10237-        dot.addEventListener('click', function(e) {
10238-          e.stopPropagation();
10239-          var t = dot.getAttribute('data-theme');
10240-          if (modal) {
10241-            modal.className = 'show theme-' + t;
10242-          }
10243-          Array.prototype.forEach.call(popover.querySelectorAll('.apple-theme-dot'), function(d) {
10244-            d.classList.remove('active');
10245-          });
10246-          dot.classList.add('active');
10247-          try { localStorage.setItem('apple_books_web_theme', t); } catch(e){}
10248-        });
10249-      });
10250-    }
10251-
10252-    // Tap on viewport to toggle controls (Apple Books Chrome)
10253-    if (viewport && !viewport.dataset.bound) {
10254-      viewport.dataset.bound = '1';
10255-      viewport.addEventListener('click', function(e) {
10256-        if (popover && popover.classList.contains('show')) {
10257-          popover.classList.remove('show');
10258-          return;
10259-        }
10260-        if (topbar) topbar.classList.toggle('hide-controls');
10261-        if (scrubber) scrubber.classList.toggle('hide-controls');
10262-      });
10263-    }
10264-  }
10265-
10266-  function openPdfInReader(url, title) {
10267-    var modal = document.getElementById('stitchPdfReaderModal');
10268-    var frame = document.getElementById('stitchPdfFrame');
10269-    var titleEl = document.getElementById('stitchReaderTitle');
10270-
10271-    if (titleEl) titleEl.textContent = title || 'PDF Document';
10272-    libState.activeReaderUrl = url;
10273-
10274-    if (frame) {
10275-      frame.src = url;
10276-    }
10277-    if (modal) {
10278-      modal.classList.add('show');
10279-    }
10280-  }
10281-
10282-  function renderRecentlyRead() {
10283-    var sec = document.getElementById('stitchRecentSection');
10284-    var scroll = document.getElementById('stitchRecentScroll');
10285-    if (!sec || !scroll) return;
10286-
10287-    var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
10288-    var recent = allBooks.filter(function(b) { return (b.progress && b.progress > 0); });
10289-
10290-    if (!recent.length) {
10291-      sec.style.display = 'none';
10292-      return;
10293-    }
10294-
10295-    sec.style.display = 'block';
10296-    scroll.innerHTML = recent.map(function(b) {
10297-      return '<div class="stitch-recent-card" data-bookid="' + b.id + '">' +
10298-        '<div class="stitch-recent-top">' +
10299-          '<div class="stitch-recent-thumb">' + b.icon + '</div>' +
10300-          '<div class="stitch-recent-info">' +
10301-            '<div class="stitch-recent-book-title">' + escapeHtml(b.title) + '</div>' +
10302-            '<div class="stitch-recent-meta">' + escapeHtml(b.size) + ' • ' + escapeHtml(b.pages + ' pages') + '</div>' +
10303-          '</div>' +
10304-        '</div>' +
10305-        '<div class="stitch-progress-wrap">' +
10306-          '<div class="stitch-progress-labels">' +
10307-            '<span>Reading</span>' +
10308-            '<span>' + b.progress + '%</span>' +
10309-          '</div>' +
10310-          '<div class="stitch-progress-track">' +
10311-            '<div class="stitch-progress-bar" style="width:' + b.progress + '%;"></div>' +
10312-          '</div>' +
10313-        '</div>' +
10314-      '</div>';
10315-    }).join('');
10316-
10317-    Array.prototype.forEach.call(scroll.querySelectorAll('.stitch-recent-card'), function(card) {
10318-      card.addEventListener('click', function() {
10319-        var id = card.getAttribute('data-bookid');
10320-        openLibraryBook(id);
10321-      });
10322-    });
10323-  }
10324-
10325-  function renderLibraryCategories() {
10326-    var wrap = document.getElementById('libraryCategoryFilters');
10327-    if (!wrap) return;
10328-    var cats = [
10329-      { id: 'all', label: 'All (تمام کتب)' },
10330-      { id: 'quran', label: 'Quran (قرآنی علوم)' },
10331-      { id: 'hadith', label: 'Hadith (حدیث شریف)' },
10332-      { id: 'duas', label: 'Duas (دعائیں و اذکار)' },
10333-      { id: 'fiqh', label: 'Fiqh (فقہ و مسائل)' },
10334-      { id: 'seerat', label: 'Seerat (سیرتِ طیبہ)' },
10335-      { id: 'imported', label: 'Imported (امپورٹ شدہ)' }
10336-    ];
10337-
10338-    wrap.innerHTML = cats.map(function(c) {
10339-      var isAct = (c.id === libState.activeCategory);
10340-      return '<button type="button" class="stitch-chip ' + (isAct ? 'active' : '') + '" data-libcat="' + c.id + '">' + c.label + '</button>';
10341-    }).join('');
10342-
10343-    Array.prototype.forEach.call(wrap.querySelectorAll('.stitch-chip'), function(btn) {
10344-      btn.addEventListener('click', function() {
10345-        libState.activeCategory = btn.getAttribute('data-libcat');
10346-        renderLibraryCategories();
10347-        renderLibraryGrid();
10348-      });
10349-    });
10350-  }
10351-
10352-  function renderLibraryGrid() {
10353-    var grid = document.getElementById('libraryBooksGrid');
10354-    if (!grid) return;
10355-
10356-    var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
10357-    var filtered = allBooks.filter(function(b) {
10358-      var matchCat = (libState.activeCategory === 'all' || b.category === libState.activeCategory);
10359-      if (!matchCat) return false;
10360-      if (!libState.searchQuery) return true;
10361-      var blob = [b.title, b.author, b.desc, b.categoryUr, b.tag].join(' ').toLowerCase();
10362-      return blob.indexOf(libState.searchQuery) >= 0;
10363-    });
10364-
10365-    if (!filtered.length) {
10366-      grid.innerHTML = '<div class="stitch-empty-library">کوئی کتاب نہیں ملی۔ (No books found)</div>';
10367-      return;
10368-    }
10369-
10370-    grid.innerHTML = filtered.map(function(b) {
10371-      return '<div class="stitch-book-card" data-bookid="' + b.id + '">' +
10372-        '<div class="stitch-book-cover">' +
10373-          '<span>' + b.icon + '</span>' +
10374-          '<span class="stitch-book-badge">' + escapeHtml(b.categoryUr) + '</span>' +
10375-        '</div>' +
10376-        '<div class="stitch-book-body">' +
10377-          '<div>' +
10378-            '<h4 class="stitch-book-title">' + escapeHtml(b.title) + '</h4>' +
10379-            '<p class="stitch-book-author">' + escapeHtml(b.author) + '</p>' +
10380-          '</div>' +
10381-          '<div class="stitch-book-meta">' +
10382-            '<span>' + escapeHtml(b.pages + ' صفحات') + '</span>' +
10383-            '<span>' + escapeHtml(b.size) + '</span>' +
10384-          '</div>' +
10385-        '</div>' +
10386-      '</div>';
10387-    }).join('');
10388-
10389-    Array.prototype.forEach.call(grid.querySelectorAll('.stitch-book-card'), function(card) {
10390-      card.addEventListener('click', function() {
10391-        var id = card.getAttribute('data-bookid');
10392-        openLibraryBook(id);
10393-      });
10394-    });
10395-  }
10396-
10397-  function openLibraryBook(bookId) {
10398-    if (window.QurbBridge) {
10399-      window.QurbBridge.postMessage(JSON.stringify({ action: 'openPdfLibrary', bookId: bookId }));
10400-      return;
10401-    }
10402-    var allBooks = libState.customBooks.concat(ISLAMIC_LIBRARY_BOOKS);
10403-    var book = allBooks.find(function(b) { return b.id === bookId; });
10404-    if (!book) return;
10405-
10406-    if (book.category === 'imported' || bookId.indexOf('custom_') === 0) {
10407-      // Open imported PDF from memory or IndexedDB
10408-      if (libState.blobUrls[bookId]) {
10409-        openPdfInReader(libState.blobUrls[bookId], book.title);
10410-      } else {
10411-        retrievePdfBlob(bookId).then(function(blob) {
10412-          if (blob) {
10413-            var url = URL.createObjectURL(blob);
10414-            libState.blobUrls[bookId] = url;
10415-            openPdfInReader(url, book.title);
10416-          } else {
10417-            showToast('PDF فائل لوڈ کی جارہی ہے: ' + book.title);
10418-            openPdfInReader('about:blank', book.title);
10419-          }
10420-        });
10421-      }
10422-      return;
10423-    }
10424-
10425-    if (bookId === 'arbain_nawawi') {
10426-      showTab('hadith');
10427-      initHadith();
10428-    } else if (bookId === 'hisn_muslim' || bookId === 'subah_sham_azkar') {
10429-      showTab('duas');
10430-      initDuasLibrary();
10431-    } else if (bookId === 'quran_tajweed') {
10432-      showTab('quran');
10433-      initQuran();
10434-    } else {
10435-      showToast('مطالعہ کتاب: ' + book.title);
10436-    }
10437-  }
10438-  window.initLibrary = initLibrary;
10439-  window.openLibraryBook = openLibraryBook;
10440-
10441-  // ================= 2. DUA MODULE (40 MASNOON DUAS SLIDING CAROUSEL) =================
10442-  var duaCarouselState = {
10443-    currentIndex: 0,
10444-    filteredItems: (typeof MASNOON_40_DUAS !== 'undefined' ? MASNOON_40_DUAS.slice() : []),
10445-    activeCategory: 'all'
10446-  };
10447-
10448-  function initDuasLibrary() {
10449-    if (typeof MASNOON_40_DUAS !== 'undefined' && (!duaCarouselState.filteredItems || !duaCarouselState.filteredItems.length)) {
10450-      duaCarouselState.filteredItems = MASNOON_40_DUAS.slice();
10451-    }
10452-    renderDuaCategoryFilters();
10453-    renderDuasCarousel();
10454-    setupDuaGestures();
10455-  }
10456-
10457-  function renderDuaCategoryFilters() {
10458-    var filterWrap = document.getElementById('duasCategoryFilters');
10459-    if (!filterWrap) return;
10460-    var categories = [
10461-      { id: 'all', label: 'تمام دعائیں (40)' },
10462-      { id: 'صبح و شام', label: 'صبح و شام' },
10463-      { id: 'روزمرہ', label: 'روزمرہ' },
10464-      { id: 'نماز و وضو', label: 'نماز و وضو' },
10465-      { id: 'کھانا و پینا', label: 'کھانا پینا' },
10466-      { id: 'سفر و سواری', label: 'سفر' },
10467-      { id: 'پریشانی و حفاظت', label: 'حفاظت و استعاذہ' },
10468-      { id: 'استغفار و توبہ', label: 'استغفار' },
10469-      { id: 'قرآنی دعائیں', label: 'قرآنی دعائیں' }
10470-    ];
10471-
10472-    filterWrap.innerHTML = categories.map(function(c) {
10473-      var isAct = (c.id === duaCarouselState.activeCategory);
10474-      return '<button type="button" class="duas-filter-pill ' + (isAct ? 'active' : '') + '" data-duacat="' + c.id + '">' + c.label + '</button>';
10475-    }).join('');
10476-
10477-    Array.prototype.forEach.call(filterWrap.querySelectorAll('.duas-filter-pill'), function(btn) {
10478-      btn.addEventListener('click', function() {
10479-        duaCarouselState.activeCategory = btn.getAttribute('data-duacat');
10480-        duaCarouselState.currentIndex = 0;
10481-        filterDuas();
10482-        renderDuaCategoryFilters();
10483-      });
10484-    });
10485-
10486-    var search = document.getElementById('duasSearch');
10487-    if (search && !search.dataset.bound) {
10488-      search.dataset.bound = '1';
10489-      search.addEventListener('input', function() {
10490-        filterDuas();
10491-      });
10492-    }
10493-  }
10494-
10495-  function filterDuas() {
10496-    var search = document.getElementById('duasSearch');
10497-    var query = (search ? search.value : '').toLowerCase().trim();
10498-    var cat = duaCarouselState.activeCategory;
10499-
10500-    duaCarouselState.filteredItems = MASNOON_40_DUAS.filter(function(d) {
10501-      var matchCat = (cat === 'all' || d.category === cat);
10502-      if (!matchCat) return false;
10503-      if (!query) return true;
10504-      var blob = [d.titleUr, d.titleEn, d.arabic, d.transliteration, d.urdu, d.translation, d.source, d.category].join(' ').toLowerCase();
10505-      return blob.indexOf(query) >= 0;
10506-    });
10507-
10508-    duaCarouselState.currentIndex = 0;
10509-    renderDuasCarousel();
10510-  }
10511-
10512-  function renderDuasCarousel() {
10513-    var container = document.getElementById('duasContainer');
10514-    if (!container) return;
10515-
10516-    var items = duaCarouselState.filteredItems;
10517-    if (!items.length) {
10518-      container.innerHTML = '<div style="text-align:center;padding:40px 10px;color:#d1beac;">کوئی دعا نہیں ملی۔ (No Duas found)</div>';
10519-      return;
10520-    }
10521-
10522-    var total = items.length;
10523-    var idx = Math.min(Math.max(duaCarouselState.currentIndex, 0), total - 1);
10524-    duaCarouselState.currentIndex = idx;
10525-    var d = items[idx];
10526-
10527-    var cardHtml = '<div class="dua-white-card" id="duaCardActive">' +
10528-        '<div class="dua-card-top">' +
10529-          '<span class="dua-badge-index">دعا ' + (d.id) + ' از 40</span>' +
10530-          '<span class="dua-badge-cat">' + escapeHtml(d.category) + '</span>' +
10531-          '<button type="button" class="dua-card-copy" onclick="copyDuaText(' + d.id + ')">' +
10532-            '📋 کاپی (Copy)' +
10533-          '</button>' +
10534-        '</div>' +
10535-        '<div class="dua-card-title-ur">' + escapeHtml(d.titleUr) + '</div>' +
10536-        '<div class="dua-card-title-en">' + escapeHtml(d.titleEn) + '</div>' +
10537-        '<div class="dua-arabic-box">' +
10538-          '<p class="dua-card-arabic">' + escapeHtml(d.arabic) + '</p>' +
10539-        '</div>' +
10540-        '<div class="dua-card-translit">' + escapeHtml(d.transliteration) + '</div>' +
10541-        '<div class="dua-card-urdu-trans">' + escapeHtml(d.urdu) + '</div>' +
10542-        '<div class="dua-card-en-trans">' + escapeHtml(d.translation) + '</div>' +
10543-        '<div class="dua-card-source">حوالہ: ' + escapeHtml(d.source) + '</div>' +
10544-      '</div>';
10545-
10546-    var navHtml = '<div class="duas-nav-bar">' +
10547-      '<button type="button" class="duas-nav-btn" id="duaPrevBtn" title="Previous Dua">‹</button>' +
10548-      '<div class="duas-nav-counter" id="duaCounterText">دعا ' + (idx + 1) + ' از ' + total + '</div>' +
10549-      '<button type="button" class="duas-nav-btn" id="duaNextBtn" title="Next Dua">›</button>' +
10550-    '</div>';
10551-
10552-    container.innerHTML = cardHtml + navHtml;
10553-
10554-    var prev = document.getElementById('duaPrevBtn');
10555-    var next = document.getElementById('duaNextBtn');
10556-    if (prev) {
10557-      prev.addEventListener('click', function() {
10558-        if (duaCarouselState.currentIndex > 0) {
10559-          duaCarouselState.currentIndex--;
10560-        } else {
10561-          duaCarouselState.currentIndex = duaCarouselState.filteredItems.length - 1;
10562-        }
10563-        renderDuasCarousel();
10564-      });
10565-    }
10566-    if (next) {
10567-      next.addEventListener('click', function() {
10568-        if (duaCarouselState.currentIndex < duaCarouselState.filteredItems.length - 1) {
10569-          duaCarouselState.currentIndex++;
10570-        } else {
10571-          duaCarouselState.currentIndex = 0;
10572-        }
10573-        renderDuasCarousel();
10574-      });
10575-    }
10576-  }
10577-
10578-  function setupDuaGestures() {
10579-    var container = document.getElementById('duasContainer');
10580-    if (!container || container.dataset.touchBound) return;
10581-    container.dataset.touchBound = '1';
10582-
10583-    var touchStartX = 0;
--
11922:<script>
11923-/* ================= SERVER-BASED PRAYER WEB PUSH =================
11924-   Browser -> Push subscription -> PHP server -> Push service -> Service Worker.
11925-   The server cron is responsible for the prayer-time schedule, so the page does
11926-   not need to stay open for reminders.
11927-*/
11928-(function(){
11929-  var STORAGE='salah_prayer_notifications_v3';
11930-  var PRAYER_KEYS=['fajr','dhuhr','asr','maghrib','isha'];
11931-  var SPECIAL_DEFAULTS={sunrise:true,makruhStart:true,makruhEnd:true};
11932-  var PRAYER_UR={fajr:'فجر',dhuhr:'ظہر',asr:'عصر',maghrib:'مغرب',isha:'عشاء'};
11933-  var PRAYER_EN={fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
11934-  var state=loadState(), els={}, serverConfig=null, syncing=false;
11935-  function inArrayLead(v){v=Number(v);return v===0||v===5||v===10||v===15?v:0;}
11936-  function loadState(){var d={enabled:false,lead:0,prayers:{fajr:'adhan',dhuhr:'adhan',asr:'adhan',maghrib:'adhan',isha:'adhan'},special:{sunrise:'off',makruhStart:'off',makruhEnd:'off'},dawah:{morning:false,maghrib:false,sleep:false},serverId:'',serverToken:''};try{var x=JSON.parse(localStorage.getItem(STORAGE)||'null');if(x){d.enabled=!!x.enabled;d.lead=inArrayLead(x.lead)?x.lead:0;PRAYER_KEYS.forEach(function(k){var v=x.prayers&&x.prayers[k]!==undefined?x.prayers[k]:'adhan';d.prayers[k]=(v===true)?'adhan':(v===false?'off':v);});var ss=x.special||{};var sr=ss.sunrise!==undefined?ss.sunrise:'off';var m1=ss.makruhStart!==undefined?ss.makruhStart:(ss.makruh!==undefined?ss.makruh:'off');var m2=ss.makruhEnd!==undefined?ss.makruhEnd:(ss.makruh!==undefined?ss.makruh:'off');d.special.sunrise=(sr===true)?'adhan':(sr===false?'off':sr);d.special.makruhStart=(m1===true)?'silent':(m1===false?'off':m1);d.special.makruhEnd=(m2===true)?'silent':(m2===false?'off':m2);var dw=x.dawah||{};d.dawah.morning=!!dw.morning;d.dawah.maghrib=!!dw.maghrib;d.dawah.sleep=!!dw.sleep;d.serverId=x.serverId||'';d.serverToken=x.serverToken||'';}}catch(e){}return d;}
11937-  function saveState(){
11938-    try{
11939-      localStorage.setItem(STORAGE,JSON.stringify(state));
11940-      if(isNativeBridge() && window.__syncNativePrayerNotifications){
11941-        window.__syncNativePrayerNotifications(state);
11942-      }
11943-    }catch(e){}
11944-  }
11945-  function isEnglish(){return document.documentElement.getAttribute('lang')==='en';}
11946-  function txt(ur,en){return isEnglish()?en:ur;}
11947-  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
11948-  function icon(key){var icons={fajr:'<path d="M12 3v3M4.2 11H2m20 0h-2.2M5.6 5.6l1.6 1.6m9.6-1.6-1.6 1.6M4 19h16M7 15a5 5 0 0 1 10 0"/>',dhuhr:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.2 12h-2M21.8 12h-2M5.9 5.9l1.4 1.4M16.7 16.7l1.4 1.4M5.9 18.1l1.4-1.4M16.7 7.3l1.4-1.4"/>',asr:'<circle cx="12" cy="15" r="4"/><path d="M12 3v2.2M4.5 8.5l1.5 1.5M19.5 8.5 18 10M2.5 15h2M19.5 15h2"/>',maghrib:'<path d="M4 17h16M6 17a6 6 0 0 1 12 0M9 6l3-3 3 3M12 3v9"/>',isha:'<path d="M18 12.5A7 7 0 1 1 11.5 6 5.4 5.4 0 0 0 18 12.5Z"/>',sunrise:'<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 4v4M5.6 7.6l1.8 1.8M18.4 7.6l-1.8 1.8M2.5 13h2M19.5 13h2"/>',makruhStart:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',makruhEnd:'<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.3 2.3 4.7-5"/>', morning:'<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>', sleep:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(icons[key]||'')+'</svg>';}
11949-  function to12(h,m){var ap=h<12?'AM':'PM',hh=h%12||12;return hh+':'+(m<10?'0':'')+m+' '+ap;}
11950-  function pad2(n){n=Number(n)||0;return n<10?'0'+n:''+n;}
11951-
11952-  function padTime(h,m){
11953-    h=Number(h)||0; m=Number(m)||0;
11954-    return {h:h,m:m};
11955-  }
11956-  function makeDateAt(base,h,m){
11957-    var d=new Date(base.getFullYear(),base.getMonth(),base.getDate(),Number(h)||0,Number(m)||0,0,0);
11958-    return d;
11959-  }
11960-  function parseMakruhDuration(panel){
11961-    if(!panel) return null;
11962-    var boxes=panel.querySelectorAll('.note-box[data-nb-tpl="t5"]');
11963-    if(!boxes || boxes.length<2) return null;
11964-    function duration(box){
11965-      var txt=box.textContent||'';
11966-      var m=txt.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/);
11967-      if(!m) return null;
11968-      return Number(m[1])*60+Number(m[2]);
11969-    }
11970-    var sunriseSec=duration(boxes[0]), sunsetSec=duration(boxes[1]);
11971-    if(sunriseSec==null || sunsetSec==null) return null;
11972-    return {sunriseSeconds:sunriseSec,sunsetSeconds:sunsetSec};
11973-  }
11974-  function todayRow(){
11975-    var d=new Date(), midx=d.getMonth(), day=d.getDate();
11976-    var months=window.__SALAH_MONTHS;
11977-    var order=window.__SALAH_MONTH_ORDER;
11978-    var days=months && order ? months[order[midx]] : null;
11979-    if(!days || !days[day-1]) return null;
11980-    return {row:days[day-1],midx:midx,day:day,date:d,location:false};
11981-  }
11982-
11983-  function exactSpecialTimes(date){
11984-    date=date||new Date();
11985-    var info=todayRow();
11986-    if(!info) return null;
11987-    var panel=document.getElementById('panel-cm'+info.midx);
11988-    var dur=parseMakruhDuration(panel);
11989-    if(!dur) return null;
11990-    var times=todayTimes(date);
11991-    if(!times) return null;
11992-    var sunrise=makeDateAt(date, times.fajr[0], times.fajr[1]); // overwritten below from calendar row
11993-    var row=info.row;
11994-    sunrise=makeDateAt(date,row[2],row[3]);
11995-    var sunset=makeDateAt(date,row[8]+12,row[9]);
11996-    return {
11997-      sunrise:{start:sunrise,end:new Date(sunrise.getTime()+dur.sunriseSeconds*1000)},
11998-      // Sunset/Ghuroob Makruh is BEFORE sunset: [sunset - duration, sunset].
11999-      sunset:{start:new Date(sunset.getTime()-dur.sunsetSeconds*1000),end:sunset}
12000-    };
12001-  }
12002-  function specialNotificationPayload(){
12003-    var date=new Date();
12004-    var specialTimes=exactSpecialTimes(date);
12005-    return {
12006-      sunrise:!!state.special.sunrise,
12007-      makruhStart:!!state.special.makruhStart,
12008-      makruhEnd:!!state.special.makruhEnd,
12009-      prayerMessages:{
12010-        fajr:{ur:'فجر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔',en:'Fajr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.'},
12011-        dhuhr:{ur:'ظہر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔',en:'Dhuhr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.'},
12012-        asr:{ur:'عصر کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔',en:'Asr time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.'},
12013-        maghrib:{ur:'مغرب کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔',en:'Maghrib time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.'},
12014-        isha:{ur:'عشاء کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔',en:'Isha time has entered. Prepare for prayer; prayer can be a means of relief from your difficulties.'}
12015-      },
12016-      sunriseMessage:{ur:'سورج طلوع ہوگیا۔',en:'The sun has risen.'},
12017-      makruhStartMessage:{ur:'یہ وقت مکروہ ہے۔',en:'This is a Makruh time.'},
12018-      makruhEndMessage:{ur:'اب مکروہ وقت ختم ہوا۔',en:'The Makruh time has ended.'},
12019-      exact:{
12020-        date:date.getFullYear()+'-'+pad2(date.getMonth()+1)+'-'+pad2(date.getDate()),
12021-        sunrise:specialTimes?{start:specialTimes.sunrise.start.toISOString(),end:specialTimes.sunrise.end.toISOString()}:null,
12022-        sunset:specialTimes?{start:specialTimes.sunset.start.toISOString(),end:specialTimes.sunset.end.toISOString()}:null
12023-      }
12024-    };
12025-  }
12026-
12027-  function todayTimes(date){
12028-    date=date||new Date();
12029-    var monthNames=['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'];
12030-    var months=window.__SALAH_MONTHS;
12031-    var days=months ? months[monthNames[date.getMonth()]] : null;
12032-    var row=days&&days[date.getDate()-1];
12033-    if(!row)return null;
12034-    return {fajr:[row[0],row[1]],dhuhr:[row[4],row[5]],asr:[row[6]+12,row[7]],maghrib:[row[8]+12,row[9]],isha:[row[10]+12,row[11]]};
12035-  }
12036-
12037-  function isNativeBridge(){ return !!(window.isNativeApp || window.__QURB_NATIVE__ || window.QurbBridge); }
12038-
12039-  window.__syncNativePrayerNotifications = function(prefState) {
12040-    if(!isNativeBridge() || !window.QurbBridge) return;
12041-    var s = prefState || state;
12042-    if(!s) return;
12043-
12044-    try {
12045-      window.QurbBridge.postMessage(JSON.stringify({
12046-        action: 'saveNotificationPreferences',
12047-        preferences: s
12048-      }));
12049-    } catch(e) {}
12050-
12051-    if(!s.enabled){
12052-      try {
12053-        window.QurbBridge.postMessage(JSON.stringify({ action: 'cancelAllNotifications' }));
12054-      } catch(e) {}
12055-      return;
12056-    }
12057-
12058-    try {
12059-      var monthNames=['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'];
12060-      var months=window.__SALAH_MONTHS;
12061-      if(!months) return;
12062-
12063-      var prayerNamesUr={fajr:'فجر',dhuhr:'ظہر',asr:'عصر',maghrib:'مغرب',isha:'عشاء'};
12064-      var prayerNamesEn={fajr:'Fajr',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'};
12065-      var en=isEnglish();
12066-
12067-      var batch=[];
12068-      var now=new Date();
12069-
12070-      for(var dayOffset=0; dayOffset<7; dayOffset++){
12071-        var targetDate=new Date(now.getFullYear(),now.getMonth(),now.getDate()+dayOffset);
12072-        var midx=targetDate.getMonth();
12073-        var dayNum=targetDate.getDate();
12074-        var mName=monthNames[midx];
12075-        var mDays=months[mName];
12076-        if(!mDays||!mDays[dayNum-1]) continue;
12077-        var row=mDays[dayNum-1];
12078-
12079-        var prayers={
12080-          fajr:[row[0],row[1]],
12081-          dhuhr:[row[4],row[5]],
12082-          asr:[row[6]+12,row[7]],
12083-          maghrib:[row[8]+12,row[9]],
12084-          isha:[row[10]+12,row[11]]
12085-        };
12086-
12087-        var baseId=(midx*1000 + dayNum*20);
12088-
12089-        // 5 Daily Farz Prayers strictly on 'prayer_azan_channel' (Azan Sound)
12090-        var pKeys=['fajr','dhuhr','asr','maghrib','isha'];
12091-        for(var i=0; i<pKeys.length; i++){
12092-          var pKey=pKeys[i];
12093-          var val = (s.prayers && s.prayers[pKey] !== undefined) ? s.prayers[pKey] : 'adhan';
12094-          if(val === false || val === 'off') continue;
12095-
12096-          var pHour=prayers[pKey][0];
12097-          var pMin=prayers[pKey][1];
12098-          var pDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),pHour,pMin,0,0);
12099-
12100-          if(pDate.getTime()<=(now.getTime()+10000)) continue;
12101-
12102-          var pTitle=en?(prayerNamesEn[pKey]+' Prayer Time'):('نمازِ '+prayerNamesUr[pKey]+' کا وقت');
12103-          var pBody=en
12104-            ?(prayerNamesEn[pKey]+' time has entered. Prepare for prayer.')
12105-            :(prayerNamesUr[pKey]+' کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔');
12106-
12107-          var cId = 'prayer_azan_channel';
12108-          if(val === 'beep') cId = 'qurb_prayer_channel';
12109-          else if(val === 'silent') cId = 'prayer_silent_channel';
12110-
12111-          batch.push({
12112-            id: baseId+(i+1),
12113-            title: pTitle,
12114-            body: pBody,
12115-            time: pDate.toISOString(),
12116-            channelId: cId,
12117-            isPrayer: true
12118-          });
12119-        }
12120-
12121-        // Sunrise Reminder
12122-        var vSun = s.special ? s.special.sunrise : 'beep';
12123-        if(vSun !== false && vSun !== 'off'){
12124-          var sHour=row[2];
12125-          var sMin=row[3];
12126-          var sDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),sHour,sMin,0,0);
12127-          if(sDate.getTime()>(now.getTime()+10000)){
12128-            var cId = 'qurb_prayer_channel';
12129-            if(vSun === 'adhan') cId = 'prayer_azan_channel';
12130-            else if(vSun === 'silent') cId = 'prayer_silent_channel';
12131-            batch.push({
12132-              id: baseId+7,
12133-              title: en?'Sunrise':'طلوعِ شمس',
12134-              body: en?'The sun has risen. Fajr prayer time has ended.':'سورج طلوع ہوگیا، نمازِ فجر کا وقت ختم ہوا۔',
12135-              time: sDate.toISOString(),
12136-              channelId: cId,
12137-              isPrayer: false
12138-            });
12139-          }
12140-        }
12141-        
12142-        // Makruh Start Reminder
12143-        var vMakruhStart = s.special ? s.special.makruhStart : 'beep';
12144-        if (vMakruhStart !== false && vMakruhStart !== 'off') {
12145-            try {
12146-                var sTimes = exactSpecialTimes(targetDate);
12147-                if (sTimes && sTimes.sunrise && sTimes.sunrise.start) {
12148-                    if (sTimes.sunrise.start.getTime() > (now.getTime() + 10000)) {
12149-                        var cIdStart = 'qurb_prayer_channel';
12150-                        if (vMakruhStart === 'adhan') cIdStart = 'prayer_azan_channel';
12151-                        else if (vMakruhStart === 'silent') cIdStart = 'prayer_silent_channel';
12152-                        batch.push({
12153-                            id: baseId+8,
12154-                            title: en ? 'Makruh Time Start' : 'مکروہ وقت شروع',
12155-                            body: en ? 'Morning Makruh period has begun.' : 'صبح کا مکروہ وقت شروع ہوگیا۔',
12156-                            time: sTimes.sunrise.start.toISOString(),
12157-                            channelId: cIdStart,
12158-                            isPrayer: false
12159-                        });
12160-                    }
12161-                }
12162-            } catch(e) {}
12163-        }
12164-
12165-        // Makruh End Reminder
12166-        var vMakruhEnd = s.special ? s.special.makruhEnd : 'beep';
12167-        if (vMakruhEnd !== false && vMakruhEnd !== 'off') {
12168-            try {
12169-                var sTimesEnd = exactSpecialTimes(targetDate);
12170-                if (sTimesEnd && sTimesEnd.sunrise && sTimesEnd.sunrise.end) {
12171-                    if (sTimesEnd.sunrise.end.getTime() > (now.getTime() + 10000)) {
12172-                        var cIdEnd = 'qurb_prayer_channel';
12173-                        if (vMakruhEnd === 'adhan') cIdEnd = 'prayer_azan_channel';
12174-                        else if (vMakruhEnd === 'silent') cIdEnd = 'prayer_silent_channel';
12175-                        batch.push({
12176-                            id: baseId+9,
12177-                            title: en ? 'Makruh Time End' : 'مکروہ وقت ختم',
12178-                            body: en ? 'Morning Makruh period has ended.' : 'صبح کا مکروہ وقت ختم ہوگیا۔',
12179-                            time: sTimesEnd.sunrise.end.toISOString(),
12180-                            channelId: cIdEnd,
12181-                            isPrayer: false
12182-                        });
12183-                    }
12184-                }
12185-            } catch(e) {}
12186-        }
12187-        
12188-        var dMorn = s.dawah ? s.dawah.morning : false;
12189-        if(dMorn) {
12190-          var pFajrDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.fajr[0],prayers.fajr[1],0,0);
12191-          if(pFajrDate.getTime() > now.getTime() + 10000) {
12192-            batch.push({
12193-              id: baseId+11,
12194-              title: en ? 'A New Blessing' : 'آج کا دن ایک نیا موقع',
12195-              body: en ? 'Today is a new blessing from Allah, and could be the last. Spend it in His obedience and pray on time.' : 'آج کا دن اللہ کا دیا نیا موقع ہے، شاید یہ زندگی کا آخری دن ہو۔ اپنا دن اللہ کی اطاعت اور نمازوں کی پابندی میں گزاریں۔',
12196-              time: pFajrDate.toISOString(),
12197-              channelId: 'qurb_adhkar_channel',
12198-              isPrayer: false
12199-            });
12200-          }
12201-        }
12202-        
12203-        var dMaghrib = s.dawah ? s.dawah.maghrib : false;
12204-        if(dMaghrib) {
12205-          var pMaghribDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.maghrib[0],prayers.maghrib[1],0,0);
12206-          pMaghribDate = new Date(pMaghribDate.getTime() + 15 * 60000);
12207-          if(pMaghribDate.getTime() > now.getTime() + 10000) {
12208-            batch.push({
12209-              id: baseId+12,
12210-              title: en ? 'Daily Adhkar & Surahs' : 'درود شریف اور مسنون سورتیں',
12211-              body: en ? 'Did you send Salawat today? Remember to recite Surah As-Sajdah, Surah Al-Waqi'ah, and Surah Al-Mulk.' : 'کیا آج آپ نے درود شریف پڑھا ہے؟ سورۃ السجدہ، سورۃ الواقعہ اور سورۃ الملک پڑھنا نہ بھولیں۔',
12212-              time: pMaghribDate.toISOString(),
12213-              channelId: 'qurb_adhkar_channel',
12214-              isPrayer: false
12215-            });
12216-          }
12217-        }
12218-        
12219-        var dSleep = s.dawah ? s.dawah.sleep : false;
12220-        if(dSleep) {
12221-          var pIshaDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.isha[0],prayers.isha[1],0,0);
12222-          pIshaDate = new Date(pIshaDate.getTime() + 60 * 60000);
12223-          if(pIshaDate.getTime() > now.getTime() + 10000) {
12224-            batch.push({
12225-              id: baseId+13,
12226-              title: en ? 'Sunnah of Early Sleep' : 'سنتِ نبوی پر عمل',
12227-              body: en ? 'Complete your daily adhkar and sleep early. Sleeping early after Isha is a Sunnah.' : 'اپنے معمولات اور وظائف مکمل کر کے جلدی سو جائیں۔ عشاء کے بعد جلدی سونا سنت ہے۔',
12228-              time: pIshaDate.toISOString(),
12229-              channelId: 'qurb_adhkar_channel',
12230-              isPrayer: false
12231-            });
12232-          }
12233-        }
12234-      }
12235-
12236-      if(batch.length>0){
12237-        window.QurbBridge.postMessage(JSON.stringify({
12238-          action: 'schedulePrayerBatch',
12239-          items: batch
12240-        }));
12241-      }
12242-    }catch(e){
12243-      console.error('Error generating native prayer schedule:', e);
12244-    }
12245-  };
12246-
12247-  function permissionText(){
12248-    if(isNativeBridge()) return isEnglish() ? 'Native Android prayer notifications are active.' : 'اینڈرائیڈ نوٹیفیکیشنز مکمل فعال ہیں۔';
12249-    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return 'Notifications are not supported in this browser.';
12250-    if(window.Notification.permission==='granted') return 'Notifications are allowed. Server push subscription is ready.';
12251-    if(window.Notification.permission==='denied') return 'Notifications are blocked. Allow them in your browser/site settings.';
12252-    return 'Notifications are off. Allow them to receive server reminders.';
12253-  }
12254-  function permissionClass(){
12255-    if(isNativeBridge()) return 'ok';
12256-    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification || window.Notification.permission==='denied') return 'bad';
12257-    if(window.Notification.permission==='granted') return 'ok';
12258-    return 'warn';
12259-  }
12260-  function permissionButtonText(){
12261-    var en=isEnglish();
12262-    if(isNativeBridge()) return state.enabled ? (en?'Notifications Active':'اطلاعات فعال ہیں') : (en?'Enable Notifications':'اطلاعات آن کریں');
12263-    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return en?'Not Supported':'Supported نہیں';
12264-    if(window.Notification.permission==='granted') return en?'Notifications Enabled':'اجازت فعال ہے';
12265-    if(window.Notification.permission==='denied') return en?'Open Browser Settings':'Browser settings کھولیں';
12266-    return en?'Allow Notifications':'Notifications اجازت دیں';
12267-  }
12268-  function enablePush(){
12269-    if(isNativeBridge()){
12270-      state.enabled = true;
12271-      saveState();
12272-      if(window.__syncNativePrayerNotifications){
12273-        window.__syncNativePrayerNotifications(state);
12274-      }
12275-      if(window.QurbBridge){
12276-        window.QurbBridge.postMessage(JSON.stringify({
12277-          action: 'testNotification',
12278-          title: 'Qurb Prayer Times',
12279-          body: 'نماز کے اوقات کی نوٹیفیکیشنز کامیابی سے فعال کر دی گئی ہیں۔'
12280-        }));
12281-      }
12282-      render();
12283-      return Promise.resolve(true);
12284-    }
12285-    if(typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return Promise.reject(new Error(isEnglish()?'Notifications are not supported in this browser.':'اس browser میں notifications supported نہیں ہیں۔'));
12286-    if(window.Notification.permission==='denied') return Promise.reject(new Error(isEnglish()?'Allow notifications in your browser settings.':'Browser settings میں notifications allow کریں۔'));
12287-    var ask = window.Notification.permission==='granted' ? Promise.resolve('granted') : window.Notification.requestPermission();
12288-    return ask.then(function(p){
12289-      if(p!=='granted') throw new Error(isEnglish()?'Notification permission was not granted.':'Notifications کی اجازت نہیں ملی۔');
12290-      state.enabled=true;
12291-      saveState();
12292-      return subscribeServer();
12293-    });
12294-  }
12295-
12296-  function setServerStatus(msg, cls){
12297-    if(!els || !els.serverStatus) return;
12298-    els.serverStatus.textContent = msg || "";
12299-    els.serverStatus.className = "notification-status" + (cls ? " " + cls : "");
12300-  }
12301-
12302-  function disablePush(){
12303-    state.enabled=false;
12304-    saveState();
12305-    if(isNativeBridge()){
12306-      if(window.QurbBridge){
12307-        window.QurbBridge.postMessage(JSON.stringify({action:'cancelAllNotifications'}));
12308-      }
12309-    } else {
12310-      syncServer();
12311-    }
12312-  }
12313-
12314-  function render(){
12315-    if(!els.list)return;
12316-    var en=isEnglish();
12317-    els.title.textContent=en?'Prayer Notifications':'نماز کی اطلاعات';
12318-    els.sub.textContent=en?'Manage prayer, sunrise and Makruh notification and reminder options.':'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
12319-    els.masterTitle.textContent=en?'All Notifications':'تمام notifications';
12320-    els.masterSub.textContent=en?'Master switch for all prayer, sunrise and Makruh notifications.':'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
12321-    els.note.textContent=en?'For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.':'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔ Server push + cron کے بعد منتخب notifications app بند یا phone lock ہونے پر بھی آ سکتی ہیں۔';
12322-    els.permission.textContent=permissionText();
12323-    els.permission.className='notification-status '+permissionClass();
12324-    els.permissionBtn.textContent=permissionButtonText();
12325-    var title=document.getElementById('notifIndividualTitle');
12326-    var sub=document.getElementById('notifIndividualSub');
12327-    if(title)title.textContent=en?'Individual Notifications':'ہر notification الگ On/Off کریں';
12328-    if(sub)sub.textContent=en?'Turn each prayer, sunrise and Makruh alert on or off separately.':'فجر، ظہر، عصر، مغرب، عشاء، طلوعِ شمس، مکروہ شروع اور مکروہ ختم۔';
12329-    els.master.checked=!!state.enabled;
12330-    var panel=document.querySelector('.notification-settings');
12331-    if(panel){panel.style.direction=en?'ltr':'rtl';panel.style.textAlign=en?'left':'right';panel.setAttribute('dir',en?'ltr':'rtl');}
12332-
12333-    var times=null, special=null;
12334-    try{times=todayTimes(new Date());}catch(e){times=null;}
12335-    try{special=exactSpecialTimes(new Date());}catch(e){special=null;}
12336-    var rows=[];
12337-    PRAYER_KEYS.forEach(function(k){
12338-      var t=times?times[k]:null;
12339-      var val = state.prayers[k];
12340-      if(val === true) val = 'adhan';
12341-      if(val === false) val = 'off';
12342-      if(!val) val = 'adhan';
12343-      rows.push({kind:'prayer',key:k,name:en?PRAYER_EN[k]:PRAYER_UR[k],sub:en?'Notification when prayer time begins.':'نماز کا وقت داخل ہوتے ہی notification۔',time:t?to12(t[0],t[1]):'—',val:val});
12344-    });
12345-    var sSunrise = state.special.sunrise; if(sSunrise===true) sSunrise='beep'; if(sSunrise===false) sSunrise='off'; if(!sSunrise) sSunrise='beep';
12346-    var sMakruhS = state.special.makruhStart; if(sMakruhS===true) sMakruhS='beep'; if(sMakruhS===false) sMakruhS='off'; if(!sMakruhS) sMakruhS='beep';
12347-    var sMakruhE = state.special.makruhEnd; if(sMakruhE===true) sMakruhE='beep'; if(sMakruhE===false) sMakruhE='off'; if(!sMakruhE) sMakruhE='beep';
12348-
12349-    rows.push({kind:'special',key:'sunrise',name:en?'Sunrise': 'طلوعِ شمس',sub:en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes()):'—',val:sSunrise});
12350-    rows.push({kind:'special',key:'makruhStart',name:en?'Makruh Time Start':'مکروہ وقت شروع',sub:en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes())+' / '+to12(special.sunset.start.getHours(),special.sunset.start.getMinutes()):'—',val:sMakruhS});
12351-    rows.push({kind:'special',key:'makruhEnd',name:en?'Makruh Time End':'مکروہ وقت ختم',sub:en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔',time:special?to12(special.sunrise.end.getHours(),special.sunrise.end.getMinutes())+' / '+to12(special.sunset.end.getHours(),special.sunset.end.getMinutes()):'—',val:sMakruhE});
12352-
12353-    var dwMorn = state.dawah ? !!state.dawah.morning : false;
12354-    var dwMagh = state.dawah ? !!state.dawah.maghrib : false;
12355-    var dwSleep = state.dawah ? !!state.dawah.sleep : false;
12356-
12357-    rows.push({kind:'dawah', key:'morning', name:en?'Morning Motivation':'صبح کی نصیحت', sub:en?'Spiritual reminder at Fajr time.':'نماز فجر کے وقت روحانی یاد دہانی۔', time:times?to12(times.fajr[0],times.fajr[1]):'—', val:dwMorn});
12358-    rows.push({kind:'dawah', key:'maghrib', name:en?'Post-Maghrib Adhkar':'مغرب کے بعد وظائف', sub:en?'Surah and Salawat reminder 15 mins after Maghrib.':'مغرب کے 15 منٹ بعد درود شریف اور مسنون سورتیں۔', time:'+15 mins', val:dwMagh});
12359-    rows.push({kind:'dawah', key:'sleep', name:en?'Sunnah Sleep Reminder':'عشاء کے بعد سنتِ نیند', sub:en?'Sleep reminder 60 mins after Isha.':'عشاء کے ایک گھنٹہ بعد سونے کی سنت کی یاد دہانی۔', time:'+60 mins', val:dwSleep});
12360-
12361-    els.list.innerHTML=rows.map(function(r){
12362-      var controlHtml = '';
12363-      if(r.kind === 'dawah') {
12364-         controlHtml = '<label class="notif-switch" aria-label="'+esc(r.name)+'"><input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="'+r.key+'" '+(r.val?'checked':'')+'><span class="notif-slider"></span></label>';
12365-      } else {
12366-         controlHtml = '<select class="notif-select" style="padding:6px;border-radius:6px;background:#ffffff;color:#111111;border:1px solid #ddd;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
12367-           '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
12368-           '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
12369-           '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
12370-           '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
12371-         '</select>';
12372-      }
12373-      return '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
12374-    }).join('');
12375-
12376-    els.list.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){
12377-      input.addEventListener('change',function(){
12378-        var key=input.dataset.key;
12379-        var val = (input.tagName.toLowerCase()==='select') ? input.value : input.checked;
12380-        if(input.dataset.kind==='prayer') state.prayers[key]=val;
12381-        else if(input.dataset.kind==='dawah') {
12382-            if(!state.dawah) state.dawah = {morning:false, maghrib:false, sleep:false};
12383-            state.dawah[key]=val;
12384-        }
12385-        else state.special[key]=val;
12386-        saveState();
12387-        if(isNativeBridge()){
12388-          if(window.__syncNativePrayerNotifications){
12389-            window.__syncNativePrayerNotifications(state);
12390-          }
12391-        } else {
12392-          if(state.enabled)syncServer();
12393-        }
12394-      });
12395-    });
12396-    if(isNativeBridge()){
12397-      setServerStatus(en?'Native notification active.':'اینڈرائیڈ نوٹیفیکیشنز فعال ہیں۔','ok');
12398-    } else if(state.serverId){
12399-      setServerStatus(en?'Server push connected.':'Server push connected.','ok');
12400-    } else {
12401-      setServerStatus(en?'Server push not connected yet.':'Server push is not connected yet.','');
12402-    }
12403-  }
12404-  function testNotification(){
12405-    var en=isEnglish();
12406-    if(isNativeBridge()){
12407-      if(window.QurbBridge){
12408-        window.QurbBridge.postMessage(JSON.stringify({
12409-          action: 'testNotification',
12410-          title: 'Qurb Prayer Times',
12411-          body: en ? 'Prayer notifications are active.' : 'نماز کے اوقات کی نوٹیفیکیشنز فعال ہیں۔'
12412-        }));
12413-      }
12414-      return;
12415-    }
12416-    if(!state.serverId||!state.serverToken){
12417-      enablePush().then(function(){return testNotification();}).catch(function(e){setServerStatus(e.message,'bad');});
12418-      return;
12419-    }
12420-    els.testBtn.disabled=true;
12421-    setServerStatus(en?'Sending test notification…':'Test notification بھیجی جا رہی ہے…');
12422-    api('push-test.php',{id:state.serverId,token:state.serverToken}).then(function(){
12423-      setServerStatus(en?'Test notification sent.':'Test notification بھیج دی گئی۔','ok');
12424-    }).catch(function(e){
12425-      setServerStatus(e.message,'bad');
12426-    }).finally(function(){
12427-      els.testBtn.disabled=false;
12428-    });
12429-  }
12430-  function init(){
12431-    els={title:document.getElementById('notifTitle'),sub:document.getElementById('notifSubtitle'),masterTitle:document.getElementById('notifMasterTitle'),masterSub:document.getElementById('notifMasterSub'),master:document.getElementById('notifMaster'),permission:document.getElementById('notifStatus'),permissionBtn:document.getElementById('notifPermissionBtn'),list:document.getElementById('notificationList'),note:document.getElementById('notifNote'),testBtn:document.getElementById('notifTestBtn'),serverStatus:document.getElementById('notifServerStatus')};
12432-    if(!els.master)return;
12433-    els.master.addEventListener('change',function(){if(els.master.checked){enablePush().then(render).catch(function(e){state.enabled=false;saveState();render();setServerStatus(e.message,'bad');});}else{disablePush();render();}});
12434-    els.permissionBtn.addEventListener('click',function(){enablePush().then(render).catch(function(e){setServerStatus(e.message,'bad');render();});});
12435-    els.testBtn.addEventListener('click',testNotification);
12436-    var langBtn=document.getElementById('langToggle');if(langBtn)langBtn.addEventListener('click',function(){setTimeout(render,50);});
12437-    render();
12438-    if(isNativeBridge()){
12439-      if(state.enabled && window.__syncNativePrayerNotifications){
12440-        window.__syncNativePrayerNotifications(state);
12441-      }
12442-    } else {
12443-      if(state.enabled && (typeof window !== 'undefined' && window.Notification && window.Notification.permission==='granted') && state.serverId){
12444-        syncServer();
12445-      }
12446-    }
12447-  }
12448-
12449-  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
12450-})();
12451-</script>
12453:<script>
12454-/* ================= SETTINGS MENU / ACCORDION JS ================= */
12455-  (function(){
12456-    function wireMenu(buttonId, itemId){
12457-      var btn=document.getElementById(buttonId), item=document.getElementById(itemId);
12458-      if(!btn || !item) return;
12459-      btn.addEventListener('click',function(){
12460-        var open=item.classList.toggle('open');
12461-        btn.setAttribute('aria-expanded',open?'true':'false');
12462-      });
12463-    }
12464-    wireMenu('settingsNotificationsBtn','settingsMenuNotifications');
12465-    wireMenu('settingsUpdateBtn','settingsMenuUpdate');
12466-  })();
12467-</script>
12469:<script>
12470-(function(){
12471-  var shareBtn = document.getElementById('shareAppBtn');
12472-  if (!shareBtn) return;
12473-
12474-  shareBtn.addEventListener('click', async function(){
12475-    var shareUrl = 'https://muftimaazharoon.com/qurb/';
12476-    var shareData = {
12477-      title: 'Qurb — Mufti Maaz Haroon',
12478-      text: 'Qurb — Swat Prayer Times & Islamic Guide',
12479-      url: shareUrl
12480-    };
12481-
12482-    try {
12483-      if (navigator.share) {
12484-        await navigator.share(shareData);
12485-      } else if (navigator.clipboard && navigator.clipboard.writeText) {
12486-        await navigator.clipboard.writeText(shareUrl);
12487-        showToast(document.documentElement.getAttribute('lang')==='en' ? 'App link copied' : 'ایپ لنک کاپی ہوگیا');
12488-      } else {
12489-        window.prompt('Copy this app link:', shareUrl);
12490-      }
12491-    } catch(e) {
12492-      // User cancelled the native share sheet — do nothing.
12493-    }
12494-  });
12495-})();
12496-</script>
12663:<script>
12664-/* ================= GOOGLE STITCH NOTIFICATION ONBOARDING CONTROLLER ================= */
12665-(function(){
12666-  var ONBOARDING_KEY = 'qurb_onboarding_seen_v1';
12667-  var NOTIF_STORAGE = 'salah_prayer_notifications_v3';
12668-  var overlay = document.getElementById('onboardingOverlay');
12669-  var track = document.getElementById('stitchSliderTrack');
12670-  var continueBtn = document.getElementById('stitchContinueBtn');
12671-  var backBtn = document.getElementById('stitchBackBtn');
12672-  var getStartedBtn = document.getElementById('stitchGetStartedBtn');
12673-
12674-  if (!overlay) return;
12675-
12676-  function isSeen() {
12677-    try { return localStorage.getItem(ONBOARDING_KEY) === '1'; } catch(e) { return false; }
12678-  }
12679-
12680-  function markSeen() {
12681-    try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch(e) {}
12682-    overlay.classList.remove('show');
12683-  }
12684-
12685-  // Load existing notification state into toggles
12686-  function initTogglesFromState() {
12687-    try {
12688-      var raw = localStorage.getItem(NOTIF_STORAGE);
12689-      if (raw) {
12690-        var state = JSON.parse(raw);
12691-        if (state && state.prayers) {
12692-          if (document.getElementById('toggle-fajr')) document.getElementById('toggle-fajr').checked = state.prayers.fajr !== false;
12693-          if (document.getElementById('toggle-zuhr')) document.getElementById('toggle-zuhr').checked = state.prayers.dhuhr !== false;
12694-          if (document.getElementById('toggle-asr')) document.getElementById('toggle-asr').checked = state.prayers.asr !== false;
12695-          if (document.getElementById('toggle-maghrib')) document.getElementById('toggle-maghrib').checked = state.prayers.maghrib !== false;
12696-          if (document.getElementById('toggle-isha')) document.getElementById('toggle-isha').checked = state.prayers.isha !== false;
12697-        }
12698-        if (state && state.special) {
12699-          if (document.getElementById('toggle-sunrise')) document.getElementById('toggle-sunrise').checked = state.special.sunrise !== false;
12700-          if (document.getElementById('toggle-sunset')) document.getElementById('toggle-sunset').checked = state.special.sunset !== false;
12701-          if (document.getElementById('toggle-makrooh-start')) document.getElementById('toggle-makrooh-start').checked = state.special.makruhStart !== false;
12702-          if (document.getElementById('toggle-makrooh-end')) document.getElementById('toggle-makrooh-end').checked = state.special.makruhEnd !== false;
12703-        }
12704-      }
12705-    } catch(e) {
12706-      console.error('Error loading notification state into onboarding:', e);
12707-    }
12708-  }
12709-
12710-  // Save selected toggles to existing salah_prayer_notifications_v3 storage
12711-  function saveNotificationPreferences() {
12712-    try {
12713-      var fajrVal = document.getElementById('toggle-fajr') ? document.getElementById('toggle-fajr').checked : true;
12714-      var zuhrVal = document.getElementById('toggle-zuhr') ? document.getElementById('toggle-zuhr').checked : true;
12715-      var asrVal = document.getElementById('toggle-asr') ? document.getElementById('toggle-asr').checked : true;
12716-      var maghribVal = document.getElementById('toggle-maghrib') ? document.getElementById('toggle-maghrib').checked : true;
12717-      var ishaVal = document.getElementById('toggle-isha') ? document.getElementById('toggle-isha').checked : true;
12718-
12719-      var sunriseVal = document.getElementById('toggle-sunrise') ? document.getElementById('toggle-sunrise').checked : true;
12720-      var sunsetVal = document.getElementById('toggle-sunset') ? document.getElementById('toggle-sunset').checked : true;
12721-      var makroohStartVal = document.getElementById('toggle-makrooh-start') ? document.getElementById('toggle-makrooh-start').checked : true;
12722-      var makroohEndVal = document.getElementById('toggle-makrooh-end') ? document.getElementById('toggle-makrooh-end').checked : true;
12723-
12724-      var existingState = {
12725-        enabled: true,
12726-        lead: 0,
12727-        prayers: {
12728-          fajr: fajrVal,
12729-          dhuhr: zuhrVal,
12730-          asr: asrVal,
12731-          maghrib: maghribVal,
12732-          isha: ishaVal
12733-        },
12734-        special: {
12735-          sunrise: sunriseVal,
12736-          sunset: sunsetVal,
12737-          makruhStart: makroohStartVal,
12738-          makruhEnd: makroohEndVal
12739-        },
12740-        serverId: '',
12741-        serverToken: ''
12742-      };
12743-
12744-      try {
12745-        var prev = JSON.parse(localStorage.getItem(NOTIF_STORAGE) || 'null');
12746-        if (prev) {
12747-          existingState.serverId = prev.serverId || '';
12748-          existingState.serverToken = prev.serverToken || '';
12749-          existingState.lead = prev.lead || 0;
12750-        }
12751-      } catch(e) {}
12752-
12753-      localStorage.setItem(NOTIF_STORAGE, JSON.stringify(existingState));
12754-      console.log('Saved Stitch notification preferences to', NOTIF_STORAGE, existingState);
12755-
12756-      // Trigger native permission / schedule exact alarms immediately
12757-      if (window.__syncNativePrayerNotifications) {
12758-        window.__syncNativePrayerNotifications(existingState);
12759-      } else if (window.QurbBridge) {
12760-        window.QurbBridge.postMessage(JSON.stringify({
12761-          action: 'onboardingCompleted',
12762-          preferences: existingState
12763-        }));
12764-      }
12765-    } catch(e) {
12766-      console.error('Error saving notification preferences:', e);
12767-    }
12768-  }
12769-
12770-  function showOnboarding() {
12771-    if (isSeen()) return;
12772-    initTogglesFromState();
12773-    overlay.classList.add('show');
12774-  }
12775-
12776-  // Slide navigation
12777-  if (continueBtn && track) {
12778-    continueBtn.addEventListener('click', function() {
12779-      track.classList.add('slide-2-active');
12780-    });
12781-  }
12782-
12783-  if (backBtn && track) {
12784-    backBtn.addEventListener('click', function() {
12785-      track.classList.remove('slide-2-active');
12786-    });
12787-  }
12788-
12789-  if (getStartedBtn) {
12790-    getStartedBtn.addEventListener('click', function() {
12791-      saveNotificationPreferences();
12792-      markSeen();
12793-      showToast(typeof lang !== 'undefined' && lang === 'en' ? 'Preferences Saved' : 'ترجیحات محفوظ ہوگئیں');
12794-    });
12795-  }
12796-
12797-  // Show after initial splash transition
12798-  setTimeout(showOnboarding, 600);
12799-})();
12800-</script>

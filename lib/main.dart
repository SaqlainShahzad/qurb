import 'package:url_launcher/url_launcher.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:location/location.dart' as loc;
import 'pdf_library_screen.dart';
import 'pdf_viewer_screen.dart';
import 'package:qurb_app/services/notification_service.dart';

import 'package:firebase_messaging/firebase_messaging.dart';

import 'package:qurb_app/features/qibla/qibla_screen.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint("Handling a background message: ${message.messageId}");
}

void main() {
  runZonedGuarded(() {
    // 1. Ensure Flutter binding initialized in the exact same zone where runApp executes
    WidgetsFlutterBinding.ensureInitialized();

    // 4. Global Flutter Error handling
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      debugPrint('Global FlutterError: ${details.exception}');
    };

    ErrorWidget.builder = (FlutterErrorDetails errorDetails) {
      return Container(
        color: const Color(0xFF121623),
        alignment: Alignment.center,
        child: const CircularProgressIndicator(
          color: Color(0xFFD4AF37),
        ),
      );
    };

    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Color(0xFF121623),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
    );

    // 5. Immediately render UI
    runApp(const QurbApp());

    // Defer non-critical initializations until after the first frame renders
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initDeferredServices();
    });
  }, (error, stackTrace) {
    debugPrint('Uncaught Zone Error: $error\n$stackTrace');
  });
}

Future<void> _initDeferredServices() async {
  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp();
    }
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
    debugPrint('Firebase Core & Messaging initialized successfully.');
  } catch (e) {
    debugPrint('Firebase initialization warning: $e');
  }
}

class QurbApp extends StatelessWidget {
  const QurbApp({super.key});

  static FirebaseAnalytics? _analytics;
  static FirebaseAnalyticsObserver? _observer;

  @override
  Widget build(BuildContext context) {
    try {
      _analytics ??= FirebaseAnalytics.instance;
      _observer ??= FirebaseAnalyticsObserver(analytics: _analytics!);
    } catch (e) {
      debugPrint('Firebase Analytics instance warning: $e');
    }

    return MaterialApp(
      title: 'Qurb',
      debugShowCheckedModeBanner: false,
      navigatorObservers: _observer != null
          ? <NavigatorObserver>[_observer!]
          : const <NavigatorObserver>[],
      theme: ThemeData(
        fontFamily: 'Al Mushaf',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F0A07),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        fontFamily: 'Al Mushaf',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F0A07),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F0A07),
        useMaterial3: true,
      ),
      home: const QurbWebViewScreen(),
    );
  }
}

class QurbWebViewScreen extends StatefulWidget {
  const QurbWebViewScreen({super.key});

  @override
  State<QurbWebViewScreen> createState() => _QurbWebViewScreenState();
}

class _QurbWebViewScreenState extends State<QurbWebViewScreen> {
  WebViewController? _controller;
  bool _isOpeningQibla = false;

  @override
  void initState() {
    super.initState();
    // Request Camera & Location permissions explicitly before webview loads
    requestCameraAndLocation();

    // 1. Pre-warm WebView Controller asynchronously to not block the first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _initWebViewController();
        setState(() {}); // trigger rebuild to show webview
      }
    });

    // 2. Initialize background services asynchronously without awaiting/blocking UI
    scheduleMicrotask(() {
      _initAsyncServices();
    });
  }

  Future<void> requestCameraAndLocation() async {
    try {
      await [
        Permission.camera,
        Permission.locationWhenInUse,
        Permission.sensors,
      ].request();
    } catch (e) {
      debugPrint('requestCameraAndLocation error: $e');
    }
  }

  Future<void> _initAsyncServices() async {
    // 1. Initialize Timezones safely with Pakistan / Swat local location (Asia/Karachi)
    try {
      tz.initializeTimeZones();
      final location = tz.getLocation('Asia/Karachi');
      tz.setLocalLocation(location);
      debugPrint('Timezone initialized to Asia/Karachi (PKT)');
    } catch (e) {
      debugPrint('Timezone init error: $e');
    }

    // 2. Initialize Local Notifications via NotificationService
    try {
      await NotificationService.init();
    } catch (e) {
      debugPrint('Local notifications init error: $e');
    }

    // 3. Request Android 13+ notification, exact alarm, and battery optimization permissions
    try {
      await NotificationService.requestPermissions();

      // Request FCM permission
      await FirebaseMessaging.instance.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
    } catch (e) {
      debugPrint('Permission request error: $e');
    }

    // 4. Log Firebase Analytics App Open event
    try {
      await FirebaseAnalytics.instance.logAppOpen();
      debugPrint('Firebase Analytics app_open event recorded.');
    } catch (e) {
      debugPrint('Firebase Analytics logAppOpen error: $e');
    }
  }

  Future<void> _showNativeNotification({
    required int id,
    required String title,
    required String body,
    String channelId = 'prayer_azan_channel',
  }) async {
    try {
      final isAzan = (channelId == 'prayer_azan_channel');
      final AndroidNotificationDetails androidDetails =
          AndroidNotificationDetails(
        isAzan ? 'prayer_azan_channel' : 'qurb_prayer_channel',
        isAzan ? 'Prayer Times & Azan' : 'Qurb Prayer Reminders',
        channelDescription: isAzan
            ? 'Exact prayer times with full Azan audio notifications'
            : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
        importance: isAzan ? Importance.max : Importance.high,
        priority: Priority.high,
        ticker: 'Prayer Time Azan',
        color: const Color(0xFFD4AF37),
        sound: isAzan
            ? const RawResourceAndroidNotificationSound('azzanforapp')
            : null,
        audioAttributesUsage: isAzan
            ? AudioAttributesUsage.alarm
            : AudioAttributesUsage.notification,
        enableVibration: true,
        playSound: true,
        fullScreenIntent: isAzan,
        visibility: NotificationVisibility.public,
        category: isAzan
            ? AndroidNotificationCategory.alarm
            : AndroidNotificationCategory.reminder,
        actions: isAzan
            ? <AndroidNotificationAction>[
                const AndroidNotificationAction(
                  'stop_azan',
                  'Stop Azan / اذان بند کریں',
                  showsUserInterface: false,
                  cancelNotification: true,
                ),
              ]
            : null,
      );

      final NotificationDetails platformDetails =
          NotificationDetails(android: androidDetails);

      await NotificationService.plugin.show(
        id,
        title,
        body,
        platformDetails,
      );
    } catch (e) {
      debugPrint('Native notification error: $e');
    }
  }

  Future<void> _savePreferencesToStorage(Map<String, dynamic> prefsData) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final enabled = prefsData['enabled'] == true;
      await prefs.setBool('notifications_enabled', enabled);
      await prefs.setString(
          'salah_prayer_notifications_v3', jsonEncode(prefsData));

      final prayers = prefsData['prayers'] as Map<String, dynamic>?;
      if (prayers != null) {
        await prefs.setBool('prayer_fajr_enabled',
            prayers['fajr'] != false && prayers['fajr'] != 'off');
        await prefs.setBool('prayer_dhuhr_enabled',
            prayers['dhuhr'] != false && prayers['dhuhr'] != 'off');
        await prefs.setBool('prayer_asr_enabled',
            prayers['asr'] != false && prayers['asr'] != 'off');
        await prefs.setBool('prayer_maghrib_enabled',
            prayers['maghrib'] != false && prayers['maghrib'] != 'off');
        await prefs.setBool('prayer_isha_enabled',
            prayers['isha'] != false && prayers['isha'] != 'off');
      }

      final special = prefsData['special'] as Map<String, dynamic>?;
      if (special != null) {
        await prefs.setBool('special_sunrise_enabled',
            special['sunrise'] != false && special['sunrise'] != 'off');
        await prefs.setBool('special_sunset_enabled',
            special['sunset'] != false && special['sunset'] != 'off');
        await prefs.setBool('special_makruh_start_enabled',
            special['makruhStart'] != false && special['makruhStart'] != 'off');
        await prefs.setBool('special_makruh_end_enabled',
            special['makruhEnd'] != false && special['makruhEnd'] != 'off');
        await prefs.setBool(
            'special_iqamah_alert_enabled', special['iqamahAlert'] == true);
        await prefs.setBool(
            'special_jummah_alert_enabled', special['jummahAlert'] == true);
      }

      final dawah = prefsData['dawah'] as Map<String, dynamic>?;
      if (dawah != null) {
        await prefs.setBool('dawah_morning_enabled', dawah['morning'] == true);
        await prefs.setBool('dawah_maghrib_enabled', dawah['maghrib'] == true);
        await prefs.setBool('dawah_sleep_enabled', dawah['sleep'] == true);
      }
      debugPrint(
          'Saved notification preferences to SharedPreferences successfully.');
    } catch (e) {
      debugPrint('Error saving preferences to SharedPreferences: $e');
    }
  }

  Future<void> _scheduleDailyPrayers(Map<String, dynamic> data) async {
    try {
      final now = tz.TZDateTime.now(tz.local);
      debugPrint('Scheduling daily prayers from native bridge');

      // Cancel all standard daily prayer alarms (101-109) to prevent orphaned/duplicate notifications
      for (int i = 101; i <= 109; i++) {
        try {
          await NotificationService.plugin.cancel(i);
        } catch (_) {}
      }

      // If explicit items list is provided, mark as daily and schedule
      if (data['items'] is List) {
        final items = (data['items'] as List).map((e) {
          if (e is Map<String, dynamic>) {
            final copy = Map<String, dynamic>.from(e);
            copy['isDaily'] = true;
            return copy;
          }
          return e;
        }).toList();
        await _schedulePrayerBatch(items);
        return;
      }

      final prayers = data['prayers'] as Map<String, dynamic>? ?? {};
      final special = data['special'] as Map<String, dynamic>? ?? {};

      final List<Map<String, dynamic>> dailyItems = [];

      void addPrayerItem(String key, String titleUrdu, String titleEn,
          int defaultHour, int defaultMinute,
          {bool isPrayer = true}) {
        int hour = defaultHour;
        int minute = defaultMinute;

        dynamic val = prayers[key] ?? special[key];
        if (val is Map) {
          hour = (val['hour'] as num?)?.toInt() ?? defaultHour;
          minute = (val['minute'] as num?)?.toInt() ?? defaultMinute;
        } else if (val is String && val.contains(':')) {
          final parts = val.split(':');
          hour = int.tryParse(parts[0].trim()) ?? defaultHour;
          minute = int.tryParse(parts[1].trim()) ?? defaultMinute;
        } else if (val is List && val.length >= 2) {
          hour = (val[0] as num).toInt();
          minute = (val[1] as num).toInt();
        }

        final targetDt = tz.TZDateTime(
            tz.local, now.year, now.month, now.day, hour, minute, 0);

        dailyItems.add({
          'id': key == 'fajr'
              ? 101
              : (key == 'dhuhr'
                  ? 102
                  : (key == 'asr'
                      ? 103
                      : (key == 'maghrib'
                          ? 104
                          : (key == 'isha'
                              ? 105
                              : (key == 'sunrise'
                                  ? 106
                                  : (key == 'makruhStart'
                                      ? 107
                                      : (key == 'makruhEnd' ? 108 : 109))))))),
          'key': key,
          'prayerKey': key,
          'isPrayer': isPrayer,
          'isDaily': true,
          'channelId': isPrayer ? 'prayer_azan_channel' : 'qurb_prayer_channel',
          'title': isPrayer ? 'نمازِ $titleUrdu کا وقت' : titleUrdu,
          'body': isPrayer
              ? '$titleUrdu کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔'
              : '$titleUrdu کا وقت ہے۔',
          'time': targetDt.toIso8601String(),
        });
      }

      if (prayers.containsKey('fajr') || prayers.isEmpty) {
        addPrayerItem('fajr', 'فجر', 'Fajr', 5, 47, isPrayer: true);
      }
      if (prayers.containsKey('dhuhr') || prayers.isEmpty) {
        addPrayerItem('dhuhr', 'ظہر', 'Dhuhr', 12, 14, isPrayer: true);
      }
      if (prayers.containsKey('asr') || prayers.isEmpty) {
        addPrayerItem('asr', 'عصر', 'Asr', 15, 32, isPrayer: true);
      }
      if (prayers.containsKey('maghrib') || prayers.isEmpty) {
        addPrayerItem('maghrib', 'مغرب', 'Maghrib', 17, 15, isPrayer: true);
      }
      if (prayers.containsKey('isha') || prayers.isEmpty) {
        addPrayerItem('isha', 'عشاء', 'Isha', 18, 40, isPrayer: true);
      }

      if (special.containsKey('sunrise')) {
        addPrayerItem('sunrise', 'طلوعِ شمس', 'Sunrise', 7, 18,
            isPrayer: false);
      }
      if (special.containsKey('tahajjud')) {
        addPrayerItem('tahajjud', 'تہجد', 'Tahajjud', 4, 30, isPrayer: true);
      }
      if (special.containsKey('makruhStart')) {
        addPrayerItem('makruhStart', 'مکروہ وقت شروع', 'Makruh Start', 7, 18,
            isPrayer: false);
      }
      if (special.containsKey('makruhEnd')) {
        addPrayerItem('makruhEnd', 'مکروہ وقت ختم', 'Makruh End', 7, 38,
            isPrayer: false);
      }

      await _schedulePrayerBatch(dailyItems);
    } catch (e) {
      debugPrint('Error in _scheduleDailyPrayers: $e');
    }
  }

  Future<void> _schedulePrayerBatch(List<dynamic> items) async {
    try {
      final now = tz.TZDateTime.now(tz.local);
      final Set<int> scheduledIds = {};
      int scheduledCount = 0;

      for (final raw in items) {
        if (raw is! Map<String, dynamic>) continue;
        final timeStr = raw['time'] as String?;
        if (timeStr == null) continue;

        final parsedUtc = DateTime.tryParse(timeStr);
        if (parsedUtc == null) continue;

        final localDt = parsedUtc.isUtc ? parsedUtc.toLocal() : parsedUtc;
        final title = raw['title'] as String? ?? 'Qurb Prayer Times';
        final body = raw['body'] as String? ?? '';
        final isPrayer = raw['isPrayer'] == true;
        final rawChannel = raw['channelId'] as String?;
        final channelId = rawChannel ??
            (isPrayer ? 'prayer_azan_channel' : 'qurb_prayer_channel');

        // Deterministic globally unique ID from JavaScript payload.
        // Javascript uses: (Month * 10000) + (Day * 100) + TypeOffset
        // E.g., Fajr today = 8521. This eliminates collisions without random hashes.
        int alarmId = raw['id'] as int? ?? 0;
        if (alarmId == 0) continue;

        if (scheduledIds.contains(alarmId)) continue;

        final scheduledDate = tz.TZDateTime(
          tz.local,
          localDt.year,
          localDt.month,
          localDt.day,
          localDt.hour,
          localDt.minute,
          0,
        );

        if (scheduledDate.isBefore(now.subtract(const Duration(minutes: 1)))) {
          continue;
        }

        scheduledIds.add(alarmId);

        try {
          await NotificationService.plugin.cancel(alarmId);
        } catch (_) {}

        final isAzan = (channelId == 'prayer_azan_channel') || isPrayer;
        final isSilent = (channelId == 'prayer_silent_channel');
        final isAdhkar = (channelId == 'qurb_adhkar_channel');
        final isTakbeer = (channelId == 'prayer_takbeer_channel');
        final isVibrate = (channelId == 'prayer_vibrate_channel');

        final androidDetails = AndroidNotificationDetails(
          isAzan ? 'prayer_azan_channel' : channelId,
          isAzan
              ? 'Prayer Times & Azan'
              : (isSilent
                  ? 'Silent Reminders'
                  : (isAdhkar
                      ? 'Qurb Daily Adhkar & Reminders'
                      : (isTakbeer
                          ? 'Soft Takbeer'
                          : (isVibrate
                              ? 'Vibration Only'
                              : 'Qurb Prayer Reminders')))),
          channelDescription: isAzan
              ? 'Exact prayer times with full Azan audio notifications'
              : (isSilent
                  ? 'Silent notifications for prayer times'
                  : (isAdhkar
                      ? 'Daily morning/evening adhkar and Jumuah reminders'
                      : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb')),
          importance: isSilent
              ? Importance.low
              : (isAzan ? Importance.max : Importance.high),
          priority:
              isSilent ? Priority.low : (isAzan ? Priority.max : Priority.high),
          ticker: isAzan ? 'Prayer Time Azan' : 'Qurb Reminder',
          color: const Color(0xFFD4AF37),
          sound: isAzan
              ? const RawResourceAndroidNotificationSound('azzanforapp')
              : null,
          audioAttributesUsage: isAzan
              ? AudioAttributesUsage.alarm
              : AudioAttributesUsage.notification,
          enableVibration: !isSilent,
          fullScreenIntent: isAzan,
          visibility: NotificationVisibility.public,
          category: isAzan
              ? AndroidNotificationCategory.alarm
              : AndroidNotificationCategory.reminder,
          actions: isAzan
              ? const <AndroidNotificationAction>[
                  AndroidNotificationAction(
                    'stop_azan',
                    'Stop Azan / اذان بند کریں',
                    showsUserInterface: false,
                    cancelNotification: true,
                  ),
                ]
              : null,
        );

        try {
          await NotificationService.plugin.zonedSchedule(
            alarmId,
            title,
            body,
            scheduledDate,
            NotificationDetails(android: androidDetails),
            androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
            uiLocalNotificationDateInterpretation:
                UILocalNotificationDateInterpretation.absoluteTime,
          );
          scheduledCount++;
        } catch (e) {
          try {
            await NotificationService.plugin.zonedSchedule(
              alarmId,
              title,
              body,
              scheduledDate,
              NotificationDetails(android: androidDetails),
              androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
              uiLocalNotificationDateInterpretation:
                  UILocalNotificationDateInterpretation.absoluteTime,
            );
            scheduledCount++;
          } catch (_) {}
        }
      }
      debugPrint(
          'Successfully registered $scheduledCount recurring daily prayer/event alarms.');
    } catch (e) {
      debugPrint('Error scheduling prayer batch: $e');
    }
  }

  void _showNativeNotificationSettings(
      BuildContext context, Map<String, dynamic> times) {
    debugPrint("=== OPENING NATIVE MODAL ===");
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101820),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return NativeSettingsSheet(
          times: times,
          onSyncNeeded: (String jsonState) {
            _controller?.runJavaScript(
                "localStorage.setItem('salah_prayer_notifications_v3', '$jsonState'); if(window.syncNativeToWeb) window.syncNativeToWeb();");
          },
        );
      },
    );
  }

  Future<void> _handleBridgeMessage(String message) async {
    try {
      final data = jsonDecode(message) as Map<String, dynamic>;
      final action = data['action'] as String?;

      switch (action) {
        case 'openNativeSettings':
          if (!mounted) return;
          _showNativeNotificationSettings(
              context, data['times'] as Map<String, dynamic>? ?? {});
          break;

        case 'requestPermissions':
          try {
            await NotificationService.requestPermissions();
            await [
              Permission.notification,
              Permission.scheduleExactAlarm,
              Permission.locationWhenInUse,
            ].request();
          } catch (e) {
            debugPrint('Bridge permission error: $e');
          }
          break;

        case 'saveNotificationPreferences':
          final prefsData = data['preferences'] as Map<String, dynamic>?;
          if (prefsData != null) {
            await _savePreferencesToStorage(prefsData);
          }
          try {
            await [
              Permission.notification,
              Permission.scheduleExactAlarm,
            ].request();
          } catch (e) {
            debugPrint('Permission request error: $e');
          }
          break;

        case 'appReady':
        case 'domReady':
          debugPrint('App Ready bridge signal received.');
          break;

        case 'requestCamera':
        case 'requestCameraPermission':
        case 'requestCameraAndLocation':
          await requestCameraAndLocation();
          break;

        case 'requestLocation':
          try {
            await Permission.locationWhenInUse.request();
          } catch (e) {
            debugPrint('requestLocation error: $e');
          }
          break;

        case 'requestSensors':
          try {
            await Permission.sensors.request();
          } catch (e) {
            debugPrint('requestSensors error: $e');
          }
          break;

        case 'getLocation':
        case 'getNativeLocation':
          try {
            final locationService = loc.Location();
            var perm = await locationService.hasPermission();
            if (perm == loc.PermissionStatus.denied) {
              perm = await locationService.requestPermission();
            }
            if (perm == loc.PermissionStatus.granted ||
                perm == loc.PermissionStatus.grantedLimited) {
              final locData = await locationService
                  .getLocation()
                  .timeout(const Duration(seconds: 6));
              if (locData.latitude != null && locData.longitude != null) {
                _controller?.runJavaScript(
                    'if (window.onNativeLocationReceived) { window.onNativeLocationReceived(${locData.latitude}, ${locData.longitude}); }');
              }
            }
          } catch (e) {
            debugPrint('Native getLocation bridge error: $e');
          }
          break;

        case 'schedulePrayerBatch':
          final items = data['items'] as List<dynamic>?;
          if (items != null) {
            await _schedulePrayerBatch(items);
          }
          break;

        case 'scheduleDailyPrayers':
          // DISABLED: Handled exclusively via schedulePrayerBatch to ensure exactly ONE authoritative path
          break;

        case 'scheduleAlarm':
          final id = data['id'] as int? ??
              (DateTime.now().millisecondsSinceEpoch ~/ 1000);
          final title = data['title'] as String? ?? 'Qurb Prayer Alarm';
          final body = data['body'] as String? ?? 'Time for prayer';
          final channelId =
              (data['channelId'] as String?) ?? 'prayer_azan_channel';
          final isPrayer = (data['isPrayer'] == true) ||
              (channelId == 'prayer_azan_channel');

          DateTime scheduledDt;
          if (data['time'] != null) {
            scheduledDt =
                DateTime.tryParse(data['time'].toString()) ?? DateTime.now();
          } else if (data['scheduledTime'] != null) {
            scheduledDt = DateTime.tryParse(data['scheduledTime'].toString()) ??
                DateTime.now();
          } else if (data['delaySeconds'] != null) {
            scheduledDt = DateTime.now()
                .add(Duration(seconds: (data['delaySeconds'] as num).toInt()));
          } else {
            scheduledDt = DateTime.now();
          }

          await NotificationService.scheduleAlarm(
            id: id,
            title: title,
            body: body,
            scheduledTime: scheduledDt,
            channelId: channelId,
            isPrayer: isPrayer,
            matchDateTimeComponents: null,
          );
          break;

        case 'test_notification':
        case 'testNotification':
          try {
            await NotificationService.showTestNotification();
          } catch (e) {
            debugPrint('NotificationService test error: $e');
            final title =
                data['title'] as String? ?? 'Qurb - Prayer Alerts & Reminders';
            final body = data['body'] as String? ??
                'Prayer alerts and daily spiritual reminders are working properly!';
            await _showNativeNotification(
              id: 999,
              title: title,
              body: body,
              channelId: 'prayer_azan_channel',
            );
          }
          break;

        case 'savePreference':
          try {
            final prefKey = data['key'] as String?;
            final prefVal = data['value'];
            if (prefKey != null) {
              final prefs = await SharedPreferences.getInstance();
              if (prefVal is bool) {
                await prefs.setBool(prefKey, prefVal);
              } else if (prefVal is String) {
                await prefs.setString(prefKey, prefVal);
              }
            }
          } catch (e) {
            debugPrint('savePreference error: $e');
          }
          break;

        case 'scheduleNotification':
          final id = data['id'] as int? ??
              DateTime.now().millisecondsSinceEpoch ~/ 1000;
          final title = data['title'] as String? ?? 'Prayer Time';
          final body = data['body'] as String? ?? 'Time for prayer';
          final delaySeconds = data['delaySeconds'] as int? ?? 0;
          final channelId =
              (data['channelId'] as String?) ?? 'prayer_azan_channel';

          if (delaySeconds <= 0) {
            await _showNativeNotification(
                id: id, title: title, body: body, channelId: channelId);
          } else {
            try {
              final scheduledDate = tz.TZDateTime.now(tz.local)
                  .add(Duration(seconds: delaySeconds));
              await NotificationService.scheduleAlarm(
                id: id,
                title: title,
                body: body,
                scheduledTime: scheduledDate,
                channelId: channelId,
                matchDateTimeComponents: null,
              );
            } catch (e) {
              debugPrint('Schedule notification error: $e');
              await _showNativeNotification(
                  id: id, title: title, body: body, channelId: channelId);
            }
          }
          break;

        case 'openPdfLibrary':
          if (mounted) {
            final bookId = data['bookId'] as String?;
            if (bookId != null && bookId.isNotEmpty) {
              _openSpecificPdfBook(bookId);
            } else {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const PdfLibraryScreen(),
                ),
              );
            }
          }
          break;

        case 'openShareLink':
          final url = Uri.parse('https://qurb.muftimaazharoon.com/');
          try {
            await launchUrl(url, mode: LaunchMode.externalApplication);
          } catch (e) {
            debugPrint('Could not launch $url: $e');
          }
          break;

        case 'openQibla':
          if (mounted && !_isOpeningQibla) {
            _isOpeningQibla = true;
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const QiblaScreen(),
              ),
            ).whenComplete(() {
              _isOpeningQibla = false;
            });
          }
          break;

        case 'cancelAllNotifications':
          try {
            await NotificationService.plugin.cancelAll();
            final prefs = await SharedPreferences.getInstance();
            await prefs.setBool('notifications_enabled', false);
            debugPrint(
                'All notifications cancelled and state disabled in SharedPreferences.');
          } catch (e) {
            debugPrint('Cancel notifications error: $e');
          }
          break;

        default:
          debugPrint('Unhandled QurbBridge action: $action');
      }
    } catch (e) {
      debugPrint('Error processing QurbBridge message: $e');
    }
  }

  Future<void> _openSpecificPdfBook(String bookId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = prefs.getStringList('qurb_pdf_library_v1') ?? [];
      final docsDir = await getApplicationDocumentsDirectory();
      final libDirPath = p.join(docsDir.path, 'qurb_pdf_books');

      for (final item in jsonList) {
        final map = jsonDecode(item) as Map<String, dynamic>;
        if (map['id'] == bookId) {
          final title = map['title'] as String? ?? 'Document';
          String filePath = map['path'] as String? ?? '';
          final fileName = map['fileName'] as String? ?? p.basename(filePath);

          if (!File(filePath).existsSync()) {
            final candidate = p.join(libDirPath, fileName);
            if (File(candidate).existsSync()) {
              filePath = candidate;
            }
          }

          if (File(filePath).existsSync() && mounted) {
            final lastPage = prefs.getInt('pdf_bookmark_$bookId') ?? 0;
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PdfViewerScreen(
                  title: title,
                  filePath: filePath,
                  initialPage: lastPage,
                  bookId: bookId,
                ),
              ),
            );
            return;
          }
        }
      }

      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const PdfLibraryScreen(),
          ),
        );
      }
    } catch (e) {
      debugPrint('Error opening specific PDF book: $e');
    }
  }

  void _initWebViewController() {
    try {
      late final PlatformWebViewControllerCreationParams params;
      if (WebViewPlatform.instance is AndroidWebViewPlatform) {
        params = AndroidWebViewControllerCreationParams();
      } else {
        params = const PlatformWebViewControllerCreationParams();
      }

      final WebViewController controller =
          WebViewController.fromPlatformCreationParams(params);

      controller
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF121623))
        ..addJavaScriptChannel(
          'QurbBridge',
          onMessageReceived: (JavaScriptMessage message) {
            _handleBridgeMessage(message.message);
          },
        )
        ..addJavaScriptChannel(
          'FlutterNotificationBridge',
          onMessageReceived: (JavaScriptMessage message) async {
            try {
              final data = jsonDecode(message.message);
              if (data is Map && data['action'] == 'test_notification') {
                await NotificationService.showTestNotification();
                return;
              }
            } catch (e) {
              debugPrint('FlutterNotificationBridge error: $e');
            }
            _handleBridgeMessage(message.message);
          },
        )
        ..setNavigationDelegate(
          NavigationDelegate(
            onPageStarted: (String url) {},
            onPageFinished: (String url) async {
              try {
                final prefs = await SharedPreferences.getInstance();
                final savedState =
                    prefs.getString('salah_prayer_notifications_v3');
                String injectState = "";
                if (savedState != null) {
                  final safeState = savedState.replaceAll("'", "\\'");
                  injectState =
                      "try { localStorage.setItem('salah_prayer_notifications_v3', '$safeState'); if(window.syncNativeToWeb) window.syncNativeToWeb(); } catch(e) {}";
                }

                controller.runJavaScript('''
                  window.isNativeApp = true;
                  window.__QURB_NATIVE__ = true;
                  $injectState
                  if (window.Notification) {
                    try {
                      Object.defineProperty(window.Notification, 'permission', {
                        get: function() { return 'granted'; },
                        set: function() {}
                      });
                    } catch(e) {}
                  }
                  if (window.__syncNativePrayerNotifications) {
                    window.__syncNativePrayerNotifications();
                  }
                  console.log("Qurb Native Bridge initialized successfully.");
                ''');
              } catch (e) {
                debugPrint('Bridge JS injection error: $e');
              }
            },
            onWebResourceError: (WebResourceError error) {
              debugPrint('WebView resource error: ${error.description}');
            },
          ),
        );

      if (controller.platform is AndroidWebViewController) {
        final androidController =
            controller.platform as AndroidWebViewController;
        androidController.setMediaPlaybackRequiresUserGesture(false);
        androidController.setOnPlatformPermissionRequest((request) {
          request.grant();
        });
        androidController.setGeolocationPermissionsPromptCallbacks(
          onShowPrompt: (params) async {
            return const GeolocationPermissionsResponse(
                allow: true, retain: true);
          },
        );
      }

      controller.loadFlutterAsset('assets/web/index.html');
      _controller = controller;
    } catch (e) {
      debugPrint('WebView initialization error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFF121623);

    Widget webViewWidget = const SizedBox.shrink();
    if (_controller != null) {
      if (_controller!.platform is AndroidWebViewController) {
        final params = AndroidWebViewWidgetCreationParams(
          controller: _controller!.platform,
          displayWithHybridComposition: true,
        );
        webViewWidget = WebViewWidget.fromPlatformCreationParams(
          params: params,
        );
      } else {
        webViewWidget = WebViewWidget(
          controller: _controller!,
        );
      }
    }

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        top: false,
        bottom: false,
        child: webViewWidget,
      ),
    );
  }
}

class NativeSettingsSheet extends StatefulWidget {
  final Map<String, dynamic> times;
  final Function(String) onSyncNeeded;

  const NativeSettingsSheet({
    super.key,
    required this.times,
    required this.onSyncNeeded,
  });

  @override
  State<NativeSettingsSheet> createState() => _NativeSettingsSheetState();
}

class _NativeSettingsSheetState extends State<NativeSettingsSheet> {
  bool _isLoading = true;
  Map<String, dynamic> _state = {};

  final Map<String, String> _prayerNames = {
    'fajr': 'Fajr / فجر',
    'sunrise': 'Sunrise / طلوعِ آفتاب',
    'makruhStart': 'Makruh Start / مکروہ شروع',
    'makruhEnd': 'Makruh End / مکروہ ختم',
    'dhuhr': 'Dhuhr / ظہر',
    'asr': 'Asr / عصر',
    'maghrib': 'Maghrib / مغرب',
    'isha': 'Isha / عشاء',
  };

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonStr = prefs.getString('salah_prayer_notifications_v3');
      Map<String, dynamic> loadedState = {
        'enabled': false,
        'prayers': {
          'fajr': 'adhan',
          'dhuhr': 'adhan',
          'asr': 'adhan',
          'maghrib': 'adhan',
          'isha': 'adhan'
        },
        'special': {
          'sunrise': 'beep',
          'makruhStart': 'beep',
          'makruhEnd': 'beep'
        },
        'dawah': {'morning': false, 'maghrib': false, 'sleep': false},
      };
      if (jsonStr != null) {
        try {
          final parsed = jsonDecode(jsonStr) as Map<String, dynamic>;
          loadedState = parsed;
        } catch (e) {}
      }

      // Ensure nested objects exist
      loadedState['prayers'] ??= {};
      loadedState['special'] ??= {};
      loadedState['dawah'] ??= {};

      if (mounted) {
        setState(() {
          _state = loadedState;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _saveAndSync() async {
    final jsonStr = jsonEncode(_state);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('salah_prayer_notifications_v3', jsonStr);

    // Also save boolean flags so native BootReceiver functions correctly
    await prefs.setBool('notifications_enabled', _state['enabled'] == true);

    final p = _state['prayers'];
    if (p != null) {
      await prefs.setBool(
          'prayer_fajr_enabled', p['fajr'] != false && p['fajr'] != 'off');
      await prefs.setBool(
          'prayer_dhuhr_enabled', p['dhuhr'] != false && p['dhuhr'] != 'off');
      await prefs.setBool(
          'prayer_asr_enabled', p['asr'] != false && p['asr'] != 'off');
      await prefs.setBool('prayer_maghrib_enabled',
          p['maghrib'] != false && p['maghrib'] != 'off');
      await prefs.setBool(
          'prayer_isha_enabled', p['isha'] != false && p['isha'] != 'off');
    }
    final s = _state['special'];
    if (s != null) {
      await prefs.setBool('special_sunrise_enabled',
          s['sunrise'] != false && s['sunrise'] != 'off');
      await prefs.setBool('special_makruh_start_enabled',
          s['makruhStart'] != false && s['makruhStart'] != 'off');
      await prefs.setBool('special_makruh_end_enabled',
          s['makruhEnd'] != false && s['makruhEnd'] != 'off');
      await prefs.setBool(
          'special_iqamah_alert_enabled', s['iqamahAlert'] == true);
      await prefs.setBool(
          'special_jummah_alert_enabled', s['jummahAlert'] == true);
    }
    final d = _state['dawah'];
    if (d != null) {
      await prefs.setBool('dawah_morning_enabled', d['morning'] == true);
      await prefs.setBool('dawah_maghrib_enabled', d['maghrib'] == true);
      await prefs.setBool('dawah_sleep_enabled', d['sleep'] == true);
    }

    widget.onSyncNeeded(jsonStr);
  }

  void _updatePrayer(String key, String val) {
    setState(() {
      _state['prayers'][key] = val;
    });
    _saveAndSync();
  }

  void _updateSpecial(String key, String val) {
    setState(() {
      _state['special'][key] = val;
    });
    _saveAndSync();
  }

  Widget _buildDropdown(String title, String time, String currentValue,
      Function(String) onChanged) {
    return ListTile(
      title: Text(title,
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
      subtitle: Text(time, style: const TextStyle(color: Colors.white60)),
      trailing: DropdownButton<String>(
        value: (currentValue == 'true'
            ? 'adhan'
            : (currentValue == 'false' ? 'off' : currentValue)),
        dropdownColor: const Color(0xFF1E2A38),
        style: const TextStyle(color: Colors.white, fontSize: 13),
        underline: Container(),
        items: const [
          DropdownMenuItem(value: 'adhan', child: Text('Full Adhan')),
          DropdownMenuItem(value: 'beep', child: Text('Beep / Tone')),
          DropdownMenuItem(value: 'silent', child: Text('Silent')),
          DropdownMenuItem(value: 'off', child: Text('Disabled')),
        ],
        onChanged: (val) {
          if (val != null) onChanged(val);
        },
      ),
    );
  }

  Widget _buildSwitch(String title, String subtitle, bool currentValue,
      Function(bool) onChanged) {
    return SwitchListTile(
      title: Text(title,
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.white60)),
      value: currentValue,
      activeColor: const Color(0xFFD48A56),
      onChanged: (val) {
        onChanged(val);
        _saveAndSync();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const SizedBox(
          height: 300, child: Center(child: CircularProgressIndicator()));
    }

    final p = _state['prayers'];
    final s = _state['special'];
    final d = _state['dawah'];

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      padding: const EdgeInsets.only(top: 20),
      child: Column(
        children: [
          const Text("Native Notification Settings",
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD48A56),
                minimumSize: const Size(double.infinity, 50),
              ),
              label: const Text("Allow / Request Notification Permission",
                  style: TextStyle(color: Colors.white)),
              onPressed: () async {
                final plugin = FlutterLocalNotificationsPlugin();
                await plugin
                    .resolvePlatformSpecificImplementation<
                        AndroidFlutterLocalNotificationsPlugin>()
                    ?.requestNotificationsPermission();
              },
            ),
          ),
          SwitchListTile(
            title: const Text("Master Switch",
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
            subtitle: const Text(
                "Enable or disable all background notifications natively.",
                style: TextStyle(color: Colors.white60)),
            value: _state['enabled'] == true,
            activeColor: const Color(0xFF4A90E2),
            onChanged: (val) {
              setState(() {
                _state['enabled'] = val;
              });
              _saveAndSync();
            },
          ),
          const Divider(color: Colors.white24),
          Expanded(
            child: ListView(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text("Prayer & Event Alerts",
                      style: TextStyle(
                          color: Color(0xFFD48A56),
                          fontWeight: FontWeight.bold,
                          fontSize: 14)),
                ),
                _buildDropdown(
                    _prayerNames['fajr']!,
                    widget.times['fajr'] ?? '—',
                    p['fajr'] ?? 'adhan',
                    (v) => _updatePrayer('fajr', v)),
                _buildDropdown(
                    _prayerNames['sunrise']!,
                    widget.times['sunrise'] ?? '—',
                    s['sunrise'] ?? 'beep',
                    (v) => _updateSpecial('sunrise', v)),
                _buildDropdown(
                    _prayerNames['makruhStart']!,
                    widget.times['makruhStart'] ?? '—',
                    s['makruhStart'] ?? 'beep',
                    (v) => _updateSpecial('makruhStart', v)),
                _buildDropdown(
                    _prayerNames['makruhEnd']!,
                    widget.times['makruhEnd'] ?? '—',
                    s['makruhEnd'] ?? 'beep',
                    (v) => _updateSpecial('makruhEnd', v)),
                _buildDropdown(
                    _prayerNames['dhuhr']!,
                    widget.times['dhuhr'] ?? '—',
                    p['dhuhr'] ?? 'adhan',
                    (v) => _updatePrayer('dhuhr', v)),
                _buildDropdown(_prayerNames['asr']!, widget.times['asr'] ?? '—',
                    p['asr'] ?? 'adhan', (v) => _updatePrayer('asr', v)),
                _buildDropdown(
                    _prayerNames['maghrib']!,
                    widget.times['maghrib'] ?? '—',
                    p['maghrib'] ?? 'adhan',
                    (v) => _updatePrayer('maghrib', v)),
                _buildDropdown(
                    _prayerNames['isha']!,
                    widget.times['isha'] ?? '—',
                    p['isha'] ?? 'adhan',
                    (v) => _updatePrayer('isha', v)),
                const Divider(color: Colors.white24),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text("Da'wah & Motivation Reminders",
                      style: TextStyle(
                          color: Color(0xFFD48A56),
                          fontWeight: FontWeight.bold,
                          fontSize: 14)),
                ),
                _buildSwitch(
                    "Morning Motivation",
                    "Spiritual reminder at Fajr time (05:30 AM).",
                    d['morning'] == true, (v) {
                  setState(() {
                    d['morning'] = v;
                  });
                }),
                _buildSwitch(
                    "Post-Maghrib Adhkar",
                    "Surah and Salawat reminder 15 mins after Maghrib.",
                    d['maghrib'] == true, (v) {
                  setState(() {
                    d['maghrib'] = v;
                  });
                }),
                _buildSwitch(
                    "Sunnah Early Sleep",
                    "Sleep reminder 60 mins after Isha.",
                    d['sleep'] == true, (v) {
                  setState(() {
                    d['sleep'] = v;
                  });
                }),
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2d73b9),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: () async {
                      final plugin = FlutterLocalNotificationsPlugin();
                      await plugin.show(
                        99999,
                        'Qurb Prayer Notifications',
                        'Your notification channels are active and working!',
                        const NotificationDetails(
                          android: AndroidNotificationDetails(
                            'qurb_azan_channel',
                            'Prayer Times & Azan',
                            importance: Importance.max,
                            priority: Priority.high,
                            playSound: true,
                          ),
                        ),
                      );
                    },
                    child: const Text("🔔 Test Native Notification",
                        style: TextStyle(color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

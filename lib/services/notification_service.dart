import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

@pragma('vm:entry-point')
void notificationTapBackground(NotificationResponse notificationResponse) {
  WidgetsFlutterBinding.ensureInitialized();
  debugPrint('Background notification tapped: id=${notificationResponse.id}, actionId=${notificationResponse.actionId}, payload=${notificationResponse.payload}');
  if (notificationResponse.actionId == 'stop_azan') {
    debugPrint('Stopping Azan notification from background action');
    if (notificationResponse.id != null) {
      NotificationService.plugin.cancel(notificationResponse.id!);
    }
  }
}

class NotificationService {

  // Instant trigger for Test Notification
  
  // Exact time background scheduler
  static Future<void> scheduleAlarm({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
    String channelId = 'prayer_azan_channel',
    bool isPrayer = true,
    DateTimeComponents? matchDateTimeComponents,
  }) async {
    try {
      tz.initializeTimeZones();
      if (tz.local.name == 'UTC') {
        try {
          final location = tz.getLocation('Asia/Karachi');
          tz.setLocalLocation(location);
        } catch (_) {}
      }
    } catch (_) {}

    final tz.TZDateTime tzNow = tz.TZDateTime.now(tz.local);
    tz.TZDateTime tzTime = tz.TZDateTime.from(scheduledTime, tz.local);
    if (tzTime.isBefore(tzNow)) {
      tzTime = tzTime.add(const Duration(days: 1));
    }

    final bool isAzan = (channelId == 'prayer_azan_channel') || isPrayer;
    final bool isSilent = (channelId == 'prayer_silent_channel');
    final bool isTakbeer = (channelId == 'prayer_takbeer_channel');
    final bool isVibrate = (channelId == 'prayer_vibrate_channel');

    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      isAzan ? 'prayer_azan_channel' : channelId,
      isAzan
          ? 'Prayer Times & Azan'
          : (isSilent
              ? 'Silent Reminders'
              : (isTakbeer
                  ? 'Soft Takbeer Reminders'
                  : (isVibrate ? 'Vibration Only Reminders' : 'Qurb Prayer Reminders'))),
      channelDescription: isAzan
          ? 'Exact prayer times with full Azan audio notifications'
          : (isSilent
              ? 'Silent notifications for prayer times'
              : (isTakbeer
                  ? 'Soft takbeer notification for prayers'
                  : (isVibrate
                      ? 'Vibration only notification for prayers'
                      : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb'))),
      importance: isSilent ? Importance.low : (isAzan ? Importance.max : Importance.high),
      priority: isSilent ? Priority.low : (isAzan ? Priority.max : Priority.high),
      playSound: !(isSilent || isVibrate),
      sound: isAzan ? const RawResourceAndroidNotificationSound('azzanforapp') : null,
      audioAttributesUsage: isAzan ? AudioAttributesUsage.alarm : AudioAttributesUsage.notification,
      enableVibration: !isSilent,
      fullScreenIntent: isAzan,
      visibility: NotificationVisibility.public,
      category: isAzan ? AndroidNotificationCategory.alarm : AndroidNotificationCategory.reminder,
      ticker: isAzan ? 'Prayer Time Azan' : 'Qurb Reminder',
      color: const Color(0xFFD4AF37),
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

    final NotificationDetails notificationDetails =
        NotificationDetails(android: androidDetails);

    try {
      await plugin.cancel(id);
      await plugin.zonedSchedule(
        id,
        title,
        body,
        tzTime,
        notificationDetails,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
        matchDateTimeComponents: matchDateTimeComponents,
      );
      debugPrint('Scheduled exact alarm #$id ($title) at $tzTime on $channelId');
    } catch (e) {
      debugPrint('Exact alarm failed for #$id, falling back to inexactAllowWhileIdle: $e');
      try {
        await plugin.zonedSchedule(
          id,
          title,
          body,
          tzTime,
          notificationDetails,
          androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
          uiLocalNotificationDateInterpretation:
              UILocalNotificationDateInterpretation.absoluteTime,
          matchDateTimeComponents: matchDateTimeComponents,
        );
        debugPrint('Scheduled fallback inexact alarm #$id ($title) at $tzTime on $channelId');
      } catch (e2) {
        debugPrint('Failed to schedule inexact fallback alarm #$id: $e2');
      }
    }
  }

  static Future<void> cancelAll() async {
    await plugin.cancelAll();
  }

  static Future<void> showInstantAlert({
    required int id,
    required String title,
    required String body,
    String channelId = 'prayer_azan_channel',
  }) async {
    final bool isAzan = (channelId == 'prayer_azan_channel');
    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      channelId,
      isAzan ? 'Prayer Times & Azan' : 'Qurb Prayer Reminders',
      channelDescription: isAzan
          ? 'Exact prayer times with full Azan audio notifications'
          : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      sound: isAzan ? const RawResourceAndroidNotificationSound('azzanforapp') : null,
      audioAttributesUsage: isAzan ? AudioAttributesUsage.alarm : AudioAttributesUsage.notification,
      enableVibration: true,
      fullScreenIntent: isAzan,
      visibility: NotificationVisibility.public,
      category: isAzan ? AndroidNotificationCategory.alarm : AndroidNotificationCategory.reminder,
      ticker: isAzan ? 'Prayer Time Azan' : 'Qurb Reminder',
      color: const Color(0xFFD4AF37),
    );

    await plugin.show(
      id,
      title,
      body,
      NotificationDetails(android: androidDetails),
    );
  }

  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static FlutterLocalNotificationsPlugin get plugin => _notificationsPlugin;

  static Future<void> init() async {
    try {
      tz.initializeTimeZones();
      if (tz.local.name == 'UTC') {
        try {
          final location = tz.getLocation('Asia/Karachi');
          tz.setLocalLocation(location);
        } catch (_) {}
      }
    } catch (e) {
      debugPrint('Timezone init in NotificationService error: $e');
    }

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    await _notificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint('Notification clicked: id=${response.id}, actionId=${response.actionId}, payload=${response.payload}');
        if (response.actionId == 'stop_azan') {
          debugPrint('Stopping Azan notification from foreground action');
          if (response.id != null) {
            _notificationsPlugin.cancel(response.id!);
          }
        }
      },
      onDidReceiveBackgroundNotificationResponse: notificationTapBackground,
    );

    const AndroidNotificationChannel azanChannel = AndroidNotificationChannel(
      'prayer_azan_channel',
      'Prayer Times & Azan',
      description: 'Exact prayer times with full Azan audio notifications',
      importance: Importance.max,
      playSound: true,
      sound: RawResourceAndroidNotificationSound('azzanforapp'),
      enableVibration: true,
      showBadge: true,
    );

    const AndroidNotificationChannel prayerChannel = AndroidNotificationChannel(
      'qurb_prayer_channel',
      'Qurb Prayer Reminders',
      description: 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
      showBadge: true,
    );

    const AndroidNotificationChannel silentChannel = AndroidNotificationChannel(
      'prayer_silent_channel',
      'Silent Reminders',
      description: 'Silent notifications for prayer times',
      importance: Importance.low,
      playSound: false,
      enableVibration: false,
      showBadge: false,
    );

    const AndroidNotificationChannel takbeerChannel = AndroidNotificationChannel(
      'prayer_takbeer_channel',
      'Soft Takbeer Reminders',
      description: 'Soft takbeer notification for prayers',
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
      showBadge: true,
    );

    const AndroidNotificationChannel vibrateChannel = AndroidNotificationChannel(
      'prayer_vibrate_channel',
      'Vibration Only Reminders',
      description: 'Vibration only notification for prayers',
      importance: Importance.high,
      playSound: false,
      enableVibration: true,
      showBadge: true,
    );

    const AndroidNotificationChannel adhkarChannel = AndroidNotificationChannel(
      'qurb_adhkar_channel',
      'Qurb Adhkar & Reminders',
      description: 'Daily Sunnah and spiritual motivation reminders',
      importance: Importance.high,
      playSound: true,
      enableVibration: true,
      showBadge: true,
    );

    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
        _notificationsPlugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      await androidImplementation.createNotificationChannel(azanChannel);
      await androidImplementation.createNotificationChannel(prayerChannel);
      await androidImplementation.createNotificationChannel(silentChannel);
      await androidImplementation.createNotificationChannel(takbeerChannel);
      await androidImplementation.createNotificationChannel(vibrateChannel);
      await androidImplementation.createNotificationChannel(adhkarChannel);
    }
  }

  static Future<void> requestPermissions() async {
    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
        _notificationsPlugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    await androidImplementation?.requestNotificationsPermission();
    await androidImplementation?.requestExactAlarmsPermission();

    // Android 13+ Notification, Exact Alarms, and Battery Optimization (Critical for Doze Mode)
    try {
      if (!await Permission.notification.isGranted) {
        await Permission.notification.request();
      }
      if (!await Permission.scheduleExactAlarm.isGranted) {
        await Permission.scheduleExactAlarm.request();
      }
      if (!await Permission.ignoreBatteryOptimizations.isGranted) {
        await Permission.ignoreBatteryOptimizations.request();
      }
    } catch (e) {
      debugPrint('Error requesting additional exact alarm / battery permissions: $e');
    }
  }

  static Future<void> showTestNotification() async {
    try {
      await requestPermissions();
    } catch (e) {
      debugPrint('NotificationService permission error: $e');
    }

    try {
      const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
        'prayer_azan_channel',
        'Prayer Times & Azan',
        channelDescription: 'Exact prayer times with full Azan audio notifications',
        importance: Importance.max,
        priority: Priority.max,
        playSound: true,
        sound: RawResourceAndroidNotificationSound('azzanforapp'),
        audioAttributesUsage: AudioAttributesUsage.alarm,
        category: AndroidNotificationCategory.alarm,
        enableVibration: true,
        fullScreenIntent: true,
        visibility: NotificationVisibility.public,
        color: Color(0xFFD4AF37),
        actions: <AndroidNotificationAction>[
          AndroidNotificationAction(
            'stop_azan',
            'Stop Azan / اذان بند کریں',
            showsUserInterface: false,
            cancelNotification: true,
          ),
        ],
      );

      const NotificationDetails platformDetails =
          NotificationDetails(android: androidDetails);

      await _notificationsPlugin.show(
        999,
        'Qurb - Prayer Alerts & Reminders',
        'Prayer alerts and daily spiritual reminders are working properly!',
        platformDetails,
      );
      debugPrint('Test notification dispatched successfully.');
    } catch (e, st) {
      debugPrint('Error in showTestNotification: $e\n$st');
    }
  }
}

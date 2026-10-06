# -*- coding: utf-8 -*-
with open('lib/services/notification_service.dart', 'r', encoding='utf-8') as f:
    content = f.read()

alarm_method = """
  // Exact time background scheduler
  static Future<void> scheduleAlarm({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledTime,
  }) async {
    final tz.TZDateTime tzTime = tz.TZDateTime.from(scheduledTime, tz.local);
    if (tzTime.isBefore(tz.TZDateTime.now(tz.local))) return;

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'qurb_prayer_channel',
      'Qurb Prayer Reminders',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      enableVibration: true,
    );

    await plugin.zonedSchedule(
      id,
      title,
      body,
      tzTime,
      const NotificationDetails(android: androidDetails),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  static Future<void> cancelAll() async {
    await plugin.cancelAll();
  }
"""

if "scheduleAlarm" not in content:
    content = content.replace("static Future<void> showInstantAlert", alarm_method + "\n  static Future<void> showInstantAlert")
    print("Added scheduleAlarm and cancelAll")

with open('lib/services/notification_service.dart', 'w', encoding='utf-8') as f:
    f.write(content)

# -*- coding: utf-8 -*-
with open('lib/services/notification_service.dart', 'r', encoding='utf-8') as f:
    content = f.read()

instant_alert = """
  // Instant trigger for Test Notification
  static Future<void> showInstantAlert({
    required int id,
    required String title,
    required String body,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'qurb_prayer_channel',
      'Qurb Prayer Reminders',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      enableVibration: true,
      fullScreenIntent: true,
    );

    await plugin.show(
      id,
      title,
      body,
      const NotificationDetails(android: androidDetails),
    );
  }
"""

if "showInstantAlert" not in content:
    content = content.replace("class NotificationService {", "class NotificationService {\n" + instant_alert)
    print("Added showInstantAlert")

with open('lib/services/notification_service.dart', 'w', encoding='utf-8') as f:
    f.write(content)

with open('lib/services/notification_service.dart', 'r') as f:
    content = f.read()

# Add permission_handler import
if "import 'package:permission_handler/permission_handler.dart';" not in content:
    content = content.replace("import 'package:flutter/material.dart';", "import 'package:flutter/material.dart';\nimport 'package:permission_handler/permission_handler.dart';")

# Add new channels
new_channels = """
    const AndroidNotificationChannel takbeerChannel = AndroidNotificationChannel(
      'prayer_takbeer_channel',
      'Soft Takbeer Reminders',
      description: 'Soft takbeer notification for prayers',
      importance: Importance.high,
      playSound: true,
      sound: RawResourceAndroidNotificationSound('takbeer'), // Assuming a takbeer sound exists or fallback to default
      enableVibration: true,
      showBadge: true,
    );

    const AndroidNotificationChannel vibrateChannel = AndroidNotificationChannel(
      'prayer_vibrate_channel',
      'Vibration Only Reminders',
      description: 'Vibration only notification for prayers',
      importance: Importance.defaultImportance,
      playSound: false,
      enableVibration: true,
      showBadge: true,
    );
"""

if "prayer_takbeer_channel" not in content:
    content = content.replace("final AndroidFlutterLocalNotificationsPlugin? androidImplementation =", new_channels + "\n    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =")
    content = content.replace("await androidImplementation.createNotificationChannel(adhkarChannel);", "await androidImplementation.createNotificationChannel(adhkarChannel);\n      await androidImplementation.createNotificationChannel(takbeerChannel);\n      await androidImplementation.createNotificationChannel(vibrateChannel);")

# Update requestPermissions
req_perms = """
  static Future<void> requestPermissions() async {
    final AndroidFlutterLocalNotificationsPlugin? androidImplementation =
        _notificationsPlugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    await androidImplementation?.requestNotificationsPermission();
    await androidImplementation?.requestExactAlarmsPermission();

    // Android 13+ Exact Alarms and Battery Optimization (Critical for Doze Mode)
    try {
      if (await Permission.scheduleExactAlarm.isDenied) {
        await Permission.scheduleExactAlarm.request();
      }
      if (await Permission.ignoreBatteryOptimizations.isDenied) {
        await Permission.ignoreBatteryOptimizations.request();
      }
    } catch (e) {
      debugPrint('Error requesting additional exact alarm / battery permissions: $e');
    }
  }
"""

import re
content = re.sub(r'static Future<void> requestPermissions\(\) async \{.*?\n  \}', req_perms.strip(), content, flags=re.DOTALL)

with open('lib/services/notification_service.dart', 'w') as f:
    f.write(content)

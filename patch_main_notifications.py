import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
content = content.replace("import 'package:qurb_app/features/quran/pages/main_page.dart';", "import 'package:qurb_app/features/quran/pages/main_page.dart';\nimport 'package:qurb_app/services/notification_service.dart';")

# 2. Remove the global flutterLocalNotificationsPlugin initialization if needed,
# or we can leave it and just route to NotificationService.
# Actually, the user's prompt explicitly mentions replacing things.
# Let's see the _initAsyncServices block we need to replace.

init_async_services_pattern = r"// 2\. Initialize Local Notifications with Azan sound and Action Handlers.*?// 3\. Request Android 13\+ & runtime permissions in background \(non-blocking\)"
new_init = """// 2. Initialize Local Notifications via NotificationService
    try {
      await NotificationService.init();
    } catch (e) {
      debugPrint('Local notifications init error: $e');
    }

    // 3. Request Android 13+ & runtime permissions in background (non-blocking)"""

content = re.sub(init_async_services_pattern, new_init, content, flags=re.DOTALL)

# Let's replace the flutterLocalNotificationsPlugin global variable usage with NotificationService.plugin where appropriate
# The main places are _showNativeNotification and the switch cases for scheduling notifications.

content = content.replace("await flutterLocalNotificationsPlugin.show", "await NotificationService.plugin.show")
content = content.replace("await flutterLocalNotificationsPlugin.zonedSchedule", "await NotificationService.plugin.zonedSchedule")
content = content.replace("flutterLocalNotificationsPlugin.cancel", "NotificationService.plugin.cancel")
content = content.replace("flutterLocalNotificationsPlugin.cancelAll", "NotificationService.plugin.cancelAll")

# Remove the old flutterLocalNotificationsPlugin definition since NotificationService has its own
content = content.replace("final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =\n    FlutterLocalNotificationsPlugin();", "")
content = content.replace("final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();", "")

with open('lib/main.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched main.dart successfully.")

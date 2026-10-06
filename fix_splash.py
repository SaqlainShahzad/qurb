# -*- coding: utf-8 -*-
with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace setBackgroundColor
old_bg = "..setBackgroundColor(const Color(0xFF0F0A07))"
new_bg = "..setBackgroundColor(const Color(0xFF0B101E))"
content = content.replace(old_bg, new_bg)

# Find WebViewController bridge for test_notification and replace with new action
old_bridge = """        ..addJavaScriptChannel(
          'FlutterNotificationBridge',
          onMessageReceived: (JavaScriptMessage message) async {
            try {
              final data = jsonDecode(message.message);
              if (data is Map && data['action'] == 'test_notification') {
                await NotificationService.showTestNotification();
                return;
              }
            } catch (e) {
              debugPrint('FlutterNotificationBridge error: \$e');
            }
            _handleBridgeMessage(message.message);
          },
        )"""

new_bridge = """        ..addJavaScriptChannel(
          'FlutterNotificationBridge',
          onMessageReceived: (JavaScriptMessage message) async {
            try {
              final Map<String, dynamic> data = jsonDecode(message.message);
              final String action = data['action'] ?? '';

              if (action == 'test_notification') {
                await NotificationService.showInstantAlert(
                  id: 999,
                  title: 'Qurb - Test Notification',
                  body: 'All prayer and spiritual alerts are configured properly!',
                );
              } else if (action == 'requestPermissions') {
                final androidImpl = NotificationService.flutterLocalNotificationsPlugin
                    .resolvePlatformSpecificImplementation<
                        AndroidFlutterLocalNotificationsPlugin>();
                await androidImpl?.requestNotificationsPermission();
                await androidImpl?.requestExactAlarmsPermission();
              }
            } catch (e) {
              debugPrint('Bridge parse error: $e');
            }
            _handleBridgeMessage(message.message);
          },
        )"""

content = content.replace(old_bridge, new_bridge)

with open('lib/main.dart', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated main.dart splash and bridge")

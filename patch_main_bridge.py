import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update _handleBridgeMessage to include FlutterNotificationBridge specific handling
old_switch = """        case 'testNotification':
          final title = data['title'] as String? ?? 'Qurb Prayer Times';
          final body = data['body'] as String? ?? 'نماز کے اوقات کی اذان و اطلاعات فعال ہیں۔';
          await _showNativeNotification(
            id: 999,
            title: title,
            body: body,
            channelId: 'prayer_azan_channel',
          );
          break;"""

new_switch = """        case 'testNotification':
          try {
            await NotificationService.showTestNotification();
          } catch (e) {
            debugPrint('NotificationService test error: $e');
            final title = data['title'] as String? ?? 'Qurb Prayer Times';
            final body = data['body'] as String? ?? 'نماز کے اوقات کی اذان و اطلاعات فعال ہیں۔';
            await _showNativeNotification(
              id: 999,
              title: title,
              body: body,
              channelId: 'prayer_azan_channel',
            );
          }
          break;

        case 'requestPermissions':
          try {
            await NotificationService.requestPermissions();
          } catch (e) {
            debugPrint('NotificationService permission error: $e');
          }
          break;

        case 'savePreference':
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
          break;"""

if old_switch in content:
    content = content.replace(old_switch, new_switch)
    print("Replaced testNotification in main.dart")
else:
    print("Could not find old_switch")

# 2. Update _initWebViewController to add clearLocalStorage and FlutterNotificationBridge
old_ctrl = """      controller
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF0F0A07))
        ..clearCache()
        ..addJavaScriptChannel(
          'QurbBridge',
          onMessageReceived: (JavaScriptMessage message) {
            _handleBridgeMessage(message.message);
          },
        )"""

new_ctrl = """      controller
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF0F0A07))
        ..clearCache()
        ..clearLocalStorage()
        ..addJavaScriptChannel(
          'QurbBridge',
          onMessageReceived: (JavaScriptMessage message) {
            _handleBridgeMessage(message.message);
          },
        )
        ..addJavaScriptChannel(
          'FlutterNotificationBridge',
          onMessageReceived: (JavaScriptMessage message) {
            _handleBridgeMessage(message.message);
          },
        )"""

if old_ctrl in content:
    content = content.replace(old_ctrl, new_ctrl)
    print("Replaced controller channels in main.dart")
else:
    print("Could not find old_ctrl")

with open('lib/main.dart', 'w', encoding='utf-8') as f:
    f.write(content)

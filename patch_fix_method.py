import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

method_inject = """  void _showNativeNotificationSettings(BuildContext context, Map<String, dynamic> times) {
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
            _controller?.runJavaScript("localStorage.setItem('salah_prayer_notifications_v3', '" + jsonState + "'); if(window.syncNativeToWeb) window.syncNativeToWeb();");
          },
        );
      },
    );
  }
"""

if "void _showNativeNotificationSettings(BuildContext context" not in content:
    content = content.replace("Future<void> _handleBridgeMessage(String message) async {", method_inject + "\n  Future<void> _handleBridgeMessage(String message) async {")
    with open('lib/main.dart', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Method injected successfully.")

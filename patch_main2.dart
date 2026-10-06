import 'dart:io';

void main() {
  final file = File('lib/main.dart');
  var content = file.readAsStringSync();
  
  if (content.contains('String injectState = "";')) {
    print('Already injected');
  } else {
    final injectCode = """
            onPageFinished: (String url) async {
              try {
                final prefs = await SharedPreferences.getInstance();
                final savedState = prefs.getString('salah_prayer_notifications_v3');
                String injectState = "";
                if (savedState != null) {
                  final safeState = savedState.replaceAll("'", "\\\\'");
                  injectState = "try { localStorage.setItem('salah_prayer_notifications_v3', '\$safeState'); if(window.syncNativeToWeb) window.syncNativeToWeb(); } catch(e) {}";
                }
                
                controller.runJavaScript('''
                  window.isNativeApp = true;
                  window.__QURB_NATIVE__ = true;
                  \$injectState
                  if (window.Notification) {""";
    content = content.replaceFirst(
      """            onPageFinished: (String url) async {
              try {
                controller.runJavaScript('''
                  window.isNativeApp = true;
                  window.__QURB_NATIVE__ = true;
                  if (window.Notification) {""",
      injectCode
    );
    file.writeAsStringSync(content);
    print('Injected prefs reading in main.dart');
  }
}

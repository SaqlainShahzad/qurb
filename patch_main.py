import re

with open('lib/main.dart', 'r') as f:
    content = f.read()

# Remove the Firebase initialization block from main
firebase_init_block_regex = r"    // 2\. Initialize Firebase Core safely\n    try \{\n      await Firebase\.initializeApp\(\);\n      FirebaseMessaging\.onBackgroundMessage\(_firebaseMessagingBackgroundHandler\);\n      debugPrint\('Firebase Core & Messaging initialized successfully\.'\);\n    \} catch \(e\) \{\n      debugPrint\('Firebase initialization warning: \$e'\);\n    \}\n\n"

content = re.sub(firebase_init_block_regex, '', content)

# Change runApp(const QurbApp()); to runApp(const QurbAppWrapper());
content = content.replace("runApp(const QurbApp());", "runApp(const QurbAppWrapper());")

# Add QurbAppWrapper before QurbApp
wrapper_code = """
class QurbAppWrapper extends StatefulWidget {
  const QurbAppWrapper({super.key});

  @override
  State<QurbAppWrapper> createState() => _QurbAppWrapperState();
}

class _QurbAppWrapperState extends State<QurbAppWrapper> {
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initFirebase();
  }

  Future<void> _initFirebase() async {
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp();
      }
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      debugPrint('Firebase Core & Messaging initialized successfully.');
    } catch (e) {
      debugPrint('Firebase initialization warning: $e');
    }
    if (mounted) {
      setState(() {
        _initialized = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_initialized) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Scaffold(
          backgroundColor: const Color(0xFF121623),
          body: Center(
            child: Image.asset(
              'assets/web/images/splash_logo.png',
              width: 144,
              height: 144,
            ),
          ),
        ),
      );
    }
    return const QurbApp();
  }
}

class QurbApp extends StatelessWidget {
"""

content = content.replace("class QurbApp extends StatelessWidget {", wrapper_code)

with open('lib/main.dart', 'w') as f:
    f.write(content)

with open('lib/main.dart', 'r') as f:
    content = f.read()

old_delegate = """        ..setNavigationDelegate(
          NavigationDelegate(
            onPageFinished: (String url) async {
              if (mounted && !_isReady) {
                setState(() {
                  _isReady = true;
                });
              }"""

new_delegate = """        ..setNavigationDelegate(
          NavigationDelegate(
            onPageStarted: (String url) {
              Future.delayed(const Duration(milliseconds: 400), () {
                if (mounted && !_isReady) {
                  setState(() {
                    _isReady = true;
                  });
                }
              });
            },
            onPageFinished: (String url) async {
              if (mounted && !_isReady) {
                setState(() {
                  _isReady = true;
                });
              }"""

content = content.replace(old_delegate, new_delegate)

# Remove progress bar from splash screen
old_progress = """                      const SizedBox(height: 28),
                      Container(
                        width: 220,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.white12,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: const LinearProgressIndicator(
                          color: Color(0xFFF1D08C),
                          backgroundColor: Colors.transparent,
                        ),
                      ),"""

new_progress = ""

content = content.replace(old_progress, new_progress)

# Also remove "Prayer Times & Islamic Guide"
old_tagline = """                      const SizedBox(height: 12),
                      const Text(
                        'Prayer Times & Islamic Guide',
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.white70,
                        ),
                      ),"""

new_tagline = ""

content = content.replace(old_tagline, new_tagline)

# Change background to solid brown
old_bg = """                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF6B4923), Color(0xFF5C3D1C), Color(0xFF3B2512)],
                    stops: [0.0, 0.48, 1.0],
                  ),
                ),"""

new_bg = """                decoration: const BoxDecoration(
                  color: Color(0xFF2A1C11),
                ),"""

content = content.replace(old_bg, new_bg)

with open('lib/main.dart', 'w') as f:
    f.write(content)

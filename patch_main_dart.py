import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update NavigationDelegate onPageStarted to onPageFinished
old_delegate = """        ..setNavigationDelegate(
          NavigationDelegate(
            onPageStarted: (String url) {
              if (mounted && !_isReady) {
                setState(() {
                  _isReady = true;
                });
              }
            },"""
new_delegate = """        ..setNavigationDelegate(
          NavigationDelegate(
            onPageFinished: (String url) {
              if (mounted && !_isReady) {
                setState(() {
                  _isReady = true;
                });
              }
            },"""
content = content.replace(old_delegate, new_delegate)

# 2. Update the flutter splash screen to match the official one
old_splash = """                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFD4AF37), width: 2),
                        ),
                        child: const Center(
                          child: Text(
                            'قرب',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFD4AF37),
                              fontFamily: 'AmiriQuran',
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const CircularProgressIndicator(
                        color: Color(0xFFD4AF37),
                        strokeWidth: 2.5,
                      ),"""

new_splash = """                      const Text(
                        'Qurb',
                        style: TextStyle(
                          fontSize: 64,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'MUFTI MAAZ HAROON',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFFF1D08C),
                          letterSpacing: 3.2,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Prayer Times & Islamic Guide',
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 28),
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

content = content.replace(old_splash, new_splash)

# 3. Add background gradient if possible, but color #0F0A07 is already there which matches. Let's make it the exact gradient of the CSS:
# radial-gradient(circle at 50% 42%,rgba(230,189,104,.18),transparent 34%), linear-gradient(145deg,#6b4923 0%,#5c3d1c 48%,#3b2512 100%);
# It's a bit complex for a quick flutter screen, but let's add a simple linear gradient.
old_container_start = """            if (!_isReady)
              Container(
                color: const Color(0xFF0F0A07),
                child: Center("""
new_container_start = """            if (!_isReady)
              Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF6B4923), Color(0xFF5C3D1C), Color(0xFF3B2512)],
                    stops: [0.0, 0.48, 1.0],
                  ),
                ),
                child: Center("""
content = content.replace(old_container_start, new_container_start)

with open('lib/main.dart', 'w', encoding='utf-8') as f:
    f.write(content)

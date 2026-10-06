import re

with open('lib/features/quran/widgets/read_quran.dart', 'r') as f:
    content = f.read()

# Add _loadTranslation method
load_method = """
  Future<void> _loadTranslation() async {
    ByteBuffer transUtf8;
    final isBundledTranslation = Settings.instance.translationFile.isEmpty || !Settings.instance.useCustomTranslation;
    if (isBundledTranslation) {
      transUtf8 = (await rootBundle.load("assets/quran/ur.jalandhry.txt")).buffer;
    } else {
      final data = File(Settings.instance.translationFile).readAsBytesSync();
      transUtf8 = data.buffer;
    }

    List<int> transLineOffsets = [];
    transLineOffsets.add(0);
    int start = 0;
    final utf = transUtf8.asUint8List();
    int next = utf.indexOf(10);
    while (next != -1) {
      transLineOffsets.add(next);

      start = next + 1;
      next = utf.indexOf(10, start);
    }
    if (utf.isNotEmpty && utf.last != 10) {
      transLineOffsets.add(utf.length);
    }

    _translationNotifier.value = Translation(
      fileName: Settings.instance.translationFile,
      transUtf8: transUtf8,
      transLineOffsets: transLineOffsets,
      isBundledTranslation: isBundledTranslation,
    );
  }
"""

if "_loadTranslation" not in content:
    content = content.replace("  void clearCachedTranslation() {", load_method + "\n  void clearCachedTranslation() {")

# Modify clearCachedTranslation to call it
content = content.replace("""  void clearCachedTranslation() {
    // rebuild as reflow mode or other setting might have changed
    setState(() {
      _translationNotifier.value = null;
    });
  }""", """  void clearCachedTranslation() {
    setState(() {});
    if (_translationNotifier.value != null) {
      _translationNotifier.value = null;
      _loadTranslation();
    }
  }""")

# Modify _onAyahLongPressed to use _loadTranslation
old_long_press = """    if (_translationNotifier.value == null) {
      ByteBuffer transUtf8;
      final isBundledTranslation = Settings.instance.translationFile.isEmpty || !Settings.instance.useCustomTranslation;
      if (isBundledTranslation) {
        transUtf8 = (await rootBundle.load("assets/quran/ur.jalandhry.txt")).buffer;
      } else {
        final data = File(Settings.instance.translationFile).readAsBytesSync();
        transUtf8 = data.buffer;
      }

      List<int> transLineOffsets = [];
      transLineOffsets.add(0);
      int start = 0;
      final utf = transUtf8.asUint8List();
      int next = utf.indexOf(10);
      while (next != -1) {
        transLineOffsets.add(next);

        start = next + 1;
        next = utf.indexOf(10, start);
      }
      if (utf.isNotEmpty && utf.last != 10) {
        transLineOffsets.add(utf.length);
      }

      _translationNotifier.value = Translation(
        fileName: Settings.instance.translationFile,
        transUtf8: transUtf8,
        transLineOffsets: transLineOffsets,
        isBundledTranslation: isBundledTranslation,
      );
    }"""

new_long_press = """    if (_translationNotifier.value == null) {
      await _loadTranslation();
    }"""

content = content.replace(old_long_press, new_long_press)

with open('lib/features/quran/widgets/read_quran.dart', 'w') as f:
    f.write(content)

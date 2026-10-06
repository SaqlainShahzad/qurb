import sys

file_path = "lib/features/quran/pages/main_page.dart"
with open(file_path, "r") as f:
    content = f.read()

# Add import if not exists
import_statement = "import 'package:qurb_app/features/quran_qurb/presentation/screens/quran_info_screen.dart';"
if import_statement not in content:
    content = content.replace("import 'package:flutter/material.dart';", "import 'package:flutter/material.dart';\n" + import_statement)

# Add info callback
info_func = """
  void _showInfoScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const QuranInfoScreen()),
    );
  }
"""
if "_showInfoScreen" not in content:
    content = content.replace("  void _openSettings() {", info_func + "\n  void _openSettings() {")

# Add to menu
if "'Info (معلومات)': _showInfoScreen," not in content:
    content = content.replace("'Settings': _openSettings,", "'Settings': _openSettings,\n      'Info (معلومات)': _showInfoScreen,")

with open(file_path, "w") as f:
    f.write(content)

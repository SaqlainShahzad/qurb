import sys

file_path = "lib/features/quran/pages/main_page.dart"
with open(file_path, "r") as f:
    content = f.read()

info_func = """
  void _showInfoScreen() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const QuranInfoScreen()),
    );
  }
"""

if "_showInfoScreen" in content and "void _showInfoScreen" not in content:
    # insert before `Widget buildThreeDotMenu()`
    content = content.replace("  Widget buildThreeDotMenu() {", info_func + "\n  Widget buildThreeDotMenu() {")

with open(file_path, "w") as f:
    f.write(content)

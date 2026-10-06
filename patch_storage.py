with open('lib/main.dart', 'r') as f:
    content = f.read()

old_storage = """      final special = prefsData['special'] as Map<String, dynamic>?;
      if (special != null) {
        await prefs.setBool('special_sunrise_enabled', special['sunrise'] != false);
        await prefs.setBool('special_sunset_enabled', special['sunset'] != false);
        await prefs.setBool('special_makruh_start_enabled', special['makruhStart'] != false);
        await prefs.setBool('special_makruh_end_enabled', special['makruhEnd'] != false);
      }"""

new_storage = """      final special = prefsData['special'] as Map<String, dynamic>?;
      if (special != null) {
        await prefs.setBool('special_sunrise_enabled', special['sunrise'] != false && special['sunrise'] != 'off');
        await prefs.setBool('special_sunset_enabled', special['sunset'] != false && special['sunset'] != 'off');
        await prefs.setBool('special_makruh_start_enabled', special['makruhStart'] != false && special['makruhStart'] != 'off');
        await prefs.setBool('special_makruh_end_enabled', special['makruhEnd'] != false && special['makruhEnd'] != 'off');
      }"""

if old_storage in content:
    content = content.replace(old_storage, new_storage)
    print("Storage patched!")
else:
    print("Could not find old_storage!")

with open('lib/main.dart', 'w') as f:
    f.write(content)

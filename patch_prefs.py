with open('lib/main.dart', 'r') as f:
    content = f.read()

old_block = """        await prefs.setBool('special_makruh_start_enabled', special['makruhStart'] != false && special['makruhStart'] != 'off');
        await prefs.setBool('special_makruh_end_enabled', special['makruhEnd'] != false && special['makruhEnd'] != 'off');
      }"""

new_block = """        await prefs.setBool('special_makruh_start_enabled', special['makruhStart'] != false && special['makruhStart'] != 'off');
        await prefs.setBool('special_makruh_end_enabled', special['makruhEnd'] != false && special['makruhEnd'] != 'off');
      }

      final dawah = prefsData['dawah'] as Map<String, dynamic>?;
      if (dawah != null) {
        await prefs.setBool('dawah_morning_enabled', dawah['morning'] == true);
        await prefs.setBool('dawah_maghrib_enabled', dawah['maghrib'] == true);
        await prefs.setBool('dawah_sleep_enabled', dawah['sleep'] == true);
      }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Prefs patched successfully.")
else:
    print("Prefs block not found!")

with open('lib/main.dart', 'w') as f:
    f.write(content)

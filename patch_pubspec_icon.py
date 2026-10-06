import re

with open('pubspec.yaml', 'r', encoding='utf-8') as f:
    content = f.read()

old_config = """flutter_launcher_icons:
  android: "launcher_icon"
  ios: false
  image_path: "assets/web/icons/icon-512.png"
  min_sdk_android: 21
  adaptive_icon_background: "#0f0a07"
  adaptive_icon_foreground: "assets/web/icons/icon-512.png\""""

new_config = """flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/web/icons/icon-1024.png"
  min_sdk_android: 21
  adaptive_icon_background: "#2A1C11"
  adaptive_icon_foreground: "assets/web/icons/icon-1024.png\""""

if old_config in content:
    content = content.replace(old_config, new_config)
    print("pubspec patched!")
else:
    print("Could not find old_config!")

with open('pubspec.yaml', 'w', encoding='utf-8') as f:
    f.write(content)

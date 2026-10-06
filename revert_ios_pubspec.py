with open('pubspec.yaml', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('ios: true', 'ios: false')

with open('pubspec.yaml', 'w', encoding='utf-8') as f:
    f.write(content)

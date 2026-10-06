import re

with open('lib/features/quran/widgets/read_quran.dart', 'r') as f:
    content = f.read()

pattern = re.compile(r'      final isBundledTranslation = Settings\.instance\.translationFile\.isEmpty;')
replacement = """      final isBundledTranslation = Settings.instance.translationFile.isEmpty || !Settings.instance.useCustomTranslation;"""
content = pattern.sub(replacement, content)

with open('lib/features/quran/widgets/read_quran.dart', 'w') as f:
    f.write(content)

with open('lib/features/quran/widgets/read_quran.dart', 'r') as f:
    content = f.read()

content = content.replace("Translation? _translation;", "final ValueNotifier<Translation?> _translationNotifier = ValueNotifier(null);")
content = content.replace("_translation = null;", "_translationNotifier.value = null;")
content = content.replace("if (_translation == null)", "if (_translationNotifier.value == null)")
content = content.replace("      _translation = Translation(", "      _translationNotifier.value = Translation(")
content = content.replace("            translation: _translation!,", "            translationNotifier: _translationNotifier,")

with open('lib/features/quran/widgets/read_quran.dart', 'w') as f:
    f.write(content)

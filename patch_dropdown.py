import re

with open('lib/features/quran/widgets/read_quran.dart', 'r') as f:
    content = f.read()

pattern = re.compile(r'        final translationWidget = TranslationTile\(\n          translation,\n          widget\.translation\.isUrdu,\n          ayahIndex: ayah,\n          hasNoMutashabihas: dontShowMutashabih,\n        \);')

replacement = """        Widget translationWidget = TranslationTile(
          translation,
          widget.translation.isUrdu,
          ayahIndex: ayah,
          hasNoMutashabihas: dontShowMutashabih,
        );
        
        if (Settings.instance.translationFile.isNotEmpty) {
          translationWidget = Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Row(
                  children: [
                    const Icon(Icons.translate, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<bool>(
                          value: Settings.instance.useCustomTranslation,
                          isDense: true,
                          items: const [
                            DropdownMenuItem(
                              value: false,
                              child: Text("Fateh Muhammad Jalandhari"),
                            ),
                            DropdownMenuItem(
                              value: true,
                              child: Text("Custom Loaded Translation"),
                            ),
                          ],
                          onChanged: (bool? val) {
                            if (val != null) {
                              Settings.instance.useCustomTranslation = val;
                              // Parent widget will automatically rebuild the Translation object
                              // and pass the new widget.translation down.
                            }
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              translationWidget,
            ],
          );
        }
"""

content = pattern.sub(replacement, content)

with open('lib/features/quran/widgets/read_quran.dart', 'w') as f:
    f.write(content)

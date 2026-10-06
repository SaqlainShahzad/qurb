import re

with open('lib/features/quran/widgets/read_quran.dart', 'r') as f:
    content = f.read()

# Replace Translation with ValueNotifier in LongPressActionSheet
content = content.replace("final Translation translation;", "final ValueNotifier<Translation?> translationNotifier;")
content = content.replace("required this.translation,", "required this.translationNotifier,")

# Replace widget.translation usages with the value from builder
pattern_builder = re.compile(r'(        Widget translationWidget = TranslationTile\(\n          translation,\n          widget\.translation\.isUrdu,[\s\S]*?translationWidget,\n            \],\n          \);\n        \})')

new_builder = """
        Widget translationWidget = ValueListenableBuilder<Translation?>(
          valueListenable: widget.translationNotifier,
          builder: (context, currentTranslation, _) {
            if (currentTranslation == null) return const CircularProgressIndicator();
            
            String transText = "Translation not available";
            if (ayah + 1 < currentTranslation.transLineOffsets.length) {
              final int s = currentTranslation.transLineOffsets[ayah];
              final int e = currentTranslation.transLineOffsets[ayah + 1];
              if (e >= s) {
                import 'dart:convert';
                transText = utf8.decode(
                  currentTranslation.transUtf8.asUint8List(s, e - s),
                  allowMalformed: true,
                );
              }
            }
            
            Widget tWidget = TranslationTile(
              transText,
              currentTranslation.isUrdu,
              ayahIndex: ayah,
              hasNoMutashabihas: dontShowMutashabih,
            );
            
            if (Settings.instance.translationFile.isNotEmpty) {
              tWidget = Column(
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
                                  // The parent rebuilds and sets translationNotifier.value
                                }
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  tWidget,
                ],
              );
            }
            return tWidget;
          },
        );
"""
# We also need to remove the old translation string extraction from outside the builder
# Currently it looks like:
#         String translation = "Translation not available";
#         if (ayah + 1 < widget.translation.transLineOffsets.length) { ... }
# Let's replace the whole PageView.builder body

pageview_builder_pattern = re.compile(r'      itemBuilder: \(context, index\) \{[\s\S]*?return ListView\(children: \[bookmarkBtn, openOnQuranCom, translationWidget\]\);\n      \},')

new_pageview_builder = """      itemBuilder: (context, index) {
        final int ayah = _paraFirstAyah + index;
        String metadata = surahAyahText(ayah);
        final int surahIdx = surahForAyah(ayah);
        final int surahAyahIdx = toSurahAyahOffset(surahIdx, ayah);

        bool dontShowMutashabih =
            (widget.mutashabihaList == null) ||
            (widget.mutashabihaList != null && widget.tappedAyahIdx != ayah);

        Widget translationWidget = ValueListenableBuilder<Translation?>(
          valueListenable: widget.translationNotifier,
          builder: (context, currentTranslation, _) {
            if (currentTranslation == null) return const Center(child: Padding(padding: EdgeInsets.all(16.0), child: CircularProgressIndicator()));
            
            String transText = "Translation not available";
            if (ayah + 1 < currentTranslation.transLineOffsets.length) {
              final int s = currentTranslation.transLineOffsets[ayah];
              final int e = currentTranslation.transLineOffsets[ayah + 1];
              if (e >= s) {
                transText = utf8.decode(
                  currentTranslation.transUtf8.asUint8List(s, e - s),
                  allowMalformed: true,
                );
              }
            }
            
            Widget tWidget = TranslationTile(
              transText,
              currentTranslation.isUrdu,
              ayahIndex: ayah,
              hasNoMutashabihas: dontShowMutashabih,
            );
            
            if (Settings.instance.translationFile.isNotEmpty) {
              tWidget = Column(
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
                                  child: Text("Custom Loaded"),
                                ),
                              ],
                              onChanged: (bool? val) {
                                if (val != null) {
                                  Settings.instance.useCustomTranslation = val;
                                }
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  tWidget,
                ],
              );
            }
            return tWidget;
          },
        );

        final openOnQuranCom = TextButton.icon(
          onPressed: () {
            launchUrl(
              Uri.parse(
                "https://quran.com/${surahIdx + 1}:${surahAyahIdx + 1}",
              ),
            );
          },
          icon: const Icon(Icons.open_in_new),
          label: Text("$metadata on Quran.com"),
        );

        final bookmarkBtn = TextButton.icon(
          onPressed: () {
            BookmarksManager.instance.addBookmark(QuranBookmark(
              id: DateTime.now().millisecondsSinceEpoch,
              isPage: false,
              ayahIdx: ayah,
              title: metadata,
            ));
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Ayah bookmarked!'), duration: Duration(seconds: 1)),
            );
          },
          icon: const Icon(Icons.bookmark_add_outlined),
          label: const Text("Bookmark this Ayah"),
        );

        if (widget.tappedAyahIdx == ayah && widget.mutashabihaList != null) {
          return ListView(
            children: [
              bookmarkBtn,
              openOnQuranCom,
              translationWidget,
              const Divider(),
              widget.mutashabihaList!,
            ],
          );
        }

        return ListView(children: [bookmarkBtn, openOnQuranCom, translationWidget]);
      },"""

content = pageview_builder_pattern.sub(new_pageview_builder, content)

with open('lib/features/quran/widgets/read_quran.dart', 'w') as f:
    f.write(content)

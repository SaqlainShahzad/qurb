import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new font face
font_face_addition = """
@font-face {
  font-family: 'Al Mushaf';
  src: url('fonts/DigitalKhattIndoPak.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
"""

# Find where Noto Kufi Arabic is defined and insert Al Mushaf
if "font-family: 'Noto Kufi Arabic';" in content and 'Al Mushaf' not in content:
    content = content.replace("font-family: 'Noto Kufi Arabic';", font_face_addition + "\n  font-family: 'Noto Kufi Arabic';", 1)

# Now for the classes. We need to split the grouped selector.
# Let's find `.arabic, .quran-ayah-text, .hadith-arabic, .dua-card-arabic, .quran-bismillah, \n.daily-ayah-ar, .salah-arabic, .azkar-arabic, .quran-surah-ar {`
# Or any instances of it.
pattern_classes = r'(\.arabic,\s*\.quran-ayah-text,\s*\.hadith-arabic,\s*\.dua-card-arabic,\s*\.quran-bismillah,\s*\.daily-ayah-ar,\s*\.salah-arabic,\s*\.azkar-arabic,\s*\.quran-surah-ar\s*\{[^}]*\})'

def replacer(match):
    original = match.group(1)
    # Split into two rules: one for non-Quran, one for Quran
    quran_classes = [".quran-ayah-text", ".quran-bismillah", ".quran-surah-ar"]
    non_quran_classes = [".arabic", ".hadith-arabic", ".dua-card-arabic", ".daily-ayah-ar", ".salah-arabic", ".azkar-arabic"]
    
    quran_rule = ", ".join(quran_classes) + " {\n  font-family: 'Al Mushaf', sans-serif !important;\n}\n"
    non_quran_rule = ", ".join(non_quran_classes) + " {\n  font-family: 'Noto Kufi Arabic', sans-serif !important;\n}"
    
    return quran_rule + non_quran_rule

content = re.sub(pattern_classes, replacer, content)

# But wait, there might be other occurrences in the CSS!
# Let's do a more robust approach. We can search for `font-family: 'Noto Kufi Arabic'` and check its surrounding selector.
# Instead, let's just write the specific overrides for Quran classes at the end of the <style> tags, or just append them to the <style>.
# Let's find `</style>` and insert it before the first one, or the main one.

# Let's check how many </style> tags there are.

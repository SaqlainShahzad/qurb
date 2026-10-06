import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

font_face_addition = """
@font-face {
  font-family: 'Al Mushaf';
  src: url('fonts/DigitalKhattIndoPak.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
"""

if 'Al Mushaf' not in content:
    content = content.replace("font-family: 'Noto Kufi Arabic';", font_face_addition + "\n  font-family: 'Noto Kufi Arabic';", 1)

# Ensure the original Noto Kufi Arabic is removed from Quran rendering classes.
# The user said: "Strictly remove 'Noto Kufi Arabic' from Quran text rendering in both Flutter TextStyles and index.html/CSS classes. Apply the authentic Quranic font exclusively to the Quran reading views."
# We'll override the font for Quran classes by appending a style block at the end of the <head> or right before the closing </style>
override_style = """
.quran-ayah-text, .quran-bismillah, .quran-surah-ar, .manzil-bismillah, .manzil-ayah, .manzil-header h2, .quran-title .qa, .quran-reader-title .ar {
    font-family: 'Al Mushaf', sans-serif !important;
}
"""

# Let's just find `</style>` and replace the last one in the head, or we can just append it before the first `</style>`.
if 'Al Mushaf' in override_style and 'Al Mushaf' not in content.split('</style>')[0]:
    content = content.replace('</style>', override_style + '\n</style>', 1)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched index.html")

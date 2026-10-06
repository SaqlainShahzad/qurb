import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

fix_css = """
/* SVG CONSTRAINT FIX */
.settings-menu-item svg,
.settings-card svg,
.settings-header svg,
.card-icon svg,
.settings-menu-icon svg,
svg.icon {
  width: 24px !important;
  height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  display: inline-block !important;
}
"""

content = content.replace('/* ================= 3. STRICTLY ISOLATED NOTIFICATION UI (#notification-container) ================= */', fix_css + '\n/* ================= 3. STRICTLY ISOLATED NOTIFICATION UI (#notification-container) ================= */')

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

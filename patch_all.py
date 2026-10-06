import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject SVG constraints
svg_css = """
/* SVG CONSTRAINT FIX */
.settings-menu-item svg,
.settings-card svg,
.settings-header svg,
.card-icon svg,
.settings-menu-icon svg,
svg.icon,
.app-update-card svg,
.app-update-icon svg {
  width: 24px !important;
  height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  display: inline-block !important;
}
"""
if "SVG CONSTRAINT FIX" not in content:
    # insert at end of style
    content = content.replace("</style>", svg_css + "\n</style>")

# 2. Fix CSS selectors for light/dark mode
# Change .notif-row-name to .notif-name
content = content.replace('.notif-row-name', '.notif-name')
# Change .notif-card-text strong to cover .notif-row-text strong too
content = content.replace('.notif-card-text strong,', '.notif-card-text strong,\n#notification-container[data-theme="light"] .notif-row-text strong,')
content = content.replace('.notif-card-text span,', '.notif-card-text span,\n#notification-container[data-theme="light"] .notif-row-text span,')
# And for dark theme
content = content.replace('#notification-container[data-theme="dark"] .notif-card-text strong,', '#notification-container[data-theme="dark"] .notif-card-text strong,\n#notification-container[data-theme="dark"] .notif-row-text strong,')
content = content.replace('#notification-container[data-theme="dark"] .notif-card-text span,', '#notification-container[data-theme="dark"] .notif-card-text span,\n#notification-container[data-theme="dark"] .notif-row-text span,')

# Wait, there's another reason light mode might fail.
# If `setNotifTheme` function isn't triggered, or if `#notification-container` is strictly overridden by global colors.
# Let's ensure SVG and color inherit properly
force_colors_css = """
#notification-container[data-theme="light"] * {
    color: inherit;
}
#notification-container[data-theme="light"] .notif-slider:before {
    background-color: #fff !important;
}
"""
if "color: inherit" not in content:
    content = content.replace('/* Light Theme Variables */', '/* Light Theme Variables */\n' + force_colors_css)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

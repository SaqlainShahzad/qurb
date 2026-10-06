# -*- coding: utf-8 -*-
with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# ===================================================================
# 1. REPLACE OLD BOTTOM NAV CSS with Liquid Glass CSS
# ===================================================================
old_css = """.bottom-nav {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 64px !important;
  background: #ffffff !important;
  display: flex !important;
  justify-content: space-around !important;
  align-items: center !important;
  border-top: 1px solid #e4e4e7 !important;
  z-index: 9999 !important;
  padding-bottom: env(safe-area-inset-bottom, 0px) !important;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05) !important;
}
.bottom-nav .nav-item {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  border: none !important;
  color: #71717a !important;
  text-decoration: none !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  padding: 4px 0 !important;
  font-family: inherit !important;
  transition: color 0.15s ease !important;
}
.bottom-nav .nav-item.active {
  color: #5c3a1e !important;
  font-weight: 700 !important;
}
.bottom-nav .nav-item svg,
.bottom-nav .nav-item img,
.bottom-nav .nav-item i {
  width: 22px !important;
  height: 22px !important;
  font-size: 20px !important;
  margin-bottom: 2px !important;
}"""

new_css = """/* ===== LIQUID GLASS FLOATING NAV ===== */
.liquid-glass-nav {
  position: fixed !important;
  bottom: calc(16px + env(safe-area-inset-bottom)) !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: min(92%, 390px) !important;
  height: 64px !important;
  background: rgba(20, 26, 38, 0.55) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  border-radius: 9999px !important;
  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px rgba(255, 255, 255, 0.2),
    inset 0 -1px 1px rgba(0, 0, 0, 0.2) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-around !important;
  padding: 0 8px !important;
  z-index: 99999 !important;
  box-sizing: border-box !important;
}
.glass-nav-item {
  position: relative !important;
  flex: 1 !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.55) !important;
  cursor: pointer !important;
  border-radius: 9999px !important;
  transition: color 0.25s ease, transform 0.15s ease !important;
  outline: none !important;
  -webkit-tap-highlight-color: transparent !important;
}
.glass-nav-item svg {
  width: 22px !important;
  height: 22px !important;
  position: relative !important;
  z-index: 2 !important;
  transition: transform 0.2s ease, stroke 0.2s ease !important;
}
.glass-pill-indicator {
  position: absolute !important;
  inset: 2px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 9999px !important;
  opacity: 0 !important;
  transform: scale(0.85) !important;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  z-index: 1 !important;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15) !important;
}
.glass-nav-item.active {
  color: #ffffff !important;
}
.glass-nav-item.active .glass-pill-indicator {
  opacity: 1 !important;
  transform: scale(1) !important;
}
.glass-nav-item.active svg {
  transform: scale(1.08) !important;
  stroke-width: 2.2 !important;
}
.glass-nav-item:active svg {
  transform: scale(0.92) !important;
}
/* Legacy compat: keep .nav-item selector working for JS */
.bottom-nav { display: none !important; }"""

if old_css in content:
    content = content.replace(old_css, new_css)
    changes += 1
    print("✓ Replaced bottom-nav CSS with liquid glass CSS")
else:
    print("✗ Old CSS not found exactly — trying partial")

# ===================================================================
# 2. REPLACE OLD BOTTOM NAV HTML with Liquid Glass HTML
# ===================================================================
# Find the old nav block
old_nav_start = '  <nav class="bottom-nav" id="bottomNav">'
old_nav_end = '  </nav>'

# Find the index
nav_start_idx = content.find(old_nav_start)
if nav_start_idx != -1:
    nav_end_idx = content.find(old_nav_end, nav_start_idx)
    if nav_end_idx != -1:
        nav_end_idx += len(old_nav_end)
        old_nav_html = content[nav_start_idx:nav_end_idx]

        new_nav_html = """  <nav class="liquid-glass-nav" id="bottomNav">
    <button class="glass-nav-item active" data-tab="home" aria-label="Home">
      <div class="glass-pill-indicator"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </button>
    <button class="glass-nav-item" data-tab="calendar" aria-label="Prayer Times">
      <div class="glass-pill-indicator"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    </button>
    <button class="glass-nav-item" data-tab="qibla" aria-label="Qibla">
      <div class="glass-pill-indicator"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    </button>
    <button class="glass-nav-item" data-tab="quran" aria-label="Quran">
      <div class="glass-pill-indicator"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    </button>
    <button class="glass-nav-item" data-tab="settings" aria-label="Settings">
      <div class="glass-pill-indicator"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.05 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
  </nav>"""

        content = content[:nav_start_idx] + new_nav_html + content[nav_end_idx:]
        changes += 1
        print("✓ Replaced bottom-nav HTML with liquid glass nav HTML")
else:
    print("✗ Old nav HTML not found")

# ===================================================================
# 3. UPDATE JS NAV SELECTORS: .nav-item → .glass-nav-item
# ===================================================================
content = content.replace(
    "document.querySelectorAll('.nav-item').forEach(function(btn) {\n      btn.classList.toggle('active', btn.dataset.tab === name);\n    });",
    "document.querySelectorAll('.glass-nav-item').forEach(function(btn) {\n      btn.classList.toggle('active', btn.dataset.tab === name);\n    });"
)
changes += 1
print("✓ Updated showTab() nav selector")

content = content.replace(
    "document.querySelectorAll('.nav-item').forEach(function(btn) {\n    btn.addEventListener('click', function() {\n      var tab = btn.getAttribute('data-tab');\n      if (tab) showTab(tab);\n    });\n  });",
    "document.querySelectorAll('.glass-nav-item').forEach(function(btn) {\n    btn.addEventListener('click', function() {\n      var tab = btn.getAttribute('data-tab');\n      if (tab) showTab(tab);\n    });\n  });"
)
changes += 1
print("✓ Updated click handler nav selector")

# ===================================================================
# 4. ADD BOTTOM PADDING to .app-shell so nav doesn't overlap content
# ===================================================================
# Find the existing app-shell padding and increase it
import re
# Add a rule after the liquid glass CSS
content = content.replace(
    "/* Legacy compat: keep .nav-item selector working for JS */\n.bottom-nav { display: none !important; }",
    "/* Bottom padding for floating nav clearance */\n.app-shell, .tab-panel { padding-bottom: 96px !important; }\n.bottom-nav { display: none !important; }"
)
changes += 1
print("✓ Added bottom padding for floating nav clearance")

print(f"\nTotal changes: {changes}")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

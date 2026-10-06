import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ensure HTML markup for notification container matches #notification-container and .notif-row
content = content.replace(
    'id="notification-section"',
    'id="notification-container"'
)
content = content.replace(
    'class="notification-row"',
    'class="notification-row notif-row"'
)

# 2. Prepare comprehensive CSS blocks
new_css_section = """
/* ================= 1. AGLI NAMAZ (LIVE HEADER) CARD ================= */
.live-prayer-widget {
  background: linear-gradient(145deg, #2a1810, #40260e) !important;
  color: #ffffff !important;
  border-radius: 20px !important;
  padding: 16px 18px !important;
  margin: 12px 16px 18px !important;
  box-shadow: 0 8px 24px rgba(60, 40, 20, 0.22) !important;
  border: 1px solid rgba(212, 175, 55, 0.25) !important;
  position: relative !important;
  overflow: hidden !important;
  text-align: center !important;
  box-sizing: border-box !important;
  display: block !important;
  width: auto !important;
}
.live-prayer-widget::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), transparent 70%);
  pointer-events: none;
}
.lpw-top {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 8px !important;
}
.lpw-icon {
  font-size: 18px !important;
}
.lpw-kicker {
  font-size: 0.84rem !important;
  font-weight: 700 !important;
  color: #e8d4bb !important;
  letter-spacing: 0.03em !important;
}
.lpw-status {
  background: #22c55e !important;
  color: #ffffff !important;
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  padding: 2px 8px !important;
  border-radius: 999px !important;
  letter-spacing: 0.05em !important;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5) !important;
  animation: lpwPulse 2s infinite !important;
}
@keyframes lpwPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.lpw-name {
  font-family: 'Amiri', 'Noto Nastaliq Urdu', serif !important;
  font-size: 1.85rem !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  margin: 2px 0 4px !important;
  line-height: 1.3 !important;
}
.lpw-countdown {
  font-size: 2.2rem !important;
  font-weight: 900 !important;
  color: #f1d08c !important;
  font-variant-numeric: tabular-nums !important;
  letter-spacing: 0.04em !important;
  margin: 4px 0 !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
}
.lpw-time {
  font-size: 0.88rem !important;
  color: #e8d4bb !important;
  font-weight: 600 !important;
  margin-bottom: 10px !important;
}
.lpw-progress {
  width: 100% !important;
  height: 6px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 999px !important;
  overflow: hidden !important;
  margin-bottom: 8px !important;
}
.lpw-progress span {
  display: block !important;
  height: 100% !important;
  width: 0% !important;
  background: linear-gradient(90deg, #d4af37, #f1d08c) !important;
  border-radius: 999px !important;
  transition: width 0.4s ease !important;
}
.lpw-next {
  font-size: 0.76rem !important;
  color: rgba(255, 255, 255, 0.75) !important;
}

/* ================= 2. BOTTOM NAVIGATION BAR ================= */
.bottom-nav {
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
}

/* ================= 3. STRICTLY ISOLATED NOTIFICATION UI (#notification-container) ================= */
#notification-container {
  padding: 12px;
  background: #121212 !important;
  border-radius: 12px;
  color: #ffffff !important;
  direction: ltr !important;
  text-align: left !important;
  box-sizing: border-box;
  width: 100%;
}
#notification-container * {
  direction: ltr !important;
  text-align: left !important;
  box-sizing: border-box;
}
#notification-container .notification-hero {
  background: #121212 !important;
  border: 1px solid #27272a !important;
  border-radius: 14px !important;
  padding: 14px !important;
}
#notification-container .notification-title {
  color: #ffffff !important;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
#notification-container .notification-subtitle {
  color: #a1a1aa !important;
  font-size: 11px;
  margin: 3px 0 0;
}
#notification-container .notification-master {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #18181b !important;
  border: 1px solid #27272a !important;
  padding: 12px;
  border-radius: 10px;
  margin-top: 12px;
}
#notification-container .notification-master strong {
  color: #ffffff !important;
  font-size: 13px;
}
#notification-container .notification-master span {
  color: #a1a1aa !important;
  font-size: 11px;
}
#notification-container .notification-permission {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #18181b !important;
  border: 1px solid #27272a !important;
  padding: 10px 12px;
  border-radius: 10px;
  margin-top: 10px;
}
#notification-container .notification-status {
  font-size: 11px;
  color: #4ade80 !important;
}
#notification-container .notification-permission-btn {
  background: #27272a !important;
  color: #ffffff !important;
  border: 1px solid #3f3f46 !important;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
#notification-container .test-btn {
  width: 100% !important;
  background: #ffffff !important;
  color: #000000 !important;
  font-weight: 600 !important;
  padding: 12px !important;
  border-radius: 8px !important;
  border: none !important;
  margin: 10px 0 !important;
  cursor: pointer !important;
  font-size: 13px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
}
#notification-container .notification-btn-sub {
  color: #a1a1aa !important;
  font-size: 11px;
  text-align: center;
  display: block;
}
#notification-container .notification-section-title {
  margin-top: 16px;
  margin-bottom: 8px;
}
#notification-container .notification-section-title strong {
  color: #ffffff !important;
  font-size: 13px;
  display: block;
}
#notification-container .notification-section-title span {
  color: #a1a1aa !important;
  font-size: 11px;
  display: block;
  margin-top: 2px;
}
#notification-container .notif-row,
#notification-container .notification-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  background: #1e1e1e !important;
  padding: 12px !important;
  margin-bottom: 8px !important;
  border-radius: 8px !important;
  border: 1px solid #2e2e2e !important;
}
#notification-container .notification-row-name {
  color: #ffffff !important;
  font-weight: 600;
  font-size: 13px;
}
#notification-container .notification-row-time {
  color: #a1a1aa !important;
  font-size: 11px;
  margin-top: 2px;
}
#notification-container select,
#notification-container .notif-select {
  background: #000000 !important;
  color: #ffffff !important;
  border: 1px solid #4a4a4a !important;
  padding: 6px 10px !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}
#notification-container .notif-switch {
  position: relative;
  width: 44px;
  height: 24px;
  flex: 0 0 44px;
}
#notification-container .notif-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
#notification-container .notif-slider {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #2e2e2e !important;
  border: 1px solid #4a4a4a !important;
  cursor: pointer;
  transition: 0.2s ease;
}
#notification-container .notif-slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  top: 2px;
  left: 2px !important;
  right: auto !important;
  border-radius: 50%;
  background: #a1a1aa !important;
  transition: 0.2s ease;
}
#notification-container .notif-switch input:checked + .notif-slider {
  background: #ffffff !important;
  border-color: #ffffff !important;
}
#notification-container .notif-switch input:checked + .notif-slider:before {
  background: #000000 !important;
  transform: translateX(20px) !important;
}
"""

# Replace the old notification CSS block
old_notif_css_pattern = re.compile(
    r'/\* ================= PRAYER NOTIFICATION SETTINGS.*?@media\(max-width:560px\)\{#tab-settings \.notification-settings.*?\}(?=\s*\n\s*/\* ================= APP UPDATE CARD)',
    re.DOTALL
)

if old_notif_css_pattern.search(content):
    content = old_notif_css_pattern.sub(new_css_section.strip(), content)
    print("Replaced notification CSS block with restored Agli Namaz, Bottom Nav & Isolated Notification styles")
else:
    print("Pattern not found, appending directly")
    content = content.replace("/* ================= APP UPDATE CARD", new_css_section + "\n\n/* ================= APP UPDATE CARD")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

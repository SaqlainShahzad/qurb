import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """
/* ================= 3. STRICTLY ISOLATED NOTIFICATION UI (#notification-container) ================= */
#notification-container {
  padding: 16px 12px;
  border-radius: 16px;
  direction: ltr !important;
  text-align: left !important;
  box-sizing: border-box;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

/* Light Theme Variables */
#notification-container[data-theme="light"] {
  background-color: #F8F4EC !important;
  color: #1c1c1e !important;
}
#notification-container[data-theme="light"] .notif-card {
  background-color: #F8F4EC !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
}
#notification-container[data-theme="light"] .notif-card-text strong,
#notification-container[data-theme="light"] .notif-row-name,
#notification-container[data-theme="light"] .notif-section-title {
  color: #1c1c1e !important;
}
#notification-container[data-theme="light"] .notif-card-text span,
#notification-container[data-theme="light"] .notif-row-time {
  color: #8e8e93 !important;
}
#notification-container[data-theme="light"] .notif-slider {
  background-color: #e5e5ea !important;
  border-color: #d1d1d6 !important;
}
#notification-container[data-theme="light"] .notif-slider:before {
  background-color: #ffffff !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
}
#notification-container[data-theme="light"] input:checked + .notif-slider {
  background-color: #D3B982 !important;
  border-color: #D3B982 !important;
}
#notification-container[data-theme="light"] .theme-btn.active {
  background-color: #ffffff !important;
  color: #1c1c1e !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
}
#notification-container[data-theme="light"] .theme-segmented-control {
  background-color: #e5e5ea !important;
}
#notification-container[data-theme="light"] .notif-select {
  background-color: #f2f2f7 !important;
  color: #1c1c1e !important;
  border-color: #d1d1d6 !important;
}

/* Dark Theme Variables */
#notification-container[data-theme="dark"] {
  background-color: #101623 !important;
  color: #ffffff !important;
}
#notification-container[data-theme="dark"] .notif-card {
  background-color: #1A2130 !important;
  border: 1px solid rgba(255,255,255,0.05) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
}
#notification-container[data-theme="dark"] .notif-card-text strong,
#notification-container[data-theme="dark"] .notif-row-name,
#notification-container[data-theme="dark"] .notif-section-title {
  color: #ffffff !important;
}
#notification-container[data-theme="dark"] .notif-card-text span,
#notification-container[data-theme="dark"] .notif-row-time {
  color: #8e8e93 !important;
}
#notification-container[data-theme="dark"] .notif-slider {
  background-color: #2c3545 !important;
  border-color: #2c3545 !important;
}
#notification-container[data-theme="dark"] .notif-slider:before {
  background-color: #ffffff !important;
}
#notification-container[data-theme="dark"] input:checked + .notif-slider {
  background-color: #51A4C2 !important;
  border-color: #51A4C2 !important;
}
#notification-container[data-theme="dark"] .theme-btn.active {
  background-color: #1A2130 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
}
#notification-container[data-theme="dark"] .theme-segmented-control {
  background-color: #0b101e !important;
}
#notification-container[data-theme="dark"] .notif-select {
  background-color: #20293A !important;
  color: #ffffff !important;
  border-color: #2c3545 !important;
}

/* Layout & Elements */
.notif-header {
  text-align: center;
  margin-bottom: 20px;
}
.notif-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px;
}
.theme-segmented-control {
  display: inline-flex;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}
.theme-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #8e8e93;
  cursor: pointer;
  transition: 0.2s;
}

.notif-section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 24px 0 8px 4px;
}

.notif-card {
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.master-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notif-card-text strong {
  display: block;
  font-size: 15px;
  margin-bottom: 2px;
}
.notif-card-text span {
  font-size: 12px;
}

.notif-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(142, 142, 147, 0.15);
}
.notif-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.notif-row:first-child {
  padding-top: 0;
}
.notif-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.notif-icon {
  font-size: 18px;
  opacity: 0.8;
}
.notif-row-name {
  font-size: 14px;
  font-weight: 600;
}
.notif-row-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notif-select {
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  border-width: 1px;
  border-style: solid;
  outline: none;
}

/* Switch */
.notif-switch {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
  flex: 0 0 44px;
}
.notif-switch.small {
  width: 36px;
  height: 20px;
  flex: 0 0 36px;
}
.notif-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.notif-slider {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  transition: 0.2s ease;
}
.notif-slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  transition: 0.2s ease;
}
.notif-switch.small .notif-slider:before {
  width: 14px;
  height: 14px;
}
.notif-switch input:checked + .notif-slider:before {
  transform: translateX(20px);
}
.notif-switch.small input:checked + .notif-slider:before {
  transform: translateX(16px);
}

.notif-slider-row {
  padding: 8px 0 16px;
}
.notif-row-text {
  display: flex;
  flex-direction: column;
}
.notif-slider-row .notif-row-text {
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}
.notif-row-text strong {
  font-size: 14px;
  font-weight: 600;
}
.notif-row-text span {
  font-size: 12px;
  margin-top: 4px;
}
.notif-range {
  width: 100%;
  accent-color: #51A4C2;
}

/* Test buttons */
.notif-test-wrapper {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
#notification-container[data-theme="dark"] .notif-test-btn {
  background: #20293A;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
}
#notification-container[data-theme="light"] .notif-test-btn {
  background: #ffffff;
  color: #1c1c1e;
  border: 1px solid rgba(0,0,0,0.1);
}
.notif-test-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
"""

css_pattern = re.compile(
    r'/\* ================= 3\. STRICTLY ISOLATED NOTIFICATION UI \(\#notification-container\) ================= \*/.*?/\* ================= APP UPDATE CARD — SETTINGS ONLY ================= \*/',
    re.DOTALL
)

if css_pattern.search(content):
    content = css_pattern.sub(new_css.strip() + '\n\n/* ================= APP UPDATE CARD — SETTINGS ONLY ================= */', content)
    print("Replaced CSS.")
else:
    print("Could not replace CSS.")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

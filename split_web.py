#!/usr/bin/env python3
"""
Qurb: index.html ko saaf-suthra karta hai aur freeze-fix ke baaqi edits lagata hai.

Chalane ka tareeqa (project root se):
    python split_web.py assets/web/index.html

Pehle backup banata hai (index.html.bak). Har step ka OK / SKIPPED print karta hai.
"""
import re, sys, shutil
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "assets/web/index.html")
OUT = SRC.parent
html = SRC.read_text(encoding="utf-8")
shutil.copy(SRC, str(SRC) + ".bak")


def step(name, ok):
    print(("  OK       " if ok else "  SKIPPED  ") + name)


def sub1(pattern, repl, text, name, flags=re.S):
    new, n = re.subn(pattern, lambda m: repl, text, count=1, flags=flags)
    step(name, n == 1)
    return new


# ---------------------------------------------------------------------------
# 1) Toota hua bridge-handlers script theek karo
# ---------------------------------------------------------------------------
FIXED_BRIDGE = r"""<script>
// Global notification bridge handlers (sab window.__qurbPost se jaate hain)
window.triggerTestNotification = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  window.__qurbPost({ action: 'test_notification' });
};
window.triggerRequestPermissions = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  window.__qurbPost({ action: 'requestPermissions' });
};
window.handleNotificationSettingChange = function (el) {
  if (!el) return;
  var key = el.getAttribute('data-key');
  var kind = el.getAttribute('data-kind');
  var val = (el.tagName.toLowerCase() === 'select' || el.type === 'range')
    ? (el.type === 'range' ? parseInt(el.value, 10) : el.value)
    : el.checked;
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem('salah_prayer_notifications_v3') || '{}'); } catch (e) {}
  if (stored.enabled === undefined) stored.enabled = true;
  if (!stored.prayers) stored.prayers = {};
  if (!stored.special) stored.special = {};
  if (!stored.dawah) stored.dawah = {};
  if (kind === 'prayer') stored.prayers[key] = val;
  else if (kind === 'dawah') stored.dawah[key] = val;
  else if (kind === 'special') stored.special[key] = val;
  try { localStorage.setItem('salah_prayer_notifications_v3', JSON.stringify(stored)); } catch (e) {}
  // debounced: aakhir mein sirf ek baar native ko jaata hai
  if (window.__syncNativePrayerNotifications) window.__syncNativePrayerNotifications();
};
</script>"""

print("\n[1] Bridge handlers")
html = sub1(r"<script>\s*// BULLETPROOF GLOBAL NOTIFICATION BRIDGE HANDLERS.*?</script>",
            FIXED_BRIDGE, html, "bridge script wapas theek kiya (test button + toggles dobara kaam karenge)")

# ---------------------------------------------------------------------------
# 2) </head> missing tha
# ---------------------------------------------------------------------------
print("\n[2] HTML structure")
if "</head>" not in html:
    html = html.replace("<body>", "</head>\n<body>", 1)
    step("</head> add kiya", True)
else:
    step("</head> pehle se hai", True)

# ---------------------------------------------------------------------------
# 3) CSS alag file mein
# ---------------------------------------------------------------------------
print("\n[3] CSS -> qurb.css")
style_pat = re.compile(r"<style[^>]*>(.*?)</style>", re.S)
styles = style_pat.findall(html)
css = "\n\n".join(s.strip() for s in styles)

svg_fix = re.compile(r"/\* SVG CONSTRAINT FIX \*/\s*\.settings-menu-item svg,.*?\}", re.S)
found = svg_fix.findall(css)
if len(found) > 1:
    first = [True]
    def keep_first(m):
        if first[0]:
            first[0] = False
            return m.group(0)
        return ""
    css = svg_fix.sub(keep_first, css)
step("duplicate 'SVG CONSTRAINT FIX' blocks hataye (%d -> 1)" % len(found), len(found) >= 1)

css += """

/* ===== perf overrides (freeze fix) ===== */
/* html aur body dono par overflow-x:hidden nested scroll container bana deta tha */
body { overflow-x: visible !important; }
/* articles lambay hain: off-screen cards ka layout/paint skip */
.article-card { content-visibility: auto; contain-intrinsic-size: 800px; }
"""
(OUT / "qurb.css").write_text("/* Qurb styles - purane inline <style> blocks, same order */\n" + css + "\n", encoding="utf-8")

state = {"first": True}
def style_repl(m):
    if state["first"]:
        state["first"] = False
        return '<link rel="stylesheet" href="qurb.css">'
    return ""
html = style_pat.sub(style_repl, html)
step("%d <style> blocks -> 1 file" % len(styles), len(styles) > 0)

# ---------------------------------------------------------------------------
# 4) Bade scripts alag files mein
# ---------------------------------------------------------------------------
print("\n[4] JS -> qurb-app.js / qurb-notifications.js / qurb-data.js")
script_pat = re.compile(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", re.S)
parts = {}

def script_repl(m):
    body = m.group(1)
    if len(body) > 20000 and "var MONTHS" in body and "app" not in parts:
        parts["app"] = body
        return '<script src="qurb-data.js"></script>\n<script src="qurb-app.js"></script>'
    if len(body) > 5000 and "function loadState" in body and "notif" not in parts:
        parts["notif"] = body
        return '<script src="qurb-notifications.js"></script>'
    return m.group(0)

html = script_pat.sub(script_repl, html)
step("main app script mila", "app" in parts)
step("notifications script mila", "notif" in parts)
if "app" not in parts or "notif" not in parts:
    print("\nScripts nahi mile, ruk gaya. index.html.bak se wapas jao aur mujhe batao.")
    sys.exit(1)

app, notif = parts["app"], parts["notif"]


def extract_assignment(js, name):
    """var NAME = <literal>;  ko bracket-matching se nikaalo (strings ka khayal rakhte hue)."""
    m = re.search(r"var\s+" + name + r"\s*=\s*", js)
    if not m:
        return js, None
    i = start = m.end()
    depth, in_str, esc = 0, None, False
    while i < len(js):
        c = js[i]
        if in_str:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == in_str: in_str = None
        else:
            if c in "\"'`": in_str = c
            elif c in "[{(": depth += 1
            elif c in "]})":
                depth -= 1
                if depth == 0:
                    i += 1
                    break
        i += 1
    value = js[start:i]
    j = i
    while j < len(js) and js[j] in " \t\r\n": j += 1
    if j < len(js) and js[j] == ";": i = j + 1
    return js[:m.start()] + "var %s = window.QURB_DATA.%s;" % (name, name) + js[i:], value


data_js = "/* Qurb data: namaz ke auqaat, 40 duas, 40 hadith */\nwindow.QURB_DATA = window.QURB_DATA || {};\n"
for name in ("MONTHS", "MASNOON_40_DUAS", "HADITH_NAWAWI_40"):
    app, value = extract_assignment(app, name)
    step("data nikaala: " + name, value is not None)
    if value is not None:
        data_js += "window.QURB_DATA.%s = %s;\n\n" % (name, value)
(OUT / "qurb-data.js").write_text(data_js, encoding="utf-8")

# ---------------------------------------------------------------------------
# 5) Freeze-fix edits: notifications script
# ---------------------------------------------------------------------------
print("\n[5] Notifications fixes")

notif, n = re.subn(r"dayOffset\s*<\s*30", "dayOffset < 14", notif)
step("30 din -> 14 din ka schedule", n >= 1)

DISPATCH = """if (batch.length > 0) {
          batch.sort(function (a, b) { return a.time < b.time ? -1 : (a.time > b.time ? 1 : 0); });
          var sigStr = JSON.stringify([s.enabled, s.prayers, s.special, s.dawah, en]), sig = 5381;
          for (var si = 0; si < sigStr.length; si++) sig = ((sig << 5) + sig + sigStr.charCodeAt(si)) | 0;
          sendNotificationBridge('schedulePrayerBatch', { items: batch.slice(0, 400), sig: String(sig) });
        }"""
notif = sub1(r"if\s*\(\s*batch\.length\s*>\s*0\s*\)\s*\{\s*sendNotificationBridge\(\s*'schedulePrayerBatch'\s*,\s*\{\s*items:\s*batch\s*\}\s*\)\s*;\s*\}",
             DISPATCH, notif, "batch ab sorted + max 400 + 'sig' ke saath jaata hai")

DEBOUNCE = """// Har tarah ki sync requests (toggle, launch, Dart) 1.5 sec mein ek ho jaati hain
  var __realSync = window.__syncNativePrayerNotifications, __syncTimer = null;
  window.__syncNativePrayerNotifications = function () {
    clearTimeout(__syncTimer);
    __syncTimer = setTimeout(function () {
      try { state = loadState(); } catch (e) {}
      __realSync(state);
    }, 1500);
  };

  window.syncNativeToWeb = function"""
notif = sub1(r"window\.syncNativeToWeb\s*=\s*function", DEBOUNCE, notif, "sync debounce (1.5s)", flags=0)

LAUNCH = """// --- Launch: Flutter ko batao page ready hai. Pehli sync init() karta hai (debounced) ---
  window.addEventListener('DOMContentLoaded', function () {
    notifyAppReady();
    try { if (!localStorage.getItem(STORAGE)) saveState(); } catch (e) {}
  });"""
notif = sub1(r"//\s*---\s*AUTO-REGISTER PRAYER SCHEDULE ON LAUNCH\s*---.*?\},\s*400\s*\)\s*;\s*\}\s*\)\s*;",
             LAUNCH, notif, "launch par 'enabled=true' force karna band + duplicate sync band")

EXACT = """var __makruhDurCache = {};
  function makruhDurations(midx) {
    if (!__makruhDurCache[midx]) __makruhDurCache[midx] =
      parseMakruhDuration(document.getElementById('panel-cm' + midx)) || { sunriseSeconds: 1200, sunsetSeconds: 1200 };
    return __makruhDurCache[midx];
  }
  function exactSpecialTimes(date) {
    date = date || new Date();
    var months = window.__SALAH_MONTHS, order = window.__SALAH_MONTH_ORDER;
    var days = months && order ? months[order[date.getMonth()]] : null;
    var row = days && days[date.getDate() - 1];
    if (!row) return null;
    var dur = makruhDurations(date.getMonth());
    var sunrise = makeDateAt(date, row[2], row[3]);
    var sunset = makeDateAt(date, row[8] + 12, row[9]);
    return {
      sunrise: { start: sunrise, end: new Date(sunrise.getTime() + dur.sunriseSeconds * 1000) },
      sunset: { start: new Date(sunset.getTime() - dur.sunsetSeconds * 1000), end: sunset }
    };
  }
"""
notif = sub1(r"function exactSpecialTimes\(date\)\s*\{.*?(?=\s*function getTahajjudTime)", EXACT, notif,
             "makruh timings ab har din ki sahi row se (pehle hamesha aaj ki row thi)")

old_re = r"txt.match(/(\d+)\s*منٹ\s*(\d+)\s*سیکنڈ/)"
new_re = r"txt.match(/(\d+)\s*(?:منٹ|min)\s*(\d+)\s*(?:سیکنڈ|sec)/)"
if old_re in notif:
    notif = notif.replace(old_re, new_re, 1)
step("makruh duration English mode mein bhi parse hota hai", old_re in parts["notif"])

# ---------------------------------------------------------------------------
# 6) Freeze-fix edits: main app script
# ---------------------------------------------------------------------------
print("\n[6] App fixes")

app, n = re.subn(r"if\s*\(\s*document\.readyState\s*===\s*'loading'\s*\)\s*\{\s*document\.addEventListener\(\s*'DOMContentLoaded'\s*,\s*initHome\s*\)\s*;\s*\}\s*else\s*\{\s*initHome\(\)\s*;\s*\}", "", app)
step("initHome() ki duplicate calls hatayi (startup par 3 baar chal raha tha)", n == 1)

app, n = re.subn(r"//\s*----\s*Add to Home Screen \(first visit only\)\s*----.*?(?=\s*if\s*\(\s*'serviceWorker')", "", app, flags=re.S)
step("PWA 'Add to Home Screen' code hataya (app mein elements hi nahi, error deta tha)", n == 1)

app, n = re.subn(r"var ARTICLES_API\s*=\s*'[^']*';",
                 "var ARTICLES_API = 'https://muftimaazharoon.com/wp-json/wp/v2/posts?per_page=8&_fields=id,date,link,title,content';", app)
step("articles: 15 -> 8, sirf zaroori fields", n == 1)

LAZY = "box.querySelectorAll('img,iframe').forEach(function (el) { el.loading = 'lazy'; el.decoding = 'async'; });\n        return box.innerHTML.trim();"
if "return box.innerHTML.trim();" in app:
    app = app.replace("return box.innerHTML.trim();", LAZY, 1)
step("articles ki images lazy-load", "loading = 'lazy'" in app)

# ---------------------------------------------------------------------------
# 7) Likho
# ---------------------------------------------------------------------------
(OUT / "qurb-app.js").write_text("/* Qurb main app: home, tabs, duas, hadith, library, qibla(web), articles */\n" + app.strip() + "\n", encoding="utf-8")
(OUT / "qurb-notifications.js").write_text("/* Qurb: notification settings + native schedule builder */\n" + notif.strip() + "\n", encoding="utf-8")
SRC.write_text(html, encoding="utf-8")

print("\nFiles:")
for f in ("index.html", "qurb.css", "qurb-data.js", "qurb-app.js", "qurb-notifications.js"):
    p = OUT / f
    print("  %-26s %6d lines  %5d KB" % (f, len(p.read_text(encoding='utf-8').splitlines()), p.stat().st_size // 1024))
print("\nBackup: %s.bak" % SRC)
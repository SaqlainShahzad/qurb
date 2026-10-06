import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the hero section black text
old_hero = """.notification-title{font-size:22px;font-weight:900;color:#fff;margin:0 0 6px;letter-spacing:-.5px;line-height:1.2}
.notification-subtitle{font-size:13px;color:rgba(255,255,255,.7);margin:0;line-height:1.6}"""

new_hero = """.notification-title{font-size:22px;font-weight:900;color:#111;margin:0 0 6px;letter-spacing:-.5px;line-height:1.2}
.notification-subtitle{font-size:13px;color:rgba(17,17,17,.7);margin:0;line-height:1.6}"""
content = content.replace(old_hero, new_hero)

# Make the master toggle black text
old_master = """.notification-master-copy{min-width:0;flex:1}.notification-master-copy strong{display:block;color:#fff;font-size:15px;overflow-wrap:anywhere}.notification-master-copy span{display:block;color:rgba(255,255,255,.55);font-size:12px;margin-top:4px;line-height:1.6;overflow-wrap:anywhere}"""

new_master = """.notification-master-copy{min-width:0;flex:1}.notification-master-copy strong{display:block;color:#111;font-size:15px;overflow-wrap:anywhere}.notification-master-copy span{display:block;color:rgba(17,17,17,.65);font-size:12px;margin-top:4px;line-height:1.6;overflow-wrap:anywhere}"""
content = content.replace(old_master, new_master)

# Make section titles black text
old_section = """.notification-section-title{margin:28px 0 16px;padding:0 4px}
.notification-section-title strong{display:block;color:#fff;font-size:16px;margin-bottom:6px;font-weight:800}
.notification-section-title span{display:block;color:rgba(255,255,255,.5);font-size:12px;line-height:1.6}"""

new_section = """.notification-section-title{margin:28px 0 16px;padding:0 4px}
.notification-section-title strong{display:block;color:#111;font-size:16px;margin-bottom:6px;font-weight:800}
.notification-section-title span{display:block;color:rgba(17,17,17,.65);font-size:12px;line-height:1.6}"""
content = content.replace(old_section, new_section)

# Note color
old_note = """.notification-note{font-size:11px;color:rgba(255,255,255,.3);text-align:center;line-height:1.6;margin-top:24px;padding:0 20px}"""
new_note = """.notification-note{font-size:11px;color:rgba(17,17,17,.5);text-align:center;line-height:1.6;margin-top:24px;padding:0 20px}"""
content = content.replace(old_note, new_note)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

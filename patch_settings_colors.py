import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make #tab-settings background white
if '#tab-settings{' not in content:
    # Add #tab-settings root style
    content = content.replace('.settings-menu{', '#tab-settings{background:#ffffff;color:#111111;min-height:100vh;}.settings-menu{')

old_item_css = """#tab-settings .settings-menu-item{
  border:1px solid rgba(212,168,79,.24);
  border-radius:20px;
  overflow:hidden;
  background:linear-gradient(145deg,rgba(92,61,28,.96),rgba(55,35,17,.96));
  box-shadow:0 10px 28px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.04);
}"""
new_item_css = """#tab-settings .settings-menu-item{
  border:1px solid #e0e0e0;
  border-radius:20px;
  overflow:hidden;
  background:#ffffff;
  box-shadow:0 6px 16px rgba(0,0,0,.04);
}"""
content = content.replace(old_item_css, new_item_css)

old_btn_css = """#tab-settings .settings-menu-btn{
  width:100%;
  min-height:68px;
  border:0;
  background:transparent;
  color:#fff;
  padding:14px 16px;"""
new_btn_css = """#tab-settings .settings-menu-btn{
  width:100%;
  min-height:68px;
  border:0;
  background:transparent;
  color:#111;
  padding:14px 16px;"""
content = content.replace(old_btn_css, new_btn_css)

old_icon_css = """#tab-settings .settings-menu-icon{
  width:44px;height:44px;flex:0 0 44px;border-radius:15px;
  display:grid;place-items:center;
  background:rgba(212,168,79,.12);
  border:1px solid rgba(212,168,79,.18);
  color:#e6bd68;
}"""
new_icon_css = """#tab-settings .settings-menu-icon{
  width:44px;height:44px;flex:0 0 44px;border-radius:15px;
  display:grid;place-items:center;
  background:#f5f5f5;
  border:1px solid #e0e0e0;
  color:#111;
}"""
content = content.replace(old_icon_css, new_icon_css)

old_title_css = """#tab-settings .settings-menu-title{
  display:block;color:#fff;font-size:15px;font-weight:900;
  overflow-wrap:anywhere;
}
#tab-settings .settings-menu-sub{
  display:block;margin-top:3px;color:rgba(255,255,255,.58);
  font-size:11px;line-height:1.5;overflow-wrap:anywhere;
}"""
new_title_css = """#tab-settings .settings-menu-title{
  display:block;color:#111;font-size:15px;font-weight:900;
  overflow-wrap:anywhere;
}
#tab-settings .settings-menu-sub{
  display:block;margin-top:3px;color:#666;
  font-size:11px;line-height:1.5;overflow-wrap:anywhere;
}"""
content = content.replace(old_title_css, new_title_css)

old_chevron_css = """#tab-settings .settings-menu-chevron{
  width:30px;height:30px;flex:0 0 30px;border-radius:10px;
  display:grid;place-items:center;color:#e6bd68;
  background:rgba(255,255,255,.055);
  transition:transform .25s ease,background .25s ease;
}
#tab-settings .settings-menu-item.open .settings-menu-chevron{
  transform:rotate(180deg);
  background:rgba(212,168,79,.12);
}"""
new_chevron_css = """#tab-settings .settings-menu-chevron{
  width:30px;height:30px;flex:0 0 30px;border-radius:10px;
  display:grid;place-items:center;color:#111;
  background:#f0f0f0;
  transition:transform .25s ease,background .25s ease;
}
#tab-settings .settings-menu-item.open .settings-menu-chevron{
  transform:rotate(180deg);
  background:#e4e4e4;
}"""
content = content.replace(old_chevron_css, new_chevron_css)


with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Settings color patched!")

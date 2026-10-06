import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_update = """#tab-settings .app-update-card{
  margin-top:14px;
  padding:13px 14px;
  border-radius:17px;
  background:linear-gradient(145deg,rgba(92,61,28,.96),rgba(55,35,17,.96));
  border:1px solid rgba(212,168,79,.28);
  box-shadow:0 10px 28px rgba(0,0,0,.16),inset 0 1px 0 rgba(255,255,255,.05);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  direction:ltr;
  text-align:left;
}
#tab-settings .app-update-copy{
  min-width:0;
  flex:1;
}
#tab-settings .app-update-title{
  margin:0;
  color:#fff;
  font-size:14px;
  font-weight:900;
}
#tab-settings .app-update-sub{
  margin:4px 0 0;
  color:rgba(255,255,255,.62);
  font-size:11px;
  line-height:1.5;
}
#tab-settings .app-update-btn{
  flex:0 0 auto;
  border:1px solid rgba(255,255,255,.18);
  border-radius:12px;
  padding:9px 13px;
  background:rgba(255,255,255,.06);
  color:#fff;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  transition:background .2s,border-color .2s;
}"""

new_update = """#tab-settings .app-update-card{
  margin-top:14px;
  padding:13px 14px;
  border-radius:17px;
  background:#ffffff;
  border:1px solid #e0e0e0;
  box-shadow:0 6px 16px rgba(0,0,0,.04);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  direction:ltr;
  text-align:left;
}
#tab-settings .app-update-copy{
  min-width:0;
  flex:1;
}
#tab-settings .app-update-title{
  margin:0;
  color:#111;
  font-size:14px;
  font-weight:900;
}
#tab-settings .app-update-sub{
  margin:4px 0 0;
  color:#666;
  font-size:11px;
  line-height:1.5;
}
#tab-settings .app-update-btn{
  flex:0 0 auto;
  border:1px solid #ddd;
  border-radius:12px;
  padding:9px 13px;
  background:#f5f5f5;
  color:#111;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  transition:background .2s,border-color .2s;
}"""

content = content.replace(old_update, new_update)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Update card patched!")

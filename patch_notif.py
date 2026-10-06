import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace PRAYER_KEYS.forEach
old_prayer_keys = r"""    PRAYER_KEYS\.forEach\(function\(k\)\{
      var t=times\?times\[k\]:null;
      rows\.push\(\{kind:'prayer',key:k,name:en\?PRAYER_EN\[k\]:PRAYER_UR\[k\],sub:en\?'Notification when prayer time begins\.':'نماز کا وقت داخل ہوتے ہی notification۔',time:t\?to12\(t\[0\],t\[1\]\):'—',checked:!!state\.prayers\[k\]\}\);
    \}\);"""

new_prayer_keys = """    PRAYER_KEYS.forEach(function(k){
      var t=times?times[k]:null;
      var val = state.prayers[k];
      if(val === true) val = 'adhan';
      if(val === false) val = 'off';
      if(!val) val = 'adhan';
      rows.push({kind:'prayer',key:k,name:en?PRAYER_EN[k]:PRAYER_UR[k],sub:en?'Notification when prayer time begins.':'نماز کا وقت داخل ہوتے ہی notification۔',time:t?to12(t[0],t[1]):'—',val:val});
    });"""
content = re.sub(old_prayer_keys, new_prayer_keys, content)

# Replace els.list.innerHTML
old_html = r"""    els\.list\.innerHTML=rows\.map\(function\(r\)\{
      return '<div class="notification-row"><div class="notification-row-main"><div class="notification-row-icon">\+icon\(r\.key\)\+'</div><div><div class="notification-row-name">\+esc\(r\.name\)\+'</div><div class="notification-row-time">\+esc\(r\.sub\)\+\(r\.time!==\'—\'\?' • <b>'\+esc\(r\.time\)\+'</b>':''\)\+'</div></div></div><label class="notif-switch"><input class="notif-toggle" data-kind="'\+r\.kind\+'" data-key="'\+r\.key\+'" type="checkbox" '\+\(r\.checked\?'checked':''\)\+'><span class="notif-slider"></span></label></div>';
    \}\)\.join\(''\);"""

new_html = """    els.list.innerHTML=rows.map(function(r){
      var controlHtml = '';
      if(r.kind === 'prayer') {
         controlHtml = '<select class="notif-select" style="padding:4px;border-radius:4px;background:#2A1E14;color:#fff;border:1px solid #4a3623;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
           '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
           '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
           '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
           '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
         '</select>';
      } else {
         controlHtml = '<label class="notif-switch"><input class="notif-toggle" data-kind="'+r.kind+'" data-key="'+r.key+'" type="checkbox" '+(r.checked?'checked':'')+'><span class="notif-slider"></span></label>';
      }
      return '<div class="notification-row" style="display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;"><div class="notification-row-icon">'+icon(r.key)+'</div><div><div class="notification-row-name">'+esc(r.name)+'</div><div class="notification-row-time" style="font-size:10px;opacity:0.8;">'+esc(r.sub)+(r.time!=='—'?' • <b>'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
    }).join('');"""
content = re.sub(old_html, new_html, content)

# Replace querySelectorAll('.notif-toggle') with querySelectorAll('.notif-toggle, .notif-select')
old_query = r"""    els\.list\.querySelectorAll\('\.notif-toggle'\)\.forEach\(function\(input\)\{
      input\.addEventListener\('change',function\(\)\{
        var key=input\.dataset\.key;
        if\(input\.dataset\.kind==='prayer'\)state\.prayers\[key\]=input\.checked;
        else state\.special\[key\]=input\.checked;"""

new_query = """    els.list.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){
      input.addEventListener('change',function(){
        var key=input.dataset.key;
        if(input.dataset.kind==='prayer')state.prayers[key]=input.value;
        else state.special[key]=input.checked;"""
content = re.sub(old_query, new_query, content)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

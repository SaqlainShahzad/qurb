with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_generation = """    rows.push({kind:'special',key:'sunrise',name:en?'Sunrise': 'طلوعِ شمس',sub:en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes()):'—',checked:!!state.special.sunrise});
    rows.push({kind:'special',key:'makruhStart',name:en?'Makruh Time Start':'مکروہ وقت شروع',sub:en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes())+' / '+to12(special.sunset.start.getHours(),special.sunset.start.getMinutes()):'—',checked:!!state.special.makruhStart});
    rows.push({kind:'special',key:'makruhEnd',name:en?'Makruh Time End':'مکروہ وقت ختم',sub:en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔',time:special?to12(special.sunrise.end.getHours(),special.sunrise.end.getMinutes())+' / '+to12(special.sunset.end.getHours(),special.sunset.end.getMinutes()):'—',checked:!!state.special.makruhEnd});

    els.list.innerHTML=rows.map(function(r){
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

new_generation = """    var sSunrise = state.special.sunrise; if(sSunrise===true) sSunrise='beep'; if(sSunrise===false) sSunrise='off'; if(!sSunrise) sSunrise='beep';
    var sMakruhS = state.special.makruhStart; if(sMakruhS===true) sMakruhS='beep'; if(sMakruhS===false) sMakruhS='off'; if(!sMakruhS) sMakruhS='beep';
    var sMakruhE = state.special.makruhEnd; if(sMakruhE===true) sMakruhE='beep'; if(sMakruhE===false) sMakruhE='off'; if(!sMakruhE) sMakruhE='beep';

    rows.push({kind:'special',key:'sunrise',name:en?'Sunrise': 'طلوعِ شمس',sub:en?'Notification at sunrise.':'سورج طلوع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes()):'—',val:sSunrise});
    rows.push({kind:'special',key:'makruhStart',name:en?'Makruh Time Start':'مکروہ وقت شروع',sub:en?'Notification when the morning and sunset Makruh periods begin.':'صبح اور غروب دونوں کے مکروہ وقت شروع ہوتے ہی notification۔',time:special?to12(special.sunrise.start.getHours(),special.sunrise.start.getMinutes())+' / '+to12(special.sunset.start.getHours(),special.sunset.start.getMinutes()):'—',val:sMakruhS});
    rows.push({kind:'special',key:'makruhEnd',name:en?'Makruh Time End':'مکروہ وقت ختم',sub:en?'Notification when the morning and sunset Makruh periods end.':'صبح اور غروب دونوں کے مکروہ اوقات ختم ہوتے ہی notification۔',time:special?to12(special.sunrise.end.getHours(),special.sunrise.end.getMinutes())+' / '+to12(special.sunset.end.getHours(),special.sunset.end.getMinutes()):'—',val:sMakruhE});

    els.list.innerHTML=rows.map(function(r){
      var controlHtml = '<select class="notif-select" style="padding:6px;border-radius:6px;background:#ffffff;color:#111111;border:1px solid #ddd;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
           '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
           '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
           '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
           '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
         '</select>';
      return '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
    }).join('');"""

if old_generation in content:
    content = content.replace(old_generation, new_generation)
    print("Successfully patched HTML generation!")
else:
    print("Could not find old_generation.")

# We also need to fix the theme to Pure White and Black for the `.notification-settings` container itself!
old_css_panel = """#tab-settings .settings-menu-panel-inner .notification-settings{
  padding:0 10px 12px;
}"""

new_css_panel = """#tab-settings .settings-menu-panel-inner .notification-settings{
  padding:12px;
  background:#ffffff;
  border-radius:0 0 20px 20px;
}"""
content = content.replace(old_css_panel, new_css_panel)

old_hero_top = """#tab-settings .notification-hero-top{
  display:flex;align-items:center;gap:12px;
}"""
new_hero_top = """#tab-settings .notification-hero-top{
  display:flex;align-items:center;gap:12px;
  color:#111111;
}"""
content = content.replace(old_hero_top, new_hero_top)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

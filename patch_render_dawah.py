import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update els mapping to include dawahList
content = content.replace("list:document.getElementById('notificationList'),", "list:document.getElementById('notificationList'),dawahList:document.getElementById('dawahList'),")

# Update render logic to separate them
old_render = """      var finalHtml = '';
      rows.forEach(function(r) {
        try {
          var controlHtml = '';
          if(r.kind === 'dawah') {
             controlHtml = '<label class="notif-switch" aria-label="'+esc(r.name)+'"><input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="'+r.key+'" '+(r.val?'checked':'')+'><span class="notif-slider"></span></label>';
          } else {
             controlHtml = '<select class="notif-select" style="padding:6px;border-radius:6px;background:#ffffff;color:#111111;border:1px solid #ddd;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
               '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
               '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
               '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
               '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
             '</select>';
          }
          finalHtml += '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
        } catch(rowErr) {}
      });
      els.list.innerHTML = finalHtml;
    } catch(err) {
      els.list.innerHTML = '<div style="color:red;padding:10px;">Render Error: ' + err.message + '</div>';
    }

    els.list.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){"""

new_render = """      var finalHtml = '';
      var dawahHtml = '';
      rows.forEach(function(r) {
        try {
          var controlHtml = '';
          if(r.kind === 'dawah') {
             controlHtml = '<label class="notif-switch" aria-label="'+esc(r.name)+'"><input type="checkbox" class="notif-toggle" data-kind="dawah" data-key="'+r.key+'" '+(r.val?'checked':'')+'><span class="notif-slider"></span></label>';
          } else {
             controlHtml = '<select class="notif-select" style="padding:6px;border-radius:6px;background:#ffffff;color:#111111;border:1px solid #ddd;font-size:12px;outline:none;" data-kind="'+r.kind+'" data-key="'+r.key+'">' + 
               '<option value="adhan" '+(r.val==='adhan'?'selected':'')+'>'+(en?'Full Adhan':'پوری اذان')+'</option>' + 
               '<option value="beep" '+(r.val==='beep'?'selected':'')+'>'+(en?'Beep / Tone':'مختصر آواز')+'</option>' + 
               '<option value="silent" '+(r.val==='silent'?'selected':'')+'>'+(en?'Silent':'خاموش')+'</option>' + 
               '<option value="off" '+(r.val==='off'?'selected':'')+'>'+(en?'Disabled / Off':'بند')+'</option>' + 
             '</select>';
          }
          var rowMarkup = '<div class="notification-row" style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;"><div class="notification-row-main" style="flex:1;margin-right:10px;display:flex;align-items:center;"><div class="notification-row-icon" style="background:#f5f5f5;color:#111;padding:8px;border-radius:8px;margin-right:12px;">'+icon(r.key)+'</div><div><div class="notification-row-name" style="color:#111;font-weight:bold;font-size:14px;">'+esc(r.name)+'</div><div class="notification-row-time" style="color:#666;font-size:11px;margin-top:2px;">'+esc(r.sub)+(r.time!=='—'?' • <b style="color:#111">'+esc(r.time)+'</b>':'')+'</div></div></div><div class="notif-control">'+controlHtml+'</div></div>';
          
          if(r.kind === 'dawah') {
              dawahHtml += rowMarkup;
          } else {
              finalHtml += rowMarkup;
          }
        } catch(rowErr) {}
      });
      els.list.innerHTML = finalHtml;
      if(els.dawahList) els.dawahList.innerHTML = dawahHtml;
    } catch(err) {
      els.list.innerHTML = '<div style="color:red;padding:10px;">Render Error: ' + err.message + '</div>';
    }

    document.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){"""

if old_render in content:
    content = content.replace(old_render, new_render)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched render to separate dawahList")
else:
    print("Could not find old render")

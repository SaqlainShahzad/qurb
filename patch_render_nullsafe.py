import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make els bindings null-safe in render()
old_render = """    els.title.textContent=en?'Prayer Notifications':'نماز کی اطلاعات';
    els.sub.textContent=en?'Manage prayer, sunrise and Makruh notification and reminder options.':'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
    els.masterTitle.textContent=en?'All Notifications':'تمام notifications';
    els.masterSub.textContent=en?'Master switch for all prayer, sunrise and Makruh notifications.':'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
    els.note.textContent=en?'For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.':'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔ Server push + cron کے بعد منتخب notifications app بند یا phone lock ہونے پر بھی آ سکتی ہیں۔';
    els.permission.textContent=permissionText();
    els.permission.className='notification-status '+permissionClass();
    els.permissionBtn.textContent=permissionButtonText();"""

new_render = """    if(els.title) els.title.textContent=en?'Prayer Notifications':'نماز کی اطلاعات';
    if(els.sub) els.sub.textContent=en?'Manage prayer, sunrise and Makruh notification and reminder options.':'ہر نماز، طلوعِ شمس اور اوقاتِ مکروہ کی notification کو الگ الگ On/Off کریں۔';
    if(els.masterTitle) els.masterTitle.textContent=en?'All Notifications':'تمام notifications';
    if(els.masterSub) els.masterSub.textContent=en?'Master switch for all prayer, sunrise and Makruh notifications.':'تمام نمازوں، طلوعِ شمس اور اوقاتِ مکروہ کی notifications کا master switch۔';
    if(els.note) els.note.textContent=en?'For best results, install the app on your Home Screen and allow notifications. After server push is enabled, reminders can arrive even when the app is closed or your phone is locked.':'App کو Home Screen پر install کریں اور Notifications کی اجازت دیں۔ Server push + cron کے بعد منتخب notifications app بند یا phone lock ہونے پر بھی آ سکتی ہیں۔';
    if(els.permission) els.permission.textContent=permissionText();
    if(els.permission) els.permission.className='notification-status '+permissionClass();
    if(els.permissionBtn) els.permissionBtn.textContent=permissionButtonText();"""

if old_render in content:
    content = content.replace(old_render, new_render)
    with open('assets/web/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched render to be null-safe")
else:
    print("Could not find old render text")

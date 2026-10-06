with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_listener = """    els.list.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){
      input.addEventListener('change',function(){
        var key=input.dataset.key;
        if(input.dataset.kind==='prayer')state.prayers[key]=input.value;
        else state.special[key]=input.checked;
        saveState();"""

new_listener = """    els.list.querySelectorAll('.notif-toggle, .notif-select').forEach(function(input){
      input.addEventListener('change',function(){
        var key=input.dataset.key;
        var val = input.value !== undefined ? input.value : input.checked;
        if(input.dataset.kind==='prayer')state.prayers[key]=val;
        else state.special[key]=val;
        saveState();"""

content = content.replace(old_listener, new_listener)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

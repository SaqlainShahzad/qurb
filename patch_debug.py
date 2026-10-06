with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """  function render(){
    if(!els.list)return;
    var en=isEnglish();"""

new_block = """  function render(){
    if(!els.list)return;
    try {
    var en=isEnglish();"""

old_block2 = """    } else {
      setServerStatus(en?'Server push not connected yet.':'Server push is not connected yet.','');
    }
  }
  function testNotification(){"""

new_block2 = """    } else {
      setServerStatus(en?'Server push not connected yet.':'Server push is not connected yet.','');
    }
    } catch(err) {
       els.list.innerHTML = '<div style="color:red;padding:20px;">ERROR: ' + err.message + '<br>' + err.stack + '</div>';
    }
  }
  function testNotification(){"""

if old_block in content:
    content = content.replace(old_block, new_block)
if old_block2 in content:
    content = content.replace(old_block2, new_block2)
    print("Debug patched successfully.")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

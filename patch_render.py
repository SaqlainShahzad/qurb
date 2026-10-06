import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_render = """
      // Master Toggle
      var master = document.getElementById('notifMaster');
      if (master) master.checked = !!state.enabled;

      // Sync custom toggles & selects
      var selects = document.querySelectorAll('.notif-select');
      for(var i = 0; i < selects.length; i++) {
        var sel = selects[i];
        var kind = sel.dataset.kind;
        var key = sel.dataset.key;
        var val = 'adhan';
        if (kind === 'prayer' && state.prayers) val = state.prayers[key] !== undefined ? state.prayers[key] : 'adhan';
        if (kind === 'special' && state.special) val = state.special[key] !== undefined ? state.special[key] : 'beep';
        
        // Find corresponding toggle
        var toggle = document.querySelector('.indiv-toggle[data-key="'+key+'"]');
        if (toggle) {
           toggle.checked = (val !== false && val !== 'off' && val !== 'mute');
           sel.value = (val === false || val === 'off' || val === 'mute') ? 'adhan' : val;
        } else {
           sel.value = val;
        }
      }
      
      // Sync Additional Alerts
      if (state.special) {
         if (document.getElementById('preAdhanSlider') && state.special.preAdhanMinutes !== undefined) {
             document.getElementById('preAdhanSlider').value = state.special.preAdhanMinutes;
             document.getElementById('preAdhanLabel').textContent = state.special.preAdhanMinutes + ' minutes before';
         }
         if (document.getElementById('iqamahToggle')) document.getElementById('iqamahToggle').checked = !!state.special.iqamahAlert;
         if (document.getElementById('jummahToggle')) document.getElementById('jummahToggle').checked = !!state.special.jummahAlert;
      }
      if (state.dawah && document.getElementById('adhkarToggle')) {
         document.getElementById('adhkarToggle').checked = !!state.dawah.morning;
      }
"""

content = re.sub(
    r"      // Sync prayer and special selects in static HTML.*?      }",
    new_render.strip(),
    content,
    flags=re.DOTALL
)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

import re
import json

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I don't need to actually run it, I can just see if there's a syntax error that Python can't catch but a real JS engine does.
# But wait, look at the end of `old_block`:
# `var val = input.value !== undefined ? input.value : input.checked;`
# This was in `old_block` of `patch_render_dawah.py`.

# If there's an error, it is almost certainly a JS exception thrown during `render()`.

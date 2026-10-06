# -*- coding: utf-8 -*-
with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure DOMContentLoaded triggers the splash removal
old_splash_trigger = "  // Hide splash screen on boot\n  setTimeout(function(){\n    var sp=document.getElementById('salahSplash');\n    if(sp) sp.style.display='none';\n  }, 50);"
new_splash_trigger = "  // Hide splash screen on boot\n  document.addEventListener('DOMContentLoaded', function() {\n    var sp=document.getElementById('salahSplash');\n    if(sp) sp.style.display='none';\n  });"

if old_splash_trigger in content:
    content = content.replace(old_splash_trigger, new_splash_trigger)
    print("Replaced old splash trigger.")
else:
    print("Old splash trigger not found. Maybe it's different.")

# Defer loadArticles
old_load_articles = "    if (name === 'articles' && typeof loadArticles === 'function') loadArticles();"
# Well loadArticles is only called when name === 'articles' anyway... Wait, let's look if it's called on initHome or something.

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

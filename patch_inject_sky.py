import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

with open('skyRenderer.js', 'r', encoding='utf-8') as f:
    sky_js = f.read()

# Inject before the closing </body> tag
inject_str = f"\n<script>\n{sky_js}\n</script>\n</body>"

if "skyCanvas" in content:
    if "getCurrentPhase()" not in content:
        content = content.replace("</body>", inject_str)
        with open('assets/web/index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Sky Renderer injected successfully")
    else:
        print("Sky Renderer already injected")
else:
    print("skyCanvas not found in HTML")

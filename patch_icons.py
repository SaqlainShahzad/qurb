with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_icon = "makruhEnd:'<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"m8.5 12 2.3 2.3 4.7-5\"/>'};return '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\">'+icons[key]+'</svg>';}"
new_icon = "makruhEnd:'<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"m8.5 12 2.3 2.3 4.7-5\"/>', morning:'<circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42\"/>', sleep:'<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/>'};return '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\">'+(icons[key]||'')+'</svg>';}"

if old_icon in content:
    content = content.replace(old_icon, new_icon)
    print("Icon patched successfully.")
else:
    print("Icon block not found!")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

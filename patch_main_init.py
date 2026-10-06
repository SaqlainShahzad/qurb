with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

old_init = "AndroidInitializationSettings('@drawable/ic_notification');"
new_init = "AndroidInitializationSettings('@mipmap/ic_launcher');"

if old_init in content:
    content = content.replace(old_init, new_init)
    with open('lib/main.dart', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Initialization setting patched.")
else:
    print("Not found.")

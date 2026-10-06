import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

inject_case = """        case 'openNativeSettings':
          if (!mounted) return;
          _showNativeNotificationSettings(context, data['times'] as Map<String, dynamic>? ?? {});
          break;
"""

if "case 'openNativeSettings':" not in content:
    content = content.replace("switch (action) {", "switch (action) {\n" + inject_case)
    with open('lib/main.dart', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected case successfully.")
else:
    print("Case already injected.")

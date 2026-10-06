with open('lib/features/quran/pages/main_page.dart', 'r') as f:
    content = f.read()

import re

# Remove the two arrow IconButtons
pattern = re.compile(r'      actions: \[\n        IconButton\(\n          tooltip: "Next \$\{paraText\(\)\}",\n          icon: const Icon\(Icons\.arrow_back\),\n          onPressed: \(\) \{\n            _paraModel\.setCurrentPara\(_paraModel\.currentPara \+ 1\);\n          \},\n        \),\n        IconButton\(\n          tooltip: "Previous \$\{paraText\(\)\}",\n          icon: const Icon\(Icons\.arrow_forward\),\n          onPressed: \(\) \{\n            _paraModel\.setCurrentPara\(_paraModel\.currentPara - 1\);\n          \},\n        \),')

content = pattern.sub('      actions: [', content)

with open('lib/features/quran/pages/main_page.dart', 'w') as f:
    f.write(content)

with open('lib/main.dart', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "onPageFinished: (String url) {" in line and not skip:
        skip = True
        continue
    if skip:
        if "}," in line:
            skip = False
        continue
    new_lines.append(line)

with open('lib/main.dart', 'w') as f:
    f.writelines(new_lines)

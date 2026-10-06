with open('lib/main.dart', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find the last line that is just '}\n' or '}' which closes _QurbWebViewScreenState
# since it's the last class in main.dart:
last_brace_idx = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '}':
        last_brace_idx = i
        break

if last_brace_idx != -1:
    print(f"Found at {last_brace_idx}")
else:
    print("Not found")

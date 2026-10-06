import re
import js2py

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
js = "\n".join(scripts)
print(len(js))

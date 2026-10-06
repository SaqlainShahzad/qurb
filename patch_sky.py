import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'\.hero\{.*?\.hero::after\{.*?\}', content, re.DOTALL)
if match:
    old_css = match.group(0)
    new_css = """.hero{
  background: #0b101e;
  color:#fff;
  padding:12px 16px 16px;
  border-radius:0 0 var(--r-xl) var(--r-xl);
  position:relative;
  overflow:hidden;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.hero canvas.sky-canvas {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}
.hero > * {
  position: relative;
  z-index: 1;
}
.hero::after{
  content:"";
  position:absolute; inset:0; border-radius:0 0 var(--r-xl) var(--r-xl);
  background:radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,.06), transparent 60%);
  pointer-events:none;
  z-index: 1;
}"""
    content = content.replace(old_css, new_css)
    print("CSS replaced")

old_hero = """    <div class="hero">
      <div class="hero-top">"""
new_hero = """    <div class="hero">
      <canvas id="skyCanvas" class="sky-canvas"></canvas>
      <div class="hero-top">"""
if old_hero in content:
    content = content.replace(old_hero, new_hero)
    print("HTML replaced")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

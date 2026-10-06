with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_accordion_css = """#tab-settings .settings-menu-panel{
  display:grid;
  grid-template-rows:0fr;
  transition:grid-template-rows .32s ease;
}
#tab-settings .settings-menu-panel-inner{
  min-height:0;overflow:hidden;
}
#tab-settings .settings-menu-item.open .settings-menu-panel{
  grid-template-rows:1fr;
}"""

new_accordion_css = """#tab-settings .settings-menu-panel{
  display:none;
}
#tab-settings .settings-menu-panel-inner{
  overflow:hidden;
}
#tab-settings .settings-menu-item.open .settings-menu-panel{
  display:block;
}"""

if old_accordion_css in content:
    content = content.replace(old_accordion_css, new_accordion_css)
    print("Accordion CSS patched to display:block!")
else:
    print("Could not find accordion CSS!")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

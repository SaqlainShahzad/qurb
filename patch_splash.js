const fs = require('fs');
let html = fs.readFileSync('assets/web/index.html', 'utf8');

// Remove HTML splash
html = html.replace(/<!-- Premium Salah App Splash Screen -->[\s\S]*?<div class="app-shell"/, '<div class="app-shell"');

// Remove JS splash
html = html.replace(/\/\* Premium splash:[\s\S]*?var splash = document\.getElementById\('salahSplash'\);[\s\S]*?document\.readyState === 'loading'[\s\S]*?\}\)[\s\S]*?\}\)\(\);/, '');

fs.writeFileSync('assets/web/index.html', html);

const fs = require('fs');
const html = fs.readFileSync('assets/web/index.html', 'utf8');

// extract the JS script tag contents that has the notification logic
let js = html.split('<script>')[1].split('</script>')[0]; 
js += '\n\n' + html.split('<script>')[2].split('</script>')[0];
js += '\n\n' + html.split('<script>')[3].split('</script>')[0];

console.log(js.length);

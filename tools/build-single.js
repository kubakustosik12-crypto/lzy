// Składa całą grę w jeden plik dist/binding-of-ignaczak.html (gra solo i co-op lokalny bez serwera;
// co-op online wymaga serwera). Użycie: npm run build
'use strict';
const fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public'), OUT = path.join(__dirname, '..', 'dist');
const MIME = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ttf': 'font/ttf' };
const dataUri = (rel) => 'data:' + MIME[path.extname(rel)] + ';base64,' + fs.readFileSync(path.join(PUB, rel)).toString('base64');
const embed = {};
function walk(dir) { for (const f of fs.readdirSync(path.join(PUB, dir))) { const rel = dir + '/' + f; if (fs.statSync(path.join(PUB, rel)).isDirectory()) walk(rel); else if (MIME[path.extname(f)] && !rel.includes('/font/')) embed[rel] = dataUri(rel); } }
walk('assets');
let html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
let css = fs.readFileSync(path.join(PUB, 'css/style.css'), 'utf8').replace('url(../assets/font/ignaczak-pixel.ttf)', 'url(' + dataUri('assets/font/ignaczak-pixel.ttf') + ')');
html = html.replace(/<link rel="stylesheet" href="css\/style\.css[^"]*">/, () => '<style>\n' + css + '\n</style>');
const scripts = [...html.matchAll(/<script src="(js\/[^"?]+)(?:\?[^"]*)?"><\/script>\n?/g)];
const code = scripts.map(m => fs.readFileSync(path.join(PUB, m[1]), 'utf8')).join('\n');
scripts.forEach(m => { html = html.replace(m[0], ''); });
html = html.replace('</body>', () => '<script>window.EMBED = ' + JSON.stringify(embed) + ';</script>\n<script>\n' + code.replace(/<\/script/g, '<\\/script') + '\n</script>\n</body>');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'binding-of-ignaczak.html'), html);
console.log('dist/binding-of-ignaczak.html', (html.length / 1048576).toFixed(2), 'MB');

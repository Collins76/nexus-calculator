/* Copies web files into www/ for Capacitor packaging */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const wwwDir = path.join(root, 'www');

const files = ['index.html', 'styles.css', 'app.js', 'manifest.json', 'sw.js', 'icon.svg'];
const dirs = ['icons'];

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

if (fs.existsSync(wwwDir)) fs.rmSync(wwwDir, { recursive: true, force: true });
fs.mkdirSync(wwwDir);

for (const f of files) {
    if (fs.existsSync(path.join(root, f))) {
        fs.copyFileSync(path.join(root, f), path.join(wwwDir, f));
        console.log(`  ✓ ${f}`);
    }
}
for (const d of dirs) {
    if (fs.existsSync(path.join(root, d))) {
        copyRecursive(path.join(root, d), path.join(wwwDir, d));
        console.log(`  ✓ ${d}/ (folder)`);
    }
}
console.log('\nBuild complete. Run `npx cap sync android` next.');

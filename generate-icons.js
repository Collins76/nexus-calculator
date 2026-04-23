const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
    { size: 48, name: 'icon-48.png' },
    { size: 72, name: 'icon-72.png' },
    { size: 96, name: 'icon-96.png' },
    { size: 128, name: 'icon-128.png' },
    { size: 144, name: 'icon-144.png' },
    { size: 152, name: 'icon-152.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 256, name: 'icon-256.png' },
    { size: 384, name: 'icon-384.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 1024, name: 'icon-1024.png' },
    { size: 32, name: 'favicon-32.png' },
    { size: 16, name: 'favicon-16.png' }
];

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

const svgBuffer = fs.readFileSync(path.join(__dirname, 'icon.svg'));

(async () => {
    console.log('Generating icons...');
    for (const { size, name } of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(iconsDir, name));
        console.log(`  ✓ ${name} (${size}x${size})`);
    }

    // Maskable icon (with safe zone padding)
    await sharp(svgBuffer)
        .resize(410, 410)
        .extend({
            top: 51, bottom: 51, left: 51, right: 51,
            background: { r: 99, g: 102, b: 241, alpha: 1 }
        })
        .png()
        .toFile(path.join(iconsDir, 'icon-maskable-512.png'));
    console.log('  ✓ icon-maskable-512.png (512x512 with safe zone)');

    // Play Store feature graphic (1024x500)
    const featureGraphic = Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0a0e1a"/>
                    <stop offset="100%" stop-color="#1a1f38"/>
                </linearGradient>
                <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1"/>
                    <stop offset="100%" stop-color="#ec4899"/>
                </linearGradient>
            </defs>
            <rect width="1024" height="500" fill="url(#bg)"/>
            <circle cx="850" cy="250" r="200" fill="url(#accent)" opacity="0.15"/>
            <circle cx="150" cy="250" r="150" fill="#8b5cf6" opacity="0.12"/>
            <rect x="60" y="175" width="150" height="150" rx="34" fill="url(#accent)"/>
            <text x="135" y="275" text-anchor="middle" fill="white" font-family="sans-serif" font-size="88" font-weight="700">∑</text>
            <text x="250" y="230" fill="white" font-family="sans-serif" font-size="64" font-weight="700">Nexus Calculator</text>
            <text x="250" y="285" fill="#cbd5e1" font-family="sans-serif" font-size="28" font-weight="400">Smart AI-Powered Calculator</text>
            <text x="250" y="335" fill="#94a3b8" font-family="sans-serif" font-size="22">Currency • Metric • Voice • AI • 10 Themes</text>
        </svg>
    `);
    await sharp(featureGraphic).png().toFile(path.join(iconsDir, 'feature-graphic-1024x500.png'));
    console.log('  ✓ feature-graphic-1024x500.png (Play Store)');

    console.log('\nDone! Icons generated in ./icons/');
})().catch(e => { console.error(e); process.exit(1); });

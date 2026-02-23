const sharp = require('sharp');
const path = require('path');

function createSvg(size) {
  const rx = Math.round(size * 0.1875);
  const fontSize = Math.round(size * 0.625);
  const textY = Math.round(size * 0.72);
  const cx = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#g)"/>
  <text x="${cx}" y="${textY}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${fontSize}" font-weight="700" fill="white">S</text>
</svg>`;
}

async function generate() {
  const publicDir = path.join(__dirname, '..', 'public');

  await sharp(Buffer.from(createSvg(192)))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(createSvg(512)))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Icons generated successfully: icon-192.png, icon-512.png');
}

generate().catch(console.error);

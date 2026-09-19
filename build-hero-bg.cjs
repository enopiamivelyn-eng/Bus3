// Builds the hero background from b.png (a square 1254x1254 sunset-highway photo).
//
// The layout puts the login card on the RIGHT, so the bus (right of centre in the
// source) must stay visible there, while the left side needs calm sky/road for the
// headline. We therefore bias the crop to the right and output a wide 16:9 strip.
const sharp = require('sharp');
const fs = require('fs');

const SRC = 'c:/Users/Admin/OneDrive/BUST/b.png';
const OUT = 'c:/Users/Admin/OneDrive/BUST/ticket/public/hero-bus-bg.webp';

async function main() {
  const { width: sw, height: sh } = await sharp(SRC).metadata();
  console.log('source:', sw, 'x', sh);

  // Target aspect for a full-bleed desktop hero.
  const TARGET_AR = 16 / 9;
  let cropW;
  let cropH;
  if (sw / sh > TARGET_AR) {
    cropH = sh;
    cropW = Math.round(sh * TARGET_AR);
  } else {
    cropW = sw;
    cropH = Math.round(sw / TARGET_AR);
  }

  // Keep the right-hand part of the frame (the bus), rather than centring.
  const left = Math.min(sw - cropW, Math.round((sw - cropW) * 0.72));
  const top = Math.min(sh - cropH, Math.round((sh - cropH) * 0.55));
  console.log(`crop ${cropW}x${cropH} at (${left}, ${top})`);

  await sharp(SRC)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 82, effort: 6 })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log('wrote:', OUT);
  console.log(
    'result:',
    meta.width + 'x' + meta.height,
    '|',
    Math.round(fs.statSync(OUT).size / 1024),
    'KB (was',
    Math.round(fs.statSync(SRC).size / 1024),
    'KB)'
  );
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });

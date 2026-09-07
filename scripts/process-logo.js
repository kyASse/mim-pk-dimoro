const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processLogos() {
  const img1Path = 'C:/Users/akyas/.gemini/antigravity/brain/43185917-4188-4bcd-af0f-b7f10ca01b17/.user_uploaded/media_1787148425542.jpg';
  const img2Path = 'C:/Users/akyas/.gemini/antigravity/brain/43185917-4188-4bcd-af0f-b7f10ca01b17/.user_uploaded/media_1787148425544.jpg';

  console.log('1. Processing Emblem Logo (media_1787148425542.jpg)...');
  
  // Center is at (500, 381), Radius is 357
  const cx = 500;
  const cy = 381;
  const r = 357;
  const size = r * 2; // 714
  const left = cx - r;
  const top = cy - r;

  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${r}" cy="${r}" r="${r - 0.5}" fill="white" />
    </svg>`
  );

  const emblemBuffer = await sharp(img1Path)
    .extract({ left, top, width: size, height: size })
    .composite([{
      input: maskSvg,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'app');

  // Save circular PNG logo (primary logo)
  const logoPngPath = path.join(publicDir, 'logo-mim-pk-dimoro.png');
  await sharp(emblemBuffer)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(logoPngPath);
  console.log('Saved:', logoPngPath);

  // Save circular WebP logo
  const logoWebpPath = path.join(publicDir, 'logo-mim-pk-dimoro.webp');
  await sharp(emblemBuffer)
    .webp({ quality: 95 })
    .toFile(logoWebpPath);
  console.log('Saved:', logoWebpPath);

  // Save SVG fallback wrapper with embedded high-res PNG base64
  const base64Png = emblemBuffer.toString('base64');
  const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
  <image width="512" height="512" xlink:href="data:image/png;base64,${base64Png}" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'logo-mim-pk-dimoro.svg'), svgWrapper);
  console.log('Saved: logo-mim-pk-dimoro.svg');

  // Save App Icon (icon.png) for Next.js App Router metadata
  const iconPngPath = path.join(appDir, 'icon.png');
  await sharp(emblemBuffer)
    .resize(192, 192)
    .png()
    .toFile(iconPngPath);
  console.log('Saved:', iconPngPath);

  // Save Apple Icon (apple-icon.png)
  const appleIconPath = path.join(appDir, 'apple-icon.png');
  await sharp(emblemBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIconPath);
  console.log('Saved:', appleIconPath);

  // Save Favicon 32x32 png
  const favicon32Buffer = await sharp(emblemBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon32Buffer);
  console.log('Saved: favicon-32x32.png');

  // Save Favicon 16x16 png
  const favicon16Buffer = await sharp(emblemBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), favicon16Buffer);
  console.log('Saved: favicon-16x16.png');

  // Generate multi-resolution ICO file (32x32 & 16x16)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(2, 4); // 2 images

  const entry1 = Buffer.alloc(16);
  entry1.writeUInt8(32, 0);
  entry1.writeUInt8(32, 1);
  entry1.writeUInt8(0, 2);
  entry1.writeUInt8(0, 3);
  entry1.writeUInt16LE(1, 4);
  entry1.writeUInt16LE(32, 6);
  entry1.writeUInt32LE(favicon32Buffer.length, 8);
  entry1.writeUInt32LE(6 + 16 * 2, 12);

  const entry2 = Buffer.alloc(16);
  entry2.writeUInt8(16, 0);
  entry2.writeUInt8(16, 1);
  entry2.writeUInt8(0, 2);
  entry2.writeUInt8(0, 3);
  entry2.writeUInt16LE(1, 4);
  entry2.writeUInt16LE(32, 6);
  entry2.writeUInt32LE(favicon16Buffer.length, 8);
  entry2.writeUInt32LE(6 + 16 * 2 + favicon32Buffer.length, 12);

  const icoBuffer = Buffer.concat([header, entry1, entry2, favicon32Buffer, favicon16Buffer]);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Saved: app/favicon.ico & public/favicon.ico');

  // 2. Process Horizontal Banner Logo (media_1787148425544.jpg)
  console.log('\n2. Processing Horizontal Logo Banner (media_1787148425544.jpg)...');
  
  const bannerMaskSvg = Buffer.from(
    `<svg width="1024" height="271">
      <rect x="0" y="0" width="1024" height="271" rx="80" ry="80" fill="white" />
    </svg>`
  );

  const bannerBuffer = await sharp(img2Path)
    .composite([{
      input: bannerMaskSvg,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const bannerPngPath = path.join(publicDir, 'logo-mim-pk-dimoro-horizontal.png');
  await sharp(bannerBuffer)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(bannerPngPath);
  console.log('Saved:', bannerPngPath);

  const bannerWebpPath = path.join(publicDir, 'logo-mim-pk-dimoro-horizontal.webp');
  await sharp(bannerBuffer)
    .webp({ quality: 95 })
    .toFile(bannerWebpPath);
  console.log('Saved:', bannerWebpPath);

  console.log('\nDone processing all logos!');
}

processLogos().catch(console.error);

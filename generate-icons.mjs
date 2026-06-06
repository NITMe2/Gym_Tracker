import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join } from 'path'

// Standard launcher icon — dark bg + barbell
const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="0" fill="#0D0D0D"/>
  <rect x="8"   y="52"  width="32" height="88" rx="10" fill="#00E5A0"/>
  <rect x="40"  y="70"  width="18" height="52" rx="6"  fill="#00E5A0" opacity="0.75"/>
  <rect x="58"  y="86"  width="76" height="20" rx="8"  fill="#00E5A0" opacity="0.55"/>
  <rect x="134" y="70"  width="18" height="52" rx="6"  fill="#00E5A0" opacity="0.75"/>
  <rect x="152" y="52"  width="32" height="88" rx="10" fill="#00E5A0"/>
</svg>`

// Adaptive foreground — barbell centered in 108dp safe zone, transparent bg
// Safe zone is center 72/108 = 66% — barbell fits within that
const foregroundSvg = (size) => {
  // Map 192 design space into the safe zone (18..90 in 108dp units, scaled)
  const pad = Math.round(size * 0.167) // 18/108
  const inner = size - pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${pad + inner * 0.04}"  y="${pad + inner * 0.27}" width="${inner * 0.17}" height="${inner * 0.46}" rx="${inner * 0.05}" fill="#00E5A0"/>
  <rect x="${pad + inner * 0.21}" y="${pad + inner * 0.36}" width="${inner * 0.09}" height="${inner * 0.27}" rx="${inner * 0.03}" fill="#00E5A0" opacity="0.75"/>
  <rect x="${pad + inner * 0.30}" y="${pad + inner * 0.45}" width="${inner * 0.40}" height="${inner * 0.10}" rx="${inner * 0.04}" fill="#00E5A0" opacity="0.55"/>
  <rect x="${pad + inner * 0.70}" y="${pad + inner * 0.36}" width="${inner * 0.09}" height="${inner * 0.27}" rx="${inner * 0.03}" fill="#00E5A0" opacity="0.75"/>
  <rect x="${pad + inner * 0.79}" y="${pad + inner * 0.27}" width="${inner * 0.17}" height="${inner * 0.46}" rx="${inner * 0.05}" fill="#00E5A0"/>
</svg>`
}

const densities = [
  { name: 'mipmap-mdpi',    icon: 48,  fg: 108 },
  { name: 'mipmap-hdpi',    icon: 72,  fg: 162 },
  { name: 'mipmap-xhdpi',   icon: 96,  fg: 216 },
  { name: 'mipmap-xxhdpi',  icon: 144, fg: 324 },
  { name: 'mipmap-xxxhdpi', icon: 192, fg: 432 },
]

const base = 'android/app/src/main/res'

for (const { name, icon, fg } of densities) {
  const dir = join(base, name)
  mkdirSync(dir, { recursive: true })

  await sharp(Buffer.from(iconSvg(192))).resize(icon, icon).png().toFile(join(dir, 'ic_launcher.png'))
  await sharp(Buffer.from(iconSvg(192))).resize(icon, icon).png().toFile(join(dir, 'ic_launcher_round.png'))
  await sharp(Buffer.from(foregroundSvg(fg))).resize(fg, fg).png().toFile(join(dir, 'ic_launcher_foreground.png'))

  console.log(`✓ ${name} (icon:${icon} fg:${fg})`)
}

console.log('Done.')

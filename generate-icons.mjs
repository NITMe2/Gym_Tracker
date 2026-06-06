import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join } from 'path'

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="24" fill="#0D0D0D"/>
  <!-- Left plate -->
  <rect x="8" y="52" width="32" height="88" rx="10" fill="#00E5A0"/>
  <!-- Left collar -->
  <rect x="40" y="70" width="18" height="52" rx="6" fill="#00E5A0" opacity="0.75"/>
  <!-- Bar -->
  <rect x="58" y="86" width="76" height="20" rx="8" fill="#00E5A0" opacity="0.55"/>
  <!-- Right collar -->
  <rect x="134" y="70" width="18" height="52" rx="6" fill="#00E5A0" opacity="0.75"/>
  <!-- Right plate -->
  <rect x="152" y="52" width="32" height="88" rx="10" fill="#00E5A0"/>
</svg>`

const sizes = [
  { name: 'mipmap-mdpi',    size: 48  },
  { name: 'mipmap-hdpi',    size: 72  },
  { name: 'mipmap-xhdpi',   size: 96  },
  { name: 'mipmap-xxhdpi',  size: 144 },
  { name: 'mipmap-xxxhdpi', size: 192 },
]

const base = 'android/app/src/main/res'

for (const { name, size } of sizes) {
  const dir = join(base, name)
  mkdirSync(dir, { recursive: true })

  const buf = Buffer.from(svgIcon)

  await sharp(buf)
    .resize(size, size)
    .png()
    .toFile(join(dir, 'ic_launcher.png'))

  await sharp(buf)
    .resize(size, size)
    .png()
    .toFile(join(dir, 'ic_launcher_round.png'))

  console.log(`✓ ${name} (${size}x${size})`)
}

console.log('Done.')

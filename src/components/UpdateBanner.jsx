import { useState, useEffect } from 'react'

const REPO = 'NITMe2/Gym_Tracker'
const SESSION_KEY = 'update-banner-dismissed'

function semverGt(a, b) {
  const parse = (v) => v.replace(/^v/, '').split('.').map(Number)
  const [aMaj, aMin, aPat] = parse(a)
  const [bMaj, bMin, bPat] = parse(b)
  if (aMaj !== bMaj) return aMaj > bMaj
  if (aMin !== bMin) return aMin > bMin
  return aPat > bPat
}

export default function UpdateBanner() {
  const [apkUrl, setApkUrl] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then((r) => r.json())
      .then((data) => {
        const latest = data?.tag_name
        if (!latest || !semverGt(latest, __APP_VERSION__)) return
        const asset = data.assets?.find((a) => a.name.endsWith('.apk'))
        if (asset) setApkUrl(asset.browser_download_url)
      })
      .catch(() => {})
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setApkUrl(null)
  }

  if (!apkUrl) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-bg flex items-center justify-between px-4 py-2 text-sm font-heading">
      <a
        href={apkUrl}
        className="uppercase tracking-wide font-bold"
      >
        New version available — Tap to download ↓
      </a>
      <button onClick={dismiss} className="ml-4 text-bg/70 text-lg leading-none">×</button>
    </div>
  )
}

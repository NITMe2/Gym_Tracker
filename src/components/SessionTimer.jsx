export default function SessionTimer({ elapsed }) {
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <span className="font-mono text-accent">
      {h > 0 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}
    </span>
  )
}

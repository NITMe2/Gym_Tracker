import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage({ onRegister }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('kg')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    await onRegister(trimmed, unit)
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-white tracking-tight">IronLog</h1>
        <p className="text-muted mt-2">Track your weights. See your progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        <div>
          <label className="text-xs text-muted font-heading uppercase tracking-widest block mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Niteesh"
            maxLength={50}
            className="w-full bg-card border border-border rounded-lg px-4 py-4 text-white placeholder-muted text-lg outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs text-muted font-heading uppercase tracking-widest block mb-2">
            Preferred Unit
          </label>
          <div className="flex gap-3">
            {['kg', 'lbs'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`flex-1 py-4 rounded-lg border font-heading text-lg uppercase tracking-wide transition-colors ${
                  unit === u
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-card border-border text-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="mt-2 w-full bg-accent text-bg py-4 rounded-lg font-heading text-xl uppercase tracking-wide disabled:opacity-40 active:opacity-80 transition-opacity"
        >
          Let&apos;s Go →
        </button>
      </form>
    </div>
  )
}

import { useState, useRef } from 'react'
import { clearAllData } from '../db/database'
import { exportToFile, importFromFile } from '../utils/exportImport'

export default function SettingsPage({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || '')
  const [unit, setUnit] = useState(user?.preferredUnit || 'kg')
  const [saved, setSaved] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef()

  async function handleSave(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await onUpdate({ name: trimmed, preferredUnit: unit })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleExport() {
    await exportToFile(user.id)
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    try {
      await importFromFile(file)
      alert('Import successful! Restart the app to see all data.')
    } catch {
      alert('Import failed. Make sure the file is a valid IronLog backup.')
    }
    setImporting(false)
    e.target.value = ''
  }

  async function handleClear() {
    if (!window.confirm('This will delete ALL your data. This cannot be undone. Are you sure?')) return
    await clearAllData()
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-24">
      <h2 className="font-heading text-2xl font-bold text-white uppercase">Settings</h2>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-muted font-heading uppercase tracking-widest block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-muted font-heading uppercase tracking-widest block mb-2">Unit</label>
          <div className="flex gap-3">
            {['kg', 'lbs'].map((u) => (
              <button
                key={u} type="button" onClick={() => setUnit(u)}
                className={`flex-1 py-3 rounded-lg border font-heading text-lg uppercase transition-colors ${unit === u ? 'bg-accent text-bg border-accent' : 'bg-card border-border text-muted'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-accent text-bg py-4 rounded-xl font-heading text-xl uppercase tracking-wide disabled:opacity-40"
        >
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </form>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted font-heading uppercase tracking-widest">Data</p>
        <button
          onClick={handleExport}
          className="w-full border border-border text-white py-4 rounded-xl font-heading text-base uppercase tracking-wide active:bg-card"
        >
          Export Backup (JSON)
        </button>
        <button
          onClick={() => fileRef.current.click()}
          disabled={importing}
          className="w-full border border-border text-white py-4 rounded-xl font-heading text-base uppercase tracking-wide active:bg-card disabled:opacity-40"
        >
          {importing ? 'Importing...' : 'Import Backup'}
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      <div className="h-px bg-border" />

      <button
        onClick={handleClear}
        className="w-full border border-red-900 text-red-400 py-4 rounded-xl font-heading text-base uppercase tracking-wide active:bg-red-900/20"
      >
        Clear All Data
      </button>

      <p className="text-muted text-xs text-center">IronLog — All data stored locally on this device</p>
    </div>
  )
}

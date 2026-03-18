import { useState, useEffect } from 'react'
import { getExercises } from '../db/database'
import { useExerciseHistory } from '../hooks/useExerciseHistory'
import ProgressChart from '../components/ProgressChart'
import LogHistoryTable from '../components/LogHistoryTable'
import PRBadge from '../components/PRBadge'
import { displayWeight } from '../utils/unitConversion'
import { findCardioPR } from '../utils/prDetection'

const RANGES = [
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: 'All', days: null },
]

function cardioFieldLabel(key, unit) {
  switch (key) {
    case 'duration': return 'min'
    case 'speed': return unit === 'lbs' ? 'mph' : 'km/h'
    case 'distance': return unit === 'lbs' ? 'mi' : 'km'
    case 'incline': return '%'
    case 'resistance': return ''
    case 'level': return ''
    default: return ''
  }
}

export default function ResultsPage({ user }) {
  const [exercises, setExercises] = useState([])
  const [selectedEx, setSelectedEx] = useState(null)
  const [range, setRange] = useState(null)
  const [search, setSearch] = useState('')
  const unit = user?.preferredUnit || 'kg'

  const { logs, pr, loading } = useExerciseHistory(user?.id, selectedEx?.id)

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  const filteredLogs = range
    ? logs.filter((l) => l.timestamp >= Date.now() - range * 86400000)
    : logs

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  const isCardio = selectedEx?.exerciseType === 'cardio'
  const cardioPR = isCardio ? findCardioPR(logs, selectedEx.prField) : null

  if (!selectedEx) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Progress</h2>
        <input
          type="text"
          placeholder="Search exercise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
        />
        <div className="flex flex-col gap-1">
          {filteredExercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedEx(ex)}
              className="flex items-center justify-between bg-card hover:bg-border px-4 py-3 rounded-lg transition-colors text-left"
            >
              <span className="text-white font-medium">{ex.name}</span>
              <span className="text-xs text-muted">{ex.muscleGroup}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-24">
      <div className="flex items-center gap-3">
        <button onClick={() => setSelectedEx(null)} className="text-muted">←</button>
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{selectedEx.name}</h2>
          <p className="text-muted text-xs">{selectedEx.muscleGroup} · {selectedEx.category}</p>
        </div>
      </div>

      {isCardio ? (
        cardioPR && (
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-heading uppercase tracking-widest">Personal Record</p>
              <p className="text-white text-2xl font-mono font-bold mt-1">
                {cardioPR[selectedEx.prField]} {cardioFieldLabel(selectedEx.prField, unit)}
              </p>
              <p className="text-muted text-xs mt-0.5">
                {new Date(cardioPR.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
              </p>
            </div>
            <PRBadge />
          </div>
        )
      ) : (
        pr && (
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-heading uppercase tracking-widest">Personal Record</p>
              <p className="text-white text-2xl font-mono font-bold mt-1">{displayWeight(pr.weightKg, unit)}</p>
              <p className="text-muted text-xs mt-0.5">
                {pr.sets}×{pr.reps} · {new Date(pr.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
              </p>
            </div>
            <PRBadge />
          </div>
        )
      )}

      <div className="flex gap-2">
        {RANGES.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => setRange(days)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${
              range === days ? 'bg-accent text-bg border-accent' : 'border-border text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl p-4">
            <ProgressChart logs={filteredLogs} unit={unit} pr={isCardio ? cardioPR : pr} exercise={selectedEx} />
          </div>
          <LogHistoryTable logs={filteredLogs} unit={unit} exercise={selectedEx} />
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getExercises, getAllSessions, getLogsForSession } from '../db/database'
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
    case 'calories': return 'kcal'
    default: return ''
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: '2-digit',
  })
}

function formatDuration(start, end) {
  const mins = Math.round((end - start) / 60000)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function formatLogEntry(log, exercise, unit) {
  if (!exercise) return '—'
  if (exercise.exerciseType === 'cardio') {
    const parts = (exercise.cardioFields || []).map((f) => {
      const v = log[f]
      if (!v) return null
      switch (f) {
        case 'duration': return `${v} min`
        case 'speed': return `${v} ${unit === 'lbs' ? 'mph' : 'km/h'}`
        case 'distance': return `${v} ${unit === 'lbs' ? 'mi' : 'km'}`
        case 'incline': return `${v}%`
        case 'resistance': return `Res ${v}`
        case 'level': return `Lvl ${v}`
        case 'calories': return `${v} kcal`
        default: return null
      }
    }).filter(Boolean)
    return parts.join(' · ') || '—'
  }
  return `${displayWeight(log.weightKg, unit)} × ${log.sets}×${log.reps}`
}

function groupLogsByExercise(logs, exerciseMap) {
  const groups = []
  const seen = new Map()
  for (const log of [...logs].sort((a, b) => a.timestamp - b.timestamp)) {
    if (!seen.has(log.exerciseId)) {
      const group = { exercise: exerciseMap[log.exerciseId], logs: [] }
      seen.set(log.exerciseId, group)
      groups.push(group)
    }
    seen.get(log.exerciseId).logs.push(log)
  }
  return groups
}

export default function ResultsPage({ user }) {
  const [tab, setTab] = useState('progress') // 'progress' | 'workouts'
  const [exercises, setExercises] = useState([])
  // Progress tab
  const [selectedEx, setSelectedEx] = useState(null)
  const [range, setRange] = useState(null)
  const [search, setSearch] = useState('')
  // Workouts tab
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionLogs, setSessionLogs] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)

  const unit = user?.preferredUnit || 'kg'
  const { logs, pr, loading } = useExerciseHistory(user?.id, selectedEx?.id)
  const exerciseMap = exercises.reduce((m, ex) => { m[ex.id] = ex; return m }, {})

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  useEffect(() => {
    if (tab !== 'workouts' || !user?.id) return
    setLoadingSessions(true)
    getAllSessions(user.id).then((s) => { setSessions(s); setLoadingSessions(false) })
  }, [tab, user?.id])

  useEffect(() => {
    if (!selectedSession) { setSessionLogs([]); return }
    getLogsForSession(selectedSession.id).then(setSessionLogs)
  }, [selectedSession])

  const filteredLogs = range
    ? logs.filter((l) => l.timestamp >= Date.now() - range * 86400000)
    : logs

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  const isCardio = selectedEx?.exerciseType === 'cardio'
  const cardioPR = isCardio ? findCardioPR(logs, selectedEx.prField) : null

  function handleTabChange(newTab) {
    setTab(newTab)
    setSelectedEx(null)
    setSelectedSession(null)
    setSearch('')
    setRange(null)
  }

  const tabBar = (
    <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
      {['progress', 'workouts'].map((t) => (
        <button
          key={t}
          onClick={() => handleTabChange(t)}
          className={`flex-1 py-2 rounded-lg font-heading text-sm uppercase tracking-wide transition-colors ${
            tab === t ? 'bg-accent text-bg' : 'text-muted'
          }`}
        >
          {t === 'progress' ? 'Progress' : 'Workouts'}
        </button>
      ))}
    </div>
  )

  // ── Workouts: session detail ──────────────────────────────────────────────
  if (tab === 'workouts' && selectedSession) {
    const groups = groupLogsByExercise(sessionLogs, exerciseMap)
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
        {tabBar}
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedSession(null)} className="text-muted text-xl leading-none">←</button>
          <div>
            <h2 className="font-heading text-xl font-bold text-white">{formatDate(selectedSession.startedAt)}</h2>
            <p className="text-muted text-xs mt-0.5">
              {selectedSession.totalExercises} exercise{selectedSession.totalExercises !== 1 ? 's' : ''}
              {selectedSession.endedAt && ` · ${formatDuration(selectedSession.startedAt, selectedSession.endedAt)}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {groups.length === 0 && (
            <p className="text-muted text-center py-8">No logs for this session.</p>
          )}
          {groups.map(({ exercise, logs: groupLogs }, i) => (
            <div key={exercise?.id ?? i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">{exercise?.name ?? 'Unknown'}</p>
                <span className="text-xs text-muted">{exercise?.muscleGroup}</span>
              </div>
              <div className="flex flex-col gap-1">
                {groupLogs.map((log) => (
                  <p key={log.id} className="text-muted text-sm font-mono">
                    {formatLogEntry(log, exercise, unit)}
                    {log.notes && <span className="text-xs ml-2 not-italic text-muted/70">· {log.notes}</span>}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Workouts: session list ────────────────────────────────────────────────
  if (tab === 'workouts') {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
        {tabBar}
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Workouts</h2>
        {loadingSessions ? (
          <div className="text-muted text-center py-8">Loading...</div>
        ) : sessions.length === 0 ? (
          <p className="text-muted text-center py-8">No workouts yet. Start logging!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSession(s)}
                className="flex items-center justify-between bg-card border border-border px-4 py-3 rounded-xl text-left active:bg-border transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{formatDate(s.startedAt)}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {s.totalExercises} exercise{s.totalExercises !== 1 ? 's' : ''}
                    {s.endedAt && ` · ${formatDuration(s.startedAt, s.endedAt)}`}
                  </p>
                </div>
                <span className="text-muted text-xl">›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Progress: exercise detail ─────────────────────────────────────────────
  if (selectedEx) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-24">
        {tabBar}
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedEx(null)} className="text-muted text-xl leading-none">←</button>
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

  // ── Progress: exercise list ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
      {tabBar}
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

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ExerciseSelector from '../components/ExerciseSelector'
import WeightInput from '../components/WeightInput'
import SetRepCounter from '../components/SetRepCounter'
import { getExercises, addLog, getLastLogForExercise, addCustomExercise } from '../db/database'
import { toKg, kgToLbs } from '../utils/unitConversion'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Other']
const CATEGORIES = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other']

const CARDIO_FIELD_OPTIONS = [
  { key: 'duration', label: 'Duration (min)' },
  { key: 'speed', label: 'Speed' },
  { key: 'distance', label: 'Distance' },
  { key: 'incline', label: 'Incline (%)' },
  { key: 'resistance', label: 'Resistance' },
  { key: 'level', label: 'Level' },
]

const PR_FIELD_OPTIONS = ['duration', 'speed', 'distance']

function cardioFieldLabel(key, unit) {
  switch (key) {
    case 'duration': return 'Duration (min)'
    case 'speed': return unit === 'lbs' ? 'Speed (mph)' : 'Speed (km/h)'
    case 'distance': return unit === 'lbs' ? 'Distance (mi)' : 'Distance (km)'
    case 'incline': return 'Incline (%)'
    case 'resistance': return 'Resistance'
    case 'level': return 'Level'
    default: return key
  }
}

function CardioInput({ fieldKey, value, onChange, unit }) {
  const label = cardioFieldLabel(fieldKey, unit)
  const step = fieldKey === 'speed' || fieldKey === 'distance' ? 0.1 : 1

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted font-heading uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, +(+value - step).toFixed(1)))}
          className="w-10 h-10 rounded-full bg-card border border-border text-white text-xl flex items-center justify-center active:bg-border"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={0}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? '' : +e.target.value)}
          className="w-20 text-center text-3xl font-mono bg-transparent text-white outline-none border-b-2 border-accent pb-1"
        />
        <button
          type="button"
          onClick={() => onChange(+(+value + step).toFixed(1))}
          className="w-10 h-10 rounded-full bg-card border border-border text-white text-xl flex items-center justify-center active:bg-border"
        >
          +
        </button>
      </div>
    </div>
  )
}

function formatCardioDone(cardioValues, exercise, unit) {
  const parts = (exercise.cardioFields || []).map((key) => {
    const val = cardioValues[key]
    if (val == null || val === '' || val === 0) return null
    switch (key) {
      case 'duration': return `${val} min`
      case 'speed': return `${val} ${unit === 'lbs' ? 'mph' : 'km/h'}`
      case 'distance': return `${val} ${unit === 'lbs' ? 'mi' : 'km'}`
      case 'incline': return `${val}%`
      case 'resistance': return `Res ${val}`
      case 'level': return `Lvl ${val}`
      default: return null
    }
  })
  return parts.filter(Boolean).join(' · ')
}

export default function LogPage({ user, session, onStartSession }) {
  const [exercises, setExercises] = useState([])
  const [step, setStep] = useState('pick') // pick | log | custom | done
  const [selected, setSelected] = useState(null)
  // Strength fields
  const [weight, setWeight] = useState(0)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  // Cardio fields
  const [cardioValues, setCardioValues] = useState({})
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  // Custom exercise fields
  const [customName, setCustomName] = useState('')
  const [customGroup, setCustomGroup] = useState('Chest')
  const [customCategory, setCustomCategory] = useState('Dumbbell')
  const [customType, setCustomType] = useState('strength')
  const [customCardioFields, setCustomCardioFields] = useState(['duration'])
  const [customPrField, setCustomPrField] = useState('duration')
  const navigate = useNavigate()
  const unit = user?.preferredUnit || 'kg'

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  const isCardio = selected?.exerciseType === 'cardio'

  async function handleSelect(exercise) {
    setSelected(exercise)
    const last = await getLastLogForExercise(user.id, exercise.id)
    if (exercise.exerciseType === 'cardio') {
      const fields = exercise.cardioFields || []
      const vals = {}
      for (const f of fields) vals[f] = last?.[f] ?? 0
      setCardioValues(vals)
    } else {
      if (last) {
        setWeight(unit === 'lbs' ? kgToLbs(last.weightKg) : last.weightKg)
        setSets(last.sets)
        setReps(last.reps)
      } else {
        setWeight(0)
        setSets(3)
        setReps(10)
      }
    }
    setStep('log')
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    let activeSession = session
    if (!activeSession) activeSession = await onStartSession()

    const data = isCardio
      ? { ...cardioValues, notes: notes || null }
      : { weightKg: toKg(weight, unit), sets, reps, notes: notes || null }

    await addLog(user.id, selected.id, activeSession.id, data)
    setSaving(false)
    setStep('done')
  }

  function toggleCustomCardioField(key) {
    setCustomCardioFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  async function handleAddCustom(e) {
    e.preventDefault()
    const name = customName.trim()
    if (!name) return
    const prField = customType === 'cardio'
      ? (customCardioFields.includes(customPrField) ? customPrField : customCardioFields[0] || 'duration')
      : undefined
    const ex = await addCustomExercise(name, customGroup, customCategory, customType, customType === 'cardio' ? customCardioFields : [], prField)
    setExercises((prev) => [...prev, ex])
    setCustomName('')
    setStep('pick')
  }

  if (step === 'pick') {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-white uppercase">Pick Exercise</h2>
          <button
            onClick={() => setStep('custom')}
            className="text-accent text-sm font-heading uppercase tracking-wide"
          >
            + Custom
          </button>
        </div>
        <ExerciseSelector exercises={exercises} onSelect={handleSelect} />
      </div>
    )
  }

  if (step === 'custom') {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
        <button onClick={() => setStep('pick')} className="text-muted text-sm self-start">← Back</button>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Add Custom Exercise</h2>
        <form onSubmit={handleAddCustom} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Exercise name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            maxLength={80}
            className="bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
          />

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Exercise Type</p>
            <div className="flex gap-2">
              {['strength', 'cardio'].map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => {
                    setCustomType(t)
                    setCustomGroup(t === 'cardio' ? 'Cardio' : 'Chest')
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customType === t ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Muscle Group</p>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((g) => (
                <button
                  key={g} type="button" onClick={() => setCustomGroup(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customGroup === g ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c} type="button" onClick={() => setCustomCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customCategory === c ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {customType === 'cardio' && (
            <>
              <div>
                <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Track Fields</p>
                <div className="flex flex-wrap gap-2">
                  {CARDIO_FIELD_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key} type="button" onClick={() => toggleCustomCardioField(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customCardioFields.includes(key) ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {PR_FIELD_OPTIONS.filter((f) => customCardioFields.includes(f)).length > 1 && (
                <div>
                  <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">PR Metric</p>
                  <div className="flex flex-wrap gap-2">
                    {PR_FIELD_OPTIONS.filter((f) => customCardioFields.includes(f)).map((f) => (
                      <button
                        key={f} type="button" onClick={() => setCustomPrField(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customPrField === f ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={!customName.trim() || (customType === 'cardio' && customCardioFields.length === 0)}
            className="bg-accent text-bg py-4 rounded-lg font-heading text-xl uppercase tracking-wide disabled:opacity-40"
          >
            Add Exercise
          </button>
        </form>
      </div>
    )
  }

  if (step === 'log') {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 pb-24 h-screen overflow-y-auto">
        <button onClick={() => setStep('pick')} className="text-muted text-sm self-start">← Back</button>

        <div>
          <h2 className="font-heading text-3xl font-bold text-white">{selected?.name}</h2>
          <p className="text-muted text-sm">{selected?.muscleGroup} · {selected?.category}</p>
        </div>

        {isCardio ? (
          <div className="grid grid-cols-2 gap-4">
            {(selected.cardioFields || []).map((key) => (
              <div key={key} className="bg-card border border-border rounded-xl p-3">
                <CardioInput
                  fieldKey={key}
                  value={cardioValues[key] ?? 0}
                  onChange={(v) => setCardioValues((prev) => ({ ...prev, [key]: v }))}
                  unit={unit}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <WeightInput value={weight} onChange={setWeight} unit={unit} />
            <div className="h-px bg-border" />
            <SetRepCounter sets={sets} reps={reps} onSetsChange={setSets} onRepsChange={setReps} />
            <div className="h-px bg-border" />
          </>
        )}

        <div>
          <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Notes (optional)</p>
          <input
            type="text"
            placeholder="Any notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || (isCardio ? !(cardioValues.duration > 0) : weight <= 0)}
          className="bg-accent text-bg py-5 rounded-xl font-heading text-2xl uppercase tracking-wide disabled:opacity-40 active:opacity-80 transition-opacity"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    )
  }

  if (step === 'done') {
    const summary = isCardio
      ? formatCardioDone(cardioValues, selected, unit)
      : `${weight} ${unit} × ${sets}×${reps}`
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <div className="text-6xl">✅</div>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Logged!</h2>
          <p className="text-muted mt-1">{selected?.name} — {summary}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setStep('log')}
            className="flex-1 border border-border text-white py-4 rounded-xl font-heading text-lg uppercase tracking-wide"
          >
            Log Again
          </button>
          <button
            onClick={() => setStep('pick')}
            className="flex-1 bg-accent text-bg py-4 rounded-xl font-heading text-lg uppercase tracking-wide"
          >
            Next Exercise
          </button>
        </div>
        <button onClick={() => navigate('/')} className="text-muted text-sm">← Home</button>
      </div>
    )
  }
}

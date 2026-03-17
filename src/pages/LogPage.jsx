import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ExerciseSelector from '../components/ExerciseSelector'
import WeightInput from '../components/WeightInput'
import SetRepCounter from '../components/SetRepCounter'
import { getExercises, addLog, getLastLogForExercise, addCustomExercise } from '../db/database'
import { toKg, kgToLbs } from '../utils/unitConversion'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Other']
const CATEGORIES = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other']

export default function LogPage({ user, session, onStartSession }) {
  const [exercises, setExercises] = useState([])
  const [step, setStep] = useState('pick') // pick | log | custom | done
  const [selected, setSelected] = useState(null)
  const [weight, setWeight] = useState(0)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customGroup, setCustomGroup] = useState('Chest')
  const [customCategory, setCustomCategory] = useState('Dumbbell')
  const navigate = useNavigate()
  const unit = user?.preferredUnit || 'kg'

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  async function handleSelect(exercise) {
    setSelected(exercise)
    // pre-fill with last log
    const last = await getLastLogForExercise(user.id, exercise.id)
    if (last) {
      setWeight(unit === 'lbs' ? kgToLbs(last.weightKg) : last.weightKg)
      setSets(last.sets)
      setReps(last.reps)
    } else {
      setWeight(0)
      setSets(3)
      setReps(10)
    }
    setStep('log')
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    let activeSession = session
    if (!activeSession) {
      activeSession = await onStartSession()
    }
    const weightKg = toKg(weight, unit)
    await addLog(user.id, selected.id, activeSession.id, { weightKg, sets, reps, notes: notes || null })
    setSaving(false)
    setStep('done')
  }

  async function handleAddCustom(e) {
    e.preventDefault()
    const name = customName.trim()
    if (!name) return
    const ex = await addCustomExercise(name, customGroup, customCategory)
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
          <button
            type="submit"
            disabled={!customName.trim()}
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
      <div className="flex flex-col gap-6 px-4 pt-6 pb-24">
        <button onClick={() => setStep('pick')} className="text-muted text-sm self-start">← Back</button>

        <div>
          <h2 className="font-heading text-3xl font-bold text-white">{selected?.name}</h2>
          <p className="text-muted text-sm">{selected?.muscleGroup} · {selected?.category}</p>
        </div>

        <WeightInput value={weight} onChange={setWeight} unit={unit} />

        <div className="h-px bg-border" />

        <SetRepCounter sets={sets} reps={reps} onSetsChange={setSets} onRepsChange={setReps} />

        <div className="h-px bg-border" />

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
          disabled={saving || weight <= 0}
          className="bg-accent text-bg py-5 rounded-xl font-heading text-2xl uppercase tracking-wide disabled:opacity-40 active:opacity-80 transition-opacity"
        >
          {saving ? 'Saving...' : 'Save Set'}
        </button>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <div className="text-6xl">✅</div>
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Logged!</h2>
          <p className="text-muted mt-1">{selected?.name} — {weight} {unit} × {sets}×{reps}</p>
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

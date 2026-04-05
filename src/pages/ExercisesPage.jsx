import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExercises, deleteExercise, addCustomExercise } from '../db/database'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Other']
const CATEGORIES = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other']
const CARDIO_FIELD_OPTIONS = ['duration', 'speed', 'distance', 'incline', 'resistance', 'level', 'calories']
const PR_FIELD_OPTIONS = ['duration', 'speed', 'distance']

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [selectedEx, setSelectedEx] = useState(null)
  const [adding, setAdding] = useState(false)
  // Custom exercise form state
  const [name, setName] = useState('')
  const [group, setGroup] = useState('Chest')
  const [category, setCategory] = useState('Dumbbell')
  const [customType, setCustomType] = useState('strength')
  const [customCardioFields, setCustomCardioFields] = useState(['duration'])
  const [customPrField, setCustomPrField] = useState('duration')
  const [customDescription, setCustomDescription] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  function toggleCustomCardioField(key) {
    setCustomCardioFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  async function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const prField = customType === 'cardio'
      ? (customCardioFields.includes(customPrField) ? customPrField : customCardioFields[0] || 'duration')
      : undefined
    const ex = await addCustomExercise(
      trimmed, group, category, customType,
      customType === 'cardio' ? customCardioFields : [],
      prField,
      customDescription.trim()
    )
    setExercises((prev) => [...prev, ex])
    setName('')
    setCustomDescription('')
    setAdding(false)
  }

  async function handleDelete(id) {
    await deleteExercise(id)
    setExercises((prev) => prev.filter((ex) => ex.id !== id))
    setSelectedEx(null)
  }

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = []
    acc[ex.muscleGroup].push(ex)
    return acc
  }, {})

  // ── Exercise detail view ─────────────────────────────────────────────────
  if (selectedEx) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-24">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedEx(null)} className="text-muted text-xl leading-none">←</button>
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">{selectedEx.name}</h2>
            <p className="text-muted text-xs">{selectedEx.muscleGroup} · {selectedEx.category}</p>
          </div>
        </div>

        {selectedEx.description && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">About</p>
            <p className="text-white/80 text-sm leading-relaxed">{selectedEx.description}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/log', { state: { exercise: selectedEx } })}
            className="w-full bg-accent text-bg py-4 rounded-xl font-heading text-xl uppercase tracking-wide active:opacity-80 transition-opacity"
          >
            Log This Exercise
          </button>
          {selectedEx.isCustom && (
            <button
              onClick={() => handleDelete(selectedEx.id)}
              className="w-full border border-red-500/40 text-red-400 py-3 rounded-xl font-heading text-sm uppercase tracking-wide active:bg-red-500/10"
            >
              Delete Exercise
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Exercise list ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-white uppercase">Exercises</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="text-accent text-sm font-heading uppercase tracking-wide"
        >
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
            autoFocus
          />

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Type</p>
            <div className="flex gap-2">
              {['strength', 'cardio'].map((t) => (
                <button key={t} type="button" onClick={() => setCustomType(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-heading uppercase border transition-colors ${customType === t ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Muscle Group</p>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((g) => (
                <button key={g} type="button" onClick={() => setGroup(g)}
                  className={`px-3 py-1 rounded-full text-xs font-heading uppercase border transition-colors ${group === g ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-heading uppercase border transition-colors ${category === c ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}>
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
                  {CARDIO_FIELD_OPTIONS.map((f) => (
                    <button key={f} type="button" onClick={() => toggleCustomCardioField(f)}
                      className={`px-3 py-1 rounded-full text-xs font-heading uppercase border transition-colors ${customCardioFields.includes(f) ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">PR Field</p>
                <div className="flex gap-2">
                  {PR_FIELD_OPTIONS.filter((f) => customCardioFields.includes(f)).map((f) => (
                    <button key={f} type="button" onClick={() => setCustomPrField(f)}
                      className={`px-3 py-1 rounded-full text-xs font-heading uppercase border transition-colors ${customPrField === f ? 'bg-accent text-bg border-accent' : 'border-border text-muted'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">Description <span className="normal-case">(optional)</span></p>
            <textarea
              placeholder="What does this exercise work? Any tips..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent resize-none text-sm"
            />
          </div>

          <button type="submit" disabled={!name.trim()}
            className="bg-accent text-bg py-3 rounded-lg font-heading text-lg uppercase disabled:opacity-40">
            Add Exercise
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
      />

      <div className="flex flex-col gap-5">
        {Object.entries(grouped).map(([mg, exs]) => (
          <div key={mg}>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">{mg}</p>
            <div className="flex flex-col gap-1">
              {exs.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedEx(ex)}
                  className="flex items-center justify-between bg-card px-4 py-3 rounded-lg text-left active:bg-border transition-colors"
                >
                  <div>
                    <span className="text-white font-medium">{ex.name}</span>
                    <span className="text-xs text-muted ml-2">{ex.category}</span>
                  </div>
                  <span className="text-muted">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

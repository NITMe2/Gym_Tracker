import { useState, useEffect } from 'react'
import { getExercises, deleteExercise, addCustomExercise } from '../db/database'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Other']
const CATEGORIES = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other']

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [group, setGroup] = useState('Chest')
  const [category, setCategory] = useState('Dumbbell')

  useEffect(() => {
    getExercises().then(setExercises)
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const ex = await addCustomExercise(trimmed, group, category)
    setExercises((prev) => [...prev, ex])
    setName('')
    setAdding(false)
  }

  async function handleDelete(id) {
    await deleteExercise(id)
    setExercises((prev) => prev.filter((ex) => ex.id !== id))
  }

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = []
    acc[ex.muscleGroup].push(ex)
    return acc
  }, {})

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
                <div key={ex.id} className="flex items-center justify-between bg-card px-4 py-3 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{ex.name}</span>
                    <span className="text-xs text-muted ml-2">{ex.category}</span>
                  </div>
                  {ex.isCustom ? (
                    <button
                      onClick={() => handleDelete(ex.id)}
                      className="text-muted text-xs hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-xs text-muted/40">Preset</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

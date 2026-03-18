import { useState } from 'react'

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio']
const CATEGORIES = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Other']

export default function ExerciseSelector({ exercises, onSelect }) {
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('All')
  const [category, setCategory] = useState('All')

  const filtered = exercises.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchGroup = group === 'All' || ex.muscleGroup === group
    const matchCat = category === 'All' || ex.category === category
    return matchSearch && matchGroup && matchCat
  })

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = []
    acc[ex.muscleGroup].push(ex)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-muted outline-none focus:border-accent"
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {MUSCLE_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-heading uppercase tracking-wide border transition-colors ${
              group === g ? 'bg-accent text-bg border-accent' : 'border-border text-muted'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-heading uppercase tracking-wide border transition-colors ${
              category === c ? 'bg-accent text-bg border-accent' : 'border-border text-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh]">
        {Object.entries(grouped).map(([mg, exs]) => (
          <div key={mg}>
            <p className="text-xs text-muted font-heading uppercase tracking-widest mb-2">{mg}</p>
            <div className="flex flex-col gap-1">
              {exs.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className="flex items-center justify-between bg-card hover:bg-border px-4 py-3 rounded-lg transition-colors text-left"
                >
                  <span className="text-white font-medium">{ex.name}</span>
                  <span className="text-xs text-muted">{ex.category}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted text-center py-8">No exercises found</p>
        )}
      </div>
    </div>
  )
}

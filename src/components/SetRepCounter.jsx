function Counter({ label, value, onChange, min = 1 }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <p className="text-xs text-muted font-heading uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full bg-card border border-border text-white text-xl flex items-center justify-center active:bg-border"
        >
          −
        </button>
        <span className="text-3xl font-mono text-white w-10 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full bg-card border border-border text-white text-xl flex items-center justify-center active:bg-border"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function SetRepCounter({ sets, reps, onSetsChange, onRepsChange }) {
  return (
    <div className="flex gap-4">
      <Counter label="Sets" value={sets} onChange={onSetsChange} />
      <div className="w-px bg-border" />
      <Counter label="Reps" value={reps} onChange={onRepsChange} />
    </div>
  )
}

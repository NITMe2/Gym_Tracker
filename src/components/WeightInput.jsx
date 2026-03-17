export default function WeightInput({ value, onChange, unit }) {
  const step = unit === 'lbs' ? 5 : 2.5

  function adjust(delta) {
    const next = Math.max(0, +(+value + delta).toFixed(2))
    onChange(next)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted font-heading uppercase tracking-widest">Weight ({unit})</p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => adjust(-step)}
          className="w-12 h-12 rounded-full bg-card border border-border text-white text-2xl flex items-center justify-center active:bg-border"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? '' : +e.target.value)}
          className="w-28 text-center text-4xl font-mono bg-transparent text-white outline-none border-b-2 border-accent pb-1"
        />
        <button
          onClick={() => adjust(step)}
          className="w-12 h-12 rounded-full bg-card border border-border text-white text-2xl flex items-center justify-center active:bg-border"
        >
          +
        </button>
      </div>
    </div>
  )
}

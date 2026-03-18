import PRBadge from './PRBadge'
import { displayWeight } from '../utils/unitConversion'
import { isPR, isCardioPR } from '../utils/prDetection'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

function CardioHistoryTable({ logs, unit, exercise }) {
  const prField = exercise?.prField || 'duration'
  const fields = exercise?.cardioFields || []
  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  function colHeader(key) {
    switch (key) {
      case 'duration': return 'Min'
      case 'speed': return unit === 'lbs' ? 'mph' : 'km/h'
      case 'distance': return unit === 'lbs' ? 'mi' : 'km'
      case 'incline': return 'Incl%'
      case 'resistance': return 'Res'
      case 'level': return 'Lvl'
      default: return key
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs font-heading uppercase tracking-widest border-b border-border">
            <th className="text-left pb-2">Date</th>
            {fields.map((f) => (
              <th key={f} className="text-right pb-2">{colHeader(f)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((log) => (
            <tr key={log.id} className="border-b border-border/40">
              <td className="py-2 text-muted">{formatDate(log.timestamp)}</td>
              {fields.map((f) => (
                <td key={f} className="py-2 text-right font-mono text-white">
                  {f === prField && isCardioPR(log, logs, prField)
                    ? <span className="flex items-center justify-end gap-1"><PRBadge />{log[f] ?? '—'}</span>
                    : (log[f] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function LogHistoryTable({ logs, unit, exercise }) {
  if (logs.length === 0) return null

  if (exercise?.exerciseType === 'cardio') {
    return <CardioHistoryTable logs={logs} unit={unit} exercise={exercise} />
  }

  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs font-heading uppercase tracking-widest border-b border-border">
            <th className="text-left pb-2">Date</th>
            <th className="text-right pb-2">Weight</th>
            <th className="text-right pb-2">Sets</th>
            <th className="text-right pb-2">Reps</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((log) => (
            <tr key={log.id} className="border-b border-border/40">
              <td className="py-2 text-muted">{formatDate(log.timestamp)}</td>
              <td className="py-2 text-right font-mono text-white">
                <span className="flex items-center justify-end gap-2">
                  {isPR(log, logs) && <PRBadge />}
                  {displayWeight(log.weightKg, unit)}
                </span>
              </td>
              <td className="py-2 text-right text-white">{log.sets}</td>
              <td className="py-2 text-right text-white">{log.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

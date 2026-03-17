import PRBadge from './PRBadge'
import { displayWeight } from '../utils/unitConversion'
import { isPR } from '../utils/prDetection'

export default function LogHistoryTable({ logs, unit }) {
  if (logs.length === 0) return null

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
              <td className="py-2 text-muted">
                {new Date(log.timestamp).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: '2-digit',
                })}
              </td>
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

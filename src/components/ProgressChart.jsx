import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { displayWeight } from '../utils/unitConversion'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function ProgressChart({ logs, unit, pr }) {
  const data = logs.map((l) => ({
    date: formatDate(l.timestamp),
    weight: unit === 'lbs' ? +(l.weightKg * 2.20462).toFixed(1) : l.weightKg,
    id: l.id,
  }))

  const prWeight = pr
    ? unit === 'lbs'
      ? +(pr.weightKg * 2.20462).toFixed(1)
      : pr.weightKg
    : null

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted text-sm">
        No data yet — log some sets to see your progress
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: '#666', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#666', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#222', border: '1px solid #2A2A2A', borderRadius: 8 }}
          labelStyle={{ color: '#999', fontSize: 11 }}
          itemStyle={{ color: '#00E5A0' }}
          formatter={(v) => [`${v} ${unit}`, 'Weight']}
        />
        {prWeight && (
          <ReferenceLine
            y={prWeight}
            stroke="#00E5A0"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
        )}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#00E5A0"
          strokeWidth={2}
          dot={{ fill: '#00E5A0', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

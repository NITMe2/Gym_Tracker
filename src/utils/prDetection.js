export function findPR(logs) {
  if (!logs || logs.length === 0) return null
  return logs.reduce((best, log) => {
    return log.weightKg > (best?.weightKg || 0) ? log : best
  }, null)
}

export function findCardioPR(logs, prField) {
  if (!logs || logs.length === 0) return null
  return logs.reduce((best, log) => {
    return (log[prField] ?? 0) > (best?.[prField] ?? 0) ? log : best
  }, null)
}

export function isPR(log, logs) {
  const pr = findPR(logs)
  return pr && pr.id === log.id
}

export function isCardioPR(log, logs, prField) {
  const pr = findCardioPR(logs, prField)
  return pr && pr.id === log.id
}

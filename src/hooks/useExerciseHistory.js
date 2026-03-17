import { useState, useEffect } from 'react'
import { getLogsForExercise } from '../db/database'
import { findPR } from '../utils/prDetection'

export function useExerciseHistory(userId, exerciseId) {
  const [logs, setLogs] = useState([])
  const [pr, setPr] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId || !exerciseId) {
      setLogs([])
      setPr(null)
      return
    }
    setLoading(true)
    getLogsForExercise(userId, exerciseId).then((data) => {
      const sorted = data.sort((a, b) => a.timestamp - b.timestamp)
      setLogs(sorted)
      setPr(findPR(sorted))
      setLoading(false)
    })
  }, [userId, exerciseId])

  function refresh() {
    if (!userId || !exerciseId) return
    getLogsForExercise(userId, exerciseId).then((data) => {
      const sorted = data.sort((a, b) => a.timestamp - b.timestamp)
      setLogs(sorted)
      setPr(findPR(sorted))
    })
  }

  return { logs, pr, loading, refresh }
}

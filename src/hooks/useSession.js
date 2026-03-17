import { useState, useEffect, useRef } from 'react'
import { getActiveSession, startSession, endSession } from '../db/database'

export function useSession(userId) {
  const [session, setSession] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!userId) return
    getActiveSession(userId).then((s) => {
      if (s) {
        setSession(s)
        setElapsed(Math.floor((Date.now() - s.startedAt) / 1000))
      }
    })
  }, [userId])

  useEffect(() => {
    if (session && !session.endedAt) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - session.startedAt) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [session])

  async function start() {
    const s = await startSession(userId)
    setSession(s)
    setElapsed(0)
    return s
  }

  async function end() {
    if (!session) return
    const s = await endSession(session.id)
    setSession(null)
    setElapsed(0)
    return s
  }

  return { session, elapsed, start, end }
}

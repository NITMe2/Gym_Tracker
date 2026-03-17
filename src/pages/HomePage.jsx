import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SessionTimer from '../components/SessionTimer'
import { getLastSession, getLogsForSession } from '../db/database'

export default function HomePage({ user, session, elapsed, onStartSession, onEndSession }) {
  const [lastSession, setLastSession] = useState(null)
  const [sessionLogs, setSessionLogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    getLastSession(user.id).then(setLastSession)
  }, [user, session])

  useEffect(() => {
    if (!session) {
      setSessionLogs([])
      return
    }
    getLogsForSession(session.id).then(setSessionLogs)
  }, [session])

  function formatDuration(start, end) {
    const mins = Math.round((end - start) / 60000)
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm">Hey,</p>
          <h1 className="font-heading text-4xl font-bold text-white">{user?.name}</h1>
        </div>
        {session && (
          <div className="text-right">
            <p className="text-xs text-muted">Session active</p>
            <SessionTimer elapsed={elapsed} />
          </div>
        )}
      </div>

      {!session ? (
        <button
          onClick={async () => {
            await onStartSession()
            navigate('/log')
          }}
          className="w-full bg-accent text-bg py-5 rounded-xl font-heading text-2xl uppercase tracking-wide active:opacity-80 transition-opacity"
        >
          ▶ Start Workout
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/log')}
            className="w-full bg-accent text-bg py-5 rounded-xl font-heading text-2xl uppercase tracking-wide active:opacity-80"
          >
            + Log Exercise
          </button>
          <button
            onClick={onEndSession}
            className="w-full border border-border text-muted py-3 rounded-xl font-heading text-base uppercase tracking-wide active:bg-card"
          >
            End Session
          </button>
          {sessionLogs.length > 0 && (
            <p className="text-center text-sm text-muted">{sessionLogs.length} exercise{sessionLogs.length !== 1 ? 's' : ''} logged</p>
          )}
        </div>
      )}

      {lastSession && !session && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted font-heading uppercase tracking-widest mb-1">Last Session</p>
          <p className="text-white font-medium">{formatDate(lastSession.startedAt)}</p>
          <p className="text-muted text-sm mt-1">
            {lastSession.totalExercises} exercise{lastSession.totalExercises !== 1 ? 's' : ''} ·{' '}
            {lastSession.endedAt && formatDuration(lastSession.startedAt, lastSession.endedAt)}
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted font-heading uppercase tracking-widest mb-3">Quick Access</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate('/log')}
            className="bg-surface border border-border rounded-lg p-3 text-left"
          >
            <span className="text-2xl">🏋️</span>
            <p className="text-white text-sm font-medium mt-1">Log Set</p>
          </button>
          <button
            onClick={() => navigate('/results')}
            className="bg-surface border border-border rounded-lg p-3 text-left"
          >
            <span className="text-2xl">📊</span>
            <p className="text-white text-sm font-medium mt-1">Progress</p>
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useUser } from './hooks/useUser'
import { useSession } from './hooks/useSession'
import BottomNav from './components/BottomNav'
import UpdateBanner from './components/UpdateBanner'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import LogPage from './pages/LogPage'
import ResultsPage from './pages/ResultsPage'
import ExercisesPage from './pages/ExercisesPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const { user, loading, register, update } = useUser()
  const { session, elapsed, start, end } = useSession(user?.id)
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="font-heading text-4xl text-accent">IronLog</span>
      </div>
    )
  }

  if (!user) {
    return <WelcomePage onRegister={register} />
  }

  const showNav = location.pathname !== '/welcome'

  return (
    <>
      <UpdateBanner />
      <Routes>
        <Route path="/" element={
          <HomePage
            user={user}
            session={session}
            elapsed={elapsed}
            onStartSession={start}
            onEndSession={end}
          />
        } />
        <Route path="/log" element={
          <LogPage
            user={user}
            session={session}
            onStartSession={start}
          />
        } />
        <Route path="/results" element={<ResultsPage user={user} />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/settings" element={<SettingsPage user={user} onUpdate={update} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

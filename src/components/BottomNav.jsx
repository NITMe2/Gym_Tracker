import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/log', label: 'Log', icon: '🏋️' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/exercises', label: 'Exercises', icon: '💪' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface border-t border-border flex z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 text-xs gap-1 transition-colors ${
              isActive ? 'text-accent' : 'text-muted'
            }`
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="font-heading tracking-wide uppercase">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { Home, ListTodo, Trophy, User, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems: Array<
  | { to: string; icon: typeof Home; label: string }
  | { to: string; icon: typeof Plus; label: string; isFab: true }
> = [
  { to: '/dashboard', icon: Home, label: 'Today' },
  { to: '/habits', icon: ListTodo, label: 'Habits' },
  { to: '/dashboard', icon: Plus, label: 'Add', isFab: true },
  { to: '/leaderboard', icon: Trophy, label: 'Rank' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          if ('isFab' in item && item.isFab) {
            return (
              <Link
                key={item.label}
                to="/habits/new"
                className="flex flex-col items-center"
              >
                <span className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-card transition-transform hover:scale-105">
                  <Plus className="h-6 w-6 text-primary-foreground" />
                </span>
                <span className="text-xs text-muted-foreground">Add</span>
              </Link>
            )
          }
          const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname.startsWith('/dashboard'))
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

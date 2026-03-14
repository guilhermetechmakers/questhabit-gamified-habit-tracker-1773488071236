import { Link } from 'react-router-dom'
import { Sparkles, Target, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <header className="flex items-center justify-between px-4 py-6">
        <span className="text-xl font-bold text-foreground">QuestHabit</span>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="px-4 py-12 text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Turn habits into quests.
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Level up every day.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Quick setup, instant rewards, and streaks that keep you coming back. Build habits that stick.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-primary/90" asChild>
            <Link to="/signup">Start free</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" asChild>
            <Link to="/login">I have an account</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Zap, title: '30-second setup', desc: 'Create a habit in one flow.' },
          { icon: Target, title: 'XP & levels', desc: 'Earn points and level up.' },
          { icon: Sparkles, title: 'Streaks & badges', desc: 'Stay motivated with milestones.' },
          { icon: Shield, title: 'Privacy first', desc: 'Your data stays yours.' },
        ].map((item, i) => (
          <div
            key={item.title}
            className={cn(
              'rounded-2xl border border-border bg-card p-6 shadow-card animate-fade-in-up',
              'transition-shadow hover:shadow-card-hover'
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <item.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-24 border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
        <Link to="/privacy" className="underline hover:text-foreground">Privacy</Link>
        {' · '}
        <Link to="/terms" className="underline hover:text-foreground">Terms</Link>
      </footer>
    </div>
  )
}

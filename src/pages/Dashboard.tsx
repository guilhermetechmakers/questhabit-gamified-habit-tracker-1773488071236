import { Link } from 'react-router-dom'
import { Flame, Star, ListTodo } from 'lucide-react'
import { useAuthUser, useUserStats } from '@/hooks/use-auth'
import { useHabits } from '@/hooks/use-habits'
import { useProcessCompletion } from '@/hooks/use-completion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const { data: user } = useAuthUser()
  const { data: stats } = useUserStats(user?.id)
  const { data: habits, isLoading: habitsLoading } = useHabits()
  const completeMutation = useProcessCompletion()

  const todayHabits = habits ?? []

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground">Today</h1>

      {/* XP & Level & Streak */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <Star className="h-4 w-4 text-primary" />
              XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats?.xp_total ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-base text-muted-foreground">Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats?.level ?? 1}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-primary/20">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <Flame className="h-4 w-4 text-primary" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats?.current_streak ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's habits */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Habits</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/habits">See all</Link>
          </Button>
        </div>
        {habitsLoading ? (
          <div className="mt-3 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : todayHabits.length === 0 ? (
          <Card className="mt-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListTodo className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No habits yet</p>
              <Button className="mt-4" asChild>
                <Link to="/habits/new">Create your first habit</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-3 space-y-3">
            {todayHabits.slice(0, 5).map((habit) => (
              <li key={habit.id}>
                <Card
                  className={cn(
                    'transition-all hover:shadow-card-hover',
                    completeMutation.isPending && completeMutation.variables?.habitId === habit.id && 'opacity-70'
                  )}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-lg">
                        {habit.icon ?? '✓'}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{habit.title}</p>
                        <p className="text-xs text-muted-foreground">+{habit.xp_value} XP</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => completeMutation.mutate({ habitId: habit.id })}
                      disabled={completeMutation.isPending}
                    >
                      Done
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

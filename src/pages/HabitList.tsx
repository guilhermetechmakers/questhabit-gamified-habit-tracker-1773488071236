import { Link } from 'react-router-dom'
import { Plus, ListTodo } from 'lucide-react'
import { useHabits } from '@/hooks/use-habits'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function HabitList() {
  const { data: habits, isLoading } = useHabits()

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        <h1 className="text-2xl font-bold">Habits</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Habits</h1>
        <Button asChild>
          <Link to="/habits/new">
            <Plus className="mr-2 h-4 w-4" />
            Add habit
          </Link>
        </Button>
      </div>

      {!habits?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ListTodo className="h-14 w-14 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No habits yet</p>
            <Button className="mt-4" asChild>
              <Link to="/habits/new">Create your first habit</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {habits.map((habit) => (
            <li key={habit.id}>
              <Link to={`/habits/${habit.id}`}>
                <Card className="transition-all hover:shadow-card-hover">
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-xl">
                      {habit.icon ?? '✓'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{habit.title}</p>
                      <p className="text-sm text-muted-foreground">+{habit.xp_value} XP</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

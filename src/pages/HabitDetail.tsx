import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useHabit, useDeleteHabit } from '@/hooks/use-habits'
import { useProcessCompletion } from '@/hooks/use-completion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: habit, isLoading } = useHabit(id ?? '')
  const deleteHabit = useDeleteHabit()
  const completeMutation = useProcessCompletion()

  if (!id) {
    navigate('/habits')
    return null
  }

  if (isLoading || !habit) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  async function handleDelete() {
    if (!confirm('Remove this habit?')) return
    try {
      await deleteHabit.mutateAsync(id as string)
      navigate('/habits')
    } catch {
      // toast handled in hook
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/habits">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="flex-1 text-xl font-bold text-foreground">{habit.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-2xl">
              {habit.icon ?? '✓'}
            </span>
            <div>
              <CardTitle className="text-lg">{habit.title}</CardTitle>
              <p className="text-sm text-muted-foreground">+{habit.xp_value} XP per completion</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => completeMutation.mutate({ habitId: habit.id })}
            disabled={completeMutation.isPending}
          >
            Mark complete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link to={`/habits/${id}/edit`}>Edit</Link>
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

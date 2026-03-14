import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useHabit, useUpdateHabit } from '@/hooks/use-habits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  title: z.string().min(1, 'Name your habit'),
  xp_value: z.coerce.number().min(1).max(100),
})

type FormData = z.infer<typeof schema>

export default function EditHabit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: habit, isLoading } = useHabit(id ?? '')
  const updateHabit = useUpdateHabit()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: habit
      ? { title: habit.title, xp_value: habit.xp_value }
      : undefined,
  })

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

  function onSubmit(data: FormData) {
    const habitId = id as string
    updateHabit.mutate(
      { id: habitId, updates: { title: data.title, xp_value: data.xp_value } },
      { onSuccess: () => navigate(`/habits/${habitId}`) }
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/habits/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Edit habit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habit details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name</Label>
              <Input id="title" {...register('title')} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="xp_value">XP per completion (1–100)</Label>
              <Input
                id="xp_value"
                type="number"
                min={1}
                max={100}
                {...register('xp_value')}
              />
              {errors.xp_value && (
                <p className="text-sm text-destructive">{errors.xp_value.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" asChild>
                <Link to={`/habits/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={updateHabit.isPending}>
                {updateHabit.isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

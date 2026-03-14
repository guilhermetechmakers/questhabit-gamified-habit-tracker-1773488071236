import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useCreateHabit } from '@/hooks/use-habits'
import { useAuthUser } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  title: z.string().min(1, 'Name your habit'),
  xp_value: z.coerce.number().min(1).max(100).default(10),
})

type FormData = z.infer<typeof schema>

export default function CreateHabit() {
  const navigate = useNavigate()
  const { data: user } = useAuthUser()
  const createHabit = useCreateHabit()
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', xp_value: 10 },
  })

  const title = watch('title')
  const xp_value = watch('xp_value')

  async function onSubmit(data: FormData) {
    if (!user?.id) return
    try {
      const habit = await createHabit.mutateAsync({
        user_id: user.id,
        title: data.title,
        xp_value: data.xp_value,
        schedule_json: { frequency: 'daily' },
      })
      navigate(`/habits/${habit.id}`, { replace: true })
    } catch {
      // toast in hook
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
        <h1 className="text-xl font-bold text-foreground">New habit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? 'Name your habit' : 'Set XP & preview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Habit name</Label>
                <Input
                  id="title"
                  placeholder="e.g. Morning run"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!title?.trim()}
              >
                Next
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <p className="text-sm text-red-600">{errors.xp_value.message}</p>
                )}
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">{title || 'Habit'}</p>
                <p className="text-xs text-muted-foreground">+{xp_value ?? 10} XP each time</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createHabit.isPending}
                >
                  {createHabit.isPending ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

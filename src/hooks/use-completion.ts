import { useMutation, useQueryClient } from '@tanstack/react-query'
import { processCompletion } from '@/api/completions'
import { habitKeys } from './use-habits'
import { toast } from 'sonner'

export function useProcessCompletion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ habitId, source }: { habitId: string; source?: string }) =>
      processCompletion(habitId, source ?? 'app'),
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.list() })
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
      toast.success('Habit completed! +XP')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

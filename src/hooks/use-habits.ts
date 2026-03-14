import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { habitsApi } from '@/api/habits'
import { toast } from 'sonner'
import type { HabitUpdate } from '@/types/habit'

export const habitKeys = {
  all: ['habits'] as const,
  list: () => [...habitKeys.all, 'list'] as const,
  detail: (id: string) => [...habitKeys.all, 'detail', id] as const,
}

export function useHabits() {
  return useQuery({
    queryKey: habitKeys.list(),
    queryFn: habitsApi.getAll,
    staleTime: 1000 * 60 * 2,
  })
}

export function useHabit(id: string) {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => habitsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.list() })
      toast.success('Habit created!')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: HabitUpdate }) =>
      habitsApi.update(id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(habitKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: habitKeys.list() })
      toast.success('Habit updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsApi.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: habitKeys.list() })
      toast.success('Habit removed')
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

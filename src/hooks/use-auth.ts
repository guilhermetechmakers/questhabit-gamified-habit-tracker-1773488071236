import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/user'
import type { UserStats } from '@/types/user'

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data
    },
    enabled: !!userId,
  })
}

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async (): Promise<UserStats | null> => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data
    },
    enabled: !!userId,
  })
}

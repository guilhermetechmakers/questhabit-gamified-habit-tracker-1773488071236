import type { Database } from './database'

export type Habit = Database['public']['Tables']['habits']['Row']
export type HabitInsert = Database['public']['Tables']['habits']['Insert']
export type HabitUpdate = Database['public']['Tables']['habits']['Update']

export interface ScheduleJson {
  frequency?: 'daily' | 'weekly' | 'custom'
  days?: number[]
  times?: string[]
  timezone?: string
}

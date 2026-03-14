import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']

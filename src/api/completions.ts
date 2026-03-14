import { supabase } from '@/lib/supabase'

export interface ProcessCompletionResult {
  success: boolean
  xp_awarded: number
  xp_total: number
  level: number
  current_streak: number
  longest_streak: number
}

export async function processCompletion(habitId: string, source = 'app'): Promise<ProcessCompletionResult> {
  const { data, error } = await supabase.functions.invoke<ProcessCompletionResult>('process-completion', {
    body: { habit_id: habitId, source },
  })
  if (error) throw error
  if (!data?.success) throw new Error('Completion failed')
  return data
}

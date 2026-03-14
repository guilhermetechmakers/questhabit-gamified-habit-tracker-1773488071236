import { supabase } from '@/lib/supabase'
import type { Habit, HabitInsert, HabitUpdate } from '@/types/habit'

export const habitsApi = {
  async getAll(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getById(id: string): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  },

  async create(habit: HabitInsert): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single()
    if (error) throw error
    return data as Habit
  },

  async update(id: string, updates: HabitUpdate): Promise<Habit> {
    const { data, error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Habit
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (error) throw error
  },
}

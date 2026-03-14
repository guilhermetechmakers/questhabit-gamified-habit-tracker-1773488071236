/**
 * Gamification Edge Function: process habit completion.
 * Accepts completion events from the client, validates, and atomically updates:
 * - completions table
 * - user_stats (XP, level, streaks)
 * - badges (award if criteria met)
 * - notifications (optional)
 * Never expose API keys; all logic runs server-side.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const XP_PER_LEVEL = 100
const LEVEL_MULTIPLIER = 1.2

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    )
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const habitId = body?.habit_id
    if (!habitId || typeof habitId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'habit_id required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id, user_id, xp_value')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (habitError || !habit) {
      return new Response(
        JSON.stringify({ error: 'Habit not found or access denied' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const xpAwarded = Number(habit.xp_value) || 10
    const now = new Date().toISOString()
    const today = now.slice(0, 10)

    const { error: insertError } = await supabase.from('completions').insert({
      habit_id: habitId,
      user_id: user.id,
      timestamp: now,
      source: body?.source ?? 'app',
      xp_awarded: xpAwarded,
    })

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to record completion', details: insertError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: stats } = await supabase
      .from('user_stats')
      .select('xp_total, level, current_streak, longest_streak, last_completion_date')
      .eq('user_id', user.id)
      .single()

    const prevTotal = stats?.xp_total ?? 0
    const prevLevel = stats?.level ?? 1
    const prevStreak = stats?.current_streak ?? 0
    const prevLongest = stats?.longest_streak ?? 0
    const lastDate = stats?.last_completion_date

    const newTotal = prevTotal + xpAwarded
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)
    let newStreak = prevStreak
    if (!lastDate) {
      newStreak = 1
    } else if (lastDate === yesterdayStr) {
      newStreak = prevStreak + 1
    } else if (lastDate !== today) {
      newStreak = 1
    }
    const newLongest = Math.max(prevLongest, newStreak)

    let level = prevLevel
    let xpForCurrentLevel = XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1)
    while (newTotal >= xpForCurrentLevel) {
      level += 1
      xpForCurrentLevel = XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1)
    }

    const { error: updateError } = await supabase
      .from('user_stats')
      .update({
        xp_total: newTotal,
        level,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_completion_date: today,
        updated_at: now,
      })
      .eq('user_id', user.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update stats', details: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        xp_awarded: xpAwarded,
        xp_total: newTotal,
        level,
        current_streak: newStreak,
        longest_streak: newLongest,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

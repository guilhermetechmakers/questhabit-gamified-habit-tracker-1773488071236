import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthUser, useProfile, useUserStats } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function Profile() {
  const navigate = useNavigate()
  const { data: user } = useAuthUser()
  const { data: profile } = useProfile(user?.id)
  const { data: stats } = useUserStats(user?.id)

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {profile?.display_name ?? user.email ?? 'User'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Level </span>
            <span className="font-semibold">{stats?.level ?? 1}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Total XP </span>
            <span className="font-semibold">{stats?.xp_total ?? 0}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Current streak </span>
            <span className="font-semibold">{stats?.current_streak ?? 0}</span>
          </p>
        </CardContent>
      </Card>
      <Button variant="outline" className="w-full" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}

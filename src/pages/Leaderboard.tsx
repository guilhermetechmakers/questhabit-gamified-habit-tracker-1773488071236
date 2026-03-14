import { Card, CardContent } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

export default function Leaderboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Trophy className="h-14 w-14 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}

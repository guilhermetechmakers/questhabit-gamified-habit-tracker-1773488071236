import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center animate-fade-in-up">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Go home
        </Link>
      </Button>
    </div>
  )
}

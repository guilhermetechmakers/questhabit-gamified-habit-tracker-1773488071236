import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '@/hooks/use-auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { data: user, isLoading } = useAuthUser()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

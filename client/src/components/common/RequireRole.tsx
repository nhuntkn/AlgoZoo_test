import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types'

interface RequireRoleProps {
  /** Allowed role(s) for this route group */
  allowed: Role | Role[]
  /** Where to redirect if unauthorized (default: role-based dashboard) */
  fallback?: string
}

/**
 * Route guard — wraps a `<Route>` group and checks the user's role.
 *
 * Usage in App.tsx:
 *   <Route element={<RequireRole allowed="admin" />}>
 *     <Route path="dashboard" element={<AdminDashboard />} />
 *   </Route>
 */
export function RequireRole({ allowed, fallback }: RequireRoleProps) {
  const { user } = useAuth()

  const roles = Array.isArray(allowed) ? allowed : [allowed]

  if (!roles.includes(user.role)) {
    const defaultPath = `/${user.role}/dashboard`
    return <Navigate to={fallback ?? defaultPath} replace />
  }

  return <Outlet />
}

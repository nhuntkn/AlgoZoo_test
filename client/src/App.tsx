import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminClasses } from './pages/admin/AdminClasses'
import { ManageClass } from './pages/admin/ManageClass'

// Auth
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

function RequireAuth() {
  const { user, authLoading } = useAuth()

  if (authLoading) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <DashboardPage />
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/classes" element={<AdminClasses />} />
                <Route path="/admin/classes/:classId/manage" element={<ManageClass />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { AppLayout } from './components/layout/AppLayout'
import { NotificationsPage } from './pages/NotificationsPage'

// Auth
import { LoginPage } from './pages/auth/LoginPage'
import { StudentJoinPage } from './pages/auth/StudentJoinPage'
import { TrainerJoinPage } from './pages/auth/TrainerJoinPage'

// Student
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentClasses } from './pages/student/StudentClasses'
import { StudentClassOverview } from './pages/student/class/StudentClassOverview'
import { StudentProblemList } from './pages/student/class/StudentProblemList'
import { ProblemWorkspace } from './pages/student/ProblemWorkspace'
import { StudentSubmissions } from './pages/student/StudentSubmissions'
import { SubmissionStatus } from './pages/student/SubmissionStatus'

// Trainer
import { TrainerDashboard } from './pages/trainer/TrainerDashboard'
import { TrainerClasses } from './pages/trainer/TrainerClasses'
import { ClassOverview } from './pages/trainer/class/ClassOverview'
import { ClassProblems } from './pages/trainer/class/ClassProblems'
import { ClassSubmissions } from './pages/trainer/class/ClassSubmissions'
import { ClassStudents } from './pages/trainer/class/ClassStudents'
import { TrainerProblems } from './pages/trainer/TrainerProblems'
import { ReviewSubmission } from './pages/trainer/ReviewSubmission'

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminProblems } from './pages/admin/AdminProblems'
import { ManageClass } from './pages/admin/ManageClass'

function RoleRedirect() {
  const { user } = useAuth()
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/trainer/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join/student/:token" element={<StudentJoinPage />} />
      <Route path="/join/trainer/:token" element={<TrainerJoinPage />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route element={<AppLayout />}>
        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/classes" element={<StudentClasses />} />
        <Route path="/student/classes/:classId" element={<Navigate to="overview" replace />} />
        <Route path="/student/classes/:classId/overview" element={<StudentClassOverview />} />
        <Route path="/student/classes/:classId/problems" element={<StudentProblemList />} />
        <Route path="/student/classes/:classId/problems/:problemId" element={<ProblemWorkspace />} />
        <Route path="/student/submissions" element={<StudentSubmissions />} />
        <Route path="/student/submissions/:id" element={<SubmissionStatus />} />

        {/* Trainer */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/classes" element={<TrainerClasses />} />
        <Route path="/trainer/classes/:classId" element={<Navigate to="overview" replace />} />
        <Route path="/trainer/classes/:classId/overview" element={<ClassOverview />} />
        <Route path="/trainer/classes/:classId/problems" element={<ClassProblems />} />
        <Route path="/trainer/classes/:classId/submissions" element={<ClassSubmissions />} />
        <Route path="/trainer/classes/:classId/students" element={<ClassStudents />} />
        <Route path="/trainer/problems" element={<TrainerProblems />} />
        <Route path="/trainer/submissions/:id" element={<ReviewSubmission />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/classes/:classId/manage" element={<ManageClass />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/problems" element={<AdminProblems />} />

        {/* Notifications (all roles) */}
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

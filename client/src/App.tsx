import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentProblems } from './pages/student/StudentProblems'
import { ProblemDetail } from './pages/student/ProblemDetail'
import { ProblemWorkspace } from './pages/student/ProblemWorkspace'
import { StudentSubmissions } from './pages/student/StudentSubmissions'
import { TrainerDashboard } from './pages/trainer/TrainerDashboard'
import { TrainerClasses } from './pages/trainer/TrainerClasses'
import { ClassView } from './pages/trainer/ClassView'
import { StudentView } from './pages/trainer/StudentView'
import { TrainerProblems } from './pages/trainer/TrainerProblems'
import { CreateProblem } from './pages/trainer/CreateProblem'
import { TrainerSubmissions } from './pages/trainer/TrainerSubmissions'
import { ReviewSubmission } from './pages/trainer/ReviewSubmission'
import { TrainerStudents } from './pages/trainer/TrainerStudents'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminClasses } from './pages/admin/AdminClasses'
import { AdminProblems } from './pages/admin/AdminProblems'
import { CreateAssignment } from './pages/trainer/CreateAssignment'

function RoleRedirect() {
  const { user } = useAuth()
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/trainer/classes" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleRedirect />} />
      <Route element={<AppLayout />}>
        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/problems" element={<StudentProblems />} />
        <Route path="/student/problems/:id" element={<ProblemDetail />} />
        <Route path="/student/problems/:id/workspace" element={<ProblemWorkspace />} />
        <Route path="/student/submissions" element={<StudentSubmissions />} />
        {/* Trainer */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/classes" element={<TrainerClasses />} />
        <Route path="/trainer/classes/:classId" element={<ClassView />} />
        <Route path="/trainer/classes/:classId/assignments/create" element={<CreateAssignment />} />
        <Route path="/trainer/classes/:classId/students/:studentId" element={<StudentView />} />
        <Route path="/trainer/problems" element={<TrainerProblems />} />
        <Route path="/trainer/problems/create" element={<CreateProblem />} />
        <Route path="/trainer/submissions" element={<TrainerSubmissions />} />
        <Route path="/trainer/submissions/:id" element={<ReviewSubmission />} />
        <Route path="/trainer/students" element={<TrainerStudents />} />
        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/problems" element={<AdminProblems />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

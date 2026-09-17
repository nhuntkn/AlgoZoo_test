import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout & guards
import { AppLayout } from './components/layout/AppLayout'
import { RequireRole } from './components/common/RequireRole'

// ── Student pages ──
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentClasses } from './pages/student/StudentClasses'
import { StudentClassOverview } from './pages/student/class/StudentClassOverview'
import { StudentProblemList } from './pages/student/class/StudentProblemList'
import { StudentSubmissions } from './pages/student/StudentSubmissions'
import { SubmissionStatus } from './pages/student/SubmissionStatus'
import { StudentProblemWorkspace } from './pages/student/class/StudentProblemWorkspace'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminClasses } from './pages/admin/AdminClasses'
import { AdminManageClass } from './pages/admin/AdminManageClass'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminUserDetail } from './pages/admin/AdminUserDetail'
import { TrainerDashboard } from './pages/trainer/TrainerDashboard'
import { TrainerClasses } from './pages/trainer/TrainerClasses'
import { TrainerClassOverview } from './pages/trainer/class/TrainerClassOverview'
import { TrainerClassProblems } from './pages/trainer/class/TrainerClassProblems'
import { TrainerClassSubmissions } from './pages/trainer/class/TrainerClassSubmissions'
import { TrainerClassStudents } from './pages/trainer/class/TrainerClassStudents'
import { TrainerSubmissionDetail } from './pages/trainer/class/TrainerSubmissionDetail'
import { TrainerProblemBank } from './pages/trainer/problems/TrainerProblemBank'
import { TrainerCreateProblem } from './pages/trainer/problems/TrainerCreateProblem'

// ─── Placeholder (for pages not yet built from Figma) ──────────────────────────

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-400">This page will be built from Figma designs.</p>
      </div>
    </div>
  )
}

// ─── Role redirect ─────────────────────────────────────────────────────────────

function RoleRedirect() {
  const { user } = useAuth()
  return <Navigate to={`/${user.role}/dashboard`} replace />
}

// ─── Routes ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/join/student/:token" element={<Placeholder title="Student Join" />} />
      <Route path="/join/trainer/:token" element={<Placeholder title="Trainer Join" />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Protected — inside AppLayout */}
      <Route element={<AppLayout />}>

        {/* ── Student ── */}
        <Route element={<RequireRole allowed="student" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/classes/:classId" element={<Navigate to="overview" replace />} />
          <Route path="/student/classes/:classId/overview" element={<StudentClassOverview />} />
          <Route path="/student/classes/:classId/problems" element={<StudentProblemList />} />
          <Route path="/student/classes/:classId/problems/:problemId" element={<StudentProblemWorkspace />} />
          <Route path="/student/submissions" element={<StudentSubmissions />} />
          <Route path="/student/submissions/:id" element={<SubmissionStatus />} />
        </Route>

        {/* ── Trainer ── */}
        <Route element={<RequireRole allowed="trainer" />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/classes" element={<TrainerClasses />} />
          <Route path="/trainer/classes/:classId" element={<Navigate to="overview" replace />} />
          <Route path="/trainer/classes/:classId/overview" element={<TrainerClassOverview />} />
          <Route path="/trainer/classes/:classId/problems" element={<TrainerClassProblems />} />
          <Route path="/trainer/classes/:classId/submissions" element={<TrainerClassSubmissions />} />
          <Route path="/trainer/classes/:classId/submissions/:submissionId" element={<TrainerSubmissionDetail />} />
          <Route path="/trainer/submissions/:submissionId" element={<TrainerSubmissionDetail />} />
          <Route path="/trainer/classes/:classId/students" element={<TrainerClassStudents />} />
          <Route path="/trainer/problems" element={<TrainerProblemBank />} />
          <Route path="/trainer/problems/new" element={<TrainerCreateProblem />} />
          <Route path="/trainer/problems/:problemId/edit" element={<TrainerCreateProblem />} />
        </Route>

        {/* ── Admin ── */}
        <Route element={<RequireRole allowed="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/classes/:classId/manage" element={<AdminManageClass />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
        </Route>

        {/* ── Shared ── */}
        <Route path="/notifications" element={<Placeholder title="Notifications" />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────

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

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { RoleRoute } from './components/RoleRoute'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Courses } from './pages/student/Courses'
import { CourseDetail } from './pages/student/CourseDetail'
import { Dashboard } from './pages/admin/Dashboard'
import { ManageCourses } from './pages/admin/ManageCourses'
import { UnitTopicManager } from './pages/admin/UnitTopicManager'
import { Sidebar } from './components/Sidebar'
import { Loader2 } from 'lucide-react'

// Root redirect handler
const RootRedirect = () => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-accentTeal animate-spin" />
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase animate-pulse">
          Redirecting...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/courses" replace />
}

// Layout for Admin routes with sidebar
const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-darkBg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/courses/:courseId/units" element={<UnitTopicManager />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Root Selector */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student routes (Accessible by both Students and Admins for previewing) */}
          <Route element={<RoleRoute allowedRoles={['student', 'admin']} />}>
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/*" element={<AdminLayout />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const RoleRoute = ({ allowedRoles }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4">
        {/* Animated Cyber-loading Ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accentTeal border-r-accentTeal animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-slate-900 bg-slate-950 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accentTeal animate-ping"></div>
          </div>
        </div>
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase animate-pulse">
          Decrypting Session...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect based on current role if they are unauthorized for the current route
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/courses" replace />
    }
  }

  return <Outlet />
}

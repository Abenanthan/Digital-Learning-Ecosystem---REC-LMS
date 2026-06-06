import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, BookOpen, LogOut, GraduationCap, User } from 'lucide-react'

export const Sidebar = () => {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-accentTeal/10 text-accentTeal border-l-4 border-accentTeal shadow-[0_0_15px_rgba(6,182,212,0.05)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent'
    }`

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-9 h-9 bg-accentTeal/10 border border-accentTeal/30 rounded-lg flex items-center justify-center text-accentTeal">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent uppercase block">
            Aadhi Admin
          </span>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
            Control Center
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/courses" className={linkClass}>
          <BookOpen className="w-4 h-4" />
          <span>Manage Courses</span>
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent`
        }>
          <GraduationCap className="w-4 h-4 text-accentCyan" />
          <span>View Student Side</span>
        </NavLink>
      </nav>

      {/* User Info / Log out */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {profile?.full_name || 'Admin User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {profile?.email || 'admin@academy.edu'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect Session</span>
        </button>
      </div>
    </aside>
  )
}

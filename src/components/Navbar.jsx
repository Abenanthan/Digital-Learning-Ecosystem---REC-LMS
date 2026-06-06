import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { GraduationCap, LogOut, User } from 'lucide-react'

export const Navbar = () => {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/courses" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accentTeal/10 border border-accentTeal/30 flex items-center justify-center text-accentTeal group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black tracking-wider text-sm bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent uppercase">
              Aadhi Academy
            </span>
          </div>
        </Link>

        {/* User Info / Logout */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">
                {profile?.full_name || 'Student'}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {profile?.role || 'Student'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/20 hover:bg-red-500/5 text-slate-400 hover:text-red-400 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

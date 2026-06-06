import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserPlus, Mail, Lock, User, Shield, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react'

export const Signup = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // 'student' | 'admin'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await signUp(email, password, fullName, role)
      setSuccess(true)
      // Clear forms
      setFullName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Cybernetic Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accentTeal/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accentCyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800/80 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-slate-900/80 border border-slate-700/50 rounded-xl flex items-center justify-center text-accentTeal shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            AADHI ACADEMY
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Establish Your Identity
          </p>
        </div>

        {/* Success Panel */}
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Identity Registered!</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your profile has been created. If email verification is enabled, check your inbox. Otherwise, proceed to sign in.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block py-2 px-6 rounded-lg bg-gradient-to-r from-accentTeal to-accentCyan text-slate-950 font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error panel */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@academy.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned Academy Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="student">Student (Access learning resources)</option>
                    <option value="admin">Administrator (Manage academy contents)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 mt-4 rounded-lg bg-gradient-to-r from-accentTeal to-accentCyan text-slate-950 font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Initialize Registration</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-accentTeal hover:underline hover:text-accentCyan transition-colors font-medium">
                  Connect Identity
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

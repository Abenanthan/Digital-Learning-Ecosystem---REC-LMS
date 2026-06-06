import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LogIn, Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react'

export const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await signIn(email, password)
      // Wait for session profile mapping redirect (handled inside protected route, but we can also trigger a redirect here)
      // We read user metadata or let the router navigate to /courses or /admin.
      // To be safe, we fetch the role from profiles table directly to do an instant redirection.
      const { data: profileData } = await signIn(email, password).then(async (res) => {
        // Just let useAuth handle the user context and we redirect to home '/' or let RoleRoutes do their work.
        // Let's redirect to '/' and let the top-level Router sort out roles!
        return res
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid email or password.')
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
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-slate-900/80 border border-slate-700/50 rounded-xl flex items-center justify-center text-accentTeal shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            AADHI ACADEMY
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Digital Learning Gateway
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 rounded-lg bg-gradient-to-r from-accentTeal to-accentCyan text-slate-950 font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Acknowledge Gateway</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            First time logging in?{' '}
            <Link to="/signup" className="text-accentTeal hover:underline hover:text-accentCyan transition-colors font-medium">
              Create an Identity
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { BookOpen, Layers, MessageSquare, PlusCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react'

export const Dashboard = () => {
  const [stats, setStats] = useState({ courses: 0, units: 0, topics: 0 })
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [message, setMessage] = useState('')

  const fetchStats = async () => {
    try {
      const [coursesCount, unitsCount, topicsCount] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('topics').select('id', { count: 'exact', head: true })
      ])

      setStats({
        courses: coursesCount.count || 0,
        units: unitsCount.count || 0,
        topics: topicsCount.count || 0
      })

      return coursesCount.count || 0
    } catch (err) {
      console.error('Error fetching statistics:', err)
    }
  }

  const checkAndSeed = async (courseCount) => {
    if (courseCount > 0) return

    setSeeding(true)
    setMessage('Initial setup: Pre-seeding IoT course...')
    try {
      // 1. Seed IoT Course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          name: 'Internet of Things (IoT)',
          description: 'A comprehensive introduction to connected architectures, smart sensors, actuators, and cloud integrations.',
          thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
        })
        .select()
        .single()

      if (courseError) throw courseError

      // 2. Auto create 5 units
      const units = Array.from({ length: 5 }, (_, i) => ({
        course_id: course.id,
        title: `Unit ${i + 1}`,
        order_index: i + 1
      }))

      const { error: unitsError } = await supabase.from('units').insert(units)
      if (unitsError) throw unitsError

      setMessage('Pre-seeded IoT course with 5 units successfully.')
      // Refresh stats
      await fetchStats()
    } catch (err) {
      console.error('Pre-seeding error:', err)
      setMessage(`Seeding failed: ${err.message}`)
    } finally {
      setSeeding(false)
      // Clear message after 4s
      setTimeout(() => setMessage(''), 4000)
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const count = await fetchStats()
      await checkAndSeed(count)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-darkBg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accentTeal animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Welcome Banner */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Control Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            System overview and digital learning content status.
          </p>
        </div>
        {message && (
          <div className="flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-lg border border-accentTeal/20 bg-accentTeal/5 text-accentTeal animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Courses Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentTeal/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accentTeal/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-accentTeal">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-slate-100">{stats.courses}</span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Courses</h3>
          <p className="text-xs text-slate-500 mt-1">Curated educational courses</p>
        </div>

        {/* Units Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentCyan/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accentCyan/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-accentCyan">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-slate-100">{stats.units}</span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Subjects (Units)</h3>
          <p className="text-xs text-slate-500 mt-1">Structured modules under courses</p>
        </div>

        {/* Topics Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-slate-100">{stats.topics}</span>
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Topics</h3>
          <p className="text-xs text-slate-500 mt-1">Lectures and uploads</p>
        </div>
      </div>

      {/* Navigation Panels */}
      <h2 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-wider">Quick Directives</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Create & Manage Courses</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Define course catalogs, edit descriptions, adjust thumbnail URLs, and auto-initialize units (5 units per course).
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/admin/courses"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-accentTeal hover:text-accentCyan transition-colors group"
            >
              <span>Launch Manager</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Configure Units & Upload Material</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manage specific courses, bulk-paste topic titles under units, and upload videos or document materials.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/admin/courses"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-accentCyan hover:text-accentTeal transition-colors group"
            >
              <span>Select Course to Configure</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

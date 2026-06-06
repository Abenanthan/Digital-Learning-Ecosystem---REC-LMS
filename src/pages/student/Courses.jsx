import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { Navbar } from '../../components/Navbar'
import { BookOpen, Search, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react'

export const Courses = () => {
  const [courses, setCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const { data, error: fetchErr } = await supabase
          .from('courses')
          .select('*, units(id)')
          .order('name', { ascending: true })

        if (fetchErr) throw fetchErr
        setCourses(data || [])
      } catch (err) {
        console.error(err)
        setError('Unable to load courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-darkBg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Academic Curriculums
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Select a learning path below to begin your educational journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
          />
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-accentTeal animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md mx-auto text-center">
            {error}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl text-slate-500">
            {searchQuery ? 'No courses matches your search query.' : 'No courses are currently published.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const unitCount = course.units?.length || 0

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-800/80"
                >
                  {/* Thumbnail */}
                  <div className="h-44 w-full bg-slate-950 border-b border-slate-900 relative overflow-hidden flex items-center justify-center text-slate-600">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8" />
                    )}
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800/60 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {unitCount} {unitCount === 1 ? 'Unit' : 'Units'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-100 text-lg group-hover:text-accentTeal transition-colors line-clamp-1">
                        {course.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-accentTeal pt-2">
                      <span className="uppercase tracking-wider group-hover:text-accentCyan transition-colors">
                        Begin Curriculum
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

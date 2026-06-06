import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { Navbar } from '../../components/Navbar'
import { VideoPlayer } from '../../components/VideoPlayer'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react'

export const CourseDetail = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [units, setUnits] = useState([])
  const [topicsByUnit, setTopicsByUnit] = useState({})
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Accordion state (open unit id, default to first unit)
  const [openUnitId, setOpenUnitId] = useState(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true)
      try {
        // 1. Fetch Course details
        const { data: courseData, error: cErr } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single()

        if (cErr) throw cErr
        setCourse(courseData)

        // 2. Fetch Units
        const { data: unitsData, error: uErr } = await supabase
          .from('units')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true })

        if (uErr) throw uErr
        setUnits(unitsData || [])

        if (unitsData?.length > 0) {
          setOpenUnitId(unitsData[0].id)
        }

        // 3. Fetch Topics & Materials for all units of this course
        if (unitsData && unitsData.length > 0) {
          const unitIds = unitsData.map((u) => u.id)
          const { data: topicsData, error: tErr } = await supabase
            .from('topics')
            .select('*, materials(*)')
            .in('unit_id', unitIds)
            .order('order_index', { ascending: true })

          if (tErr) throw tErr

          // Group topics by unit_id
          const grouped = {}
          unitsData.forEach((unit) => {
            grouped[unit.id] = []
          })
          topicsData?.forEach((topic) => {
            if (grouped[topic.unit_id]) {
              grouped[topic.unit_id].push(topic)
            }
          })
          setTopicsByUnit(grouped)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch course details. Please verify your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const toggleUnit = (unitId) => {
    setOpenUnitId(openUnitId === unitId ? null : unitId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-accentTeal animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold text-slate-100">Course Not Found</h2>
          <p className="text-sm text-slate-400 text-center max-w-sm">
            {error || 'The requested curriculum does not exist or has been retracted.'}
          </p>
          <Link
            to="/courses"
            className="py-2.5 px-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Return to Curriculums
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-darkBg flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-350 uppercase mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Course Header Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl glass border border-slate-850 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accentTeal/5 rounded-full blur-[80px] pointer-events-none"></div>

          {course.thumbnail_url && (
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex-shrink-0 overflow-hidden">
              <img src={course.thumbnail_url} alt={course.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
              {course.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>
        </div>

        {/* Units Accordion */}
        <div className="space-y-4">
          {units.map((unit) => {
            const isOpen = openUnitId === unit.id
            const topics = topicsByUnit[unit.id] || []

            return (
              <div
                key={unit.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-slate-800 bg-slate-900/10' : 'border-slate-800/60 bg-slate-950/10'
                }`}
              >
                {/* Unit Button */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-900/20 transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-sm border border-slate-800 text-accentTeal">
                      U{unit.order_index}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100">{unit.title}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {topics.length} Lectures Available
                      </span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {/* Unit Details */}
                {isOpen && (
                  <div className="p-6 border-t border-slate-900 bg-slate-950/40 space-y-6">
                    {topics.length === 0 ? (
                      <p className="text-sm text-slate-500 italic py-3 text-center">
                        This unit does not have any lectures published yet.
                      </p>
                    ) : (
                      <div className="space-y-8 divide-y divide-slate-900">
                        {topics.map((topic, index) => (
                          <div
                            key={topic.id}
                            className={`space-y-4 ${index > 0 ? 'pt-6' : ''}`}
                          >
                            {/* Topic title */}
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full bg-accentTeal mt-1.5 flex-shrink-0 animate-pulse"></div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-200">{topic.title}</h4>
                              </div>
                            </div>

                            {/* Materials download section */}
                            {topic.materials && topic.materials.length > 0 && (
                              <div className="pl-5 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                                  Course Documents
                                </span>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                                  {topic.materials.map((mat) => (
                                    <a
                                      key={mat.id}
                                      href={mat.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-850 hover:border-accentTeal/30 hover:bg-slate-900/40 text-xs text-slate-300 hover:text-accentTeal transition-all max-w-sm sm:max-w-max"
                                    >
                                      <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="truncate max-w-[150px]">{mat.file_name}</span>
                                      <Download className="w-3 h-3 text-slate-500" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Video player section */}
                            {topic.video_url && (
                              <div className="pl-5 pt-2">
                                <VideoPlayer src={topic.video_url} title={topic.title} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

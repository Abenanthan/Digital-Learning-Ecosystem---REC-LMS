import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { BookOpen, Edit2, Trash2, Plus, X, Layers, Save, Loader2, Image as ImageIcon } from 'lucide-react'

export const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form State
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchErr } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setCourses(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to fetch courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFormLoading(true)

    try {
      if (editingId) {
        // Edit Course
        const { error: updateErr } = await supabase
          .from('courses')
          .update({ name, description, thumbnail_url: thumbnailUrl })
          .eq('id', editingId)

        if (updateErr) throw updateErr
        setSuccess('Course updated successfully.')
        setEditingId(null)
      } else {
        // Create Course
        const { data: course, error: insertErr } = await supabase
          .from('courses')
          .insert({ name, description, thumbnail_url: thumbnailUrl })
          .select()
          .single()

        if (insertErr) throw insertErr

        // Auto create 5 units for this course
        const units = Array.from({ length: 5 }, (_, i) => ({
          course_id: course.id,
          title: `Unit ${i + 1}`,
          order_index: i + 1
        }))

        const { error: unitsErr } = await supabase.from('units').insert(units)
        if (unitsErr) throw unitsErr

        setSuccess('Course and 5 default units created successfully.')
      }

      // Reset form
      setName('')
      setDescription('')
      setThumbnailUrl('')
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Action failed.')
    } finally {
      setFormLoading(false)
    }
  }

  const startEdit = (course) => {
    setEditingId(course.id)
    setName(course.name)
    setDescription(course.description || '')
    setThumbnailUrl(course.thumbnail_url || '')
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setThumbnailUrl('')
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you absolutely sure? Deleting this course will remove all associated units, topics, and material files.')) {
      return
    }

    setError('')
    setSuccess('')
    try {
      const { error: deleteErr } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (deleteErr) throw deleteErr
      setSuccess('Course deleted successfully.')
      fetchCourses()
    } catch (err) {
      console.error(err)
      setError('Failed to delete course.')
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Title */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Course Catalog Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Build learning paths, publish topics, and initialize curriculum modules.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* Forms & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl sticky top-8 border border-slate-800/80">
            <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center space-x-2">
              {editingId ? (
                <>
                  <Edit2 className="w-5 h-5 text-accentTeal" />
                  <span>Edit Course Profile</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-accentTeal" />
                  <span>Create Course</span>
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Intro to Artificial Intelligence"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize course goals and curricula..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentTeal/80 focus:ring-1 focus:ring-accentTeal/30 transition-all text-sm"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-accentTeal to-accentCyan text-slate-950 font-bold uppercase tracking-wider text-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(6,182,212,0.15)]"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : editingId ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Course Cards List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider mb-4">Existing Curriculums</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-accentTeal animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
              No courses configured. Use the form to establish one.
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Thumbnail Preview */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-600">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-100 leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <Link
                      to={`/admin/courses/${course.id}/units`}
                      className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-accentTeal hover:border-accentTeal/50 transition-colors text-xs font-semibold flex items-center space-x-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Units & Topics</span>
                    </Link>

                    <button
                      onClick={() => startEdit(course)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-red-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

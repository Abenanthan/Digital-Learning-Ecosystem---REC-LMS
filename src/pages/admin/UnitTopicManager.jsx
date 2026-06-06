import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Trash2,
  Upload,
  Plus,
  Loader2,
  FileDown,
  Play,
  ArrowLeft,
  Sparkles
} from 'lucide-react'

export const UnitTopicManager = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [units, setUnits] = useState([])
  const [topicsByUnit, setTopicsByUnit] = useState({})
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Accordion state (which unit is open, defaults to Unit 1 open)
  const [openUnitId, setOpenUnitId] = useState(null)

  // Bulk topic form states
  const [bulkInputs, setBulkInputs] = useState({}) // unitId -> text
  const [bulkLoading, setBulkLoading] = useState({}) // unitId -> bool

  // Upload loading states
  const [uploadingTopicId, setUploadingTopicId] = useState(null) // topicId where upload is happening
  const [uploadType, setUploadType] = useState(null) // 'material' | 'video'

  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [activeTopicForUpload, setActiveTopicForUpload] = useState(null)

  const fetchData = async () => {
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

      if (unitsData?.length > 0 && !openUnitId) {
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
      setError('Failed to fetch data for this course.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [courseId])

  const toggleUnit = (unitId) => {
    setOpenUnitId(openUnitId === unitId ? null : unitId)
  }

  const handleBulkSubmit = async (e, unitId) => {
    e.preventDefault()
    const text = bulkInputs[unitId] || ''
    if (!text.trim()) return

    setBulkLoading((prev) => ({ ...prev, [unitId]: true }))
    setError('')
    setSuccess('')

    try {
      const titles = text
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      if (titles.length === 0) return

      // Find current max order_index to append
      const existingTopics = topicsByUnit[unitId] || []
      const maxOrder = existingTopics.reduce((max, t) => Math.max(max, t.order_index || 0), 0)

      const topicsToInsert = titles.map((title, index) => ({
        unit_id: unitId,
        title,
        order_index: maxOrder + index + 1
      }))

      const { error: insertErr } = await supabase.from('topics').insert(topicsToInsert)
      if (insertErr) throw insertErr

      setSuccess(`Created ${titles.length} topics.`)
      setBulkInputs((prev) => ({ ...prev, [unitId]: '' }))
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to bulk-create topics.')
    } finally {
      setBulkLoading((prev) => ({ ...prev, [unitId]: false }))
    }
  }

  const handleTopicDelete = async (topicId) => {
    if (!window.confirm('Delete this topic and all its uploaded videos/materials?')) {
      return
    }

    setError('')
    setSuccess('')
    try {
      const { error: deleteErr } = await supabase.from('topics').delete().eq('id', topicId)
      if (deleteErr) throw deleteErr

      setSuccess('Topic deleted.')
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete topic.')
    }
  }

  // File Upload Handlers
  const triggerMaterialUpload = (topic) => {
    setActiveTopicForUpload(topic)
    fileInputRef.current?.click()
  }

  const triggerVideoUpload = (topic) => {
    setActiveTopicForUpload(topic)
    videoInputRef.current?.click()
  }

  const handleMaterialChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeTopicForUpload) return

    setUploadingTopicId(activeTopicForUpload.id)
    setUploadType('material')
    setError('')
    setSuccess('')

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
      const storagePath = `${activeTopicForUpload.id}/${Date.now()}-${cleanFileName}.${fileExt}`

      const { data: storageData, error: uploadErr } = await supabase.storage
        .from('course-materials')
        .upload(storagePath, file, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(storagePath)

      // 3. Save to materials table
      const { error: dbErr } = await supabase.from('materials').insert({
        topic_id: activeTopicForUpload.id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: fileExt
      })

      if (dbErr) throw dbErr

      setSuccess(`Material "${file.name}" uploaded successfully.`)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(`Material upload failed: ${err.message}`)
    } finally {
      setUploadingTopicId(null)
      setUploadType(null)
      setActiveTopicForUpload(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeTopicForUpload) return

    // Verify type
    if (!file.type.startsWith('video/')) {
      setError('Selected file is not a valid video.')
      return
    }

    setUploadingTopicId(activeTopicForUpload.id)
    setUploadType('video')
    setError('')
    setSuccess('')

    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop()
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_')
      const storagePath = `${activeTopicForUpload.id}/${Date.now()}-${cleanFileName}.${fileExt}`

      const { data: storageData, error: uploadErr } = await supabase.storage
        .from('course-videos')
        .upload(storagePath, file, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(storagePath)

      // 3. Update topic's video_url
      const { error: dbErr } = await supabase
        .from('topics')
        .update({ video_url: publicUrl })
        .eq('id', activeTopicForUpload.id)

      if (dbErr) throw dbErr

      setSuccess(`Video "${file.name}" uploaded successfully.`)
      await fetchData()
    } catch (err) {
      console.error(err)
      setError(`Video upload failed: ${err.message}`)
    } finally {
      setUploadingTopicId(null)
      setUploadType(null)
      setActiveTopicForUpload(null)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const handleMaterialDelete = async (materialId) => {
    if (!window.confirm('Delete this uploaded material?')) return

    setError('')
    setSuccess('')
    try {
      // For simplicity, we just delete the database record. 
      // (Cascading storage deletion requires parsing path, but deleting DB row is the main requirement)
      const { error: dbErr } = await supabase.from('materials').delete().eq('id', materialId)
      if (dbErr) throw dbErr

      setSuccess('Material removed.')
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to delete material.')
    }
  }

  const handleVideoRemove = async (topicId) => {
    if (!window.confirm('Remove this video?')) return

    setError('')
    setSuccess('')
    try {
      const { error: dbErr } = await supabase
        .from('topics')
        .update({ video_url: null })
        .eq('id', topicId)
      if (dbErr) throw dbErr

      setSuccess('Video removed.')
      await fetchData()
    } catch (err) {
      console.error(err)
      setError('Failed to remove video.')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-darkBg flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accentTeal animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Back button */}
      <Link
        to="/admin/courses"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-200 uppercase mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
            {course?.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-semibold flex items-center space-x-2">
            <span className="text-accentTeal">Curriculum Management</span>
            <span>•</span>
            <span>{units.length} Modules configured</span>
          </p>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleMaterialChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoChange}
        className="hidden"
        accept="video/mp4,video/webm,video/ogg"
      />

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

      {/* Units Accordion List */}
      <div className="space-y-4 max-w-4xl">
        {units.map((unit) => {
          const isOpen = openUnitId === unit.id
          const topics = topicsByUnit[unit.id] || []

          return (
            <div
              key={unit.id}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-slate-800 bg-slate-900/30' : 'border-slate-800/60 bg-slate-950/20'
              }`}
            >
              {/* Unit Header */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-900/40 transition-colors text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-sm border border-slate-800 text-slate-300">
                    U{unit.order_index}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{unit.title}</h3>
                    <p className="text-xs text-slate-500">{topics.length} topics added</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="p-6 border-t border-slate-900 bg-slate-950/60 space-y-6">
                  {/* Topic Bulk Creation */}
                  <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accentTeal" />
                      <span>Bulk Create Topics</span>
                    </h4>
                    <form onSubmit={(e) => handleBulkSubmit(e, unit.id)} className="space-y-3">
                      <textarea
                        rows={3}
                        value={bulkInputs[unit.id] || ''}
                        onChange={(e) =>
                          setBulkInputs((prev) => ({ ...prev, [unit.id]: e.target.value }))
                        }
                        placeholder="Paste topic titles here, one per line...&#10;Topic 1: Overview&#10;Topic 2: Hardware Architecture"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-accentTeal/60 focus:ring-1 focus:ring-accentTeal/20 transition-all text-sm resize-none"
                      />
                      <button
                        type="submit"
                        disabled={bulkLoading[unit.id] || !(bulkInputs[unit.id] || '').trim()}
                        className="py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:border-slate-600 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {bulkLoading[unit.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>Deploy Topics</span>
                      </button>
                    </form>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Topics Curriculum
                    </h4>

                    {topics.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-slate-900 rounded-lg">
                        No topics defined under this unit.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {topics.map((topic) => {
                          const isTopicUploading = uploadingTopicId === topic.id
                          return (
                            <div
                              key={topic.id}
                              className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 hover:border-slate-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-2 flex-1">
                                <span className="text-sm font-semibold text-slate-200">
                                  {topic.title}
                                </span>

                                {/* Video URL badge if uploaded */}
                                {topic.video_url && (
                                  <div className="flex items-center space-x-2 text-[11px] text-accentCyan bg-accentCyan/5 border border-accentCyan/10 px-2.5 py-1 rounded-md w-max">
                                    <Video className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-xs">{topic.video_url}</span>
                                    <button
                                      onClick={() => handleVideoRemove(topic.id)}
                                      className="text-red-400 hover:text-red-300 font-bold ml-1"
                                      title="Remove Video"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}

                                {/* Materials lists */}
                                {topic.materials && topic.materials.length > 0 && (
                                  <div className="space-y-1 mt-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                      Materials
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {topic.materials.map((mat) => (
                                        <div
                                          key={mat.id}
                                          className="flex items-center space-x-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded"
                                        >
                                          <FileText className="w-3 h-3 text-accentTeal" />
                                          <span className="truncate max-w-[120px]">{mat.file_name}</span>
                                          <button
                                            onClick={() => handleMaterialDelete(mat.id)}
                                            className="text-red-500 hover:text-red-400 font-bold ml-1 text-xs"
                                            title="Delete Material"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Upload & Actions Buttons */}
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Upload Material Button */}
                                <button
                                  onClick={() => triggerMaterialUpload(topic)}
                                  disabled={isTopicUploading}
                                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-accentTeal hover:border-accentTeal/40 transition-colors text-[11px] font-semibold flex items-center space-x-1 disabled:opacity-50"
                                >
                                  {isTopicUploading && uploadType === 'material' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accentTeal" />
                                  ) : (
                                    <Upload className="w-3.5 h-3.5" />
                                  )}
                                  <span>+ Doc</span>
                                </button>

                                {/* Upload Video Button */}
                                <button
                                  onClick={() => triggerVideoUpload(topic)}
                                  disabled={isTopicUploading}
                                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-accentCyan hover:border-accentCyan/40 transition-colors text-[11px] font-semibold flex items-center space-x-1 disabled:opacity-50"
                                >
                                  {isTopicUploading && uploadType === 'video' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-accentCyan" />
                                  ) : (
                                    <Video className="w-3.5 h-3.5" />
                                  )}
                                  <span>+ Video</span>
                                </button>

                                {/* Delete Topic */}
                                <button
                                  onClick={() => handleTopicDelete(topic.id)}
                                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-red-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                  title="Delete Topic"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import { Video } from 'lucide-react'

export const VideoPlayer = ({ src, title }) => {
  if (!src) return null

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.08)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]">
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <video
          src={src}
          controls
          className="w-full h-full object-contain focus:outline-none"
          preload="metadata"
        >
          Your browser does not support the video playback of this format.
        </video>
      </div>
      {title && (
        <div className="bg-slate-900/90 px-4 py-2.5 border-t border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 truncate">
            <Video className="w-3.5 h-3.5 text-accentTeal" />
            <span className="truncate">{title}</span>
          </div>
          <span className="text-[9px] bg-accentTeal/10 text-accentTeal border border-accentTeal/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest flex-shrink-0">
            AADHI PLAYER
          </span>
        </div>
      )}
    </div>
  )
}

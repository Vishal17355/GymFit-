import React, { useState } from 'react';
import { Film, Play, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

/**
 * ExerciseVideo Component
 *
 * Displays exercise animation videos or an interactive placeholder ready
 * for users to connect real video/animation assets later.
 *
 * @param {string|null} videoUrl - URL to MP4/WebM/GIF animation file
 * @param {string} title - Exercise name
 * @param {string} targetRegion - Muscle subdivision
 */
export const ExerciseVideo = ({
  videoUrl = null,
  title = 'Exercise Animation',
  targetRegion = 'Target Muscle'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // If a real animation/video URL is provided, render native video player
  if (videoUrl) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
        <video
          src={videoUrl}
          title={title}
          controls
          loop
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-semibold text-red-400 border border-red-500/30">
          {targetRegion}
        </div>
      </div>
    );
  }

  // Placeholder Mode: High-tech 3D anatomical exercise animation placeholder
  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-slate-800 shadow-inner flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all duration-300 hover:border-red-500/50 hover:shadow-red-500/10"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Background Animated Subtle Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(239,68,68,0.25) 1px, transparent 0)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Top Header Tags */}
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-md bg-red-950/80 backdrop-blur-md text-[10px] font-bold text-red-400 border border-red-800/40 uppercase tracking-wider flex items-center gap-1">
          <Activity className="w-2.5 h-2.5" />
          <span>{targetRegion}</span>
        </span>
      </div>

      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-400 border border-slate-800">
          HD Animation Slot
        </span>
      </div>

      {/* Central Interactive Play Emblem */}
      <div className="relative mb-2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg">
          <Play className="w-5 h-5 ml-0.5 fill-current" />
        </div>
        <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping pointer-events-none opacity-40" />
      </div>

      {/* Exercise Animation Placeholder Label */}
      <h5 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 max-w-[90%]">
        {title}
      </h5>

      <p className="text-[11px] text-slate-400 mt-1 max-w-[85%] font-medium leading-relaxed">
        3D Biomechanical Exercise Animation Slot
      </p>

      {/* Integration Helper Badge */}
      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[10px] text-slate-400 group-hover:border-slate-600 transition-colors">
        <Film className="w-3 h-3 text-red-400" />
        <span>Ready for MP4 / WebM / Lottie</span>
      </div>
    </div>
  );
};

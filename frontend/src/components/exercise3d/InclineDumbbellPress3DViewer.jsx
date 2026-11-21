import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Activity,
  Wind,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  CheckCircle2,
  Gauge
} from 'lucide-react';

/**
 * InclineDumbbellPress3DViewer Component
 *
 * Professional AI-Generated Gym Exercise Animation Player for Incline Dumbbell Bench Press.
 * Plays the hyper-realistic Kling AI video loop while providing full interactive gym coaching controls:
 * - Play / Pause / Replay
 * - Speed controls: 0.5x, 1x, 1.5x
 * - Seekable timeline scrubber
 * - Repetition counter
 * - Real-time breathing and contraction phase coach (Eccentric / Concentric / Peak Squeeze)
 * - Target muscle breakdown (Upper Chest in Red, Front Delts & Triceps in Orange)
 * - Form instructions drawer
 */
export const InclineDumbbellPress3DViewer = ({
  autoPlay = true,
  className = '',
  onClose = null,
  videoSrc = '/exercises/incline_dumbbell_press.mp4'
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Playback & Tracking State
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6.0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [highlightOverlay, setHighlightOverlay] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const lastTimeRef = useRef(0);

  // Format seconds to mm:ss.ms
  const formatTime = (secs) => {
    const s = Math.max(0, secs);
    const m = Math.floor(s / 60);
    const rem = (s % 60).toFixed(1);
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Determine current biomechanical phase & breathing pattern based on current cycle time
  const getPhaseInfo = () => {
    const effectiveDur = duration > 0 ? duration : 6.0;
    const progress = (currentTime % effectiveDur) / effectiveDur;

    if (progress < 0.5) {
      const pct = Math.round((progress / 0.5) * 100);
      return {
        name: 'Eccentric Lowering (3s)',
        sub: `Controlled descent to upper chest (${pct}%)`,
        breath: 'Inhale into core & expand upper ribcage',
        isExhale: false,
        badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      };
    } else if (progress < 0.85) {
      const pct = Math.round(((progress - 0.5) / 0.35) * 100);
      return {
        name: 'Concentric Pressing (2s)',
        sub: `Powerful drive in converging arc (${pct}%)`,
        breath: 'Exhale through pursed lips & drive up',
        isExhale: true,
        badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
      };
    } else {
      return {
        name: 'Peak Contraction Hold (1s)',
        sub: 'Squeeze upper clavicular pecs (soft elbows)',
        breath: 'Brief pause at top contraction',
        isExhale: false,
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      };
    }
  };

  const phase = getPhaseInfo();

  // Handle Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Handle Replay action
  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    lastTimeRef.current = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  // Handle Speed change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Handle timeline slider drag
  const handleScrubChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Video time update callback for loop detection & rep counter
  const handleTimeUpdate = () => {
    if (!videoRef.current || isScrubbing) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Detect loop wrap-around to increment rep counter
    if (lastTimeRef.current > cur + 1.0) {
      setRepCount((prev) => prev + 1);
    }
    lastTimeRef.current = cur;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 6.0);
      setVideoLoaded(true);
      videoRef.current.playbackRate = playbackSpeed;
      if (autoPlay) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  // Keyboard shortcut: Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden ${className}`}
    >
      {/* ──────────────── VIDEO DISPLAY VIEWPORT ──────────────── */}
      <div className="relative flex-1 w-full min-h-[360px] sm:min-h-[460px] flex items-center justify-center bg-black overflow-hidden group">
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          autoPlay={autoPlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-contain pointer-events-auto cursor-pointer"
          onClick={togglePlay}
          title="Click to Play/Pause"
        />

        {/* Ambient Top Shadow Overlay for Text Contrast */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Top-Left Exercise Badge & Angle Information */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-red-600/90 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase shadow-lg shadow-red-600/40 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Incline Dumbbell Bench Press</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 text-[10px] sm:text-xs font-semibold backdrop-blur-md">
              30° Incline
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block -ml-3"></span>
              <strong className="text-white">Primary Target:</strong> Upper Chest (Clavicular Head)
            </span>
          </div>
        </div>

        {/* Top-Right Repetition Counter Card */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Reps Completed</span>
              <span className="text-lg font-black text-white">{repCount}</span>
            </div>
          </div>
        </div>

        {/* Target Muscle Highlighting Callout Card (Floating bottom left) */}
        {highlightOverlay && (
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md max-w-xs shadow-xl pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>Active Muscle Recruitment</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  Upper Chest (Clavicular)
                </span>
                <span className="font-bold text-red-400">100% Primary</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Front Deltoids & Triceps
                </span>
                <span className="font-semibold text-amber-400">Secondary Synergists</span>
              </div>
            </div>
          </div>
        )}

        {/* Center Pause Play Overlay Indicator */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-3xl bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* ──────────────── CONTROLS & TIMELINE DOCK ──────────────── */}
      <div className="px-4 py-3 sm:px-6 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-2 shrink-0">
        {/* Dynamic Phase & Respiration Coaching Bar */}
        <div className="flex items-center justify-between gap-3 text-xs bg-slate-900/70 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold text-white">{phase.name}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">{phase.sub}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-[11px] text-cyan-300">
            <Wind className="w-3.5 h-3.5" />
            <span>{phase.breath}</span>
          </div>
        </div>

        {/* Seekable Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-semibold text-slate-400 w-11 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 6.0}
            step={0.05}
            value={currentTime}
            onChange={handleScrubChange}
            onMouseDown={handleScrubStart}
            onMouseUp={handleScrubEnd}
            onTouchStart={handleScrubStart}
            onTouchEnd={handleScrubEnd}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 focus:outline-none transition-all"
            title="Drag to scrub repetition timeline"
          />

          <span className="text-[11px] font-mono font-semibold text-slate-500 w-11">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom Playback Action Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          {/* Left: Play / Pause / Replay Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center gap-2 active:scale-95 transition-all"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Speed Control Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">Speed:</span>
            {[0.5, 1.0, 1.5].map((speed) => (
              <button
                key={`speed-${speed}`}
                type="button"
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Right: Muscle Highlight Toggle & Coaching Drawer */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHighlightOverlay(!highlightOverlay)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                highlightOverlay
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle target muscle overlay tags"
            >
              {highlightOverlay ? <Eye className="w-3.5 h-3.5 text-red-500" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Anatomy Info</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Form Cues</span>
              {showInstructions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Form & Coaching Drawer */}
        {showInstructions && (
          <div className="mt-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 animate-fadeIn">
            <h4 className="font-black text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Biomechanical Coaching & Proper Execution</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-red-400 block mb-0.5">1. 30° Incline Setup</span>
                Keep bench at 30 degrees to directly target the clavicular pectoralis without shifting tension onto front delts.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-amber-400 block mb-0.5">2. Converging Press Arc</span>
                Press upward and inward in a converging curve over upper chest. Maintain soft elbows at the top without locking.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-cyan-400 block mb-0.5">3. 3-2-1 Cadence</span>
                Inhale and lower for 3 seconds, drive upward for 2 seconds while exhaling, and hold peak squeeze for 1 second.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InclineDumbbellPress3DViewer;

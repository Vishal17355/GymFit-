import React from 'react';
import { ExerciseDemonstrationViewer } from './ExerciseDemonstrationViewer';
import {
  X,
  Dumbbell,
  Sparkles,
  Gauge,
  ListOrdered,
  AlertOctagon,
  CheckCircle2,
  Activity
} from 'lucide-react';

/**
 * ExerciseDemonstrationModal Component
 *
 * Full-featured modal providing interactive 3D demonstration
 * alongside comprehensive biomechanical exercise cues, targeted anatomy,
 * and step-by-step performance instructions.
 */
export const ExerciseDemonstrationModal = ({
  exercise = null,
  isOpen = false,
  onClose = () => {}
}) => {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                  Interactive 3D Biomechanics
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {exercise.targetRegion || exercise.targetMuscle}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {exercise.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
            title="Close 3D Demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Column: Interactive 3D Viewer */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <ExerciseDemonstrationViewer
              modelUrl={exercise.modelUrl || '/exercises/bicep_curl.glb'}
              exerciseName={exercise.name}
              targetMuscle={exercise.targetRegion || exercise.targetMuscle}
              equipment={exercise.equipment}
              difficulty={exercise.difficulty}
              autoPlay={true}
              className="h-[360px] sm:h-[440px] lg:h-[480px]"
            />

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>360° Interactive Orbit • Drag to rotate angle</span>
              </span>
              <span className="font-mono text-slate-400">WebGL Skeletal Rigging</span>
            </div>
          </div>

          {/* Right Column: Biomechanical Coaching Cues & Instructions */}
          <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto">
            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Overview & Mechanics
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {exercise.description}
              </p>
            </div>

            {/* Targeted Muscles */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Anatomical Targets
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {exercise.primaryMuscles?.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold"
                  >
                    Primary: {m}
                  </span>
                ))}
                {exercise.secondaryMuscles?.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                  >
                    Assist: {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Cues */}
            {exercise.cues && exercise.cues.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Execution Cues</span>
                </h5>
                <ul className="space-y-1.5">
                  {exercise.cues.map((cue, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {exercise.instructions && exercise.instructions.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-red-500" />
                  <span>Execution Steps</span>
                </h5>
                <ol className="space-y-2">
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

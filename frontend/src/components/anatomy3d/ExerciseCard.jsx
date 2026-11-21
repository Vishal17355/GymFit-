import React, { useState } from 'react';
import { ExerciseDemonstrationViewer } from '../exercise3d/ExerciseDemonstrationViewer';
import { ExerciseDemonstrationModal } from '../exercise3d/ExerciseDemonstrationModal';
import { getExerciseDemoData } from '../../data/exerciseDemoData';
import {
  Dumbbell,
  AlertOctagon,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Gauge,
  Sparkles,
  Maximize2,
  CheckCircle2,
  Eye
} from 'lucide-react';

/**
 * ExerciseCard Component
 * Displays comprehensive exercise discovery details with real-time
 * interactive 3D skeletal animation demonstration.
 */
export const ExerciseCard = ({ exercise, targetRegion }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showFull3DModal, setShowFull3DModal] = useState(false);

  if (!exercise) return null;

  // Resolve matching 3D demonstration GLB model and biomechanical coaching data
  const demoData = getExerciseDemoData(exercise.id || exercise.name) || {};
  const mergedExercise = {
    ...demoData,
    ...exercise,
    modelUrl: exercise.modelUrl || demoData.modelUrl || '/exercises/bicep_curl.glb',
    targetRegion: targetRegion || exercise.targetRegion || demoData.targetRegion || 'Target Muscle'
  };

  // Difficulty badge styling
  const difficultyColors = {
    Beginner:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Intermediate:
      'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Advanced:
      'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  };

  const badgeClass =
    difficultyColors[mergedExercise.difficulty] || difficultyColors.Beginner;

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 transition-all duration-300 overflow-hidden group">
      {/* Interactive 3D Exercise Skeletal Animation Demonstration Area */}
      <div className="relative p-2.5 bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <ExerciseDemonstrationViewer
          modelUrl={mergedExercise.modelUrl}
          videoUrl={mergedExercise.videoUrl}
          exerciseName={mergedExercise.name}
          targetMuscle={mergedExercise.targetRegion}
          equipment={mergedExercise.equipment}
          difficulty={mergedExercise.difficulty}
          autoPlay={true}
          className="h-[320px] sm:h-[350px]"
        />

        {/* Quick Launch Full 3D Coaching Experience Button */}
        <button
          type="button"
          onClick={() => setShowFull3DModal(true)}
          className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-red-600 text-white text-[10px] font-bold border border-slate-700/60 shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
          title="Open Full 3D Interactive Coach"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Full 3D Coach</span>
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges: Target Region, Equipment & Difficulty */}
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/80 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 uppercase tracking-wider">
              {mergedExercise.targetRegion}
            </span>

            <div className="flex items-center gap-1.5">
              {mergedExercise.difficulty && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${badgeClass}`}
                >
                  <Gauge className="w-2.5 h-2.5" />
                  <span>{mergedExercise.difficulty}</span>
                </span>
              )}

              {mergedExercise.equipment && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <Dumbbell className="w-2.5 h-2.5" />
                  <span>{mergedExercise.equipment}</span>
                </span>
              )}
            </div>
          </div>

          {/* Exercise Title */}
          <h4 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors mb-2">
            {mergedExercise.name}
          </h4>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {mergedExercise.description}
          </p>

          {/* Primary & Secondary Muscles Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-bold text-slate-500 dark:text-slate-400">Target:</span>
            {mergedExercise.primaryMuscles?.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 font-bold"
              >
                {m}
              </span>
            ))}
            {mergedExercise.secondaryMuscles && (
              <>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1">Assist:</span>
                {mergedExercise.secondaryMuscles.map((m) => (
                  <span
                    key={m}
                    className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px]"
                  >
                    {m}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Step-by-Step Instructions & Mistakes (Toggle Accordion) */}
          {mergedExercise.instructions && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors py-1"
              >
                <span className="flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-red-500" />
                  <span>How to Perform & Form Cues</span>
                </span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showDetails && (
                <div className="space-y-3 pt-1 animate-fadeIn">
                  {/* Step-by-Step Instructions */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Execution Steps:
                    </h5>
                    <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside leading-relaxed">
                      {mergedExercise.instructions.map((step, idx) => (
                        <li key={idx} className="font-medium">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Form Cues */}
                  {mergedExercise.cues && mergedExercise.cues.length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Key Biomechanical Cues:</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200 list-disc list-inside leading-relaxed">
                        {mergedExercise.cues.map((cue, idx) => (
                          <li key={idx} className="font-medium">
                            <span>{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Mistakes to Avoid */}
                  {mergedExercise.mistakes && mergedExercise.mistakes.length > 0 && (
                    <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1.5 flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3 text-rose-500" />
                        <span>Common Mistakes to Avoid:</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 list-disc list-inside leading-relaxed">
                        {mergedExercise.mistakes.map((mistake, idx) => (
                          <li key={idx} className="font-medium">
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full 3D Interactive Coaching Modal */}
      {showFull3DModal && (
        <ExerciseDemonstrationModal
          exercise={mergedExercise}
          isOpen={showFull3DModal}
          onClose={() => setShowFull3DModal(false)}
        />
      )}
    </div>
  );
};

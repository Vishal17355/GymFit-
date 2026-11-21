import React from 'react';
import { ExerciseCard } from './ExerciseCard';
import { Dumbbell, Sparkles } from 'lucide-react';

/**
 * ExerciseList Component
 * Displays the curated exercise cards for the selected region.
 *
 * @param {Array} exercises - List of exercise objects
 * @param {string} targetRegion - Active muscle region name
 */
export const ExerciseList = ({ exercises = [], targetRegion = 'Target Muscle' }) => {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
        <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm font-semibold">No exercises configured for this region yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 sm:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
              Step 4
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Targeted Exercises for {targetRegion}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Carefully curated biomechanical movements with animation video slots to maximize {targetRegion} hypertrophy and strength.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 self-start sm:self-auto">
          <Dumbbell className="w-3.5 h-3.5 text-red-500" />
          <span>{exercises.length} Exercises Available</span>
        </div>
      </div>

      {/* Grid of Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            targetRegion={targetRegion}
          />
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { ChevronRight, Home, Layers, Sparkles } from 'lucide-react';

/**
 * MuscleNavigation Component
 * Breadcrumb navigation path showing the user's current selection state:
 * Workout Planner > Muscle Group > Muscle Region > Exercises
 *
 * @param {string|null} muscleGroup - Active major muscle group (e.g. Chest)
 * @param {string|null} muscleRegion - Active region (e.g. Middle Chest)
 * @param {function} onNavigateHome - Callback to return to root
 * @param {function} onNavigateGroup - Callback to return to group overview
 */
export const MuscleNavigation = ({
  muscleGroup = null,
  muscleRegion = null,
  onNavigateHome = () => {},
  onNavigateGroup = () => {}
}) => {
  return (
    <nav aria-label="Muscle Exploration Breadcrumbs" className="w-full mb-3">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {/* Root Link */}
        <li className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Workout Planner</span>
          </button>
        </li>

        {/* Major Muscle Group Breadcrumb */}
        {muscleGroup && (
          <li className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={onNavigateGroup}
              className={`hover:text-red-500 dark:hover:text-red-400 transition-colors ${
                !muscleRegion ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {muscleGroup}
            </button>
          </li>
        )}

        {/* Subregion Breadcrumb */}
        {muscleRegion && (
          <li className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/40">
              {muscleRegion}
            </span>
          </li>
        )}

        {/* Exercises Step */}
        {muscleRegion && (
          <li className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              Exercises
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

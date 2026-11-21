import React from 'react';
import {
  BookOpen,
  MapPin,
  Move,
  Trophy,
  Lightbulb,
  AlertTriangle,
  Activity,
  CheckCircle2
} from 'lucide-react';

/**
 * MuscleInformation Component
 * Educational interactive learning guide for beginners explaining:
 * - Muscle name & anatomical head
 * - Where it is located
 * - What movement it performs
 * - Why people train it
 * - Beginner-friendly explanation
 * - Important form considerations
 *
 * @param {object} regionData - Region learning metadata from MUSCLE_EXPLORATION_CONFIG
 */
export const MuscleInformation = ({ regionData }) => {
  if (!regionData) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500 text-white">
                Muscle Learning Guide
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Beginner Edition
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {regionData.name}
            </h3>
            {regionData.anatomicalHead && (
              <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                Anatomical Structure: {regionData.anatomicalHead}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Learning Modules */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Where it is located */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Where It Is Located
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {regionData.location}
            </p>
          </div>
        </div>

        {/* 2. What movement it performs */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
            <Move className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              What Movement It Performs
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {regionData.movement}
            </p>
          </div>
        </div>

        {/* 3. Why people train it */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Why People Train It
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {regionData.whyTrainIt}
            </p>
          </div>
        </div>

        {/* 4. Beginner-Friendly Explanation */}
        <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
              Beginner Analogy
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {regionData.beginnerExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Important Form Considerations Banner */}
      {regionData.formConsiderations && (
        <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold uppercase tracking-wider block text-xs mb-0.5 text-amber-700 dark:text-amber-300">
              Important Form Consideration:
            </span>
            <p className="leading-relaxed font-medium">
              {regionData.formConsiderations}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ArrowRight, Zap, Target, Layers } from 'lucide-react';

export const WorkoutPlanCard = ({ onClick, to = '/member/workout-plan', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      className={`group relative text-left p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-200 cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Icon & Tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-13 h-13 w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            <Dumbbell className="w-6 h-6 -rotate-45" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-200/60 dark:border-cyan-900/60">
            Gym Training
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          Workout Plan
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Structured gym routines focused on resistance training, periodized splits, and progressive overload tracking.
        </p>

        {/* Feature Highlights */}
        <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Target sets, rep ranges &amp; RPE loads</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Push, Pull, Legs &amp; Upper/Lower splits</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Barbell, dumbbell &amp; cable movements</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
        <span>Open Workout Plan</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

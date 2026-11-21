import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, Activity, Flame, Shield } from 'lucide-react';

export const HomeWorkoutPlanCard = ({ onClick, to = '/home-workout', className = '' }) => {
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
      className={`group relative text-left p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-200 cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Icon & Tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <Home className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-900/60">
            No Equipment
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          Home Workout Plan
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Convenient bodyweight routines, mobility work, and high-intensity circuits engineered for training anywhere.
        </p>

        {/* Feature Highlights */}
        <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Calisthenics &amp; bodyweight progressions</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>High-intensity interval &amp; cardio conditioning</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Joint mobility &amp; core stability routines</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
        <span>Open Home Workout Plan</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

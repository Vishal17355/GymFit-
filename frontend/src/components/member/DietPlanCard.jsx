import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, ArrowRight, Apple, HeartPulse, Scale } from 'lucide-react';

export const DietPlanCard = ({ onClick, to = '/member/diet-plan', className = '' }) => {
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
      className={`group relative text-left p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-200 cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Icon & Tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/60">
            Nutrition &amp; Fuel
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          Diet Plan
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Personalized macronutrient splits, daily caloric intake targets, and structured meal recommendations.
        </p>

        {/* Feature Highlights */}
        <div className="mt-5 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Apple className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Target daily protein, carb &amp; fat breakdown</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Calorie surplus or deficit based on goals</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Hydration &amp; supplement timing guidance</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
        <span>Open Diet Plan</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

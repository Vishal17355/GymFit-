import React from 'react';
import { Layers, ChevronRight, Activity, Sparkles } from 'lucide-react';

/**
 * MuscleRegionSelector Component
 * Provides clean, interactive selector pills/cards for anatomical muscle regions.
 *
 * @param {Array} regions - List of regions (e.g. Upper Chest, Middle Chest, Lower Chest)
 * @param {string} selectedRegion - Currently active region name
 * @param {function} onSelectRegion - Callback when a region is clicked
 */
export const MuscleRegionSelector = ({
  regions = [],
  selectedRegion = null,
  onSelectRegion = () => {}
}) => {
  if (!regions || regions.length === 0) return null;

  return (
    <div className="w-full">
      {/* Selector Tabs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {regions.map((region, index) => {
          const isSelected = selectedRegion === region.name || selectedRegion === region.id;

          return (
            <button
              key={region.id || `region-${index}`}
              type="button"
              onClick={() => onSelectRegion(region.name)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between group shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-400 ring-4 ring-red-400/20 scale-[1.02] shadow-red-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-red-400 dark:hover:border-red-500/60 hover:bg-red-50/30 dark:hover:bg-slate-800/60'
              }`}
            >
              {/* Active Indicator Glow */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Region #{index + 1}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      isSelected
                        ? 'bg-white animate-pulse scale-110'
                        : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-red-400'
                    }`}
                  />
                </div>

                <h4
                  className={`text-base font-extrabold tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {region.name}
                </h4>

                {region.anatomicalHead && (
                  <p
                    className={`text-xs mt-0.5 font-medium ${
                      isSelected ? 'text-red-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {region.anatomicalHead}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-white/90 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                  {region.exercises?.length || 2} Exercises
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 font-bold ${
                    isSelected ? 'text-white' : 'text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
                  }`}
                >
                  <span>{isSelected ? 'Active' : 'Select'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

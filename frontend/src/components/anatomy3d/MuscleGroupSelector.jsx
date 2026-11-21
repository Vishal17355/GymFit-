import React from 'react';
import {
  Shield,
  Layers,
  Activity,
  Flame,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

/**
 * MuscleGroupSelector Component
 * Responsive navigation bar for all 7 major human muscle groups.
 *
 * @param {Array} groups - List of major muscle group names
 * @param {string|null} activeGroup - Currently active/explored muscle group
 * @param {function} onSelectGroup - Callback when group is selected
 */
export const MuscleGroupSelector = ({
  groups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Abs / Core', 'Calves'],
  activeGroup = 'Chest',
  onSelectGroup = () => {}
}) => {
  const groupIcons = {
    Chest: Shield,
    Back: Layers,
    Shoulders: Zap,
    Arms: Target,
    Legs: Flame,
    'Abs / Core': Activity,
    Calves: Sparkles
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5">
      {groups.map((grpName) => {
        const isActive = activeGroup === grpName;
        const IconComponent = groupIcons[grpName] || Activity;

        return (
          <button
            key={`grp-btn-${grpName}`}
            type="button"
            onClick={() => onSelectGroup(grpName)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
              isActive
                ? 'bg-red-500 text-white shadow-red-500/30 ring-2 ring-red-400 scale-[1.03]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-400 hover:text-red-500'
            }`}
          >
            <IconComponent
              className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-red-500'}`}
            />
            <span>{grpName}</span>
          </button>
        );
      })}
    </div>
  );
};

import React from 'react';
import { CheckCircle2, ChevronRight, Activity } from 'lucide-react';

/**
 * ChestFloatingLabels Component
 * Renders the 3 non-overlapping floating label boxes for Upper Chest, Middle Chest, and Lower Chest.
 */
export const ChestFloatingLabels = ({
  layoutItems = [],
  selectedRegion = null,
  onSelectRegion = () => {},
  onOpenExercises = () => {}
}) => {
  if (!layoutItems || layoutItems.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden">
      {layoutItems.map((item) => {
        if (item.isBehind) return null;

        const isSelected = selectedRegion === item.name;
        const opacity = item.isFacingCam ? 1.0 : 0.6;

        return (
          <div
            key={`chest-box-${item.id}`}
            style={{
              transform: `translate3d(${item.xLabel}px, ${item.yLabel}px, 0) translate(-50%, -50%)`,
              opacity,
              transition: 'opacity 0.2s ease, transform 0.04s linear'
            }}
            className="absolute pointer-events-auto"
          >
            <div
              onClick={() => onSelectRegion(item.name)}
              style={{
                borderColor: item.color,
                boxShadow: isSelected
                  ? `0 0 24px -2px ${item.color}70, 0 8px 16px -4px rgba(0,0,0,0.4)`
                  : `0 4px 14px -2px rgba(0,0,0,0.35)`
              }}
              className={`group flex flex-col gap-1 px-4 py-2.5 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-200 select-none min-w-[170px] max-w-[210px] ${
                isSelected
                  ? 'bg-slate-900/95 dark:bg-slate-950/95 scale-105 ring-2 ring-white/40 text-white'
                  : 'bg-slate-900/85 dark:bg-slate-950/85 hover:bg-slate-900/95 text-slate-200 hover:scale-102 hover:text-white'
              }`}
            >
              {/* Header: Fixed Region Color Indicator & Title */}
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: item.color }}
                  className={`w-3 h-3 rounded-full shrink-0 shadow-sm ${
                    isSelected ? 'ring-2 ring-white animate-pulse' : ''
                  }`}
                />
                <span className="text-xs sm:text-sm font-extrabold tracking-wide whitespace-nowrap">
                  {item.name}
                </span>

                {isSelected && (
                  <CheckCircle2
                    className="w-4 h-4 ml-auto shrink-0"
                    style={{ color: item.color }}
                  />
                )}
              </div>

              {/* Subtitle / Anatomical Head */}
              {item.anatomicalHead && (
                <div className="text-[10px] text-slate-400 font-semibold pl-5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.anatomicalHead}
                </div>
              )}

              {/* Action Indicator / Button */}
              {isSelected ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenExercises(item.name);
                  }}
                  style={{ backgroundColor: item.color }}
                  className="mt-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md flex items-center justify-between gap-1.5 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Explore Exercises</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="text-[9px] text-slate-400/80 group-hover:text-slate-300 font-medium pl-5 transition-colors">
                  Click to highlight region
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

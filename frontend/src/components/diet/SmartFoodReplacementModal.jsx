import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Check, Sparkles, Scale, AlertTriangle, ArrowRight } from 'lucide-react';
import { findSmartReplacements } from '../../utils/nutritionCalculator';
import { FOOD_DATABASE } from '../../data/nutritionDatabase';

export const SmartFoodReplacementModal = ({
  isOpen,
  onClose,
  foodItem,
  mealName,
  dietType = 'Vegetarian',
  allergies = [],
  dislikes = [],
  hasWhey = true,
  onConfirmReplace
}) => {
  const [selectedAltId, setSelectedAltId] = useState(null);

  useEffect(() => {
    setSelectedAltId(null);
  }, [isOpen, foodItem?.uid]);

  if (!isOpen || !foodItem) return null;

  // Retrieve smart candidate alternatives
  const smartCandidates = findSmartReplacements(foodItem.id, dietType, allergies, dislikes, hasWhey);
  const selectedAlt = smartCandidates.find((alt) => alt.id === selectedAltId) || smartCandidates[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Smart Food Swap • {mealName}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Replace {foodItem.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Food Benchmark */}
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-b border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Food Item:
          </span>
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
            <span>{foodItem.name} ({foodItem.servingSize})</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-amber-600 dark:text-amber-400">{foodItem.calories} kcal</span>
              <span className="text-emerald-600 dark:text-emerald-400">{foodItem.protein}g protein</span>
            </div>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3 max-h-[360px]">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
            Recommended Nutritional Matches:
          </span>

          {smartCandidates.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching replacements found for your current dietary filters.
            </div>
          ) : (
            smartCandidates.map((alt) => {
              const isSelected = selectedAlt?.id === alt.id;
              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAltId(alt.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {alt.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {alt.servingSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="text-amber-600 dark:text-amber-400">{alt.calories} kcal</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{alt.protein}g P</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span>Carbs: {alt.carbs}g</span>
                      <span>•</span>
                      <span>Fat: {alt.fat}g</span>
                    </span>

                    {/* Diff Indicator */}
                    <span className="font-semibold text-slate-400">
                      {alt.diff.calories >= 0 ? `+${alt.diff.calories}` : alt.diff.calories} kcal |{' '}
                      {alt.diff.protein >= 0 ? `+${alt.diff.protein}` : alt.diff.protein}g P
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedAlt}
            onClick={() => {
              if (selectedAlt) {
                onConfirmReplace(foodItem.uid, selectedAlt);
                onClose();
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <span>Confirm Replacement</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

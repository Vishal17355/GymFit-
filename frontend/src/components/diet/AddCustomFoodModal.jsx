import React, { useState } from 'react';
import { X, Search, Plus, Utensils, Check } from 'lucide-react';
import { searchFoods } from '../../data/nutritionDatabase';
import { getEligibleFoods } from '../../utils/nutritionCalculator';

export const AddCustomFoodModal = ({ isOpen, onClose, onAddFood, targetMealName, dietType = 'Vegetarian', allergies = [], dislikes = [], hasWhey = true }) => {
  const [query, setQuery] = useState('');
  const eligibleIds = new Set(getEligibleFoods(dietType, allergies, dislikes, hasWhey).map((food) => food.id));
  const results = searchFoods(query).filter((food) => eligibleIds.has(food.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Add Food • {targetMealName || 'Meal'}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Search Nutrition Database
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. Paneer, Chicken, Oats, Rice, Banana..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching foods found in catalog.
            </div>
          ) : (
            results.map((food) => (
              <div
                key={food.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {food.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {food.servingSize}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex gap-2">
                    <span>{food.calories} kcal</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{food.protein}g Protein</span>
                    <span>•</span>
                    <span>{food.carbs}g Carbs</span>
                    <span>•</span>
                    <span>{food.fat}g Fat</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddFood(food);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export function NutritionSummary({ nutrition, busy, onGenerate, onEdit, startDate, setStartDate }) {
  return <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
    <div><span className="text-xs text-amber-500 font-bold uppercase">Step 2 • Nutrition estimates</span><h2 className="text-xl font-black mt-1">Review your daily targets</h2></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[['BMR', nutrition.bmr, 'kcal'], ['TDEE', nutrition.tdee, 'kcal'], ['Target', nutrition.calories, 'kcal'], ['Protein', nutrition.protein, 'g'], ['Carbohydrates', nutrition.carbs, 'g'], ['Fat', nutrition.fat, 'g']].map(([label, value, unit]) =>
        <div key={label} className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-lg font-black text-amber-600 dark:text-amber-400">{value} <span className="text-xs">{unit}</span></p></div>)}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{nutrition.notice}</p>
    <label className="block text-xs font-bold">Plan start date <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ml-2 rounded-xl p-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" /></label>
    <div className="flex flex-wrap gap-3">
      {[1, 7].map((days) => <button key={days} disabled={busy || !startDate} onClick={() => onGenerate(days)} className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs disabled:opacity-50">{busy ? 'Generating…' : `Generate ${days}-day plan`}</button>)}
      <button disabled={busy} onClick={onEdit} className="px-4 py-2 text-xs font-bold text-slate-500">Edit profile</button>
    </div>
  </section>;
}

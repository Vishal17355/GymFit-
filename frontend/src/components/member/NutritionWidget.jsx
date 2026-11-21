import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dietApi } from '../../services/dietApi';
import { diaryApi } from '../../services/nutritionDiaryApi';

export function NutritionWidget() {
  const [state, setState] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    dietApi.context(controller.signal).then(context => diaryApi.day(context.reportingDate, controller.signal)).then(setState)
      .catch(() => { if (!controller.signal.aborted) setState(false); });
    return () => controller.abort();
  }, []);
  return <section className="mt-5 rounded-3xl bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center gap-4 justify-between">
    <div><h2 className="font-black">Today’s nutrition</h2>
      {state ? <dl className="mt-3 flex flex-wrap gap-4 sm:gap-8">{[
        ['Energy', `${Math.round(state.totals.calories).toLocaleString()} kcal`], ['Water', `${state.waterMl.toLocaleString()} mL`], ['Logging streak', `${state.foodStreak} days`]
      ].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-300">{label}</dt><dd className="mt-1 text-lg font-black tabular-nums">{value}</dd></div>)}</dl>
        : <p className="mt-1 text-xs text-slate-300">{state === false ? 'Open the diary to view your nutrition.' : 'Loading your totals…'}</p>}</div>
    <Link className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950" to="/member/nutrition-diary">Open Nutrition Diary</Link>
  </section>;
}

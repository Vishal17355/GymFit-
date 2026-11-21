import React, { useEffect, useState } from 'react';
import { dietApi } from '../../services/dietApi';
import { buildProgressReportCsv, weightChartPoints } from '../../utils/dietProgressReport';

const signed = (number) => number > 0 ? `+${number}` : String(number);

export function DietPlanProgressReport({ planId, planVersion, weightHistory }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    dietApi.report(planId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setReport(result);
    }).catch((failure) => {
      if (!controller.signal.aborted) setError(failure.status === 404
        ? 'Progress report unavailable. Reload saved plans, or restart the Spring Boot backend after applying this update.'
        : failure.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [planId, planVersion, weightHistory, reload]);

  const current = report?.planId === planId ? report : null;
  const m = current?.metrics;
  const points = m ? weightChartPoints(m.weightHistory) : null;
  const download = () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF', buildProgressReportCsv(current)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = `gymfit-diet-plan-${planId}-progress-${m.asOfDate}.csv`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section aria-labelledby="diet-progress-report-title" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">Saved with this diet plan</p><h2 id="diet-progress-report-title" className="font-black text-lg">Your progress report</h2></div>
      <div className="flex gap-3 text-xs font-bold"><button type="button" disabled={loading} onClick={() => setReload((value) => value + 1)} className="text-slate-500">{loading ? 'Updating…' : 'Refresh report'}</button><button type="button" disabled={!m || loading || Boolean(error)} onClick={download} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-3 py-2 text-slate-950 disabled:opacity-50">Download report</button></div>
    </div>
    {loading && !m && <p role="status" className="text-xs text-slate-500">Loading your saved progress report…</p>}
    {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    {m && <>
      <p className="text-xs text-slate-500">Plan #{planId} • {m.startDate} to {m.endDate} • As of {m.asOfDate} • {m.periodStatus.replaceAll('_', ' ').toLowerCase()} • {m.elapsedDays}/{m.plannedDays} days elapsed</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3"><p className="text-xs text-slate-500">Meal logging</p><strong className="block mt-1 text-xl">{m.mealLoggingPercent === null ? 'Not started' : `${m.mealLoggingPercent}%`}</strong><p className="text-[11px] text-slate-500 mt-1">{m.mealsLogged} of {m.mealsDue} meals through today marked eaten</p></div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3"><p className="text-xs text-slate-500">Calories logged</p><strong className="block mt-1 text-xl">{m.loggedCalories} <span className="text-xs">kcal</span></strong><p className="text-[11px] text-slate-500 mt-1">{m.calorieTargetCoveragePercent === null ? 'Plan has not started' : `${m.calorieTargetCoveragePercent}% of targets across elapsed days`}</p></div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3"><p className="text-xs text-slate-500">Protein logged</p><strong className="block mt-1 text-xl">{m.loggedProtein} <span className="text-xs">g</span></strong><p className="text-[11px] text-slate-500 mt-1">Daily target: {m.dailyProteinTarget}g • {m.averageLoggedProtein === null ? 'No elapsed days' : `${m.averageLoggedProtein}g logged per elapsed day`}</p></div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3"><p className="text-xs text-slate-500">Recorded weight change</p><strong className="block mt-1 text-xl">{m.weightChangeKg === null ? 'No entry yet' : `${signed(m.weightChangeKg)} kg`}</strong><p className="text-[11px] text-slate-500 mt-1">Starting: {m.baselineWeightKg} kg ({m.baselineSource === 'RECORDED_WEIGHT' ? 'weight log' : 'profile snapshot'}, {m.baselineRecordedAt}){m.latestWeightKg !== null ? ` • Latest: ${m.latestWeightKg} kg on ${m.latestWeightDate}` : ' • Log weight during this plan to compare'}</p></div>
      </div>
      {points ? <figure className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3">
        <figcaption className="text-xs font-bold text-slate-600 dark:text-slate-300">Recorded weight during this plan</figcaption>
        <svg viewBox="0 0 400 110" className="w-full max-h-36" role="img" aria-label={`Weight history from ${m.weightHistory[0].weight} to ${m.weightHistory[m.weightHistory.length - 1].weight} kilograms`}>
          <path d="M 25 95 H 375" fill="none" className="stroke-slate-200 dark:stroke-slate-700" />
          <polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-500" />
          {points.map((point) => <circle key={point.label} cx={point.x} cy={point.y} r="3.5" fill="currentColor" className="text-amber-500"><title>{point.label}</title></circle>)}
        </svg>
        <div className="flex justify-between text-[10px] text-slate-500"><span>{m.weightHistory[0].recordedAt}: {m.weightHistory[0].weight} kg</span><span>{m.weightHistory[m.weightHistory.length - 1].recordedAt}: {m.weightHistory[m.weightHistory.length - 1].weight} kg</span></div>
      </figure> : <p className="text-xs text-slate-500">Record weights on two different days during this plan to see a trend.</p>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs whitespace-nowrap"><caption className="sr-only">Daily diet progress</caption><thead className="bg-slate-50 dark:bg-slate-950 text-slate-500"><tr>{['Date', 'Planned kcal', 'Logged kcal', 'Logged protein', 'Meals logged', 'Weight'].map((label) => <th key={label} scope="col" className="p-3">{label}</th>)}</tr></thead>
          <tbody>{m.days.map((day) => <tr key={day.date} className="border-t border-slate-100 dark:border-slate-800"><th scope="row" className="p-3 font-semibold">{day.date}{day.future ? ' • Scheduled' : ''}</th><td className="p-3">{day.plannedCalories}</td><td className="p-3">{day.future ? '—' : day.loggedCalories}</td><td className="p-3">{day.future ? '—' : `${day.loggedProtein}g`}</td><td className="p-3">{day.future ? '—' : `${day.loggedMeals}/${day.plannedMeals}`}</td><td className="p-3">{m.weightHistory.find((entry) => entry.recordedAt === day.date)?.weight ?? '—'}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500">{m.notice}</p>
      <p className="text-[10px] text-slate-400">Last saved: {new Date(current.updatedAt).toLocaleString()}</p>
    </>}
  </section>;
}

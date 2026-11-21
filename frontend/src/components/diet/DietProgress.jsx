import React, { useState } from 'react';
import { localDateString } from '../../utils/dietProfileAdapter';
import { dietApi } from '../../services/dietApi';

export function DietProgress({ history, onHistoryChange }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(localDateString());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await dietApi.logWeight(Number(weight), date); onHistoryChange(await dietApi.progress()); setWeight(''); }
    catch (failure) { setError(failure.message); } finally { setBusy(false); }
  };
  return <section className="mt-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
    <h2 className="text-sm font-black">Step 6 • Weight progress</h2>
    <form onSubmit={submit} className="flex flex-wrap gap-3 items-end text-xs">
      <label>Weight (kg)<input aria-label="Progress weight" required type="number" min="35" max="220" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="block mt-1 rounded-xl border border-slate-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 w-28" /></label>
      <label>Date<input aria-label="Progress date" required type="date" max={localDateString()} value={date} onChange={(e) => setDate(e.target.value)} className="block mt-1 rounded-xl border border-slate-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800" /></label>
      <button disabled={busy} className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black">{busy ? 'Saving…' : 'Save weight'}</button>
    </form>
    {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
    {history.length ? <ul className="flex flex-wrap gap-2 text-xs">{history.map((entry) => <li key={entry.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">{entry.recordedAt}: <strong>{entry.weight} kg</strong></li>)}</ul> : <p className="text-xs text-slate-500">No weight entries saved yet. Weight logs do not change your profile or plan automatically.</p>}
  </section>;
}

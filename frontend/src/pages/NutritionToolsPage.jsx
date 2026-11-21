import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Action, Empty, field, panel } from './HomeWorkout/ui';
import { nutritionTools as api } from '../services/nutritionToolsApi';
import { dietApi } from '../services/dietApi';
import { localDateString } from '../utils/dietProfileAdapter';
import { NutritionCircles } from '../components/diet/NutritionCircles';

const reminders = { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner', SNACK: 'Snack', WEIGH_IN: 'Weigh-in' };

export function useNutritionTool(load) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    load(controller.signal).then(result => { if (!controller.signal.aborted) setData(result); })
      .catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [load, retry]);
  async function run(work) {
    setBusy(true); setError('');
    try { const result = await work(); setData(result); return true; }
    catch (failure) { setError(failure.message); return false; }
    finally { setBusy(false); }
  }
  return { data, error, busy, run, reload: () => setRetry(value => value + 1) };
}

function Download({ content, filename, type, children }) {
  function save() {
    const url = URL.createObjectURL(new Blob([content()], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <Action secondary onClick={save}>{children}</Action>;
}

function Status({ state }) {
  if (state.error) return <div role="alert" className="flex flex-wrap items-center gap-2 text-sm text-red-600">{state.error}<Action secondary onClick={state.reload}>Reload</Action></div>;
  if (state.data == null) return <p role="status" className="text-sm text-slate-500">Loading saved data…</p>;
  return null;
}

function ReminderSettings() {
  const state = useNutritionTool(api.reminders);
  const [kind, setKind] = useState('BREAKFAST');
  const [time, setTime] = useState('08:00');
  function calendar(schedule) {
    const now = new Date();
    const start = new Date(now);
    const [hour, minute] = schedule.time.split(':').map(Number);
    start.setHours(hour, minute, 0, 0);
    if (start <= now) start.setDate(start.getDate() + 1);
    const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GymFit//Nutrition reminders//EN', 'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}@gymfit.local`, `DTSTAMP:${stamp}`,
      `DTSTART:${localDateString(start).replaceAll('-', '')}T${schedule.time.replace(':', '')}00`,
      'DURATION:PT5M', 'RRULE:FREQ=DAILY', `SUMMARY:GymFit ${reminders[schedule.kind]} reminder`,
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:GymFit reminder', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  }
  return <section className={`${panel} space-y-4`}><h2 className="text-xl font-black">Meal and weigh-in reminders</h2>
    <p className="text-sm text-slate-500">Add a repeating reminder to your calendar to receive alerts when GymFit is closed. Times use your calendar’s local time zone.</p>
    <Status state={state} />
    <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end" onSubmit={event => { event.preventDefault(); state.run(() => api.saveReminder({ kind, time })); }}>
      <label className="text-xs">Reminder type<select className={field} value={kind} onChange={event => setKind(event.target.value)}>{Object.entries(reminders).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="text-xs">Local time<input type="time" required value={time} className={field} onChange={event => setTime(event.target.value)} /></label>
      <Action type="submit" disabled={state.busy}>Save reminder</Action>
    </form>
    {state.data?.length === 0 && <Empty>No reminders saved.</Empty>}
    {state.data?.map(reminder => <div key={reminder.kind} className="flex flex-wrap items-center justify-between py-3 gap-2 border-t border-slate-200 dark:border-slate-800">
      <strong>{reminders[reminder.kind]} · {reminder.time}</strong><div className="flex flex-wrap gap-2">
        <Download type="text/calendar;charset=utf-8" filename={`gymfit-${reminder.kind.toLowerCase()}.ics`} content={() => calendar(reminder)}>Add to calendar</Download>
        <Action secondary disabled={state.busy} onClick={() => state.run(() => api.removeReminder(reminder.kind))}>Remove</Action>
      </div></div>)}
  </section>;
}

function PrivatePhoto({ photo }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    api.image(photo.id, controller.signal).then(blob => {
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [photo.id]);
  return <figure className="min-w-0">{url ? <img src={url} alt={photo.caption || `Progress photo from ${photo.date}`} className="w-full max-h-80 object-contain rounded-xl bg-slate-100 dark:bg-slate-900" />
    : <p role={error ? 'alert' : 'status'} className="text-xs">{error || 'Loading photo…'}</p>}
    <figcaption className="text-xs mt-2 break-words">{photo.date}{photo.caption && ` · ${photo.caption}`}</figcaption></figure>;
}

function ProgressPhotos({ today, demo }) {
  const state = useNutritionTool(api.photos);
  const [selected, setSelected] = useState([]);
  return <section className={`${panel} space-y-4`}><h2 className="text-xl font-black">Progress photos</h2>
    <p className="text-sm text-slate-500">Upload existing JPEG or PNG files. Select two dates to compare them side by side.</p>
    {demo && <p className="text-xs text-amber-700 dark:text-amber-300">Local demo uses a shared account. Use test images only.</p>}
    <Status state={state} />
    <form className="grid sm:grid-cols-2 gap-3" onSubmit={event => {
      event.preventDefault();
      const form = event.currentTarget;
      const payload = new FormData(form);
      state.run(async () => { await api.upload(payload); form.reset(); return api.photos(); });
    }}>
      <label className="text-xs">Photo file<input type="file" name="file" accept="image/jpeg,image/png" required className={field} /></label>
      <label className="text-xs">Photo date<input type="date" name="date" required max={today} defaultValue={today} className={field} /></label>
      <label className="text-xs sm:col-span-2">Caption (optional)<input name="caption" maxLength={180} className={field} /></label>
      <div><Action type="submit" disabled={state.busy}>Upload photo</Action></div>
    </form>
    {state.data?.length === 0 && <Empty>No progress photos saved.</Empty>}
    <div className="space-y-2">{state.data?.map(photo => <div key={photo.id} className="flex flex-wrap justify-between items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-2">
      <button type="button" className="text-sm font-semibold break-words" aria-pressed={selected.includes(photo.id)} onClick={() => setSelected(previous => previous.includes(photo.id) ? previous.filter(id => id !== photo.id) : [...previous.slice(-1), photo.id])}>
        {selected.includes(photo.id) ? '✓ ' : ''}{photo.date}{photo.caption ? ` · ${photo.caption}` : ''}
      </button><Action secondary disabled={state.busy} onClick={() => state.run(async () => {
        await api.removePhoto(photo.id); setSelected(previous => previous.filter(id => id !== photo.id)); return api.photos();
      })}>Remove photo</Action>
    </div>)}</div>
    <div className="grid grid-cols-2 gap-3">{selected.map(id => state.data?.find(photo => photo.id === id)).filter(Boolean).map(photo => <PrivatePhoto key={photo.id} photo={photo} />)}</div>
  </section>;
}

function ActivityImport() {
  const state = useNutritionTool(api.activity);
  const [preview, setPreview] = useState(null);
  const [problem, setProblem] = useState('');
  async function read(file) {
    setPreview(null); setProblem('');
    if (!file) return;
    try {
      if (file.size > 32000) throw new Error('Choose a CSV under 32 KB.');
      const [header, ...lines] = (await file.text()).trim().split(/\r?\n/);
      if (header.trim() !== 'date,steps,active_minutes' || !lines.length || lines.length > 90) throw new Error('Use the template with 1–90 dated rows.');
      const rows = lines.map((line, index) => {
        const values = line.trim().match(/^(\d{4}-\d{2}-\d{2}),(\d{1,6}),(\d{1,4})$/);
        if (!values || Number(values[2]) > 150000 || Number(values[3]) > 1440) throw new Error(`Check row ${index + 2}.`);
        return { date: values[1], steps: Number(values[2]), activeMinutes: Number(values[3]) };
      });
      if (new Set(rows.map(row => row.date)).size !== rows.length) throw new Error('Use one row per date.');
      setPreview(rows);
    } catch (failure) { setProblem(failure.message); }
  }
  return <section className={`${panel} space-y-4`}><h2 className="text-xl font-black">Activity import</h2>
    <p className="text-sm text-slate-500">Import daily step counts and active minutes from a CSV. Existing values on matching dates are replaced.</p>
    <Download filename="gymfit-activity-template.csv" type="text/csv;charset=utf-8" content={() => 'date,steps,active_minutes\r\n'}>Download CSV template</Download>
    <label className="block text-xs">Select activity CSV<input type="file" accept=".csv,text/csv" className={field} disabled={state.busy} onChange={event => read(event.target.files[0])} /></label>
    {problem && <p role="alert" className="text-sm text-red-600">{problem}</p>}
    {preview && <div className="flex flex-wrap gap-2 items-center"><p className="text-sm">{preview.length} days ready. {preview[0].date}: {preview[0].steps.toLocaleString()} steps.</p>
      <Action disabled={state.busy} onClick={async () => { if (await state.run(() => api.importActivity(preview))) setPreview(null); }}>Import activity</Action></div>}
    <Status state={state} />
    {state.data?.length === 0 && <Empty>No activity imported yet.</Empty>}
    {state.data?.length > 0 && <ul className="max-h-80 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">{state.data.map(row => <li key={row.date} className="py-2 text-sm">{row.date} · {row.steps.toLocaleString()} steps · {row.activeMinutes} active min</li>)}</ul>}
  </section>;
}

export default function NutritionToolsPage() {
  const [view, setView] = useState('Reminders');
  const [context, setContext] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    dietApi.context(controller.signal).then(setContext).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"><Navbar />
    <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">
      <header><Link to="/member/nutrition-diary" className="text-sm text-cyan-700 dark:text-cyan-300">← Nutrition Diary</Link><h1 className="text-3xl font-black mt-2">Nutrition tools</h1></header>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {context && <><nav aria-label="Nutrition tools views" className="flex flex-wrap gap-2">{['Reminders', 'Photos', 'Activity', 'Groups & household'].map(name => <Action key={name} secondary={view !== name} aria-pressed={view === name} onClick={() => setView(name)}>{name}</Action>)}</nav>
        {view === 'Reminders' && <ReminderSettings />}
        {view === 'Photos' && <ProgressPhotos today={context.reportingDate || localDateString()} demo={context.demoMode} />}
        {view === 'Activity' && <ActivityImport />}
        {view === 'Groups & household' && <NutritionCircles demo={context.demoMode} />}
      </>}
    </main><Footer /></div>;
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bookmark, CalendarDays, ChevronLeft, ChevronRight, Droplets, Flame, Plus, Star, X } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Action, Empty, field, panel } from './HomeWorkout/ui';
import { dietApi } from '../services/dietApi';
import { diaryApi } from '../services/nutritionDiaryApi';
import { localDateString } from '../utils/dietProfileAdapter';
import { DescribeFood, MealTemplates, NutritionInsights } from '../components/diet/NutritionDiaryExtras';

const meals = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const earliestDate = '1900-01-01';
const title = (value) => value[0] + value.slice(1).toLowerCase();
const format = (value) => value == null ? '—' : Number(value.toFixed(1)).toLocaleString();
const initialNutrition = { calories: '', protein: '', carbs: '', fat: '', fiber: '' };
const sections = [
  { name: 'Daily log', icon: CalendarDays },
  { name: 'History', icon: Activity },
  { name: 'Saved foods', icon: Bookmark }
];
const compactDate = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' });

function changeDay(date, offset) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

function DateStrip({ selected, today, week, onDateChange, disabled }) {
  const end = selected < changeDay(today, -6) ? selected : today;
  const days = Array.from({ length: 7 }, (_, index) => changeDay(end, index - 6));
  return <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
    {days.map(date => {
      const day = new Date(`${date}T12:00:00Z`);
      const logged = week?.some(entry => entry.date === date && entry.calories != null);
      const active = date === selected;
      return <button key={date} type="button" aria-current={active ? 'date' : undefined}
        aria-label={`${date}${logged ? ', food logged' : ''}`} disabled={disabled || date < earliestDate}
        onClick={() => onDateChange(date)} className={`rounded-xl px-1 py-2.5 text-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 ${active
          ? 'border-cyan-500 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
        <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400">{compactDate.format(day)}</span>
        <span className="block text-sm font-black mt-1">{day.getUTCDate()}</span>
        <span aria-hidden="true" className={`block mx-auto mt-1 h-1 w-1 rounded-full ${logged ? 'bg-cyan-500' : 'bg-transparent'}`} />
      </button>;
    })}
  </div>;
}

const nutrientTiles = [
  ['protein', 'Protein', 'bg-cyan-400'], ['carbs', 'Carbs', 'bg-amber-400'],
  ['fat', 'Fat', 'bg-violet-400'], ['fiber', 'Fiber', 'bg-emerald-400']
];

function NutritionOverview({ day }) {
  const calories = day.totals.calories;
  const goal = day.targets?.calories;
  const percentage = goal > 0 ? Math.min(100, Math.max(0, calories * 100 / goal)) : 0;
  return <section className="rounded-3xl bg-slate-900 p-5 sm:p-6 text-white shadow-sm ring-1 ring-slate-800">
    <div className="flex justify-between gap-3 items-center"><h2 className="font-bold">Logged nutrition</h2>
      <p className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200"><Flame size={13} aria-hidden="true" /> {day.foodStreak} day streak</p></div>
    <div className="grid grid-cols-[minmax(0,1fr)_88px] sm:grid-cols-[minmax(0,1fr)_112px] gap-4 items-center my-5">
      <div><p className="text-sm text-slate-300">Energy logged</p><p className="mt-1 text-4xl sm:text-5xl tracking-tight font-black tabular-nums">{format(calories)} <span className="text-sm font-semibold text-slate-300">kcal</span></p>
        <p className="text-xs mt-2 text-slate-400">{goal ? `${format(goal)} kcal daily goal` : 'Set a goal in the Diet Planner'}</p></div>
      <div className="rounded-full aspect-square grid place-items-center p-2" style={{ background: `conic-gradient(#80d68f ${percentage}%, #37483d ${percentage}%)` }} aria-hidden="true">
        <span className="w-full h-full grid place-items-center rounded-full bg-slate-900 text-sm font-black text-cyan-200">{goal ? `${Math.round(calories * 100 / goal)}%` : '—'}</span></div>
    </div>
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">{nutrientTiles.map(([key, label, color]) => {
      const total = day.totals[key];
      const target = key === 'fiber' ? day.settings.fiberGoalG : day.targets?.[key];
      return <div key={key} className="min-w-0 rounded-xl bg-white/[0.07] p-3">
        <dt className="flex items-center gap-1.5 text-xs text-slate-300"><span className={`w-1.5 h-1.5 rounded-full ${color}`} />{label}</dt>
        <dd className="font-bold text-lg mt-1 tabular-nums">{format(total)}{total != null && <span className="text-xs"> g</span>}</dd>
        {target != null && <p className="text-[10px] text-slate-400">Goal {format(target)} g</p>}
      </div>;
    })}</dl>
    <p className="mt-3 text-[11px] text-slate-400">Totals reflect diary entries.{day.totals.fiber == null ? ' Some entries have no fiber data.' : ''}</p>
  </section>;
}

function FoodEntryDialog({ date, slot, setSlot, busy, error, close, save }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  const dismiss = () => { ref.current?.close(); close(); };
  return <dialog ref={ref} aria-labelledby="add-food-title" onCancel={event => { event.preventDefault(); if (!busy) dismiss(); }}
    className="fixed m-0 sm:m-auto inset-x-0 top-auto bottom-0 sm:inset-0 w-full max-w-none sm:w-[calc(100%-2rem)] sm:max-w-lg max-h-[85dvh] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white backdrop:bg-slate-950/60 shadow-xl">
    <div className="sticky top-0 flex items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10">
      <div><h2 id="add-food-title" className="text-xl font-black">Log food</h2><p className="text-xs text-slate-500">{date}</p></div>
      <Action secondary aria-label="Close food logger" disabled={busy} onClick={dismiss}><X size={18} /></Action>
    </div>
    <div className="p-4 sm:p-5 space-y-4">
      {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
      <label className="block text-sm">Meal<select className={field} value={slot} disabled={busy} onChange={event => setSlot(event.target.value)}>{meals.map(meal => <option key={meal} value={meal}>{title(meal)}</option>)}</select></label>
      <FoodEntryForm date={date} mealSlot={slot} busy={busy} save={async work => { if (await save(work)) dismiss(); }} />
    </div>
  </dialog>;
}

function FoodEntryForm({ date, mealSlot, save, busy }) {
  const [mode, setMode] = useState('Search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState('100');
  const [name, setName] = useState('');
  const [values, setValues] = useState(initialNutrition);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'Recipes') return;
    let current = true;
    setLoading(true);
    diaryApi.recipes().then(items => { if (current) setResults(items); })
      .catch(error => { if (current) setStatus(error.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [mode]);

  async function search(event) {
    event.preventDefault();
    setLoading(true);
    setSelected(null);
    try {
      const result = await dietApi.foods(query.trim());
      setResults(result.foods.filter(food => food.servingUnit === 'g' &&
        [food.calories, food.protein, food.carbohydrates, food.fat].every(Number.isFinite)));
      setStatus(result.notice);
    } catch (error) {
      setResults([]);
      setStatus(error.message);
    } finally { setLoading(false); }
  }

  function submit(event) {
    event.preventDefault();
    if (mode === 'Recipes') {
      save(() => diaryApi.addRecipe({ date, mealSlot, recipeId: selected.id, servings: Number(quantity) }));
    } else if (mode === 'Search') {
      save(() => diaryApi.add({ date, mealSlot, foodId: selected.id, grams: Number(quantity) }));
    } else {
      const nutrients = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === '' ? null : Number(value)]));
      save(() => diaryApi.add({ date, mealSlot, name, grams: Number(quantity), nutrients }));
    }
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2" aria-label="Entry methods">
      {['Search', 'Recipes', 'Manual', 'Describe'].map(method => <Action key={method} secondary={mode !== method} disabled={loading || busy}
        aria-pressed={mode === method} onClick={() => {
          setMode(method); setSelected(null); setResults([]); setStatus(''); setQuantity(method === 'Recipes' ? '1' : '100');
        }}>{method}</Action>)}
    </div>
    {mode === 'Describe' && <DescribeFood date={date} mealSlot={mealSlot} busy={busy} save={save} />}
    {mode === 'Search' && <form onSubmit={search} className="flex gap-2 items-end">
      <label className="flex-1 text-sm">Find a food<input className={field} type="search" placeholder="Try curd or cooked rice"
        required maxLength={120} value={query} onChange={event => setQuery(event.target.value)} /></label>
      <Action type="submit" disabled={loading || !query.trim()}>Find</Action>
    </form>}
    {loading && <p role="status" className="text-sm text-slate-500">Loading foods…</p>}
    {status && <p role="status" className="text-xs text-slate-500">{status}</p>}
    {mode !== 'Manual' && results.length > 0 && <ul className="max-h-60 overflow-y-auto space-y-1">
      {results.map(item => <li key={item.id}><button type="button" aria-pressed={selected?.id === item.id}
        onClick={() => setSelected(item)} className={`w-full text-left rounded-xl border p-3 text-sm ${selected?.id === item.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
        {item.name}<span className="block text-xs text-slate-500">{mode === 'Recipes' ? `${format(item.caloriesPerServing)} kcal per serving` : `${format(item.calories)} kcal per ${item.servingQuantity} g · ${item.source}`}</span>
      </button></li>)}
    </ul>}
    {(selected || mode === 'Manual') && <form onSubmit={submit} className="space-y-3">
      {mode === 'Manual' && <label className="block text-sm">Food name<input className={field} required maxLength={180}
        value={name} onChange={event => setName(event.target.value)} /></label>}
      <label className="block text-sm">{mode === 'Recipes' ? 'Servings eaten' : 'Portion eaten (g)'}<input className={field}
        type="number" min="0.1" step="0.1" max={mode === 'Recipes' ? 10 : 2000} required value={quantity}
        onChange={event => setQuantity(event.target.value)} /></label>
      {mode === 'Manual' && <fieldset className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <legend className="text-sm mb-2">Nutrition for the portion eaten</legend>
        {Object.keys(initialNutrition).map(key => <label key={key} className="text-xs">{title(key)} {key === 'calories' ? '(kcal)' : '(g)'}
          <input className={field} type="number" min="0" max={key === 'calories' ? 18000 : 2000} step="0.1"
            required={key !== 'fiber'} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} />
        </label>)}
      </fieldset>}
      <Action type="submit" disabled={busy}>Save to {title(mealSlot).toLowerCase()}</Action>
    </form>}
  </div>;
}

function DiaryEntry({ entry, busy, commit }) {
  const [editing, setEditing] = useState(false);
  const [grams, setGrams] = useState(entry.grams.toFixed(1));
  const [mealSlot, setMealSlot] = useState(entry.mealSlot);
  const update = (changes) => diaryApi.edit(entry.id, {
    grams: entry.grams, mealSlot: entry.mealSlot, favorite: entry.favorite, ...changes
  });

  return <li className="border-t border-slate-100 dark:border-slate-800 py-3 space-y-2">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0"><p className="font-semibold break-words">{entry.name}</p>
        <p className="text-xs text-slate-500">{format(entry.grams)} g · {format(entry.nutrients.calories)} kcal · {entry.source.replaceAll('_', ' ')}</p></div>
      <div className="flex gap-3 items-center text-xs font-semibold">
        <button type="button" disabled={busy} aria-pressed={entry.favorite} aria-label={`Favorite ${entry.name}`}
          onClick={() => commit(() => update({ favorite: !entry.favorite }))}><Star size={17} className={entry.favorite ? 'fill-amber-400 text-amber-500' : 'text-slate-500'} /></button>
        <button type="button" onClick={() => { setGrams(entry.grams.toFixed(1)); setMealSlot(entry.mealSlot); setEditing(!editing); }}>Edit</button>
      </div>
    </div>
    {editing && <form className="grid sm:grid-cols-2 gap-2" onSubmit={async event => {
      event.preventDefault();
      if (await commit(() => update({ grams: Number(grams), mealSlot }))) setEditing(false);
    }}>
      <label className="text-xs">Grams<input className={field} type="number" min="0.1" step="0.1" max="20000" required value={grams} onChange={event => setGrams(event.target.value)} /></label>
      <label className="text-xs">Meal<select className={field} value={mealSlot} onChange={event => setMealSlot(event.target.value)}>{meals.map(slot => <option key={slot} value={slot}>{title(slot)}</option>)}</select></label>
      <div className="flex gap-2"><Action type="submit" disabled={busy}>Save changes</Action>
        <Action secondary disabled={busy} onClick={() => commit(() => diaryApi.remove(entry.id))}>Remove entry</Action></div>
    </form>}
  </li>;
}

function WaterCard({ day, busy, commit }) {
  const [amount, setAmount] = useState(day.waterMl);
  const [goal, setGoal] = useState(day.settings.waterGoalMl);
  const [fiber, setFiber] = useState(day.settings.fiberGoalG ?? '');
  return <section className={`${panel} space-y-4`}>
    <h2 className="font-black flex gap-2 items-center"><Droplets size={19} className="text-cyan-600" /> Water</h2>
    <p className="text-2xl font-black">{day.waterMl.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ {day.settings.waterGoalMl.toLocaleString()} mL</span></p>
    <progress className="w-full accent-cyan-500" aria-label="Water goal progress" max={day.settings.waterGoalMl} value={Math.min(day.waterMl, day.settings.waterGoalMl)} />
    <div className="flex flex-wrap gap-2">{[250, 500].map(ml => <Action key={ml} secondary disabled={busy || day.waterMl + ml > 20000}
      onClick={() => commit(() => diaryApi.water({ date: day.date, milliliters: day.waterMl + ml }))}>+{ml} mL</Action>)}</div>
    <form className="flex items-end gap-2" onSubmit={event => { event.preventDefault(); commit(() => diaryApi.water({ date: day.date, milliliters: Number(amount) })); }}>
      <label className="text-xs flex-1">Correct daily total (mL)<input className={field} type="number" min="0" max="20000" required value={amount} onChange={event => setAmount(event.target.value)} /></label>
      <Action type="submit" secondary disabled={busy}>Update</Action>
    </form>
    <details><summary className="cursor-pointer text-sm font-semibold">Water and fiber goals</summary>
      <form className="mt-3 space-y-2" onSubmit={event => { event.preventDefault(); commit(async () => {
        await diaryApi.settings({ waterGoalMl: Number(goal), fiberGoalG: fiber === '' ? null : Number(fiber) }); return diaryApi.day(day.date);
      }); }}>
        <label className="block text-xs">Water goal (mL)<input className={field} type="number" min="250" max="12000" required value={goal} onChange={event => setGoal(event.target.value)} /></label>
        <label className="block text-xs">Optional fiber goal (g)<input className={field} type="number" min="1" max="150" value={fiber} onChange={event => setFiber(event.target.value)} /></label>
        <Action type="submit" disabled={busy}>Save goals</Action>
      </form>
    </details>
  </section>;
}

function WeeklySummary({ week }) {
  const maximum = Math.max(1, ...week.map(day => day.calories ?? 0));
  function download() {
    const rows = [['Date', 'Logged kcal', 'Protein g', 'Carbs g', 'Fat g', 'Fiber g', 'Water mL'],
      ...week.map(day => [day.date, day.calories, day.protein, day.carbs, day.fat, day.fiber, day.waterMl])];
    const url = URL.createObjectURL(new Blob([rows.map(row => row.join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `gymfit-nutrition-${week.at(-1).date}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className={`${panel} space-y-3`}>
    <div className="flex flex-wrap justify-between items-center gap-2"><h2 className="text-lg font-black">Seven-day summary</h2><Action secondary onClick={download}>Download CSV</Action></div>
    <ul className="space-y-3">{week.map(day => <li key={day.date} className="grid grid-cols-[65px_minmax(0,1fr)_80px] gap-2 items-center text-xs">
      <time dateTime={day.date}>{day.date.slice(5)}</time>
      <div aria-hidden="true" className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-cyan-500" style={{ width: `${(day.calories ?? 0) / maximum * 100}%` }} /></div>
      <span className="text-right">{day.calories == null ? 'No log' : `${format(day.calories)} kcal`}</span>
    </li>)}</ul>
    <p className="text-xs text-slate-500">The download includes calories, macros, fiber and water. Missing logs are blank.</p>
  </section>;
}

export default function NutritionDiaryPage() {
  const [today, setToday] = useState(localDateString);
  const [date, setDate] = useState(null);
  const [demo, setDemo] = useState(false);
  const [day, setDay] = useState(null);
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState(false);
  const [slot, setSlot] = useState('LUNCH');
  const [section, setSection] = useState('Daily log');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    dietApi.context(controller.signal).then(context => {
      const value = context.reportingDate || localDateString();
      setToday(value); setDate(previous => previous || value); setDemo(context.demoMode);
    }).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    diaryApi.day(date, controller.signal).then(setDay)
      .catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [date, reload]);

  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    diaryApi.recent(favorites, controller.signal).then(setRecent)
      .catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [date, favorites, reload]);

  async function commit(work) {
    setBusy(true);
    setError('');
    try {
      setDay(await work());
      setReload(value => value + 1);
      return true;
    } catch (failure) {
      setError(failure.message);
      return false;
    } finally { setBusy(false); }
  }

  const current = day?.date === date ? day : null;
  const navigate = value => { if (value && value >= earliestDate && value <= today) { setError(''); setDate(value); setAdding(false); } };
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"><Navbar />
    <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
      <header className="flex flex-wrap justify-between items-end gap-3">
        <div><div className="flex flex-wrap gap-3 text-xs font-semibold text-cyan-700 dark:text-cyan-400"><Link to="/member/diet-plan">← Diet Planner</Link><Link to="/member/nutrition-tools">Nutrition tools →</Link></div>
          <h1 className="text-3xl font-black mt-2">Nutrition Diary</h1></div>
        <Action disabled={busy || !current} onClick={() => { setError(''); setAdding(true); }}><span className="flex gap-2 items-center"><Plus size={17} /> Log food</span></Action>
      </header>
      <nav aria-label="Nutrition views" className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900 p-1.5">
        {sections.map(({ name, icon: Icon }) => <button key={name} type="button" aria-pressed={section === name}
          onClick={() => setSection(name)} className={`flex items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-xs sm:text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 ${section === name
            ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-200 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800'}`}>
          <Icon size={15} aria-hidden="true" />{name}
        </button>)}
      </nav>
      {error && <div role="alert" className="rounded-xl border border-red-300 p-3 text-sm text-red-600 flex flex-wrap gap-2 items-center">
        {error}<Action secondary disabled={busy} onClick={() => { setError(''); setReload(value => value + 1); }}>Retry</Action></div>}
      {date && <section className={`${panel} !p-3 sm:!p-4 space-y-2`} aria-label="Diary date">
        <div className="flex gap-1.5 items-center"><Action secondary aria-label="Previous day" className="!px-2.5" disabled={busy || date <= earliestDate} onClick={() => navigate(changeDay(date, -1))}><ChevronLeft size={16} /></Action>
          <input type="date" aria-label="Log date" min={earliestDate} max={today} disabled={busy} value={date} className={`${field} min-w-0 max-w-44 !py-2`} onChange={event => navigate(event.target.value)} />
          <Action secondary aria-label="Next day" className="!px-2.5" disabled={busy || date >= today} onClick={() => navigate(changeDay(date, 1))}><ChevronRight size={16} /></Action>
          <Action secondary className="ml-auto !px-2.5" disabled={busy || date === today} onClick={() => navigate(today)}>Today</Action></div>
        <DateStrip selected={date} today={today} week={day?.week} disabled={busy} onDateChange={navigate} />
      </section>}
      {!current && !error && <p role="status" className={panel}>Loading your diary…</p>}
      {current && <>
        {adding && <FoodEntryDialog date={date} slot={slot} setSlot={setSlot} busy={busy} error={error} close={() => { setAdding(false); setError(''); }} save={commit} />}
        {section === 'Daily log' && <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
          <div className="space-y-4"><NutritionOverview day={current} />
          <section className={`${panel} space-y-4`} aria-label="Meals">
            {meals.map(meal => <div key={meal}><div className="flex justify-between items-center gap-2 mb-2">
              <h2 className="font-black">{title(meal)}</h2><button type="button" disabled={busy} className="rounded-lg bg-cyan-500/10 px-2.5 py-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300" onClick={() => { setError(''); setSlot(meal); setAdding(true); }}>Log {title(meal).toLowerCase()}</button></div>
              <ul>{current.entries.filter(entry => entry.mealSlot === meal).map(entry => <DiaryEntry key={entry.id} entry={entry} busy={busy} commit={commit} />)}</ul>
              {!current.entries.some(entry => entry.mealSlot === meal) && <Empty>No food logged.</Empty>}
            </div>)}
          </section></div>
          <div className="space-y-4"><WaterCard key={`${date}-${current.waterMl}-${current.settings.waterGoalMl}-${current.settings.fiberGoalG}`} day={current} busy={busy} commit={commit} />
            <NutritionInsights day={current} />
            <section className={`${panel} space-y-3`}><h2 className="font-black">Logging milestones</h2>
              {current.milestones.length ? <ul className="space-y-1 text-sm">{current.milestones.map(item => <li key={item}>✓ {item}</li>)}</ul> : <p className="text-sm text-slate-500">Log your first food to get started.</p>}
            </section>
          </div>
        </div>}
        {section === 'Saved foods' && <><section className={`${panel} space-y-3`}><h2 className="text-lg font-black">Saved foods</h2><div className="flex flex-wrap gap-2"><Action secondary={favorites} aria-pressed={!favorites} onClick={() => setFavorites(false)}>Recent foods</Action><Action secondary={!favorites} aria-pressed={favorites} onClick={() => setFavorites(true)}>Favorites</Action></div>
          <label className="block text-xs">Repeat into<select className={field} value={slot} onChange={event => setSlot(event.target.value)}>{meals.map(meal => <option key={meal} value={meal}>{title(meal)}</option>)}</select></label>
          {recent.length ? <ul className="max-h-72 overflow-auto divide-y divide-slate-200 dark:divide-slate-700">{recent.map(entry => <li key={entry.id} className="p-2 flex flex-wrap gap-2 justify-between items-center"><span className="text-sm">{entry.name} · {format(entry.grams)} g</span><Action secondary disabled={busy} onClick={() => commit(() => diaryApi.repeat(entry.id, { date, mealSlot: slot }))}>Log again</Action></li>)}</ul> : <Empty>{favorites ? 'Star a food to find it here.' : 'Logged foods appear here for quick reuse.'}</Empty>}
        </section><MealTemplates key={date} day={current} destination={slot} busy={busy} commit={commit} /></>}
        {section === 'History' && <WeeklySummary week={current.week} />}
      </>}
      {demo && <p className="text-xs text-slate-500">This local demo uses a shared account.</p>}
    </main><Footer /></div>;
}

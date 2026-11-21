import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nutritionTools } from '../../services/nutritionToolsApi';
import { diaryApi } from '../../services/nutritionDiaryApi';
import { Action, Empty, field, panel } from '../../pages/HomeWorkout/ui';

export function DescribeFood({ date, mealSlot, busy, save }) {
  const [text, setText] = useState('');
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function review(event) {
    event.preventDefault();
    setError(''); setLoading(true); setItems(null);
    try {
      const matches = await nutritionTools.describe(text);
      setItems(matches.map(match => ({ ...match, selected: '', portion: match.grams ?? '' })));
    } catch (failure) { setError(failure.message); }
    finally { setLoading(false); }
  }

  function change(index, update) {
    setItems(current => current.map((item, i) => i === index ? { ...item, ...update } : item));
  }

  const selected = items?.filter(item => item.selected) ?? [];
  return <div className="space-y-4">
    <form onSubmit={review} className="space-y-2">
      <label className="block text-sm">Describe what you ate<textarea className={field} required maxLength={400} value={text}
        onChange={event => setText(event.target.value)} placeholder="100 g banana and 40 g oats" /></label>
      <Action type="submit" disabled={loading || busy || !text.trim()}>{loading ? 'Looking up foods…' : 'Review matches'}</Action>
    </form>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {items && <form className="space-y-3" onSubmit={event => {
      event.preventDefault();
      save(() => diaryApi.batch(selected.map(item => ({ date, mealSlot, foodId: Number(item.selected), grams: Number(item.portion) }))));
    }}>
      <p className="text-xs text-slate-500">Choose the right match and confirm the grams. Use Search or Manual for foods without a match.</p>
      {items.map((item, index) => <fieldset key={index} className="grid sm:grid-cols-[1fr_100px] gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 p-3">
        <legend className="px-1 text-xs font-semibold">{item.input}</legend>
        <label className="text-xs">Food match<select aria-label="Food match" className={field} value={item.selected} onChange={event => change(index, { selected: event.target.value })}>
          <option value="">{item.candidates.length ? 'Choose or skip' : 'No local match'}</option>
          {item.candidates.map(food => <option key={food.id} value={food.id}>{food.name}</option>)}
        </select></label>
        {item.selected && <label className="text-xs">Grams<input className={field} required value={item.portion} min="0.1" max="2000" step="0.1"
          type="number" onChange={event => change(index, { portion: event.target.value })} /></label>}
      </fieldset>)}
      <Action type="submit" disabled={busy || !selected.length}>Log selected foods</Action>
    </form>}
  </div>;
}

export function MealTemplates({ day, destination, busy, commit }) {
  const [templates, setTemplates] = useState(null);
  const [name, setName] = useState('');
  const [mealSlot, setMealSlot] = useState('');
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const slots = [...new Set(day.entries.map(entry => entry.mealSlot))];
  useEffect(() => {
    const controller = new AbortController();
    nutritionTools.templates(controller.signal).then(setTemplates).catch(failure => {
      if (!controller.signal.aborted) setError(failure.message);
    });
    return () => controller.abort();
  }, []);

  async function update(work) {
    setWorking(true); setError('');
    try { await work(); setTemplates(await nutritionTools.templates()); }
    catch (failure) { setError(failure.message); }
    finally { setWorking(false); }
  }

  return <section className={`${panel} space-y-4`}>
    <h2 className="text-lg font-black">Meal templates</h2>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {slots.length > 0 && <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end" onSubmit={event => {
      event.preventDefault();
      update(async () => { await nutritionTools.saveTemplate({ name, date: day.date, mealSlot }); setName(''); });
    }}>
      <label className="text-xs">Template name<input required className={field} maxLength={90} value={name} onChange={event => setName(event.target.value)} /></label>
      <label className="text-xs">Copy logged meal<select required className={field} value={mealSlot} onChange={event => setMealSlot(event.target.value)}>
        <option value="">Choose a meal</option>{slots.map(slot => <option key={slot} value={slot}>{slot.toLowerCase()}</option>)}
      </select></label>
      <Action type="submit" disabled={busy || working}>Save template</Action>
    </form>}
    {templates == null && !error && <p role="status">Loading templates…</p>}
    {templates?.length === 0 && <Empty>Save a logged meal to reuse all of its foods together.</Empty>}
    {templates?.map(template => <div key={template.id} className="border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-wrap gap-3 justify-between items-center">
      <div><p className="font-semibold">{template.name}</p><p className="text-xs text-slate-500">{template.items.length} foods · {Math.round(template.items.reduce((sum, item) => sum + item.nutrients.calories, 0))} kcal</p></div>
      <div className="flex gap-2"><Action disabled={working || busy} onClick={() => commit(() => nutritionTools.logTemplate(template.id, { date: day.date, mealSlot: destination }))}>Log meal</Action>
        <Action secondary disabled={working || busy} onClick={() => update(() => nutritionTools.removeTemplate(template.id))}>Remove</Action></div>
    </div>)}
  </section>;
}

export function NutritionInsights({ day }) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    nutritionTools.insights(day.date, controller.signal).then(data => setResult({ key: day, data })).catch(() => {});
    return () => controller.abort();
  }, [day]);
  const data = result?.key === day ? result.data : null;
  if (!data) return null;
  return <section className={`${panel} space-y-2`}><h2 className="font-black">Goal insights</h2>
    <dl className="grid grid-cols-3 gap-2 text-sm">{[['Protein', data.proteinPercent], ['Fiber', data.fiberPercent], ['Water', data.waterPercent]].map(([label, value]) => <div key={label}>
      <dt className="text-xs text-slate-500">{label}</dt><dd className="font-bold">{value == null ? '—' : `${value}%`}</dd></div>)}</dl>
    <p className="text-xs text-slate-500">Percent of your daily goals.{data.missingFiber > 0 && ` Fiber is unknown for ${data.missingFiber} logged item(s).`}</p>
    <Link to="/member/nutrition-tools" className="inline-block text-sm font-bold text-cyan-700 dark:text-cyan-300">Open nutrition tools →</Link>
  </section>;
}

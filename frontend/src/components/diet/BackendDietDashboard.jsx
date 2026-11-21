import React, { useEffect, useRef, useState } from 'react';
import { Plus, RefreshCw, Check, X, Utensils, Coffee, Moon } from 'lucide-react';
import { dietApi } from '../../services/dietApi';
import { localDateString } from '../../utils/dietProfileAdapter';

function Modal({ title, onClose, children }) {
  const box = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; box.current?.focus();
    const close = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', close); previous?.focus(); };
  }, []);
  return <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
    <section ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between gap-3"><h3 className="font-black">{title}</h3><button type="button" aria-label="Close dialog" onClick={onClose} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><X className="w-4 h-4" /></button></div>
      {children}
    </section>
  </div>;
}

function foodAllowed(food, profile) {
  if (!food.reviewed) return false;
  const allowed = { VEGAN: ['VEGAN'], VEGETARIAN: ['VEGAN', 'VEGETARIAN'], EGGETARIAN: ['VEGAN', 'VEGETARIAN', 'EGGETARIAN'] };
  if (allowed[profile.dietaryPreference] && !allowed[profile.dietaryPreference].includes(food.dietType)) return false;
  return !(profile.allergies || []).some((term) => food.allergens?.some((tag) => tag.toLowerCase() === term.toLowerCase()) || food.name.toLowerCase().includes(term.toLowerCase())) &&
    !(profile.excludedFoods || []).some((term) => food.name.toLowerCase().includes(term.toLowerCase()));
}

export function BackendDietDashboard({ dietPlan, onUpdateDietPlan, onEditProfile, onGenerateNew, foods = [], reportingDate = localDateString() }) {
  const [selectedDate, setSelectedDate] = useState(dietPlan.days[0]?.date);
  const [modal, setModal] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [chosen, setChosen] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchFoods, setSearchFoods] = useState(null);
  const [foodId, setFoodId] = useState('');
  const [quantity, setQuantity] = useState(25);
  const [sourceNotice, setSourceNotice] = useState('');
  const day = dietPlan.days.find((item) => item.date === selectedDate) || dietPlan.days[0];
  const target = dietPlan.targets;
  const perform = async (operation) => {
    setBusy(true); setError('');
    try { await operation(); } catch (failure) { setError(failure.message); } finally { setBusy(false); }
  };
  const openReplacement = (meal) => perform(async () => {
    const options = await dietApi.alternatives(dietPlan.id, meal.id);
    setAlternatives(options); setChosen(0); setModal({ type: 'meal', meal });
  });
  const openFood = (meal, index = -1) => {
    setError(''); setQuery(''); setSearchFoods(null); setSourceNotice('');
    setFoodId(index < 0 ? '' : String(meal.ingredients[index].foodId));
    setQuantity(index < 0 ? 25 : Math.round(meal.ingredients[index].quantity)); setModal({ type: 'food', meal, index });
  };
  const results = (searchFoods || foods).filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
  const eligible = results.filter((food) => foodAllowed(food, dietPlan.profile));
  const close = () => { if (!busy) setModal(null); };
  const mealCard = (meal) => <article key={meal.id} className="flex-1 space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-950/40">
    <div className="flex justify-between gap-2"><div><p className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">{meal.mealType.replace('_', ' ')}</p><h4 className="text-sm font-black">{meal.name}{meal.customized ? ' • adjusted' : ''}</h4></div><span className="text-xs font-bold shrink-0">{meal.calories} kcal</span></div>
    <p className="text-[11px] text-slate-500">{meal.servingMultiplier}× recipe serving • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F{meal.estimatedCost !== null ? ` • ₹${meal.estimatedCost}` : ' • cost unknown'}</p>
    <ul className="space-y-2">{meal.ingredients.map((item, index) => <li key={`${item.foodId}-${index}`} className="flex justify-between items-start gap-2 text-xs">
      <span><span className="font-semibold">{item.name}</span><span className="block text-[11px] text-slate-500">{Number(item.quantity.toFixed(1))} {item.unit} • {Number(item.calories.toFixed(1))} kcal • {Number(item.protein.toFixed(1))}g protein</span>{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-amber-600 dark:text-amber-400 underline">Nutrient source</a>}</span>
      <button disabled={busy} onClick={() => openFood(meal, index)} aria-label={`Swap ${item.name}`} className="rounded-lg bg-slate-200 dark:bg-slate-800 p-1.5 text-[10px] font-bold">Swap</button>
    </li>)}</ul>
    <details className="text-[11px] text-slate-500"><summary className="cursor-pointer font-bold">Preparation & quantities</summary><p className="pt-2 leading-relaxed">{meal.instructions}</p></details>
    <div className="flex flex-wrap gap-2 text-[11px] font-bold">
      <button disabled={busy} onClick={() => openFood(meal)} className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400"><Plus className="w-3 h-3" />Add food</button>
      <button disabled={busy} onClick={() => openReplacement(meal)} className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400"><RefreshCw className="w-3 h-3" />Replace meal</button>
      <button disabled={busy || (day.date > reportingDate && !meal.eaten)} onClick={() => perform(async () => onUpdateDietPlan(await dietApi.intake(dietPlan.id, meal.id, !meal.eaten, dietPlan.version)))} className={`inline-flex items-center gap-1 disabled:opacity-50 ${meal.eaten ? 'text-emerald-600' : 'text-slate-500'}`}><Check className="w-3 h-3" />{meal.eaten ? 'Eaten • undo' : day.date > reportingDate ? 'Scheduled' : 'Mark eaten'}</button>
    </div>
  </article>;
  return <div className="space-y-4">
    {error && !modal && <div role="alert" className="text-xs rounded-xl p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300">{error}<button className="ml-3 underline" onClick={() => perform(async () => onUpdateDietPlan(await dietApi.plan(dietPlan.id)))}>Reload plan</button></div>}
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white space-y-3">
      <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-sm font-black text-amber-400">Your saved diet plan</h2><p className="text-xs mt-1">Target: {target.calories} kcal • {target.protein}g protein • {target.carbs}g carbs • {target.fat}g fat</p></div><div className="flex gap-3 text-xs font-bold"><button disabled={busy} onClick={onEditProfile}>Edit profile</button><button disabled={busy} onClick={onGenerateNew} className="text-amber-400">New plan</button></div></div>
      <div className="flex flex-wrap gap-2">{dietPlan.days.map((item) => <button key={item.date} onClick={() => setSelectedDate(item.date)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${day.date === item.date ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</button>)}</div>
      <p className="text-xs">Daily total: <strong>{day.totals.calories} kcal</strong> • {day.totals.protein}g P • {day.totals.carbs}g C • {day.totals.fat}g F{day.totals.cost !== null ? ` • ₹${day.totals.cost}` : ''}</p>
      <p className="text-xs text-emerald-300">Intake: {day.totals.consumedCalories} / {target.calories} kcal • {day.totals.consumedProtein} / {target.protein}g protein • {day.totals.eatenMeals}/{day.totals.mealCount} meals eaten</p>
      <p className="text-[11px] text-slate-400">{target.notice}</p>
    </section>
    <div className="grid md:grid-cols-3 gap-4 items-start">{[['Breakfast', Coffee, ['BREAKFAST']], ['Lunch & pre-workout', Utensils, ['LUNCH', 'SNACK']], ['Dinner & recovery', Moon, ['DINNER']]].map(([name, Icon, slots]) =>
      <section key={name} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-md"><h3 className="flex items-center gap-2 font-black text-sm uppercase"><Icon className="w-4 h-4 text-amber-500" />{name}</h3>{day.meals.filter((meal) => slots.includes(meal.mealType)).map(mealCard)}</section>)}</div>
    {modal && <Modal title={modal.type === 'meal' ? 'Replace meal' : modal.index < 0 ? 'Add food' : 'Swap food'} onClose={close}>
      {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
      {modal.type === 'meal' ? <>
        <p className="text-xs text-slate-500">Options preserve daily nutrition limits, dietary restrictions and your saved budget.</p>
        {alternatives.length === 0 ? <p className="text-sm">No valid alternative is available. Generate a new plan or add suitable local recipes.</p> : <>
          <div className="space-y-2">{alternatives.map((alt, index) => <button key={`${alt.recipeId}-${alt.servingMultiplier}`} onClick={() => setChosen(index)} className={`block w-full text-left p-3 rounded-xl border text-xs ${chosen === index ? 'border-amber-500 bg-amber-500/10' : 'border-slate-300 dark:border-slate-700'}`}><strong>{alt.name}</strong><span className="block mt-1">{alt.servingMultiplier}× • {alt.calories} kcal • {alt.protein}g P • {alt.carbs}g C • {alt.fat}g F</span></button>)}</div>
          <button disabled={busy} onClick={() => perform(async () => { const alt = alternatives[chosen]; onUpdateDietPlan(await dietApi.replaceMeal({ planId: dietPlan.id, mealId: modal.meal.id, recipeId: alt.recipeId, servingMultiplier: alt.servingMultiplier, version: dietPlan.version })); setModal(null); })} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950">{busy ? 'Saving…' : 'Confirm meal replacement'}</button>
        </>}
      </> : <>
        <label className="block text-xs font-bold">Find foods<input aria-label="Find foods" value={query} onChange={(e) => { setQuery(e.target.value); setSearchFoods(null); }} className="block w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></label>
        <button disabled={busy || query.trim().length < 2} onClick={() => perform(async () => { const result = await dietApi.foods(query); setSearchFoods(result.foods); setSourceNotice(result.notice); })} className="text-xs text-amber-600 dark:text-amber-400 font-bold">Search USDA & saved foods</button>
        {sourceNotice && <p className="text-xs text-slate-500">{sourceNotice}</p>}
        <label className="block text-xs font-bold">Reviewed food<select aria-label="Reviewed food" value={foodId} onChange={(e) => setFoodId(e.target.value)} className="block w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="">Select a food</option>{eligible.map((food) => <option key={food.id} value={food.id}>{food.name}</option>)}</select></label>
        <p className="text-xs text-slate-500">{results.length - eligible.length} unreviewed or restricted matches excluded. Quantities use the named preparation state.</p>
        <label className="block text-xs font-bold">Quantity (g)<input aria-label="Food quantity" type="number" min="1" max="1000" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="ml-2 rounded-xl p-2 w-24 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></label>
        <button disabled={busy || !foodId || Number(quantity) < 1 || Number(quantity) > 1000} onClick={() => perform(async () => { onUpdateDietPlan(await dietApi.editFood(dietPlan.id, modal.meal.id, { foodId: Number(foodId), quantity: Number(quantity), ingredientIndex: modal.index, version: dietPlan.version })); setModal(null); })} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 disabled:opacity-50">{busy ? 'Saving…' : 'Save food change'}</button>
      </>}
    </Modal>}
  </div>;
}

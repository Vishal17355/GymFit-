import React, { useState } from 'react';
import { Target, Dumbbell, ArrowRight, Sparkles, Scale, Ruler, Calendar, Utensils, Activity, Calculator, Check, Zap } from 'lucide-react';
import { ACTIVITY_MULTIPLIERS } from '../../utils/nutritionCalculator';

/**
 * User Requirement Form with Live Mifflin–St Jeor Equation Breakdown
 */
export const DietOnboardingWizard = ({ initialData, onComplete, foods = [], busy = false }) => {
  const [weightKg, setWeightKg] = useState(initialData?.weightKg || 80);
  const [heightCm, setHeightCm] = useState(initialData?.heightCm || 175);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [age, setAge] = useState(initialData?.age || 24);
  const [gender, setGender] = useState(initialData?.sex || 'male');
  const [activityLevel, setActivityLevel] = useState(initialData?.activityLevel || 'Moderately Active');
  const [fitnessGoal, setFitnessGoal] = useState(initialData?.fitnessGoal || 'Muscle Gain / Bulking');
  const [dietType, setDietType] = useState(initialData?.dietType || 'Vegetarian');
  const [allergiesText, setAllergiesText] = useState((initialData?.allergies || []).join(', '));
  const [excludedText, setExcludedText] = useState((initialData?.dislikes || []).join(', '));
  const [availableText, setAvailableText] = useState((initialData?.availableFoods || []).join(', '));
  const [budget, setBudget] = useState(initialData?.dailyBudget ?? '');
  const [prices, setPrices] = useState(initialData?.pricesPer100g || {});
  const [pregnant, setPregnant] = useState(initialData?.pregnantOrBreastfeeding || false);
  const [medicalDiet, setMedicalDiet] = useState(initialData?.medicalDietRequired || false);
  const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

  const goals = [
    {
      id: 'Muscle Gain / Bulking',
      title: 'Muscle Gain / Bulking',
      badge: 'Moderate surplus',
      desc: 'High protein surplus to maximize muscle hypertrophy and strength.'
    },
    {
      id: 'Weight Loss / Fat Loss',
      title: 'Fat Loss / Cutting',
      badge: 'Moderate deficit',
      desc: 'Controlled deficit to burn fat while preserving lean muscle mass.'
    },
    {
      id: 'Weight Maintenance',
      title: 'Weight Maintenance',
      badge: 'Exact Energy Balance',
      desc: 'Maintain current body weight, optimize conditioning and daily vitality.'
    }
  ];

  const dietTypes = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];

  // Current Height in CM for calculations
  const currentHeightCm =
    heightUnit === 'cm'
      ? parseFloat(heightCm) || 175
      : Math.round(((parseInt(heightFt, 10) || 5) * 12 + (parseInt(heightIn, 10) || 0)) * 2.54);

  const handleSubmit = (e) => {
    e.preventDefault();

    onComplete({
      ...initialData,
      name: 'Athlete',
      age: parseInt(age, 10) || 24,
      sex: gender,
      heightCm: currentHeightCm,
      weightKg: parseFloat(weightKg) || 80,
      targetWeightKg: parseFloat(weightKg) || 80,
      activityLevel,
      fitnessGoal,
      dietType,
      progressPace: 'Moderate',
      trainingDaysPerWeek: 5,
      allergies: splitList(allergiesText),
      dislikes: splitList(excludedText),
      hasWhey: initialData?.hasWhey ?? true,
      preferredMeals: initialData?.preferredMeals || 4,
      dailyBudget: budget,
      pricesPer100g: prices,
      availableFoods: splitList(availableText),
      pregnantOrBreastfeeding: pregnant,
      medicalDietRequired: medicalDiet
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Step 1 • Diet Profile
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Enter Your Body Metrics &amp; Goal
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Save your requirements, then review the server-calculated nutrition estimates before generating meals.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Biological Sex (Equation Formula Selection)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'male', label: 'Male', formula: 'BMR = 10W + 6.25H - 5A + 5' },
                { id: 'female', label: 'Female', formula: 'BMR = 10W + 6.25H - 5A - 161' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setGender(s.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    gender === s.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-black text-sm block text-slate-900 dark:text-white">{s.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{s.formula}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weight, Height, Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>Weight (W in kg)</span>
              </label>
              <input
                type="number"
                min="35"
                max="220"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="80"
              />
            </div>

            {/* Height */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-500" />
                  <span>Height (H)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (heightUnit === 'cm') {
                      const totalInches = Math.round(currentHeightCm / 2.54);
                      setHeightFt(Math.floor(totalInches / 12));
                      setHeightIn(totalInches % 12);
                      setHeightUnit('ft');
                    } else {
                      setHeightCm(currentHeightCm);
                      setHeightUnit('cm');
                    }
                  }}
                  className="text-[10px] font-bold text-amber-500 hover:underline"
                >
                  {heightUnit === 'cm' ? 'Use Ft/In' : 'Use CM'}
                </button>
              </div>

              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  min="120"
                  max="240"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="175"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm text-center"
                    placeholder="Ft"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm text-center"
                    placeholder="In"
                  />
                </div>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Age (A in years)</span>
              </label>
              <input
                type="number"
                min="14"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="24"
              />
            </div>
          </div>

          {/* Activity Level Factor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Physical Activity Level (TDEE Multiplier)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(ACTIVITY_MULTIPLIERS).map(([lvl, info]) => {
                const isSelected = activityLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setActivityLevel(lvl)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{lvl}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        ×{info.factor}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
              <span>Select Your Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {goals.map((g) => {
                const isSelected = fitnessGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setFitnessGoal(g.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 inline-block mb-1.5">
                      {g.badge}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                      {g.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>Dietary Preference</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dietTypes.map((dt) => {
                const isSelected = dietType === dt;
                return (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => setDietType(dt)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {dt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <label className="space-y-1 font-bold">Allergies (comma-separated)
              <input aria-label="Allergies" value={allergiesText} onChange={(e) => setAllergiesText(e.target.value)} placeholder="milk, soy, peanuts, wheat, eggs"
                className="block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            </label>
            <label className="space-y-1 font-bold">Foods to exclude
              <input aria-label="Excluded foods" value={excludedText} onChange={(e) => setExcludedText(e.target.value)} placeholder="banana, paneer"
                className="block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            </label>
            <label className="space-y-1 font-bold">Daily ingredient budget (₹, optional)
              <input aria-label="Daily budget" type="number" min="1" max="100000" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)}
                className="block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            </label>
            <label className="space-y-1 font-bold">Available ingredients (optional)
              <input aria-label="Available ingredients" value={availableText} onChange={(e) => setAvailableText(e.target.value)} placeholder="Leave empty for all catalog foods"
                className="block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
            </label>
          </div>
          <details className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-xs">
            <summary className="font-bold cursor-pointer">Local ingredient prices (₹ per 100 g)</summary>
            <p className="mt-2 text-slate-500">A budget requires prices for the ingredients used. Enter your actual prices; unknown costs are never treated as free. Milk is weighed in grams. Dry and cooked quantities follow the labels.</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {foods.map((food) => <label key={food.id} className="flex items-center justify-between gap-2">
                <span>{food.name}</span>
                <input type="number" min="0" max="100000" step="0.01" value={prices[food.id] ?? ''} aria-label={`Price for ${food.name}`}
                  onChange={(e) => setPrices((previous) => { const next = { ...previous }; if (e.target.value === '') delete next[food.id]; else next[food.id] = Number(e.target.value); return next; })}
                  className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2" />
              </label>)}
            </div>
          </details>
          <fieldset className="text-xs space-y-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-900">
            <legend className="font-bold px-1">Requirements for automatic planning</legend>
            <label className="flex items-start gap-2"><input type="checkbox" checked={pregnant} onChange={(e) => setPregnant(e.target.checked)} />Pregnant or breastfeeding</label>
            <label className="flex items-start gap-2"><input type="checkbox" checked={medicalDiet} onChange={(e) => setMedicalDiet(e.target.checked)} />I have a medical condition or need a special therapeutic diet</label>
            <p>General adult formulas are not used to prescribe plans for minors, pregnancy, breastfeeding, or medical dietary needs. The API will provide a guidance message instead.</p>
            <label className="flex items-start gap-2"><input type="checkbox" required />I have reviewed my measurements, allergies, and special dietary requirements.</label>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            <span>{busy ? 'Saving profile…' : 'Save Profile & Review Nutrition'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DietOnboardingWizard;

import { FOOD_DATABASE, getFoodById } from '../data/nutritionDatabase';

/**
 * Activity Multipliers for TDEE Calculation
 * Based on standard sports science & Mifflin-St Jeor recommendations.
 */
export const ACTIVITY_MULTIPLIERS = {
  'Sedentary': { factor: 1.2, label: 'Sedentary (little exercise)' },
  'Lightly Active': { factor: 1.375, label: 'Lightly active (1–3 days/week)' },
  'Moderately Active': { factor: 1.55, label: 'Moderately active (3–5 days/week)' },
  'Very Active': { factor: 1.725, label: 'Very active (6–7 days/week)' },
  'Extremely Active': { factor: 1.9, label: 'Extremely active' }
};

/**
 * Mifflin–St Jeor BMR Equation
 * For males:   BMR = 10W + 6.25H - 5A + 5
 * For females: BMR = 10W + 6.25H - 5A - 161
 *
 * Where:
 * W = Weight in kilograms (kg)
 * H = Height in centimeters (cm)
 * A = Age in years
 */
export const calculateBMRDetails = ({ sex = 'male', weightKg, heightCm, age }) => {
  const w = parseFloat(weightKg) || 0;
  const h = parseFloat(heightCm) || 0;
  const a = parseInt(age, 10) || 0;
  const isFemale = sex === 'female';

  if (!w || !h || !a) {
    return {
      w: 80,
      h: 175,
      a: 24,
      isFemale: false,
      formula: '10W + 6.25H - 5A + 5',
      calculationText: '10(80) + 6.25(175) - 5(24) + 5',
      bmrExact: 1778.75,
      bmr: 1779
    };
  }

  const weightPart = 10 * w;
  const heightPart = 6.25 * h;
  const agePart = 5 * a;
  const constant = isFemale ? -161 : 5;

  const bmrExact = weightPart + heightPart - agePart + constant;
  const bmrRounded = Math.round(bmrExact);

  return {
    w,
    h,
    a,
    isFemale,
    formula: isFemale ? '10W + 6.25H - 5A - 161' : '10W + 6.25H - 5A + 5',
    calculationText: isFemale
      ? `10(${w}) + 6.25(${h}) - 5(${a}) - 161`
      : `10(${w}) + 6.25(${h}) - 5(${a}) + 5`,
    bmrExact: parseFloat(bmrExact.toFixed(2)),
    bmr: bmrRounded
  };
};

export const calculateBMR = (params) => {
  return calculateBMRDetails(params).bmr;
};

/**
 * Total Daily Energy Expenditure (TDEE) based on activity level
 * TDEE = BMR × ActivityFactor
 */
export const calculateTDEEDetails = (bmr, activityLevel = 'Moderately Active') => {
  const info = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS['Moderately Active'];
  const tdeeExact = bmr * info.factor;
  const tdeeRounded = Math.round(tdeeExact);

  return {
    activityLevel,
    factor: info.factor,
    label: info.label,
    tdeeExact: parseFloat(tdeeExact.toFixed(2)),
    tdee: tdeeRounded
  };
};

export const calculateTDEE = (bmr, activityLevel = 'Moderately Active') => {
  return calculateTDEEDetails(bmr, activityLevel).tdee;
};

/**
 * Daily Caloric Target based on Fitness Goal & Progress Pace
 */
export const calculateCaloricTarget = (tdee, goal, pace = 'Moderate') => {
  let delta = 0;

  const paceMultipliers = {
    Conservative: 0.75,
    Moderate: 1.0,
    Aggressive: 1.25
  };

  const p = paceMultipliers[pace] || 1.0;

  switch (goal) {
    case 'Weight Loss / Fat Loss':
      delta = -Math.round(400 * p);
      break;
    case 'Muscle Gain / Bulking':
      delta = +Math.round(350 * p);
      break;
    case 'Body Recomposition':
      delta = -Math.round(150 * p);
      break;
    case 'Weight Maintenance':
    default:
      delta = 0;
      break;
  }

  // Ensure healthy safe minimum floor (1400 kcal)
  const target = Math.max(1400, tdee + delta);
  return {
    maintenanceCalories: tdee,
    targetCalories: target,
    calorieDelta: delta
  };
};

/**
 * Macronutrient Split (Protein, Fats, Carbs)
 * Based on sports resistance training guidelines:
 * - Protein: 1.4–2.0 g/kg body weight daily (4 kcal/g)
 * - Fat: 20–35% of daily calories, standard 25% (9 kcal/g)
 * - Carbohydrates: Remaining calories after protein and fat (4 kcal/g)
 *
 * Energy values:
 * Protein = 4 kcal/g
 * Carbohydrates = 4 kcal/g
 * Fat = 9 kcal/g
 */
export const calculateMacronutrientsDetails = ({ weightKg, targetCalories, goal, dietType }) => {
  const w = parseFloat(weightKg) || 70;

  // Protein: Strictly in 1.4–2.0 g/kg range
  let proteinPerKg = 2.0;
  if (goal === 'Weight Loss / Fat Loss' || goal === 'Body Recomposition') {
    proteinPerKg = 2.0; // Upper boundary of 1.4-2.0 to spare muscle in deficit
  } else if (goal === 'Muscle Gain / Bulking') {
    proteinPerKg = 2.0; // Upper boundary for hypertrophy
  } else {
    proteinPerKg = 1.6; // Mid-range for maintenance
  }

  const proteinGrams = Math.round(w * proteinPerKg);
  const proteinCalories = proteinGrams * 4; // 4 kcal/g

  // Dietary Fats: 25% of daily calories (within 20–35% guideline)
  const fatPercentage = 0.25;
  const fatCalories = Math.round(targetCalories * fatPercentage);
  const fatGrams = Math.round(fatCalories / 9); // 9 kcal/g

  // Carbohydrates: Remaining calories after protein and fat
  const carbCalories = Math.max(100, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(carbCalories / 4); // 4 kcal/g

  // Water (40ml/kg) & Fiber (14g per 1000 kcal)
  const waterLiters = parseFloat((w * 0.04).toFixed(1));
  const fiberGrams = Math.round((targetCalories / 1000) * 14);

  return {
    weightKg: w,
    proteinPerKg,
    proteinGrams,
    proteinCalories,
    proteinPct: Math.round((proteinCalories / targetCalories) * 100),
    fatPercentage: 25,
    fatCalories,
    fatGrams,
    fatPct: Math.round((fatCalories / targetCalories) * 100),
    carbCalories,
    carbGrams,
    carbPct: Math.round((carbCalories / targetCalories) * 100),
    energyValues: {
      proteinKcalPerG: 4,
      carbKcalPerG: 4,
      fatKcalPerG: 9
    },
    waterLiters,
    fiberGrams
  };
};

export const calculateMacronutrients = (params) => {
  const details = calculateMacronutrientsDetails(params);
  return {
    protein: details.proteinGrams,
    carbs: details.carbGrams,
    fat: details.fatGrams,
    waterLiters: details.waterLiters,
    fiber: details.fiberGrams,
    macroDetails: details
  };
};

/**
 * Filter foods that match user's diet category and exclude any allergies or dislikes
 */
export const getEligibleFoods = (dietType, allergies = [], dislikes = [], hasWhey = true) => {
  const normAllergens = (allergies || []).map((a) => a.toLowerCase());
  const normDislikes = (dislikes || []).map((d) => d.toLowerCase());

  return FOOD_DATABASE.filter((food) => {
    if (!hasWhey && food.id === 'whey-protein') return false;
    // 1. Dietary category match
    if (dietType === 'Vegan' && food.dietType !== 'Vegan') return false;
    if (dietType === 'Vegetarian' && food.dietType === 'Non-Vegetarian') return false;
    if (dietType === 'Eggetarian' && food.dietType === 'Non-Vegetarian' && !food.allergens.includes('Eggs')) return false;

    // 2. Allergen check
    for (const allg of food.allergens) {
      if (normAllergens.some((userAllg) => allg.toLowerCase().includes(userAllg))) {
        return false;
      }
    }

    // 3. Dislikes check
    if (normDislikes.some((dis) => food.name.toLowerCase().includes(dis) || food.id.includes(dis))) {
      return false;
    }

    return true;
  });
};

// Keep day totals in sync after generating, adding, or replacing meal items.
export const recalculateDayTotals = (day) => ({
  ...day,
  totals: Object.fromEntries(['calories', 'protein', 'carbs', 'fat'].map((key) => [
    key,
    day.meals.reduce((sum, meal) => sum + (meal[key] || 0), 0)
  ]))
});

/**
 * Generate a complete 7-Day Diet Plan (Monday to Sunday)
 * Deterministically balanced using Mifflin-St Jeor BMR and TDEE formulas.
 */
export const generate7DayDietPlan = (profile) => {
  const {
    fitnessGoal = 'Muscle Gain / Bulking',
    dietType = 'Vegetarian',
    activityLevel = 'Moderately Active',
    allergies = [],
    dislikes = [],
    preferredMeals = 4,
    hasWhey = true
  } = profile;

  const bmrInfo = calculateBMRDetails(profile);
  const tdeeInfo = calculateTDEEDetails(bmrInfo.bmrExact, activityLevel);
  const { targetCalories, calorieDelta } = calculateCaloricTarget(tdeeInfo.tdee, fitnessGoal, profile.progressPace);
  const targetMacros = calculateMacronutrients({
    weightKg: profile.weightKg,
    targetCalories,
    goal: fitnessGoal,
    dietType
  });

  const eligible = getEligibleFoods(dietType, allergies, dislikes, hasWhey);

  // Meal templates based on daily meal count preference (3 to 5 meals)
  const allMealSlots = [
    { key: 'breakfast', name: 'Breakfast', time: '8:00 AM' },
    { key: 'lunch', name: 'Lunch (Power Meal)', time: '1:00 PM' },
    { key: 'preWorkout', name: 'Pre-Workout Fuel', time: '5:00 PM' },
    { key: 'postWorkout', name: 'Post-Workout Recovery', time: '7:30 PM' },
    { key: 'dinner', name: 'Dinner', time: '9:00 PM' }
  ];
  const mealCount = Math.min(5, Math.max(3, Math.trunc(Number(preferredMeals)) || 4));
  // Always include the three main meals, then add recovery and pre-workout slots.
  const mealSlots = allMealSlots.filter((slot) =>
    !['preWorkout', 'postWorkout'].includes(slot.key) ||
    (slot.key === 'postWorkout' && mealCount >= 4) || mealCount === 5
  );

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const days = daysOfWeek.map((dayName, dayIdx) => {
    const meals = mealSlots.map((slot, sIdx) => {
      let items = [];

      if (slot.key === 'breakfast') {
        const carb = eligible.find((f) => f.id === 'rolled-oats') || eligible.find((f) => f.id === 'whole-wheat-roti') || eligible[0];
        const prot = (dietType === 'Non-Vegetarian' || dietType === 'Eggetarian')
          ? eligible.find((f) => f.id === 'whole-eggs') || eligible.find((f) => f.id === 'paneer-raw')
          : eligible.find((f) => f.id === 'paneer-raw') || eligible.find((f) => f.id === 'tofu-firm');
        const fat = eligible.find((f) => f.id === 'peanut-butter') || eligible.find((f) => f.id === 'almonds-raw');

        if (carb) items.push(carb);
        if (prot) items.push(prot);
        if (fat && sIdx % 2 === 0) items.push(fat);
      } else if (slot.key === 'lunch') {
        const grain = (dayIdx % 2 === 0)
          ? eligible.find((f) => f.id === 'white-rice') || eligible.find((f) => f.id === 'whole-wheat-roti')
          : eligible.find((f) => f.id === 'whole-wheat-roti') || eligible.find((f) => f.id === 'white-rice');
        const mainProt = (dietType === 'Non-Vegetarian')
          ? eligible.find((f) => f.id === 'chicken-breast') || eligible.find((f) => f.id === 'fish-tilapia')
          : eligible.find((f) => f.id === 'soya-chunks') || eligible.find((f) => f.id === 'lowfat-paneer');
        const legume = eligible.find((f) => f.id === 'dal-tadka') || eligible.find((f) => f.id === 'rajma-curry');
        const dairy = eligible.find((f) => f.id === 'curd-dahi');

        if (grain) items.push(grain);
        if (mainProt) items.push(mainProt);
        if (legume) items.push(legume);
        if (dairy && !allergies.includes('Lactose')) items.push(dairy);
      } else if (slot.key === 'preWorkout') {
        const fruit = eligible.find((f) => f.id === 'banana') || eligible.find((f) => f.id === 'dates-khajoor') || eligible.find((f) => f.id === 'apple');
        const snack = eligible.find((f) => f.id === 'roasted-chana') || eligible.find((f) => f.id === 'peanut-butter');

        if (fruit) items.push(fruit);
        if (snack) items.push(snack);
      } else if (slot.key === 'postWorkout') {
        const shake = (hasWhey && !allergies.includes('Lactose'))
          ? eligible.find((f) => f.id === 'whey-protein')
          : eligible.find((f) => f.id === 'egg-whites') || eligible.find((f) => f.id === 'soya-chunks');
        const fastCarb = eligible.find((f) => f.id === 'banana') || eligible.find((f) => f.id === 'white-rice');

        if (shake) items.push(shake);
        if (fastCarb) items.push(fastCarb);
      } else {
        // Dinner
        const grain = eligible.find((f) => f.id === 'whole-wheat-roti') || eligible.find((f) => f.id === 'brown-rice');
        const prot = (dietType === 'Non-Vegetarian')
          ? eligible.find((f) => f.id === 'chicken-breast') || eligible.find((f) => f.id === 'egg-whites')
          : eligible.find((f) => f.id === 'paneer-raw') || eligible.find((f) => f.id === 'tofu-firm');
        const veg = eligible.find((f) => f.id === 'dal-tadka') || eligible.find((f) => f.id === 'chole-chickpeas');

        if (grain) items.push(grain);
        if (prot) items.push(prot);
        if (veg) items.push(veg);
      }

      // Calculate meal totals
      const mealCalories = items.reduce((sum, i) => sum + (i.calories || 0), 0);
      const mealProtein = Math.round(items.reduce((sum, i) => sum + (i.protein || 0), 0));
      const mealCarbs = Math.round(items.reduce((sum, i) => sum + (i.carbs || 0), 0));
      const mealFat = Math.round(items.reduce((sum, i) => sum + (i.fat || 0), 0));

      return {
        id: `meal-${dayName.toLowerCase()}-${slot.key}`,
        slotKey: slot.key,
        name: slot.name,
        time: slot.time,
        items: items.map((it) => ({
          ...it,
          uid: `${it.id}-${Math.random().toString(36).substr(2, 6)}`,
          eaten: false
        })),
        calories: mealCalories,
        protein: mealProtein,
        carbs: mealCarbs,
        fat: mealFat
      };
    });

    const dayCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const dayProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const dayCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const dayFat = meals.reduce((sum, m) => sum + m.fat, 0);

    return {
      day: dayName,
      meals,
      totals: {
        calories: dayCalories,
        protein: dayProtein,
        carbs: dayCarbs,
        fat: dayFat
      }
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    bmrInfo,
    tdeeInfo,
    calorieDelta,
    targets: {
      calories: targetCalories,
      ...targetMacros
    },
    days
  };
};

/**
 * Smart Food Replacement Engine
 */
export const findSmartReplacements = (foodId, dietType, userAllergies = [], dislikes = [], hasWhey = true) => {
  const currentFood = getFoodById(foodId);
  if (!currentFood) return [];

  const eligible = getEligibleFoods(dietType, userAllergies, dislikes, hasWhey);

  return eligible
    .filter((f) => f.id !== currentFood.id && (f.category === currentFood.category || currentFood.alternatives.includes(f.id)))
    .map((alt) => {
      const calDiff = Math.abs(alt.calories - currentFood.calories);
      const protDiff = Math.abs(alt.protein - currentFood.protein);
      const score = calDiff * 1.0 + protDiff * 4.0;
      return {
        ...alt,
        diff: {
          calories: alt.calories - currentFood.calories,
          protein: Math.round((alt.protein - currentFood.protein) * 10) / 10
        },
        score
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);
};

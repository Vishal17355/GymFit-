// Storage can be unavailable in private browsing or when the browser quota is full.
export function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readStoredJSON(key, validate = () => true) {
  try {
    const value = JSON.parse(getStoredValue(key));
    return value !== null && validate(value) ? value : null;
  } catch {
    return null;
  }
}

export function isSavedDietProfile(profile) {
  return profile && typeof profile === 'object' &&
    ['weightKg', 'heightCm', 'age'].every((key) => Number.isFinite(Number(profile[key])) && Number(profile[key]) > 0) &&
    typeof profile.dietType === 'string' && typeof profile.fitnessGoal === 'string' &&
    ['allergies', 'dislikes'].every((key) => profile[key] == null ||
      (Array.isArray(profile[key]) && profile[key].every((value) => typeof value === 'string')));
}

export function isSavedDietPlan(plan) {
  const nutrientKeys = ['calories', 'protein', 'carbs', 'fat'];
  return plan && nutrientKeys.every((key) => Number.isFinite(plan.targets?.[key])) &&
    Array.isArray(plan.days) && plan.days.length > 0 && plan.days.every((day) =>
      typeof day?.day === 'string' && Array.isArray(day.meals) && day.meals.length > 0 &&
      day.meals.every((meal) => meal && typeof meal.id === 'string' && nutrientKeys.every((key) => Number.isFinite(meal[key])) && Array.isArray(meal.items) &&
        meal.items.every((item) => item && typeof item.id === 'string' && typeof item.uid === 'string' &&
          nutrientKeys.every((key) => Number.isFinite(item[key])))));
}

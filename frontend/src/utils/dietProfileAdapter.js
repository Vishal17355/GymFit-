import { getStoredValue, isSavedDietProfile } from './storage';

const activities = { Sedentary: 'SEDENTARY', 'Lightly Active': 'LIGHT', 'Moderately Active': 'MODERATE', 'Very Active': 'VERY_ACTIVE', 'Extremely Active': 'EXTREME' };
const goals = { 'Weight Loss / Fat Loss': 'LOSS', 'Muscle Gain / Bulking': 'GAIN', 'Weight Maintenance': 'MAINTAIN' };
const diets = { Vegan: 'VEGAN', Vegetarian: 'VEGETARIAN', Eggetarian: 'EGGETARIAN', 'Non-Vegetarian': 'NON_VEGETARIAN' };
const reverse = (map, value) => Object.keys(map).find((key) => map[key] === value);
export function toApiProfile(form, needsSafetyReview = false) {
  return {
    age: Number(form.age), sexForBmr: form.sex, heightCm: Number(form.heightCm), weightKg: Number(form.weightKg),
    activityLevel: activities[form.activityLevel], fitnessGoal: goals[form.fitnessGoal], dietaryPreference: diets[form.dietType],
    dailyBudget: form.dailyBudget === '' || form.dailyBudget == null ? null : Number(form.dailyBudget),
    allergies: form.allergies || [], excludedFoods: form.dislikes || [], availableFoods: form.availableFoods || [],
    pregnantOrBreastfeeding: Boolean(form.pregnantOrBreastfeeding), medicalDietRequired: needsSafetyReview || Boolean(form.medicalDietRequired),
    pricesPer100g: form.pricesPer100g || {}
  };
}
export function toFormProfile(profile) {
  if (!profile) return null;
  return { age: profile.age, sex: profile.sexForBmr, heightCm: profile.heightCm, weightKg: profile.weightKg,
    activityLevel: reverse(activities, profile.activityLevel), fitnessGoal: reverse(goals, profile.fitnessGoal), dietType: reverse(diets, profile.dietaryPreference),
    dailyBudget: profile.dailyBudget, allergies: profile.allergies, dislikes: profile.excludedFoods, availableFoods: profile.availableFoods,
    pregnantOrBreastfeeding: profile.pregnantOrBreastfeeding, medicalDietRequired: profile.medicalDietRequired, pricesPer100g: profile.pricesPer100g };
}
export function readLegacyDiet() {
  const raw = {};
  for (const key of ['gymfit_diet_state', 'gymfit_diet_profile', 'gymfit_diet_plan']) {
    const value = getStoredValue(key); if (value !== null) raw[key] = value;
  }
  if (!Object.keys(raw).length) return null;
  let profile;
  try { profile = JSON.parse(raw.gymfit_diet_state || 'null')?.profile || JSON.parse(raw.gymfit_diet_profile || 'null'); } catch { /* Preserve malformed raw data too. */ }
  return { raw, profile: isSavedDietProfile(profile) ? profile : null };
}
export function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

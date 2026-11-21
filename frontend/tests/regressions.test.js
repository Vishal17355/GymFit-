import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import * as THREE from 'three';

const vite = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  cacheDir: fileURLToPath(new URL('../node_modules/.vite-tests', import.meta.url)),
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom'
});
after(() => vite.close());

const nutrition = await vite.ssrLoadModule('/src/utils/nutritionCalculator.js');
const anatomy = await vite.ssrLoadModule('/src/utils/anatomy3dLoader.js');
const { UniversalRegionManager } = await vite.ssrLoadModule('/src/components/anatomy3d/modules/universal/UniversalRegionManager.js');
const { disposeObject3D } = await vite.ssrLoadModule('/src/utils/disposeObject3D.js');
const storage = await vite.ssrLoadModule('/src/utils/storage.js');
const { getExerciseDemoData } = await vite.ssrLoadModule('/src/data/exerciseDemoData.js');

const profile = {
  age: 24, sex: 'male', heightCm: 175, weightKg: 80,
  fitnessGoal: 'Muscle Gain / Bulking', dietType: 'Vegetarian'
};

test('3, 4, and 5 meal plans always include dinner once, with consistent totals', () => {
  for (const preferredMeals of [3, 4, 5, '4']) {
    const plan = nutrition.generate7DayDietPlan({ ...profile, preferredMeals });
    assert.equal(plan.days.length, 7);
    for (const day of plan.days) {
      assert.equal(day.meals.length, Number(preferredMeals));
      assert.equal(day.meals.filter((meal) => meal.slotKey === 'dinner').length, 1);
      assert.equal(new Set(day.meals.map((meal) => meal.id)).size, day.meals.length);
      assert.deepEqual(day.totals, nutrition.recalculateDayTotals(day).totals);
    }
  }
});

test('meal generation and food swaps respect diet, allergies, dislikes, and no whey', () => {
  const eligible = nutrition.getEligibleFoods('Vegan', ['soy', 'peanuts'], ['banana'], false);
  assert.ok(eligible.length > 0);
  for (const food of eligible) {
    assert.equal(food.dietType, 'Vegan');
    assert.ok(!food.allergens.some((allergen) => /soy|peanuts/i.test(allergen)));
    assert.ok(!food.name.toLowerCase().includes('banana'));
  }
  const plan = nutrition.generate7DayDietPlan({ ...profile, hasWhey: false });
  assert.ok(plan.days.every((day) => day.meals.every((meal) => meal.items.every((item) => item.id !== 'whey-protein'))));
  const swaps = nutrition.findSmartReplacements('paneer-raw', 'Vegan', [], ['tofu'], false);
  assert.ok(swaps.length > 0);
  assert.ok(swaps.every((food) => food.dietType === 'Vegan' && food.id !== 'tofu-firm'));
});

test('day totals change after a meal is edited without mutating the prior day', () => {
  const original = nutrition.generate7DayDietPlan(profile).days[0];
  const meals = original.meals.map((meal, index) => index ? meal : { ...meal, calories: meal.calories + 100, protein: meal.protein + 10 });
  const edited = nutrition.recalculateDayTotals({ ...original, meals });
  assert.equal(edited.totals.calories, original.totals.calories + 100);
  assert.equal(edited.totals.protein, original.totals.protein + 10);
  assert.notEqual(edited.totals, original.totals);
});

test('sanitized GLTF names retain their anatomical group and subdivision', () => {
  const cases = [
    ['long head of left biceps brachii', 'Biceps', 'Long Head'],
    ['long head of right triceps brachii', 'Triceps', 'Long Head'],
    ['clavicular part of left pectoralis major', 'Chest', 'Upper Chest'],
    ['left rectus abdominis', 'Abs', 'Rectus Abdominis'],
    ['left biceps femoris', 'Legs', 'Hamstrings']
  ];
  for (const [name, bodyPart, subdivision] of cases) {
    assert.deepEqual(anatomy.getGymFitBodyPart(THREE.PropertyBinding.sanitizeNodeName(name)), { bodyPart, subdivision });
  }
  assert.equal(anatomy.getGymFitMuscleGroup('left_latissimus_dorsi'), 'Lats');
  assert.equal(anatomy.getGymFitMuscleGroup('left_rectus_femoris'), 'Quadriceps');
  assert.equal(anatomy.getGymFitMuscleGroup('left_semitendinosus'), 'Hamstrings');
});

test('biceps Long Head never matches triceps, including shared subdivision names', () => {
  const biceps = new THREE.Mesh(new THREE.BoxGeometry());
  biceps.userData = { bodyPart: 'Biceps', subdivision: 'Long Head', rawName: 'long_head_of_left_biceps_brachii' };
  const triceps = new THREE.Mesh(new THREE.BoxGeometry());
  triceps.userData = { bodyPart: 'Triceps', subdivision: 'Long Head', rawName: 'long_head_of_left_triceps_brachii' };
  for (const [group, wanted, other] of [['Biceps', biceps, triceps], ['Triceps', triceps, biceps]]) {
    const manager = new UniversalRegionManager(group, [biceps, triceps]);
    assert.deepEqual(manager.getMeshesForRegion('Long Head'), [wanted]);
    assert.equal(manager.identifyRegionFromMesh(other), null);
  }
  disposeObject3D({ traverse: (visit) => [biceps, triceps].forEach(visit) });
});

test('viewer cleanup disposes shared resources once and preserves reusable materials', () => {
  const calls = { geometry: 0, material: 0, texture: 0, preserved: 0 };
  const geometry = { dispose: () => calls.geometry++ };
  const texture = { isTexture: true, dispose: () => calls.texture++ };
  const material = { map: texture, normalMap: texture, dispose: () => calls.material++ };
  const preserved = { dispose: () => calls.preserved++ };
  const objects = [{ geometry, material: [material, preserved] }, { geometry, material }];
  disposeObject3D({ traverse: (visit) => objects.forEach(visit) }, [preserved]);
  assert.deepEqual(calls, { geometry: 1, material: 1, texture: 1, preserved: 0 });
});

test('blocked browser storage fails gracefully on both reads and writes', (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'localStorage', descriptor) : delete globalThis.localStorage);
  assert.equal(storage.getStoredValue('theme'), null);
  assert.equal(storage.readStoredJSON('plan'), null);
  assert.equal(storage.setStoredValue('plan', '{}'), false);
});

test('invalid stored JSON and incomplete diet data are rejected', (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => '{broken' } });
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'localStorage', descriptor) : delete globalThis.localStorage);
  assert.equal(storage.readStoredJSON('plan'), null);
  assert.ok(!storage.isSavedDietProfile({ ...profile, allergies: 'Dairy' }));
  assert.ok(!storage.isSavedDietPlan({ days: [{}], targets: { calories: 2400 } }));
  assert.ok(storage.isSavedDietProfile(profile));
  assert.ok(storage.isSavedDietPlan(nutrition.generate7DayDietPlan(profile)));
  const invalidTargets = nutrition.generate7DayDietPlan(profile);
  invalidTargets.targets.protein = {};
  assert.ok(!storage.isSavedDietPlan(invalidTargets));
});

test('numeric exercise identifiers no longer throw during catalog lookup', () => {
  assert.doesNotThrow(() => getExerciseDemoData(123));
  assert.equal(getExerciseDemoData('incline-dumbbell-curl').id, 'incline-dumbbell-curl');
});

test('incline dumbbell curls use the biceps viewer, while presses use the press viewer', async () => {
  const { ExerciseDemonstrationViewer } = await vite.ssrLoadModule('/src/components/exercise3d/ExerciseDemonstrationViewer.jsx');
  const curl = ExerciseDemonstrationViewer({ exerciseName: 'Incline Dumbbell Curl', modelUrl: '/exercises/bicep_curl.glb' });
  const press = ExerciseDemonstrationViewer({ exerciseName: 'Incline Dumbbell Bench Press', modelUrl: '/exercises/incline_dumbbell_press.glb' });
  assert.equal(curl.type.name, 'StandingBicepCurlViewer');
  assert.equal(press.type.name, 'InclineDumbbellPress3DViewer');
});

test('diet profile adapter sends no client-supplied user identity and preserves restrictions', async () => {
  const { toApiProfile, toFormProfile } = await vite.ssrLoadModule('/src/utils/dietProfileAdapter.js');
  const form = { ...profile, activityLevel: 'Moderately Active', userId: 'someone-else', allergies: ['soy'], dislikes: ['banana'], dailyBudget: '150', pricesPer100g: { 1: 2 } };
  const api = toApiProfile(form);
  assert.equal(api.userId, undefined);
  assert.equal(api.activityLevel, 'MODERATE');
  assert.equal(api.dailyBudget, 150);
  assert.deepEqual(api.allergies, ['soy']);
  assert.deepEqual(toFormProfile(api).dislikes, ['banana']);
  assert.equal(toApiProfile(form, true).medicalDietRequired, true);
});

test('legacy import reads and retains exact browser data without writing or deleting keys', async (t) => {
  const { readLegacyDiet } = await vite.ssrLoadModule('/src/utils/dietProfileAdapter.js');
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let writes = 0;
  const raw = JSON.stringify({ profile, plan: { oldTotals: 123 } });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key) => key === 'gymfit_diet_state' ? raw : null,
    setItem: () => writes++, removeItem: () => writes++
  } });
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'localStorage', descriptor) : delete globalThis.localStorage);
  const legacy = readLegacyDiet();
  assert.equal(legacy.raw.gymfit_diet_state, raw);
  assert.deepEqual(legacy.profile, profile);
  assert.equal(writes, 0);
});

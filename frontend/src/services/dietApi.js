import { createApiClient } from './apiClient';

let tokenProvider = async () => null;
// Connect a future real sign-in flow here; tokens remain in memory, never in diet localStorage.
export function setDietAccessTokenProvider(provider) { tokenProvider = provider; }
export const getGymFitAccessToken = () => tokenProvider();
const request = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL || '', getAccessToken: () => tokenProvider() });
const root = '/api/v1/diet';
export const dietApi = {
  context: (signal) => request(`${root}/context`, { signal }),
  profile: (signal) => request(`${root}/profile`, { signal }),
  saveProfile: (profile, exists) => request(`${root}/profile`, { method: exists ? 'PUT' : 'POST', body: profile }),
  calculate: (profile) => request(`${root}/calculate`, { method: 'POST', body: profile }),
  plans: (signal) => request(`${root}/plans`, { signal }),
  plan: (id) => request(`${root}/plans/${id}`),
  report: (id, signal) => request(`${root}/plans/${id}/report`, { signal }),
  generate: (startDate, days) => request(`${root}/generate`, { method: 'POST', body: { startDate, days } }),
  alternatives: (planId, mealId) => request(`${root}/plans/${planId}/meals/${mealId}/alternatives`),
  replaceMeal: (body) => request(`${root}/replace-meal`, { method: 'POST', body }),
  editFood: (planId, mealId, body) => request(`${root}/plans/${planId}/meals/${mealId}/foods`, { method: 'POST', body }),
  intake: (planId, mealId, eaten, version) => request(`${root}/plans/${planId}/meals/${mealId}/intake`, { method: 'PUT', body: { eaten, version } }),
  progress: (signal) => request(`${root}/progress`, { signal }),
  logWeight: (weight, recordedAt) => request(`${root}/progress`, { method: 'POST', body: { weight, recordedAt } }),
  foods: (query, signal) => request(`/api/v1/foods/search?${new URLSearchParams({ query })}`, { signal }),
  catalog: (signal) => request('/api/v1/foods/catalog', { signal }),
  importLegacy: (profile, legacyData) => request(`${root}/import`, { method: 'POST', body: { profile, legacyData } }),
  imports: (signal) => request(`${root}/imports`, { signal }),
  archive: (id) => request(`${root}/imports/${id}`)
};

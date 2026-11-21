import { createApiClient } from './apiClient';
import { getGymFitAccessToken } from './dietApi';

const request = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  getAccessToken: getGymFitAccessToken,
  serviceName: 'Nutrition Diary API'
});
const root = '/api/v1/nutrition-diary';
export const diaryApi = {
  day: (date, signal) => request(`${root}?${new URLSearchParams({ date })}`, { signal }),
  recent: (favorites, signal) => request(`${root}/recent?favorites=${favorites}`, { signal }),
  add: (body) => request(`${root}/entries`, { method: 'POST', body }),
  batch: (entries) => request(`${root}/entries/batch`, { method: 'POST', body: { entries } }),
  recipes: () => request(`${root}/recipes`),
  addRecipe: (body) => request(`${root}/entries/recipe`, { method: 'POST', body }),
  edit: (id, body) => request(`${root}/entries/${id}`, { method: 'PATCH', body }),
  remove: (id) => request(`${root}/entries/${id}`, { method: 'DELETE' }),
  repeat: (id, body) => request(`${root}/entries/${id}/repeat`, { method: 'POST', body }),
  water: (body) => request(`${root}/water`, { method: 'PUT', body }),
  settings: (body) => request(`${root}/settings`, { method: 'PUT', body })
};

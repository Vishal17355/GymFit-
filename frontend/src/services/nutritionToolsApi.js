import { createApiClient } from './apiClient';
import { getGymFitAccessToken } from './dietApi';

const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  getAccessToken: getGymFitAccessToken,
  serviceName: 'Nutrition Tools API'
});
const request = (path, options) => api(`/api/v1/nutrition-tools${path}`, options);
const send = (path, method, body) => request(path, { method, body });
export const nutritionTools = {
  templates: signal => request('/templates', { signal }),
  saveTemplate: body => send('/templates', 'POST', body),
  logTemplate: (id, body) => send(`/templates/${id}/log`, 'POST', body),
  removeTemplate: id => send(`/templates/${id}`, 'DELETE'),
  describe: text => send('/describe', 'POST', { text }),
  insights: (date, signal) => request(`/insights?${new URLSearchParams({ date })}`, { signal }),
  reminders: signal => request('/reminders', { signal }),
  saveReminder: body => send('/reminders', 'PUT', body),
  removeReminder: kind => send(`/reminders/${kind}`, 'DELETE'),
  photos: signal => request('/photos', { signal }),
  image: (id, signal) => request(`/photos/${id}`, { signal, responseType: 'blob' }),
  upload: form => send('/photos', 'POST', form),
  removePhoto: id => send(`/photos/${id}`, 'DELETE'),
  activity: signal => request('/activity', { signal }),
  importActivity: rows => send('/activity', 'PUT', { rows }),
  circles: signal => request('/circles', { signal }),
  discover: signal => request('/circles/discover', { signal }),
  create: body => send('/circles', 'POST', body),
  join: body => send('/circles/join', 'POST', body),
  circle: id => request(`/circles/${id}`),
  post: (id, body) => send(`/circles/${id}/posts`, 'POST', body),
  react: (id, post, active) => send(`/circles/${id}/posts/${post}/reaction`, 'PUT', { active })
};

import { createApiClient } from './apiClient';
import { getGymFitAccessToken } from './dietApi';
const request = createApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL || '', getAccessToken: getGymFitAccessToken, serviceName: 'Home Workout API' });
const root='/api/v1/home-workouts';
export const homeWorkoutApi={
 profile:signal=>request(`${root}/profile`,{signal}),
 saveProfile:body=>request(`${root}/profile`,{method:'PUT',body}),
 exercises:(filters={},signal)=>request(`${root}/exercises?${new URLSearchParams(filters)}`,{signal}),
 current:signal=>request(`${root}/plans/current`,{signal}),
 plan:id=>request(`${root}/plans/${id}`),
 generate:body=>request(`${root}/plans/generate`,{method:'POST',body}),
 editPlan:(id,body)=>request(`${root}/plans/${id}`,{method:'PATCH',body}),
 active:signal=>request(`${root}/sessions/active`,{signal}),
 start:body=>request(`${root}/sessions`,{method:'POST',body}),
 session:id=>request(`${root}/sessions/${id}`),
 editSession:(id,body)=>request(`${root}/sessions/${id}`,{method:'PATCH',body}),
 history:(page=0,signal)=>request(`${root}/history?page=${page}&size=10`,{signal}),
 progress:signal=>request(`${root}/progress`,{signal}),
 challenges:signal=>request(`${root}/challenges`,{signal}),
 join:id=>request(`${root}/challenges/${id}/join`,{method:'POST'})
};

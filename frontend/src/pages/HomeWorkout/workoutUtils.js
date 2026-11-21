export const label=value=>String(value||'').toLowerCase().replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
export const EQUIPMENT=['YOGA_MAT','DUMBBELLS','RESISTANCE_BANDS','PULL_UP_BAR','KETTLEBELL','JUMP_ROPE','BENCH'];
export const MUSCLES=['CHEST','BACK','SHOULDERS','BICEPS','TRICEPS','ABS','GLUTES','QUADRICEPS','HAMSTRINGS','CALVES'];
export const GOALS=['WEIGHT_LOSS','MUSCLE_GAIN','STRENGTH','FITNESS','ENDURANCE','MOBILITY','CORE','MAINTAIN'];
export const LIMITS=['WRIST','KNEE','SHOULDER','BACK','BALANCE','JUMPING','OVERHEAD','FLOOR','HIP','ANKLE','ELBOW'];
export const clockText=seconds=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.floor(Math.max(0,seconds))%60).padStart(2,'0')}`;
export function nextSet(prescription,logs){return Array.from({length:prescription.sets},(_,i)=>i+1).find(i=>!logs.some(log=>log.exerciseId===prescription.exerciseId&&log.setNumber===i))??null;}
export function allowedExercise(exercise,profile){const levels=['BEGINNER','INTERMEDIATE','ADVANCED'];return levels.indexOf(exercise.difficulty)<=levels.indexOf(profile.level)&&exercise.equipment.every(e=>profile.equipment.includes(e))&&!exercise.limitationTags.some(t=>profile.limitations.includes(t)||profile.lowImpact&&t==='JUMPING')&&!profile.discomfortExercises.includes(exercise.id);}
export const errorText=error=>`${error.message}${Object.values(error.fields||{}).length?` ${Object.entries(error.fields).map(([key,value])=>`${key}: ${value}`).join('; ')}`:''}`;

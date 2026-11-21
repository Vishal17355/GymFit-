/**
 * 3D Exercise Demonstration Data Catalog
 * Maps each exercise to its rigged GLB 3D model, target anatomy,
 * equipment, biomechanical cues, and difficulty.
 */

export const EXERCISE_DEMO_CATALOG = {
  // ────────────────── BICEPS ──────────────────
  'incline-dumbbell-curl': {
    id: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Curl',
    targetMuscle: 'Biceps',
    targetRegion: 'Long Head',
    equipment: 'Dumbbells & Bench',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/bicep_curl.glb',
    description:
      'Isolates the long head of the biceps by placing the shoulder into hyperextension, achieving a deeper muscular stretch and peak contraction.',
    primaryMuscles: ['Long Head of Biceps Brachii'],
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    cues: [
      'Keep elbows pinned behind torso throughout the rep.',
      'Supinate wrists (turn pinkies up) at the top of the curl.',
      'Control the lowering phase for 2-3 seconds.'
    ],
    instructions: [
      'Set bench to 45°-60° incline and lean back firmly.',
      'Hold dumbbells with arms fully hanging toward floor.',
      'Curl dumbbells upward while keeping elbows stationary.',
      'Squeeze the bicep peak at top contraction, then lower with control.'
    ],
    mistakes: [
      'Swinging shoulders forward to gain momentum.',
      'Cutting the bottom range of motion short.'
    ]
  },

  'close-grip-barbell-curl': {
    id: 'close-grip-barbell-curl',
    name: 'Close-Grip Barbell Curl',
    targetMuscle: 'Biceps',
    targetRegion: 'Long Head',
    equipment: 'Barbell or EZ-Bar',
    difficulty: 'Beginner',
    modelUrl: '/exercises/bicep_curl.glb',
    description:
      'Grip placed inside shoulder width shifts tension onto the lateral long head, emphasizing outer bicep peak development.',
    primaryMuscles: ['Long Head of Biceps Brachii'],
    secondaryMuscles: ['Forearm Flexors'],
    cues: [
      'Keep elbows firmly tucked against your ribs.',
      'Do not rock backwards at the hip during the concentric phase.'
    ],
    instructions: [
      'Grip bar slightly narrower than shoulder width.',
      'Curl bar up toward collarbones while maintaining strict posture.',
      'Squeeze hard at the peak before slowly eccentric lowering.'
    ],
    mistakes: ['Allowing elbows to flare outward.']
  },

  'dumbbell-hammer-curl': {
    id: 'dumbbell-hammer-curl',
    name: 'Standing Hammer Curl',
    targetMuscle: 'Biceps',
    targetRegion: 'Brachialis',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    modelUrl: '/exercises/bicep_curl.glb',
    description:
      'Neutral-grip curl that directly overloads the brachialis and brachioradialis, pushing the bicep peak upward for arm thickness.',
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Biceps Brachii'],
    cues: [
      'Palms face each other through the entire repetition.',
      'Lock your wrist in a neutral handshake posture.'
    ],
    instructions: [
      'Hold dumbbells at sides with neutral grip.',
      'Curl weights upward without rotating wrists.',
      'Hold contraction at the top for 1 full second.'
    ],
    mistakes: ['Using hip momentum to swing the weights up.']
  },

  'rope-cable-hammer-curl': {
    id: 'rope-cable-hammer-curl',
    name: 'Rope Cable Hammer Curl',
    targetMuscle: 'Biceps',
    targetRegion: 'Brachialis',
    equipment: 'Cable Machine & Rope',
    difficulty: 'Beginner',
    modelUrl: '/exercises/bicep_curl.glb',
    description:
      'Constant cable resistance keeps tension on the brachialis throughout the range of motion.',
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Long Head Biceps'],
    cues: ['Spread the rope handles slightly outward at the top contraction.'],
    instructions: [
      'Attach rope to low pulley and grip with palms facing inwards.',
      'Pull upward keeping elbows pinned.',
      'Flare rope ends apart at peak contraction.'
    ],
    mistakes: ['Leaning backward during pull.']
  },

  'wide-grip-ez-bar-curl': {
    id: 'wide-grip-ez-bar-curl',
    name: 'Wide-Grip EZ-Bar Curl',
    targetMuscle: 'Biceps',
    targetRegion: 'Short Head',
    equipment: 'EZ-Bar',
    difficulty: 'Beginner',
    modelUrl: '/exercises/bicep_curl.glb',
    description:
      'Wide grip externally rotates shoulders and directs mechanical load onto the inner short head, boosting arm width.',
    primaryMuscles: ['Short Head of Biceps Brachii'],
    secondaryMuscles: ['Brachialis'],
    cues: ['Drive through the pinky fingers on the concentric curl.'],
    instructions: [
      'Hold the outer bends of the EZ-bar with hands wider than shoulders.',
      'Curl the bar upward toward chest level.',
      'Squeeze the inner biceps firmly before lowering.'
    ],
    mistakes: ['Letting elbows drift backward.']
  },

  // ────────────────── CHEST ──────────────────
  'barbell-bench-press': {
    id: 'barbell-bench-press',
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'Chest',
    targetRegion: 'Middle Chest',
    equipment: 'Barbell & Flat Bench',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/bench_press.glb',
    description:
      'The foundational horizontal press for building pectoralis major mass, anterior deltoid strength, and triceps lockout power.',
    primaryMuscles: ['Middle Pectoralis Major'],
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    cues: [
      'Retract and depress scapulae into the bench pad.',
      'Touch barbell lightly to mid-chest (nipple line).',
      'Drive feet hard into the floor (leg drive).'
    ],
    instructions: [
      'Lie flat with eyes directly under the racked bar.',
      'Grip bar slightly wider than shoulder width.',
      'Unrack, lower bar with control until it touches the chest.',
      'Press upward in a slight J-curve back over the shoulders.'
    ],
    mistakes: [
      'Bouncing the bar violently off the sternum.',
      'Flaring elbows out at 90 degrees (tuck elbows to 45°-60°).'
    ]
  },

  'incline-dumbbell-bench-press': {
    id: 'incline-dumbbell-bench-press',
    name: 'Incline Dumbbell Bench Press',
    targetMuscle: 'Chest',
    targetRegion: 'Upper Chest',
    equipment: 'Incline Bench (30°) & Dumbbells',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/incline_dumbbell_press.glb',
    videoUrl: '/exercises/incline_dumbbell_press.mp4',
    description:
      'Angles tension into the clavicular head of the pectoralis major for upper chest fullness.',
    primaryMuscles: ['Clavicular Head (Upper Pectoralis)'],
    secondaryMuscles: ['Front Deltoids', 'Triceps Brachii'],
    cues: [
      'Set bench angle to 30° for optimal clavicular recruitment without front delt dominance.',
      'Press dumbbells upward in a converging arc toward the upper chest center.',
      'Lower under 3s strict control to upper chest level.'
    ],
    instructions: [
      'Sit on 30-degree incline bench with feet planted flat on the floor.',
      'Kick dumbbells up to upper chest level with neutral wrists and elbows at 45 degrees.',
      'Press dumbbells upward for 2 seconds in a controlled arc without locking elbows.',
      'Hold peak contraction for 1 second, then lower slowly for 3 seconds.'
    ],
    mistakes: [
      'Setting the bench too steep (>45°) which shifts load into shoulders.',
      'Banging dumbbells together at top lock-out.'
    ]
  },

  'decline-bench-press': {
    id: 'decline-bench-press',
    name: 'Decline Barbell Bench Press',
    targetMuscle: 'Chest',
    targetRegion: 'Lower Chest',
    equipment: 'Decline Bench & Barbell',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/bench_press.glb',
    description:
      'Reduces shoulder stress and isolates lower sternal pectoralis fibers for a defined lower chest line.',
    primaryMuscles: ['Abdominal / Lower Pectoralis Major'],
    secondaryMuscles: ['Triceps Brachii'],
    cues: ['Lower bar with control to lower sternum.'],
    instructions: [
      'Lock legs into decline bench pads and grip bar firmly.',
      'Lower bar smoothly to the base of the chest.',
      'Press straight up to full arm extension.'
    ],
    mistakes: ['Letting hips lift off the bench.']
  },

  // ────────────────── LEGS ──────────────────
  'barbell-back-squat': {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    targetMuscle: 'Legs',
    targetRegion: 'Quadriceps',
    equipment: 'Barbell & Squat Rack',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/barbell_squat.glb',
    description:
      'The king of lower-body compound movements, heavily engaging the quadriceps, glutes, adductors, and spinal erectors.',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae'],
    cues: [
      'Inhale deeply and brace your core 360 degrees.',
      'Break simultaneously at hips and knees.',
      'Push knees outward in line with your toes.',
      'Descend until hip crease is below top of knees (parallel or deeper).'
    ],
    instructions: [
      'Step under bar, rest bar across traps, and unrack with tight upper back.',
      'Take 2-3 steps back and set feet shoulder-width apart, toes flared 15°-30°.',
      'Hinge hips and bend knees to descend into deep squat.',
      'Drive powerfully out of the hole by pressing mid-foot into floor.'
    ],
    mistakes: [
      'Knees caving inward (valgus collapse).',
      'Rising on toes instead of driving through mid-foot.'
    ]
  },

  'front-squat': {
    id: 'front-squat',
    name: 'Barbell Front Squat',
    targetMuscle: 'Legs',
    targetRegion: 'Quadriceps',
    equipment: 'Barbell & Rack',
    difficulty: 'Advanced',
    modelUrl: '/exercises/barbell_squat.glb',
    description:
      'Anterior bar placement forces an upright torso, transferring maximum loading directly into the quadriceps.',
    primaryMuscles: ['Quadriceps', 'Core Stabilizers'],
    secondaryMuscles: ['Glutes', 'Upper Back'],
    cues: ['Keep elbows pointed high to maintain front rack shelf.'],
    instructions: [
      'Rest bar across front deltoids with fingertips under bar.',
      'Descend into squat keeping torso strictly vertical.',
      'Drive up while driving elbows toward ceiling.'
    ],
    mistakes: ['Allowing elbows to drop down.']
  },

  'romanian-deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    targetMuscle: 'Legs',
    targetRegion: 'Hamstrings',
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/barbell_squat.glb',
    description:
      'Pure hip-hinge exercise creating intense eccentric stretch on the hamstrings and glutes.',
    primaryMuscles: ['Hamstrings', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Lats'],
    cues: [
      'Push hips back toward the wall behind you.',
      'Keep barbell skimming close against your shins.'
    ],
    instructions: [
      'Stand holding barbell with soft bend in knees.',
      'Hinge at hips, sliding bar down thighs while keeping back neutral.',
      'Lower until deep hamstring stretch is felt, then thrust hips forward.'
    ],
    mistakes: ['Rounding the lumbar spine.']
  },

  // ────────────────── SHOULDERS ──────────────────
  'overhead-barbell-press': {
    id: 'overhead-barbell-press',
    name: 'Overhead Barbell Military Press',
    targetMuscle: 'Shoulders',
    targetRegion: 'Front Delt',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    modelUrl: '/exercises/shoulder_press.glb',
    description:
      'The premier vertical pressing exercise building powerful anterior deltoids, triceps, and upper thoracic stability.',
    primaryMuscles: ['Anterior Deltoids'],
    secondaryMuscles: ['Lateral Deltoids', 'Triceps Brachii', 'Upper Chest'],
    cues: [
      'Squeeze glutes and brace abs to prevent lumbar hyperextension.',
      'Pull chin back slightly as bar passes face, then push head through.'
    ],
    instructions: [
      'Rest bar across collarbone with elbows slightly in front of bar.',
      'Press bar vertically in a straight vertical bar path.',
      'Lock out overhead with bar aligned directly above mid-foot.'
    ],
    mistakes: ['Excessive arching of lower back.']
  },

  'dumbbell-lateral-raise': {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    targetMuscle: 'Shoulders',
    targetRegion: 'Side Delt',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    modelUrl: '/exercises/shoulder_press.glb',
    description:
      'Isolates the lateral deltoid head to build wide, rounded 3D shoulders and broaden the upper torso frame.',
    primaryMuscles: ['Lateral Deltoid (Acromial Head)'],
    secondaryMuscles: ['Trapezius', 'Supraspinatus'],
    cues: [
      'Lead with elbows slightly higher than wrists.',
      'Do not shrug shoulders toward ears.'
    ],
    instructions: [
      'Hold dumbbells at sides with slight forward lean.',
      'Raise arms out to sides until parallel to the floor.',
      'Hold top squeeze for a beat before controlled descent.'
    ],
    mistakes: ['Using body swing to fling weights up.']
  },

  'face-pull': {
    id: 'face-pull',
    name: 'Cable Face Pull',
    targetMuscle: 'Shoulders',
    targetRegion: 'Rear Delt',
    equipment: 'Cable Machine & Rope',
    difficulty: 'Beginner',
    modelUrl: '/exercises/shoulder_press.glb',
    description:
      'Combines shoulder horizontal abduction with external rotation to build rear delts and bulletproof the rotator cuff.',
    primaryMuscles: ['Posterior Deltoid (Spinal Head)', 'Infraspinatus'],
    secondaryMuscles: ['Rhomboids', 'Middle Trapezius'],
    cues: ['Pull rope towards eyes while spreading knuckles apart.'],
    instructions: [
      'Set cable to eye height and grip rope with overhand grip.',
      'Step back, pull rope toward eyes while externally rotating shoulders.',
      'Squeeze rear shoulder blades together.'
    ],
    mistakes: ['Pulling toward chest instead of eye level.']
  }
};

/**
 * Helper to get demo model by exercise ID or muscle/name keyword
 */
export function getExerciseDemoData(exerciseIdOrName) {
  if (!exerciseIdOrName) return null;
  const name = String(exerciseIdOrName).toLowerCase().trim();
  const key = name.replace(/\s+/g, '-');

  // Exact ID match
  if (EXERCISE_DEMO_CATALOG[key]) return EXERCISE_DEMO_CATALOG[key];

  // Lookup by name
  const found = Object.values(EXERCISE_DEMO_CATALOG).find(
    (e) =>
      e.id === key ||
      e.name.toLowerCase() === name ||
      name.includes(e.name.toLowerCase()) ||
      e.name.toLowerCase().includes(name)
  );

  if (found) return found;

  // Fallback default based on muscle keywords
  const l = name;
  if (l.includes('incline') && (l.includes('dumbbell') || l.includes('press') || l.includes('bench')))
    return EXERCISE_DEMO_CATALOG['incline-dumbbell-bench-press'];
  if (l.includes('curl') || l.includes('bicep')) return EXERCISE_DEMO_CATALOG['incline-dumbbell-curl'];
  if (l.includes('press') && (l.includes('bench') || l.includes('chest') || l.includes('push')))
    return EXERCISE_DEMO_CATALOG['barbell-bench-press'];
  if (l.includes('squat') || l.includes('leg') || l.includes('lunge') || l.includes('quad'))
    return EXERCISE_DEMO_CATALOG['barbell-back-squat'];
  if (l.includes('overhead') || l.includes('shoulder') || l.includes('delt'))
    return EXERCISE_DEMO_CATALOG['overhead-barbell-press'];

  // Universal fallback
  return EXERCISE_DEMO_CATALOG['incline-dumbbell-curl'];
}

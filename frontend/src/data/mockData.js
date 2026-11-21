export const mockUsers = {
  member: {
    id: 101,
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gymName: 'Apex Fitness Hub',
    branch: 'Downtown Flagship',
    membershipPlan: 'Pro Athlete Annual',
    membershipStatus: 'ACTIVE',
    membershipExpiry: '2027-08-15',
    qrCodeHash: 'GYMFIT-MEMBER-99281-ALEX',
    currentStreak: 18,
    totalWorkouts: 142,
    personalBest1RM: {
      benchPress: '115 kg',
      squat: '160 kg',
      deadlift: '210 kg'
    }
  },
  trainer: {
    id: 201,
    name: 'Marcus Vance',
    email: 'marcus.vance@apexfit.com',
    role: 'TRAINER',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80',
    gymName: 'Apex Fitness Hub',
    branch: 'Downtown Flagship',
    specialization: 'Hypertrophy & Strength Conditioning',
    certification: 'CSCS & NASM-CPT',
    activeClientsCount: 16,
    classesToday: 2,
    rating: 4.9
  },
  owner: {
    id: 301,
    name: 'Eleanor Sterling',
    email: 'eleanor@apexfit.com',
    role: 'GYM_OWNER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    gymName: 'Apex Fitness Hub',
    slug: 'apex-fitness',
    branchesCount: 3,
    activeMembersCount: 1428,
    liveOccupancy: 68,
    maxCapacity: 160,
    mrr: '$48,250'
  }
};

export const mockExercises = [
  {
    id: 0,
    name: 'Standing Dumbbell Biceps Curl',
    muscleGroup: 'Arms (Biceps Brachii)',
    secondaryMuscles: ['Brachialis', 'Brachioradialis', 'Anterior Deltoids'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    has3DAnimation: true,
    animationUrl: '/bicep-curl',
    instructions: 'Stand upright with feet shoulder-width apart. Hold a dumbbell in each hand, elbows close to torso, palms facing forward. Slowly bend elbows and lift dumbbells toward shoulders keeping upper arms stationary. Avoid swinging torso. Lower dumbbells slowly under control to starting position.',
    tips: 'Pin elbows to ribs and maintain a fully supinated grip (palms forward) throughout the entire repetition.'
  },
  {
    id: 1,
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Delts'],
    equipment: 'Barbell & Bench',
    difficulty: 'Intermediate',
    instructions: 'Lie on the bench with eyes under the bar. Grip slightly wider than shoulder width. Lower bar to mid-chest with control, press upward driving through feet.',
    tips: 'Keep shoulder blades retracted and elbows tucked at roughly 45 degrees.'
  },
  {
    id: 2,
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs (Quads / Glutes)',
    secondaryMuscles: ['Hamstrings', 'Core', 'Lower Back'],
    equipment: 'Barbell & Squat Rack',
    difficulty: 'Advanced',
    instructions: 'Place bar across traps. Stand feet shoulder-width apart, toes angled out slightly. Break at hips and knees simultaneously until thighs are parallel to ground.',
    tips: 'Maintain a braced neutral spine throughout the ascent.'
  },
  {
    id: 3,
    name: 'Conventional Deadlift',
    muscleGroup: 'Back & Posterior Chain',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Forearms'],
    equipment: 'Barbell & Plates',
    difficulty: 'Advanced',
    instructions: 'Bar over mid-foot. Hinge down, grip bar just outside shins. Pull chest tall, engage lats, push floor away through heels until standing erect.',
    tips: 'Do not allow hips to rise faster than your shoulders.'
  },
  {
    id: 4,
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest (Upper)',
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipment: 'Dumbbells & Incline Bench',
    difficulty: 'Intermediate',
    instructions: 'Set bench to 30-45 degrees. Press dumbbells overhead with neutral-to-pronated wrist angle. Lower smoothly until feeling stretch in upper chest.',
    tips: 'Avoid bench angles higher than 45 degrees to prevent excessive shoulder involvement.'
  },
  {
    id: 5,
    name: 'Overhead Standing Military Press',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Upper Traps', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: 'Stand tall with bar racked at collarbone. Tighten glutes and core. Press bar vertically in a straight path, moving head back then through at lockout.',
    tips: 'Avoid hyperextending your lumbar spine at the top.'
  },
  {
    id: 6,
    name: 'Seated Cable Row',
    muscleGroup: 'Back (Lats / Rhomboids)',
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipment: 'Cable Machine',
    difficulty: 'Beginner',
    instructions: 'Sit with upright torso and slight knee bend. Pull attachment to lower abdomen while driving elbows back and squeezing shoulder blades.',
    tips: 'Do not swing your torso excessively back and forth.'
  },
  {
    id: 7,
    name: 'Romanian Deadlift (RDL)',
    muscleGroup: 'Legs (Hamstrings)',
    secondaryMuscles: ['Glutes', 'Lower Back'],
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    instructions: 'Hold weight at hips with slight knee bend. Push hips back as far as possible while keeping bar close to legs. Reverse motion when hamstrings feel fully stretched.',
    tips: 'Focus on pure hip hinge; knees stay soft but stationary.'
  },
  {
    id: 8,
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders (Lateral Delts)',
    secondaryMuscles: ['Traps'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: 'Stand tall holding light dumbbells at sides. Raise arms out to sides with slight elbow bend until parallel with floor. Control the negative.',
    tips: 'Lead with elbows rather than wrists for maximum side delt recruitment.'
  }
];

export const mockWorkouts = [
  {
    id: 'plan-1',
    title: 'Hypertrophy Split: Push Day (Chest & Triceps)',
    goal: 'Muscle Growth & Volume Overload',
    targetMember: 'Alex Rivera',
    assignedBy: 'Coach Marcus Vance',
    daysCount: 4,
    estimatedMinutes: 65,
    exercises: [
      { exerciseId: 1, name: 'Barbell Bench Press', sets: 4, targetReps: '8-10', targetLoad: '85 kg', targetRPE: '8.5', rest: '90s' },
      { exerciseId: 4, name: 'Incline Dumbbell Press', sets: 3, targetReps: '10-12', targetLoad: '32 kg/side', targetRPE: '8', rest: '75s' },
      { exerciseId: 5, name: 'Overhead Standing Military Press', sets: 3, targetReps: '8', targetLoad: '55 kg', targetRPE: '8', rest: '90s' },
      { exerciseId: 8, name: 'Dumbbell Lateral Raise', sets: 4, targetReps: '15', targetLoad: '12 kg/side', targetRPE: '9', rest: '60s' }
    ]
  },
  {
    id: 'plan-2',
    title: 'Hypertrophy Split: Pull Day (Back & Biceps)',
    goal: 'Lats Thickness & Posterior Chain',
    targetMember: 'Alex Rivera',
    assignedBy: 'Coach Marcus Vance',
    daysCount: 4,
    estimatedMinutes: 60,
    exercises: [
      { exerciseId: 3, name: 'Conventional Deadlift', sets: 4, targetReps: '6', targetLoad: '160 kg', targetRPE: '8.5', rest: '120s' },
      { exerciseId: 6, name: 'Seated Cable Row', sets: 4, targetReps: '12', targetLoad: '75 kg', targetRPE: '8', rest: '75s' }
    ]
  }
];

export const mockBodyMetrics = [
  { date: 'May 2026', weightKg: 82.5, bodyFatPct: 17.2, muscleMassKg: 41.2 },
  { date: 'Jun 2026', weightKg: 81.8, bodyFatPct: 16.4, muscleMassKg: 41.5 },
  { date: 'Jul 2026', weightKg: 81.0, bodyFatPct: 15.6, muscleMassKg: 41.8 },
  { date: 'Aug 2026', weightKg: 80.4, bodyFatPct: 14.8, muscleMassKg: 42.1 },
  { date: 'Sep 2026', weightKg: 79.8, bodyFatPct: 14.1, muscleMassKg: 42.4 },
  { date: 'Oct 2026', weightKg: 79.2, bodyFatPct: 13.5, muscleMassKg: 42.8 }
];

export const mockClasses = [
  {
    id: 1,
    name: 'High-Octane CrossFit WOD',
    trainer: 'Coach Marcus Vance',
    time: 'Today • 06:30 PM - 07:30 PM',
    room: 'Studio A (Main Turf)',
    spotsLeft: 3,
    capacity: 20,
    intensity: 'High'
  },
  {
    id: 2,
    name: 'Power Flow Vinyasa Yoga',
    trainer: 'Elena Rostova',
    time: 'Tomorrow • 07:00 AM - 08:00 AM',
    room: 'Zen Room 2',
    spotsLeft: 8,
    capacity: 25,
    intensity: 'Moderate'
  },
  {
    id: 3,
    name: 'Velocity Spin & Rhythm Sprint',
    trainer: 'Dave Miller',
    time: 'Tomorrow • 05:30 PM - 06:15 PM',
    room: 'Cycle Studio',
    spotsLeft: 0,
    capacity: 22,
    intensity: 'Extreme'
  }
];

export const mockOwnerStats = {
  activeMembers: 1428,
  activeMembersChange: '+8.4%',
  liveOccupancy: 68,
  liveCapacityMax: 160,
  monthlyRecurringRevenue: '$48,250',
  mrrChange: '+12.6%',
  memberRetentionRate: '94.2%',
  retentionChange: '+1.8%',
  branches: [
    { name: 'Downtown Flagship', activeCount: 680, currentLive: 42, mrr: '$24,100' },
    { name: 'Westside Performance Center', activeCount: 460, currentLive: 18, mrr: '$15,400' },
    { name: 'Northgate Express Hub', activeCount: 288, currentLive: 8, mrr: '$8,750' }
  ],
  recentCheckIns: [
    { name: 'Alex Rivera', plan: 'Pro Athlete', branch: 'Downtown Flagship', time: '4 mins ago', status: 'ALLOWED' },
    { name: 'Chloe Dubois', plan: 'Gold Monthly', branch: 'Downtown Flagship', time: '9 mins ago', status: 'ALLOWED' },
    { name: 'Devon King', plan: 'Standard Fit', branch: 'Westside', time: '14 mins ago', status: 'ALLOWED' },
    { name: 'Tara Mehta', plan: 'Trial Pass', branch: 'Northgate', time: '22 mins ago', status: 'EXPIRED' }
  ]
};

export const mockTrainerClients = [
  { id: 101, name: 'Alex Rivera', goal: 'Hypertrophy & Strength', plan: 'Push/Pull/Legs Split', adherence: '94%', lastActive: 'Today' },
  { id: 102, name: 'Chloe Dubois', goal: 'Fat Loss & Core Stability', plan: 'Full Body Circuit', adherence: '88%', lastActive: 'Yesterday' },
  { id: 103, name: 'Liam Zhang', goal: 'Powerlifting Meet Prep', plan: '5/3/1 Heavy Cycle', adherence: '96%', lastActive: '2 days ago' },
  { id: 104, name: 'Samantha Reed', goal: 'Postural Rehabilitation', plan: 'Mobility & Glute Activation', adherence: '78%', lastActive: '3 days ago' }
];

/**
 * Universal Muscle Exploration Configuration
 * Comprehensive data architecture for all 7 major muscle groups:
 * Chest, Biceps, Triceps, Shoulders, Back, Abs, Legs.
 */

export const UNIVERSAL_MUSCLE_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. BICEPS
  // ═══════════════════════════════════════════════════════════════════════════
  Biceps: {
    id: 'Biceps',
    name: 'Biceps',
    displayName: 'Biceps & Upper Arm Flexors',
    anatomicalName: 'Biceps Brachii, Brachialis & Coracobrachialis',
    defaultView: 'front',
    overviewDescription:
      'The anterior upper arm musculature responsible for elbow flexion, forearm supination (turning the palm upward), and shoulder stabilization.',
    cameraTarget: { x: 0.0, y: 7.2, z: 0.5 },
    cameraPosition: { x: 0.0, y: 7.2, z: 24.0 },
    regions: [
      {
        id: 'Long Head',
        name: 'Long Head',
        subdivision: 'Long Head',
        color: '#06b6d4', // Cyan
        glowColor: '#0891b2',
        anatomicalHead: 'Caput Longum (Outer Bicep Peak)',
        description: 'Runs along the outer arm, creating the tall peak when flexing.',
        meshKeywords: ['long head of left biceps brachii', 'long head of right biceps brachii'],
        anchorHint: { x: 2.8, y: 7.6, z: 0.6 },
        defaultOffset: { x: 4.8, y: 1.8, z: 0.4 },
        exercises: [
          {
            id: 'incline-dumbbell-curl',
            name: 'Incline Dumbbell Curl',
            targetRegion: 'Long Head',
            primaryMuscles: ['Long Head of Biceps Brachii'],
            secondaryMuscles: ['Brachialis', 'Forearm Flexors'],
            equipment: 'Incline Bench (45°-60°) & Dumbbells',
            difficulty: 'Intermediate',
            instructions: [
              'Lie back on an incline bench with dumbbells hanging straight down.',
              'Curl weights while keeping elbows pinned behind the torso for maximum stretch on the long head.',
              'Squeeze at the top with palms facing up, then lower under slow control.'
            ]
          },
          {
            id: 'close-grip-barbell-curl',
            name: 'Close-Grip Barbell Curl',
            targetRegion: 'Long Head',
            primaryMuscles: ['Long Head of Biceps Brachii'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Barbell or EZ-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Grip the bar slightly narrower than shoulder width.',
              'Keep elbows tucked tightly at your ribs.',
              'Curl the bar upward toward upper chest and squeeze peak contraction.'
            ]
          }
        ]
      },
      {
        id: 'Short Head',
        name: 'Short Head',
        subdivision: 'Short Head',
        color: '#ec4899', // Pink
        glowColor: '#db2777',
        anatomicalHead: 'Caput Breve (Inner Bicep Thickness)',
        description: 'Runs along the inner arm, giving width and mass when viewed from the front.',
        meshKeywords: ['short head of left biceps brachii', 'short head of right biceps brachii'],
        anchorHint: { x: 2.3, y: 7.2, z: 0.8 },
        defaultOffset: { x: 4.8, y: 0.0, z: 0.4 },
        exercises: [
          {
            id: 'wide-grip-ez-bar-curl',
            name: 'Wide-Grip EZ-Bar Curl',
            targetRegion: 'Short Head',
            primaryMuscles: ['Short Head of Biceps Brachii'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'EZ-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Take a wide grip on the outer bends of the EZ-bar.',
              'Keep upper arms stationary and curl upward.',
              'Focus on driving through the pinkies to emphasize inner bicep thickness.'
            ]
          },
          {
            id: 'preacher-curl',
            name: 'Preacher Bench Curl',
            targetRegion: 'Short Head',
            primaryMuscles: ['Short Head of Biceps Brachii'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Preacher Bench & Dumbbell / Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Rest arms flat against the preacher pad with armpits tucked over the top.',
              'Curl the weight up without letting elbows lift off the pad.',
              'Lower slowly to full arm extension before initiating next repetition.'
            ]
          }
        ]
      },
      {
        id: 'Brachialis',
        name: 'Brachialis',
        subdivision: 'Brachialis',
        color: '#f59e0b', // Amber
        glowColor: '#d97706',
        anatomicalHead: 'Brachialis & Coracobrachialis (Deep Arm Flexor)',
        description: 'Lies beneath the biceps, pushing the bicep upward and adding lower arm thickness.',
        meshKeywords: ['brachialis', 'coracobrachialis'],
        anchorHint: { x: 2.6, y: 6.4, z: 0.3 },
        defaultOffset: { x: 4.8, y: -1.8, z: 0.4 },
        exercises: [
          {
            id: 'dumbbell-hammer-curl',
            name: 'Standing Hammer Curl',
            targetRegion: 'Brachialis',
            primaryMuscles: ['Brachialis', 'Brachioradialis'],
            secondaryMuscles: ['Biceps Brachii'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Hold dumbbells with palms facing each other (neutral grip).',
              'Curl weights up keeping wrists locked in neutral position.',
              'Squeeze firmly at the top to target the brachialis muscle.'
            ]
          },
          {
            id: 'rope-cable-hammer-curl',
            name: 'Rope Cable Hammer Curl',
            targetRegion: 'Brachialis',
            primaryMuscles: ['Brachialis', 'Brachioradialis'],
            secondaryMuscles: ['Long Head Biceps'],
            equipment: 'Cable Machine & Rope Attachment',
            difficulty: 'Beginner',
            instructions: [
              'Attach rope to low cable pulley.',
              'Maintain neutral grip and curl upward, flaring rope ends outward slightly at peak.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CHEST
  // ═══════════════════════════════════════════════════════════════════════════
  Chest: {
    id: 'Chest',
    name: 'Chest',
    displayName: 'Chest (Pectorals)',
    anatomicalName: 'Pectoralis Major & Pectoralis Minor',
    defaultView: 'front',
    overviewDescription:
      'The anterior chest wall consists of upper clavicular, middle sternocostal, and lower abdominal pectoral heads responsible for pushing and arm adduction.',
    cameraTarget: { x: 0.0, y: 7.6, z: 0.8 },
    cameraPosition: { x: 0.0, y: 7.6, z: 24.5 },
    regions: [
      {
        id: 'Upper Chest',
        name: 'Upper Chest',
        subdivision: 'Upper Chest',
        color: '#ef4444', // Red
        glowColor: '#dc2626',
        anatomicalHead: 'Clavicular Head (Pectoralis Major)',
        description: 'Fibers originating along the collarbone, driving upward pushing and shoulder flexion.',
        meshKeywords: ['clavicular part of left pectoralis major', 'clavicular part of right pectoralis major', 'subclavius', 'pectoralis minor'],
        anchorHint: { x: 1.8, y: 10.3, z: 2.2 },
        defaultOffset: { x: 5.2, y: 2.2, z: 0.6 },
        exercises: [
          {
            id: 'incline-dumbbell-bench-press',
            name: 'Incline Dumbbell Bench Press',
            targetRegion: 'Upper Chest',
            primaryMuscles: ['Clavicular Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
            equipment: 'Incline Bench (30°) & Dumbbells',
            difficulty: 'Intermediate',
            modelUrl: '/exercises/incline_dumbbell_press.glb',
            has3DAnimation: true,
            instructions: [
              'Set bench to 30 degrees and plant feet flat on the floor.',
              'Lower dumbbells with a 3-second eccentric tempo down to upper chest level.',
              'Drive upward for 2 seconds in a converging arc without locking elbows.',
              'Hold peak contraction at the top for 1 second.'
            ]
          },
          {
            id: 'incline-smith-machine-press',
            name: 'Incline Smith Machine Press',
            targetRegion: 'Upper Chest',
            primaryMuscles: ['Clavicular Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
            equipment: 'Smith Machine & Incline Bench (30°)',
            difficulty: 'Beginner',
            instructions: [
              'Position the bench so the bar descends directly across the collarbone.',
              'Lower the bar slowly under guided control to touch upper chest lightly.',
              'Press smoothly upward focusing exclusively on clavicular contraction.'
            ]
          },
          {
            id: 'low-to-high-cable-fly',
            name: 'Low-to-High Cable Fly',
            targetRegion: 'Upper Chest',
            primaryMuscles: ['Clavicular Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoids', 'Coracobrachialis'],
            equipment: 'Dual Cable Pulley Station & D-Handles',
            difficulty: 'Intermediate',
            instructions: [
              'Set pulleys to the lowest notch with palms facing forward and upward.',
              'Step forward with staggered stance and brace core.',
              'Scoop handles upward and inward in an arc toward eye level, squeezing upper pecs at peak contraction.'
            ]
          }
        ]
      },
      {
        id: 'Middle Chest',
        name: 'Middle Chest',
        subdivision: 'Middle Chest',
        color: '#3b82f6', // Blue
        glowColor: '#2563eb',
        anatomicalHead: 'Sternocostal Head (Pectoralis Major)',
        description: 'Main pectoral body originating along breastbone, responsible for horizontal pushing power.',
        meshKeywords: ['sternocostal part of left pectoralis major', 'sternocostal part of right pectoralis major', 'sternocostal'],
        anchorHint: { x: 2.2, y: 8.4, z: 2.4 },
        defaultOffset: { x: 5.6, y: 0.0, z: 0.5 },
        exercises: [
          {
            id: 'flat-barbell-bench-press',
            name: 'Flat Barbell Bench Press',
            targetRegion: 'Middle Chest',
            primaryMuscles: ['Sternocostal Pectoralis Major'],
            secondaryMuscles: ['Triceps', 'Front Delts'],
            equipment: 'Flat Bench & Barbell',
            difficulty: 'Beginner',
            instructions: [
              'Lie on flat bench with shoulder blades retracted.',
              'Lower bar smoothly to mid-chest/nipple line.',
              'Press bar explosively upward in an arc.'
            ]
          },
          {
            id: 'flat-dumbbell-press',
            name: 'Flat Dumbbell Press',
            targetRegion: 'Middle Chest',
            primaryMuscles: ['Sternocostal Pectoralis Major'],
            secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
            equipment: 'Flat Bench & Dumbbells',
            difficulty: 'Intermediate',
            instructions: [
              'Lie flat on bench holding dumbbells with overhand grip at chest height.',
              'Press dumbbells upward until arms are extended above chest.',
              'Lower slowly to stretch the pectoral fibers horizontally.'
            ]
          },
          {
            id: 'pec-deck-fly',
            name: 'Pec Deck Machine Fly',
            targetRegion: 'Middle Chest',
            primaryMuscles: ['Sternocostal Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoids'],
            equipment: 'Pec Deck Machine',
            difficulty: 'Beginner',
            instructions: [
              'Adjust seat height so handles align with mid-chest level.',
              'Keep elbows slightly bent and sweep arms forward in a hugging arc.',
              'Squeeze sternal pecs firmly together at the center for 1 second.'
            ]
          }
        ]
      },
      {
        id: 'Lower Chest',
        name: 'Lower Chest',
        subdivision: 'Lower Chest',
        color: '#f97316', // Orange
        glowColor: '#ea580c',
        anatomicalHead: 'Abdominal Head & Serratus Anterior',
        description: 'Lower sweep along ribcage, responsible for downward pushing angles and pectoral underline.',
        meshKeywords: ['abdominal part of left pectoralis major', 'abdominal part of right pectoralis major', 'serratus anterior'],
        anchorHint: { x: 2.3, y: 6.6, z: 2.0 },
        defaultOffset: { x: 5.2, y: -2.2, z: 0.5 },
        exercises: [
          {
            id: 'decline-barbell-bench-press',
            name: 'Decline Barbell Bench Press',
            targetRegion: 'Lower Chest',
            primaryMuscles: ['Abdominal Pectoralis Major'],
            secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids'],
            equipment: 'Decline Bench & Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Secure legs in the decline bench pads and lie back.',
              'Unrack barbell and lower under control to lower pectoral sweep.',
              'Drive the weight upward in a smooth, straight bar path.'
            ]
          },
          {
            id: 'high-to-low-cable-fly',
            name: 'High-to-Low Cable Fly',
            targetRegion: 'Lower Chest',
            primaryMuscles: ['Abdominal Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoids', 'Pectoralis Minor'],
            equipment: 'Dual Cable Station & D-Handles',
            difficulty: 'Intermediate',
            instructions: [
              'Set pulleys above head height and hold handles.',
              'Step slightly forward, maintaining forward torso lean.',
              'Bring handles down and together across the lower abdomen, squeezing lower chest.'
            ]
          },
          {
            id: 'chest-dips',
            name: 'Chest Dips (Forward Lean)',
            targetRegion: 'Lower Chest',
            primaryMuscles: ['Abdominal Pectoralis Major'],
            secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
            equipment: 'Parallel Dip Bars',
            difficulty: 'Intermediate',
            instructions: [
              'Grip parallel bars and lean torso forward 30 degrees.',
              'Lower until upper arms are parallel with the floor.',
              'Press back up through your palms, emphasizing chest squeeze.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. TRICEPS
  // ═══════════════════════════════════════════════════════════════════════════
  Triceps: {
    id: 'Triceps',
    name: 'Triceps',
    displayName: 'Triceps Brachii',
    anatomicalName: 'Triceps Brachii (Lateral, Long & Medial Heads)',
    defaultView: 'back',
    overviewDescription:
      'The three-headed posterior upper arm muscle group responsible for elbow extension and shoulder extension, comprising two-thirds of total arm mass.',
    cameraTarget: { x: 0.0, y: 7.2, z: -0.5 },
    cameraPosition: { x: 0.0, y: 7.2, z: -24.0 },
    regions: [
      {
        id: 'Lateral Head',
        name: 'Lateral Head',
        subdivision: 'Lateral Head',
        color: '#8b5cf6', // Purple
        glowColor: '#7c3aed',
        anatomicalHead: 'Caput Laterale (Outer Horseshoe Head)',
        description: 'Outer head creating the prominent horseshoe curvature on the side of the arm.',
        meshKeywords: ['lateral head of left triceps brachii', 'lateral head of right triceps brachii', 'lateral head'],
        anchorHint: { x: 2.8, y: 7.4, z: -0.6 },
        defaultOffset: { x: 4.8, y: 1.8, z: -0.4 },
        exercises: [
          {
            id: 'rope-pushdown',
            name: 'Rope Triceps Pushdown',
            targetRegion: 'Lateral Head',
            primaryMuscles: ['Lateral Head Triceps'],
            secondaryMuscles: ['Medial Head Triceps'],
            equipment: 'Cable Machine & Rope',
            difficulty: 'Beginner',
            instructions: [
              'Pin elbows to sides and push rope down.',
              'Spread rope handles apart at bottom lockout for maximum lateral head contraction.'
            ]
          }
        ]
      },
      {
        id: 'Long Head',
        name: 'Long Head',
        subdivision: 'Long Head',
        color: '#3b82f6', // Blue
        glowColor: '#2563eb',
        anatomicalHead: 'Caput Longum (Posterior Inner Mass)',
        description: 'Largest triceps head crossing the shoulder joint, responsible for arm mass and overhead power.',
        meshKeywords: ['long head of left triceps brachii', 'long head of right triceps brachii'],
        anchorHint: { x: 2.2, y: 7.6, z: -0.8 },
        defaultOffset: { x: 4.8, y: 0.0, z: -0.4 },
        exercises: [
          {
            id: 'overhead-triceps-extension',
            name: 'Overhead Dumbbell Triceps Extension',
            targetRegion: 'Long Head',
            primaryMuscles: ['Long Head Triceps'],
            secondaryMuscles: ['Lateral Head Triceps'],
            equipment: 'Dumbbell & Bench',
            difficulty: 'Intermediate',
            instructions: [
              'Hold dumbbell overhead with both hands cup-gripping the plate.',
              'Lower weight behind head keeping elbows pointed forward.',
              'Extend arms fully overhead to contract the long head.'
            ]
          }
        ]
      },
      {
        id: 'Medial Head',
        name: 'Medial Head',
        subdivision: 'Medial Head',
        color: '#f59e0b', // Amber
        glowColor: '#d97706',
        anatomicalHead: 'Caput Mediale & Anconeus (Deep Elbow Stabilizer)',
        description: 'Deep head active throughout all elbow extension angles, stabilizing the elbow joint.',
        meshKeywords: ['medial head of left triceps brachii', 'medial head of right triceps brachii', 'medial head', 'anconeus'],
        anchorHint: { x: 2.4, y: 6.2, z: -0.5 },
        defaultOffset: { x: 4.8, y: -1.8, z: -0.4 },
        exercises: [
          {
            id: 'reverse-grip-pushdown',
            name: 'Reverse-Grip Triceps Pushdown',
            targetRegion: 'Medial Head',
            primaryMuscles: ['Medial Head Triceps'],
            secondaryMuscles: ['Anconeus'],
            equipment: 'Cable & Straight Bar',
            difficulty: 'Intermediate',
            instructions: [
              'Grip bar with underhand palms-up grip.',
              'Push down toward thighs focusing on deep medial elbow lockout.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. SHOULDERS
  // ═══════════════════════════════════════════════════════════════════════════
  Shoulders: {
    id: 'Shoulders',
    name: 'Shoulders',
    displayName: 'Shoulders (Deltoids)',
    anatomicalName: 'Deltoideus (Anterior, Lateral & Posterior Parts)',
    defaultView: 'front',
    overviewDescription:
      'The 3-headed muscular cap of the shoulder joint responsible for overhead pressing, arm raising, and 360-degree shoulder mobility.',
    cameraTarget: { x: 0.0, y: 8.2, z: 0.2 },
    cameraPosition: { x: 0.0, y: 8.2, z: 24.5 },
    regions: [
      {
        id: 'Front Delt',
        name: 'Front Delt',
        subdivision: 'Front Delt',
        color: '#f59e0b', // Amber
        glowColor: '#d97706',
        anatomicalHead: 'Clavicular Part (Anterior Deltoid)',
        description: 'Front head driving overhead pressing and forward arm elevation.',
        meshKeywords: ['clavicular part of left deltoid', 'clavicular part of right deltoid'],
        anchorHint: { x: 3.2, y: 9.3, z: 0.8 },
        defaultOffset: { x: 5.2, y: 1.8, z: 0.5 },
        exercises: [
          {
            id: 'overhead-barbell-press',
            name: 'Overhead Barbell Military Press',
            targetRegion: 'Front Delt',
            primaryMuscles: ['Anterior Deltoid'],
            secondaryMuscles: ['Triceps', 'Upper Chest'],
            equipment: 'Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Press barbell from collarbone straight overhead.',
              'Lock out overhead with bar centered over mid-foot.'
            ]
          }
        ]
      },
      {
        id: 'Side Delt',
        name: 'Side Delt',
        subdivision: 'Side Delt',
        color: '#10b981', // Emerald
        glowColor: '#059669',
        anatomicalHead: 'Acromial Part (Lateral Deltoid)',
        description: 'Middle head responsible for shoulder width and V-taper silhouette.',
        meshKeywords: ['acromial part of left deltoid', 'acromial part of right deltoid'],
        anchorHint: { x: 3.8, y: 9.1, z: 0.0 },
        defaultOffset: { x: 5.6, y: 0.0, z: 0.5 },
        exercises: [
          {
            id: 'dumbbell-lateral-raise',
            name: 'Dumbbell Lateral Raise',
            targetRegion: 'Side Delt',
            primaryMuscles: ['Lateral Deltoid'],
            secondaryMuscles: ['Trapezius'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Raise dumbbells out to sides until parallel with floor.',
              'Lead with elbows slightly higher than wrists.'
            ]
          }
        ]
      },
      {
        id: 'Rear Delt',
        name: 'Rear Delt',
        subdivision: 'Rear Delt',
        color: '#8b5cf6', // Purple
        glowColor: '#7c3aed',
        anatomicalHead: 'Spinal Part (Posterior Deltoid)',
        description: 'Posterior head pulling arms backward, crucial for posture and shoulder joint balance.',
        meshKeywords: ['spinal part of left deltoid', 'spinal part of right deltoid'],
        anchorHint: { x: 3.2, y: 9.1, z: -0.8 },
        defaultOffset: { x: 5.2, y: -1.8, z: -0.4 },
        exercises: [
          {
            id: 'face-pull',
            name: 'Cable Face Pull',
            targetRegion: 'Rear Delt',
            primaryMuscles: ['Posterior Deltoid', 'Rotator Cuff'],
            secondaryMuscles: ['Rhomboids', 'Mid Traps'],
            equipment: 'Cable Machine & Rope',
            difficulty: 'Beginner',
            instructions: [
              'Pull rope toward eye level while externally rotating shoulders.',
              'Squeeze rear deltoids firmly at the contraction point.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. BACK
  // ═══════════════════════════════════════════════════════════════════════════
  Back: {
    id: 'Back',
    name: 'Back',
    displayName: 'Back Musculature',
    anatomicalName: 'Trapezius, Latissimus Dorsi, Rhomboids & Erector Spinae',
    defaultView: 'back',
    overviewDescription:
      'The massive posterior chain comprising upper traps, mid-back stabilizers, wide latissimus wings, and lower back spinal erects.',
    cameraTarget: { x: 0.0, y: 6.2, z: -0.8 },
    cameraPosition: { x: 0.0, y: 6.2, z: -27.5 },
    regions: [
      {
        id: 'Upper Back',
        name: 'Upper Back',
        subdivision: 'Upper Back',
        color: '#ef4444', // Red
        glowColor: '#dc2626',
        anatomicalHead: 'Trapezius (Descending Part) & Neck Stabilizers',
        description: 'Upper trapezial fibers driving shoulder shrugs and neck stability.',
        meshKeywords: ['trapezius', 'levator scapulae', 'splenius'],
        anchorHint: { x: 1.8, y: 10.2, z: -1.2 },
        defaultOffset: { x: 5.2, y: 2.2, z: -0.5 },
        exercises: [
          {
            id: 'barbell-shrug',
            name: 'Barbell Shrug',
            targetRegion: 'Upper Back',
            primaryMuscles: ['Upper Trapezius'],
            secondaryMuscles: ['Levator Scapulae'],
            equipment: 'Barbell',
            difficulty: 'Beginner',
            instructions: [
              'Hold barbell at arm length and elevate shoulders directly toward ears.',
              'Hold peak contraction for 1 second before lowering.'
            ]
          }
        ]
      },
      {
        id: 'Middle Back',
        name: 'Middle Back',
        subdivision: 'Middle Back',
        color: '#f59e0b', // Amber
        glowColor: '#d97706',
        anatomicalHead: 'Rhomboids, Teres Major & Mid Traps',
        description: 'Center back muscles retracting shoulder blades together, providing back thickness.',
        meshKeywords: ['rhomboid', 'teres', 'infraspinatus', 'supraspinatus', 'subscapularis'],
        anchorHint: { x: 2.0, y: 8.0, z: -1.2 },
        defaultOffset: { x: 5.4, y: 0.8, z: -0.5 },
        exercises: [
          {
            id: 'bent-over-barbell-row',
            name: 'Bent-Over Barbell Row',
            targetRegion: 'Middle Back',
            primaryMuscles: ['Rhomboids', 'Mid Trapezius', 'Lats'],
            secondaryMuscles: ['Biceps', 'Lower Back'],
            equipment: 'Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Hinge at hips with flat back at 45 degrees.',
              'Pull bar to lower sternum driving elbows back.'
            ]
          }
        ]
      },
      {
        id: 'Lats',
        name: 'Lats',
        subdivision: 'Lats',
        color: '#3b82f6', // Blue
        glowColor: '#2563eb',
        anatomicalHead: 'Latissimus Dorsi (V-Taper Wings)',
        description: 'Largest back muscle sweeping under armpits, responsible for vertical pulling power.',
        meshKeywords: ['latissimus'],
        anchorHint: { x: 2.6, y: 6.2, z: -1.0 },
        defaultOffset: { x: 5.6, y: -0.6, z: -0.5 },
        exercises: [
          {
            id: 'pull-ups',
            name: 'Wide-Grip Pull-Up',
            targetRegion: 'Lats',
            primaryMuscles: ['Latissimus Dorsi'],
            secondaryMuscles: ['Biceps', 'Rhomboids'],
            equipment: 'Pull-Up Bar',
            difficulty: 'Intermediate',
            instructions: [
              'Hang from bar with wide overhand grip.',
              'Pull chest to bar by driving elbows down into ribs.'
            ]
          }
        ]
      },
      {
        id: 'Lower Back',
        name: 'Lower Back',
        subdivision: 'Lower Back',
        color: '#10b981', // Emerald
        glowColor: '#059669',
        anatomicalHead: 'Erector Spinae & Quadratus Lumborum',
        description: 'Deep spinal columns protecting the spine and resisting flexion under load.',
        meshKeywords: ['erector', 'iliocostalis', 'longissimus', 'spinalis', 'quadratus lumborum'],
        anchorHint: { x: 1.4, y: 4.4, z: -1.0 },
        defaultOffset: { x: 5.2, y: -2.2, z: -0.5 },
        exercises: [
          {
            id: 'hyperextensions',
            name: 'Back Hyperextensions',
            targetRegion: 'Lower Back',
            primaryMuscles: ['Erector Spinae'],
            secondaryMuscles: ['Glutes', 'Hamstrings'],
            equipment: '45° Hyperextension Bench',
            difficulty: 'Beginner',
            instructions: [
              'Lock ankles under pads and bend at hips.',
              'Extend back until torso aligns with legs without hyperextending.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ABS / CORE
  // ═══════════════════════════════════════════════════════════════════════════
  Abs: {
    id: 'Abs',
    name: 'Abs',
    displayName: 'Abs & Abdominal Wall',
    anatomicalName: 'Rectus Abdominis, Obliques & Transversus Abdominis',
    defaultView: 'front',
    overviewDescription:
      'The central core cylinder stabilizing the torso, transferring power between upper and lower body, and creating the athletic 6-pack column.',
    cameraTarget: { x: 0.0, y: 4.2, z: 1.2 },
    cameraPosition: { x: 0.0, y: 4.2, z: 24.0 },
    regions: [
      {
        id: 'Rectus Abdominis',
        name: 'Rectus Abdominis',
        subdivision: 'Rectus Abdominis',
        color: '#ef4444', // Red
        glowColor: '#dc2626',
        anatomicalHead: 'Rectus Abdominis (6-Pack Column)',
        description: 'Vertical anterior muscle band segmented into individual athletic abdominal packs.',
        meshKeywords: ['rectus abdominis'],
        anchorHint: { x: 0.8, y: 4.8, z: 1.8 },
        defaultOffset: { x: 5.2, y: 1.8, z: 0.5 },
        exercises: [
          {
            id: 'hanging-leg-raise',
            name: 'Hanging Leg Raise',
            targetRegion: 'Rectus Abdominis',
            primaryMuscles: ['Rectus Abdominis'],
            secondaryMuscles: ['Hip Flexors', 'Obliques'],
            equipment: 'Pull-Up Bar',
            difficulty: 'Intermediate',
            instructions: [
              'Hang from bar with core braced.',
              'Raise legs until parallel to floor, curling pelvis upward to engage lower abs.'
            ]
          }
        ]
      },
      {
        id: 'Obliques',
        name: 'Obliques',
        subdivision: 'Obliques',
        color: '#eab308', // Yellow
        glowColor: '#ca8a04',
        anatomicalHead: 'External & Internal Obliques (Flank / Waist)',
        description: 'Diagonal muscle sheets on waist sides controlling torso rotation and lateral flexion.',
        meshKeywords: ['oblique'],
        anchorHint: { x: 2.2, y: 4.0, z: 1.4 },
        defaultOffset: { x: 5.4, y: 0.0, z: 0.5 },
        exercises: [
          {
            id: 'cable-woodchopper',
            name: 'Cable Woodchopper',
            targetRegion: 'Obliques',
            primaryMuscles: ['External Oblique', 'Internal Oblique'],
            secondaryMuscles: ['Transversus Abdominis'],
            equipment: 'Cable Machine',
            difficulty: 'Intermediate',
            instructions: [
              'Rotate torso diagonally across body against cable resistance.',
              'Keep hips stable and initiate turn purely through the obliques.'
            ]
          }
        ]
      },
      {
        id: 'Deep Core',
        name: 'Deep Core',
        subdivision: 'Deep Core',
        color: '#14b8a6', // Teal
        glowColor: '#0d9488',
        anatomicalHead: 'Transversus Abdominis (Inner Weight Belt)',
        description: 'Deepest abdominal layer compressing internal organs and creating a flat, tight stomach.',
        meshKeywords: ['transversus abdominis'],
        anchorHint: { x: 1.4, y: 3.0, z: 1.2 },
        defaultOffset: { x: 5.2, y: -1.8, z: 0.5 },
        exercises: [
          {
            id: 'stomach-vacuum',
            name: 'Stomach Vacuum & Plank',
            targetRegion: 'Deep Core',
            primaryMuscles: ['Transversus Abdominis'],
            secondaryMuscles: ['Rectus Abdominis'],
            equipment: 'Bodyweight & Mat',
            difficulty: 'Beginner',
            instructions: [
              'Exhale all air completely and draw belly button tightly toward spine.',
              'Hold contraction for 20 seconds while maintaining shallow controlled breaths.'
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. LEGS
  // ═══════════════════════════════════════════════════════════════════════════
  Legs: {
    id: 'Legs',
    name: 'Legs',
    displayName: 'Legs & Lower Body',
    anatomicalName: 'Quadriceps, Hamstrings, Gluteals, Adductors & Calves',
    defaultView: 'front',
    overviewDescription:
      'The powerful lower body pillars driving squats, sprinting, jumping, and total athletic foundation.',
    cameraTarget: { x: 0.0, y: -6.0, z: 0.1 },
    cameraPosition: { x: 0.0, y: -6.0, z: 29.5 },
    regions: [
      {
        id: 'Quadriceps',
        name: 'Quadriceps',
        subdivision: 'Quadriceps',
        color: '#ef4444', // Red
        glowColor: '#dc2626',
        anatomicalHead: 'Quadriceps Femoris (Front Thigh)',
        description: 'Four-headed front thigh powerhouse driving knee extension and squat power.',
        meshKeywords: ['rectus femoris', 'vastus'],
        anchorHint: { x: 1.8, y: -2.8, z: 1.0 },
        defaultOffset: { x: 5.2, y: 2.2, z: 0.5 },
        exercises: [
          {
            id: 'barbell-back-squat',
            name: 'Barbell Back Squat',
            targetRegion: 'Quadriceps',
            primaryMuscles: ['Quadriceps Femoris'],
            secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
            equipment: 'Barbell & Squat Rack',
            difficulty: 'Intermediate',
            instructions: [
              'Rest bar across upper traps and descend until thighs are at least parallel to floor.',
              'Drive through mid-foot to stand back up.'
            ]
          }
        ]
      },
      {
        id: 'Hamstrings',
        name: 'Hamstrings',
        subdivision: 'Hamstrings',
        color: '#3b82f6', // Blue
        glowColor: '#2563eb',
        anatomicalHead: 'Biceps Femoris & Semi-muscles (Back Thigh)',
        description: 'Posterior thigh muscles driving knee flexion and hip extension during sprints.',
        meshKeywords: ['biceps femoris', 'semitendinosus', 'semimembranosus'],
        anchorHint: { x: 1.8, y: -3.5, z: -0.9 },
        defaultOffset: { x: 5.4, y: 1.1, z: -0.4 },
        exercises: [
          {
            id: 'romanian-deadlift',
            name: 'Romanian Deadlift (RDL)',
            targetRegion: 'Hamstrings',
            primaryMuscles: ['Hamstrings', 'Gluteus Maximus'],
            secondaryMuscles: ['Erector Spinae'],
            equipment: 'Barbell or Dumbbells',
            difficulty: 'Intermediate',
            instructions: [
              'Hinge at hips pushing glutes backward with soft knees.',
              'Lower weight along shins until hamstrings feel deep stretch, then thrust hips forward.'
            ]
          }
        ]
      },
      {
        id: 'Glutes',
        name: 'Glutes',
        subdivision: 'Glutes',
        color: '#a855f7', // Purple
        glowColor: '#9333ea',
        anatomicalHead: 'Gluteus Maximus, Medius & Minimus',
        description: 'Largest, most powerful muscles in the human body driving sprinting and hip extension.',
        meshKeywords: ['gluteus'],
        anchorHint: { x: 1.6, y: -0.8, z: -1.2 },
        defaultOffset: { x: 5.4, y: 0.0, z: -0.5 },
        exercises: [
          {
            id: 'barbell-hip-thrust',
            name: 'Barbell Hip Thrust',
            targetRegion: 'Glutes',
            primaryMuscles: ['Gluteus Maximus'],
            secondaryMuscles: ['Hamstrings', 'Adductors'],
            equipment: 'Bench & Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Sit on floor with upper back against bench and loaded barbell across hips.',
              'Drive through heels and squeeze glutes until hips align with shoulders.'
            ]
          }
        ]
      },
      {
        id: 'Adductors',
        name: 'Adductors',
        subdivision: 'Adductors',
        color: '#10b981', // Green
        glowColor: '#059669',
        anatomicalHead: 'Adductor Magnus, Longus & Gracilis (Inner Thigh)',
        description: 'Inner thigh complex pulling thighs together and stabilizing pelvis during single-leg actions.',
        meshKeywords: ['adductor', 'gracilis', 'pectineus'],
        anchorHint: { x: 0.8, y: -3.2, z: 0.4 },
        defaultOffset: { x: 5.2, y: -1.1, z: 0.4 },
        exercises: [
          {
            id: 'sumo-squat',
            name: 'Sumo Squat',
            targetRegion: 'Adductors',
            primaryMuscles: ['Adductors'],
            secondaryMuscles: ['Quadriceps', 'Glutes'],
            equipment: 'Dumbbell or Kettlebell',
            difficulty: 'Beginner',
            instructions: [
              'Stand with feet wide and toes angled outward 45 degrees.',
              'Lower into deep squat pushing knees outward over toes.'
            ]
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4', // Cyan
        glowColor: '#0891b2',
        anatomicalHead: 'Gastrocnemius & Soleus (Lower Leg)',
        description: 'Lower leg plantarflexors driving ankle extension, jumping, and sprint push-off.',
        meshKeywords: ['gastrocnemius', 'soleus'],
        anchorHint: { x: 1.4, y: -8.8, z: -0.5 },
        defaultOffset: { x: 5.2, y: -2.2, z: -0.4 },
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius', 'Soleus'],
            secondaryMuscles: ['Tibialis Posterior'],
            equipment: 'Calf Raise Machine or Step Block',
            difficulty: 'Beginner',
            instructions: [
              'Stand on balls of feet on elevated block.',
              'Lower heels deeply for full stretch, then press high onto tiptoes.'
            ]
          }
        ]
      }
    ]
  }
};

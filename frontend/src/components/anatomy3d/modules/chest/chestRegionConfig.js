/**
 * Chest Module Configuration
 * Pure data architecture for Chest anatomy: regions, mesh mappings, colors, and camera targets.
 */

export const CHEST_CONFIG = {
  id: 'Chest',
  name: 'Chest',
  displayName: 'Chest (Pectorals)',
  anatomicalName: 'Pectoralis Major, Pectoralis Minor & Subclavius',

  // Smooth camera zoom target when entering Chest exploration
  cameraTarget: { x: 0.0, y: 8.26, z: 0.82 },
  cameraPosition: { x: 0.0, y: 8.26, z: 12.0 },

  // The 3 distinct anatomical regions with fixed distinct colors
  regions: [
    {
      id: 'Upper Chest',
      name: 'Upper Chest',
      subdivision: 'Upper Chest',
      color: '#ef4444', // Red
      glowColor: '#dc2626',
      anatomicalHead: 'Clavicular Head (Pectoralis Major) & Minor',
      description: 'Upper fibers originating along the collarbone, responsible for upward pushing and shoulder flexion.',
      // Mesh matching keywords from BodyParts3D GLB
      meshKeywords: ['clavicular', 'subclavius', 'pectoralis minor'],
      // 3D positioning hints relative to chest center
      anchorHint: { x: 1.8, y: 10.3, z: 2.2 },
      defaultOffset: { x: 5.2, y: 2.2, z: 0.6 }
    },
    {
      id: 'Middle Chest',
      name: 'Middle Chest',
      subdivision: 'Middle Chest',
      color: '#3b82f6', // Blue
      glowColor: '#2563eb',
      anatomicalHead: 'Sternocostal Head (Pectoralis Major)',
      description: 'Main pectoral body originating along the breastbone, responsible for horizontal pushing and adduction.',
      meshKeywords: ['sternocostal'],
      anchorHint: { x: 2.2, y: 8.4, z: 2.4 },
      defaultOffset: { x: 5.6, y: 0.0, z: 0.5 }
    },
    {
      id: 'Lower Chest',
      name: 'Lower Chest',
      subdivision: 'Lower Chest',
      color: '#f97316', // Orange
      glowColor: '#ea580c',
      anatomicalHead: 'Abdominal Head (Pectoralis Major)',
      description: 'Lower sweep originating near the abdominal sheath, responsible for downward pushing and chest underline.',
      meshKeywords: ['abdominal', 'serratus'],
      anchorHint: { x: 2.3, y: 6.6, z: 2.0 },
      defaultOffset: { x: 5.2, y: -2.2, z: 0.5 }
    }
  ],

  // Curated exercises for each region
  exercises: {
    'Upper Chest': [
      {
        id: 'incline-barbell-bench-press',
        name: 'Incline Barbell Bench Press',
        targetRegion: 'Upper Chest',
        primaryMuscles: ['Clavicular Pectoralis Major'],
        secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
        equipment: 'Incline Bench (30°) & Barbell',
        difficulty: 'Beginner',
        instructions: [
          'Set bench to 30 degrees and lie back firmly.',
          'Lower the bar under control to upper chest below collarbone.',
          'Press up smoothly until arms are extended.'
        ],
        commonMistakes: ['Setting bench over 45 degrees.', 'Bouncing bar off clavicle.']
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        targetRegion: 'Upper Chest',
        primaryMuscles: ['Clavicular Pectoralis Major'],
        secondaryMuscles: ['Triceps'],
        equipment: 'Dumbbells & Incline Bench',
        difficulty: 'Beginner',
        instructions: [
          'Press dumbbells upward in a slight inward arc.',
          'Lower smoothly to feel a deep stretch in the upper chest.'
        ],
        commonMistakes: ['Flaring elbows 90 degrees outward.', 'Dropping weights fast.']
      }
    ],
    'Middle Chest': [
      {
        id: 'barbell-bench-press',
        name: 'Flat Barbell Bench Press',
        targetRegion: 'Middle Chest',
        primaryMuscles: ['Sternocostal Pectoralis Major'],
        secondaryMuscles: ['Triceps', 'Front Delts'],
        equipment: 'Flat Bench & Barbell',
        difficulty: 'Beginner',
        instructions: [
          'Lie flat, plant feet, squeeze shoulder blades together.',
          'Lower bar with control to mid-chest (nipple line).',
          'Press upward through chest to starting position.'
        ],
        commonMistakes: ['Flaring elbows 90 degrees.', 'Arching lower back off bench.']
      },
      {
        id: 'dumbbell-bench-press',
        name: 'Flat Dumbbell Bench Press',
        targetRegion: 'Middle Chest',
        primaryMuscles: ['Sternocostal Pectoralis Major'],
        secondaryMuscles: ['Triceps Brachii'],
        equipment: 'Dumbbells & Flat Bench',
        difficulty: 'Beginner',
        instructions: [
          'Lower dumbbells smoothly to chest level with elbows at 60 degrees.',
          'Press upward gently without clacking dumbbells together.'
        ],
        commonMistakes: ['Short range of motion at bottom.', 'Using body momentum.']
      }
    ],
    'Lower Chest': [
      {
        id: 'decline-barbell-press',
        name: 'Decline Barbell Bench Press',
        targetRegion: 'Lower Chest',
        primaryMuscles: ['Abdominal Pectoralis Major'],
        secondaryMuscles: ['Triceps'],
        equipment: 'Decline Bench & Barbell',
        difficulty: 'Intermediate',
        instructions: [
          'Secure shins under decline rollers.',
          'Lower bar smoothly to lower pectoral line below nipples.',
          'Press back up to full arm extension.'
        ],
        commonMistakes: ['Lowering bar too high toward neck.', 'Uncontrolled descent.']
      },
      {
        id: 'chest-dips',
        name: 'Parallel Bar Chest Dips',
        targetRegion: 'Lower Chest',
        primaryMuscles: ['Lower Pectoralis Major'],
        secondaryMuscles: ['Triceps', 'Front Delts'],
        equipment: 'Parallel Dip Bars',
        difficulty: 'Intermediate',
        instructions: [
          'Mount dip bars with a slight forward torso lean (20–30 degrees).',
          'Lower body until elbows reach 90 degrees.',
          'Press back up focusing on lower chest contraction.'
        ],
        commonMistakes: ['Staying completely upright.', 'Swinging legs.']
      }
    ]
  }
};

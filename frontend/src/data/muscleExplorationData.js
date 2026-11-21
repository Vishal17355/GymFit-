/**
 * GymFit: Interactive Human Muscle Learning System
 * Comprehensive configuration-driven data architecture for all 7 major muscle groups,
 * subdivisions, beginner-friendly learning guides, and curated exercises.
 */

export const MUSCLE_EXPLORATION_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CHEST
  // ═══════════════════════════════════════════════════════════════════════════
  Chest: {
    id: 'Chest',
    name: 'Chest',
    displayName: 'Chest (Pectorals)',
    anatomicalName: 'Pectoralis Major & Minor',
    defaultView: 'front',
    overviewDescription:
      'The anterior chest wall consists of the pectoralis major (with clavicular, sternocostal, and abdominal heads) and pectoralis minor, responsible for pushing movements and bringing arms across the torso.',
    cameraTarget: { x: 0.0, y: 7.6, z: 0.8 },
    cameraPosition: { x: 0.0, y: 7.6, z: 24.5 },
    regions: [
      {
        id: 'Upper Chest',
        name: 'Upper Chest',
        subdivision: 'Upper Chest',
        color: '#ef4444',
        glowColor: '#dc2626',
        labelOffset: { x: 5.2, y: 1.6, z: 0.5 },
        anatomicalHead: 'Clavicular Head (Pectoralis Major)',
        location: 'Upper third of the chest, originating along the medial half of the clavicle (collarbone) and attaching to the upper arm.',
        movement: 'Flexes the shoulder upward and adducts the arm diagonally across the body (like reaching up and across).',
        whyTrainIt: 'Creates a full, armor-plated look under the collarbone and prevents the common "sagging chest" aesthetic.',
        beginnerExplanation: 'Whenever you push something up and away from you at an incline angle, your upper chest fibers fire.',
        formConsiderations: 'Keep your bench incline between 30° and 45°. Anything steeper than 45° shifts load away from the chest directly into your front shoulders.',
        exercises: [
          {
            id: 'incline-barbell-bench-press',
            name: 'Incline Barbell Bench Press',
            targetRegion: 'Upper Chest',
            primaryMuscles: ['Clavicular Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
            equipment: 'Barbell & Incline Bench (30°)',
            difficulty: 'Beginner',
            instructions: [
              'Set bench angle to 30 degrees and lie back with feet flat on the floor.',
              'Grip the bar with hands slightly wider than shoulder-width.',
              'Lower the bar under control until it lightly touches your upper sternum below the collarbone.',
              'Press the bar upward in a controlled path until arms are extended without locking elbows.'
            ],
            commonMistakes: [
              'Setting the bench too steep (over 45° turns it into a shoulder press).',
              'Lowering the bar down to the stomach instead of upper chest.',
              'Bouncing the bar off the clavicle.'
            ],
            videoUrl: null
          },
          {
            id: 'incline-dumbbell-press',
            name: 'Incline Dumbbell Press',
            targetRegion: 'Upper Chest',
            primaryMuscles: ['Clavicular Pectoralis Major'],
            secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
            equipment: 'Dumbbells & Incline Bench',
            difficulty: 'Beginner',
            instructions: [
              'Sit on a 30° incline bench holding a pair of dumbbells at shoulder height.',
              'Press the weights up while keeping wrists aligned with elbows.',
              'Bring dumbbells close together at the top without banging them.',
              'Lower slowly to feel a deep stretch in the upper pectoral fibers.'
            ],
            commonMistakes: [
              'Flaring elbows out completely perpendicular to the body.',
              'Rushing the lowering phase and dropping weights quickly.',
              'Allowing dumbbells to drift too far forward.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Middle Chest',
        name: 'Middle Chest',
        subdivision: 'Middle Chest',
        color: '#3b82f6',
        glowColor: '#2563eb',
        labelOffset: { x: 5.6, y: 0.0, z: 0.5 },
        anatomicalHead: 'Sternocostal Head (Pectoralis Major)',
        location: 'Spans the middle chest, originating along the sternum (breastbone) and upper costal cartilages.',
        movement: 'Horizontal adduction—bringing the arms together in front of the body like wrapping someone in a bear hug.',
        whyTrainIt: 'Constitutes the bulk of chest mass; critical for overall pushing power and core upper-body density.',
        beginnerExplanation: 'This is the main "engine" of your chest. Whenever you push open a heavy door or do a classic push-up, your middle chest does the work.',
        formConsiderations: 'Pull and pin your shoulder blades (scapulae) down and back into the bench before unracking the weight to keep tension on the chest.',
        exercises: [
          {
            id: 'barbell-bench-press',
            name: 'Flat Barbell Bench Press',
            targetRegion: 'Middle Chest',
            primaryMuscles: ['Sternocostal Pectoralis Major'],
            secondaryMuscles: ['Triceps Brachii', 'Front Delts'],
            equipment: 'Barbell & Flat Bench',
            difficulty: 'Beginner',
            instructions: [
              'Lie flat on the bench with eyes directly under the racked bar.',
              'Plant feet firmly into the floor and squeeze shoulder blades together.',
              'Lower the bar under control to mid-chest (nipple line).',
              'Press upward through the chest back to the starting position.'
            ],
            commonMistakes: [
              'Flaring elbows at 90 degrees (tuck elbows to roughly 45–75 degrees).',
              'Lifting buttocks off the bench during the press.',
              'Failing to maintain shoulder blade retraction.'
            ],
            videoUrl: null
          },
          {
            id: 'dumbbell-bench-press',
            name: 'Flat Dumbbell Bench Press',
            targetRegion: 'Middle Chest',
            primaryMuscles: ['Sternocostal Pectoralis Major'],
            secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
            equipment: 'Dumbbells & Flat Bench',
            difficulty: 'Beginner',
            instructions: [
              'Lie back on a flat bench with dumbbells held over chest.',
              'Lower dumbbells smoothly to chest level with elbows at roughly 60 degrees.',
              'Press dumbbells upward in a gentle inward arc without clacking weights.',
              'Pause for a second at the top to squeeze the pectoral muscles.'
            ],
            commonMistakes: [
              'Allowing forearms to tip inward or outward during the lift.',
              'Using momentum to kick weights up.',
              'Cutting the range of motion short at the bottom.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Lower Chest',
        name: 'Lower Chest',
        subdivision: 'Lower Chest',
        color: '#f97316',
        glowColor: '#ea580c',
        labelOffset: { x: 5.2, y: -1.6, z: 0.5 },
        anatomicalHead: 'Abdominal Head (Pectoralis Major)',
        location: 'The lower border of the pectorals, originating near the rectus abdominis sheath and lower ribs.',
        movement: 'Depresses the shoulder girdle and adducts the arm downward toward the hips.',
        whyTrainIt: 'Sharpens the lower chest underline, giving distinct separation between the pectorals and upper abdominals.',
        beginnerExplanation: 'When you push down onto the armrests of a chair to stand up, your lower chest is the prime muscle contracting.',
        formConsiderations: 'Lean your torso forward slightly on dips (around 20–30°) to keep the work in the lower chest rather than the triceps.',
        exercises: [
          {
            id: 'decline-barbell-bench-press',
            name: 'Decline Barbell Bench Press',
            targetRegion: 'Lower Chest',
            primaryMuscles: ['Abdominal Pectoralis Major'],
            secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
            equipment: 'Decline Bench & Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Secure your shins beneath the leg rollers on a decline bench.',
              'Grip bar slightly wider than shoulder-width and unrack carefully.',
              'Lower bar smoothly to the lower pectoral line right below the nipples.',
              'Press back up until arms are straight.'
            ],
            commonMistakes: [
              'Lowering bar too high on the neck.',
              'Dropping the weight too fast due to the inverted head position.',
              'Losing leg anchor stability.'
            ],
            videoUrl: null
          },
          {
            id: 'chest-dips',
            name: 'Parallel Bar Chest Dips',
            targetRegion: 'Lower Chest',
            primaryMuscles: ['Lower Pectoralis Major'],
            secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids'],
            equipment: 'Parallel Dip Bars',
            difficulty: 'Intermediate',
            instructions: [
              'Mount dip bars and lock arms with a slight forward torso lean (20–30°).',
              'Bend elbows and lower your body until elbows reach roughly 90 degrees.',
              'Press upward through your palms, focusing on squeezing the lower chest.',
              'Maintain torso lean throughout the entire repetition.'
            ],
            commonMistakes: [
              'Staying completely upright (shifts tension primarily into triceps).',
              'Dropping too deep and over-stretching the front shoulder capsule.',
              'Swinging the legs to generate momentum.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. BACK
  // ═══════════════════════════════════════════════════════════════════════════
  Back: {
    id: 'Back',
    name: 'Back',
    displayName: 'Back (Dorsal Complex)',
    anatomicalName: 'Trapezius, Latissimus Dorsi, Rhomboids & Erector Spinae',
    defaultView: 'back',
    overviewDescription:
      'The back is the body\'s posterior kinetic chain, composed of the upper trapezius/rhomboids for scapular stability, the latissimus dorsi for pulling width, and the lower spinal erectors for spinal health.',
    cameraTarget: { x: 0.0, y: 6.2, z: -0.8 },
    cameraPosition: { x: 0.0, y: 6.2, z: -27.5 },
    regions: [
      {
        id: 'Upper Back',
        name: 'Upper Back',
        subdivision: 'Upper Back',
        color: '#ef4444',
        glowColor: '#dc2626',
        labelOffset: { x: 5.0, y: 1.8, z: -0.8 },
        anatomicalHead: 'Trapezius & Rhomboids',
        location: 'Extends from base of skull across top of shoulders and between shoulder blades.',
        movement: 'Elevates, retracts, and upwardly rotates the scapulae (pulling shoulder blades together).',
        whyTrainIt: 'Prevents rounded desk posture, supports heavy neck/head carriage, and builds thick upper back density.',
        beginnerExplanation: 'Think of the upper back as the anchor for your shoulders. Whenever you pull your shoulders back and sit up tall, your traps and rhomboids work.',
        formConsiderations: 'Avoid excessive neck nodding during shrugs. Keep head neutral and move shoulders vertically.',
        exercises: [
          {
            id: 'face-pulls',
            name: 'Cable Face Pulls',
            targetRegion: 'Upper Back',
            primaryMuscles: ['Rhomboids', 'Middle Trapezius', 'Rear Deltoids'],
            secondaryMuscles: ['Rotator Cuff (Infraspinatus)'],
            equipment: 'Cable Machine & Rope Attachment',
            difficulty: 'Beginner',
            instructions: [
              'Set cable pulley at eye height and grasp rope ends with thumbs pointing backward.',
              'Step back and pull rope toward forehead while flaring elbows high and wide.',
              'Rotate hands backward at the end of the pull to externally rotate shoulders.',
              'Hold squeeze for 1 second, then slowly return.'
            ],
            commonMistakes: [
              'Using excessive weight and leaning torso backward.',
              'Pulling down to the chin instead of up toward the eyes/forehead.'
            ],
            videoUrl: null
          },
          {
            id: 'barbell-shrugs',
            name: 'Barbell Shrugs',
            targetRegion: 'Upper Back',
            primaryMuscles: ['Upper Trapezius'],
            secondaryMuscles: ['Levator Scapulae', 'Forearms'],
            equipment: 'Barbell',
            difficulty: 'Beginner',
            instructions: [
              'Hold barbell with an overhand grip at mid-thigh.',
              'Elevate shoulders straight up toward ears in a vertical line.',
              'Hold peak contraction at the top for a two-count.',
              'Lower shoulders back down smoothly under control.'
            ],
            commonMistakes: [
              'Rolling shoulders in circular motions (damages rotator cuff joints).',
              'Bending elbows to pull the weight with arms.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Middle Back',
        name: 'Middle Back',
        subdivision: 'Middle Back',
        color: '#f59e0b',
        glowColor: '#d97706',
        labelOffset: { x: 5.2, y: 0.6, z: -0.8 },
        anatomicalHead: 'Rhomboid Major & Mid Trapezius',
        location: 'Located directly between the two shoulder blades along the thoracic spine.',
        movement: 'Strongly pinches and retracts the shoulder blades toward the midline of the spine.',
        whyTrainIt: 'Creates muscular depth and three-dimensional back thickness visible from the side profile.',
        beginnerExplanation: 'Imagine holding a pencil between your shoulder blades and squeezing it so tight it snaps in half.',
        formConsiderations: 'Initiate all rowing movements by retracting the shoulder blade first, then pulling with the elbow second.',
        exercises: [
          {
            id: 'seated-cable-row',
            name: 'Seated Cable Row',
            targetRegion: 'Middle Back',
            primaryMuscles: ['Rhomboids', 'Middle Trapezius'],
            secondaryMuscles: ['Latissimus Dorsi', 'Biceps'],
            equipment: 'Seated Cable Row Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit tall with knees slightly bent and feet firmly on footplates.',
              'Grasp handle, pull shoulders back, and row handle into the lower sternum.',
              'Squeeze shoulder blades firmly together at the contraction.',
              'Extend arms fully with controlled torso stability.'
            ],
            commonMistakes: [
              'Excessive swinging of the lower back backward and forward.',
              'Shrugging shoulders upward during the pull.'
            ],
            videoUrl: null
          },
          {
            id: 'chest-supported-dumbbell-row',
            name: 'Chest-Supported Incline Row',
            targetRegion: 'Middle Back',
            primaryMuscles: ['Middle Trapezius', 'Rhomboids'],
            secondaryMuscles: ['Rear Deltoids', 'Biceps'],
            equipment: 'Incline Bench & Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Lie prone (face down) on an incline bench angled at 30–45 degrees.',
              'Hold dumbbells hanging straight down.',
              'Drive elbows up and back, squeezing shoulder blades together at the top.',
              'Lower weights slowly under complete control.'
            ],
            commonMistakes: [
              'Lifting chest off the pad to cheat momentum.',
              'Pulling with wrists instead of leading with elbows.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Latissimus Dorsi',
        name: 'Lats',
        subdivision: 'Lats',
        color: '#3b82f6',
        glowColor: '#2563eb',
        labelOffset: { x: -5.2, y: -0.5, z: -0.8 },
        anatomicalHead: 'Lats (Outer Wing Fibers)',
        location: 'Broad, wing-like muscle originating along the spine/pelvis and inserting into the front of the upper arm.',
        movement: 'Pulls the arms down from overhead (adduction) and back from the front (extension).',
        whyTrainIt: 'Creates the classic aesthetic "V-taper" waist-to-shoulder ratio and provides pulling power.',
        beginnerExplanation: 'Your lats give your back its "wings." When you do a pull-up or climb a tree, your lats pull your entire body up.',
        formConsiderations: 'Think of your hands as hooks; pull through your elbows to prevent biceps from stealing the workload.',
        exercises: [
          {
            id: 'lat-pulldowns',
            name: 'Wide-Grip Lat Pulldown',
            targetRegion: 'Latissimus Dorsi',
            primaryMuscles: ['Latissimus Dorsi'],
            secondaryMuscles: ['Biceps', 'Teres Major'],
            equipment: 'Lat Pulldown Cable Machine',
            difficulty: 'Beginner',
            instructions: [
              'Grip wide bar with overhand grip and secure thighs snugly under pads.',
              'Lean back roughly 10–15° with chest proud.',
              'Pull bar smoothly down to upper chest by driving elbows toward your back pockets.',
              'Slowly release the bar back up until lats are completely stretched.'
            ],
            commonMistakes: [
              'Pulling the bar behind the neck (dangerous for cervical spine).',
              'Swinging back horizontally using body momentum.'
            ],
            videoUrl: null
          },
          {
            id: 'bent-over-barbell-row',
            name: 'Bent-Over Barbell Row',
            targetRegion: 'Latissimus Dorsi',
            primaryMuscles: ['Latissimus Dorsi', 'Middle Back'],
            secondaryMuscles: ['Biceps', 'Spinal Erectors'],
            equipment: 'Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Hinge at hips with soft knees until torso is roughly 45° to the floor.',
              'Grip bar just outside knee width.',
              'Row bar toward your belly button, pulling through elbows.',
              'Lower bar smoothly to full arm extension without rounding spine.'
            ],
            commonMistakes: [
              'Rounding the lower back (destroys spinal alignment).',
              'Standing up too tall and turning it into an upright shrug.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Lower Back',
        name: 'Lower Back',
        subdivision: 'Lower Back',
        color: '#10b981',
        glowColor: '#059669',
        labelOffset: { x: 4.8, y: -1.5, z: -0.8 },
        anatomicalHead: 'Erector Spinae & Quadratus Lumborum',
        location: 'Runs vertically along the lumbar spine from the sacrum/pelvis up the spinal column.',
        movement: 'Extends and stabilizes the spine, resisting forward buckling during upright postures.',
        whyTrainIt: 'Protects the lumbar spine from herniation, supports upright posture, and acts as the structural foundation for heavy lifting.',
        beginnerExplanation: 'Your lower back acts as the body\'s structural steel columns. Whenever you bend down to pick up a package and stand back up, your lower back erectors keep your spine solid.',
        formConsiderations: 'Never round your lower back under load. Always brace your core like preparing to take a punch.',
        exercises: [
          {
            id: 'back-hyperextensions',
            name: '45° Back Hyperextension',
            targetRegion: 'Lower Back',
            primaryMuscles: ['Erector Spinae'],
            secondaryMuscles: ['Glutes', 'Hamstrings'],
            equipment: 'Hyperextension Bench',
            difficulty: 'Beginner',
            instructions: [
              'Position hips just over the top pad so hips can hinge freely.',
              'Cross arms over chest and lower torso forward until you feel a hamstring stretch.',
              'Contract lower back, glutes, and hamstrings to raise torso until aligned with legs.',
              'Pause for 1 second without hyper-arching backwards.'
            ],
            commonMistakes: [
              'Hyper-extending backward like a scorpion at the top.',
              'Jerking torso violently instead of moving smoothly.'
            ],
            videoUrl: null
          },
          {
            id: 'romanian-deadlift-back',
            name: 'Barbell Romanian Deadlift (RDL)',
            targetRegion: 'Lower Back',
            primaryMuscles: ['Erector Spinae (Isometric)', 'Hamstrings'],
            secondaryMuscles: ['Glutes', 'Lats'],
            equipment: 'Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Stand tall with feet hip-width apart and grip bar at thigh level.',
              'Push hips back while keeping spine locked in a neutral flat posture.',
              'Lower bar along thighs until you feel maximum hamstring/lower back tension.',
              'Drive hips forward to return to standing.'
            ],
            commonMistakes: [
              'Allowing the barbell to drift away from thighs.',
              'Rounding the lumbar curve during the descent.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SHOULDERS
  // ═══════════════════════════════════════════════════════════════════════════
  Shoulders: {
    id: 'Shoulders',
    name: 'Shoulders',
    displayName: 'Shoulders (Deltoids)',
    anatomicalName: 'Deltoid Muscle (Anterior, Lateral & Posterior)',
    defaultView: 'front',
    overviewDescription:
      'The deltoids form a rounded muscular cap over the glenohumeral joint with three distinct heads allowing 360-degree shoulder articulation in all planes.',
    cameraTarget: { x: 0.0, y: 8.2, z: 0.2 },
    cameraPosition: { x: 0.0, y: 8.2, z: 24.5 },
    regions: [
      {
        id: 'Front Delt',
        name: 'Front Delt',
        subdivision: 'Front Delt',
        color: '#f59e0b',
        glowColor: '#d97706',
        labelOffset: { x: -5.0, y: 1.2, z: 0.5 },
        anatomicalHead: 'Clavicular Part (Anterior Deltoid)',
        location: 'The front curvature of the shoulder attaching directly to the outer clavicle.',
        movement: 'Raises the arm forward and upward in front of the body (shoulder flexion).',
        whyTrainIt: 'Contributes to front-facing shoulder fullness and assists in all overhead pushing.',
        beginnerExplanation: 'Every time you reach forward to grab something from a high shelf or push something away from your body, your front delts do the lifting.',
        formConsiderations: 'Because front delts already work heavily during chest pressing, prioritize controlled form over excessive weights on front raises.',
        exercises: [
          {
            id: 'overhead-barbell-press',
            name: 'Overhead Barbell Military Press',
            targetRegion: 'Front Deltoid',
            primaryMuscles: ['Anterior Deltoid'],
            secondaryMuscles: ['Triceps Brachii', 'Upper Chest'],
            equipment: 'Barbell',
            difficulty: 'Beginner',
            instructions: [
              'Stand tall with barbell resting at collarbone level with forearms vertical.',
              'Brace glutes and abs, press bar straight up past face.',
              'Lock arms out directly over crown of head.',
              'Lower bar under control back to clavicle.'
            ],
            commonMistakes: [
              'Arching lower back excessively to turn it into an incline press.',
              'Pressing bar too far forward instead of straight upward.'
            ],
            videoUrl: null
          },
          {
            id: 'dumbbell-front-raise',
            name: 'Standing Dumbbell Front Raise',
            targetRegion: 'Front Deltoid',
            primaryMuscles: ['Anterior Deltoid'],
            secondaryMuscles: ['Upper Chest'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Hold dumbbells in front of thighs with palms facing you.',
              'Raise weights straight in front of you until parallel to the floor.',
              'Pause for a moment at shoulder height.',
              'Lower slowly without swinging your torso.'
            ],
            commonMistakes: [
              'Using body momentum and rocking back and forth.',
              'Lifting weights higher than eye level.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Side Delt',
        name: 'Side Delt',
        subdivision: 'Side Delt',
        color: '#10b981',
        glowColor: '#059669',
        labelOffset: { x: 5.2, y: 0.8, z: 0.0 },
        anatomicalHead: 'Acromial Part (Lateral Deltoid)',
        location: 'Outer middle crest of the shoulder attaching to the acromion process.',
        movement: 'Raises the arm out directly to the side away from the body (shoulder abduction).',
        whyTrainIt: 'The single most important muscle for creating the coveted "boulder shoulders" and visual upper-body width.',
        beginnerExplanation: 'Think of flapping your arms like wings; the side delt is what pulls your arm outward away from your ribs.',
        formConsiderations: 'Lead with your elbows, not your hands. Pour out water like holding a pitcher to keep lateral fibers firing.',
        exercises: [
          {
            id: 'dumbbell-lateral-raise',
            name: 'Dumbbell Lateral Raise',
            targetRegion: 'Side Deltoid',
            primaryMuscles: ['Lateral Deltoid'],
            secondaryMuscles: ['Supraspinatus', 'Trapezius'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Stand with slight forward torso tilt holding dumbbells at sides.',
              'Raise dumbbells out to the sides with elbows slightly bent.',
              'Stop when elbows reach shoulder height.',
              'Lower slowly over 2–3 seconds.'
            ],
            commonMistakes: [
              'Using weights that are too heavy and shrugging traps.',
              'Swinging torso to launch weights up.'
            ],
            videoUrl: null
          },
          {
            id: 'cable-lateral-raise',
            name: 'Single-Arm Cable Lateral Raise',
            targetRegion: 'Side Deltoid',
            primaryMuscles: ['Lateral Deltoid'],
            secondaryMuscles: ['Supraspinatus'],
            equipment: 'Cable Machine & D-Handle',
            difficulty: 'Beginner',
            instructions: [
              'Set cable pulley at wrist height and hold handle with outside hand.',
              'Raise arm out to the side until parallel with floor.',
              'Experience smooth continuous tension across the entire sweep.',
              'Lower back slowly to starting position.'
            ],
            commonMistakes: [
              'Leaning excessively into the cable.',
              'Letting the weight stack slam at the bottom.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Rear Delt',
        name: 'Rear Delt',
        subdivision: 'Rear Delt',
        color: '#8b5cf6',
        glowColor: '#7c3aed',
        labelOffset: { x: 5.0, y: 0.4, z: -1.2 },
        anatomicalHead: 'Spinal Part (Posterior Deltoid)',
        location: 'The back third of the shoulder cap along the spine of the scapula.',
        movement: 'Draws the arm backward horizontally behind the body (horizontal shoulder extension).',
        whyTrainIt: 'Balances out heavy chest pressing, prevents hunched shoulders, and produces 3D complete shoulder roundness.',
        beginnerExplanation: 'When you hug someone and then open your arms wide backward, your rear delts are responsible for that backward opening motion.',
        formConsiderations: 'Keep elbows slightly soft and focus strictly on moving the upper arms back, minimizing middle back shrugging.',
        exercises: [
          {
            id: 'reverse-pec-deck-flyes',
            name: 'Reverse Pec Deck Flyes',
            targetRegion: 'Rear Deltoid',
            primaryMuscles: ['Posterior Deltoid'],
            secondaryMuscles: ['Infraspinatus', 'Rhomboids'],
            equipment: 'Pec Deck Machine (Reverse Position)',
            difficulty: 'Beginner',
            instructions: [
              'Sit facing the pad with chest flush and handles adjusted to shoulder level.',
              'Grip handles and drive arms backward in a wide horizontal arc.',
              'Squeeze rear shoulders firmly at the full extension point.',
              'Return smoothly without letting weights crash.'
            ],
            commonMistakes: [
              'Shrugging shoulders up toward ears.',
              'Bending elbows excessively and turning it into a row.'
            ],
            videoUrl: null
          },
          {
            id: 'bent-over-rear-delt-flyes',
            name: 'Bent-Over Dumbbell Rear Delt Fly',
            targetRegion: 'Rear Deltoid',
            primaryMuscles: ['Posterior Deltoid'],
            secondaryMuscles: ['Upper Back'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Hinge forward at hips until torso is roughly parallel to floor.',
              'Hold dumbbells hanging below chest with palms facing each other.',
              'Raise arms out to sides like wings until level with shoulders.',
              'Lower weights slowly under muscular control.'
            ],
            commonMistakes: [
              'Jerking torso upward to fling dumbbells.',
              'Using heavy weights that force back shrugging.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. ARMS
  // ═══════════════════════════════════════════════════════════════════════════
  Arms: {
    id: 'Arms',
    name: 'Arms',
    displayName: 'Arms (Biceps, Triceps & Forearms)',
    anatomicalName: 'Brachium & Antebrachium',
    defaultView: 'front',
    overviewDescription:
      'The upper extremities consisting of the anterior flexors (biceps brachii, brachialis), posterior extensors (triceps brachii), and the forearm grip musculature.',
    cameraTarget: { x: 0.0, y: 7.2, z: 0.5 },
    cameraPosition: { x: 0.0, y: 7.2, z: 24.0 },
    regions: [
      {
        id: 'Biceps',
        name: 'Biceps',
        subdivision: 'Long Head (Outer Head)',
        anatomicalHead: 'Biceps Brachii & Brachialis',
        location: 'Anterior upper arm between the shoulder joint and elbow crease.',
        movement: 'Flexes the elbow joint and supinates the forearm (turns palms upward).',
        whyTrainIt: 'Essential for pulling, climbing, carrying objects, and creating impressive upper-arm peaks.',
        beginnerExplanation: 'Whenever you bring your hands toward your face—like drinking a glass of water—your biceps contract.',
        formConsiderations: 'Keep elbows pinned to your sides. Do not let elbows drift forward or backward to cheat momentum.',
        exercises: [
          {
            id: 'standing-barbell-curl',
            name: 'Standing Barbell Bicep Curl',
            targetRegion: 'Biceps',
            primaryMuscles: ['Biceps Brachii'],
            secondaryMuscles: ['Brachialis', 'Forearm Flexors'],
            equipment: 'Barbell or EZ-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Stand tall holding barbell with an underhand grip at shoulder-width.',
              'Pin elbows against ribcage and curl bar up toward upper chest.',
              'Squeeze biceps hard at the peak for a full second.',
              'Lower bar slowly over 2–3 seconds to full extension.'
            ],
            commonMistakes: [
              'Swinging hips and leaning back to heave the bar.',
              'Letting elbows flare outward or forward.'
            ],
            videoUrl: null
          },
          {
            id: 'incline-dumbbell-curl',
            name: 'Incline Dumbbell Curl',
            targetRegion: 'Biceps',
            primaryMuscles: ['Biceps Long Head (Peak)'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Incline Bench & Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Sit back on a 45° incline bench holding dumbbells hanging down.',
              'Curl dumbbells upward while keeping upper arms pointed vertically down.',
              'Supinate wrists so pinkies point slightly inward at the top.',
              'Lower with a deep stretch at the bottom.'
            ],
            commonMistakes: [
              'Lifting torso off the bench.',
              'Failing to reach full arm extension at the bottom.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Triceps',
        name: 'Triceps',
        subdivision: 'Medial Head',
        anatomicalHead: 'Triceps Brachii (Lateral, Long & Medial Heads)',
        location: 'Back of the upper arm, making up roughly 60% of total arm circumference.',
        movement: 'Extends the elbow joint (straightens the arm).',
        whyTrainIt: 'The primary contributor to total arm thickness and lockout power on all bench and overhead presses.',
        beginnerExplanation: 'When you push open a heavy door or push up from the floor, your triceps lock your arms straight.',
        formConsiderations: 'Keep your elbows fixed in place in space; only your forearms should move like a hinge.',
        exercises: [
          {
            id: 'cable-rope-pushdown',
            name: 'Cable Rope Triceps Pushdown',
            targetRegion: 'Triceps',
            primaryMuscles: ['Triceps Lateral Head', 'Medial Head'],
            secondaryMuscles: ['Anconeus'],
            equipment: 'Cable Machine & Rope Attachment',
            difficulty: 'Beginner',
            instructions: [
              'Attach rope to high pulley, hold rope ends, pin elbows to ribs.',
              'Push down until arms are fully extended.',
              'Spread rope ends outward at bottom for maximal contraction.',
              'Return hands smoothly up to chest level.'
            ],
            commonMistakes: [
              'Allowing elbows to ride up and down with every rep.',
              'Leaning heavy bodyweight over the rope.'
            ],
            videoUrl: null
          },
          {
            id: 'overhead-cable-extension',
            name: 'Overhead Cable Triceps Extension',
            targetRegion: 'Triceps',
            primaryMuscles: ['Triceps Long Head'],
            secondaryMuscles: ['Lateral Head'],
            equipment: 'Cable Machine',
            difficulty: 'Beginner',
            instructions: [
              'Hold rope attachment over head with elbows pointed toward ceiling.',
              'Extend forearms upward overhead until arms lock straight.',
              'Hold squeeze for a moment.',
              'Lower hands back behind head to feel a deep long-head stretch.'
            ],
            commonMistakes: [
              'Flaring elbows outward excessively wide.',
              'Arching lower back under the overhead load.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Forearms',
        name: 'Forearms',
        subdivision: 'Wrist Flexors',
        anatomicalHead: 'Brachioradialis, Flexors & Extensors',
        location: 'From the elbow down to the wrist and fingers.',
        movement: 'Flexes, extends, and rotates the wrist; operates finger grip clamping strength.',
        whyTrainIt: 'Provides crushing grip strength required for deadlifts, rows, pull-ups, and prevents elbow tendonitis.',
        beginnerExplanation: 'Your forearms are your biological vice-grips. Any time you squeeze a barbell or open a jar, your forearms work.',
        formConsiderations: 'Use full range of wrist motion and avoid jerking weights with finger tips.',
        exercises: [
          {
            id: 'wrist-curls',
            name: 'Seated Dumbbell Wrist Curl',
            targetRegion: 'Forearms',
            primaryMuscles: ['Forearm Flexors'],
            secondaryMuscles: ['Palmaris Longus'],
            equipment: 'Dumbbells & Flat Bench',
            difficulty: 'Beginner',
            instructions: [
              'Rest forearms on thighs or a flat bench with wrists hanging over edge, palms up.',
              'Allow dumbbells to roll down to fingertips.',
              'Curl wrists upward as high as possible.',
              'Lower slowly back to fingertips.'
            ],
            commonMistakes: [
              'Lifting forearms off the thighs.',
              'Using excessively heavy weights that strain wrist ligaments.'
            ],
            videoUrl: null
          },
          {
            id: 'reverse-curl',
            name: 'EZ-Bar Reverse Curl',
            targetRegion: 'Forearms',
            primaryMuscles: ['Brachioradialis', 'Forearm Extensors'],
            secondaryMuscles: ['Biceps Brachii'],
            equipment: 'EZ-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Hold EZ-bar with an overhand (pronated) grip at shoulder width.',
              'Pin elbows to sides and curl bar upward.',
              'Squeeze outer forearms hard at the top.',
              'Lower slowly under control.'
            ],
            commonMistakes: [
              'Allowing wrists to buckle backward.',
              'Swinging torso to launch bar upward.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. LEGS
  // ═══════════════════════════════════════════════════════════════════════════
  Legs: {
    id: 'Legs',
    name: 'Legs',
    displayName: 'Legs (Lower Body Complex)',
    anatomicalName: 'Quadriceps, Hamstrings, Glutes, Adductors & Abductors',
    defaultView: 'front',
    overviewDescription:
      'The powerhouse of the human body, responsible for upright locomotion, jumping, sprinting, and core stability.',
    cameraTarget: { x: 0.0, y: -6.0, z: 0.1 },
    cameraPosition: { x: 0.0, y: -6.0, z: 29.5 },
    regions: [
      {
        id: 'Quadriceps',
        name: 'Quadriceps',
        subdivision: 'Quadriceps',
        color: '#ef4444',
        glowColor: '#dc2626',
        labelOffset: { x: 4.8, y: 1.5, z: 0.8 },
        anatomicalHead: 'Rectus Femoris, Vastus Lateralis, Medialis & Intermedius',
        location: 'The front four-headed muscle group covering the anterior thigh.',
        movement: 'Extends the knee joint and assists in flexing the hip upward.',
        whyTrainIt: 'The primary muscle for standing, walking up stairs, athletic jumping, and knee joint protection.',
        beginnerExplanation: 'Your quads act as the shock absorbers of your legs. Whenever you stand up from a couch or squat down, your quads do the work.',
        formConsiderations: 'Keep knees tracking in the exact same direction as your toes during squats and lunges.',
        exercises: [
          {
            id: 'barbell-back-squat',
            name: 'Barbell Back Squat',
            targetRegion: 'Quadriceps',
            primaryMuscles: ['Quadriceps'],
            secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
            equipment: 'Barbell & Squat Rack',
            difficulty: 'Beginner',
            instructions: [
              'Rest barbell across upper traps, feet shoulder-width, toes turned slightly out.',
              'Inhale, brace core, and bend knees and hips simultaneously.',
              'Lower until thighs are at least parallel to the floor.',
              'Drive through mid-foot to stand back up to starting position.'
            ],
            commonMistakes: [
              'Knees caving inward (valgus collapse).',
              'Heels lifting off the ground.',
              'Rounding the lumbar spine at the bottom.'
            ],
            videoUrl: null
          },
          {
            id: 'leg-extension',
            name: 'Seated Leg Extension Machine',
            targetRegion: 'Quadriceps',
            primaryMuscles: ['Quadriceps (Vasti & Rectus Femoris)'],
            secondaryMuscles: ['Patellar Tendon'],
            equipment: 'Leg Extension Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit with back against pad, knees aligned with machine pivot point.',
              'Extend knees until legs are straight in front of you.',
              'Hold peak contraction at the top for 1 second.',
              'Lower weight under control without letting plates smash.'
            ],
            commonMistakes: [
              'Kicking the weight up with momentum.',
              'Setting ankle pad too high on the shins.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Hamstrings',
        name: 'Hamstrings',
        subdivision: 'Hamstrings',
        color: '#3b82f6',
        glowColor: '#2563eb',
        labelOffset: { x: 4.8, y: 0.0, z: -1.0 },
        anatomicalHead: 'Biceps Femoris, Semitendinosus & Semimembranosus',
        location: 'The back of the thigh running from the sit-bones (ischial tuberosity) down past the knee.',
        movement: 'Flexes the knee (bends leg backward) and extends the hips (drives hips forward).',
        whyTrainIt: 'Crucial for sprint speed, explosive athletic deceleration, and preventing ACL knee tears.',
        beginnerExplanation: 'Whenever you run and kick your heels up toward your glutes, your hamstrings contract.',
        formConsiderations: 'Maintain a soft bend in the knees during deadlifts; hinge strictly through your hips.',
        exercises: [
          {
            id: 'lying-leg-curl',
            name: 'Lying Hamstring Leg Curl',
            targetRegion: 'Hamstrings',
            primaryMuscles: ['Biceps Femoris', 'Semitendinosus'],
            secondaryMuscles: ['Gastrocnemius'],
            equipment: 'Lying Leg Curl Machine',
            difficulty: 'Beginner',
            instructions: [
              'Lie prone with pad resting against the back of your lower calves/Achilles.',
              'Curl pad upward toward glutes as far as possible.',
              'Hold peak contraction for 1 second.',
              'Lower weight slowly back down.'
            ],
            commonMistakes: [
              'Lifting hips off the bench while curling.',
              'Swinging the weight explosively.'
            ],
            videoUrl: null
          },
          {
            id: 'romanian-deadlift-legs',
            name: 'Dumbbell Romanian Deadlift',
            targetRegion: 'Hamstrings',
            primaryMuscles: ['Hamstrings'],
            secondaryMuscles: ['Glutes', 'Erector Spinae'],
            equipment: 'Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Hold dumbbells in front of thighs with slight knee bend.',
              'Push hips backward towards the wall behind you.',
              'Lower dumbbells along shins until you feel a deep hamstring stretch.',
              'Squeeze glutes and hamstrings to return to standing.'
            ],
            commonMistakes: [
              'Squatting down instead of hinging hips back.',
              'Rounding the spine.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Glutes',
        name: 'Glutes',
        subdivision: 'Glutes',
        color: '#a855f7',
        glowColor: '#9333ea',
        labelOffset: { x: -4.8, y: 1.8, z: -1.0 },
        anatomicalHead: 'Gluteus Maximus, Medius & Minimus',
        location: 'The posterior hip and buttocks complex.',
        movement: 'Extends, rotates, and abducts the hip; provides primary upright pelvic stability.',
        whyTrainIt: 'The single largest and most powerful muscle group in the body; drives sprinting, jumping, and pain-free lower back health.',
        beginnerExplanation: 'Your glutes are the engine that pushes you out of a chair or propels you forward up a flight of stairs.',
        formConsiderations: 'Tuck your chin and keep ribs down at the top of hip thrusts to prevent lower back arching.',
        exercises: [
          {
            id: 'barbell-hip-thrust',
            name: 'Barbell Hip Thrust',
            targetRegion: 'Glutes',
            primaryMuscles: ['Gluteus Maximus'],
            secondaryMuscles: ['Hamstrings', 'Adductors'],
            equipment: 'Barbell & Bench (Hip Thrust Pad)',
            difficulty: 'Beginner',
            instructions: [
              'Sit with upper back against bench and barbell resting padded over hips.',
              'Plant feet hip-width with shins vertical at top of lift.',
              'Drive through heels and extend hips upward toward ceiling.',
              'Squeeze glutes hard at the top with ribs tucked, then lower smoothly.'
            ],
            commonMistakes: [
              'Arching lower back rather than pivoting from the hips.',
              'Placing feet too far forward or too close.'
            ],
            videoUrl: null
          },
          {
            id: 'dumbbell-bulgarian-split-squat',
            name: 'Bulgarian Split Squat',
            targetRegion: 'Glutes',
            primaryMuscles: ['Gluteus Maximus', 'Quadriceps'],
            secondaryMuscles: ['Adductors', 'Calves'],
            equipment: 'Dumbbells & Flat Bench',
            difficulty: 'Intermediate',
            instructions: [
              'Stand 2–3 feet in front of bench and place top of rear foot onto bench.',
              'Hold dumbbells at sides and lower front knee until thigh is parallel to ground.',
              'Drive through front heel to return to top.',
              'Maintain torso upright with slight forward hip hinge.'
            ],
            commonMistakes: [
              'Front foot placed too close to bench, crowding front knee.',
              'Collapsing front knee inward.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Adductors',
        name: 'Adductors',
        subdivision: 'Adductors',
        color: '#10b981',
        glowColor: '#059669',
        labelOffset: { x: 4.8, y: -1.0, z: 0.5 },
        anatomicalHead: 'Adductor Magnus, Longus, Brevis, Gracilis & Pectineus',
        location: 'The inner thigh running from the pelvic pubic bone down along the femur.',
        movement: 'Draws the legs inward toward the midline (adduction) and stabilizes the pelvis during single-leg actions.',
        whyTrainIt: 'Crucial for rotational hip strength, groin strain prevention, and overall inner thigh fullness.',
        beginnerExplanation: 'Think of squeezing a soccer ball between your knees; your inner thigh adductors are doing the clamping.',
        formConsiderations: 'Progressively load inner thigh stretches carefully to protect sensitive groin tendons.',
        exercises: [
          {
            id: 'seated-hip-adduction',
            name: 'Seated Machine Hip Adduction',
            targetRegion: 'Adductors',
            primaryMuscles: ['Adductor Magnus', 'Adductor Longus'],
            secondaryMuscles: ['Gracilis'],
            equipment: 'Seated Adduction Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit with pads on inside of knees and open legs wide.',
              'Squeeze knees inward toward the center until pads touch.',
              'Hold the inner thigh squeeze for 1 second.',
              'Slowly return to the stretched position.'
            ],
            commonMistakes: [
              'Using momentum to slam pads together.',
              'Setting the machine too wide, over-stretching groin.'
            ],
            videoUrl: null
          },
          {
            id: 'copenhagen-plank',
            name: 'Copenhagen Adductor Plank',
            targetRegion: 'Adductors',
            primaryMuscles: ['Adductors', 'Deep Core'],
            secondaryMuscles: ['Obliques'],
            equipment: 'Flat Bench',
            difficulty: 'Intermediate',
            instructions: [
              'Lie in side plank position with top foot supported on a bench.',
              'Lift bottom leg so it hovers underneath the bench.',
              'Hold body in a rigid straight line using inner thigh strength.',
              'Hold for 15–30 seconds per side.'
            ],
            commonMistakes: [
              'Letting hips sag toward the floor.',
              'Rotating hips forward or backward.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Abductors',
        name: 'Abductors',
        subdivision: 'Abductors',
        color: '#f97316',
        glowColor: '#ea580c',
        labelOffset: { x: -4.8, y: 0.5, z: 0.5 },
        anatomicalHead: 'Gluteus Medius, Minimus & Tensor Fasciae Latae',
        location: 'The outer hip and upper side of the pelvis.',
        movement: 'Pulls the leg outward away from the midline and prevents the pelvis from dropping when walking.',
        whyTrainIt: 'Prevents knee collapse (runner\'s knee), stabilizes the hips, and shapes the upper outer glute curve.',
        beginnerExplanation: 'Every time you step to the side or balance on one foot without falling over, your hip abductors keep you upright.',
        formConsiderations: 'Keep toes pointed forward or slightly inward to target the gluteus medius rather than the hip flexors.',
        exercises: [
          {
            id: 'seated-hip-abduction',
            name: 'Seated Machine Hip Abduction',
            targetRegion: 'Abductors',
            primaryMuscles: ['Gluteus Medius', 'Tensor Fasciae Latae'],
            secondaryMuscles: ['Gluteus Minimus'],
            equipment: 'Seated Abduction Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit with pads resting on the outside of your knees.',
              'Push knees outward against the pads as far as possible.',
              'Hold peak contraction for 1 second.',
              'Slowly let knees return together under control.'
            ],
            commonMistakes: [
              'Leaning forward and using lower back momentum.',
              'Letting knees snap inward quickly.'
            ],
            videoUrl: null
          },
          {
            id: 'cable-hip-abduction',
            name: 'Standing Cable Hip Abduction',
            targetRegion: 'Abductors',
            primaryMuscles: ['Gluteus Medius'],
            secondaryMuscles: ['Tensor Fasciae Latae'],
            equipment: 'Cable Machine & Ankle Cuff',
            difficulty: 'Beginner',
            instructions: [
              'Attach ankle cuff to low pulley and secure around ankle.',
              'Stand tall holding machine for balance.',
              'Raise leg outward to the side with toes pointed forward.',
              'Lower slowly back to starting stance.'
            ],
            commonMistakes: [
              'Turning toes upward (recruits hip flexors instead of side glute).',
              'Tilting torso sideways to swing the leg.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ABS / CORE
  // ═══════════════════════════════════════════════════════════════════════════
  'Abs / Core': {
    id: 'Abs / Core',
    name: 'Abs / Core',
    displayName: 'Abs & Core',
    anatomicalName: 'Rectus Abdominis, Obliques & Transversus Abdominis',
    defaultView: 'front',
    overviewDescription:
      'The central corset of the human body, uniting the upper and lower halves, protecting visceral organs, and stabilizing the spine.',
    cameraTarget: { x: 0.0, y: 4.2, z: 1.2 },
    cameraPosition: { x: 0.0, y: 4.2, z: 24.0 },
    regions: [
      {
        id: 'Rectus Abdominis',
        name: 'Rectus Abdominis',
        subdivision: 'Rectus Abdominis',
        color: '#ef4444',
        glowColor: '#dc2626',
        labelOffset: { x: 4.8, y: 0.8, z: 0.8 },
        anatomicalHead: 'Rectus Abdominis (6-Pack Column)',
        location: 'The top half of the rectus abdominis between the sternum and navel.',
        movement: 'Flexes the thoracic spine downward toward the pelvis (curling upper ribs down).',
        whyTrainIt: 'Defines the upper segments of the 6-pack and stabilizes the ribcage during overhead movements.',
        beginnerExplanation: 'Think of curling your ribs down toward your belly button without moving your hips.',
        formConsiderations: 'Do not pull on the back of your neck. Support your head gently with fingertips and move through the abs.',
        exercises: [
          {
            id: 'cable-kneeling-crunch',
            name: 'Cable Kneeling Rope Crunch',
            targetRegion: 'Upper Abs',
            primaryMuscles: ['Rectus Abdominis (Upper)'],
            secondaryMuscles: ['Obliques'],
            equipment: 'Cable Machine & Rope Attachment',
            difficulty: 'Beginner',
            instructions: [
              'Kneel below high pulley, hold rope ends next to ears.',
              'Keep hips stationary and curl elbows down toward knees using abs.',
              'Blow out all air and crunch spine into a C-shape.',
              'Return smoothly without letting hips sit back onto heels.'
            ],
            commonMistakes: [
              'Moving hips backward and forward like sitting down.',
              'Pulling with arm triceps rather than spinal flexion.'
            ],
            videoUrl: null
          },
          {
            id: 'classic-floor-crunch',
            name: 'Floor Crunch with Pause',
            targetRegion: 'Upper Abs',
            primaryMuscles: ['Rectus Abdominis'],
            secondaryMuscles: ['Deep Core'],
            equipment: 'Exercise Mat',
            difficulty: 'Beginner',
            instructions: [
              'Lie supine with knees bent and feet flat on mat.',
              'Fingertips behind head, elbows wide.',
              'Curl shoulder blades 2–3 inches off the ground.',
              'Hold peak contraction for a two-count, then lower slowly.'
            ],
            commonMistakes: [
              'Yanking neck forward with hands.',
              'Lifting lower back completely off the floor.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Lower Abs',
        name: 'Lower Abs',
        subdivision: 'Lower Abs',
        anatomicalHead: 'Inferior Rectus Abdominis & Pyramidalis',
        location: 'The lower abdominal wall below the belly button down to the pubic crest.',
        movement: 'Performs posterior pelvic tilt (curls the pelvis upward toward the ribcage).',
        whyTrainIt: 'Combats anterior pelvic tilt, eliminates lower belly pooches, and strengthens the deepest pelvic floor.',
        beginnerExplanation: 'Instead of moving your chest toward your hips, you curl your hips upward toward your chest.',
        formConsiderations: 'Initiate by curling the pelvis; do not simply swing your legs back and forth using hip flexors.',
        exercises: [
          {
            id: 'hanging-leg-raise',
            name: 'Hanging Knee / Leg Raise',
            targetRegion: 'Lower Abs',
            primaryMuscles: ['Rectus Abdominis (Lower)'],
            secondaryMuscles: ['Hip Flexors', 'Forearms'],
            equipment: 'Pull-Up Bar',
            difficulty: 'Intermediate',
            instructions: [
              'Hang from pull-up bar with arms straight and shoulders packed.',
              'Posteriorly tilt pelvis and curl knees up to chest.',
              'Focus on rolling the pelvis upward, not just swinging thighs.',
              'Lower legs slowly without swinging.'
            ],
            commonMistakes: [
              'Swinging legs with momentum like a pendulum.',
              'Arched lower back throughout the movement.'
            ],
            videoUrl: null
          },
          {
            id: 'reverse-crunch',
            name: 'Incline Reverse Crunch',
            targetRegion: 'Lower Abs',
            primaryMuscles: ['Rectus Abdominis (Lower)'],
            secondaryMuscles: ['Obliques'],
            equipment: 'Slant Board or Mat',
            difficulty: 'Beginner',
            instructions: [
              'Lie back on mat holding an anchor point behind head.',
              'Lift knees over hips and curl tailbone off the floor toward ceiling.',
              'Hold top contraction for 1 second.',
              'Lower tailbone back down with complete control.'
            ],
            commonMistakes: [
              'Kicking feet to generate momentum.',
              'Dropping hips hard back onto the floor.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Obliques',
        name: 'Obliques',
        subdivision: 'Obliques',
        color: '#eab308',
        glowColor: '#ca8a04',
        labelOffset: { x: 5.2, y: -0.2, z: 0.5 },
        anatomicalHead: 'External & Internal Obliques',
        location: 'The lateral flanks of the waist, running diagonally like hands in your coat pockets.',
        movement: 'Rotates the torso sideways, flexes the trunk laterally, and resists unwanted spinal twisting.',
        whyTrainIt: 'Builds rotational athletic power for throwing and swinging, and frames the 6-pack with shredded waist lines.',
        beginnerExplanation: 'Whenever you twist your body around to look behind you, your side obliques are rotating your ribs.',
        formConsiderations: 'Move with control; never combine loaded twisting with an excessively rounded lumbar spine.',
        exercises: [
          {
            id: 'russian-twist',
            name: 'Seated Russian Twist',
            targetRegion: 'Obliques',
            primaryMuscles: ['Internal & External Obliques'],
            secondaryMuscles: ['Rectus Abdominis'],
            equipment: 'Medicine Ball or Dumbbell',
            difficulty: 'Beginner',
            instructions: [
              'Sit with knees bent, lean torso back 45°, and hover feet off floor.',
              'Rotate torso smoothly from left to right, touching weight beside hip.',
              'Follow the weight with your chest and gaze.',
              'Keep core tightly braced throughout.'
            ],
            commonMistakes: [
              'Only moving arms while torso remains stationary.',
              'Rounding the spine and slumping.'
            ],
            videoUrl: null
          },
          {
            id: 'side-plank',
            name: 'Side Plank Hold',
            targetRegion: 'Obliques',
            primaryMuscles: ['Internal & External Obliques (Isometric)'],
            secondaryMuscles: ['Quadratus Lumborum', 'Gluteus Medius'],
            equipment: 'Mat',
            difficulty: 'Beginner',
            instructions: [
              'Lie on side propped up on forearm with elbow directly below shoulder.',
              'Stack feet and elevate hips until body forms a straight diagonal line.',
              'Hold posture firm for 30–45 seconds without letting hips sag.',
              'Switch sides and repeat.'
            ],
            commonMistakes: [
              'Letting hips drop towards the mat.',
              'Rolling chest forward towards the floor.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Deep Core',
        name: 'Deep Core',
        subdivision: 'Deep Core',
        color: '#14b8a6',
        glowColor: '#0d9488',
        labelOffset: { x: -5.0, y: -0.8, z: 0.5 },
        anatomicalHead: 'Transversus Abdominis & Multifidus',
        location: 'The deepest layer of the abdominal wall, wrapping horizontally around the organs like a weight belt.',
        movement: 'Compresses abdominal contents, increases intra-abdominal pressure, and stabilizes the spine.',
        whyTrainIt: 'Acts as your body\'s natural internal lifting belt; eliminates back pain and pulls the stomach in flat.',
        beginnerExplanation: 'Imagine zipping up a pair of pants that are slightly too tight—that inward sucking and tightening sensation is your transverse abdominis.',
        formConsiderations: 'Practice diaphragmatic breathing: breathe into your belly and exhale completely while drawing navel to spine.',
        exercises: [
          {
            id: 'stomach-vacuum',
            name: 'Stomach Vacuum',
            targetRegion: 'Deep Core',
            primaryMuscles: ['Transversus Abdominis'],
            secondaryMuscles: ['Diaphragm'],
            equipment: 'Bodyweight',
            difficulty: 'Beginner',
            instructions: [
              'Stand tall or kneel, exhale all air from lungs completely.',
              'Without inhaling, suck navel inward and upward towards spine.',
              'Hold this tight vacuum contraction for 15–20 seconds.',
              'Release gently, breathe normally, and repeat.'
            ],
            commonMistakes: [
              'Inhaling air while trying to hold the vacuum.',
              'Holding breath in the throat instead of holding diaphragm position.'
            ],
            videoUrl: null
          },
          {
            id: 'dead-bug',
            name: 'Dead Bug Core Stabilization',
            targetRegion: 'Deep Core',
            primaryMuscles: ['Transversus Abdominis'],
            secondaryMuscles: ['Multifidus', 'Pelvic Floor'],
            equipment: 'Mat',
            difficulty: 'Beginner',
            instructions: [
              'Lie on back with arms pointing to ceiling and knees bent at 90 degrees.',
              'Press lower back completely flat into the floor (no gap under spine).',
              'Slowly lower right arm overhead and extend left leg down towards floor.',
              'Return to start and repeat with opposite arm and leg.'
            ],
            commonMistakes: [
              'Allowing the lower back to arch off the floor.',
              'Rushing repetitions and losing core brace.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. CALVES
  // ═══════════════════════════════════════════════════════════════════════════
  Calves: {
    id: 'Calves',
    name: 'Calves',
    displayName: 'Calves (Lower Leg)',
    anatomicalName: 'Gastrocnemius & Soleus',
    defaultView: 'back',
    overviewDescription:
      'The triceps surae complex on the posterior lower leg, responsible for ankle plantarflexion (pointing toes down), jumping propulsion, and walking shock absorption.',
    cameraTarget: { x: 0.0, y: -9.0, z: -0.2 },
    cameraPosition: { x: 0.0, y: -9.0, z: -27.0 },
    regions: [
      {
        id: 'Gastrocnemius',
        name: 'Gastrocnemius',
        subdivision: 'Gastrocnemius',
        anatomicalHead: 'Medial & Lateral Heads (Upper Calf)',
        location: 'The visible diamond-shaped upper calf muscle that crosses both the knee joint and ankle joint.',
        movement: 'Points toes downward with straight knees (plantarflexion) and assists in knee flexion.',
        whyTrainIt: 'Provides the iconic sculpted diamond shape on the back of the legs and powers vertical jumping.',
        beginnerExplanation: 'When you stand on your tip-toes with your knees locked straight, your gastrocnemius provides the upward push.',
        formConsiderations: 'Because the gastrocnemius crosses the knee, knees MUST be locked straight to train it effectively. Seated calf raises bend the knee and take it out of the lift.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Machine Calf Raise',
            targetRegion: 'Gastrocnemius',
            primaryMuscles: ['Gastrocnemius (Medial & Lateral)'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Raise Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off; rest shoulder pads on shoulders.',
              'Lower heels as far as possible for a full 2-second deep calf stretch.',
              'Explode upward onto balls of feet, rising as high on big toes as possible.',
              'Hold peak contraction for a two-count before lowering.'
            ],
            commonMistakes: [
              'Bouncing quickly at the bottom using Achilles tendon elasticity.',
              'Bending knees during the rep.'
            ],
            videoUrl: null
          },
          {
            id: 'leg-press-calf-raise',
            name: 'Leg Press Calf Press',
            targetRegion: 'Gastrocnemius',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus', 'Tibialis Posterior'],
            equipment: '45° Leg Press Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit in leg press and position balls of feet on bottom edge of sled with heels free.',
              'Keep legs straight with knees soft (not hyperextended).',
              'Press sled forward by pointing toes.',
              'Let sled return smoothly to a deep calf stretch.'
            ],
            commonMistakes: [
              'Sled slipping off toes (keep safety latches engaged!).',
              'Bending knees and turning it into a leg press.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Soleus',
        name: 'Soleus',
        subdivision: 'Soleus',
        anatomicalHead: 'Soleus (Deep Postural Calf)',
        location: 'Broad, flat muscle lying directly underneath the gastrocnemius, attaching strictly below the knee to the Achilles tendon.',
        movement: 'Points toes downward when knees are bent (plantarflexion).',
        whyTrainIt: 'Composed largely of slow-twitch endurance fibers that push your calves outward, adding overall lower-leg width and preventing shin splints.',
        beginnerExplanation: 'Your soleus is the endurance hero of walking and standing. It keeps you balanced on your feet all day long.',
        formConsiderations: 'To isolate the soleus, knees MUST be bent at roughly 90 degrees (as in a seated calf raise).',
        exercises: [
          {
            id: 'seated-calf-raise',
            name: 'Seated Calf Raise Machine',
            targetRegion: 'Soleus',
            primaryMuscles: ['Soleus'],
            secondaryMuscles: ['Plantaris'],
            equipment: 'Seated Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Sit with thigh pad secured snugly over lower thighs above knees.',
              'Place balls of feet on platform and release safety lever.',
              'Lower heels completely down to feel a deep soleus stretch.',
              'Press up through balls of feet and hold peak contraction for 1 second.'
            ],
            commonMistakes: [
              'Bouncing the weight up and down.',
              'Using only the middle half of the range of motion.'
            ],
            videoUrl: null
          },
          {
            id: 'tibialis-raise',
            name: 'Tibialis Anterior Wall Raise',
            targetRegion: 'Soleus / Lower Leg',
            primaryMuscles: ['Tibialis Anterior'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Wall / Bodyweight',
            difficulty: 'Beginner',
            instructions: [
              'Lean back against a wall with legs extended forward.',
              'Flex toes and balls of feet straight up toward shins as high as possible.',
              'Hold for 1 second at the top.',
              'Lower toes smoothly back to floor.'
            ],
            commonMistakes: [
              'Bending knees or sliding down the wall.',
              'Jerking feet off the ground.'
            ],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. BICEPS
  // ═══════════════════════════════════════════════════════════════════════════
  Biceps: {
    id: 'Biceps',
    name: 'Biceps',
    displayName: 'Biceps Brachii',
    anatomicalName: 'Biceps Brachii (Caput Longum & Breve)',
    defaultView: 'front',
    overviewDescription:
      'The two-headed anterior flexor of the upper arm responsible for elbow flexion and forearm supination.',
    cameraTarget: { x: 0.0, y: 7.2, z: 0.5 },
    cameraPosition: { x: 0.0, y: 7.2, z: 24.0 },
    regions: [
      {
        id: 'Long Head',
        name: 'Long Head',
        subdivision: 'Long Head',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.8, y: 0.6, z: 0.5 },
        anatomicalHead: 'Caput Longum (Outer Bicep Peak)',
        location: 'Originates from the supraglenoid tubercle of the scapula and runs down the outer upper arm.',
        movement: 'Elbow flexion and forearm supination; active when curling with arms behind the torso.',
        whyTrainIt: 'Builds vertical bicep peak and creates separation between bicep and tricep.',
        beginnerExplanation: 'When you flex your arm and see a high peak, you are looking at the long head of your bicep.',
        formConsiderations: 'Incline curls where elbows stay behind your torso place maximum stretch on the long head.',
        exercises: [
          {
            id: 'incline-dumbbell-curl',
            name: 'Incline Dumbbell Curl',
            targetRegion: 'Long Head',
            primaryMuscles: ['Biceps Brachii (Long Head)'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Incline Bench & Dumbbells',
            difficulty: 'Beginner',
            instructions: [
              'Lie back on a 45-degree incline bench with dumbbells hanging straight down.',
              'Curl weights upward while keeping elbows back.',
              'Squeeze peak at the top for 1 second.',
              'Lower slowly back to the stretched position.'
            ],
            commonMistakes: ['Letting elbows drift forward.', 'Swinging body.'],
            videoUrl: null
          },
          {
            id: 'drag-curl',
            name: 'Barbell Drag Curl',
            targetRegion: 'Long Head',
            primaryMuscles: ['Biceps Long Head'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Barbell',
            difficulty: 'Intermediate',
            instructions: [
              'Stand tall holding bar against thighs.',
              'Pull elbows back and drag the barbell straight up against your torso.',
              'Squeeze biceps hard at chest level.',
              'Lower slowly along the same path.'
            ],
            commonMistakes: ['Pushing elbows forward.', 'Using momentum.'],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Short Head',
        name: 'Short Head',
        subdivision: 'Short Head',
        color: '#ec4899',
        glowColor: '#db2777',
        labelOffset: { x: 4.8, y: -0.6, z: 0.5 },
        anatomicalHead: 'Caput Breve (Inner Bicep Thickness)',
        location: 'Originates from the coracoid process of the scapula and runs down the inner arm.',
        movement: 'Assists shoulder flexion, elbow flexion, and maximum forearm supination.',
        whyTrainIt: 'Builds inner arm thickness and overall bicep width when viewed from the front.',
        beginnerExplanation: 'The short head is the muscle you see when looking directly at your arms in a front double-biceps pose.',
        formConsiderations: 'Take a slightly wider grip on the barbell to emphasize inner bicep fibers.',
        exercises: [
          {
            id: 'wide-grip-ez-bar-curl',
            name: 'Wide-Grip Preacher Curl',
            targetRegion: 'Short Head',
            primaryMuscles: ['Biceps Brachii (Short Head)'],
            secondaryMuscles: ['Brachialis'],
            equipment: 'Preacher Bench & EZ-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Place upper arms flush against preacher pad with wide underhand grip.',
              'Curl bar upward toward chin without lifting elbows off pad.',
              'Squeeze firmly at the top.',
              'Lower slowly to 95% arm extension without hyperextending.'
            ],
            commonMistakes: ['Bouncing weight at bottom.', 'Lifting elbows off pad.'],
            videoUrl: null
          },
          {
            id: 'concentration-curl',
            name: 'Seated Concentration Curl',
            targetRegion: 'Short Head',
            primaryMuscles: ['Biceps Short Head'],
            secondaryMuscles: ['Brachioradialis'],
            equipment: 'Dumbbell',
            difficulty: 'Beginner',
            instructions: [
              'Sit on bench, brace tricep against inner thigh.',
              'Curl dumbbell smoothly toward opposite shoulder.',
              'Hold peak contraction and lower with control.'
            ],
            commonMistakes: ['Swinging torso.', 'Using legs to assist.'],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Calves',
        name: 'Calves',
        subdivision: 'Calves',
        color: '#06b6d4',
        glowColor: '#0891b2',
        labelOffset: { x: 4.5, y: -2.8, z: -0.8 },
        anatomicalHead: 'Gastrocnemius & Soleus',
        location: 'Posterior lower leg extending from behind the knee down to the heel via the Achilles tendon.',
        movement: 'Plantarflexes the ankle (raising heel onto tiptoes).',
        whyTrainIt: 'Provides explosive sprint takeoff, stabilizes ankle during squats, and gives lower legs athletic shape.',
        beginnerExplanation: 'Whenever you rise onto your tiptoes to reach something high, your calves lift your entire body.',
        formConsiderations: 'Pause for 1 second at the bottom of calf raises to dissipate Achilles tendon bounce.',
        exercises: [
          {
            id: 'standing-calf-raise',
            name: 'Standing Calf Raise',
            targetRegion: 'Calves',
            primaryMuscles: ['Gastrocnemius'],
            secondaryMuscles: ['Soleus'],
            equipment: 'Standing Calf Machine',
            difficulty: 'Beginner',
            instructions: [
              'Place balls of feet on block with heels hanging off.',
              'Lower heels fully into deep stretch.',
              'Drive balls of feet into platform, lifting heels as high as possible.',
              'Hold peak contraction for 1 second.'
            ],
            commonMistakes: ['Bouncing weight.', 'Partial range of motion.'],
            videoUrl: null
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. TRICEPS
  // ═══════════════════════════════════════════════════════════════════════════
  Triceps: {
    id: 'Triceps',
    name: 'Triceps',
    displayName: 'Triceps Brachii',
    anatomicalName: 'Triceps Brachii (3 Heads)',
    defaultView: 'back',
    overviewDescription:
      'The three-headed extensor on the posterior upper arm responsible for extending the elbow and accounting for 60% of upper arm mass.',
    cameraTarget: { x: 0.0, y: 7.2, z: -0.5 },
    cameraPosition: { x: 0.0, y: 7.2, z: -24.0 },
    regions: [
      {
        id: 'Long Head',
        name: 'Long Head',
        subdivision: 'Long Head',
        color: '#3b82f6',
        glowColor: '#2563eb',
        labelOffset: { x: 4.8, y: 0.8, z: -0.8 },
        anatomicalHead: 'Caput Longum (Posterior Inner Mass)',
        location: 'Originates from the infraglenoid tubercle of the scapula and attaches to the olecranon of the ulna.',
        movement: 'Elbow extension and shoulder extension/adduction.',
        whyTrainIt: 'The largest head of the triceps; responsible for back-of-the-arm hang and upper-body pushing strength.',
        beginnerExplanation: 'Overhead extensions stretch and recruit the long head because it crosses both the shoulder and elbow joints.',
        formConsiderations: 'Keep elbows tucked and avoid excessive flaring on overhead movements.',
        exercises: [
          {
            id: 'overhead-cable-extension',
            name: 'Overhead Rope Cable Extension',
            targetRegion: 'Long Head',
            primaryMuscles: ['Triceps Long Head'],
            secondaryMuscles: ['Lateral Head'],
            equipment: 'Cable Machine & Rope',
            difficulty: 'Beginner',
            instructions: [
              'Face away from cable pulley with rope behind head.',
              'Extend elbows forward and out without moving upper arms.',
              'Squeeze triceps at lockout.',
              'Lower slowly back behind head.'
            ],
            commonMistakes: ['Flaring elbows wide.', 'Arching lower back.'],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Lateral Head',
        name: 'Lateral Head',
        subdivision: 'Lateral Head',
        color: '#8b5cf6',
        glowColor: '#7c3aed',
        labelOffset: { x: 4.8, y: 0.0, z: -0.8 },
        anatomicalHead: 'Caput Laterale (Outer Horseshoe Head)',
        location: 'Originates from the posterior surface of the humerus and forms the outer side profile of the arm.',
        movement: 'Strongest extensor of the elbow during heavy pushdowns and lockouts.',
        whyTrainIt: 'Creates the distinct "horseshoe" visual shape on the side of the arm.',
        beginnerExplanation: 'When you push straight down on a cable bar, your lateral tricep head lights up.',
        formConsiderations: 'Lock elbows to ribs and avoid leaning over the bar with bodyweight.',
        exercises: [
          {
            id: 'triceps-pushdown-vbar',
            name: 'V-Bar Cable Pushdown',
            targetRegion: 'Lateral Head',
            primaryMuscles: ['Triceps Lateral Head'],
            secondaryMuscles: ['Medial Head'],
            equipment: 'Cable Machine & V-Bar',
            difficulty: 'Beginner',
            instructions: [
              'Grip V-bar with overhand grip and lock elbows at ribs.',
              'Push bar straight down until arms are fully extended.',
              'Hold for 1 second at full lockout.',
              'Return slowly to 90 degrees.'
            ],
            commonMistakes: ['Allowing elbows to drift forward.', 'Using shoulders to press.'],
            videoUrl: null
          }
        ]
      },
      {
        id: 'Medial Head',
        name: 'Medial Head',
        subdivision: 'Medial Head',
        color: '#f59e0b',
        glowColor: '#d97706',
        labelOffset: { x: 4.8, y: -0.8, z: -0.8 },
        anatomicalHead: 'Caput Mediale (Deep Stabilizer)',
        location: 'Deep, lower posterior humerus near the elbow joint.',
        movement: 'Active in all elbow extension angles, acting as the primary stabilizer.',
        whyTrainIt: 'Provides joint stability and power through the final lockout of presses.',
        beginnerExplanation: 'The medial head is active in every pushing motion, even light everyday extensions.',
        formConsiderations: 'Use reverse-grip or close-grip bench to emphasize medial fibers.',
        exercises: [
          {
            id: 'reverse-grip-pushdown',
            name: 'Reverse-Grip Cable Pushdown',
            targetRegion: 'Medial Head',
            primaryMuscles: ['Triceps Medial Head'],
            secondaryMuscles: ['Anconeus'],
            equipment: 'Cable Machine & Straight Bar',
            difficulty: 'Intermediate',
            instructions: [
              'Hold bar with an underhand (palms up) grip.',
              'Push down until arms lock out smoothly.',
              'Control the return to 90 degrees.'
            ],
            commonMistakes: ['Letting wrists bend back.', 'Rushing repetitions.'],
            videoUrl: null
          }
        ]
      }
    ]
  }
};

// Aliases for user selection
MUSCLE_EXPLORATION_CONFIG.Abs = MUSCLE_EXPLORATION_CONFIG['Abs / Core'];

export const MAJOR_MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Abs',
  'Legs'
];



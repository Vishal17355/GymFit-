/**
 * Procedural Incline Dumbbell Bench Press 3D Generator
 * Creates an anatomically proportionate rigged muscular human model
 * lying on a 30-degree incline bench with realistic dumbbells and
 * a 6.0-second seamless skeletal animation loop:
 * - 3s Lowering (eccentric)
 * - 2s Pressing (concentric)
 * - 1s Hold at top (peak contraction)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Node.js FileReader polyfill for GLTFExporter
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../public/exercises');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  const THREE = await import('three');
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

  console.log('[Incline DB Generator] Building 30° Incline Dumbbell Bench Press Model...');

  const scene = new THREE.Scene();
  scene.name = 'Incline_Dumbbell_Press_Scene';

  /**
   * 1. CREATE SKELETON RIG
   * Configured for lying on a 30-degree incline bench
   * Incline Angle = 30° (0.5236 rad)
   */
  const INCLINE_RAD = 30 * (Math.PI / 180); // 0.5236 rad

  const root = new THREE.Bone();
  root.name = 'Hips';
  root.position.set(0, 0.52, -0.05);
  root.rotation.x = -INCLINE_RAD; // Torso tilted back 30 degrees

  const spine = new THREE.Bone();
  spine.name = 'Spine';
  spine.position.set(0, 0.24, 0);
  root.add(spine);

  const chest = new THREE.Bone();
  chest.name = 'Chest';
  chest.position.set(0, 0.24, 0);
  spine.add(chest);

  const neck = new THREE.Bone();
  neck.name = 'Neck';
  neck.position.set(0, 0.18, 0);
  chest.add(neck);

  const head = new THREE.Bone();
  head.name = 'Head';
  head.position.set(0, 0.14, 0);
  neck.add(head);

  // Left Arm Chain
  const shoulderL = new THREE.Bone();
  shoulderL.name = 'Shoulder_L';
  shoulderL.position.set(0.20, 0.13, 0);
  chest.add(shoulderL);

  const upperArmL = new THREE.Bone();
  upperArmL.name = 'UpperArm_L';
  upperArmL.position.set(0.12, 0, 0);
  shoulderL.add(upperArmL);

  const forearmL = new THREE.Bone();
  forearmL.name = 'Forearm_L';
  forearmL.position.set(0.28, 0, 0);
  upperArmL.add(forearmL);

  const handL = new THREE.Bone();
  handL.name = 'Hand_L';
  handL.position.set(0.24, 0, 0);
  forearmL.add(handL);

  // Right Arm Chain
  const shoulderR = new THREE.Bone();
  shoulderR.name = 'Shoulder_R';
  shoulderR.position.set(-0.20, 0.13, 0);
  chest.add(shoulderR);

  const upperArmR = new THREE.Bone();
  upperArmR.name = 'UpperArm_R';
  upperArmR.position.set(-0.12, 0, 0);
  shoulderR.add(upperArmR);

  const forearmR = new THREE.Bone();
  forearmR.name = 'Forearm_R';
  forearmR.position.set(-0.28, 0, 0);
  upperArmR.add(forearmR);

  const handR = new THREE.Bone();
  handR.name = 'Hand_R';
  handR.position.set(-0.24, 0, 0);
  forearmR.add(handR);

  // Left Leg (Planted on floor beside bench)
  const upperLegL = new THREE.Bone();
  upperLegL.name = 'UpperLeg_L';
  upperLegL.position.set(0.16, -0.06, 0.02);
  root.add(upperLegL);
  upperLegL.rotation.x = INCLINE_RAD + 0.35; // Thighs forward and down to floor
  upperLegL.rotation.z = 0.22; // Splayed out for stability

  const lowerLegL = new THREE.Bone();
  lowerLegL.name = 'LowerLeg_L';
  lowerLegL.position.set(0, -0.45, 0);
  upperLegL.add(lowerLegL);
  lowerLegL.rotation.x = -0.95; // Knee bent 90-100°

  const footL = new THREE.Bone();
  footL.name = 'Foot_L';
  footL.position.set(0, -0.42, 0.05);
  lowerLegL.add(footL);

  // Right Leg (Planted on floor beside bench)
  const upperLegR = new THREE.Bone();
  upperLegR.name = 'UpperLeg_R';
  upperLegR.position.set(-0.16, -0.06, 0.02);
  root.add(upperLegR);
  upperLegR.rotation.x = INCLINE_RAD + 0.35;
  upperLegR.rotation.z = -0.22;

  const lowerLegR = new THREE.Bone();
  lowerLegR.name = 'LowerLeg_R';
  lowerLegR.position.set(0, -0.45, 0);
  upperLegR.add(lowerLegR);
  lowerLegR.rotation.x = -0.95;

  const footR = new THREE.Bone();
  footR.name = 'Foot_R';
  footR.position.set(0, -0.42, 0.05);
  lowerLegR.add(footR);

  const bones = [
    root, // 0
    spine, // 1
    chest, // 2
    neck, // 3
    head, // 4
    shoulderL, // 5
    upperArmL, // 6
    forearmL, // 7
    handL, // 8
    shoulderR, // 9
    upperArmR, // 10
    forearmR, // 11
    handR, // 12
    upperLegL, // 13
    lowerLegL, // 14
    footL, // 15
    upperLegR, // 16
    lowerLegR, // 17
    footR // 18
  ];

  const skeleton = new THREE.Skeleton(bones);
  scene.add(root);

  /**
   * 2. MATERIALS: Anatomical GymVisual style
   * - Red: Upper Chest (Primary agonist)
   * - Orange: Anterior Deltoids & Triceps (Secondary synergists)
   * - Monochrome graphite/chalk: Non-target musculature
   */
  const primaryUpperChestMat = new THREE.MeshStandardMaterial({
    name: 'Mat_UpperChest_Primary',
    color: 0xef4444,
    emissive: 0xd92626,
    emissiveIntensity: 0.65,
    roughness: 0.28,
    metalness: 0.15
  });

  const secondaryMuscleMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Secondary_Synergists',
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.45,
    roughness: 0.32,
    metalness: 0.15
  });

  const anatomicalBodyMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Anatomical_Graphite',
    color: 0x242d38,
    roughness: 0.38,
    metalness: 0.12
  });

  const benchFrameMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Bench_SteelFrame',
    color: 0xe2e8f0, // White / light silver steel like reference image
    roughness: 0.25,
    metalness: 0.8
  });

  const benchLeatherMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Bench_Leather',
    color: 0x0f172a, // Rich dark black leather
    roughness: 0.55,
    metalness: 0.1
  });

  const dumbbellPlateMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Dumbbell_Plate',
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.85
  });

  const chromeHandleMat = new THREE.MeshStandardMaterial({
    name: 'Mat_Chrome_Handle',
    color: 0xcfd8dc,
    roughness: 0.15,
    metalness: 0.95
  });

  // Skinned mesh helper
  function makeSkinnedPart(geometry, boneIndexA, boneIndexB = null, material = anatomicalBodyMat, name = 'Part') {
    const pos = geometry.attributes.position;
    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < pos.count; i++) {
      if (boneIndexB !== null) {
        const y = pos.getY(i);
        const ratio = Math.max(0, Math.min(1, (y + 0.25) / 0.5));
        skinIndices.push(boneIndexA, boneIndexB, 0, 0);
        skinWeights.push(1 - ratio, ratio, 0, 0);
      } else {
        skinIndices.push(boneIndexA, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      }
    }

    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    const mesh = new THREE.SkinnedMesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.bind(skeleton);
    return mesh;
  }

  // 3. ASSEMBLE ANATOMICAL HUMAN BODY
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'MuscularHumanAnatomy';

  // Head & Neck
  const headGeom = new THREE.SphereGeometry(0.115, 20, 20);
  headGeom.scale(0.85, 1.15, 0.95);
  bodyGroup.add(makeSkinnedPart(headGeom, 4, null, anatomicalBodyMat, 'Head'));

  const neckGeom = new THREE.CylinderGeometry(0.065, 0.075, 0.14, 16);
  neckGeom.translate(0, 0.07, 0);
  bodyGroup.add(makeSkinnedPart(neckGeom, 3, null, anatomicalBodyMat, 'Neck'));

  // Torso / Spine / Ribcage
  const coreGeom = new THREE.CylinderGeometry(0.19, 0.155, 0.46, 20, 10);
  coreGeom.translate(0, 0.23, -0.01);
  coreGeom.scale(1.15, 1.0, 0.85);
  bodyGroup.add(makeSkinnedPart(coreGeom, 1, 2, anatomicalBodyMat, 'TorsoCore'));

  // Pelvis / Hips
  const pelvisGeom = new THREE.CylinderGeometry(0.165, 0.145, 0.18, 18);
  pelvisGeom.translate(0, -0.05, 0);
  pelvisGeom.scale(1.15, 1.0, 0.9);
  bodyGroup.add(makeSkinnedPart(pelvisGeom, 0, null, anatomicalBodyMat, 'Pelvis'));

  // *** TARGET MUSCLE: UPPER CHEST (Clavicular Pectoralis Major) - RED ***
  const upperLGeom = new THREE.BoxGeometry(0.15, 0.09, 0.08, 4, 4, 4);
  upperLGeom.rotateZ(-0.18);
  upperLGeom.translate(0.09, 0.15, 0.11);
  bodyGroup.add(makeSkinnedPart(upperLGeom, 2, null, primaryUpperChestMat, 'Muscle_UpperChest_L'));

  const upperRGeom = new THREE.BoxGeometry(0.15, 0.09, 0.08, 4, 4, 4);
  upperRGeom.rotateZ(0.18);
  upperRGeom.translate(-0.09, 0.15, 0.11);
  bodyGroup.add(makeSkinnedPart(upperRGeom, 2, null, primaryUpperChestMat, 'Muscle_UpperChest_R'));

  // Middle & Lower Chest (Neutral / Graphite)
  const midLGeom = new THREE.BoxGeometry(0.15, 0.11, 0.08, 4, 4, 4);
  midLGeom.translate(0.09, 0.05, 0.11);
  bodyGroup.add(makeSkinnedPart(midLGeom, 2, null, anatomicalBodyMat, 'Muscle_MiddleChest_L'));

  const midRGeom = new THREE.BoxGeometry(0.15, 0.11, 0.08, 4, 4, 4);
  midRGeom.translate(-0.09, 0.05, 0.11);
  bodyGroup.add(makeSkinnedPart(midRGeom, 2, null, anatomicalBodyMat, 'Muscle_MiddleChest_R'));

  const lowerChestGeom = new THREE.BoxGeometry(0.28, 0.07, 0.07, 4, 4, 4);
  lowerChestGeom.translate(0, -0.04, 0.10);
  bodyGroup.add(makeSkinnedPart(lowerChestGeom, 2, 1, anatomicalBodyMat, 'Muscle_LowerChest'));

  // *** SECONDARY MUSCLES: ANTERIOR DELTOIDS - ORANGE ***
  const deltLGeom = new THREE.SphereGeometry(0.085, 16, 16);
  deltLGeom.scale(0.9, 1.25, 1.0);
  deltLGeom.translate(0.02, 0, 0.02);
  bodyGroup.add(makeSkinnedPart(deltLGeom, 5, 6, secondaryMuscleMat, 'Muscle_AnteriorDeltoid_L'));

  const deltRGeom = new THREE.SphereGeometry(0.085, 16, 16);
  deltRGeom.scale(0.9, 1.25, 1.0);
  deltRGeom.translate(-0.02, 0, 0.02);
  bodyGroup.add(makeSkinnedPart(deltRGeom, 9, 10, secondaryMuscleMat, 'Muscle_AnteriorDeltoid_R'));

  // *** SECONDARY MUSCLES: TRICEPS BRACHII - ORANGE ***
  function makeLimb(radiusTop, radiusBot, length, boneA, boneB, mat, name) {
    const geom = new THREE.CylinderGeometry(radiusTop, radiusBot, length, 14, 8);
    geom.translate(0, length / 2, 0);
    return makeSkinnedPart(geom, boneA, boneB, mat, name);
  }

  const armL = makeLimb(0.07, 0.058, 0.28, 6, 7, secondaryMuscleMat, 'Muscle_Triceps_L');
  armL.rotation.z = -Math.PI / 2;
  bodyGroup.add(armL);

  const armR = makeLimb(0.07, 0.058, 0.28, 10, 11, secondaryMuscleMat, 'Muscle_Triceps_R');
  armR.rotation.z = Math.PI / 2;
  bodyGroup.add(armR);

  // Forearms & Hands
  const foreL = makeLimb(0.054, 0.042, 0.26, 7, 8, anatomicalBodyMat, 'Forearm_L');
  foreL.rotation.z = -Math.PI / 2;
  bodyGroup.add(foreL);

  const foreR = makeLimb(0.054, 0.042, 0.26, 11, 12, anatomicalBodyMat, 'Forearm_R');
  foreR.rotation.z = Math.PI / 2;
  bodyGroup.add(foreR);

  const handGeom = new THREE.BoxGeometry(0.045, 0.075, 0.07);
  handGeom.translate(0, 0.04, 0);
  const handMeshL = makeSkinnedPart(handGeom.clone(), 8, null, anatomicalBodyMat, 'Hand_L');
  handMeshL.rotation.z = -Math.PI / 2;
  bodyGroup.add(handMeshL);

  const handMeshR = makeSkinnedPart(handGeom.clone(), 12, null, anatomicalBodyMat, 'Hand_R');
  handMeshR.rotation.z = Math.PI / 2;
  bodyGroup.add(handMeshR);

  // Thighs, Shins, Feet
  const thighL = makeLimb(0.098, 0.076, 0.45, 13, 14, anatomicalBodyMat, 'Thigh_L');
  thighL.rotation.x = Math.PI;
  bodyGroup.add(thighL);

  const thighR = makeLimb(0.098, 0.076, 0.45, 16, 17, anatomicalBodyMat, 'Thigh_R');
  thighR.rotation.x = Math.PI;
  bodyGroup.add(thighR);

  const shinL = makeLimb(0.072, 0.054, 0.44, 14, 15, anatomicalBodyMat, 'Shin_L');
  shinL.rotation.x = Math.PI;
  bodyGroup.add(shinL);

  const shinR = makeLimb(0.072, 0.054, 0.44, 17, 18, anatomicalBodyMat, 'Shin_R');
  shinR.rotation.x = Math.PI;
  bodyGroup.add(shinR);

  const footGeom = new THREE.BoxGeometry(0.09, 0.06, 0.2);
  footGeom.translate(0, -0.03, 0.06);
  bodyGroup.add(makeSkinnedPart(footGeom.clone(), 15, null, anatomicalBodyMat, 'Foot_L'));
  bodyGroup.add(makeSkinnedPart(footGeom.clone(), 18, null, anatomicalBodyMat, 'Foot_R'));

  scene.add(bodyGroup);

  /**
   * 4. REALISTIC 30° INCLINE BENCH
   * Matching Reference Image: White steel tubular frame, black leather pads
   */
  const benchGroup = new THREE.Group();
  benchGroup.name = 'Incline_Bench_30deg';

  // Flat/slight-tilt seat pad
  const seatPad = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.065, 0.38), benchLeatherMat);
  seatPad.position.set(0, 0.48, -0.12);
  benchGroup.add(seatPad);

  // 30-degree incline backrest pad (length 0.95m)
  const backrestPad = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.065, 0.96), benchLeatherMat);
  backrestPad.rotation.x = -INCLINE_RAD;
  // Center of backrest positioned along the 30° incline line
  const backrestCenterDist = 0.48;
  backrestPad.position.set(
    0,
    0.48 + backrestCenterDist * Math.sin(INCLINE_RAD),
    -0.12 + backrestCenterDist * Math.cos(INCLINE_RAD)
  );
  benchGroup.add(backrestPad);

  // Incline support frame (White steel)
  // Main spine beam under backrest
  const spineBeam = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.94), benchFrameMat);
  spineBeam.rotation.x = -INCLINE_RAD;
  spineBeam.position.copy(backrestPad.position);
  spineBeam.position.y -= 0.06;
  benchGroup.add(spineBeam);

  // Front base stabilizer
  const frontBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.08), benchFrameMat);
  frontBase.position.set(0, 0.03, -0.28);
  benchGroup.add(frontBase);

  // Front vertical post
  const frontPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.08), benchFrameMat);
  frontPost.position.set(0, 0.25, -0.22);
  benchGroup.add(frontPost);

  // Rear base stabilizer
  const rearBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.08), benchFrameMat);
  rearBase.position.set(0, 0.03, 0.72);
  benchGroup.add(rearBase);

  // Rear vertical / diagonal support strut
  const rearPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), benchFrameMat);
  rearPost.position.set(0, 0.40, 0.58);
  benchGroup.add(rearPost);

  scene.add(benchGroup);

  /**
   * 5. REALISTIC DUMBBELLS (Attached directly to hands)
   */
  function createDumbbell() {
    const db = new THREE.Group();
    db.name = 'Dumbbell';

    // Knurled chrome handle (horizontal along hand grip)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.24, 16), chromeHandleMat);
    handle.rotation.z = Math.PI / 2;
    db.add(handle);

    // Cast iron round weighted plates (outer and inner)
    function makePlateCluster(xPos) {
      const pCluster = new THREE.Group();
      pCluster.position.x = xPos;

      const innerPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.035, 24), dumbbellPlateMat);
      innerPlate.rotation.z = Math.PI / 2;
      pCluster.add(innerPlate);

      const outerPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.045, 24), dumbbellPlateMat);
      outerPlate.rotation.z = Math.PI / 2;
      outerPlate.position.x = xPos > 0 ? 0.04 : -0.04;
      pCluster.add(outerPlate);

      return pCluster;
    }

    db.add(makePlateCluster(0.09));
    db.add(makePlateCluster(-0.09));
    return db;
  }

  // Attach dumbbells to Hand_L (bone index 8) and Hand_R (bone index 12)
  const dbLeft = createDumbbell();
  bones[8].add(dbLeft);

  const dbRight = createDumbbell();
  bones[12].add(dbRight);

  /**
   * 6. SKELETAL ANIMATION CLIP (6.0 Seconds Loop)
   * Exact Timing Requirement:
   * - 3.0s Lowering (eccentric phase from top lockout down to upper chest)
   * - 2.0s Pressing (concentric phase pushing upward along converging arc)
   * - 1.0s Top hold (peak squeeze on upper chest fibers)
   * Keyframe timeline:
   * t = 0.0s (Top position)
   * t = 3.0s (Bottom stretch position)
   * t = 5.0s (Back to top)
   * t = 6.0s (Hold at top, seamless loop to 0.0s)
   */
  const times = [0.0, 1.0, 2.0, 3.0, 3.5, 4.5, 5.0, 5.5, 6.0];
  const tracks = [];

  // Helper for rotational keyframes
  function makeTrack(boneName, eulerFrames) {
    const quatVals = [];
    for (const euler of eulerFrames) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler[0], euler[1], euler[2]));
      quatVals.push(q.x, q.y, q.z, q.w);
    }
    return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, quatVals);
  }

  // Root & Chest stable along the 30° incline pad
  tracks.push(makeTrack('Hips', Array(9).fill([-INCLINE_RAD, 0, 0])));
  // Subtle chest elevation during bottom stretch / press
  const chestNormal = [-0.05, 0, 0];
  const chestExpanded = [-0.10, 0, 0];
  tracks.push(makeTrack('Chest', [
    chestNormal, chestNormal, chestExpanded, chestExpanded, chestExpanded, chestNormal, chestNormal, chestNormal, chestNormal
  ]));

  // Legs stable and grounded on the floor
  tracks.push(makeTrack('UpperLeg_L', Array(9).fill([INCLINE_RAD + 0.35, 0, 0.22])));
  tracks.push(makeTrack('UpperLeg_R', Array(9).fill([INCLINE_RAD + 0.35, 0, -0.22])));
  tracks.push(makeTrack('LowerLeg_L', Array(9).fill([-0.95, 0, 0])));
  tracks.push(makeTrack('LowerLeg_R', Array(9).fill([-0.95, 0, 0])));

  // ARM MOVEMENT BIOMECHANICS:
  // Top: Arms extended over upper chest at 30° incline, palms angled 45° inward, elbows soft (~15° flexion)
  // Bottom: Dumbbells lowered beside outer upper chest, elbows tucked ~55° to torso, deep stretch on clavicular pectorals
  const armL_Top = [0.82, 0.38, -0.28];
  const armL_Mid = [0.55, 0.58, -0.62];
  const armL_Bottom = [0.22, 0.78, -0.92];

  const armR_Top = [0.82, -0.38, 0.28];
  const armR_Mid = [0.55, -0.58, 0.62];
  const armR_Bottom = [0.22, -0.78, 0.92];

  // Forearm flexions (Elbows bending from 20° at top to 90° at bottom)
  const foreL_Top = [0.32, 0, 0.08];
  const foreL_Mid = [0.95, 0, 0.14];
  const foreL_Bottom = [1.58, 0, 0.18];

  const foreR_Top = [0.32, 0, -0.08];
  const foreR_Mid = [0.95, 0, -0.14];
  const foreR_Bottom = [1.58, 0, -0.18];

  // Keyframes across 6.0 seconds:
  // 0.0s (Top) -> 1.0s -> 2.0s -> 3.0s (Bottom stretch) -> 3.5s -> 4.5s -> 5.0s (Top) -> 5.5s -> 6.0s (Top hold)
  const armL_Frames = [
    armL_Top,     // 0.0s
    armL_Mid,     // 1.0s
    armL_Bottom,  // 2.0s
    armL_Bottom,  // 3.0s (Bottom stretch peak)
    armL_Mid,     // 3.5s
    armL_Top,     // 4.5s
    armL_Top,     // 5.0s (Lockout top reached)
    armL_Top,     // 5.5s (Holding peak squeeze)
    armL_Top      // 6.0s
  ];

  const armR_Frames = [
    armR_Top,     // 0.0s
    armR_Mid,     // 1.0s
    armR_Bottom,  // 2.0s
    armR_Bottom,  // 3.0s
    armR_Mid,     // 3.5s
    armR_Top,     // 4.5s
    armR_Top,     // 5.0s
    armR_Top,     // 5.5s
    armR_Top      // 6.0s
  ];

  const foreL_Frames = [
    foreL_Top,    // 0.0s
    foreL_Mid,    // 1.0s
    foreL_Bottom, // 2.0s
    foreL_Bottom, // 3.0s
    foreL_Mid,    // 3.5s
    foreL_Top,    // 4.5s
    foreL_Top,    // 5.0s
    foreL_Top,    // 5.5s
    foreL_Top     // 6.0s
  ];

  const foreR_Frames = [
    foreR_Top,    // 0.0s
    foreR_Mid,    // 1.0s
    foreR_Bottom, // 2.0s
    foreR_Bottom, // 3.0s
    foreR_Mid,    // 3.5s
    foreR_Top,    // 4.5s
    foreR_Top,    // 5.0s
    foreR_Top,    // 5.5s
    foreR_Top     // 6.0s
  ];

  tracks.push(makeTrack('UpperArm_L', armL_Frames));
  tracks.push(makeTrack('UpperArm_R', armR_Frames));
  tracks.push(makeTrack('Forearm_L', foreL_Frames));
  tracks.push(makeTrack('Forearm_R', foreR_Frames));

  // Neutral wrists (dumbbells stable in hands)
  const wristL = [0.15, 0, 0.1];
  const wristR = [0.15, 0, -0.1];
  tracks.push(makeTrack('Hand_L', Array(9).fill(wristL)));
  tracks.push(makeTrack('Hand_R', Array(9).fill(wristR)));

  const clip = new THREE.AnimationClip('incline_dumbbell_press_action', 6.0, tracks);

  // 7. EXPORT GLB ASSET
  const exporter = new GLTFExporter();
  const glbPromise = new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (buffer) => resolve(buffer),
      (error) => reject(error),
      {
        binary: true,
        animations: [clip],
        embedImages: true
      }
    );
  });

  try {
    const glbBuffer = await glbPromise;
    const targetPath = path.join(outputDir, 'incline_dumbbell_press.glb');
    fs.writeFileSync(targetPath, Buffer.from(glbBuffer));
    console.log(`[Success] Generated incline_dumbbell_press.glb (${(glbBuffer.byteLength / 1024).toFixed(1)} KB)`);

    // Also copy to dist if dist exists
    const distPath = path.resolve(__dirname, '../dist/exercises/incline_dumbbell_press.glb');
    if (fs.existsSync(path.dirname(distPath))) {
      fs.writeFileSync(distPath, Buffer.from(glbBuffer));
      console.log(`[Success] Copied to dist/exercises/incline_dumbbell_press.glb`);
    }
  } catch (err) {
    console.error('[Error] Failed to generate GLB:', err);
  }
}

main().catch(console.error);

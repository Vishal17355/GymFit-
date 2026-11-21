/**
 * Procedural Rigged Humanoid & Skeletal Animation Generator
 * Creates realistic athletic rigged human characters with real skeletal animation clips
 * and exports them as binary .glb files into frontend/public/exercises/
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

  console.log('[Generator] Building Rigged 3D Exercise Character Models with Skeletal Animations...');

  /**
   * Helper to create a humanoid skeleton
   */
  function createHumanoidRig() {
    const root = new THREE.Bone();
    root.name = 'Hips';
    root.position.set(0, 1.0, 0);

    const spine = new THREE.Bone();
    spine.name = 'Spine';
    spine.position.set(0, 0.25, 0);
    root.add(spine);

    const chest = new THREE.Bone();
    chest.name = 'Chest';
    chest.position.set(0, 0.25, 0);
    spine.add(chest);

    const neck = new THREE.Bone();
    neck.name = 'Neck';
    neck.position.set(0, 0.2, 0);
    chest.add(neck);

    const head = new THREE.Bone();
    head.name = 'Head';
    head.position.set(0, 0.15, 0);
    neck.add(head);

    // Left Arm
    const shoulderL = new THREE.Bone();
    shoulderL.name = 'Shoulder_L';
    shoulderL.position.set(0.2, 0.15, 0);
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
    handL.position.set(0.25, 0, 0);
    forearmL.add(handL);

    // Right Arm
    const shoulderR = new THREE.Bone();
    shoulderR.name = 'Shoulder_R';
    shoulderR.position.set(-0.2, 0.15, 0);
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
    handR.position.set(-0.25, 0, 0);
    forearmR.add(handR);

    // Left Leg
    const upperLegL = new THREE.Bone();
    upperLegL.name = 'UpperLeg_L';
    upperLegL.position.set(0.12, -0.05, 0);
    root.add(upperLegL);

    const lowerLegL = new THREE.Bone();
    lowerLegL.name = 'LowerLeg_L';
    lowerLegL.position.set(0, -0.45, 0);
    upperLegL.add(lowerLegL);

    const footL = new THREE.Bone();
    footL.name = 'Foot_L';
    footL.position.set(0, -0.45, 0.1);
    lowerLegL.add(footL);

    // Right Leg
    const upperLegR = new THREE.Bone();
    upperLegR.name = 'UpperLeg_R';
    upperLegR.position.set(-0.12, -0.05, 0);
    root.add(upperLegR);

    const lowerLegR = new THREE.Bone();
    lowerLegR.name = 'LowerLeg_R';
    lowerLegR.position.set(0, -0.45, 0);
    upperLegR.add(lowerLegR);

    const footR = new THREE.Bone();
    footR.name = 'Foot_R';
    footR.position.set(0, -0.45, 0.1);
    lowerLegR.add(footR);

    const bones = [
      root,
      spine,
      chest,
      neck,
      head,
      shoulderL,
      upperArmL,
      forearmL,
      handL,
      shoulderR,
      upperArmR,
      forearmR,
      handR,
      upperLegL,
      lowerLegL,
      footL,
      upperLegR,
      lowerLegR,
      footR
    ];

    const skeleton = new THREE.Skeleton(bones);
    return { root, bones, skeleton };
  }

  /**
   * Builds an athletic character mesh bound to the skeleton
   */
  function buildAthleticCharacter(bones, skeleton, propsType = 'dumbbell') {
    const group = new THREE.Group();

    // Body Material: Sleek athletic graphite & biomechanical glow
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.15
    });

    const muscleHighlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.2
    });

    const propMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });

    // Helper to create a skinned cylinder/capsule for a limb
    function createLimbMesh(radiusTop, radiusBottom, height, boneIndexA, boneIndexB, material = skinMaterial) {
      const geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 14, 8);
      geom.translate(0, height / 2, 0);

      const pos = geom.attributes.position;
      const skinIndices = [];
      const skinWeights = [];

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const weightB = Math.max(0, Math.min(1, y / height));
        const weightA = 1 - weightB;

        skinIndices.push(boneIndexA, boneIndexB, 0, 0);
        skinWeights.push(weightA, weightB, 0, 0);
      }

      geom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
      geom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

      const skinnedMesh = new THREE.SkinnedMesh(geom, material);
      skinnedMesh.castShadow = true;
      skinnedMesh.receiveShadow = true;
      skinnedMesh.bind(skeleton);
      return skinnedMesh;
    }

    // Build Head
    const headGeom = new THREE.SphereGeometry(0.11, 16, 16);
    headGeom.scale(0.85, 1.15, 0.95);
    const headSkinIndices = [];
    const headSkinWeights = [];
    for (let i = 0; i < headGeom.attributes.position.count; i++) {
      headSkinIndices.push(4, 0, 0, 0); // Head bone index 4
      headSkinWeights.push(1, 0, 0, 0);
    }
    headGeom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(headSkinIndices, 4));
    headGeom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(headSkinWeights, 4));
    const headMesh = new THREE.SkinnedMesh(headGeom, skinMaterial);
    headMesh.bind(skeleton);
    group.add(headMesh);

    // Build Torso (Chest & Spine)
    const torsoGeom = new THREE.BoxGeometry(0.38, 0.5, 0.22, 6, 8, 6);
    torsoGeom.translate(0, 0.25, 0);
    const torsoSkinIndices = [];
    const torsoSkinWeights = [];
    for (let i = 0; i < torsoGeom.attributes.position.count; i++) {
      const y = torsoGeom.attributes.position.getY(i);
      const isChest = y > 0.25;
      torsoSkinIndices.push(isChest ? 2 : 1, 0, 0, 0); // 2: Chest, 1: Spine
      torsoSkinWeights.push(1, 0, 0, 0);
    }
    torsoGeom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(torsoSkinIndices, 4));
    torsoGeom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(torsoSkinWeights, 4));
    const torsoMesh = new THREE.SkinnedMesh(
      torsoGeom,
      propsType === 'bench' ? muscleHighlightMaterial : skinMaterial
    );
    torsoMesh.bind(skeleton);
    group.add(torsoMesh);

    // Build Upper Arms
    const upperArmMat = propsType === 'dumbbell' ? muscleHighlightMaterial : skinMaterial;
    const armL = createLimbMesh(0.065, 0.055, 0.28, 6, 7, upperArmMat);
    armL.rotation.z = -Math.PI / 2;
    group.add(armL);

    const armR = createLimbMesh(0.065, 0.055, 0.28, 10, 11, upperArmMat);
    armR.rotation.z = Math.PI / 2;
    group.add(armR);

    // Build Forearms
    const forearmL = createLimbMesh(0.052, 0.042, 0.26, 7, 8, skinMaterial);
    forearmL.rotation.z = -Math.PI / 2;
    group.add(forearmL);

    const forearmR = createLimbMesh(0.052, 0.042, 0.26, 11, 12, skinMaterial);
    forearmR.rotation.z = Math.PI / 2;
    group.add(forearmR);

    // Build Thighs & Shins
    const legMat = propsType === 'squat' ? muscleHighlightMaterial : skinMaterial;
    const thighL = createLimbMesh(0.09, 0.07, 0.45, 13, 14, legMat);
    thighL.rotation.x = Math.PI;
    group.add(thighL);

    const thighR = createLimbMesh(0.09, 0.07, 0.45, 16, 17, legMat);
    thighR.rotation.x = Math.PI;
    group.add(thighR);

    const shinL = createLimbMesh(0.07, 0.05, 0.45, 14, 15, skinMaterial);
    shinL.rotation.x = Math.PI;
    group.add(shinL);

    const shinR = createLimbMesh(0.07, 0.05, 0.45, 17, 18, skinMaterial);
    shinR.rotation.x = Math.PI;
    group.add(shinR);

    // Add Equipment Props
    if (propsType === 'dumbbell') {
      // Dumbbells attached to hands
      const makeDumbbell = () => {
        const dbGroup = new THREE.Group();
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), propMaterial);
        handle.rotation.z = Math.PI / 2;
        dbGroup.add(handle);

        const plate1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), propMaterial);
        plate1.rotation.z = Math.PI / 2;
        plate1.position.x = 0.09;
        dbGroup.add(plate1);

        const plate2 = plate1.clone();
        plate2.position.x = -0.09;
        dbGroup.add(plate2);
        return dbGroup;
      };

      const dbL = makeDumbbell();
      bones[8].add(dbL); // Hand_L
      const dbR = makeDumbbell();
      bones[12].add(dbR); // Hand_R
    } else if (propsType === 'barbell' || propsType === 'bench' || propsType === 'squat') {
      const barGeom = new THREE.CylinderGeometry(0.016, 0.016, 1.4, 12);
      barGeom.rotateZ(Math.PI / 2);
      const bar = new THREE.Mesh(barGeom, propMaterial);

      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), muscleHighlightMaterial);
      pL.rotateZ(Math.PI / 2);
      pL.position.x = 0.6;
      bar.add(pL);

      const pR = pL.clone();
      pR.position.x = -0.6;
      bar.add(pR);

      if (propsType === 'squat') {
        bones[2].add(bar); // Chest / Traps
        bar.position.set(0, 0.15, -0.12);
      } else {
        bones[8].add(bar); // Attached across hands
      }
    }

    return group;
  }

  /**
   * 1. BICEP CURL ANIMATION
   */
  function createBicepCurlAnimation() {
    const times = [0.0, 0.6, 1.5, 2.0, 3.2, 4.0];
    const tracks = [];

    // Upper arms held stable by ribs
    const qArmL_0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.35));
    const qArmR_0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.35));
    tracks.push(
      new THREE.QuaternionKeyframeTrack(
        'UpperArm_L.quaternion',
        [0, 4],
        [qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w, qArmL_0.x, qArmL_0.y, qArmL_0.z, qArmL_0.w]
      )
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack(
        'UpperArm_R.quaternion',
        [0, 4],
        [qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w, qArmR_0.x, qArmR_0.y, qArmR_0.z, qArmR_0.w]
      )
    );

    // Forearms curl from 0° (extended) to 135° (peak flexion)
    const qForearmL_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qForearmL_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(2.2, 0, 0.3));

    const qForearmR_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qForearmR_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(2.2, 0, -0.3));

    const fL_vals = [];
    const fR_vals = [];
    const keyframes = [
      qForearmL_down,
      qForearmL_down,
      qForearmL_up,
      qForearmL_up,
      qForearmL_down,
      qForearmL_down
    ];
    const keyframesR = [
      qForearmR_down,
      qForearmR_down,
      qForearmR_up,
      qForearmR_up,
      qForearmR_down,
      qForearmR_down
    ];

    for (let i = 0; i < times.length; i++) {
      fL_vals.push(keyframes[i].x, keyframes[i].y, keyframes[i].z, keyframes[i].w);
      fR_vals.push(keyframesR[i].x, keyframesR[i].y, keyframesR[i].z, keyframesR[i].w);
    }

    tracks.push(new THREE.QuaternionKeyframeTrack('Forearm_L.quaternion', times, fL_vals));
    tracks.push(new THREE.QuaternionKeyframeTrack('Forearm_R.quaternion', times, fR_vals));

    // Slight chest elevation during peak squeeze
    const chest_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const chest_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.08, 0, 0));
    tracks.push(
      new THREE.QuaternionKeyframeTrack('Chest.quaternion', times, [
        chest_down.x,
        chest_down.y,
        chest_down.z,
        chest_down.w,
        chest_down.x,
        chest_down.y,
        chest_down.z,
        chest_down.w,
        chest_up.x,
        chest_up.y,
        chest_up.z,
        chest_up.w,
        chest_up.x,
        chest_up.y,
        chest_up.z,
        chest_up.w,
        chest_down.x,
        chest_down.y,
        chest_down.z,
        chest_down.w,
        chest_down.x,
        chest_down.y,
        chest_down.z,
        chest_down.w
      ])
    );

    return new THREE.AnimationClip('BicepCurl', 4.0, tracks);
  }

  /**
   * 2. BARBELL SQUAT ANIMATION
   */
  function createSquatAnimation() {
    const times = [0.0, 0.5, 1.8, 2.2, 3.5, 4.0];
    const tracks = [];

    // Hips drop down from 1.0m to 0.58m
    tracks.push(
      new THREE.VectorKeyframeTrack('Hips.position', times, [
        0, 1.0, 0,
        0, 1.0, 0,
        0, 0.58, -0.15,
        0, 0.58, -0.15,
        0, 1.0, 0,
        0, 1.0, 0
      ])
    );

    // Spine angle tilts forward to balance center of mass
    const spine_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const spine_deep = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.45, 0, 0));
    tracks.push(
      new THREE.QuaternionKeyframeTrack('Spine.quaternion', times, [
        spine_up.x, spine_up.y, spine_up.z, spine_up.w,
        spine_up.x, spine_up.y, spine_up.z, spine_up.w,
        spine_deep.x, spine_deep.y, spine_deep.z, spine_deep.w,
        spine_deep.x, spine_deep.y, spine_deep.z, spine_deep.w,
        spine_up.x, spine_up.y, spine_up.z, spine_up.w,
        spine_up.x, spine_up.y, spine_up.z, spine_up.w
      ])
    );

    // Thighs flex at hip
    const thigh_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const thigh_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.55, 0, 0.15));
    const thigh_downR = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.55, 0, -0.15));

    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperLeg_L.quaternion', times, [
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_down.x, thigh_down.y, thigh_down.z, thigh_down.w,
        thigh_down.x, thigh_down.y, thigh_down.z, thigh_down.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperLeg_R.quaternion', times, [
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_downR.x, thigh_downR.y, thigh_downR.z, thigh_downR.w,
        thigh_downR.x, thigh_downR.y, thigh_downR.z, thigh_downR.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w,
        thigh_up.x, thigh_up.y, thigh_up.z, thigh_up.w
      ])
    );

    // Knees bend
    const knee_straight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const knee_bent = new THREE.Quaternion().setFromEuler(new THREE.Euler(2.1, 0, 0));

    tracks.push(
      new THREE.QuaternionKeyframeTrack('LowerLeg_L.quaternion', times, [
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_bent.x, knee_bent.y, knee_bent.z, knee_bent.w,
        knee_bent.x, knee_bent.y, knee_bent.z, knee_bent.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('LowerLeg_R.quaternion', times, [
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_bent.x, knee_bent.y, knee_bent.z, knee_bent.w,
        knee_bent.x, knee_bent.y, knee_bent.z, knee_bent.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w,
        knee_straight.x, knee_straight.y, knee_straight.z, knee_straight.w
      ])
    );

    return new THREE.AnimationClip('BarbellSquat', 4.0, tracks);
  }

  /**
   * 3. BENCH PRESS ANIMATION
   */
  function createBenchPressAnimation() {
    const times = [0.0, 0.4, 1.8, 2.2, 3.6, 4.0];
    const tracks = [];

    // Character lies horizontal on bench
    const rootLying = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    tracks.push(
      new THREE.QuaternionKeyframeTrack('Hips.quaternion', [0, 4], [
        rootLying.x, rootLying.y, rootLying.z, rootLying.w,
        rootLying.x, rootLying.y, rootLying.z, rootLying.w
      ])
    );
    tracks.push(
      new THREE.VectorKeyframeTrack('Hips.position', [0, 4], [0, 0.55, 0, 0, 0.55, 0])
    );

    // Arms press upward towards chest contraction
    const armL_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.2));
    const armL_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, -1.8));

    const armR_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.2));
    const armR_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 1.8));

    const forearmL_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, 0, 0));
    const forearmL_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0));

    const forearmR_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, 0, 0));
    const forearmR_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0));

    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperArm_L.quaternion', times, [
        armL_up.x, armL_up.y, armL_up.z, armL_up.w,
        armL_down.x, armL_down.y, armL_down.z, armL_down.w,
        armL_down.x, armL_down.y, armL_down.z, armL_down.w,
        armL_up.x, armL_up.y, armL_up.z, armL_up.w,
        armL_up.x, armL_up.y, armL_up.z, armL_up.w,
        armL_up.x, armL_up.y, armL_up.z, armL_up.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperArm_R.quaternion', times, [
        armR_up.x, armR_up.y, armR_up.z, armR_up.w,
        armR_down.x, armR_down.y, armR_down.z, armR_down.w,
        armR_down.x, armR_down.y, armR_down.z, armR_down.w,
        armR_up.x, armR_up.y, armR_up.z, armR_up.w,
        armR_up.x, armR_up.y, armR_up.z, armR_up.w,
        armR_up.x, armR_up.y, armR_up.z, armR_up.w
      ])
    );

    tracks.push(
      new THREE.QuaternionKeyframeTrack('Forearm_L.quaternion', times, [
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w,
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w,
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w,
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w,
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w,
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('Forearm_R.quaternion', times, [
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w,
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w,
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w,
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w,
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w,
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w
      ])
    );

    return new THREE.AnimationClip('BenchPress', 4.0, tracks);
  }

  /**
   * 4. OVERHEAD SHOULDER PRESS ANIMATION
   */
  function createShoulderPressAnimation() {
    const times = [0.0, 0.5, 1.8, 2.2, 3.5, 4.0];
    const tracks = [];

    const armL_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.5));
    const armL_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -2.9));

    const armR_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.5));
    const armR_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 2.9));

    const forearmL_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.6, 0, 0));
    const forearmL_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0));

    const forearmR_down = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.6, 0, 0));
    const forearmR_up = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0));

    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperArm_L.quaternion', times, [
        armL_down.x, armL_down.y, armL_down.z, armL_down.w,
        armL_down.x, armL_down.y, armL_down.z, armL_down.w,
        armL_up.x, armL_up.y, armL_up.z, armL_up.w,
        armL_up.x, armL_up.y, armL_up.z, armL_up.w,
        armL_down.x, armL_down.y, armL_down.z, armL_down.w,
        armL_down.x, armL_down.y, armL_down.z, armL_down.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('UpperArm_R.quaternion', times, [
        armR_down.x, armR_down.y, armR_down.z, armR_down.w,
        armR_down.x, armR_down.y, armR_down.z, armR_down.w,
        armR_up.x, armR_up.y, armR_up.z, armR_up.w,
        armR_up.x, armR_up.y, armR_up.z, armR_up.w,
        armR_down.x, armR_down.y, armR_down.z, armR_down.w,
        armR_down.x, armR_down.y, armR_down.z, armR_down.w
      ])
    );

    tracks.push(
      new THREE.QuaternionKeyframeTrack('Forearm_L.quaternion', times, [
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w,
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w,
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w,
        forearmL_up.x, forearmL_up.y, forearmL_up.z, forearmL_up.w,
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w,
        forearmL_down.x, forearmL_down.y, forearmL_down.z, forearmL_down.w
      ])
    );
    tracks.push(
      new THREE.QuaternionKeyframeTrack('Forearm_R.quaternion', times, [
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w,
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w,
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w,
        forearmR_up.x, forearmR_up.y, forearmR_up.z, forearmR_up.w,
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w,
        forearmR_down.x, forearmR_down.y, forearmR_down.z, forearmR_down.w
      ])
    );

    return new THREE.AnimationClip('ShoulderPress', 4.0, tracks);
  }

  // Export helper
  async function exportExerciseGLB(filename, propType, createAnimFn) {
    const { root, bones, skeleton } = createHumanoidRig();
    const characterMesh = buildAthleticCharacter(bones, skeleton, propType);

    const scene = new THREE.Scene();
    scene.add(root);
    scene.add(characterMesh);

    const clip = createAnimFn();
    const exporter = new GLTFExporter();

    const glbBuffer = await exporter.parseAsync(scene, {
      binary: true,
      animations: [clip]
    });

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, Buffer.from(glbBuffer));
    console.log(`[Generator] Created ${filename} (${(glbBuffer.byteLength / 1024).toFixed(1)} KB)`);
  }

  // Generate 4 primary foundational exercise models
  await exportExerciseGLB('bicep_curl.glb', 'dumbbell', createBicepCurlAnimation);
  await exportExerciseGLB('barbell_squat.glb', 'squat', createSquatAnimation);
  await exportExerciseGLB('bench_press.glb', 'bench', createBenchPressAnimation);
  await exportExerciseGLB('shoulder_press.glb', 'dumbbell', createShoulderPressAnimation);

  console.log('[Generator] All 4 Rigged Animated 3D Exercise GLBs generated successfully!');
}

main().catch((err) => {
  console.error('[Generator Error]', err);
  process.exit(1);
});

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Precise anatomical mapping between raw GLB mesh names and UI muscle groups.
 * Every muscle is assigned based on actual BodyParts3D/Z-Anatomy identifiers.
 */
export function getGymFitBodyPart(rawName) {
  if (!rawName) return { bodyPart: 'Other', subdivision: null };
  const n = rawName.toLowerCase().replace(/_/g, ' ').trim();

  // 1. CHEST: Upper Chest, Middle Chest, Lower Chest
  if (n.includes('pectoralis') || n.includes('subclavius') || n.includes('serratus anterior')) {
    let sub = 'Middle Chest';
    if (n.includes('clavicular') || n.includes('subclavius') || n.includes('minor')) {
      sub = 'Upper Chest';
    } else if (n.includes('sternocostal')) {
      sub = 'Middle Chest';
    } else if (n.includes('abdominal') || n.includes('serratus')) {
      sub = 'Lower Chest';
    }
    return { bodyPart: 'Chest', subdivision: sub };
  }

  // 2. BACK: Upper Back, Middle Back, Lower Back, Lats
  if (
    n.includes('trapezius') ||
    n.includes('latissimus') ||
    n.includes('rhomboid') ||
    n.includes('levator scapulae') ||
    n.includes('erector') ||
    n.includes('iliocostalis') ||
    n.includes('longissimus') ||
    n.includes('spinalis') ||
    n.includes('splenius') ||
    n.includes('quadratus lumborum') ||
    n.includes('serratus posterior') ||
    n.includes('infraspinatus') ||
    n.includes('supraspinatus') ||
    n.includes('teres major') ||
    n.includes('teres minor') ||
    n.includes('subscapularis') ||
    n.includes('multifidus')
  ) {
    let sub = 'Upper Back';
    if (n.includes('latissimus')) {
      sub = 'Lats';
    } else if (n.includes('teres') || n.includes('infraspinatus') || n.includes('supraspinatus') || n.includes('subscapularis')) {
      sub = 'Middle Back';
    } else if (
      n.includes('erector') ||
      n.includes('iliocostalis') ||
      n.includes('longissimus') ||
      n.includes('spinalis') ||
      n.includes('quadratus lumborum')
    ) {
      sub = 'Lower Back';
    }
    return { bodyPart: 'Back', subdivision: sub };
  }

  // 3. SHOULDERS: Front Delt, Side Delt, Rear Delt
  if (n.includes('deltoid')) {
    let sub = 'Side Delt';
    if (n.includes('clavicular') || n.includes('anterior')) {
      sub = 'Front Delt';
    } else if (n.includes('spinal') || n.includes('posterior')) {
      sub = 'Rear Delt';
    }
    return { bodyPart: 'Shoulders', subdivision: sub };
  }

  // 4. ARMS: BICEPS & TRICEPS
  if (
    (n.includes('biceps') && !n.includes('femoris')) ||
    (n.includes('brachialis') && !n.includes('brachioradialis')) ||
    n.includes('coracobrachialis')
  ) {
    let sub = 'Brachialis';
    if (n.includes('long head')) {
      sub = 'Long Head';
    } else if (n.includes('short head')) {
      sub = 'Short Head';
    }
    return { bodyPart: 'Biceps', subdivision: sub };
  }
  if (n.includes('triceps brachii') || n.includes('anconeus')) {
    let sub = 'Long Head';
    if (n.includes('lateral head')) {
      sub = 'Lateral Head';
    } else if (n.includes('medial head') || n.includes('anconeus')) {
      sub = 'Medial Head';
    }
    return { bodyPart: 'Triceps', subdivision: sub };
  }
  if (
    (n.includes('brachioradialis') ||
      n.includes('pronator') ||
      n.includes('supinator') ||
      n.includes('palmaris') ||
      ((n.includes('carpi') ||
        n.includes('digitorum') ||
        n.includes('pollicis') ||
        n.includes('indicis') ||
        n.includes('digiti minimi')) &&
        (n.includes('flexor') || n.includes('extensor') || n.includes('abductor')))) &&
    !n.includes('foot') &&
    !n.includes('pedis') &&
    !n.includes('hallucis') &&
    !n.includes('toe')
  ) {
    return { bodyPart: 'Arms', subdivision: 'Forearms' };
  }

  // 5. CALVES: Calves
  if (n.includes('gastrocnemius') || n.includes('soleus') || n.includes('plantaris') || n.includes('tibialis')) {
    let sub = 'Calves';
    if (n.includes('gastrocnemius')) sub = 'Gastrocnemius';
    else if (n.includes('soleus')) sub = 'Soleus';
    return { bodyPart: 'Calves', subdivision: sub };
  }

  // 6. LEGS: Quadriceps, Hamstrings, Glutes, Adductors, Abductors, Calves
  if (n.includes('rectus femoris') || n.includes('vastus') || n.includes('sartorius')) {
    return { bodyPart: 'Legs', subdivision: 'Quadriceps' };
  }
  if (n.includes('biceps femoris') || n.includes('semitendinosus') || n.includes('semimembranosus')) {
    return { bodyPart: 'Legs', subdivision: 'Hamstrings' };
  }
  if (n.includes('gluteus')) {
    return { bodyPart: 'Legs', subdivision: 'Glutes' };
  }
  if (n.includes('adductor') || n.includes('gracilis') || n.includes('pectineus')) {
    return { bodyPart: 'Legs', subdivision: 'Adductors' };
  }
  if (
    n.includes('tensor fasciae') ||
    n.includes('piriformis') ||
    n.includes('obturator') ||
    n.includes('gemellus') ||
    n.includes('quadratus femoris')
  ) {
    return { bodyPart: 'Legs', subdivision: 'Abductors' };
  }

  // 7. ABS: Rectus Abdominis, Obliques, Deep Core
  if (
    n === 'left rectus abdominis' ||
    n === 'right rectus abdominis' ||
    n.includes('rectus abdominis') ||
    n.includes('pyramidalis')
  ) {
    return { bodyPart: 'Abs', subdivision: 'Rectus Abdominis' };
  }
  if (
    n.includes('oblique') &&
    (n.includes('external') || n.includes('internal') || n.includes('abdom'))
  ) {
    return { bodyPart: 'Abs', subdivision: 'Obliques' };
  }
  if (n.includes('transversus abdominis')) {
    return { bodyPart: 'Abs', subdivision: 'Deep Core' };
  }

  return { bodyPart: 'Other', subdivision: null };
}

/**
 * Maps raw anatomical mesh names to legacy GymFit workout muscle groups.
 */
export function getGymFitMuscleGroup(rawName) {
  const { bodyPart, subdivision } = getGymFitBodyPart(rawName);
  if (bodyPart === 'Back') {
    if (subdivision === 'Upper Back') return 'Upper Back';
    if (subdivision === 'Middle Back') return 'Upper Back';
    if (subdivision === 'Lower Back') return 'Lower Back';
    if (subdivision === 'Lats') return 'Lats';
    return 'Upper Back';
  }
  if (bodyPart === 'Legs') {
    if (subdivision === 'Quadriceps') return 'Quadriceps';
    if (subdivision === 'Hamstrings') return 'Hamstrings';
    if (subdivision === 'Glutes') return 'Glutes';
    return 'Quadriceps';
  }
  return bodyPart;
}

/**
 * Format raw anatomical name into clean title case.
 */
export function formatMuscleName(name) {
  if (!name) return '';
  const lower = name.toLowerCase();
  if (lower.includes('rectus abdominis')) {
    const side = lower.includes('left') ? 'Left ' : lower.includes('right') ? 'Right ' : '';
    return `${side}Rectus Abdominis (Abs / 6-Pack)`;
  }
  if (lower.includes('external oblique')) {
    const side = lower.includes('left') ? 'Left ' : lower.includes('right') ? 'Right ' : '';
    return `${side}External Oblique`;
  }
  if (lower.includes('internal oblique')) {
    const side = lower.includes('left') ? 'Left ' : lower.includes('right') ? 'Right ' : '';
    return `${side}Internal Oblique`;
  }

  let clean = name.replace(/\s*\(\d+\)\s*$/, '').replace(/_/g, ' ').trim();

  const partMatch = clean.match(/^(.+?)\s+(part|head|belly)\s+of\s+(?:(left|right)\s+)?(.+)$/i);
  if (partMatch) {
    const qualifier = partMatch[1];
    const keyword = partMatch[2];
    const side = partMatch[3] ? partMatch[3].charAt(0).toUpperCase() + partMatch[3].slice(1) + ' ' : '';
    const muscle = partMatch[4];
    clean = `${side}${muscle} (${qualifier} ${keyword})`;
  }

  const smallWords = new Set(['of', 'the', 'and', 'in', 'at', 'to', 'for', 'on', 'by', 'or']);
  return clean
    .split(' ')
    .map((w, i) =>
      i > 0 && smallWords.has(w.toLowerCase())
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(' ');
}

/**
 * Applies BodyParts3D -> Three.js coordinate transform in place.
 * BP3D mm space: X=left-right, Y=front-back, Z=bottom-top
 * Three.js scene: X=left-right, Y=up, Z=front
 */
function transformGeometry(geometry, center, scaleFactor) {
  const posAttr = geometry.getAttribute('position');
  if (posAttr) {
    const pos = posAttr.array;
    for (let i = 0; i < pos.length; i += 3) {
      const bx = pos[i];
      const by = pos[i + 1];
      const bz = pos[i + 2];

      pos[i] = (bx - center.x) * scaleFactor;
      pos[i + 1] = (bz - center.z) * scaleFactor;
      pos[i + 2] = -(by - center.y) * scaleFactor;
    }
    posAttr.needsUpdate = true;
  }

  const normAttr = geometry.getAttribute('normal');
  if (normAttr) {
    const norms = normAttr.array;
    for (let i = 0; i < norms.length; i += 3) {
      const nx = norms[i];
      const ny = norms[i + 1];
      const nz = norms[i + 2];
      norms[i] = nx;
      norms[i + 1] = nz;
      norms[i + 2] = -ny;
    }
    normAttr.needsUpdate = true;
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
}

/**
 * Material presets
 */
export const defaultMuscleMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#b83a2b'),
  roughness: 0.52,
  metalness: 0.04,
  side: THREE.DoubleSide
});

// Sculpted athletic definition for the 6-pack abs (Rectus Abdominis)
export const absMuscleMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#bf2e1e'),
  roughness: 0.28, // lower roughness creates crisp specular highlights across the 6 abdominal packs
  metalness: 0.12,
  side: THREE.DoubleSide
});

export const tendonMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.92, 0.88, 0.80),
  roughness: 0.45,
  metalness: 0.0,
  side: THREE.DoubleSide
});

export const boneMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.94, 0.92, 0.86),
  roughness: 0.6,
  metalness: 0.0,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
  depthWrite: false
});

// Vivid glowing red for selected muscle/subdivision
export const selectedRedMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ef4444'),
  emissive: new THREE.Color('#dc2626'),
  emissiveIntensity: 0.9,
  roughness: 0.32,
  metalness: 0.08,
  side: THREE.DoubleSide
});

// Extra intense highlight for the active subdivision head
export const selectedSubdivisionMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#ff2222'),
  emissive: new THREE.Color('#ef4444'),
  emissiveIntensity: 1.15,
  roughness: 0.28,
  metalness: 0.1,
  side: THREE.DoubleSide
});

// Subtle secondary red for other heads of the selected body part
export const selectedGroupSubtleMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#e11d48'),
  emissive: new THREE.Color('#be123c'),
  emissiveIntensity: 0.45,
  roughness: 0.42,
  metalness: 0.05,
  side: THREE.DoubleSide
});

export const hoverMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#f87171'),
  emissive: new THREE.Color('#ef4444'),
  emissiveIntensity: 0.45,
  roughness: 0.4,
  metalness: 0.05,
  side: THREE.DoubleSide
});

// Cache for multi-colored anatomical subdivision materials
const subdivisionMaterialCache = new Map();

export function getSubdivisionMaterial(colorHex = '#ef4444', isSelected = false) {
  const key = `${colorHex}_${isSelected ? 'active' : 'idle'}`;
  if (!subdivisionMaterialCache.has(key)) {
    const col = new THREE.Color(colorHex);
    const mat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: isSelected ? 1.25 : 0.48,
      roughness: isSelected ? 0.25 : 0.42,
      metalness: isSelected ? 0.12 : 0.04,
      side: THREE.DoubleSide
    });
    subdivisionMaterialCache.set(key, mat);
  }
  return subdivisionMaterialCache.get(key);
}

/**
 * Loads both anatomy.glb (muscles/tendons) and skeleton.glb (bones).
 * Returns { bodyGroup, muscleMeshes, skeletonGroup, groupMeshMap, bodyBox, bodyCenter, bodySize }
 */
export function load3DAnatomyModel(onProgress) {
  return new Promise((resolve, reject) => {
    console.log('[3D Anatomy] Initiating GLB download for anatomy and skeleton...');
    const loader = new GLTFLoader();
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'HumanBodyAnatomy';

    const muscleMeshes = [];
    const skeletonGroup = new THREE.Group();
    skeletonGroup.name = 'SkeletalFramework';
    const groupMeshMap = {};

    bodyGroup.add(skeletonGroup);

    const baseUrl = import.meta.env?.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const anatomyUrl = `${cleanBase}anatomy3d/anatomy.glb`;
    const skeletonUrl = `${cleanBase}anatomy3d/skeleton.glb`;

    const loadGLB = (url, weight, basePct) =>
      new Promise((res, rej) => {
        loader.load(
          url,
          (gltf) => {
            console.log(`[3D Anatomy] Successfully parsed GLTF from: ${url}`);
            res(gltf);
          },
          (evt) => {
            if (evt.total > 0 && onProgress) {
              const current = basePct + Math.round((evt.loaded / evt.total) * weight);
              onProgress(Math.min(99, current));
            }
          },
          (err) => {
            console.error(`[3D Anatomy] Error fetching ${url}:`, err);
            rej(err);
          }
        );
      });

    // Load anatomy and skeleton
    Promise.all([
      loadGLB(anatomyUrl, 70, 0),
      loadGLB(skeletonUrl, 30, 70)
    ])
      .then(([anatomyGLTF, skeletonGLTF]) => {
        console.log('[3D Anatomy] Both GLB files downloaded. Processing geometries...');

        const anatomyRoot = anatomyGLTF.scene;
        const anatomyBox = new THREE.Box3().setFromObject(anatomyRoot);
        const anatomyCenter = anatomyBox.getCenter(new THREE.Vector3());
        const anatomySize = anatomyBox.getSize(new THREE.Vector3());

        const targetHeight = 30;
        const scaleFactor = targetHeight / (anatomySize.z || 1672);

        // 1. Process Anatomy (muscles and tendons)
        let muscleCount = 0;
        anatomyRoot.traverse((child) => {
          if (!child.isMesh) return;

          // GLTFLoader replaces spaces in node names with underscores.
          const rawName = child.name?.replace(/_/g, ' ') || `muscle_${muscleCount}`;
          const isTendon =
            rawName.toLowerCase().includes('tendon') ||
            rawName.toLowerCase().includes('ligament') ||
            rawName.toLowerCase().includes('retinaculum') ||
            rawName.toLowerCase().includes('membrane');

          const { bodyPart, subdivision } = getGymFitBodyPart(rawName);
          const gymFitGroup = getGymFitMuscleGroup(rawName);

          const geometry = child.geometry.clone();
          transformGeometry(geometry, anatomyCenter, scaleFactor);

          const isAbs = rawName.toLowerCase().includes('rectus abdominis');
          const mat = isTendon ? tendonMaterial : isAbs ? absMuscleMaterial : defaultMuscleMaterial;
          const mesh = new THREE.Mesh(geometry, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.renderOrder = 1;

          mesh.userData = {
            rawName,
            displayName: formatMuscleName(rawName),
            gymFitGroup,
            bodyPart,
            subdivision,
            isTendon,
            originalMaterial: mat
          };

          // Group indexing for fast access
          if (bodyPart) {
            if (!groupMeshMap[bodyPart]) groupMeshMap[bodyPart] = [];
            groupMeshMap[bodyPart].push(mesh);
          }
          if (subdivision) {
            if (!groupMeshMap[subdivision]) groupMeshMap[subdivision] = [];
            groupMeshMap[subdivision].push(mesh);
          }
          if (gymFitGroup && gymFitGroup !== bodyPart) {
            if (!groupMeshMap[gymFitGroup]) groupMeshMap[gymFitGroup] = [];
            groupMeshMap[gymFitGroup].push(mesh);
          }

          muscleMeshes.push(mesh);
          bodyGroup.add(mesh);
          muscleCount++;
        });

        console.log(`[3D Anatomy] Processed ${muscleCount} muscular meshes.`);

        // 2. Process Skeleton (bones)
        const skeletonRoot = skeletonGLTF.scene;
        let boneCount = 0;
        skeletonRoot.traverse((child) => {
          if (!child.isMesh) return;

          const geometry = child.geometry.clone();
          transformGeometry(geometry, anatomyCenter, scaleFactor);

          const boneMesh = new THREE.Mesh(geometry, boneMaterial);
          boneMesh.castShadow = false;
          boneMesh.receiveShadow = false;
          boneMesh.renderOrder = 0;

          boneMesh.userData = {
            rawName: child.name || `bone_${boneCount}`,
            displayName: formatMuscleName(child.name || `bone_${boneCount}`),
            isBone: true
          };

          skeletonGroup.add(boneMesh);
          boneCount++;
        });

        console.log(`[3D Anatomy] Processed ${boneCount} skeletal bone meshes.`);

        // 3. Final Bounding Box & Centering
        const bodyBox = new THREE.Box3().setFromObject(bodyGroup);
        const bodyCenter = bodyBox.getCenter(new THREE.Vector3());
        const bodySize = bodyBox.getSize(new THREE.Vector3());

        if (onProgress) onProgress(100);

        resolve({
          bodyGroup,
          muscleMeshes,
          skeletonGroup,
          groupMeshMap,
          bodyBox,
          bodyCenter,
          bodySize
        });
      })
      .catch((err) => {
        console.error('[3D Anatomy] Critical Error in load3DAnatomyModel:', err);
        reject(err);
      });
  });
}

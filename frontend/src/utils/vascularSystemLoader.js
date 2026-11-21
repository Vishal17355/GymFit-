import * as THREE from 'three';

/**
 * Creates a realistic cardiovascular circulatory network
 * Red arteries (oxygenated) & Blue veins (deoxygenated)
 * Anatomically mapped along human muscle surface contours.
 */
export function createRealisticVascularSystem() {
  const vascularGroup = new THREE.Group();
  vascularGroup.name = 'CardiovascularSystem';

  // Arterial Red Material (oxygenated crimson blood)
  const arteryMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#dc2626'),
    emissive: new THREE.Color('#991b1b'),
    emissiveIntensity: 0.35,
    roughness: 0.32,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  // Venous Blue Material (deoxygenated deep cobalt blue)
  const veinMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2563eb'),
    emissive: new THREE.Color('#1e40af'),
    emissiveIntensity: 0.38,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const makeVessel = (points, radius, material, name) => {
    if (!points || points.length < 2) return;
    const vectors = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(vectors);
    const geometry = new THREE.TubeGeometry(curve, 28, radius, 8, false);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.raycast = () => {}; // Never block raycasting on muscles underneath!
    vascularGroup.add(mesh);
  };

  // ═══════════════════════════════════════════════════════
  // RED ARTERIES (Oxygenated Cardiovascular Supply)
  // ═══════════════════════════════════════════════════════

  // 1. Aortic Arch & Thoracic Root
  makeVessel(
    [
      [0.0, 8.5, 0.42],
      [-0.15, 9.2, 0.45],
      [0.0, 9.6, 0.42],
      [0.2, 9.4, 0.38],
      [0.15, 8.8, 0.35]
    ],
    0.08,
    arteryMaterial,
    'AorticArch'
  );

  // 2. Left & Right Common Carotid Arteries (Neck)
  makeVessel(
    [
      [0.4, 9.6, 0.38],
      [0.55, 11.0, 0.35],
      [0.6, 12.5, 0.3],
      [0.65, 13.8, 0.22]
    ],
    0.05,
    arteryMaterial,
    'LeftCarotidArtery'
  );
  makeVessel(
    [
      [-0.4, 9.6, 0.38],
      [-0.55, 11.0, 0.35],
      [-0.6, 12.5, 0.3],
      [-0.65, 13.8, 0.22]
    ],
    0.05,
    arteryMaterial,
    'RightCarotidArtery'
  );

  // 3. Left Subclavian -> Brachial -> Radial Artery (Left Arm & Bicep)
  makeVessel(
    [
      [0.3, 9.4, 0.36],
      [1.4, 9.0, 0.32],
      [2.2, 8.0, 0.25],
      [2.8, 6.8, 0.18],
      [3.1, 5.2, 0.15],
      [3.3, 3.8, 0.2]
    ],
    0.055,
    arteryMaterial,
    'LeftBrachialArtery'
  );
  // Left Radial Artery (Forearm)
  makeVessel(
    [
      [3.3, 3.8, 0.2],
      [3.6, 2.5, 0.28],
      [3.9, 1.2, 0.35],
      [4.1, 0.2, 0.32]
    ],
    0.04,
    arteryMaterial,
    'LeftRadialArtery'
  );

  // 4. Right Subclavian -> Brachial -> Radial Artery (Right Arm & Bicep)
  makeVessel(
    [
      [-0.3, 9.4, 0.36],
      [-1.4, 9.0, 0.32],
      [-2.2, 8.0, 0.25],
      [-2.8, 6.8, 0.18],
      [-3.1, 5.2, 0.15],
      [-3.3, 3.8, 0.2]
    ],
    0.055,
    arteryMaterial,
    'RightBrachialArtery'
  );
  // Right Radial Artery (Forearm)
  makeVessel(
    [
      [-3.3, 3.8, 0.2],
      [-3.6, 2.5, 0.28],
      [-3.9, 1.2, 0.35],
      [-4.1, 0.2, 0.32]
    ],
    0.04,
    arteryMaterial,
    'RightRadialArtery'
  );

  // 5. Abdominal Aorta & Epigastric Arteries (Directly Supplying the 6 Abs)
  makeVessel(
    [
      [0.0, 8.5, 0.25],
      [0.0, 6.5, 0.22],
      [0.0, 4.5, 0.18],
      [0.0, 2.8, 0.15],
      [0.0, 1.0, 0.1]
    ],
    0.065,
    arteryMaterial,
    'AbdominalAorta'
  );
  // Left Superior & Inferior Epigastric Artery (Tracing the 3 left abs blocks)
  makeVessel(
    [
      [0.4, 6.8, 0.38],
      [0.65, 5.2, 0.42],
      [0.75, 3.8, 0.39],
      [0.68, 2.2, 0.32],
      [0.55, 0.8, 0.22]
    ],
    0.038,
    arteryMaterial,
    'LeftEpigastricArtery'
  );
  // Right Superior & Inferior Epigastric Artery (Tracing the 3 right abs blocks)
  makeVessel(
    [
      [-0.4, 6.8, 0.38],
      [-0.65, 5.2, 0.42],
      [-0.75, 3.8, 0.39],
      [-0.68, 2.2, 0.32],
      [-0.55, 0.8, 0.22]
    ],
    0.038,
    arteryMaterial,
    'RightEpigastricArtery'
  );

  // 6. Left & Right Common Iliac -> Femoral Arteries (Thighs / Quadriceps)
  makeVessel(
    [
      [0.2, 0.8, 0.12],
      [0.8, -0.2, 0.18],
      [1.3, -1.8, 0.36],
      [1.6, -3.8, 0.42],
      [1.7, -5.8, 0.36],
      [1.8, -7.2, 0.15]
    ],
    0.06,
    arteryMaterial,
    'LeftFemoralArtery'
  );
  makeVessel(
    [
      [-0.2, 0.8, 0.12],
      [-0.8, -0.2, 0.18],
      [-1.3, -1.8, 0.36],
      [-1.6, -3.8, 0.42],
      [-1.7, -5.8, 0.36],
      [-1.8, -7.2, 0.15]
    ],
    0.06,
    arteryMaterial,
    'RightFemoralArtery'
  );

  // 7. Left & Right Anterior Tibial Arteries (Calves / Shins)
  makeVessel(
    [
      [1.8, -7.4, 0.14],
      [1.75, -9.2, 0.28],
      [1.7, -11.2, 0.32],
      [1.62, -13.0, 0.26]
    ],
    0.042,
    arteryMaterial,
    'LeftAnteriorTibialArtery'
  );
  makeVessel(
    [
      [-1.8, -7.4, 0.14],
      [-1.75, -9.2, 0.28],
      [-1.7, -11.2, 0.32],
      [-1.62, -13.0, 0.26]
    ],
    0.042,
    arteryMaterial,
    'RightAnteriorTibialArtery'
  );

  // ═══════════════════════════════════════════════════════
  // BLUE VEINS (Deoxygenated Superficial & Deep Circulation)
  // ═══════════════════════════════════════════════════════

  // 1. Superior & Inferior Vena Cava
  makeVessel(
    [
      [0.22, 9.4, 0.4],
      [0.2, 7.8, 0.36],
      [0.18, 5.5, 0.24],
      [0.18, 3.0, 0.18],
      [0.15, 1.2, 0.12]
    ],
    0.075,
    veinMaterial,
    'VenaCava'
  );

  // 2. Left & Right Internal Jugular Veins (Neck)
  makeVessel(
    [
      [0.75, 13.5, 0.25],
      [0.7, 12.0, 0.32],
      [0.65, 10.5, 0.38],
      [0.35, 9.4, 0.4]
    ],
    0.052,
    veinMaterial,
    'LeftJugularVein'
  );
  makeVessel(
    [
      [-0.75, 13.5, 0.25],
      [-0.7, 12.0, 0.32],
      [-0.65, 10.5, 0.38],
      [-0.35, 9.4, 0.4]
    ],
    0.052,
    veinMaterial,
    'RightJugularVein'
  );

  // 3. Left Cephalic & Basilic Vein (Athletic Bicep & Arm Veins)
  makeVessel(
    [
      [1.6, 9.2, 0.35],
      [2.4, 8.4, 0.32],
      [3.0, 7.2, 0.28], // curves across bicep peak!
      [3.3, 5.8, 0.26],
      [3.5, 4.2, 0.24],
      [3.8, 2.8, 0.32],
      [4.1, 1.4, 0.38],
      [4.25, 0.2, 0.34]
    ],
    0.05,
    veinMaterial,
    'LeftCephalicVein'
  );
  // Left Basilic & Median Cubital Vein (Inner bicep & elbow crease)
  makeVessel(
    [
      [2.3, 7.5, 0.19],
      [2.7, 6.0, 0.14],
      [3.1, 4.2, 0.22],
      [3.4, 2.5, 0.3]
    ],
    0.042,
    veinMaterial,
    'LeftBasilicVein'
  );

  // 4. Right Cephalic & Basilic Vein (Right Bicep & Arm Veins)
  makeVessel(
    [
      [-1.6, 9.2, 0.35],
      [-2.4, 8.4, 0.32],
      [-3.0, 7.2, 0.28],
      [-3.3, 5.8, 0.26],
      [-3.5, 4.2, 0.24],
      [-3.8, 2.8, 0.32],
      [-4.1, 1.4, 0.38],
      [-4.25, 0.2, 0.34]
    ],
    0.05,
    veinMaterial,
    'RightCephalicVein'
  );
  // Right Basilic & Median Cubital Vein
  makeVessel(
    [
      [-2.3, 7.5, 0.19],
      [-2.7, 6.0, 0.14],
      [-3.1, 4.2, 0.22],
      [-3.4, 2.5, 0.3]
    ],
    0.042,
    veinMaterial,
    'RightBasilicVein'
  );

  // 5. Left & Right Thoracoepigastric & Superficial Epigastric Veins (Flanking the 6 Abs)
  makeVessel(
    [
      [1.35, 7.6, 0.32],
      [1.45, 5.8, 0.38],
      [1.38, 4.0, 0.35],
      [1.25, 2.2, 0.28],
      [0.95, 0.6, 0.2]
    ],
    0.042,
    veinMaterial,
    'LeftThoracoepigastricVein'
  );
  makeVessel(
    [
      [0.85, 3.6, 0.4],
      [0.98, 2.2, 0.34],
      [0.9, 0.8, 0.24]
    ],
    0.035,
    veinMaterial,
    'LeftSuperficialEpigastricVein'
  );

  makeVessel(
    [
      [-1.35, 7.6, 0.32],
      [-1.45, 5.8, 0.38],
      [-1.38, 4.0, 0.35],
      [-1.25, 2.2, 0.28],
      [-0.95, 0.6, 0.2]
    ],
    0.042,
    veinMaterial,
    'RightThoracoepigastricVein'
  );
  makeVessel(
    [
      [-0.85, 3.6, 0.4],
      [-0.98, 2.2, 0.34],
      [-0.9, 0.8, 0.24]
    ],
    0.035,
    veinMaterial,
    'RightSuperficialEpigastricVein'
  );

  // 6. Left & Right Great Saphenous Veins (Thighs & Calves)
  makeVessel(
    [
      [0.95, 0.6, 0.2],
      [1.25, -1.2, 0.34],
      [1.45, -3.2, 0.4],
      [1.52, -5.5, 0.34],
      [1.52, -7.5, 0.2],
      [1.5, -9.5, 0.24],
      [1.46, -11.5, 0.28],
      [1.4, -13.2, 0.24]
    ],
    0.048,
    veinMaterial,
    'LeftGreatSaphenousVein'
  );
  makeVessel(
    [
      [1.65, -1.0, 0.34],
      [2.05, -3.0, 0.38],
      [2.15, -5.0, 0.32],
      [2.05, -6.8, 0.18]
    ],
    0.038,
    veinMaterial,
    'LeftLateralFemoralVein'
  );

  makeVessel(
    [
      [-0.95, 0.6, 0.2],
      [-1.25, -1.2, 0.34],
      [-1.45, -3.2, 0.4],
      [-1.52, -5.5, 0.34],
      [-1.52, -7.5, 0.2],
      [-1.5, -9.5, 0.24],
      [-1.46, -11.5, 0.28],
      [-1.4, -13.2, 0.24]
    ],
    0.048,
    veinMaterial,
    'RightGreatSaphenousVein'
  );
  makeVessel(
    [
      [-1.65, -1.0, 0.34],
      [-2.05, -3.0, 0.38],
      [-2.15, -5.0, 0.32],
      [-2.05, -6.8, 0.18]
    ],
    0.038,
    veinMaterial,
    'RightLateralFemoralVein'
  );

  return vascularGroup;
}

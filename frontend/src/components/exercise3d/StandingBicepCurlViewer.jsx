import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { disposeObject3D } from '../../utils/disposeObject3D';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Activity,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';

/**
 * StandingBicepCurlViewer Component
 *
 * A photorealistic, anatomically accurate 3D instructional animation
 * of a standing dumbbell biceps curl featuring:
 * 1. Athletic adult male anatomical model with sculpted muscle groups.
 * 2. Strict biomechanics: upright stance, feet shoulder-width apart, elbows pinned to torso, palms facing forward.
 * 3. Upper arms and torso remain stationary (no swinging or cheating).
 * 4. Dynamic red highlighting & muscular bulging of Biceps Brachii during concentric lifting.
 * 5. Smooth concentric (lifting), peak contraction (hold), and eccentric (lowering) phases.
 * 6. Live rep counter, camera presets (Front, Side, 45° Isometric, Close-up), speed controls, scrubber.
 * 7. Dark gym studio environment with professional multi-point lighting.
 */
export const StandingBicepCurlViewer = ({
  exerciseName = 'Standing Dumbbell Biceps Curl',
  targetMuscle = 'Biceps Brachii',
  equipment = 'Dumbbells',
  difficulty = 'Beginner',
  autoPlay = true,
  className = '',
  onRepComplete = null
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const timerRef = useRef(new THREE.Timer());

  // Animation Kinematics References
  const characterRigRef = useRef(null);
  const bicepMaterialsRef = useRef([]);
  const bicepMeshesRef = useRef([]);
  const repCountRef = useRef(0);
  const lastRepTimeRef = useRef(0);

  // Component UI State
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(4.0); // 4.0 second cadence per rep
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [activeView, setActiveView] = useState('front');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFormGuide, setShowFormGuide] = useState(true);
  const playbackRef = useRef(null);
  const animationTimeRef = useRef(0);
  const cameraFrameRef = useRef(null);
  playbackRef.current = { isPlaying, isScrubbing, playbackSpeed, onRepComplete };

  // Camera presets
  const CAMERA_PRESETS = {
    front: { pos: new THREE.Vector3(0, 1.25, 2.75), target: new THREE.Vector3(0, 1.05, 0) },
    sideRight: { pos: new THREE.Vector3(2.65, 1.22, 0.05), target: new THREE.Vector3(0, 1.05, 0) },
    sideLeft: { pos: new THREE.Vector3(-2.65, 1.22, 0.05), target: new THREE.Vector3(0, 1.05, 0) },
    isometric: { pos: new THREE.Vector3(1.9, 1.35, 1.95), target: new THREE.Vector3(0, 1.02, 0) },
    bicepClose: { pos: new THREE.Vector3(0.72, 1.25, 0.95), target: new THREE.Vector3(0.24, 1.15, 0) }
  };

  // Determine current biomechanical phase
  const getBiomechanicalPhase = (t) => {
    const p = (t % duration) / duration;
    if (p < 0.08) {
      return {
        name: 'Starting Position',
        desc: 'Upright stance, feet shoulder-width, elbows pinned to torso, palms facing forward',
        color: 'text-slate-300',
        badge: 'bg-slate-800 text-slate-300 border-slate-700',
        bicepActive: false
      };
    }
    if (p < 0.45) {
      return {
        name: 'Concentric (Lifting Phase)',
        desc: 'Flexing elbows, curling dumbbells up toward shoulders with stationary upper arms',
        color: 'text-red-400',
        badge: 'bg-red-950/90 text-red-400 border-red-800 animate-pulse',
        bicepActive: true
      };
    }
    if (p < 0.62) {
      return {
        name: 'Peak Contraction (Squeeze)',
        desc: 'Maximum bicep recruitment, pause and squeeze at the apex without resting',
        color: 'text-amber-400',
        badge: 'bg-amber-950/90 text-amber-400 border-amber-800',
        bicepActive: true
      };
    }
    if (p < 0.95) {
      return {
        name: 'Eccentric (Controlled Lowering)',
        desc: 'Resisting gravity, slowly lowering dumbbells for 2 seconds to full extension',
        color: 'text-cyan-400',
        badge: 'bg-cyan-950/90 text-cyan-400 border-cyan-800',
        bicepActive: false
      };
    }
    return {
      name: 'Reset & Rep Transition',
      desc: 'Seamless reset before initiating the next repetition',
      color: 'text-emerald-400',
      badge: 'bg-emerald-950/90 text-emerald-400 border-emerald-800',
      bicepActive: false
    };
  };

  // ─────────────────────────────────────────────────────────────
  // 3D Scene Initialization
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isMounted = true;
    bicepMaterialsRef.current = [];
    bicepMeshesRef.current = [];

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 2. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16); // Deep premium gym dark slate
    scene.fog = new THREE.FogExp2(0x090d16, 0.09);
    sceneRef.current = scene;

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40);
    const initialPreset = CAMERA_PRESETS.front;
    camera.position.copy(initialPreset.pos);
    cameraRef.current = camera;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.8;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't dip below floor
    controls.target.copy(initialPreset.target);
    controls.update();
    controlsRef.current = controls;

    // ─────────────────────────────────────────────────────────────
    // Professional Studio Gym Lighting
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x24324a, 1.1);
    scene.add(ambientLight);

    // Overhead Key Spotlight (Warm Studio Light)
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
    keyLight.position.set(2.4, 4.2, 3.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 3.0;
    keyLight.shadow.camera.bottom = -0.5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Front-Left Fill Light (Cool Cyan Tone for muscle depth)
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.9);
    fillLight.position.set(-2.8, 2.5, 2.2);
    scene.add(fillLight);

    // Right Rim Backlight (Vivid Red / Warm highlight for biceps separation)
    const rimLightR = new THREE.DirectionalLight(0xff3b30, 1.8);
    rimLightR.position.set(2.6, 2.2, -2.4);
    scene.add(rimLightR);

    // Left Rim Backlight (Cool Blue Rim)
    const rimLightL = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLightL.position.set(-2.6, 2.2, -2.4);
    scene.add(rimLightL);

    // Top Rim Overhead
    const topRim = new THREE.DirectionalLight(0xffffff, 0.7);
    topRim.position.set(0, 4.5, -0.5);
    scene.add(topRim);

    // ─────────────────────────────────────────────────────────────
    // Dark Gym Environment Floor & Accents
    // ─────────────────────────────────────────────────────────────
    // 1. Charcoal Rubber Gym Mat Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.65,
      metalness: 0.25
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle Interlocking Floor Tile Lines
    const gridHelper = new THREE.GridHelper(10, 20, 0xef4444, 0x1e293b);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // Soft Shadow Contact Disc directly beneath feet
    const contactMat = new THREE.MeshBasicMaterial({
      color: 0x030712,
      transparent: true,
      opacity: 0.55
    });
    const contactDisc = new THREE.Mesh(new THREE.CircleGeometry(0.85, 32), contactMat);
    contactDisc.rotation.x = -Math.PI / 2;
    contactDisc.position.y = 0.002;
    scene.add(contactDisc);

    // Background Studio Accent Light Columns (Sleek Gym Studio Pillars)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8
    });
    const ledMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const ledMatCyan = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

    const createGymPillar = (x, z, ledMat) => {
      const p = new THREE.Group();
      const column = new THREE.Mesh(new THREE.BoxGeometry(0.25, 4.5, 0.25), pillarMat);
      column.position.y = 2.25;
      p.add(column);

      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 4.0, 0.02), ledMat);
      strip.position.set(0, 2.25, 0.13);
      p.add(strip);

      p.position.set(x, 0, z);
      return p;
    };

    scene.add(createGymPillar(-3.2, -2.8, ledMatRed));
    scene.add(createGymPillar(3.2, -2.8, ledMatCyan));
    scene.add(createGymPillar(-4.2, -1.2, ledMatCyan));
    scene.add(createGymPillar(4.2, -1.2, ledMatRed));

    // ─────────────────────────────────────────────────────────────
    // Athletic Adult Male Anatomical Model Builder
    // ─────────────────────────────────────────────────────────────
    const characterGroup = new THREE.Group();
    characterRigRef.current = characterGroup;
    scene.add(characterGroup);

    // Anatomical Materials
    const skinToneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Athletic sleek graphite muscle tone
      roughness: 0.4,
      metalness: 0.15
    });

    const tendonMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.25
    });

    // Special Highlight Material for Biceps Brachii (Long Head & Short Head)
    const createBicepMaterial = () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x243248, // resting color
        roughness: 0.32,
        metalness: 0.25,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.0
      });
      bicepMaterialsRef.current.push(mat);
      return mat;
    };

    const dumbbellSteelMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Chrome/Steel knurled grip
      metalness: 0.95,
      roughness: 0.2
    });

    const dumbbellRubberMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Hex rubber plates
      roughness: 0.7,
      metalness: 0.1
    });

    const dumbbellAccentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red ring accent
      metalness: 0.5,
      roughness: 0.3
    });

    // Helper: Enable shadows on mesh
    const setupMesh = (mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // 1. HEAD & NECK
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.72, 0);

    // Cranium
    const cranium = setupMesh(new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 20), skinToneMat));
    cranium.scale.set(0.88, 1.15, 0.96);
    headGroup.add(cranium);

    // Jawline & Chin
    const jaw = setupMesh(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.11), skinToneMat));
    jaw.position.set(0, -0.06, 0.035);
    headGroup.add(jaw);

    // Neck with Sternocleidomastoid
    const neck = setupMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.14, 16), skinToneMat));
    neck.position.set(0, -0.15, -0.01);
    headGroup.add(neck);

    characterGroup.add(headGroup);

    // 2. TORSO & SPINE (Rigid upright, no torso swing)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.25, 0);

    // Pectoralis Major (Clavicular & Sternocostal Heads)
    const pecGeo = new THREE.BoxGeometry(0.165, 0.13, 0.12);
    const pecLeft = setupMesh(new THREE.Mesh(pecGeo, skinToneMat));
    pecLeft.position.set(0.09, 0.16, 0.08);
    pecLeft.rotation.set(0, 0, -0.08);
    torsoGroup.add(pecLeft);

    const pecRight = setupMesh(new THREE.Mesh(pecGeo, skinToneMat));
    pecRight.position.set(-0.09, 0.16, 0.08);
    pecRight.rotation.set(0, 0, 0.08);
    torsoGroup.add(pecRight);

    // Clavicles (Collar bones)
    const clavicleGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.38, 12);
    clavicleGeo.rotateZ(Math.PI / 2);
    const clavicles = setupMesh(new THREE.Mesh(clavicleGeo, tendonMat));
    clavicles.position.set(0, 0.24, 0.06);
    torsoGroup.add(clavicles);

    // Rectus Abdominis (6-Pack anatomical segments)
    const abGeo = new THREE.BoxGeometry(0.075, 0.06, 0.035);
    for (let row = 0; row < 3; row++) {
      const yOffset = 0.05 - row * 0.075;
      const abL = setupMesh(new THREE.Mesh(abGeo, skinToneMat));
      abL.position.set(0.048, yOffset, 0.105);
      torsoGroup.add(abL);

      const abR = setupMesh(new THREE.Mesh(abGeo, skinToneMat));
      abR.position.set(-0.048, yOffset, 0.105);
      torsoGroup.add(abR);
    }

    // External Obliques & Serratus Anterior
    const oblGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.36, 16);
    const coreTorso = setupMesh(new THREE.Mesh(oblGeo, skinToneMat));
    coreTorso.scale.set(1.22, 1.0, 0.82);
    coreTorso.position.set(0, 0.05, 0);
    torsoGroup.add(coreTorso);

    // Upper Trapezius & Lats (V-Taper)
    const latsGeo = new THREE.ConeGeometry(0.24, 0.42, 16);
    const lats = setupMesh(new THREE.Mesh(latsGeo, skinToneMat));
    lats.rotation.x = Math.PI;
    lats.scale.set(1.15, 1.0, 0.65);
    lats.position.set(0, 0.15, -0.04);
    torsoGroup.add(lats);

    characterGroup.add(torsoGroup);

    // 3. LOWER BODY & GROUNDED STANCE (Shoulder-Width Apart, Stable Base)
    // Pelvis / Hips
    const pelvis = setupMesh(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.22), skinToneMat));
    pelvis.position.set(0, 0.94, 0);
    characterGroup.add(pelvis);

    // Legs Function: Build anatomically aligned athletic legs
    const buildLeg = (isLeft) => {
      const legGroup = new THREE.Group();
      const xSign = isLeft ? 1 : -1;
      // Shoulder-width apart: center offset at 0.185m
      legGroup.position.set(xSign * 0.185, 0.88, 0);

      // Thigh (Quadriceps: Rectus Femoris & Vastus Lateralis/Medialis)
      const thigh = setupMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.36, 8, 16), skinToneMat));
      thigh.position.set(0, -0.22, 0);
      legGroup.add(thigh);

      // Patella (Knee cap with soft 5° athletic flex)
      const patella = setupMesh(new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), tendonMat));
      patella.position.set(0, -0.44, 0.055);
      legGroup.add(patella);

      // Lower Leg (Gastrocnemius / Calves & Tibia)
      const calf = setupMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.38, 8, 16), skinToneMat));
      calf.position.set(0, -0.66, -0.015);
      legGroup.add(calf);

      // Athletic Gym Training Shoes (Flat, solid base of support)
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.88, 0.03);

      const shoeSole = setupMesh(new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.04, 0.26), dumbbellRubberMat));
      shoeSole.position.set(0, 0.02, 0);
      shoeGroup.add(shoeSole);

      const shoeUpper = setupMesh(new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.07, 0.22), skinToneMat));
      shoeUpper.position.set(0, 0.06, -0.01);
      shoeGroup.add(shoeUpper);

      legGroup.add(shoeGroup);
      return legGroup;
    };

    characterGroup.add(buildLeg(true));  // Left Leg
    characterGroup.add(buildLeg(false)); // Right Leg

    // 4. ARMS, BICEPS BRACHII & DUMBBELLS
    // Dumbbell Generator
    const buildDumbbell = () => {
      const db = new THREE.Group();

      // Knurled Steel Grip Handle (Center)
      const handle = setupMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.17, 16), dumbbellSteelMat));
      handle.rotation.z = Math.PI / 2;
      db.add(handle);

      // Dual Hexagonal Rubber Weight Heads
      const makeHexHead = (xPos) => {
        const headGroup = new THREE.Group();
        headGroup.position.x = xPos;

        // Inner Red Accent Ring
        const ring = setupMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.015, 16), dumbbellAccentMat));
        ring.rotation.z = Math.PI / 2;
        headGroup.add(ring);

        // Hex Head
        const hex = setupMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.055, 6), dumbbellRubberMat));
        hex.rotation.z = Math.PI / 2;
        headGroup.add(hex);

        // Chrome End Cap
        const cap = setupMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 12), dumbbellSteelMat));
        cap.rotation.z = Math.PI / 2;
        headGroup.add(cap);

        return headGroup;
      };

      db.add(makeHexHead(0.10));
      db.add(makeHexHead(-0.10));
      return db;
    };

    // Arm Builder Function
    const armNodes = {};

    const buildArm = (isLeft) => {
      const armGroup = new THREE.Group();
      const xSign = isLeft ? 1 : -1;

      // Shoulder Joint positioned at upper torso
      armGroup.position.set(xSign * 0.24, 1.44, 0);

      // Deltoid (Shoulder Cap: Anterior, Lateral, Posterior heads)
      const deltGeo = new THREE.SphereGeometry(0.082, 16, 16);
      deltGeo.scale(0.9, 1.15, 1.05);
      const deltoid = setupMesh(new THREE.Mesh(deltGeo, skinToneMat));
      deltoid.position.set(xSign * 0.02, -0.04, 0);
      armGroup.add(deltoid);

      // Upper Arm (Humerus segment) - HELD STATIONARY AT TORSO RIBS
      const upperArm = new THREE.Group();
      armGroup.add(upperArm);

      // Triceps Brachii (Posterior Upper Arm)
      const tricep = setupMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.20, 8, 16), skinToneMat));
      tricep.position.set(xSign * 0.01, -0.16, -0.032);
      upperArm.add(tricep);

      // Brachialis (Deep lateral elbow flexor)
      const brachialis = setupMesh(new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.14, 8, 16), tendonMat));
      brachialis.position.set(xSign * 0.035, -0.22, 0.015);
      upperArm.add(brachialis);

      // ─────────────────────────────────────────────────────────────
      // TARGET MUSCLE: BICEPS BRACHII (Long Head & Short Head)
      // Anatomically positioned on anterior humerus with dynamic bulging & glow
      // ─────────────────────────────────────────────────────────────
      const bicepGroup = new THREE.Group();
      bicepGroup.position.set(0, -0.15, 0.032);
      upperArm.add(bicepGroup);

      const bicepMat = createBicepMaterial();

      // Long Head (Caput Longum - Lateral)
      const longHeadGeo = new THREE.CapsuleGeometry(0.034, 0.16, 8, 16);
      longHeadGeo.scale(0.95, 1.0, 1.15);
      const longHead = setupMesh(new THREE.Mesh(longHeadGeo, bicepMat));
      longHead.position.set(xSign * 0.022, 0, 0);
      bicepGroup.add(longHead);

      // Short Head (Caput Breve - Medial)
      const shortHeadGeo = new THREE.CapsuleGeometry(0.034, 0.15, 8, 16);
      shortHeadGeo.scale(0.95, 1.0, 1.15);
      const shortHead = setupMesh(new THREE.Mesh(shortHeadGeo, bicepMat));
      shortHead.position.set(-xSign * 0.016, -0.01, 0.005);
      bicepGroup.add(shortHead);

      // Proximal and Distal Tendons
      const tendonGeo = new THREE.CylinderGeometry(0.008, 0.012, 0.08, 8);
      const tendonUpper = setupMesh(new THREE.Mesh(tendonGeo, tendonMat));
      tendonUpper.position.set(0, 0.10, -0.01);
      bicepGroup.add(tendonUpper);

      const tendonLower = setupMesh(new THREE.Mesh(tendonGeo, tendonMat));
      tendonLower.position.set(0, -0.10, -0.01);
      bicepGroup.add(tendonLower);

      bicepMeshesRef.current.push(bicepGroup);

      // ─────────────────────────────────────────────────────────────
      // ELBOW JOINT & FOREARM (Flexion Axis)
      // Elbows tucked against torso ribs; pure humeroulnar flexion
      // ─────────────────────────────────────────────────────────────
      const elbowJoint = new THREE.Group();
      elbowJoint.position.set(0, -0.30, 0); // At distal humerus
      upperArm.add(elbowJoint);

      // Forearm Group (Rotates during curl)
      const forearmGroup = new THREE.Group();
      elbowJoint.add(forearmGroup);

      // Forearm Musculature (Brachioradialis & Flexors)
      const forearmGeo = new THREE.CylinderGeometry(0.048, 0.032, 0.28, 16);
      forearmGeo.translate(0, -0.14, 0);
      const forearm = setupMesh(new THREE.Mesh(forearmGeo, skinToneMat));
      forearmGroup.add(forearm);

      // Brachioradialis Muscle Ridge (Upper outer forearm)
      const bracGeo = new THREE.CapsuleGeometry(0.026, 0.12, 6, 12);
      const bracMesh = setupMesh(new THREE.Mesh(bracGeo, skinToneMat));
      bracMesh.position.set(xSign * 0.035, -0.08, 0.015);
      bracMesh.rotation.z = xSign * 0.12;
      forearmGroup.add(bracMesh);

      // Hand wrapped around Dumbbell Handle (PALMS FACING FORWARD / SUPINATED)
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.28, 0);
      forearmGroup.add(handGroup);

      // Sculpted Hand Grip (Fingers curled around bar)
      const palm = setupMesh(new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.045), skinToneMat));
      palm.position.set(0, -0.01, 0);
      handGroup.add(palm);

      // Dumbbell in Hand
      const dumbbell = buildDumbbell();
      dumbbell.position.set(0, -0.01, 0);
      handGroup.add(dumbbell);

      if (isLeft) {
        armNodes.elbowL = elbowJoint;
        armNodes.upperArmL = upperArm;
      } else {
        armNodes.elbowR = elbowJoint;
        armNodes.upperArmR = upperArm;
      }

      return armGroup;
    };

    characterGroup.add(buildArm(true));  // Left Arm
    characterGroup.add(buildArm(false)); // Right Arm

    // ─────────────────────────────────────────────────────────────
    // Resize Observer
    // ─────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─────────────────────────────────────────────────────────────
    // Precision Biomechanical Animation & Render Loop
    // ─────────────────────────────────────────────────────────────
    const timer = timerRef.current;
    timer.connect(document);

    const animate = () => {
      timer.update();
      const delta = timer.getDelta();
      const playback = playbackRef.current;

      if (playback.isPlaying && !playback.isScrubbing) {
        const nextTime = animationTimeRef.current + delta * playback.playbackSpeed;
        const completedReps = Math.floor(nextTime / duration);
        animationTimeRef.current = nextTime % duration;
        setCurrentTime(animationTimeRef.current);

        if (completedReps > 0) {
          repCountRef.current += completedReps;
          setRepCount(repCountRef.current);
          playback.onRepComplete?.(repCountRef.current);
        }
      }

      // Compute Biomechanical Joint Angles from currentTime
      const p = animationTimeRef.current / duration;
      let curlFraction = 0; // 0 = fully extended, 1 = peak contraction

      if (p < 0.08) {
        // Starting Position: resting extension
        curlFraction = 0.0;
      } else if (p < 0.45) {
        // Concentric Lifting Phase (1.48s): Smooth cubic ease-in-out curl up
        const tConcentric = (p - 0.08) / (0.45 - 0.08);
        curlFraction = tConcentric < 0.5
          ? 4 * tConcentric * tConcentric * tConcentric
          : 1 - Math.pow(-2 * tConcentric + 2, 3) / 2;
      } else if (p < 0.62) {
        // Peak Contraction Hold (0.68s): Isometric squeeze at top
        curlFraction = 1.0;
      } else if (p < 0.95) {
        // Eccentric Lowering Phase (1.32s): Smooth controlled descent
        const tEccentric = (p - 0.62) / (0.95 - 0.62);
        const smoothDrop = tEccentric < 0.5
          ? 2 * tEccentric * tEccentric
          : 1 - Math.pow(-2 * tEccentric + 2, 2) / 2;
        curlFraction = 1.0 - smoothDrop;
      } else {
        // Reset Phase: back at bottom
        curlFraction = 0.0;
      }

      // Safe Range of Motion:
      // Elbow angle: from ~8° (0.14 rad, slight joint protection flex) to ~136° (2.37 rad, peak curl)
      const minElbowFlex = 0.10;
      const maxElbowFlex = 2.36;
      const elbowAngle = minElbowFlex + curlFraction * (maxElbowFlex - minElbowFlex);

      if (armNodes.elbowL) {
        armNodes.elbowL.rotation.x = elbowAngle;
      }
      if (armNodes.elbowR) {
        armNodes.elbowR.rotation.x = elbowAngle;
      }

      // Upper Arms remain STATIONARY at the torso
      // Only micro-stabilization (less than 1.5°), strictly maintaining pinned elbows
      if (armNodes.upperArmL) {
        armNodes.upperArmL.rotation.x = 0.02 * curlFraction;
        armNodes.upperArmL.rotation.z = -0.03; // tucked against ribs
      }
      if (armNodes.upperArmR) {
        armNodes.upperArmR.rotation.x = 0.02 * curlFraction;
        armNodes.upperArmR.rotation.z = 0.03; // tucked against ribs
      }

      // Torso remains STRICTLY STATIONARY (no swinging/cheating)
      // Torso angle = 0, with subtle athletic chest expansion
      torsoGroup.position.y = 1.25 + 0.003 * curlFraction;

      // ─────────────────────────────────────────────────────────────
      // DYNAMIC BICEPS BRACHII CONTRACTION & RED HIGHLIGHT
      // 1. Muscle belly physically swells radially (anatomical shortening)
      // 2. Color transitions to vivid red with glowing emissive intensity
      // ─────────────────────────────────────────────────────────────
      const radialBulge = 1.0 + 0.32 * curlFraction;
      const lengthShorten = 1.0 - 0.08 * curlFraction;

      bicepMeshesRef.current.forEach((bGroup) => {
        bGroup.scale.set(radialBulge, lengthShorten, radialBulge * 1.15);
      });

      // Red Highlight Shading:
      // In lifting phase (curlFraction > 0): glowing red increases
      const redIntensity = curlFraction;
      const baseColor = new THREE.Color(0x243248).lerp(new THREE.Color(0xef4444), redIntensity);
      const emissiveColor = new THREE.Color(0xff1111);
      const emissivePower = redIntensity * 1.6;

      bicepMaterialsRef.current.forEach((mat) => {
        mat.color.copy(baseColor);
        mat.emissive.copy(emissiveColor);
        mat.emissiveIntensity = emissivePower;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      cancelAnimationFrame(cameraFrameRef.current);
      controls.dispose();
      disposeObject3D(scene);
      timer.disconnect();
      renderer.dispose();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Camera Preset Transition
  // ─────────────────────────────────────────────────────────────
  const setCameraPreset = (viewKey) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls || !CAMERA_PRESETS[viewKey]) return;
    cancelAnimationFrame(cameraFrameRef.current);

    setActiveView(viewKey);
    const preset = CAMERA_PRESETS[viewKey];

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const targetPos = preset.pos.clone();
    const targetLookAt = preset.target.clone();

    const startTime = performance.now();
    const durationMs = 600;

    const animLoop = (now) => {
      const p = Math.min(1.0, (now - startTime) / durationMs);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      camera.position.lerpVectors(startPos, targetPos, eased);
      controls.target.lerpVectors(startTarget, targetLookAt, eased);
      controls.update();

      if (p < 1.0) {
        cameraFrameRef.current = requestAnimationFrame(animLoop);
      }
    };
    cameraFrameRef.current = requestAnimationFrame(animLoop);
  };

  // ─────────────────────────────────────────────────────────────
  // Playback Controls
  // ─────────────────────────────────────────────────────────────
  const togglePlay = () => setIsPlaying((prev) => !prev);

  const handleReplay = () => {
    animationTimeRef.current = 0;
    repCountRef.current = 0;
    setRepCount(0);
    playbackRef.current.onRepComplete?.(0);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleScrubStart = () => setIsScrubbing(true);
  const handleScrubChange = (e) => {
    const val = parseFloat(e.target.value);
    animationTimeRef.current = Math.min(val, duration - 0.0001);
    setCurrentTime(val);
  };
  const handleScrubEnd = () => setIsScrubbing(false);

  // Zoom handlers
  const handleZoom = (factor) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const dir = camera.position.clone().sub(controls.target);
    dir.multiplyScalar(factor);
    camera.position.copy(controls.target).add(dir);
    controls.update();
  };

  const currentPhase = getBiomechanicalPhase(currentTime);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-800 bg-[#090d16] select-none shadow-2xl flex flex-col justify-between ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block focus:outline-none touch-none"
      />

      {/* ──────────────── Top HUD Bar ──────────────── */}
      <div className="relative z-10 p-3 sm:p-5 flex items-start justify-between gap-3 pointer-events-none">
        {/* Left: Exercise Metadata & Real-Time Biomechanics Pill */}
        <div className="flex flex-col gap-2 max-w-[70%] sm:max-w-md">
          {/* Exercise Title Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl pointer-events-auto">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">
                  {exerciseName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-800/60">
                  Target: {targetMuscle}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Athletic Male Anatomical Model • High-Tension Hypertrophy
              </p>
            </div>
          </div>

          {/* Dynamic Biomechanical Phase Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-md text-xs pointer-events-auto">
            <Activity className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-slate-400 font-semibold text-[11px]">Phase:</span>
            <span className={`font-black text-[11px] ${currentPhase.color}`}>
              {currentPhase.name}
            </span>
          </div>
        </div>

        {/* Right: Camera Presets & Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraPreset('front')}
            title="Front Angle (Symmetry & Supination)"
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
              activeView === 'front'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Front
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('sideRight')}
            title="Side Profile (Verifies stationary upper arm & no torso swing)"
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
              activeView === 'sideRight'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Side
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('isometric')}
            title="45° Isometric Full Body View"
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
              activeView === 'isometric'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            45° 3D
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('bicepClose')}
            title="Close-Up on Biceps Brachii & Dumbbell Arc"
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
              activeView === 'bicepClose'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Zoom Bicep
          </button>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          {/* Quick Zoom In/Out */}
          <button
            type="button"
            onClick={() => handleZoom(0.85)}
            title="Zoom In"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.18)}
            title="Zoom Out"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ──────────────── Center Floating Anatomical Cue Pill ──────────────── */}
      <div className="relative z-10 px-4 sm:px-6 pointer-events-none flex justify-center">
        <div className="max-w-lg w-full px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-center shadow-lg pointer-events-auto transition-all">
          <p className="text-[11px] text-slate-300 font-medium">
            <span className="text-red-400 font-bold mr-1.5">Biomechanics:</span>
            {currentPhase.desc}
          </p>
        </div>
      </div>

      {/* ──────────────── Bottom Controls & HUD ──────────────── */}
      <div className="relative z-10 p-3 sm:p-5 bg-gradient-to-t from-black via-slate-950/90 to-transparent flex flex-col gap-2.5">
        {/* Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 min-w-[34px] text-right">
            {currentTime.toFixed(1)}s
          </span>

          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onMouseDown={handleScrubStart}
              onTouchStart={handleScrubStart}
              onChange={handleScrubChange}
              onMouseUp={handleScrubEnd}
              onTouchEnd={handleScrubEnd}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none transition-all group-hover:h-2"
              title="Drag to examine exact joint angles & muscle contraction"
            />
          </div>

          <span className="text-[10px] font-mono text-slate-500 min-w-[34px]">
            {duration.toFixed(1)}s
          </span>
        </div>

        {/* Buttons Bar: Play/Pause, Replay, Rep Counter, Speed & Form Checklist */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all"
              title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Replay */}
            <button
              type="button"
              onClick={handleReplay}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Restart Repetition from 0.0s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Repetition Counter Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-inner">
              <Dumbbell className="w-3.5 h-3.5 text-red-500" />
              <span className="text-slate-400 font-medium">Completed Reps:</span>
              <span className="text-sm font-black text-white px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-900">
                {repCount}
              </span>
            </div>

            {/* Biceps Activation Indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
              <div
                className={`w-2 h-2 rounded-full ${
                  currentPhase.bicepActive ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                }`}
              />
              <span className="text-[11px]">
                {currentPhase.bicepActive ? 'Biceps Highlighted in Red' : 'Resting Muscle Tone'}
              </span>
            </div>
          </div>

          {/* Speed Selector & Form Guide Toggle */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold">
              <span className="text-slate-500 px-1.5 text-[9px] uppercase tracking-wider">Speed:</span>
              {[0.5, 1.0, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    playbackSpeed === speed
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Toggle Form Checklist */}
            <button
              type="button"
              onClick={() => setShowFormGuide((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                showFormGuide
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Form Rules</span>
            </button>
          </div>
        </div>

        {/* Collapsible Safe Technique & Biomechanics Checklist Drawer */}
        {showFormGuide && (
          <div className="mt-1 p-3 rounded-2xl bg-slate-950/90 border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Feet shoulder-width apart</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Elbows pinned to ribs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Palms facing forward</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Stationary torso (no swing)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

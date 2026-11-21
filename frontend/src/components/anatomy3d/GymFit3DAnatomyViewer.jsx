import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  load3DAnatomyModel,
  selectedRedMaterial,
  selectedSubdivisionMaterial,
  selectedGroupSubtleMaterial,
  hoverMaterial,
  defaultMuscleMaterial,
  absMuscleMaterial,
  boneMaterial,
  tendonMaterial,
  getSubdivisionMaterial
} from '../../utils/anatomy3dLoader';
import { disposeObject3D } from '../../utils/disposeObject3D';
import { UniversalExplorationModule } from './modules/universal/UniversalExplorationModule';
import { UniversalCameraController } from './modules/universal/UniversalCameraController';
import { UNIVERSAL_MUSCLE_CONFIG } from './modules/universal/universalMuscleConfig';
import { createRealisticVascularSystem } from '../../utils/vascularSystemLoader';
import { AnatomicalAnimationController } from './modules/universal/AnatomicalAnimationController';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Compass,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Activity,
  Heart
} from 'lucide-react';
import { MUSCLE_EXPLORATION_CONFIG } from '../../data/muscleExplorationData';

export const GymFit3DAnatomyViewer = ({
  selectedMuscles = ['Chest'],
  selectedSubdivision = null,
  focusMuscle = null,
  onToggleMuscle = () => {},
  onSelectSubdivision = () => {},
  onOpenExercises = () => {},
  hoveredMuscle = null,
  onHoverMuscle = () => {}
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraControllerRef = useRef(null);
  const animationControllerRef = useRef(null);
  const timerRef = useRef(new THREE.Timer());
  const animationFrameIdRef = useRef(null);

  // Mesh & grouping storage
  const muscleMeshesRef = useRef([]);
  const groupMeshMapRef = useRef({});
  const skeletonGroupRef = useRef(null);
  const vascularGroupRef = useRef(null);
  const bodyGroupRef = useRef(null);

  // Interaction refs
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hoveredGroupRef = useRef(null);
  const pointerDownRef = useRef({ time: 0, x: 0, y: 0 });

  // Camera framing refs
  const optimalDistRef = useRef(42);
  const modelCenterRef = useRef(new THREE.Vector3(0, 0, 0));

  // Component UI State
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showVessels, setShowVessels] = useState(true);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [activeView, setActiveView] = useState('front');
  const [vitalAnimation, setVitalAnimation] = useState(true);

  // Normalized selected muscle groups array
  const selectedList = (
    Array.isArray(selectedMuscles)
      ? selectedMuscles
      : selectedMuscles
      ? [selectedMuscles]
      : []
  ).filter(Boolean);

  const normalizeMuscleGroup = (g) => {
    if (!g) return '';
    const l = g.toLowerCase().trim();
    if (l === 'oblique' || l === 'obliques') return 'obliques';
    if (l === 'box' || l === 'abs' || l === 'abs / core' || l === 'core') return 'abs';
    if (l === 'chest' || l === 'pectorals') return 'chest';
    if (l === 'back') return 'back';
    if (l === 'shoulder' || l === 'shoulders') return 'shoulders';
    if (l === 'arm' || l === 'arms') return 'arms';
    if (l === 'leg' || l === 'legs') return 'legs';
    if (l === 'calf' || l === 'calves') return 'calves';
    return l;
  };

  // 1. Precise mesh-level highlight updater supporting multi-selection
  const updateMeshHighlights = useCallback(() => {
    // If exploring a specific muscle, highlighting is managed independently by UniversalExplorationModule
    if (focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle]) {
      return;
    }

    const meshes = muscleMeshesRef.current;
    if (!meshes || meshes.length === 0) return;

    const selectedGroupSet = new Set(selectedList.map(normalizeMuscleGroup));
    const hoveredNorm = (hoveredMuscle || hoveredGroupRef.current)?.toLowerCase().trim();
    const normalizedHover = normalizeMuscleGroup(hoveredNorm);

    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const bp = mesh.userData.bodyPart;
      const bpNorm = normalizeMuscleGroup(bp);
      const rawNorm = mesh.userData.rawName?.toLowerCase() || '';

      let isPartSelected = Boolean(bpNorm) && selectedGroupSet.has(bpNorm);
      const isHovered = Boolean(normalizedHover) && !isPartSelected && bpNorm === normalizedHover;

      if (isPartSelected) {
        mesh.material = selectedRedMaterial;
      } else if (isHovered) {
        mesh.material = hoverMaterial;
      } else {
        mesh.material = rawNorm.includes('rectus abdominis')
          ? absMuscleMaterial
          : mesh.userData.originalMaterial || defaultMuscleMaterial;
      }
    }
  }, [selectedMuscles, focusMuscle, hoveredMuscle]);

  useEffect(() => {
    updateMeshHighlights();
  }, [updateMeshHighlights, loading]);

  // 2. Camera preset view handler (Front, Back, L-Side, R-Side, Reset)
  const setCameraView = (viewType) => {
    setActiveView(viewType);
    if (cameraControllerRef.current) {
      cameraControllerRef.current.setCameraPreset(
        viewType,
        optimalDistRef.current,
        modelCenterRef.current,
        focusMuscle
      );
    }
  };

  // Smoothly zoom 3D camera towards the focused muscle group or return to full-body
  useEffect(() => {
    if (!cameraControllerRef.current) return;

    if (focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle]) {
      const defaultView = UNIVERSAL_MUSCLE_CONFIG[focusMuscle].defaultView || 'front';
      setActiveView(defaultView);
      cameraControllerRef.current.zoomToMuscle(focusMuscle);
    } else if (focusMuscle === null && modelCenterRef.current) {
      setActiveView('front');
      cameraControllerRef.current.resetToFullBody(optimalDistRef.current, modelCenterRef.current);
    }
  }, [focusMuscle, loading]);

  // Synchronize active muscle flex dynamics with AnatomicalAnimationController
  useEffect(() => {
    if (animationControllerRef.current) {
      animationControllerRef.current.setActiveMuscleGroup(focusMuscle, selectedSubdivision);
    }
  }, [focusMuscle, selectedSubdivision, loading]);

  useEffect(() => {
    if (animationControllerRef.current) {
      animationControllerRef.current.enabled = vitalAnimation;
    }
  }, [vitalAnimation, loading]);

  // 3. Mount Three.js Scene and Load 3D Model
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isMounted = true;
    setLoading(true);
    setLoadError(null);

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width || container.clientWidth, 320);
    const height = Math.max(rect.height || container.clientHeight, 480);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(0, 0, 45);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 14;
    controls.maxDistance = 120;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Initialize Universal Camera Controller
    const cameraController = new UniversalCameraController(camera, controls);
    cameraControllerRef.current = cameraController;

    // Synchronize active view state as user manually rotates
    const handleControlsEnd = () => {
      const offset = camera.position.clone().sub(controls.target);
      const angle = Math.atan2(offset.x, offset.z);
      if (Math.abs(angle) < Math.PI / 4) {
        setActiveView('front');
      } else if (Math.abs(angle) > (3 * Math.PI) / 4) {
        setActiveView('back');
      } else if (angle >= Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
        setActiveView('side-right');
      } else if (angle <= -Math.PI / 4 && angle >= (-3 * Math.PI) / 4) {
        setActiveView('side-left');
      }
    };
    controls.addEventListener('end', handleControlsEnd);

    // ───────────── 360° Studio Lighting ─────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 0.8);
    scene.add(hemiLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.35);
    frontLight.position.set(0, 3, 35);
    frontLight.target.position.set(0, 0, 0);
    scene.add(frontLight);
    scene.add(frontLight.target);

    const keyLight = new THREE.DirectionalLight(0xfff5ee, 1.6);
    keyLight.position.set(18, 24, 22);
    keyLight.target.position.set(0, 0, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    scene.add(keyLight.target);

    const backLight = new THREE.DirectionalLight(0xfff0ea, 1.4);
    backLight.position.set(0, 3, -35);
    backLight.target.position.set(0, 0, 0);
    scene.add(backLight);
    scene.add(backLight.target);

    const leftLight = new THREE.DirectionalLight(0xaaccff, 0.9);
    leftLight.position.set(-25, 4, 0);
    leftLight.target.position.set(0, 0, 0);
    scene.add(leftLight);
    scene.add(leftLight.target);

    const rightLight = new THREE.DirectionalLight(0xaaccff, 0.9);
    rightLight.position.set(25, 4, 0);
    rightLight.target.position.set(0, 0, 0);
    scene.add(rightLight);
    scene.add(rightLight.target);

    // ───────────── Dedicated Abdominal Sculpting Lighting ─────────────
    const absLight = new THREE.DirectionalLight(0xfff5ee, 1.4);
    absLight.position.set(0, 5, 20);
    absLight.target.position.set(0, 3.8, 0);
    scene.add(absLight);
    scene.add(absLight.target);

    const absContourLight = new THREE.DirectionalLight(0xffeedd, 0.85);
    absContourLight.position.set(-6, 12, 16);
    absContourLight.target.position.set(0, 3.8, 0);
    scene.add(absContourLight);
    scene.add(absContourLight.target);

    // ───────────── Load 3D Anatomy Model ─────────────
    load3DAnatomyModel((pct) => {
      if (isMounted) setLoadProgress(pct);
    })
      .then(({ bodyGroup, muscleMeshes, skeletonGroup, groupMeshMap, bodyBox, bodyCenter, bodySize }) => {
        if (!isMounted) {
          disposeObject3D(bodyGroup, [defaultMuscleMaterial, absMuscleMaterial, boneMaterial, tendonMaterial]);
          return;
        }

        // 1. Center the model at origin (0, 0, 0)
        bodyGroup.position.set(-bodyCenter.x, -bodyCenter.y, -bodyCenter.z);
        scene.add(bodyGroup);

        // Realistic Red & Blue Vascular Circulation Network (Arteries & Veins)
        const vascularGroup = createRealisticVascularSystem();
        vascularGroup.visible = showVessels;
        scene.add(vascularGroup);
        vascularGroupRef.current = vascularGroup;

        bodyGroupRef.current = bodyGroup;
        muscleMeshesRef.current = muscleMeshes;
        skeletonGroupRef.current = skeletonGroup;
        groupMeshMapRef.current = groupMeshMap;

        // 2. Compute true world bounds
        const worldBox = new THREE.Box3().setFromObject(bodyGroup);
        const worldCenter = worldBox.getCenter(new THREE.Vector3());
        const worldSize = worldBox.getSize(new THREE.Vector3());

        modelCenterRef.current.copy(worldCenter);

        // 3. Automatically adjust camera distance for complete full-body framing
        const fovRad = (camera.fov * Math.PI) / 180;
        const currentAspect = (container.clientWidth || width) / (container.clientHeight || height);
        camera.aspect = currentAspect;

        const fovH = 2 * Math.atan(Math.tan(fovRad / 2) * currentAspect);
        const distVertical = (worldSize.y / 2) / Math.tan(fovRad / 2);
        const distHorizontal = (worldSize.x / 2) / Math.tan(fovH / 2);

        const optimalDistance = Math.max(distVertical, distHorizontal) * 1.32;
        optimalDistRef.current = optimalDistance;

        camera.near = Math.max(0.1, optimalDistance * 0.05);
        camera.far = Math.max(250, optimalDistance * 6);
        camera.updateProjectionMatrix();

        if (focusMuscle && (UNIVERSAL_MUSCLE_CONFIG[focusMuscle] || MUSCLE_EXPLORATION_CONFIG[focusMuscle])) {
          const cfg = UNIVERSAL_MUSCLE_CONFIG[focusMuscle] || MUSCLE_EXPLORATION_CONFIG[focusMuscle];
          controls.target.set(cfg.cameraTarget.x, cfg.cameraTarget.y, cfg.cameraTarget.z);
          camera.position.set(cfg.cameraPosition.x, cfg.cameraPosition.y, cfg.cameraPosition.z);
          camera.lookAt(controls.target);
          controls.minDistance = 14;
          controls.maxDistance = optimalDistance * 3.2;
          controls.update();
        } else {
          camera.position.set(worldCenter.x, worldCenter.y, worldCenter.z + optimalDistance);
          camera.lookAt(worldCenter);
          controls.target.copy(worldCenter);
          controls.minDistance = 14;
          controls.maxDistance = optimalDistance * 3.2;
          controls.update();
        }

        // 4. Ground Shadow Plane & Grid at feet
        const feetY = worldBox.min.y - 0.15;
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 60),
          new THREE.ShadowMaterial({ opacity: 0.22 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(worldCenter.x, feetY, worldCenter.z);
        ground.receiveShadow = true;
        scene.add(ground);

        const grid = new THREE.GridHelper(50, 25, 0x334155, 0x1e293b);
        grid.position.set(worldCenter.x, feetY, worldCenter.z);
        scene.add(grid);

        // 5. Initialize Anatomical Body Structure Animation Controller (per threejs-skills)
        const animController = new AnatomicalAnimationController({
          bodyGroup,
          skeletonGroup,
          vascularGroup,
          muscleMeshes
        });
        animationControllerRef.current = animController;
        animController.setActiveMuscleGroup(focusMuscle, selectedSubdivision);

        setLoading(false);
        updateMeshHighlights();
      })
      .catch((err) => {
        console.error('[3D Anatomy] Error:', err);
        if (isMounted) {
          setLoading(false);
          setLoadError(err.message || 'Failed to load 3D model.');
        }
      });

    // ───────────── Resize Observer ─────────────
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const r = container.getBoundingClientRect();
      const newW = r.width;
      const newH = r.height;
      if (newW === 0 || newH === 0) return;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ───────────── Render Loop (Timer & Animation Loop per threejs-skills) ─────────────
    const timer = timerRef.current;
    timer.connect(document);

    const animate = () => {
      timer.update();
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      // Update physiological respiration, cardiac circulation & muscle flex dynamics
      if (animationControllerRef.current) {
        animationControllerRef.current.update(delta, elapsed);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      if (cameraControllerRef.current) {
        cameraControllerRef.current.dispose();
        cameraControllerRef.current = null;
      }
      if (animationControllerRef.current) {
        animationControllerRef.current.dispose();
        animationControllerRef.current = null;
      }
      controls.removeEventListener('end', handleControlsEnd);
      controls.dispose();
      disposeObject3D(scene, [defaultMuscleMaterial, absMuscleMaterial, boneMaterial, tendonMaterial,
        selectedRedMaterial, selectedSubdivisionMaterial, selectedGroupSubtleMaterial, hoverMaterial]);
      muscleMeshesRef.current = [];
      bodyGroupRef.current = null;
      skeletonGroupRef.current = null;
      vascularGroupRef.current = null;
      timer.disconnect();
      renderer.dispose();
    };
  }, []);

  // 4. Toggle Skeleton visibility
  useEffect(() => {
    if (skeletonGroupRef.current) {
      skeletonGroupRef.current.visible = showSkeleton;
    }
  }, [showSkeleton, loading]);

  // Toggle Vascular network visibility (Red arteries & Blue veins)
  useEffect(() => {
    if (vascularGroupRef.current) {
      vascularGroupRef.current.visible = showVessels;
    }
  }, [showVessels, loading]);

  // 5. Raycasting for Single Muscle Selection
  const handlePointerDown = (e) => {
    pointerDownRef.current = {
      time: performance.now(),
      x: e.clientX,
      y: e.clientY
    };
  };

  const handlePointerUp = (e) => {
    const dt = performance.now() - pointerDownRef.current.time;
    const dist = Math.hypot(e.clientX - pointerDownRef.current.x, e.clientY - pointerDownRef.current.y);
    // If it was a quick click and not a camera rotation drag (< 400ms and < 6px movement)
    if (dt < 400 && dist < 6) {
      processRaycastClick(e.clientX, e.clientY);
    }
  };

  // Precise mesh-level target resolution via Three.js Raycaster
  const resolveTarget = (intersects) => {
    if (!intersects || intersects.length === 0) return null;

    const firstHit = intersects[0];
    const firstMesh = firstHit.object;
    const firstGroup = firstMesh.userData.bodyPart;

    // In BodyParts3D anatomy, the thin aponeurosis sheath of the external oblique
    // wraps immediately in front of the upper rectus abdominis.
    // If the ray penetrated external oblique AND rectus abdominis is struck right behind it (< 0.25 units):
    // the user clicked directly on the 6-pack abs, resolving precisely to Abs.
    // Otherwise, clicks on the flank/waist penetrate ONLY the Oblique, resolving precisely to Obliques.
    if (firstGroup === 'Obliques') {
      const absHit = intersects.find((h) => h.object.userData.bodyPart === 'Abs');
      if (absHit && Math.abs(absHit.distance - firstHit.distance) < 0.25) {
        return {
          object: absHit.object,
          bodyPart: 'Abs',
          displayName: absHit.object.userData.displayName,
          subdivision: absHit.object.userData.subdivision
        };
      }
    }

    if (firstGroup && firstGroup !== 'Other') {
      return {
        object: firstMesh,
        bodyPart: firstGroup,
        displayName: firstMesh.userData.displayName,
        subdivision: firstMesh.userData.subdivision
      };
    }

    // Fallback: first non-Other muscle in the intersection stack
    for (let i = 0; i < intersects.length; i++) {
      const obj = intersects[i].object;
      const bp = obj.userData.bodyPart;
      if (bp && bp !== 'Other') {
        return {
          object: obj,
          bodyPart: bp,
          displayName: obj.userData.displayName,
          subdivision: obj.userData.subdivision
        };
      }
    }

    return null;
  };

  const processRaycastClick = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const meshes = muscleMeshesRef.current;
    if (!canvas || !camera || meshes.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    // Filter only visible interactive meshes (skipping Other, non-muscle membranes)
    const visibleInteractiveMeshes = meshes.filter((m) => {
      const bp = m.userData.bodyPart || m.userData.gymFitGroup;
      return m.visible && bp && bp !== 'Other';
    });
    const intersects = raycasterRef.current.intersectObjects(visibleInteractiveMeshes, false);

    const resolved = resolveTarget(intersects);
    if (resolved && resolved.bodyPart && resolved.bodyPart !== 'Other') {
      if (focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle]) {
        // If user clicks a different body part while in exploration mode, switch to it
        if (resolved.bodyPart !== focusMuscle) {
          onToggleMuscle(resolved.bodyPart, resolved.object.userData);
          return;
        }

        const sub = resolved.object?.userData?.subdivision;
        const cfg = UNIVERSAL_MUSCLE_CONFIG[focusMuscle];
        const raw = (resolved.object?.userData?.rawName || '').toLowerCase();

        // 1. Direct subdivision match: clicking the same subregion toggles/deselects it
        const directMatch = cfg.regions.find((r) => r.name.toLowerCase() === (sub || '').toLowerCase());
        if (directMatch) {
          const next = selectedSubdivision === directMatch.name ? null : directMatch.name;
          onSelectSubdivision(next);
          return;
        }

        // 2. Keyword fallback match
        for (const r of cfg.regions) {
          if (r.meshKeywords.some((kw) => raw.includes(kw.toLowerCase()))) {
            const next = selectedSubdivision === r.name ? null : r.name;
            onSelectSubdivision(next);
            return;
          }
        }

        // 3. Clicking the focused muscle body part again toggles/deselects the entire part
        onToggleMuscle(resolved.bodyPart, resolved.object.userData);
        return;
      }

      onToggleMuscle(resolved.bodyPart, resolved.object.userData);
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const meshes = muscleMeshesRef.current;
    if (!canvas || !camera || meshes.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const visibleInteractiveMeshes = meshes.filter((m) => {
      const bp = m.userData.bodyPart || m.userData.gymFitGroup;
      return m.visible && bp && bp !== 'Other';
    });
    const intersects = raycasterRef.current.intersectObjects(visibleInteractiveMeshes, false);

    const resolved = resolveTarget(intersects);
    if (resolved && resolved.bodyPart && resolved.bodyPart !== 'Other') {
      canvas.style.cursor = 'pointer';
      hoveredGroupRef.current = resolved.bodyPart;
      // In full body mode, hover tooltip displays ONLY the major body structure
      setHoveredInfo({
        name: resolved.bodyPart,
        bodyPart: resolved.bodyPart
      });
      onHoverMuscle(resolved.bodyPart);
      updateMeshHighlights();
      return;
    }

    canvas.style.cursor = 'default';
    if (hoveredGroupRef.current !== null) {
      hoveredGroupRef.current = null;
      setHoveredInfo(null);
      onHoverMuscle(null);
      updateMeshHighlights();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[680px] sm:h-[760px] lg:h-[800px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black select-none shadow-2xl"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="w-full h-full block focus:outline-none touch-none"
      />

      {/* Loading Overlay */}
      {loading && !loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin mb-4" />
          <p className="text-sm font-bold text-white tracking-wide">
            Loading Real 3D Muscular Anatomy...
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            467 MRI-based muscle meshes ({loadProgress}%)
          </p>
          <div className="w-52 h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-200"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            Failed to Load 3D Model
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Viewer
          </button>
        </div>
      )}

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-white text-xs font-semibold shadow-lg">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>3D Anatomical Body</span>
          <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-800">
            Single Muscle Focus
          </span>
          {vitalAnimation && (
            <span className="text-[10px] text-red-400 font-mono px-1.5 py-0.5 rounded bg-red-950/60 border border-red-900/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>Vital Respiration & Pulse</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-medium pl-1 drop-shadow">
          Click any muscle to isolate it and inspect its anatomical subdivisions
        </p>
      </div>

      {/* Top Right Camera Preset View Controls & Skeleton Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-lg">
        <button
          type="button"
          onClick={() => setCameraView('front')}
          title="Front View"
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            activeView === 'front'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setCameraView('back')}
          title="Back View"
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            activeView === 'back'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCameraView('side-left')}
          title="Left Profile"
          className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
            activeView === 'side-left'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          L-Side
        </button>
        <button
          type="button"
          onClick={() => setCameraView('side-right')}
          title="Right Profile"
          className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
            activeView === 'side-right'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          R-Side
        </button>
        <button
          type="button"
          onClick={() => setCameraView('reset')}
          title="Reset Camera & Rotation"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-700/60 mx-1" />

        <button
          type="button"
          onClick={() => setShowVessels(!showVessels)}
          title={showVessels ? 'Hide Cardiovascular Veins & Arteries' : 'Show Cardiovascular Veins & Arteries'}
          className={`p-1.5 rounded-lg transition-colors ${
            showVessels ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setShowSkeleton(!showSkeleton)}
          title={showSkeleton ? 'Hide Skeletal Framework' : 'Show Skeletal Framework'}
          className={`p-1.5 rounded-lg transition-colors ${
            showSkeleton ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setVitalAnimation(!vitalAnimation)}
          title={
            vitalAnimation
              ? 'Pause Physiological Respiration & Pulse Dynamics (Active: 14 breaths/min, 72 bpm)'
              : 'Enable Physiological Respiration & Pulse Dynamics'
          }
          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
            vitalAnimation ? 'text-rose-400 bg-rose-950/50' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${vitalAnimation ? 'animate-pulse text-red-500 fill-red-500/20' : ''}`} />
        </button>
      </div>

      {/* Hover Tooltip - Identifies Major Body Part Only */}
      {hoveredInfo && !focusMuscle && (
        <div className="absolute top-20 left-4 z-10 animate-fadeIn pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wide">
              {hoveredInfo.bodyPart}
            </span>
          </div>
        </div>
      )}

      {/* Selected Muscle Indicator - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 shadow-lg flex flex-wrap items-center gap-2 max-w-md">
          <span className="font-semibold text-white">Active:</span>
          <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[11px] font-bold shadow-sm">
            {focusMuscle ? `${focusMuscle} Exploration` : selectedList[0] || 'Full Body'}
          </span>
          {focusMuscle && (
            <button
              type="button"
              onClick={() => onToggleMuscle(focusMuscle)}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm"
              title="Deselect this part and return to full-body"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Deselect Part</span>
            </button>
          )}
        </div>
      </div>

      {/* 360 Rotation & Zoom Tip - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400">
        <Compass className="w-3.5 h-3.5 text-slate-400" />
        <span>Drag to rotate 360° • Scroll to zoom</span>
      </div>

      {/* UNIVERSAL MUSCLE EXPLORATION MODULE */}
      {focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle] && (
        <UniversalExplorationModule
          muscleGroup={focusMuscle}
          muscleMeshes={muscleMeshesRef.current}
          camera={cameraRef.current}
          containerRef={containerRef}
          bodyGroup={bodyGroupRef.current}
          selectedRegion={selectedSubdivision}
          onSelectRegion={(regName) => {
            onSelectSubdivision(regName);
          }}
          onOpenExercises={(regName) => {
            onOpenExercises(regName);
          }}
        />
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { disposeObject3D } from '../../utils/disposeObject3D';
import { StandingBicepCurlViewer } from './StandingBicepCurlViewer';
import { InclineDumbbellPress3DViewer } from './InclineDumbbellPress3DViewer';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Compass,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Dumbbell,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

/**
 * ExerciseDemonstrationViewer Component
 *
 * A reusable interactive 3D skeletal animation demonstration module:
 * 1. Loads rigged animated GLB characters with skeletal animation clips
 * 2. Play, Pause, and Replay controls
 * 3. Speed selector: 0.5x, 1x, 1.5x, 2x
 * 4. Seekable interactive animation timeline scrubber
 * 5. 360° camera rotation via OrbitControls
 * 6. Zoom In and Zoom Out controls
 * 7. Camera angle presets: Front, Side, Back, Reset
 * 8. Full-screen viewing support
 * 9. Comprehensive loading and error states
 * 10. Live rep counter & biomechanical contraction phase indicator
 *
 * @param {string} modelUrl - Path to rigged animated GLB file
 * @param {string} exerciseName - Name of the exercise
 * @param {string} targetMuscle - Primary muscle worked
 * @param {string} equipment - Equipment type
 * @param {string} difficulty - Difficulty level
 * @param {boolean} autoPlay - Automatically play on load (default true)
 * @param {string} className - Optional container styling
 */
const StandardGLBViewer = ({
  modelUrl = '/exercises/bicep_curl.glb',
  exerciseName = 'Exercise Demonstration',
  targetMuscle = 'Target Muscle',
  equipment = 'Equipment',
  difficulty = 'Intermediate',
  autoPlay = true,
  className = ''
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const actionRef = useRef(null);
  const modelRef = useRef(null);
  const timerRef = useRef(new THREE.Timer());

  // Component UI State
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(4.0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [repCount, setRepCount] = useState(0);

  // View & Presentation State
  const [activeView, setActiveView] = useState('front');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const cameraFrameRef = useRef(null);
  const playbackRef = useRef(null);
  playbackRef.current = { isPlaying, isScrubbing, playbackSpeed };

  // Camera framing refs
  const initialCamPosRef = useRef(new THREE.Vector3(0, 1.2, 3.2));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 1.0, 0));
  const optimalDistRef = useRef(3.2);

  // Format seconds to mm:ss.ms
  const formatTime = (secs) => {
    const s = Math.max(0, secs);
    const m = Math.floor(s / 60);
    const rem = (s % 60).toFixed(1);
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Determine exercise contraction phase from current time progress
  const getRepPhase = () => {
    if (!duration || duration <= 0) return 'Exercise Setup';
    const progress = (currentTime % duration) / duration;
    if (progress < 0.15) return 'Initial Position';
    if (progress < 0.45) return 'Concentric Drive (Squeeze)';
    if (progress < 0.6) return 'Peak Contraction';
    if (progress < 0.9) return 'Eccentric Lowering (Control)';
    return 'Reset & Reset Rep';
  };

  // 1. Initialize Three.js Scene and Load GLB
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isMounted = true;
    setLoading(true);
    setLoadError(null);
    setLoadProgress(0);
    setRepCount(0);
    setCurrentTime(0);

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

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
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    cameraRef.current = camera;

    // OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.0;
    controls.maxDistance = 15;
    controls.target.set(0, 1.0, 0);
    controls.update();
    controlsRef.current = controls;

    // ───────────── 360° Studio Lighting ─────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ee, 1.6);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 0.8);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff4444, 0.9);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Grid Floor & Shadow Plane
    const grid = new THREE.GridHelper(12, 24, 0xef4444, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.28 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.005;
    ground.receiveShadow = true;
    scene.add(ground);

    // ───────────── Load Animated GLB Character ─────────────
    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        if (!isMounted) {
          disposeObject3D(gltf.scene);
          return;
        }

        const model = gltf.scene;
        modelRef.current = model;

        // Auto-center and compute bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Place feet on ground
        model.position.y -= box.min.y;

        // Cast & receive shadows on all meshes and disable frustum culling on skinned meshes (per Three.js skill)
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.isSkinnedMesh) {
              child.frustumCulled = false;
            }
          }
        });

        scene.add(model);

        // Optimal camera framing
        const maxDim = Math.max(size.x, size.y, size.z, 1.8);
        const dist = maxDim * 1.5;
        optimalDistRef.current = dist;
        targetLookAtRef.current.set(center.x, maxDim * 0.55, center.z);
        initialCamPosRef.current.set(center.x, maxDim * 0.6, center.z + dist);

        camera.position.copy(initialCamPosRef.current);
        controls.target.copy(targetLookAtRef.current);
        controls.update();

        // ───────────── Animation Mixer Setup ─────────────
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          const clip = gltf.animations[0];
          setDuration(clip.duration || 4.0);

          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat);
          action.setEffectiveTimeScale(playbackRef.current.playbackSpeed);

          if (autoPlay) {
            action.play();
            setIsPlaying(true);
          } else {
            action.play();
            action.paused = true;
            setIsPlaying(false);
          }
          actionRef.current = action;

          // Track completed repetitions
          mixer.addEventListener('loop', () => {
            setRepCount((prev) => prev + 1);
          });
        }

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          if (isMounted) setLoadProgress(pct);
        }
      },
      (err) => {
        console.error('[3D Exercise Viewer] GLB Load Error:', err);
        if (isMounted) {
          setLoading(false);
          setLoadError('Failed to load 3D exercise character model.');
        }
      }
    );

    // ───────────── Resize Handler ─────────────
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

    // ───────────── Render Loop (Timer & AnimationMixer per Three.js skill) ─────────────
    const timer = timerRef.current;
    timer.connect(document);

    const animate = () => {
      timer.update();
      const delta = timer.getDelta();

      if (mixerRef.current && !playbackRef.current.isScrubbing) {
        mixerRef.current.update(delta);
        if (actionRef.current) {
          const t = actionRef.current.time % actionRef.current.getClip().duration;
          setCurrentTime(t);
        }
      }

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
      if (mixerRef.current && modelRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(modelRef.current);
      }
      mixerRef.current = null;
      actionRef.current = null;
      modelRef.current = null;
      disposeObject3D(scene);
      timer.disconnect();
      renderer.dispose();
    };
  }, [modelUrl]);

  // 2. Play / Pause Control
  const togglePlayPause = useCallback(() => {
    if (!actionRef.current) return;
    const action = actionRef.current;
    if (isPlaying) {
      action.paused = true;
      setIsPlaying(false);
    } else {
      action.paused = false;
      action.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // 3. Replay Animation (Reset to time 0 and play)
  const replayAnimation = useCallback(() => {
    if (!actionRef.current || !mixerRef.current) return;
    actionRef.current.reset().play();
    actionRef.current.paused = false;
    mixerRef.current.setTime(0);
    setRepCount(0);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  // 4. Playback Speed Handler (0.5x, 1x, 1.5x, 2x)
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (actionRef.current) {
      actionRef.current.setEffectiveTimeScale(speed);
    }
  };

  // 5. Timeline Scrubber (Seek to specific timestamp)
  const handleScrubStart = () => {
    setIsScrubbing(true);
    if (actionRef.current) actionRef.current.paused = true;
  };

  const handleScrubChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (actionRef.current && mixerRef.current) {
      actionRef.current.time = newTime;
      mixerRef.current.update(0);
    }
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
    if (actionRef.current && isPlaying) {
      actionRef.current.paused = false;
    }
  };

  // 6. Camera Zoom In & Out
  const zoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const target = controlsRef.current.target;
    camera.position.lerp(target, 0.22);
    controlsRef.current.update();
  };

  const zoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const target = controlsRef.current.target;
    const dir = camera.position.clone().sub(target).normalize();
    camera.position.addScaledVector(dir, 0.6);
    controlsRef.current.update();
  };

  // 7. Smooth Camera Presets (Front, Side, Back, Reset)
  const setCameraPreset = (viewType) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    cancelAnimationFrame(cameraFrameRef.current);

    setActiveView(viewType);
    const target = targetLookAtRef.current.clone();
    const dist = optimalDistRef.current;

    const targetPos = new THREE.Vector3();

    switch (viewType) {
      case 'front':
        targetPos.set(target.x, target.y, target.z + dist);
        break;
      case 'side-left':
        targetPos.set(target.x - dist, target.y, target.z);
        break;
      case 'side-right':
        targetPos.set(target.x + dist, target.y, target.z);
        break;
      case 'back':
        targetPos.set(target.x, target.y, target.z - dist);
        break;
      case 'reset':
      default:
        targetPos.copy(initialCamPosRef.current);
        setActiveView('front');
        break;
    }

    // Smooth orbital interpolation
    const startPos = camera.position.clone();
    const startTime = performance.now();
    const durationMs = 650;

    const animLoop = (now) => {
      const p = Math.min(1.0, (now - startTime) / durationMs);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      camera.position.lerpVectors(startPos, targetPos, eased);
      controls.target.lerp(target, eased);
      controls.update();

      if (p < 1.0) {
        cameraFrameRef.current = requestAnimationFrame(animLoop);
      }
    };
    cameraFrameRef.current = requestAnimationFrame(animLoop);
  };

  // 8. Fullscreen Toggle
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black select-none shadow-2xl flex flex-col justify-between ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block focus:outline-none touch-none"
      />

      {/* Top HUD Badges */}
      <div className="relative z-10 p-3 sm:p-4 flex items-start justify-between gap-2 pointer-events-none">
        {/* Exercise Metadata Badge */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
              {exerciseName}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
              {targetMuscle}
            </span>
          </div>

          {/* Biomechanical Rep Phase Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300 w-fit pointer-events-auto">
            <Activity className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Phase:</span>
            <span className="text-white font-bold">{getRepPhase()}</span>
          </div>
        </div>

        {/* Top Right Controls: Camera Presets & Fullscreen */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraPreset('front')}
            title="Front Angle View"
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeView === 'front'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('side-right')}
            title="Side Profile View"
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeView === 'side-right' || activeView === 'side-left'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Side
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('back')}
            title="Back Angle View"
            className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeView === 'back'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Back
          </button>

          <div className="w-px h-4 bg-slate-700/60 mx-0.5" />

          {/* Zoom Buttons */}
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom In"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom Out"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={() => setCameraPreset('reset')}
            title="Reset Camera Position"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-700/60 mx-0.5" />

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && !loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin mb-3" />
          <h5 className="text-xs font-bold text-white tracking-wide">
            Loading Rigged 3D Character & Skeletal Motion...
          </h5>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            {loadProgress > 0 ? `${loadProgress}% loaded` : 'Extracting biomechanical bones & clips'}
          </p>
        </div>
      )}

      {/* Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h5 className="text-xs font-bold text-white mb-1">
            Failed to Load 3D Exercise Model
          </h5>
          <p className="text-[11px] text-slate-400 max-w-xs mb-3">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Bottom Interactive Playback Control Bar */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-slate-950/85 to-transparent flex flex-col gap-2">
        {/* Seekable Timeline Scrubber Track */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 min-w-[36px] text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 4.0}
              step="0.01"
              value={currentTime}
              onMouseDown={handleScrubStart}
              onTouchStart={handleScrubStart}
              onChange={handleScrubChange}
              onMouseUp={handleScrubEnd}
              onTouchEnd={handleScrubEnd}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none transition-all group-hover:h-2"
              title="Seek animation timeline"
            />
          </div>

          <span className="text-[10px] font-mono text-slate-500 min-w-[36px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row: Play/Pause, Replay, Speed Selector & Rep Counter */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-500/25 transition-all"
              title={isPlaying ? 'Pause Animation (Space)' : 'Play Animation (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Replay Button */}
            <button
              type="button"
              onClick={replayAnimation}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Replay Animation from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Completed Rep Counter */}
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
              <Dumbbell className="w-3 h-3 text-red-400" />
              <span>Reps:</span>
              <span className="font-extrabold text-white text-xs">{repCount}</span>
            </div>
          </div>

          {/* Speed Selector: 0.5x, 1x, 1.5x, 2x */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-bold">
            <span className="text-slate-500 px-1.5 text-[9px] uppercase tracking-wider">Speed:</span>
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  playbackSpeed === speed
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ExerciseDemonstrationViewer Dispatcher
 * Seamlessly routes biceps curl exercises to the realistic
 * StandingBicepCurlViewer with dynamic muscle highlighting, while
 * handling all other movements via rigged skeletal GLB loading.
 */
export const ExerciseDemonstrationViewer = (props) => {
  const isInclineDumbbell = Boolean(
    (props.videoUrl && props.videoUrl.includes('incline')) ||
    (props.modelUrl && props.modelUrl.includes('incline_dumbbell')) ||
    (props.exerciseName && (
      props.exerciseName.toLowerCase().includes('incline dumbbell press') ||
      props.exerciseName.toLowerCase().includes('incline dumbbell bench press')
    ))
  );

  if (isInclineDumbbell) {
    return <InclineDumbbellPress3DViewer {...props} />;
  }

  const isBicepCurl = Boolean(
    (props.modelUrl && props.modelUrl.includes('bicep_curl')) ||
    (props.exerciseName && (
      props.exerciseName.toLowerCase().includes('bicep') ||
      props.exerciseName.toLowerCase().includes('curl')
    )) ||
    (props.targetMuscle && props.targetMuscle.toLowerCase().includes('bicep'))
  );

  if (isBicepCurl) {
    return <StandingBicepCurlViewer {...props} />;
  }

  return <StandardGLBViewer {...props} />;
};

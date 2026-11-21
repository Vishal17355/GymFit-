import * as THREE from 'three';
import { UNIVERSAL_MUSCLE_CONFIG } from './universalMuscleConfig';

/**
 * Universal Camera Controller
 * Manages smooth, cinematic orbital ease-in-out transitions:
 * - Zooming into ANY major body part: Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs
 * - Resetting to full-body overview
 * - Presets: Front, Back, Left Side (L-Side), Right Side (R-Side), and Reset
 * Uses spherical interpolation so the camera never clips through the human anatomy.
 */
export class UniversalCameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.activeTween = null;
  }

  ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Smooth orbital transition around targetLookAt using spherical coordinates.
   * Traverses along the shortest angular arc around the subject.
   */
  animateOrbit(targetPos, targetLookAt, duration = 750, onComplete = null) {
    if (this.activeTween) {
      cancelAnimationFrame(this.activeTween);
      this.activeTween = null;
    }

    const startTarget = this.controls.target.clone();
    const startOffset = this.camera.position.clone().sub(startTarget);
    const endOffset = targetPos.clone().sub(targetLookAt);

    const startSpherical = new THREE.Spherical().setFromVector3(startOffset);
    const endSpherical = new THREE.Spherical().setFromVector3(endOffset);

    // Calculate shortest angular path around Y (theta)
    let dTheta = (endSpherical.theta - startSpherical.theta) % (2 * Math.PI);
    if (dTheta > Math.PI) dTheta -= 2 * Math.PI;
    if (dTheta < -Math.PI) dTheta += 2 * Math.PI;

    const dPhi = endSpherical.phi - startSpherical.phi;
    const dRadius = endSpherical.radius - startSpherical.radius;

    const startTime = performance.now();

    const loop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      const eased = this.ease(progress);

      // Interpolate spherical orbit
      const curRadius = startSpherical.radius + dRadius * eased;
      const curPhi = startSpherical.phi + dPhi * eased;
      const curTheta = startSpherical.theta + dTheta * eased;

      const curOffset = new THREE.Vector3().setFromSphericalCoords(curRadius, curPhi, curTheta);

      // Smoothly update controls target and camera position
      this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
      this.camera.position.copy(this.controls.target).add(curOffset);
      this.camera.lookAt(this.controls.target);
      this.controls.update();

      if (progress < 1.0) {
        this.activeTween = requestAnimationFrame(loop);
      } else {
        this.activeTween = null;
        if (onComplete) onComplete();
      }
    };

    this.activeTween = requestAnimationFrame(loop);
  }

  /**
   * Sets camera view preset: 'front', 'back', 'side-left', 'side-right', 'reset'
   */
  setCameraPreset(
    viewType,
    optimalDistance = 42,
    modelCenter = new THREE.Vector3(0, 0, 0),
    focusMuscle = null,
    onComplete = null
  ) {
    let target = modelCenter.clone();
    let dist = optimalDistance;

    if (focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle]) {
      const cfg = UNIVERSAL_MUSCLE_CONFIG[focusMuscle];
      target.set(cfg.cameraTarget.x, cfg.cameraTarget.y, cfg.cameraTarget.z);
      dist = this.camera.position.distanceTo(target);
      if (dist < 16 || dist > 60) {
        dist = Math.hypot(
          cfg.cameraPosition.x - cfg.cameraTarget.x,
          cfg.cameraPosition.y - cfg.cameraTarget.y,
          cfg.cameraPosition.z - cfg.cameraTarget.z
        );
      }
    } else {
      target = this.controls.target.clone();
      dist = Math.max(18, this.camera.position.distanceTo(target));
      if (Math.abs(dist - optimalDistance) > optimalDistance * 0.45) {
        dist = optimalDistance;
      }
    }

    const targetPos = new THREE.Vector3();

    switch (viewType) {
      case 'front':
        targetPos.set(target.x, target.y, target.z + dist);
        break;
      case 'back':
        targetPos.set(target.x, target.y, target.z - dist);
        break;
      case 'side-left':
        // Left profile view (camera positioned at -X)
        targetPos.set(target.x - dist, target.y, target.z);
        break;
      case 'side-right':
        // Right profile view (camera positioned at +X)
        targetPos.set(target.x + dist, target.y, target.z);
        break;
      case 'reset':
      default:
        if (focusMuscle && UNIVERSAL_MUSCLE_CONFIG[focusMuscle]) {
          this.zoomToMuscle(focusMuscle, onComplete);
          return;
        } else {
          this.resetToFullBody(optimalDistance, modelCenter, onComplete);
          return;
        }
    }

    this.animateOrbit(targetPos, target, 750, onComplete);
  }

  /**
   * Smoothly zooms into any focused muscle group:
   * Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs.
   */
  zoomToMuscle(muscleGroup = 'Biceps', onComplete = null) {
    const config = UNIVERSAL_MUSCLE_CONFIG[muscleGroup] || UNIVERSAL_MUSCLE_CONFIG.Biceps;
    const targetPos = new THREE.Vector3(
      config.cameraPosition.x,
      config.cameraPosition.y,
      config.cameraPosition.z
    );
    const targetLookAt = new THREE.Vector3(
      config.cameraTarget.x,
      config.cameraTarget.y,
      config.cameraTarget.z
    );

    this.animateOrbit(targetPos, targetLookAt, 1000, onComplete);
  }

  /**
   * Smoothly resets the camera back to full-body overview.
   */
  resetToFullBody(optimalDistance = 42, modelCenter = new THREE.Vector3(0, 0, 0), onComplete = null) {
    const targetPos = new THREE.Vector3(modelCenter.x, modelCenter.y, modelCenter.z + optimalDistance);
    const targetLookAt = modelCenter.clone();

    this.animateOrbit(targetPos, targetLookAt, 1000, onComplete);
  }

  dispose() {
    if (this.activeTween) {
      cancelAnimationFrame(this.activeTween);
      this.activeTween = null;
    }
  }
}

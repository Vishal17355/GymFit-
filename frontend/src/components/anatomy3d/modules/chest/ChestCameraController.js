import * as THREE from 'three';
import { CHEST_CONFIG } from './chestRegionConfig';

/**
 * Chest Camera Controller
 * Handles smooth interpolation of camera position and OrbitControls target
 * for entering Chest exploration and returning to full-body view.
 */
export class ChestCameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.currentAnim = null;
  }

  animateTo(toPos, toTarget, durationMs = 800, onComplete = null) {
    if (!this.camera || !this.controls) return;

    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth ease-in-out cubic curve
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, toPos, ease);
      this.controls.target.lerpVectors(startTarget, toTarget, ease);
      this.controls.update();

      if (progress < 1) {
        this.currentAnim = requestAnimationFrame(step);
      } else {
        this.currentAnim = null;
        if (onComplete) onComplete();
      }
    };

    this.currentAnim = requestAnimationFrame(step);
  }

  zoomToChest(onComplete = null) {
    const target = new THREE.Vector3(
      CHEST_CONFIG.cameraTarget.x,
      CHEST_CONFIG.cameraTarget.y,
      CHEST_CONFIG.cameraTarget.z
    );
    const pos = new THREE.Vector3(
      CHEST_CONFIG.cameraPosition.x,
      CHEST_CONFIG.cameraPosition.y,
      CHEST_CONFIG.cameraPosition.z
    );
    this.animateTo(pos, target, 850, onComplete);
  }

  resetToFullBody(modelCenter, optimalDist = 42, onComplete = null) {
    const center = modelCenter || new THREE.Vector3(0, 0, 0);
    const target = new THREE.Vector3(center.x, center.y, center.z);
    const pos = new THREE.Vector3(center.x, center.y, center.z + optimalDist);
    this.animateTo(pos, target, 750, onComplete);
  }

  dispose() {
    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }
  }
}

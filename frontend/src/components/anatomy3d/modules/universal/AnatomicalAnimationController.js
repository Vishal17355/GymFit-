import * as THREE from 'three';

/**
 * AnatomicalAnimationController
 *
 * Implements real-time physiological and biomechanical body structure animation
 * based on modern Three.js standards from CloudAI-X/threejs-skills:
 *
 * 1. Respiratory Breathing Dynamics:
 *    Natural physiological inhalation/exhalation cycle expanding the thoracic
 *    cage, pectoralis major, intercostals, and clavicular shoulder girdle.
 *
 * 2. Cardiovascular Blood Circulation Pulse:
 *    Dual-phase (systolic and diastolic) arterial & venous pulse wave
 *    traveling through the vascular circulation network.
 *
 * 3. Biomechanical Muscle Flex & Contraction Dynamics:
 *    Active muscle swelling and tension response upon user selection
 *    utilizing frame-rate independent dampening (THREE.MathUtils.damp).
 */
export class AnatomicalAnimationController {
  constructor({
    bodyGroup = null,
    skeletonGroup = null,
    vascularGroup = null,
    muscleMeshes = []
  }) {
    this.bodyGroup = bodyGroup;
    this.skeletonGroup = skeletonGroup;
    this.vascularGroup = vascularGroup;
    this.muscleMeshes = muscleMeshes;

    // Animation configuration
    this.enabled = true;
    this.breathingEnabled = true;
    this.vascularPulseEnabled = true;
    this.muscleFlexEnabled = true;

    // Physiological parameters
    this.respiratoryRate = 14; // breaths per minute (~4.3s cycle)
    this.heartRate = 72; // beats per minute (~0.83s cardiac cycle)

    // Cached references
    this.thoracicMeshes = [];
    this.activeFlexMeshes = new Set();
    this.currentFlexWeights = new Map(); // mesh -> number

    this.init();
  }

  init() {
    if (!this.muscleMeshes || this.muscleMeshes.length === 0) return;

    // Identify thoracic and respiratory muscle meshes
    const thoracicKeywords = [
      'pectoralis',
      'intercostal',
      'serratus',
      'trapezius',
      'subclavius',
      'sternum',
      'rib'
    ];

    this.thoracicMeshes = this.muscleMeshes.filter((m) => {
      const raw = (m.userData?.rawName || '').toLowerCase();
      const bp = (m.userData?.bodyPart || '').toLowerCase();
      return (
        bp === 'chest' ||
        thoracicKeywords.some((kw) => raw.includes(kw))
      );
    });
  }

  /**
   * Sets which muscle group is currently focused/flexed
   */
  setActiveMuscleGroup(focusMuscle, subdivision = null) {
    this.activeFlexMeshes.clear();
    if (!focusMuscle) return;

    const norm = focusMuscle.toLowerCase();
    const subNorm = subdivision ? subdivision.toLowerCase() : null;

    this.muscleMeshes.forEach((mesh) => {
      const bp = (mesh.userData?.bodyPart || '').toLowerCase();
      const sub = (mesh.userData?.subdivision || '').toLowerCase();
      const raw = (mesh.userData?.rawName || '').toLowerCase();

      if (bp === norm || raw.includes(norm)) {
        if (!subNorm || sub === subNorm || raw.includes(subNorm)) {
          this.activeFlexMeshes.add(mesh);
        }
      }
    });
  }

  /**
   * Updates animations per frame using modern Three.js Timer delta & elapsed
   */
  update(delta, elapsed) {
    if (!this.enabled) return;

    // ─────────────────────────────────────────────────────────────
    // 1. Natural Respiratory Breathing Dynamics
    // ─────────────────────────────────────────────────────────────
    if (this.breathingEnabled && this.thoracicMeshes.length > 0) {
      const breathFreq = (this.respiratoryRate / 60) * Math.PI * 2;
      // Smooth sinusoidal respiratory wave (0 to 1)
      const rawBreath = (Math.sin(elapsed * breathFreq) + 1) * 0.5;
      // Asymmetric respiratory curve (inhalation takes ~40%, exhalation ~60%)
      const breathFactor = Math.pow(rawBreath, 1.4);

      // Expand thoracic cage subtly in Z and elevate in Y
      const zExpansion = 1.0 + 0.038 * breathFactor;
      const yElevation = 0.02 * breathFactor;

      for (let i = 0; i < this.thoracicMeshes.length; i++) {
        const mesh = this.thoracicMeshes[i];
        if (mesh.position && mesh.scale) {
          // Subtle frame-rate independent damp
          mesh.scale.z = THREE.MathUtils.damp(mesh.scale.z, zExpansion, 6, delta);
          mesh.position.y = THREE.MathUtils.damp(mesh.position.y, yElevation, 6, delta);
        }
      }

      // If skeleton is present, expand ribcage subtly
      if (this.skeletonGroup && this.skeletonGroup.children) {
        this.skeletonGroup.children.forEach((child) => {
          const name = (child.name || '').toLowerCase();
          if (name.includes('rib') || name.includes('thorax') || name.includes('sternum')) {
            child.scale.z = THREE.MathUtils.damp(child.scale.z, zExpansion, 6, delta);
          }
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Cardiovascular Circulation Arterial & Venous Pulse
    // ─────────────────────────────────────────────────────────────
    if (this.vascularPulseEnabled && this.vascularGroup) {
      const heartFreq = (this.heartRate / 60) * Math.PI * 2;
      // Dual-peak pulse (systolic spike + dicrotic wave)
      const wave = (elapsed * heartFreq) % (Math.PI * 2);
      const systolic = Math.pow(Math.max(0, Math.sin(wave)), 8);
      const diastolic = 0.35 * Math.pow(Math.max(0, Math.sin(wave + 0.8)), 6);
      const cardiacPulse = systolic + diastolic;

      // Pulse arterial and venous emissive brightness
      this.vascularGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          const isArtery = child.name && child.name.toLowerCase().includes('arter');
          const baseEmissive = isArtery ? 0.32 : 0.28;
          const peakBoost = isArtery ? 0.45 : 0.22;

          child.material.emissiveIntensity = THREE.MathUtils.damp(
            child.material.emissiveIntensity,
            baseEmissive + peakBoost * cardiacPulse,
            12,
            delta
          );
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Biomechanical Muscle Flex Dynamics (Upon Selection)
    // ─────────────────────────────────────────────────────────────
    if (this.muscleFlexEnabled) {
      this.muscleMeshes.forEach((mesh) => {
        const isTarget = this.activeFlexMeshes.has(mesh);
        const currentW = this.currentFlexWeights.get(mesh) || 0;
        const targetW = isTarget ? 1.0 : 0.0;

        // Smoothly interpolate flex tension weight
        const nextW = THREE.MathUtils.damp(currentW, targetW, 8, delta);
        this.currentFlexWeights.set(mesh, nextW);

        if (nextW > 0.001 || currentW > 0.001) {
          // Swell muscle belly slightly along X and Z
          const swell = 1.0 + 0.045 * nextW;
          mesh.scale.x = swell;
          mesh.scale.z = swell;
        } else if (mesh.scale.x !== 1.0 || mesh.scale.z !== 1.0) {
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });
    }
  }

  reset() {
    this.activeFlexMeshes.clear();
    this.currentFlexWeights.clear();

    if (this.thoracicMeshes) {
      this.thoracicMeshes.forEach((mesh) => {
        if (mesh.scale) mesh.scale.set(1, 1, 1);
        if (mesh.position) mesh.position.y = 0;
      });
    }

    if (this.muscleMeshes) {
      this.muscleMeshes.forEach((mesh) => {
        if (mesh.scale) mesh.scale.set(1, 1, 1);
      });
    }
  }

  dispose() {
    this.reset();
    this.thoracicMeshes = [];
    this.activeFlexMeshes.clear();
    this.currentFlexWeights.clear();
  }
}

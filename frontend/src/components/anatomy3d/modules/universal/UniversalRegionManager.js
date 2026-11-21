import * as THREE from 'three';
import { UNIVERSAL_MUSCLE_CONFIG } from './universalMuscleConfig';

/**
 * Universal Region Manager
 * Dynamically maps GLB muscle meshes to their anatomical subdivisions for ANY muscle group:
 * Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs.
 * Computes exact 3D surface anchor coordinates from the real mesh geometries.
 */
export class UniversalRegionManager {
  constructor(muscleGroup = 'Biceps', muscleMeshes = []) {
    this.muscleGroup = muscleGroup;
    this.meshes = muscleMeshes;
    this.config = UNIVERSAL_MUSCLE_CONFIG[muscleGroup] || UNIVERSAL_MUSCLE_CONFIG.Biceps;
    this.regionMeshMap = new Map();
    this.anchors = new Map();
    this.init();
  }

  init() {
    if (!this.config?.regions) return;

    this.config.regions.forEach((region) => {
      const matched = this.findMeshesForRegion(region);
      this.regionMeshMap.set(region.name, matched);

      // Compute exact 3D anchor on the visible muscle surface
      const anchor = this.computeSurfaceAnchor(matched, region.anchorHint);
      this.anchors.set(region.name, anchor);
    });
  }

  findMeshesForRegion(region) {
    const keywords = (region.meshKeywords || []).map((k) => k.toLowerCase());
    const regionNameLower = (region.name || '').toLowerCase();

    return this.meshes.filter((mesh) => {
      const raw = (mesh.userData?.rawName || '').toLowerCase().replace(/_/g, ' ');
      const sub = (mesh.userData?.subdivision || '').toLowerCase();
      const bp = (mesh.userData?.bodyPart || '').toLowerCase();

      // Subdivision names such as "Long Head" are shared by different muscles.
      const belongsToGroup = bp === this.muscleGroup.toLowerCase() ||
        (this.muscleGroup === 'Legs' && bp === 'calves');
      if (!belongsToGroup) return false;

      // Check for direct subdivision match
      if (sub && sub === regionNameLower) return true;

      // Check keywords
      return keywords.some((kw) => raw.includes(kw) || sub.includes(kw));
    });
  }

  computeSurfaceAnchor(matchedMeshes, fallbackHint) {
    if (!matchedMeshes || matchedMeshes.length === 0) {
      return fallbackHint
        ? new THREE.Vector3(fallbackHint.x, fallbackHint.y, fallbackHint.z)
        : new THREE.Vector3(1.8, 7.5, 1.0);
    }

    const box = new THREE.Box3();
    matchedMeshes.forEach((mesh) => {
      if (mesh.geometry) {
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        box.union(mesh.geometry.boundingBox);
      }
    });

    const center = box.getCenter(new THREE.Vector3());
    const isPosterior = this.config.defaultView === 'back';

    // Surface offset: for back/triceps, project onto posterior surface (negative Z); for anterior, project forward (positive Z)
    const surfaceZ = isPosterior ? box.min.z - 0.15 : box.max.z + 0.15;
    const lateralX = Math.abs(center.x) > 0.4 ? Math.abs(center.x) : fallbackHint?.x || 1.8;

    return new THREE.Vector3(lateralX, center.y, surfaceZ);
  }

  getRegionAnchor(regionName) {
    return this.anchors.get(regionName) || new THREE.Vector3(1.8, 7.5, 1.0);
  }

  getMeshesForRegion(regionName) {
    return this.regionMeshMap.get(regionName) || [];
  }

  identifyRegionFromMesh(mesh) {
    if (!mesh?.userData) return null;

    for (const region of this.config.regions) {
      if (this.getMeshesForRegion(region.name).includes(mesh)) return region.name;
    }
    return null;
  }
}

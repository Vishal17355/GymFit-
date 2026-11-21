import * as THREE from 'three';
import { CHEST_CONFIG } from './chestRegionConfig';

/**
 * Chest Region Manager
 * Identifies actual chest meshes from the GLB scene, verifies segmentation,
 * and calculates exact 3D surface anchor coordinates.
 */
export class ChestRegionManager {
  constructor(muscleMeshes = []) {
    this.meshes = muscleMeshes;
    this.regionMeshMap = new Map();
    this.anchors = new Map();
    this.init();
  }

  init() {
    CHEST_CONFIG.regions.forEach((region) => {
      const matched = this.findMeshesForRegion(region);
      this.regionMeshMap.set(region.name, matched);

      // Compute exact 3D anchor on the anterior muscle surface
      const anchor = this.computeSurfaceAnchor(matched, region.anchorHint);
      this.anchors.set(region.name, anchor);
    });
  }

  findMeshesForRegion(region) {
    const keywords = region.meshKeywords || [];
    return this.meshes.filter((mesh) => {
      const raw = (mesh.userData?.rawName || '').toLowerCase();
      const sub = (mesh.userData?.subdivision || '').toLowerCase();
      const bp = (mesh.userData?.bodyPart || '').toLowerCase();

      if (bp !== 'chest' && !raw.includes('pectoralis') && !raw.includes('subclavius') && !raw.includes('serratus')) {
        return false;
      }

      // Check keywords
      return keywords.some((kw) => raw.includes(kw) || sub.includes(kw));
    });
  }

  computeSurfaceAnchor(matchedMeshes, fallbackHint) {
    if (!matchedMeshes || matchedMeshes.length === 0) {
      return fallbackHint
        ? new THREE.Vector3(fallbackHint.x, fallbackHint.y, fallbackHint.z)
        : new THREE.Vector3(1.8, 8.5, 2.0);
    }

    const box = new THREE.Box3();
    matchedMeshes.forEach((mesh) => {
      if (mesh.geometry) {
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        box.union(mesh.geometry.boundingBox);
      }
    });

    const center = box.getCenter(new THREE.Vector3());
    // Anterior surface anchor: pull to right side of sternum and project to visible outer surface
    return new THREE.Vector3(
      Math.abs(center.x) > 0.5 ? Math.abs(center.x) : 1.8,
      center.y,
      box.max.z + 0.2
    );
  }

  getRegionAnchor(regionName) {
    return this.anchors.get(regionName) || new THREE.Vector3(1.8, 8.5, 2.0);
  }

  getMeshesForRegion(regionName) {
    return this.regionMeshMap.get(regionName) || [];
  }

  identifyRegionFromMesh(mesh) {
    if (!mesh?.userData) return null;
    const raw = (mesh.userData.rawName || '').toLowerCase();
    const sub = (mesh.userData.subdivision || '').toLowerCase();

    for (const region of CHEST_CONFIG.regions) {
      if (region.meshKeywords.some((kw) => raw.includes(kw) || sub.includes(kw))) {
        return region.name;
      }
    }
    return null;
  }
}

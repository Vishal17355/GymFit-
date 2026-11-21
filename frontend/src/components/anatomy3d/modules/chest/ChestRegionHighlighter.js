import * as THREE from 'three';
import { CHEST_CONFIG } from './chestRegionConfig';

/**
 * Chest Region Highlighter
 * Manages Three.js materials for Upper, Middle, and Lower Chest.
 * Guarantees that:
 * 1. Upper Chest is Red (#ef4444)
 * 2. Middle Chest is Blue (#3b82f6)
 * 3. Lower Chest is Orange (#f97316)
 * 4. All three regions are distinguishable simultaneously.
 * 5. Selecting an individual region gives it a strong glow without hiding the other regions' colors.
 */
export class ChestRegionHighlighter {
  constructor(regionManager) {
    this.regionManager = regionManager;
    this.materialCache = new Map();
  }

  getMaterial(colorHex, isSelected = false) {
    const key = `${colorHex}_${isSelected ? 'active' : 'idle'}`;
    if (!this.materialCache.has(key)) {
      const col = new THREE.Color(colorHex);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: isSelected ? 1.25 : 0.48,
        roughness: isSelected ? 0.24 : 0.42,
        metalness: isSelected ? 0.12 : 0.05,
        side: THREE.DoubleSide
      });
      this.materialCache.set(key, mat);
    }
    return this.materialCache.get(key);
  }

  applyHighlights(selectedRegion = null) {
    CHEST_CONFIG.regions.forEach((region) => {
      const meshes = this.regionManager.getMeshesForRegion(region.name);
      const isSelected = selectedRegion === region.name;
      const mat = this.getMaterial(region.color, isSelected);

      meshes.forEach((mesh) => {
        mesh.material = mat;
      });
    });
  }

  reset(allMeshes = []) {
    allMeshes.forEach((mesh) => {
      if (mesh.userData?.originalMaterial) {
        mesh.material = mesh.userData.originalMaterial;
      }
    });
  }

  dispose() {
    this.materialCache.forEach((mat) => mat.dispose());
    this.materialCache.clear();
  }
}

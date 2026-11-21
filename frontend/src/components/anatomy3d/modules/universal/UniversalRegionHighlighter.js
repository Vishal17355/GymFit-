import * as THREE from 'three';

/**
 * Universal Region Highlighter
 * Manages Three.js materials for ANY major body part:
 * Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs.
 * Guarantees that:
 * 1. Each subregion is highlighted in its own distinct color.
 * 2. Active/selected subregion has a stronger emissive focus.
 * 3. Original materials are cleanly restored upon deselection/exit.
 */
export class UniversalRegionHighlighter {
  constructor(regionManager) {
    this.regionManager = regionManager;
    this.materialCache = new Map();
  }

  getMaterial(colorHex = '#ef4444', isSelected = false) {
    const key = `${colorHex.toLowerCase()}_${isSelected ? 'active' : 'idle'}`;
    if (!this.materialCache.has(key)) {
      const col = new THREE.Color(colorHex);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: isSelected ? 1.2 : 0.48,
        roughness: isSelected ? 0.24 : 0.42,
        metalness: isSelected ? 0.12 : 0.05,
        side: THREE.DoubleSide
      });
      this.materialCache.set(key, mat);
    }
    return this.materialCache.get(key);
  }

  applyHighlights(selectedRegion = null) {
    const regions = this.regionManager.config?.regions || [];

    regions.forEach((region) => {
      const meshes = this.regionManager.getMeshesForRegion(region.name);
      const isSelected = selectedRegion ? selectedRegion === region.name : false;
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

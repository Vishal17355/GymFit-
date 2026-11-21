import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { UNIVERSAL_MUSCLE_CONFIG } from './universalMuscleConfig';
import { UniversalRegionManager } from './UniversalRegionManager';
import { UniversalRegionHighlighter } from './UniversalRegionHighlighter';
import { UniversalConnectorLines } from './UniversalConnectorLines';
import { UniversalFloatingLabels } from './UniversalFloatingLabels';

/**
 * UniversalExplorationModule Component
 * Unified orchestrator for ANY major muscle group exploration:
 * Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs.
 *
 * Enforces:
 * 1. Independent multi-color highlighting for all subregions.
 * 2. Guaranteed non-overlapping layout for floating boxes (collision-avoidance).
 * 3. Positioning to the side so boxes NEVER cover 3D anatomy.
 * 4. Recalculation as camera rotates 360° or zooms.
 * 5. Clean clickable selection of individual subregions.
 */
export const UniversalExplorationModule = ({
  muscleGroup = 'Biceps',
  muscleMeshes = [],
  camera = null,
  containerRef = null,
  bodyGroup = null,
  selectedRegion = null,
  onSelectRegion = () => {},
  onOpenExercises = () => {}
}) => {
  const [layoutItems, setLayoutItems] = useState([]);
  const regionManagerRef = useRef(null);
  const highlighterRef = useRef(null);

  const config = UNIVERSAL_MUSCLE_CONFIG[muscleGroup] || UNIVERSAL_MUSCLE_CONFIG.Biceps;

  // Initialize Region Manager & Highlighter
  useEffect(() => {
    if (!muscleMeshes || muscleMeshes.length === 0) return;

    const regionManager = new UniversalRegionManager(muscleGroup, muscleMeshes);
    const highlighter = new UniversalRegionHighlighter(regionManager);

    regionManagerRef.current = regionManager;
    highlighterRef.current = highlighter;

    // Apply multi-color highlights
    highlighter.applyHighlights(selectedRegion);

    return () => {
      highlighter.reset(muscleMeshes);
      highlighter.dispose();
    };
  }, [muscleGroup, muscleMeshes]);

  // Update highlights whenever selectedRegion changes
  useEffect(() => {
    if (highlighterRef.current) {
      highlighterRef.current.applyHighlights(selectedRegion);
    }
  }, [selectedRegion]);

  // Screen Projection & Collision-Avoidance Layout Loop
  useEffect(() => {
    let animId = null;

    const computeLayout = () => {
      if (!camera || !containerRef?.current || !regionManagerRef.current) {
        setLayoutItems([]);
        animId = requestAnimationFrame(computeLayout);
        return;
      }

      const container = containerRef.current;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 600;
      const regionManager = regionManagerRef.current;
      const regions = config.regions || [];

      // 1. Project anchors and initial label positions
      const projected = regions.map((region) => {
        const anchorLocal = regionManager.getRegionAnchor(region.name);
        const offset = region.defaultOffset || { x: 5.2, y: 0.0, z: 0.5 };
        const labelLocal = anchorLocal.clone().add(new THREE.Vector3(offset.x, offset.y, offset.z));

        const anchorWorld = anchorLocal.clone();
        const labelWorld = labelLocal.clone();

        if (bodyGroup) {
          bodyGroup.updateMatrixWorld();
          anchorWorld.applyMatrix4(bodyGroup.matrixWorld);
          labelWorld.applyMatrix4(bodyGroup.matrixWorld);
        }

        const pAnchor = anchorWorld.clone().project(camera);
        const pLabel = labelWorld.clone().project(camera);

        const isBehind = pAnchor.z > 1.0;

        const xAnchor = (pAnchor.x * 0.5 + 0.5) * width;
        const yAnchor = (-pAnchor.y * 0.5 + 0.5) * height;

        // Position lateral to the anatomy so boxes NEVER cover 3D muscles
        const boxHalfWidth = 105;
        let targetX;
        if (xAnchor > width * 0.62) {
          targetX = Math.min(width - boxHalfWidth - 14, Math.max(xAnchor + 110, width * 0.78));
        } else {
          targetX = Math.max(xAnchor + 115, Math.min(width - boxHalfWidth - 14, width * 0.76));
        }
        targetX = Math.max(boxHalfWidth + 14, Math.min(width - boxHalfWidth - 14, targetX));

        const rawY = (-pLabel.y * 0.5 + 0.5) * height;

        const toCam = camera.position.clone().sub(anchorWorld).normalize();
        const isPosterior = config.defaultView === 'back';
        const expectedNormal = isPosterior ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 0, 1);
        if (bodyGroup) expectedNormal.applyQuaternion(bodyGroup.quaternion);
        const isFacingCam = expectedNormal.dot(toCam) >= -0.35;

        return {
          id: region.id,
          name: region.name,
          anatomicalHead: region.anatomicalHead,
          color: region.color,
          glowColor: region.glowColor,
          xAnchor,
          yAnchor,
          rawY,
          xLabel: targetX,
          isBehind,
          isFacingCam,
          isSelected: selectedRegion === region.name
        };
      });

      // 2. Multi-Box Collision-Avoidance Algorithm
      const MIN_GAP = 78;
      projected.sort((a, b) => a.rawY - b.rawY);

      if (projected.length > 1) {
        // Enforce minimum vertical separation downwards
        for (let i = 1; i < projected.length; i++) {
          if (projected[i].rawY - projected[i - 1].rawY < MIN_GAP) {
            projected[i].rawY = projected[i - 1].rawY + MIN_GAP;
          }
        }

        // Clamp cluster to stay fully within container bounds
        const topMargin = 70;
        const bottomMargin = height - 70;

        if (projected[0].rawY < topMargin) {
          const shift = topMargin - projected[0].rawY;
          projected.forEach((p) => (p.rawY += shift));
        }

        const lastIdx = projected.length - 1;
        if (projected[lastIdx].rawY > bottomMargin) {
          const shift = projected[lastIdx].rawY - bottomMargin;
          projected.forEach((p) => (p.rawY -= shift));
        }
      }

      projected.forEach((p) => {
        p.yLabel = p.rawY;
      });

      setLayoutItems(projected);
      animId = requestAnimationFrame(computeLayout);
    };

    animId = requestAnimationFrame(computeLayout);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [camera, containerRef, bodyGroup, muscleGroup, selectedRegion]);

  return (
    <>
      <UniversalConnectorLines layoutItems={layoutItems} />
      <UniversalFloatingLabels
        layoutItems={layoutItems}
        selectedRegion={selectedRegion}
        onSelectRegion={onSelectRegion}
        onOpenExercises={onOpenExercises}
      />
    </>
  );
};

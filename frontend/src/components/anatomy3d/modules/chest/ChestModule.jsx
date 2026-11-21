import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { CHEST_CONFIG } from './chestRegionConfig';
import { ChestRegionManager } from './ChestRegionManager';
import { ChestRegionHighlighter } from './ChestRegionHighlighter';
import { ChestConnectorLines } from './ChestConnectorLines';
import { ChestFloatingLabels } from './ChestFloatingLabels';

/**
 * ChestModule Component
 * Independent orchestrator for Chest exploration.
 *
 * Enforces:
 * 1. Independent multi-color highlighting (Upper: Red, Middle: Blue, Lower: Orange).
 * 2. Guaranteed non-overlapping layout for the 3 floating boxes.
 * 3. Positioning to the side so boxes never cover the 3D chest anatomy.
 * 4. Recalculation as camera rotates or zooms.
 * 5. Clicking a box highlights only its corresponding region.
 */
export const ChestModule = ({
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

  // Initialize Region Manager & Highlighter
  useEffect(() => {
    if (!muscleMeshes || muscleMeshes.length === 0) return;

    const regionManager = new ChestRegionManager(muscleMeshes);
    const highlighter = new ChestRegionHighlighter(regionManager);

    regionManagerRef.current = regionManager;
    highlighterRef.current = highlighter;

    // Apply initial multi-color highlighting (Upper: Red, Middle: Blue, Lower: Orange)
    highlighter.applyHighlights(selectedRegion);

    return () => {
      highlighter.reset(muscleMeshes);
      highlighter.dispose();
    };
  }, [muscleMeshes]);

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

      // 1. Project anchors and initial label positions
      const projected = CHEST_CONFIG.regions.map((region) => {
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

        const isBehind = pAnchor.z > 1.0 || pLabel.z > 1.0;

        const xAnchor = (pAnchor.x * 0.5 + 0.5) * width;
        const yAnchor = (-pAnchor.y * 0.5 + 0.5) * height;

        // Position lateral to the chest so boxes NEVER cover chest anatomy
        // Guarantee at least 130px lateral clearance from the anchor
        const minLateralX = xAnchor + 130;
        const targetX = Math.max(minLateralX, Math.min(width - 110, width * 0.72));

        const rawY = (-pLabel.y * 0.5 + 0.5) * height;

        const toCam = camera.position.clone().sub(anchorWorld).normalize();
        const isFacingCam = anchorWorld.clone().normalize().dot(toCam) >= -0.35;

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

      // 2. Collision-Avoidance Algorithm (Enforce vertical spacing so boxes never overlap)
      // Sort in anatomical order: Upper Chest (top), Middle Chest (mid), Lower Chest (bottom)
      // Screen Y increases downwards: yUpper < yMiddle < yLower
      const BOX_HEIGHT = 64;
      const MIN_GAP = 84; // Box height + minimum 20px gap

      const upper = projected.find((p) => p.name === 'Upper Chest') || projected[0];
      const middle = projected.find((p) => p.name === 'Middle Chest') || projected[1];
      const lower = projected.find((p) => p.name === 'Lower Chest') || projected[2];

      if (upper && middle && lower) {
        // Compute the anchor centroid Y to center the 3-box stack vertically with the chest
        const avgAnchorY = (upper.yAnchor + middle.yAnchor + lower.yAnchor) / 3;

        let yMiddle = middle.rawY;
        // Blend between raw projected Y and anchor centroid Y for smooth visual anchoring
        yMiddle = 0.5 * yMiddle + 0.5 * avgAnchorY;

        let yUpper = Math.min(upper.rawY, yMiddle - MIN_GAP);
        let yLower = Math.max(lower.rawY, yMiddle + MIN_GAP);

        // Enforce strict non-overlap constraints
        if (yMiddle - yUpper < MIN_GAP) {
          yUpper = yMiddle - MIN_GAP;
        }
        if (yLower - yMiddle < MIN_GAP) {
          yLower = yMiddle + MIN_GAP;
        }

        // Clamp cluster to stay fully within container bounds
        const topMargin = 70;
        const bottomMargin = height - 70;

        if (yUpper < topMargin) {
          const shift = topMargin - yUpper;
          yUpper += shift;
          yMiddle += shift;
          yLower += shift;
        } else if (yLower > bottomMargin) {
          const shift = yLower - bottomMargin;
          yUpper -= shift;
          yMiddle -= shift;
          yLower -= shift;
        }

        upper.yLabel = yUpper;
        middle.yLabel = yMiddle;
        lower.yLabel = yLower;

        // Calculate left edge attachment point for the connector line
        const BOX_HALF_WIDTH = 90;
        upper.boxLeftX = upper.xLabel - BOX_HALF_WIDTH;
        middle.boxLeftX = middle.xLabel - BOX_HALF_WIDTH;
        lower.boxLeftX = lower.xLabel - BOX_HALF_WIDTH;
      }

      setLayoutItems([upper, middle, lower].filter(Boolean));
      animId = requestAnimationFrame(computeLayout);
    };

    animId = requestAnimationFrame(computeLayout);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [camera, containerRef, bodyGroup, selectedRegion]);

  return (
    <>
      <ChestConnectorLines layoutItems={layoutItems} />
      <ChestFloatingLabels
        layoutItems={layoutItems}
        selectedRegion={selectedRegion}
        onSelectRegion={onSelectRegion}
        onOpenExercises={onOpenExercises}
      />
    </>
  );
};

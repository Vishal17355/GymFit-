import React from 'react';
import anatomyPaths from '../../data/anatomyPaths.json';
import anatomyVeins from '../../data/anatomyVeins.json';

/**
 * FrontAnatomyView
 * Precision anatomically aligned muscle selector (Anterior / Front view)
 * Foundation: Realistic human muscular anatomy illustration.
 * 
 * Features:
 * - Isolated visual focus: when any muscle is selected, non-selected areas dim so ONLY the active muscle stands out
 * - Strong, vivid red muscle highlighting with glowing perimeter
 * - Prominent, high-definition anatomical vascular vein network (multi-pass depth + illuminated white core)
 * - 100% lockstep SVG overlay alignment with zero coordinate drift
 */
export const FrontAnatomyView = ({
  selectedMuscles = [],
  onToggleMuscle = () => {},
  hoveredMuscle = null,
  onHoverMuscle = () => {}
}) => {
  const isSelected = (key) =>
    selectedMuscles.includes(key) ||
    (key === 'Front Deltoids' && selectedMuscles.includes('Shoulders')) ||
    (key === 'Shoulders' && selectedMuscles.includes('Front Deltoids'));

  const isHovered = (key) =>
    hoveredMuscle === key ||
    (key === 'Front Deltoids' && hoveredMuscle === 'Shoulders') ||
    (key === 'Shoulders' && hoveredMuscle === 'Front Deltoids');

  const hasAnySelection = selectedMuscles.length > 0;

  const getRegionStyle = (key) => {
    const selected = isSelected(key);
    const hovered = isHovered(key);

    if (selected) {
      return {
        fill: 'rgba(220, 38, 38, 0.55)',
        stroke: '#ef4444',
        strokeWidth: 3,
        filter: 'url(#muscle-glow-front)',
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      };
    }
    if (hovered) {
      return {
        fill: 'rgba(239, 68, 68, 0.32)',
        stroke: '#f87171',
        strokeWidth: 2,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      };
    }
    return {
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 1.5,
      pointerEvents: 'auto',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    };
  };

  const handleKeyDown = (e, key) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleMuscle(key);
    }
  };

  const frontRegions = [
    { key: 'Chest', id: 'front-muscle-chest', paths: anatomyPaths.front.Chest, veins: anatomyVeins.front.Chest },
    { key: 'Front Deltoids', id: 'front-muscle-deltoids', paths: anatomyPaths.front['Front Deltoids'], veins: anatomyVeins.front['Front Deltoids'] },
    { key: 'Biceps', id: 'front-muscle-biceps', paths: anatomyPaths.front.Biceps, veins: anatomyVeins.front.Biceps },
    { key: 'Forearms', id: 'front-muscle-forearms', paths: anatomyPaths.front.Forearms, veins: anatomyVeins.front.Forearms },
    { key: 'Abs', id: 'front-muscle-abs', paths: anatomyPaths.front.Abs, veins: anatomyVeins.front.Abs },
    { key: 'Obliques', id: 'front-muscle-obliques', paths: anatomyPaths.front.Obliques, veins: anatomyVeins.front.Obliques },
    { key: 'Quadriceps', id: 'front-muscle-quadriceps', paths: anatomyPaths.front.Quadriceps, veins: anatomyVeins.front.Quadriceps },
    { key: 'Calves', id: 'front-muscle-calves', paths: anatomyPaths.front.Calves, veins: anatomyVeins.front.Calves }
  ];

  return (
    <div className="relative flex flex-col items-center w-full max-w-[320px] mx-auto select-none">
      {/* 1:2 Aspect Ratio Container - Keeps Image and SVG in 100% lockstep alignment on resize */}
      <div className="relative w-full aspect-[1/2]">
        
        {/* Realistic Anatomy Base Image (Dims subtly when any muscle is selected so ONLY the active muscle pops out) */}
        <img
          src="/anatomy/human_front_realistic.png"
          alt="Front Muscular Anatomy"
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-all duration-300 ${
            hasAnySelection
              ? 'opacity-35 brightness-75 contrast-125 saturate-50'
              : 'opacity-100 brightness-100 saturate-100'
          }`}
        />

        {/* Transparent SVG Overlay Layer with Anatomically Aligned Hit Regions and Vascular Veins */}
        <svg
          viewBox="0 0 500 1000"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          role="region"
          aria-label="Front Muscular Anatomy Overlay"
        >
          <defs>
            {/* Red perimeter glow filter for selected muscle */}
            <filter id="muscle-glow-front" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.95" />
            </filter>

            {/* Radiant glowing vascular vein filter */}
            <filter id="vein-glow-front" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef4444" floodOpacity="0.8" />
            </filter>

            {/* Clip path of all currently selected muscles to render them in 100% full brightness */}
            <clipPath id="front-selected-clip">
              {frontRegions
                .filter((r) => isSelected(r.key))
                .flatMap((r) => r.paths)
                .map((d, idx) => (
                  <path key={`clip-front-${idx}`} d={d} />
                ))}
            </clipPath>
          </defs>

          {/* Render selected muscle in full 100% un-dimmed realistic anatomical color */}
          {hasAnySelection && (
            <image
              href="/anatomy/human_front_realistic.png"
              width="500"
              height="1000"
              clipPath="url(#front-selected-clip)"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none"
            />
          )}

          {/* Interactive Muscle Regions and Vascular Veins */}
          {frontRegions.map((region) => {
            const activeStyle = getRegionStyle(region.key);
            const selected = isSelected(region.key);
            const hovered = isHovered(region.key);
            const showVeins = selected || hovered;

            return (
              <g
                key={region.id}
                id={region.id}
                tabIndex={0}
                role="button"
                aria-label={region.key}
                aria-pressed={selected}
                onClick={() => onToggleMuscle(region.key)}
                onKeyDown={(e) => handleKeyDown(e, region.key)}
                onMouseEnter={() => onHoverMuscle(region.key)}
                onMouseLeave={() => onHoverMuscle(null)}
                className="focus:outline-none"
              >
                {/* 1. Muscle Highlight Boundary Region */}
                {region.paths.map((d, idx) => (
                  <path
                    key={`${region.id}-path-${idx}`}
                    d={d}
                    style={activeStyle}
                  />
                ))}

                {/* 2. Vascular Vein Network (Multi-pass illuminated vessels) */}
                {showVeins && region.veins && (
                  <g className={`pointer-events-none transition-opacity duration-200 ${selected ? 'animate-pulse' : ''}`}>
                    {/* Layer A: Deep Venous Bed Shadow (Creates 3D anatomical depth) */}
                    {region.veins.map((v, vIdx) => (
                      <path
                        key={`${region.id}-vein-shadow-${vIdx}`}
                        d={v.d}
                        fill="none"
                        stroke="#450a0a"
                        strokeWidth={v.w + 2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={selected ? 0.90 : 0.65}
                      />
                    ))}

                    {/* Layer B: Radiant Illuminated Vessel Wall (White/crimson glowing vascular trunk) */}
                    {region.veins.map((v, vIdx) => (
                      <path
                        key={`${region.id}-vein-core-${vIdx}`}
                        d={v.d}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={v.w}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={selected ? 0.98 : 0.80}
                        filter="url(#vein-glow-front)"
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <span className="mt-3 text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
        Front View (Anterior)
      </span>
    </div>
  );
};

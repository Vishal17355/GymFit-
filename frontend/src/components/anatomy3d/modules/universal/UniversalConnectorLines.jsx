import React from 'react';

/**
 * UniversalConnectorLines Component
 * Renders SVG cubic Bézier connector lines and muscle surface pins for ANY body part:
 * Biceps, Triceps, Shoulders, Chest, Back, Abs, Legs.
 */
export const UniversalConnectorLines = ({ layoutItems = [] }) => {
  if (!layoutItems || layoutItems.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <defs>
        {layoutItems.map((item) => (
          <filter key={`glow-${item.id}`} id={`line-glow-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        ))}
      </defs>

      {layoutItems.map((item) => {
        if (item.isBehind) return null;

        const isSelected = item.isSelected;
        const opacity = item.isFacingCam ? (isSelected ? 1.0 : 0.85) : 0.4;
        const strokeW = isSelected ? 2.5 : 1.5;

        // Path from anchor on muscle to attach point on the floating box
        const targetX = item.boxLeftX !== undefined ? item.boxLeftX : item.xLabel - 80;
        const targetY = item.yLabel;

        const midX = (item.xAnchor + targetX) / 2;
        const pathD = `M ${item.xAnchor} ${item.yAnchor} C ${midX} ${item.yAnchor}, ${midX} ${targetY}, ${targetX} ${targetY}`;

        return (
          <g key={`line-${item.id}`} style={{ opacity, transition: 'opacity 0.2s ease' }}>
            {/* Outer soft glow line when active */}
            {isSelected && (
              <path
                d={pathD}
                fill="none"
                stroke={item.color}
                strokeWidth={6}
                strokeOpacity={0.35}
                strokeLinecap="round"
              />
            )}

            {/* Main connector line */}
            <path
              d={pathD}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeW}
              strokeDasharray={isSelected ? 'none' : '4,3'}
              strokeLinecap="round"
            />

            {/* Pulse ping wave on selected muscle anchor */}
            {isSelected && (
              <circle
                cx={item.xAnchor}
                cy={item.yAnchor}
                r={10}
                fill="none"
                stroke={item.color}
                strokeWidth={1.5}
                opacity={0.65}
                className="animate-ping"
              />
            )}

            {/* Anchor pin dot on muscle surface */}
            <circle
              cx={item.xAnchor}
              cy={item.yAnchor}
              r={isSelected ? 5 : 3.5}
              fill={item.color}
              stroke="#ffffff"
              strokeWidth={1.5}
              style={{ filter: isSelected ? `drop-shadow(0 0 6px ${item.color})` : 'none' }}
            />
          </g>
        );
      })}
    </svg>
  );
};

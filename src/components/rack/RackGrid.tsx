import React from 'react';

interface RackGridProps {
  rackHeight: number;
  gridVisible?: boolean;
  snapPoints?: Array<{ x: number; y: number; rackUnit: number }>;
}

const RackGrid: React.FC<RackGridProps> = ({
  rackHeight,
  gridVisible = true,
  snapPoints = [],
}) => {
  if (!gridVisible) return null;

  const rackWidth = 572; // Updated usable rack width leaving space for rail holes (720 - 56 - 40 - 24 - 8 - 20)
  const unitHeight = 44;

  return (
    <div 
      className="absolute pointer-events-none inset-0"
    >
      {/* Horizontal grid lines for each rack unit */}
      {Array.from({ length: rackHeight + 1 }, (_, index) => (
        <div
          key={`h-${index}`}
          className="absolute border-t"
          style={{
            top: index * unitHeight,
            width: rackWidth, // Use explicit width instead of w-full
            borderColor: index === 0 ? '#374151' : '#e5e7eb', // darker only for top
            borderWidth: index === 0 ? '2px' : '1px',
          }}
        />
      ))}
      
      {/* Rack unit zones - subtle background for each unit */}
      {Array.from({ length: rackHeight }, (_, index) => (
        <div
          key={`zone-${index}`}
          className="absolute hover:bg-blue-50 transition-colors duration-150"
          style={{
            top: index * unitHeight,
            width: rackWidth, // Use explicit width instead of w-full
            height: unitHeight,
            backgroundColor: index % 2 === 0 ? 'rgba(249, 250, 251, 0.5)' : 'transparent',
          }}
        />
      ))}
      
      {/* Vertical grid lines for half-rack divisions */}
      <div className="absolute h-full border-l border-gray-200" style={{ left: 0 }} />
      <div className="absolute h-full border-l border-gray-100" style={{ left: rackWidth / 2 }} />
      {/* Right border is provided by the rack frame itself */}
      
      {/* Quarter divisions (subtle) */}
      <div className="absolute h-full border-l border-gray-100 opacity-50" style={{ left: rackWidth / 4 }} />
      <div className="absolute h-full border-l border-gray-100 opacity-50" style={{ left: (rackWidth * 3) / 4 }} />
      
      {/* Snap points indicators */}
      {snapPoints.map((point, index) => (
        <div
          key={`snap-${index}`}
          className="absolute w-2 h-2 bg-rack-snap rounded-full -translate-x-1 -translate-y-1 opacity-60"
          style={{
            left: point.x,
            top: point.y,
          }}
        />
      ))}
      
    </div>
  );
};

export default RackGrid;
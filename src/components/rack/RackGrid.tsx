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

  const rackWidth = 568; // 600 - 32px padding
  const unitHeight = 44;

  return (
    <div className="absolute inset-4 pointer-events-none">
      {/* Horizontal grid lines for each rack unit */}
      {Array.from({ length: rackHeight + 1 }, (_, index) => (
        <div
          key={`h-${index}`}
          className="absolute w-full border-t border-gray-200"
          style={{
            top: index * unitHeight,
          }}
        />
      ))}
      
      {/* Vertical grid lines for half-rack divisions */}
      <div className="absolute h-full border-l border-gray-200" style={{ left: 0 }} />
      <div className="absolute h-full border-l border-gray-100" style={{ left: rackWidth / 2 }} />
      <div className="absolute h-full border-l border-gray-200" style={{ left: rackWidth }} />
      
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
      
      {/* Rack unit labels overlay */}
      <div className="absolute -left-6 top-0 w-6 h-full">
        {Array.from({ length: rackHeight }, (_, index) => {
          const unitNumber = rackHeight - index;
          return (
            <div
              key={unitNumber}
              className="h-11 flex items-center justify-center text-xs text-gray-500 font-mono"
              style={{ height: unitHeight }}
            >
              {unitNumber}
            </div>
          );
        })}
      </div>
      
      {/* Visual rack mounting rails */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gray-300"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-gray-300"></div>
      
      {/* Mounting hole pattern */}
      {Array.from({ length: rackHeight }, (_, index) => (
        <React.Fragment key={`holes-${index}`}>
          {/* Left rail holes */}
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              left: -2,
              top: index * unitHeight + 8,
            }}
          />
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              left: -2,
              top: index * unitHeight + 22,
            }}
          />
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              left: -2,
              top: index * unitHeight + 36,
            }}
          />
          
          {/* Right rail holes */}
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              right: -2,
              top: index * unitHeight + 8,
            }}
          />
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              right: -2,
              top: index * unitHeight + 22,
            }}
          />
          <div
            className="absolute w-1 h-1 bg-gray-500 rounded-full"
            style={{
              right: -2,
              top: index * unitHeight + 36,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default RackGrid;
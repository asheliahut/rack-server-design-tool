import React from 'react';
import { SnapGuide } from '@/types/design';

interface SnapGuidesProps {
  guides: SnapGuide[];
}

const SnapGuides: React.FC<SnapGuidesProps> = ({ guides }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {guides.map((guide, index) => (
        <div key={index}>
          {guide.visible && (
            <>
              {/* Main snap guide rectangle */}
              <div
                className="absolute border-2 border-dashed border-rack-snap bg-rack-snap bg-opacity-10 rounded transition-all duration-150"
                style={{
                  left: guide.x,
                  top: guide.y,
                  width: guide.width,
                  height: guide.height,
                }}
              />
              
              {/* Corner indicators */}
              <div
                className="absolute w-3 h-3 bg-rack-snap rounded-full border-2 border-white shadow-sm"
                style={{
                  left: guide.x - 6,
                  top: guide.y - 6,
                }}
              />
              <div
                className="absolute w-3 h-3 bg-rack-snap rounded-full border-2 border-white shadow-sm"
                style={{
                  left: guide.x + guide.width - 6,
                  top: guide.y - 6,
                }}
              />
              <div
                className="absolute w-3 h-3 bg-rack-snap rounded-full border-2 border-white shadow-sm"
                style={{
                  left: guide.x - 6,
                  top: guide.y + guide.height - 6,
                }}
              />
              <div
                className="absolute w-3 h-3 bg-rack-snap rounded-full border-2 border-white shadow-sm"
                style={{
                  left: guide.x + guide.width - 6,
                  top: guide.y + guide.height - 6,
                }}
              />
              
              {/* Snap lines extending to rack edges */}
              <div
                className="absolute border-t border-dashed border-rack-snap opacity-60"
                style={{
                  left: 0,
                  top: guide.y,
                  width: '100%',
                  height: 0,
                }}
              />
              <div
                className="absolute border-t border-dashed border-rack-snap opacity-60"
                style={{
                  left: 0,
                  top: guide.y + guide.height,
                  width: '100%',
                  height: 0,
                }}
              />
              
              {/* Vertical snap lines */}
              <div
                className="absolute border-l border-dashed border-rack-snap opacity-60"
                style={{
                  left: guide.x,
                  top: 0,
                  width: 0,
                  height: '100%',
                }}
              />
              {guide.width < 600 && (
                <div
                  className="absolute border-l border-dashed border-rack-snap opacity-60"
                  style={{
                    left: guide.x + guide.width,
                    top: 0,
                    width: 0,
                    height: '100%',
                  }}
                />
              )}
              
              {/* Measurements display */}
              <div
                className="absolute bg-rack-snap text-black text-xs px-2 py-1 rounded shadow-sm font-mono"
                style={{
                  left: guide.x + guide.width / 2 - 20,
                  top: guide.y - 25,
                }}
              >
                {Math.round(guide.height / 44)}U
              </div>
              
              {/* Width indicator for half-rack components */}
              {guide.width < 600 && (
                <div
                  className="absolute bg-rack-snap text-black text-xs px-2 py-1 rounded shadow-sm font-mono"
                  style={{
                    left: guide.x + guide.width + 5,
                    top: guide.y + guide.height / 2 - 10,
                  }}
                >
                  50%
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SnapGuides;
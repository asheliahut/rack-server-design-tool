import React from 'react';
import { SnapGuide } from '@/types/design';

interface SnapGuidesProps {
  guides: SnapGuide[];
  rackHeight?: number;
}

const SnapGuides: React.FC<SnapGuidesProps> = ({ guides, rackHeight = 42 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {guides.map((guide, index) => (
        <div key={index}>
          {guide.visible && (
            <>
              {/* Main snap guide rectangle - align with component area */}
              <div
                className="absolute border-2 border-dashed border-blue-400 rounded transition-all duration-150"
                style={{
                  // Align with the component area: ml-14 (56px) + px-2 (8px) = 64px from left
                  left: 64,
                  top: 24 + (guide.y || 0), // Account for container padding (p-6 = 24px)
                  // Component area width: total width (720) - ml-14 (56) - mr-6 (24) - px-2 left (8) - px-2 right (8) = 624px
                  width: 624,
                  height: guide.height,
                  backgroundColor: 'transparent',
                }}
              >
                {/* Rack unit indicator - positioned outside the rack area */}
                <div className="absolute -left-16 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded text-center font-mono shadow-lg z-50">
                  {guide.rackUnit || rackHeight - Math.floor((guide.y - 16) / 44)}U
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SnapGuides;
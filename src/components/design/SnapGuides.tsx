import React from 'react';
import { SnapGuide } from '@/types/design';

interface SnapGuidesProps {
  guides: SnapGuide[];
  rackHeight?: number;
}

const SnapGuides: React.FC<SnapGuidesProps> = ({ guides }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {guides.map((guide, index) => (
        <div key={index}>
          {guide.visible && (
            <>
              {/* Main snap guide rectangle - align with actual component area */}
              <div
                className="absolute border-2 border-dashed border-blue-400 rounded transition-all duration-150 left-16 sm:left-18 lg:left-20 right-9 sm:right-10 lg:right-12 top-3 sm:top-4 lg:top-6"
                style={{
                  marginTop: `${guide.y || 0}px`, // Use margin-top to add to the responsive top positioning
                  height: guide.height,
                }}
              >
                {/* Rack unit indicator */}
                <div className="absolute -left-8 sm:-left-10 lg:-left-12 top-0 bg-blue-500 text-white text-xs px-1.5 sm:px-2 py-1 rounded font-mono shadow-lg z-50">
                  {guide.rackUnit}U
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
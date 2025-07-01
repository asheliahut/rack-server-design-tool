import React from 'react';
import { SnapGuide } from '@/types/design';

interface SnapGuidesProps {
  guides: SnapGuide[];
  rackHeight?: number;
}

const SnapGuides: React.FC<SnapGuidesProps> = ({ guides }) => {
  return (
    <>
      {guides.map((guide, index) => (
        <div key={index}>
          {guide.visible && (
            <>
              {/* Snap guide positioned within the centered rack container - matches rack structure exactly */}
              <div className="flex items-start justify-center h-full pt-2 pb-2 absolute inset-0 pointer-events-none z-30">
                <div className="flex items-start">
                  {/* Skip rack labels area - w-8 sm:w-10 */}
                  <div className="w-8 sm:w-10"></div>
                  
                  {/* Snap guide within main rack area - matches ml-1 mr-1 positioning */}
                  <div className="w-96 sm:w-[500px] lg:w-[600px] relative ml-1 mr-1">
                    <div
                      className="absolute border-2 border-dashed border-blue-400 rounded transition-all duration-150 
                                 left-4 right-4"
                      style={{
                        top: `${(guide.y || 0) + 8}px`,
                        height: guide.height,
                      }}
                    >
                      {/* Rack unit indicator */}
                      <div className="absolute -left-12 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded font-mono shadow-lg z-50">
                        {guide.rackUnit}U
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default SnapGuides;
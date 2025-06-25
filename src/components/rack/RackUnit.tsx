import React from 'react';
import { RackComponent } from '@/types/rack';

interface RackUnitProps {
  unitNumber: number;
  components: RackComponent[];
  isHighlighted?: boolean;
  onComponentSelect?: (component: RackComponent) => void;
  onComponentRemove?: (componentId: string) => void;
}

const RackUnit: React.FC<RackUnitProps> = ({
  unitNumber,
  components,
  isHighlighted = false,
  onComponentSelect,
  onComponentRemove,
}) => {
  const hasComponents = components.length > 0;

  return (
    <div
      className={`
        relative h-11 border-b border-gray-300 transition-colors
        ${isHighlighted ? 'bg-blue-100' : hasComponents ? 'bg-gray-50' : 'bg-white'}
        ${hasComponents ? '' : 'hover:bg-gray-50'}
      `}
    >
      {/* Rack unit rail holes - left side */}
      <div className="absolute left-0 top-0 w-2 h-full flex flex-col justify-center space-y-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
      </div>
      
      {/* Rack unit rail holes - right side */}
      <div className="absolute right-0 top-0 w-2 h-full flex flex-col justify-center space-y-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
      </div>
      
      {/* Main rack unit area */}
      <div className="mx-3 h-full relative">
        {!hasComponents && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs text-gray-400 font-mono">
              {unitNumber}U
            </div>
          </div>
        )}
        
        {/* This area is where components will be positioned absolutely by RackContainer */}
      </div>
      
      {/* Rack unit guides (subtle lines) */}
      {!hasComponents && (
        <>
          <div className="absolute top-2 left-3 right-3 h-px bg-gray-200"></div>
          <div className="absolute bottom-2 left-3 right-3 h-px bg-gray-200"></div>
        </>
      )}
    </div>
  );
};

export default RackUnit;
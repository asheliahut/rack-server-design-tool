import React from 'react';
import { RackComponent } from '@/types/rack';
import { createPlaceholderSVG } from '@/utils/imageLoader';

interface DragPreviewProps {
  component: RackComponent;
  isDragging: boolean;
  currentOffset?: { x: number; y: number };
}

const DragPreview: React.FC<DragPreviewProps> = ({
  component,
  isDragging,
  currentOffset,
}) => {
  if (!isDragging || !currentOffset) {
    return null;
  }

  const componentHeight = component.height * 44; // 44px per rack unit
  const componentWidth = component.width === 100 ? 568 : 284; // Full or half width

  const getCategoryColor = (category: string): string => {
    const colors = {
      server: 'border-blue-300 bg-blue-50',
      storage: 'border-green-300 bg-green-50',
      network: 'border-orange-300 bg-orange-50',
      power: 'border-purple-300 bg-purple-50',
      cooling: 'border-cyan-300 bg-cyan-50',
      management: 'border-gray-300 bg-gray-50',
      blank: 'border-gray-300 bg-gray-50',
    };
    return colors[category as keyof typeof colors] || colors.blank;
  };

  const placeholderSvg = createPlaceholderSVG(
    componentWidth,
    componentHeight,
    component.name,
    component.category
  );

  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: currentOffset.x,
        top: currentOffset.y,
      }}
    >
      <div
        className={`
          border-2 rounded-lg shadow-2xl opacity-80 transform rotate-3 scale-105
          transition-transform duration-200 ${getCategoryColor(component.category)}
        `}
        style={{
          width: componentWidth,
          height: componentHeight,
        }}
      >
        {/* Component Preview Content */}
        <div className="p-2 h-full flex items-center relative overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Component Image */}
          <div className="w-12 h-12 bg-white rounded border shadow-sm flex-shrink-0 mr-3 overflow-hidden">
            <img
              src={component.imageUrl}
              alt={component.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = placeholderSvg;
              }}
            />
          </div>
          
          {/* Component Info */}
          <div className="flex-1 min-w-0 relative z-10">
            <div className="font-medium text-gray-900 text-sm truncate">
              {component.name}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {component.specifications.manufacturer} {component.specifications.model}
            </div>
            
            {/* Quick specs */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-70 text-gray-700">
                {component.height}U
              </span>
              {component.specifications.power && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  {component.specifications.power}
                </span>
              )}
            </div>
          </div>
          
          {/* Rack unit indicators */}
          <div className="absolute right-2 top-2 bottom-2 w-2 flex flex-col justify-between">
            {Array.from({ length: component.height }, (_, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-400 rounded-full opacity-60"
              />
            ))}
          </div>
        </div>
        
        {/* Drop shadow effect */}
        <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none" />
        
        {/* Animated border pulse */}
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse opacity-60" />
      </div>
      
      {/* Drag cursor indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
          Drop to place
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black mx-auto" />
      </div>
    </div>
  );
};

export default DragPreview;
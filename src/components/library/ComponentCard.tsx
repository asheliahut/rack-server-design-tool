import React, { useState } from 'react';
import { RackComponent } from '@/types/rack';
import { useDragComponent } from '@/hooks/useDragAndDrop';
import { createPlaceholderSVG } from '@/utils/imageLoader';

interface ComponentCardProps {
  component: RackComponent;
  isSelected?: boolean;
  onSelect?: (component: RackComponent) => void;
  isDragging?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isSelected = false,
  onSelect,
}) => {
  const { isDragging, drag, preview } = useDragComponent(component);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onSelect?.(component);
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      server: 'bg-blue-50 border-blue-200 text-blue-800',
      storage: 'bg-green-50 border-green-200 text-green-800',
      network: 'bg-orange-50 border-orange-200 text-orange-800',
      power: 'bg-purple-50 border-purple-200 text-purple-800',
      cooling: 'bg-cyan-50 border-cyan-200 text-cyan-800',
      management: 'bg-gray-50 border-gray-200 text-gray-800',
      blank: 'bg-gray-50 border-gray-200 text-gray-600',
    };
    return colors[category as keyof typeof colors] || colors.blank;
  };

  const placeholderSvg = createPlaceholderSVG(100, 60, component.name, component.category);

  return (
    <div
      ref={(node) => {
        drag(node);
        preview(node);
      }}
      onClick={handleClick}
      className={`
        relative bg-white dark:bg-gray-700 border rounded-lg p-3 cursor-grab transition-all duration-200 ease-in-out w-full
        hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-0.5 active:scale-95 active:cursor-grabbing
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-400' : 'border-gray-200 dark:border-gray-600'}
        ${isDragging ? 'opacity-50 scale-105 rotate-2 shadow-lg pointer-events-none z-50' : ''}
      `}
    >
      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Component Image */}
      <div className="flex items-start space-x-3">
        <div className="w-16 h-10 bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 flex-shrink-0 overflow-hidden">
          <img
            src={imageError ? placeholderSvg : component.imageUrl}
            alt={component.name}
            className="w-full h-full object-cover"
            onError={() => {
              if (!imageError) {
                setImageError(true);
              }
            }}
          />
        </div>

        {/* Component Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {component.name}
            </h3>
            <span className={`
              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ml-2
              ${getCategoryColor(component.category)}
            `}>
              {component.category}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
            {component.specifications.manufacturer} {component.specifications.model}
          </p>
          
          {/* Component Stats */}
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 rounded mr-1" />
              {component.height}U
            </span>
            {component.specifications.power && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded mr-1" />
                {component.specifications.power}
              </span>
            )}
            {component.specifications.weight && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded mr-1" />
                {component.specifications.weight}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-blue-50 opacity-0 hover:opacity-10 rounded-lg transition-opacity pointer-events-none" />
      
      {/* Dragging Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-lg pointer-events-none" />
      )}
      
      {/* Tooltip disabled to prevent horizontal scrolling - component details available in properties panel */}
    </div>
  );
};

export default ComponentCard;
import React from 'react';
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
        relative bg-white border rounded-lg p-3 cursor-pointer transition-all duration-200
        hover:shadow-md hover:border-blue-300 active:scale-95
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
        ${isDragging ? 'opacity-50 scale-105 rotate-2 shadow-lg' : ''}
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
        <div className="w-16 h-10 bg-gray-100 rounded border flex-shrink-0 overflow-hidden">
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
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {component.name}
            </h3>
            <span className={`
              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ml-2
              ${getCategoryColor(component.category)}
            `}>
              {component.category}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 truncate mt-1">
            {component.specifications.manufacturer} {component.specifications.model}
          </p>
          
          {/* Component Stats */}
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
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
      
      {/* Quick Info Tooltip on Hover */}
      <div className="absolute left-full top-0 ml-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="text-sm font-medium text-gray-900 mb-2">{component.name}</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Manufacturer: {component.specifications.manufacturer}</div>
          <div>Model: {component.specifications.model}</div>
          <div>Height: {component.height}U</div>
          <div>Width: {component.width}%</div>
          {component.specifications.power && <div>Power: {component.specifications.power}</div>}
          {component.specifications.capacity && <div>Capacity: {component.specifications.capacity}</div>}
          {component.specifications.weight && <div>Weight: {component.specifications.weight}</div>}
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;
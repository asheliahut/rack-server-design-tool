import React, { useState } from 'react';
import { RackComponent as RackComponentType } from '@/types/rack';
import { useDragComponent } from '@/hooks/useDragAndDrop';
import { createPlaceholderSVG } from '@/utils/imageLoader';

interface RackComponentProps {
  component: RackComponentType;
  onSelect?: (component: RackComponentType) => void;
}

const RackComponent: React.FC<RackComponentProps> = ({
  component,
  onSelect,
}) => {
  // Track position in local state for snap-back
  const [position, setPosition] = useState(component.position);
  const [imageError, setImageError] = useState(false);

  // Snap back to original position if drop fails
  const handleSnapBack = () => {
    setPosition(component.position);
  };

  // Optionally, you may want to update position on successful drop (if needed)
  // This is just a placeholder for integration with your drop logic
  // const handleDrop = (_item, newPosition) => setPosition(newPosition);

  const { isDragging, drag, preview } = useDragComponent(
    { ...component, position },
    position,
    handleSnapBack
  );

  const handleClick = () => {
    onSelect?.(component);
  };

  const displayName = component.customName || component.name;
  const placeholderSvg = createPlaceholderSVG(32, 32, displayName, component.category);

  return (
    <div
      ref={(node) => {
        drag(node);
        preview(node);
      }}
      onClick={handleClick}
      className={`
        w-full h-full border border-gray-300 rounded bg-white shadow-sm
        hover:shadow-md transition-shadow cursor-pointer flex items-center
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{
        zIndex: isDragging ? 20 : 10,
        left: position?.x,
        top: position?.y,
        position: 'absolute',
      }}
    >
      <div className="p-2 h-full flex items-center">
        <img
          src={imageError ? placeholderSvg : component.imageUrl}
          alt={displayName}
          className="w-8 h-8 object-contain mr-2 flex-shrink-0"
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-900 truncate">
            {component.customName || component.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {component.specifications.manufacturer} {component.specifications.model}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RackComponent;

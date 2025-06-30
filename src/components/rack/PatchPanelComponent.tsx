import React, { useState } from 'react';
import { RackComponent as RackComponentType } from '@/types/rack';
import { useDragComponent } from '@/hooks/useDragAndDrop';
import { createPlaceholderSVG } from '@/utils/imageLoader';

interface PatchPanelComponentProps {
  component: RackComponentType;
  onSelect?: (component: RackComponentType) => void;
  onPortClick?: (component: RackComponentType, portNumber: number) => void;
}

const PatchPanelComponent: React.FC<PatchPanelComponentProps> = ({
  component,
  onSelect,
  onPortClick,
}) => {
  const [position, setPosition] = useState(component.position);
  const [imageError, setImageError] = useState(false);

  const handleSnapBack = () => {
    setPosition(component.position);
  };

  const { isDragging, drag, preview } = useDragComponent(
    { ...component, position },
    position,
    handleSnapBack
  );

  const handleClick = (e: React.MouseEvent) => {
    // Prevent component selection when clicking on ports
    if (!(e.target as HTMLElement).closest('.port-grid')) {
      onSelect?.(component);
    }
  };

  const handlePortClick = (e: React.MouseEvent, portNumber: number) => {
    e.stopPropagation();
    onPortClick?.(component, portNumber);
  };

  const displayName = component.customName || component.name;
  const placeholderSvg = createPlaceholderSVG(32, 32, displayName, component.category);
  const totalPorts = component.specifications.ports || 0;

  // Calculate grid layout based on port count
  const getGridLayout = () => {
    if (totalPorts <= 24) {
      return { cols: 12, rows: Math.ceil(totalPorts / 12) };
    } else {
      return { cols: 12, rows: Math.ceil(totalPorts / 12) };
    }
  };

  const { cols, rows } = getGridLayout();

  return (
    <div
      ref={(node) => {
        drag(node);
        preview(node);
      }}
      onClick={handleClick}
      className={`
        w-full h-full border border-gray-300 rounded bg-white shadow-sm
        hover:shadow-md transition-shadow cursor-pointer
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{
        zIndex: isDragging ? 20 : 10,
        left: position?.x,
        top: position?.y,
        position: 'absolute',
      }}
    >
      {/* Port Grid - Full component space */}
      <div className="p-1 port-grid h-full">
        <div 
          className="grid gap-0.5 h-full w-full"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}
        >
          {Array.from({ length: totalPorts }, (_, i) => {
            const portNumber = i + 1;
            const hasLabel = component.portLabels?.some(pl => pl.portNumber === portNumber && pl.label.trim() !== '');
            const portLabel = component.portLabels?.find(pl => pl.portNumber === portNumber);

            return (
              <button
                key={portNumber}
                onClick={(e) => handlePortClick(e, portNumber)}
                className={`
                  rounded border transition-all duration-150
                  flex items-center justify-center font-medium
                  hover:scale-105 active:scale-95 min-h-0
                  ${hasLabel 
                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  }
                `}
                title={hasLabel 
                  ? `Port ${portNumber}: ${portLabel?.label}${portLabel?.description ? ` - ${portLabel.description}` : ''}`
                  : `Port ${portNumber}: Click to label`
                }
                style={{
                  fontSize: '8px',
                  lineHeight: '1'
                }}
              >
                {portNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatchPanelComponent;
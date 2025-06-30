import React, { useState } from 'react';
import { RackComponent as RackComponentType } from '@/types/rack';
import { useDragComponent } from '@/hooks/useDragAndDrop';
import PortTooltip from '@/components/ui/PortTooltip';

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

  const handleSnapBack = () => {
    setPosition(component.position);
  };

  const { isDragging, drag, preview } = useDragComponent(
    { ...component, position },
    position,
    handleSnapBack
  );

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only trigger if clicking on the background area (not on ports)
    if ((e.target as HTMLElement).classList.contains('patch-panel-background')) {
      onSelect?.(component);
    }
  };

  const handlePortClick = (e: React.MouseEvent, portNumber: number) => {
    e.stopPropagation();
    onPortClick?.(component, portNumber);
  };

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
      onClick={handleBackgroundClick}
      className={`
        w-full h-full border border-gray-300 rounded bg-white shadow-sm
        hover:shadow-md transition-shadow cursor-pointer patch-panel-background
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{
        zIndex: isDragging ? 20 : 10,
        left: position?.x,
        top: position?.y,
        position: 'absolute',
      }}
      title="Click background to view component details"
    >
      {/* Port Grid - Contained within component */}
      <div className="p-2 port-grid h-full patch-panel-background overflow-hidden">
        <div 
          className="grid gap-0.5 h-full w-full patch-panel-background"
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
              <PortTooltip
                key={portNumber}
                portNumber={portNumber}
                portLabel={portLabel}
              >
                <button
                  onClick={(e) => handlePortClick(e, portNumber)}
                  className={`
                    max-w-5 max-h-5 min-w-0 min-h-0 text-xs rounded border transition-all duration-150
                    flex items-center justify-center font-medium mx-auto
                    hover:scale-105 active:scale-95
                    ${hasLabel 
                      ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }
                  `}
                  style={{
                    fontSize: '7px',
                    lineHeight: '1',
                    width: 'min(100%, 20px)',
                    height: 'min(100%, 20px)'
                  }}
                >
                  {portNumber}
                </button>
              </PortTooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatchPanelComponent;
import React from 'react';
import { useDrop } from 'react-dnd';
import { RackComponent, RackPosition } from '@/types/rack';
import { DragItem } from '@/types/design';
import RackUnit from './RackUnit';
import RackGrid from './RackGrid';
import SnapGuides from '../design/SnapGuides';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

interface RackContainerProps {
  components: RackComponent[];
  rackHeight: number;
  onComponentDrop: (component: RackComponent, position: RackPosition) => void;
  onComponentMove: (componentId: string, newPosition: RackPosition) => void;
}

const RackContainer: React.FC<RackContainerProps> = ({
  components,
  rackHeight,
  onComponentDrop,
  onComponentMove,
}) => {
  const { snapToGrid, snapGuides } = useSnapToGrid(rackHeight);

  const [{ isOver, draggedItem }, drop] = useDrop({
    accept: 'component',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem() as DragItem,
    }),
    hover: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        // Update snap guides during hover
        const rect = (monitor.getDropTarget() as any)?.getBoundingClientRect();
        if (rect) {
          const relativeX = clientOffset.x - rect.left;
          const relativeY = clientOffset.y - rect.top;
          snapToGrid({ x: relativeX, y: relativeY }, item.component);
        }
      }
    },
    drop: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const rect = (monitor.getDropTarget() as any)?.getBoundingClientRect();
      
      if (clientOffset && rect) {
        const relativeX = clientOffset.x - rect.left;
        const relativeY = clientOffset.y - rect.top;
        
        const snapPoint = snapToGrid({ x: relativeX, y: relativeY }, item.component);
        
        if (snapPoint) {
          const position: RackPosition = {
            x: snapPoint.x,
            y: snapPoint.y,
            rackUnit: snapPoint.rackUnit,
          };

          if (item.sourcePosition) {
            // Moving existing component
            onComponentMove(item.component.id, position);
          } else {
            // Adding new component
            onComponentDrop(item.component, position);
          }
        }
      }
    },
  });

  // Calculate rack dimensions
  const rackWidth = 600; // Standard 19" rack width in pixels
  const rackHeight_px = rackHeight * 44; // 44px per rack unit

  return (
    <div className="relative">
      <div
        ref={drop}
        className={`
          relative bg-rack-frame border-2 border-gray-600 rounded-lg p-4
          transition-colors duration-200
          ${isOver ? 'border-rack-highlight bg-blue-50' : 'border-gray-600'}
        `}
        style={{
          width: rackWidth,
          minHeight: rackHeight_px + 32, // Add padding
        }}
      >
        {/* Rack Grid Background */}
        <RackGrid rackHeight={rackHeight} gridVisible={true} />
        
        {/* Snap Guides */}
        <SnapGuides guides={snapGuides} />
        
        {/* Rack Unit Labels and Structure */}
        <div className="absolute left-0 top-4 w-8 h-full">
          {Array.from({ length: rackHeight }, (_, index) => {
            const unitNumber = rackHeight - index;
            return (
              <div
                key={unitNumber}
                className="h-11 flex items-center justify-center text-xs text-gray-500 border-b border-gray-300"
              >
                {unitNumber}
              </div>
            );
          })}
        </div>
        
        {/* Main rack area */}
        <div className="ml-8 relative" style={{ width: rackWidth - 32 }}>
          {/* Render rack units */}
          {Array.from({ length: rackHeight }, (_, index) => {
            const unitNumber = rackHeight - index;
            return (
              <RackUnit
                key={unitNumber}
                unitNumber={unitNumber}
                components={components.filter(c => 
                  c.position?.rackUnit === unitNumber
                )}
                onComponentSelect={(component) => {
                  // Handle component selection if needed
                }}
              />
            );
          })}
          
          {/* Render positioned components */}
          {components
            .filter(c => c.position)
            .map(component => {
              const position = component.position!;
              const componentHeight = component.height * 44;
              const componentWidth = component.width === 100 ? 
                rackWidth - 32 : (rackWidth - 32) / 2;
              
              return (
                <div
                  key={component.id}
                  className="absolute border border-gray-300 rounded bg-white shadow-sm
                           hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    left: position.x,
                    top: (rackHeight - position.rackUnit) * 44,
                    width: componentWidth,
                    height: componentHeight,
                    zIndex: 10,
                  }}
                >
                  <div className="p-2 h-full flex items-center">
                    <img
                      src={component.imageUrl}
                      alt={component.name}
                      className="w-8 h-8 object-contain mr-2 flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholders/generic-placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {component.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {component.specifications.manufacturer} {component.specifications.model}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        
        {/* Drop overlay when dragging */}
        {isOver && draggedItem && (
          <div className="absolute inset-4 border-2 border-dashed border-rack-highlight bg-blue-50 opacity-30 rounded pointer-events-none" />
        )}
        
        {/* Rack frame decoration */}
        <div className="absolute inset-0 border-4 border-gray-800 rounded-lg pointer-events-none">
          {/* Corner bolts */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RackContainer;
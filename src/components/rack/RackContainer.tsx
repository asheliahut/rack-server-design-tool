import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { RackComponent, RackPosition } from '@/types/rack';
import { DragItem } from '@/types/design';
import RackUnit from './RackUnit.js';
import RackGrid from './RackGrid.js';
import SnapGuides from '../design/SnapGuides.js';
import { useSnapToGrid } from '@/hooks/useSnapToGrid.js';
import { RACK_UNIT_HEIGHT, getRackUnitFromY } from '@/constants/rack';

interface RackContainerProps {
  components: RackComponent[];
  rackHeight: number;
  onComponentDrop: (component: RackComponent, position: RackPosition) => void;
  onComponentMove: (componentId: string, newPosition: RackPosition) => void;
  onComponentSelect?: (component: RackComponent) => void;
  onPortClick?: (component: RackComponent, portNumber: number) => void;
}

const RackContainer: React.FC<RackContainerProps> = ({
  components,
  rackHeight,
  onComponentDrop,
  onComponentMove,
  onComponentSelect,
  onPortClick,
}) => {
  const { snapToGrid, snapGuides, clearSnapGuides } = useSnapToGrid(rackHeight);
  const dropRef = useRef<HTMLDivElement>(null);
  const rackAreaRef = useRef<HTMLDivElement>(null);

  const [{ isOver, draggedItem }, drop] = useDrop<DragItem, void, { isOver: boolean; draggedItem: DragItem | null }>({
    accept: 'component',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem(),
    }),
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && rackAreaRef.current) {
        // Use the actual rack area for positioning
        const rackRect = rackAreaRef.current.getBoundingClientRect();
        const relativeY = clientOffset.y - rackRect.top;
        
        // Simple rack unit calculation
        const rackUnitIndex = getRackUnitFromY(relativeY);
        const snapZoneY = rackUnitIndex * RACK_UNIT_HEIGHT;
        const targetRackUnit = Math.max(1, Math.min(rackHeight, rackHeight - rackUnitIndex));
        
        // Check if component would fit within rack bounds
        const componentEndUnit = targetRackUnit - item.component.height + 1;
        const fitsInRack = componentEndUnit >= 1; // Component must not extend below unit 1
        
        // Use rack-unit-based snapping only if component fits
        if (fitsInRack) {
          snapToGrid({ x: 0, y: snapZoneY, rackUnit: targetRackUnit }, item.component);
        } else {
          // Clear snap guides if component doesn't fit
          clearSnapGuides();
        }
      }
    },
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      
      if (clientOffset && rackAreaRef.current) {
        // Use the actual rack area for positioning
        const rackRect = rackAreaRef.current.getBoundingClientRect();
        const relativeY = clientOffset.y - rackRect.top;
        
        // Simple rack unit calculation
        const rackUnitIndex = getRackUnitFromY(relativeY);
        const targetRackUnit = Math.max(1, Math.min(rackHeight, rackHeight - rackUnitIndex));
        
        // Check if component would fit within rack bounds
        const componentEndUnit = targetRackUnit - item.component.height + 1;
        const fitsInRack = componentEndUnit >= 1; // Component must not extend below unit 1
        
        // Check if position is valid (no overlaps with existing components)
        const noOverlaps = !components.some(existing => {
          if (!existing.position || existing.id === item.component.id) return false;
          const existingStart = existing.position.rackUnit;
          const existingEnd = existing.position.rackUnit - existing.height + 1;
          const newStart = targetRackUnit;
          const newEnd = componentEndUnit;
          
          // Check for overlap
          return !(newEnd > existingStart || newStart < existingEnd);
        });
        
        const canPlace = fitsInRack && noOverlaps;
        
        if (canPlace) {
          const position: RackPosition = {
            x: 0, // Not needed for relative positioning
            y: 0, // Not needed for relative positioning  
            rackUnit: targetRackUnit,
          };

          if (item.sourcePosition) {
            // Moving existing component
            onComponentMove(item.component.id, position);
          } else {
            // Adding new component - create a new component with unique ID
            const newComponent = {
              ...item.component,
              id: `${item.component.id}-${Date.now()}`,
            };
            onComponentDrop(newComponent, position);
          }
        }
        
        // Clear snap guides after drop (successful or not)
        clearSnapGuides();
      }
    },
  });

  // Combine the drop ref with our own ref
  drop(dropRef);

  // Clear snap guides when drag leaves the area
  useEffect(() => {
    if (!isOver && !draggedItem) {
      clearSnapGuides();
    }
  }, [isOver, draggedItem, clearSnapGuides]);

  // Enable scroll during drag - wheel for desktop, touch for mobile
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (draggedItem) {
        // Stop event from being captured by React DnD
        e.stopImmediatePropagation();
        
        // Find the scrollable container
        const scrollContainer = document.getElementById('canvas-container');
        if (scrollContainer) {
          scrollContainer.scrollTop += e.deltaY;
        } else {
          // Fallback to window scroll
          window.scrollTo({
            top: window.scrollY + e.deltaY,
            behavior: 'auto'
          });
        }
      }
    };

    const handleTouchMove = (_e: TouchEvent) => {
      // Allow touch scrolling during drag on mobile
      if (draggedItem) {
        // Don't prevent default - allow natural touch scrolling
        return;
      }
    };

    if (draggedItem) {
      // Desktop: Override wheel behavior
      document.addEventListener('wheel', handleWheel, { 
        passive: false,
        capture: true 
      });
      
      // Mobile: Allow touch scrolling
      document.addEventListener('touchmove', handleTouchMove, { 
        passive: true,
        capture: false 
      });
      
      return () => {
        document.removeEventListener('wheel', handleWheel, { capture: true });
        document.removeEventListener('touchmove', handleTouchMove, { capture: false });
      };
    }
  }, [draggedItem]);

  // Calculate rack dimensions - responsive width, fixed height
  const rackHeight_px = rackHeight * RACK_UNIT_HEIGHT; // rack units to pixels

  return (
    <div className="relative w-full max-w-4xl">
      <div
        ref={dropRef}
        className={`
          relative bg-rack-frame dark:bg-rack-frame-dark rounded-lg p-3 sm:p-4 lg:p-6
          transition-colors duration-200 shadow-lg w-full
        `}
        style={{
          minHeight: rackHeight_px + 24, // Responsive padding
        }}
      >
        {/* Snap Guides */}
        <SnapGuides guides={snapGuides} rackHeight={rackHeight} />
        
        {/* Rack Unit Labels */}
        <div className="absolute left-1 sm:left-2 top-3 sm:top-4 lg:top-6 w-8 sm:w-10 h-full">
          {Array.from({ length: rackHeight }, (_, index) => {
            const unitNumber = rackHeight - index;
            return (
              <div
                key={unitNumber}
                className="flex items-center justify-center text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm relative shadow-sm"
                style={{ height: RACK_UNIT_HEIGHT }}
              >
                <span className="font-bold text-gray-700 dark:text-gray-200 text-xs">{unitNumber}</span>
              </div>
            );
          })}
        </div>
        
        {/* Main rack area */}
        <div ref={rackAreaRef} className="ml-10 sm:ml-12 lg:ml-14 mr-3 sm:mr-4 lg:mr-6 relative overflow-hidden">
          {/* Rack Grid Background - positioned within this container */}
          <RackGrid rackHeight={rackHeight} gridVisible={true} />
          
          {/* Render rack units - components are now rendered within each unit */}
          {Array.from({ length: rackHeight }, (_, index) => {
            const unitNumber = rackHeight - index;
            const unitComponents = components.filter(c => {
              if (!c.position) return false;
              // Check if component starts at this unit or spans across it
              const componentStartUnit = c.position.rackUnit;
              const componentEndUnit = c.position.rackUnit - c.height + 1;
              return unitNumber <= componentStartUnit && unitNumber >= componentEndUnit;
            });
            
            return (
              <RackUnit
                key={unitNumber}
                unitNumber={unitNumber}
                components={unitComponents}
                onComponentSelect={onComponentSelect}
                onPortClick={onPortClick}
              />
            );
          })}
        </div>
        
        
        {/* Rack frame decoration */}
        <div className="absolute inset-0 border-4 border-gray-800 dark:border-gray-400 rounded-lg pointer-events-none">
          {/* Corner bolts */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RackContainer;
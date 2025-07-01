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
        
        // Find components that would overlap with the dropped component
        const overlappingComponents = components.filter(existing => {
          if (!existing.position || existing.id === item.component.id) return false;
          
          // Define the ranges more clearly - rack units count from top to bottom
          const existingTopUnit = existing.position.rackUnit;
          const existingBottomUnit = existing.position.rackUnit - existing.height + 1;
          const newTopUnit = targetRackUnit;
          const newBottomUnit = targetRackUnit - item.component.height + 1;
          
          // Two ranges overlap if: max(start1, start2) <= min(end1, end2)
          // Since units count down, we need to check bottom-to-top overlap
          const overlapStart = Math.max(newBottomUnit, existingBottomUnit);
          const overlapEnd = Math.min(newTopUnit, existingTopUnit);
          
          const overlaps = overlapStart <= overlapEnd;
          
          return overlaps;
        });
        
        if (fitsInRack) {
          const position: RackPosition = {
            x: 0, // Not needed for relative positioning
            y: 0, // Not needed for relative positioning  
            rackUnit: targetRackUnit,
          };

          if (overlappingComponents.length > 0) {
            // Handle component swapping/shifting - always attempt to swap
            handleComponentSwap(item, position, overlappingComponents);
          } else {
            // No overlap, place normally
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

  // Handle component swapping and shifting
  const handleComponentSwap = (draggedItem: DragItem, newPosition: RackPosition, overlappingComponents: RackComponent[]) => {
    console.log('=== SWAP DEBUG ===');
    console.log('Dragged:', draggedItem.component.name, 'height:', draggedItem.component.height);
    console.log('Target position:', newPosition.rackUnit);
    console.log('Overlapping:', overlappingComponents.map(c => ({ 
      name: c.name, 
      height: c.height, 
      currentPos: c.position?.rackUnit 
    })));
    
    if (draggedItem.sourcePosition) {
      // Moving existing component - simple position swap
      const draggedComponent = components.find(c => c.id === draggedItem.component.id);
      if (!draggedComponent || !draggedComponent.position) return;
      
      const draggedOriginalPosition = draggedComponent.position;
      console.log('Dragged original position:', draggedOriginalPosition.rackUnit);
      
      if (overlappingComponents.length === 1) {
        // Simple 1:1 swap - just exchange positions
        const overlapping = overlappingComponents[0];
        if (overlapping.position) {
          console.log('Moving', overlapping.name, 'to position:', draggedOriginalPosition.rackUnit);
          console.log('Moving', draggedComponent.name, 'to position:', newPosition.rackUnit);
          
          // Check if the overlapping component will fit at the dragged component's original position
          const overlappingNewBottom = draggedOriginalPosition.rackUnit - overlapping.height + 1;
          console.log('Overlapping component bottom would be:', overlappingNewBottom);
          
          if (overlappingNewBottom >= 1) {
            // Move overlapping component to dragged component's original position
            onComponentMove(overlapping.id, draggedOriginalPosition);
            // Move dragged component to new position
            onComponentMove(draggedComponent.id, newPosition);
          } else {
            console.log('Overlapping component too large for original position, finding alternative');
            // Find alternative position for the overlapping component
            const alternativePos = findAvailablePosition(overlapping, components.filter(c => c.id !== overlapping.id && c.id !== draggedComponent.id), rackHeight);
            if (alternativePos) {
              console.log('Found alternative position:', alternativePos.rackUnit);
              onComponentMove(overlapping.id, alternativePos);
              onComponentMove(draggedComponent.id, newPosition);
            }
          }
        }
      } else if (overlappingComponents.length > 1) {
        // Multiple overlapping components - stack them starting from dragged's original position
        let currentPosition = draggedOriginalPosition.rackUnit;
        console.log('Stacking multiple components starting from:', currentPosition);
        
        for (const overlapping of overlappingComponents) {
          const newPos = { x: 0, y: 0, rackUnit: currentPosition };
          console.log('Moving', overlapping.name, 'to position:', currentPosition);
          onComponentMove(overlapping.id, newPos);
          currentPosition -= overlapping.height;
        }
        
        // Move dragged component to new position
        console.log('Moving dragged to final position:', newPosition.rackUnit);
        onComponentMove(draggedComponent.id, newPosition);
      }
    } else {
      // Adding new component - just move overlapping components to make space
      const newComponent = {
        ...draggedItem.component,
        id: `${draggedItem.component.id}-${Date.now()}`,
      };
      
      // For new components, just shift overlapping components down or find new spots
      let availableComponents = [...components];
      
      for (const overlapping of overlappingComponents) {
        availableComponents = availableComponents.filter(c => c.id !== overlapping.id);
        
        const newPos = findAvailablePosition(overlapping, availableComponents, rackHeight);
        if (newPos) {
          onComponentMove(overlapping.id, newPos);
          availableComponents.push({ ...overlapping, position: newPos });
        }
      }
      
      onComponentDrop(newComponent, newPosition);
    }
    console.log('=== END SWAP DEBUG ===');
  };
  
  // Find available position for a component
  const findAvailablePosition = (component: RackComponent, existingComponents: RackComponent[], maxRackHeight: number): RackPosition | null => {
    // Search from top to bottom for an available position
    for (let unit = maxRackHeight; unit >= component.height; unit--) {
      const bottomUnit = unit - component.height + 1;
      
      // Ensure component fits within rack bounds
      if (bottomUnit < 1) continue;
      
      // Check if this position is free
      const hasOverlap = existingComponents.some(existing => {
        if (!existing.position || existing.id === component.id) return false;
        
        // Define the ranges consistently with drop logic
        const existingTopUnit = existing.position.rackUnit;
        const existingBottomUnit = existing.position.rackUnit - existing.height + 1;
        const newTopUnit = unit;
        const newBottomUnit = bottomUnit;
        
        // Two ranges overlap if: max(start1, start2) <= min(end1, end2)
        const overlapStart = Math.max(newBottomUnit, existingBottomUnit);
        const overlapEnd = Math.min(newTopUnit, existingTopUnit);
        
        return overlapStart <= overlapEnd;
      });
      
      if (!hasOverlap) {
        return { x: 0, y: 0, rackUnit: unit };
      }
    }
    return null; // No available position found
  };

  // Calculate rack dimensions - responsive width, fixed height
  const rackHeight_px = rackHeight * RACK_UNIT_HEIGHT; // rack units to pixels

  return (
    <div className="relative w-full max-w-4xl">
      <div
        ref={dropRef}
        className={`
          relative bg-rack-frame dark:bg-rack-frame-dark rounded-lg p-2
          transition-colors duration-200 shadow-lg w-full
        `}
        style={{
          minHeight: rackHeight_px + 16, // Reduced padding
        }}
      >
        {/* Snap Guides */}
        <SnapGuides guides={snapGuides} rackHeight={rackHeight} />
        
        {/* Centered rack content container */}
        <div className="flex items-start justify-center h-full pt-2 pb-2">
          <div className="flex items-start">
            {/* Rack Unit Labels */}
            <div className="w-8 sm:w-10 h-full">
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
            <div ref={rackAreaRef} className="w-96 sm:w-[500px] lg:w-[600px] relative overflow-hidden ml-1 mr-1">
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
          </div>
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
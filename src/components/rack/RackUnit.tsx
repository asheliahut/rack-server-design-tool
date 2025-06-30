import React from 'react';
import { RackComponent } from '@/types/rack';
import RackComponentDisplay from './RackComponent';
import { RACK_UNIT_HEIGHT } from '@/constants/rack';

interface RackUnitProps {
  unitNumber: number;
  components: RackComponent[];
  isHighlighted?: boolean;
  onComponentSelect?: (component: RackComponent) => void;
  onComponentRemove?: (componentId: string) => void;
  onPortClick?: (component: RackComponent, portNumber: number) => void;
}

const RackUnit: React.FC<RackUnitProps> = ({
  unitNumber,
  components,
  isHighlighted = false,
  onComponentSelect,
  onPortClick,
}) => {
  const hasComponents = components.length > 0;

  return (
    <div
      className={`
        relative border-b border-gray-300 dark:border-gray-600 transition-colors duration-200 ease-in-out flex items-center
        ${isHighlighted ? 'bg-blue-100 dark:bg-blue-900/50' : hasComponents ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
        ${hasComponents ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
      `}
      style={{ height: RACK_UNIT_HEIGHT }}
    >
      {/* Rack unit rail holes - left side */}
      <div className="rack-unit-rails-left flex flex-col justify-center space-y-1 w-4 h-full px-1">
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
      </div>
      
      {/* Main rack unit area - flexbox will center this automatically */}
      <div className="rack-unit-area flex-1 h-full relative px-2">
        {/* Component placement area */}
        {(() => {
          // Find components that start in this unit
          const componentsStartingHere = components.filter(c => c.position?.rackUnit === unitNumber);
          // Find components that span across this unit (but don't start here)
          const componentsSpanningHere = components.filter(c => {
            if (!c.position || c.position.rackUnit === unitNumber) return false;
            const componentStartUnit = c.position.rackUnit;
            const componentEndUnit = c.position.rackUnit - c.height + 1;
            return unitNumber <= componentStartUnit && unitNumber >= componentEndUnit;
          });
          
          const hasComponentsStartingHere = componentsStartingHere.length > 0;
          const hasComponentsSpanningHere = componentsSpanningHere.length > 0;
          
          if (hasComponentsStartingHere) {
            // Render components that start in this unit
            return (
              <div className="absolute inset-0 flex items-center">
                {componentsStartingHere.map(component => {
                  const isMultiUnit = component.height > 1;
                  if (isMultiUnit) {
                    return (
                      <div
                        key={component.id}
                        className="absolute left-0 right-0"
                        style={{
                          top: 0,
                          height: component.height * RACK_UNIT_HEIGHT, // Span multiple units
                          zIndex: 10,
                        }}
                      >
                        <RackComponentDisplay
                          component={component}
                          onSelect={onComponentSelect}
                          onPortClick={onPortClick}
                        />
                      </div>
                    );
                  } else {
                    // Single unit components use normal flex layout
                    return (
                      <RackComponentDisplay
                        key={component.id}
                        component={component}
                        onSelect={onComponentSelect}
                        onPortClick={onPortClick}
                      />
                    );
                  }
                })}
              </div>
            );
          } else if (hasComponentsSpanningHere) {
            // This unit is covered by a multi-unit component but doesn't start here
            // Show a visual indicator that this space is occupied
            return (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {componentsSpanningHere[0].name}
                </span>
              </div>
            );
          } else {
            // Empty unit - show guides
            return (
              <>
                <div className="absolute top-2 left-2 right-2 h-px bg-gray-200 dark:bg-gray-600"></div>
                <div className="absolute bottom-2 left-2 right-2 h-px bg-gray-200 dark:bg-gray-600"></div>
              </>
            );
          }
        })()}
      </div>
      
      {/* Rack unit rail holes - right side */}
      <div className="rack-unit-rails-right flex flex-col justify-center space-y-1 w-4 h-full px-1">
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mx-auto shadow-sm border border-gray-600"></div>
      </div>
    </div>
  );
};

export default RackUnit;
import React, { useState, useRef, useEffect } from 'react';
import { PortLabel } from '@/types/rack';

interface PortTooltipProps {
  portNumber: number;
  portLabel?: PortLabel;
  children: React.ReactElement;
}

const PortTooltip: React.FC<PortTooltipProps> = ({ portNumber, portLabel, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = (e: React.MouseEvent) => {
    clearTimeout(timeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    setPosition({
      x: rect.left + scrollX + rect.width / 2,
      y: rect.top + scrollY - 8
    });
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Slight delay before showing
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hasLabel = portLabel && portLabel.label.trim() !== '';

  return (
    <>
      {React.cloneElement(children, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      })}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-700 max-w-xs">
            {hasLabel ? (
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                  <span className="font-semibold text-green-300">Port {portNumber}</span>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-white">
                    {portLabel.label}
                  </div>
                  {portLabel.description && (
                    <div className="text-gray-300 text-xs leading-relaxed">
                      {portLabel.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                  <span className="font-semibold text-gray-300">Port {portNumber}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  Click to add label
                </div>
              </div>
            )}
            
            {/* Tooltip arrow */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={{ marginTop: '-1px' }}
            >
              <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortTooltip;
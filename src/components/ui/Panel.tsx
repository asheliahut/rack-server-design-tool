import React from 'react';
import { clsx } from 'clsx';
import { X, Minus, ChevronUp, ChevronDown } from 'lucide-react';

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  closable?: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

const Panel: React.FC<PanelProps> = ({
  title,
  children,
  className,
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  closable = false,
  onClose,
  size = 'md',
  position = 'center',
}) => {
  const sizeClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const positionClasses = {
    left: 'border-r',
    right: 'border-l',
    top: 'border-b',
    bottom: 'border-t',
    center: 'border',
  };

  const panelClasses = clsx(
    'bg-white border-gray-300 flex flex-col',
    sizeClasses[size],
    positionClasses[position],
    className
  );

  return (
    <div className={panelClasses}>
      {/* Panel Header */}
      {(title || collapsible || closable) && (
        <div className="panel-header flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            {title && (
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {collapsible && (
              <button
                className="panel-collapse-btn p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                onClick={onToggleCollapse}
                title={collapsed ? 'Expand Panel' : 'Collapse Panel'}
              >
                {collapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            )}
            
            {closable && (
              <button
                className="panel-close-btn p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                onClick={onClose}
                title="Close Panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Panel Content */}
      {!collapsed && (
        <div className="panel-content flex-1 overflow-auto scrollbar-thin">
          {children}
        </div>
      )}
      
      {/* Collapsed state indicator */}
      {collapsed && (
        <div className="panel-collapsed p-4 text-center text-gray-500">
          <Minus className="w-6 h-6 mx-auto mb-2" />
          <p className="text-xs">Panel collapsed</p>
        </div>
      )}
    </div>
  );
};

export default Panel;
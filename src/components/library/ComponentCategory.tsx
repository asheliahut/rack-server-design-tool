import React from 'react';
import { RackComponent } from '@/types/rack';
import ComponentCard from './ComponentCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ComponentCategoryProps {
  category: string;
  components: RackComponent[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onComponentSelect?: (component: RackComponent) => void;
}

const ComponentCategory: React.FC<ComponentCategoryProps> = ({
  category,
  components,
  isExpanded = true,
  onToggle,
  onComponentSelect,
}) => {
  const getCategoryIcon = (category: string): string => {
    const icons = {
      server: '🖥️',
      storage: '💾',
      network: '🔌',
      power: '⚡',
      cooling: '❄️',
      management: '🔧',
      blank: '⬜',
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      server: 'text-blue-600 border-blue-200 bg-blue-50',
      storage: 'text-green-600 border-green-200 bg-green-50',
      network: 'text-orange-600 border-orange-200 bg-orange-50',
      power: 'text-purple-600 border-purple-200 bg-purple-50',
      cooling: 'text-cyan-600 border-cyan-200 bg-cyan-50',
      management: 'text-gray-600 border-gray-200 bg-gray-50',
      blank: 'text-gray-500 border-gray-200 bg-gray-50',
    };
    return colors[category as keyof typeof colors] || colors.blank;
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={`
          w-full px-4 py-3 flex items-center justify-between 
          hover:bg-gray-50 transition-colors border-b border-gray-200
          ${getCategoryColor(category).split(' ')[2]} // bg color
        `}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getCategoryIcon(category)}</span>
          <div className="text-left">
            <h3 className={`font-medium capitalize ${getCategoryColor(category).split(' ')[0]}`}>
              {category}
            </h3>
            <p className="text-xs text-gray-500">
              {components.length} {components.length === 1 ? 'component' : 'components'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Component count badge */}
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full border
            ${getCategoryColor(category)}
          `}>
            {components.length}
          </span>
          
          {/* Expand/Collapse icon */}
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
      
      {/* Category Content */}
      {isExpanded && (
        <div className="p-3 space-y-2 bg-white">
          {components.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
              <p className="text-sm">No components in this category</p>
            </div>
          ) : (
            components.map(component => (
              <ComponentCard
                key={component.id}
                component={component}
                onSelect={onComponentSelect}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentCategory;
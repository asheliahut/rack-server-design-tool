import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ComponentCategory, RackComponent } from '@/types/rack';
import { DragItem } from '@/types/design';
import ComponentCard from './ComponentCard.js';
import { 
  serverComponents,
  genericServerComponents,
  storageComponents,
  networkComponents,
  powerComponents,
  accessoryComponents,
} from '@/data/serverComponents';
import { Search, Server, HardDrive, Wifi, Zap, Wrench, Square } from 'lucide-react';

interface ComponentLibraryProps {
  onComponentSelect?: (component: RackComponent) => void;
  onComponentRemove?: (componentId: string) => void;
  selectedCategory?: string;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
  onComponentRemove,
  selectedCategory: initialCategory = 'server',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>(
    initialCategory as ComponentCategory
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Set up drop area for removing components
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'component',
    drop: (item, _monitor) => {
      // Only remove if the item has a sourcePosition (meaning it's from the rack)
      if (item.sourcePosition && onComponentRemove) {
        onComponentRemove(item.component.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && monitor.getItem()?.sourcePosition !== undefined,
    }),
  });

  const getComponentsByCategory = (category: ComponentCategory): RackComponent[] => {
    switch (category) {
      case 'server':
        return [...serverComponents, ...genericServerComponents];
      case 'storage':
        return storageComponents;
      case 'network':
        return networkComponents;
      case 'power':
        return powerComponents;
      case 'blank':
      case 'management':
      case 'cooling':
        return accessoryComponents.filter(c => c.category === category);
      default:
        return [];
    }
  };

  const filteredComponents = getComponentsByCategory(selectedCategory).filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.specifications.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.specifications.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { id: 'server', name: 'Servers', icon: Server, color: 'text-blue-600' },
    { id: 'storage', name: 'Storage', icon: HardDrive, color: 'text-green-600' },
    { id: 'network', name: 'Network', icon: Wifi, color: 'text-orange-600' },
    { id: 'power', name: 'Power', icon: Zap, color: 'text-purple-600' },
    { id: 'cooling', name: 'Cooling', icon: Wrench, color: 'text-cyan-600' },
    { id: 'management', name: 'Management', icon: Wrench, color: 'text-gray-600' },
    { id: 'blank', name: 'Blank Panels', icon: Square, color: 'text-gray-500' },
  ] as const;

  if (isCollapsed) {
    return (
      <div id="library-collapsed" className="w-12 bg-white border-r border-gray-300 flex flex-col items-center py-4">
        <button
          id="library-expand-btn"
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          title="Expand Component Library"
        >
          <Server className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      id="component-library" 
      className={`w-80 bg-white border-r border-gray-300 flex flex-col transition-colors overflow-hidden ${
        isOver && canDrop ? 'bg-red-50 border-red-300' : ''
      }`}
    >
      {/* Drop Zone Indicator */}
      {isOver && canDrop && (
        <div className="bg-red-100 border-b-2 border-red-400 p-3 text-center">
          <div className="text-red-700 font-medium text-sm">
            🗑️ Drop here to remove component
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <button
            id="library-collapse-btn"
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Collapse Component Library"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            id="component-search-input"
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus-ring"
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <div id="category-tabs" className="border-b border-gray-200">
        <div className="flex flex-wrap gap-1 p-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                id={`category-${category.id}-btn`}
                onClick={() => setSelectedCategory(category.id as ComponentCategory)}
                className={`
                  flex items-center px-3 py-2 text-xs rounded-lg transition-colors
                  ${isSelected 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-3 h-3 mr-1 ${isSelected ? 'text-blue-600' : category.color}`} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Component Count */}
      <div id="component-count" className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs text-gray-600">
          {filteredComponents.length} {filteredComponents.length === 1 ? 'component' : 'components'}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
      </div>
      
      {/* Component List */}
      <div id="component-list" className="flex-1 overflow-y-auto overflow-x-hidden">
        {filteredComponents.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Square className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 text-sm">
              {searchTerm ? 'No components match your search' : 'No components in this category'}
            </p>
            {searchTerm && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2 w-full">
            {filteredComponents.map(component => (
              <div className="w-full">
                <ComponentCard
                  key={component.id}
                  component={component}
                  onSelect={onComponentSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary;
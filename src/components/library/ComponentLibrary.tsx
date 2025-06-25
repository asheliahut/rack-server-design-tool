import React, { useState } from 'react';
import { ComponentCategory, RackComponent } from '@/types/rack';
import ComponentCard from './ComponentCard';
import { 
  allComponents,
  serverComponents,
  storageComponents,
  networkComponents,
  powerComponents,
  accessoryComponents,
} from '@/data/serverComponents';
import { Search, Server, HardDrive, Wifi, Zap, Tool, Square } from 'lucide-react';

interface ComponentLibraryProps {
  onComponentSelect?: (component: RackComponent) => void;
  selectedCategory?: string;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
  selectedCategory: initialCategory = 'server',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>(
    initialCategory as ComponentCategory
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getComponentsByCategory = (category: ComponentCategory): RackComponent[] => {
    switch (category) {
      case 'server':
        return serverComponents;
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
    { id: 'cooling', name: 'Cooling', icon: Tool, color: 'text-cyan-600' },
    { id: 'management', name: 'Management', icon: Tool, color: 'text-gray-600' },
    { id: 'blank', name: 'Blank Panels', icon: Square, color: 'text-gray-500' },
  ] as const;

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-300 flex flex-col items-center py-4">
        <button
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
    <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <button
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
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-1 p-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
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
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs text-gray-600">
          {filteredComponents.length} {filteredComponents.length === 1 ? 'component' : 'components'}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
      </div>
      
      {/* Component List */}
      <div className="flex-1 overflow-y-auto">
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
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredComponents.map(component => (
              <ComponentCard
                key={component.id}
                component={component}
                onSelect={onComponentSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary;
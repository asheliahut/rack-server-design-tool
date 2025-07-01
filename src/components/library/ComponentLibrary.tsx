import React, { useState, useEffect } from 'react';
import { useDrop, useDragLayer } from 'react-dnd';
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
import { Search, Server, HardDrive, Wifi, Zap, Wrench, ChevronLeft, ChevronRight, Square, X } from 'lucide-react';

interface ComponentLibraryProps {
  onComponentSelect?: (component: RackComponent) => void;
  onComponentRemove?: (componentId: string) => void;
  selectedCategory?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
  onComponentRemove,
  selectedCategory: initialCategory = 'server',
  isCollapsed: externalIsCollapsed = false,
  onToggleCollapse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>(
    initialCategory as ComponentCategory
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalIsCollapsed;
  const setIsCollapsed = onToggleCollapse || (() => {});
  // Monitor global drag state to auto-close mobile menu
  const { isDragging } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
  }));

  // Auto-close mobile menu when dragging starts
  useEffect(() => {
    if (isDragging && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isDragging, isMobileMenuOpen]);

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
      <div id="library-collapsed" className="w-12 lg:w-12 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex items-center justify-center h-auto hidden lg:flex">
        <button
          id="library-expand-btn"
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Expand Component Library"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`
            p-4 rounded-full shadow-lg transition-all duration-300
            ${isMobileMenuOpen 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Server className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay Component Library */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30" style={{ pointerEvents: 'auto' }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl max-h-[70vh] flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Components</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Drag to rack area
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Category Tabs - Horizontal scroll */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto scrollbar-thin">
                <div className="flex gap-1 p-3 min-w-max">
                  {categories.map(category => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as ComponentCategory)}
                        className={`
                          flex items-center px-3 py-2 text-xs rounded-lg transition-colors whitespace-nowrap
                          ${isSelected 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                          }
                        `}
                      >
                        <Icon className={`w-3 h-3 mr-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : category.color}`} />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Component Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredComponents.map(component => (
                  <div key={component.id} className="relative">
                    <ComponentCard
                      component={component}
                      onSelect={onComponentSelect}
                    />
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  💡 <strong>Tip:</strong> Drag components to the rack area. Menu will auto-close when dragging starts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Component Library Panel */}
      <div 
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        id="component-library" 
        className={`
          hidden lg:flex
          w-80 h-full bg-white dark:bg-gray-800 
          border-r border-gray-300 dark:border-gray-600 
          flex-col transition-colors overflow-hidden
          ${
            isOver && canDrop ? 'bg-red-50 dark:bg-red-900/50 border-red-300 dark:border-red-600' : ''
          }
        `}
      >
      {/* Drop Zone Indicator */}
      {isOver && canDrop && (
        <div className="bg-red-100 dark:bg-red-900/50 border-b-2 border-red-400 dark:border-red-600 p-3 text-center">
          <div className="text-red-700 dark:text-red-300 font-medium text-sm">
            🗑️ Drop here to remove component
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">Components</h2>
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
              title="Close Components"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="library-collapse-btn"
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:block p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Collapse Component Library"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            id="component-search-input"
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus-ring"
          />
        </div>
      </div>
      
      {/* Category Tabs - Horizontal scroll on mobile */}
      <div id="category-tabs" className="border-b border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex gap-1 p-3 min-w-max lg:flex-wrap lg:min-w-0">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  id={`category-${category.id}-btn`}
                  onClick={() => setSelectedCategory(category.id as ComponentCategory)}
                  className={`
                    flex items-center px-2 lg:px-3 py-2 text-xs rounded-lg transition-colors whitespace-nowrap
                    ${isSelected 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-3 h-3 mr-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : category.color}`} />
                  <span className="hidden sm:inline lg:inline">{category.name}</span>
                  <span className="sm:hidden lg:hidden">{category.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Component Count */}
      <div id="component-count" className="px-3 lg:px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {filteredComponents.length} {filteredComponents.length === 1 ? 'component' : 'components'}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
      </div>
      
      {/* Component List */}
      <div id="component-list" className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {filteredComponents.length === 0 ? (
          <div className="p-6 lg:p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Square className="w-8 lg:w-12 h-8 lg:h-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {searchTerm ? 'No components match your search' : 'No components in this category'}
            </p>
            {searchTerm && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="p-2 lg:p-3 space-y-2 w-full">
            {filteredComponents.map(component => (
              <div key={component.id} className="w-full">
                <ComponentCard
                  component={component}
                  onSelect={onComponentSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default ComponentLibrary;
import { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ComponentLibrary from '@/components/library/ComponentLibrary';
import RackContainer from '@/components/rack/RackContainer';
import Toolbar from '@/components/ui/Toolbar';
import PatchPanelModal from '@/components/ui/PatchPanelModal';
import SinglePortModal from '@/components/ui/SinglePortModal';
import { useRackDesign } from '@/hooks/useRackDesign';
import { calculateRackStats } from '@/utils/rackCalculations';
import { createPlaceholderSVG } from '@/utils/imageLoader';
import { PortLabel } from '@/types/rack';
import { DragItem } from '@/types/design';
import { ChevronRight } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Stats Panel component with drag-and-drop functionality
interface StatsPanelProps {
  rackStats: any;
  currentDesign: any;
  removeComponent: (id: string) => void;
  isLibraryCollapsed: boolean;
  setIsLibraryCollapsed: (collapsed: boolean) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  rackStats, 
  currentDesign, 
  removeComponent, 
  isLibraryCollapsed, 
  setIsLibraryCollapsed 
}) => {
  // Set up drop area for stats panel to remove components on mobile
  const [{ isStatsDropOver, canStatsDropRemove }, statsDropRef] = useDrop<DragItem, void, { isStatsDropOver: boolean; canStatsDropRemove: boolean }>({
    accept: 'component',
    drop: (item, _monitor) => {
      // Only remove if the item has a sourcePosition (meaning it's from the rack)
      if (item.sourcePosition) {
        removeComponent(item.component.id);
      }
    },
    collect: (monitor) => ({
      isStatsDropOver: monitor.isOver(),
      canStatsDropRemove: monitor.canDrop() && !!monitor.getItem()?.sourcePosition,
    }),
  });

  return (
    <div className="flex">
      {/* Collapsed Library Button */}
      {isLibraryCollapsed && (
        <div className="hidden lg:block w-12 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 transition-colors">
          <button
            onClick={() => setIsLibraryCollapsed(false)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Expand Component Library"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Stats Panel */}
      <div 
        ref={statsDropRef as unknown as React.Ref<HTMLDivElement>}
        id="stats-panel" 
        className={`flex-1 border-b border-gray-200 dark:border-gray-700 p-2 sm:p-4 transition-colors relative ${
          isStatsDropOver && canStatsDropRemove 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600' 
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        {/* Drop Indicator for Mobile */}
        {isStatsDropOver && canStatsDropRemove && (
          <div className="lg:hidden absolute inset-0 bg-red-50 dark:bg-red-900/50 border-2 border-dashed border-red-400 dark:border-red-500 rounded-md flex items-center justify-center">
            <div className="text-red-700 dark:text-red-300 font-medium text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM8 13a1 1 0 012 0v.01a1 1 0 11-2 0V13z" clipRule="evenodd" />
              </svg>
              Drop here to remove component
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-4 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Utilization:</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{rackStats.utilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Used Units:</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">{rackStats.usedUnits}/{currentDesign?.rackHeight}U</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Power:</span>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">{rackStats.totalPower}W</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Weight:</span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">{rackStats.totalWeight.toFixed(1)}kg</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Components:</span>
          <span className="text-gray-600 dark:text-gray-400 font-semibold">{rackStats.totalComponents}</span>
        </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isEditingComponentName, setIsEditingComponentName] = useState(false);
  const [editedComponentName, setEditedComponentName] = useState('');
  const [isPatchPanelModalOpen, setIsPatchPanelModalOpen] = useState(false);
  const [isSinglePortModalOpen, setIsSinglePortModalOpen] = useState(false);
  const [selectedPortComponent, setSelectedPortComponent] = useState<any>(null);
  const [selectedPortNumber, setSelectedPortNumber] = useState<number>(0);
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);

  const {
    currentDesign,
    addComponent,
    moveComponent,
    removeComponent,
    clearDesign,
    loadDesign,
    selectedComponent,
    setSelectedComponent,
    updateComponent,
    // We'll add a setter for rackHeight below
  } = useRackDesign();

  const [pendingRackHeight, setPendingRackHeight] = useState<number>(currentDesign?.rackHeight || 42);

  // Keep pendingRackHeight in sync with currentDesign.rackHeight (e.g. after load)
  // This ensures the input field updates when a design is loaded
  if (pendingRackHeight !== currentDesign?.rackHeight) {
    setPendingRackHeight(currentDesign?.rackHeight || 42);
  }

  // Helper functions for component name editing
  const startEditingComponentName = () => {
    if (selectedComponent) {
      setEditedComponentName(selectedComponent.customName || selectedComponent.name);
      setIsEditingComponentName(true);
    }
  };

  const cancelEditingComponentName = () => {
    setIsEditingComponentName(false);
    setEditedComponentName('');
  };

  const saveComponentName = () => {
    if (selectedComponent && editedComponentName.trim()) {
      const updatedComponent = {
        ...selectedComponent,
        customName: editedComponentName.trim() !== selectedComponent.name ? editedComponentName.trim() : undefined
      };
      updateComponent(selectedComponent.id, updatedComponent);
      setSelectedComponent(updatedComponent);
    }
    setIsEditingComponentName(false);
    setEditedComponentName('');
  };

  const handleSavePortLabels = (portLabels: PortLabel[]) => {
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        portLabels: portLabels
      };
      updateComponent(selectedComponent.id, updatedComponent);
      setSelectedComponent(updatedComponent);
    }
  };

  const isPatchPanel = (component: any): boolean => {
    return component?.name?.toLowerCase().includes('keystone') && 
           component?.name?.toLowerCase().includes('patch') && 
           component?.name?.toLowerCase().includes('panel');
  };

  const handlePortClick = (component: any, portNumber: number) => {
    setSelectedPortComponent(component);
    setSelectedPortNumber(portNumber);
    setIsSinglePortModalOpen(true);
  };

  const handleSaveSinglePort = (portNumber: number, portLabel: PortLabel | null) => {
    if (selectedPortComponent) {
      let updatedPortLabels = [...(selectedPortComponent.portLabels || [])];
      
      if (portLabel) {
        // Add or update the port label
        const existingIndex = updatedPortLabels.findIndex(pl => pl.portNumber === portNumber);
        if (existingIndex >= 0) {
          updatedPortLabels[existingIndex] = portLabel;
        } else {
          updatedPortLabels.push(portLabel);
        }
      } else {
        // Remove the port label
        updatedPortLabels = updatedPortLabels.filter(pl => pl.portNumber !== portNumber);
      }
      
      const updatedComponent = {
        ...selectedPortComponent,
        portLabels: updatedPortLabels
      };
      
      updateComponent(selectedPortComponent.id, updatedComponent);
      
      // Update selected component if it's the same one
      if (selectedComponent?.id === selectedPortComponent.id) {
        setSelectedComponent(updatedComponent);
      }
    }
  };

  // Helper to update rack height in the design
  const handleRackHeightChange = (newHeight: number) => {
    if (!currentDesign) return;
    // Clamp between 1 and 55
    const clamped = Math.max(1, Math.min(55, newHeight));
    setPendingRackHeight(clamped);
    // Only update if different
    if (clamped !== currentDesign.rackHeight) {
      // Remove components that would be out of bounds
      const filteredComponents = currentDesign.components.filter(
        c => !c.position || (c.position.rackUnit <= clamped && (c.position.rackUnit - c.height + 1) >= 1)
      );
      updateComponent('__RACK_HEIGHT__', { 
        // This is a hack, see below for actual update
      });
      // Actually update the design
      loadDesign({
        ...currentDesign,
        rackHeight: clamped,
        components: filteredComponents,
        updatedAt: new Date(),
      });
    }
  };

  const rackStats = currentDesign ? calculateRackStats(currentDesign) : null;


  const handleSave = () => {
    if (currentDesign) {
      // Save to localStorage for now (later can be extended to backend)
      localStorage.setItem('rackDesign', JSON.stringify(currentDesign));
      alert('Design saved successfully!');
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('rackDesign');
    if (saved) {
      try {
        const design = JSON.parse(saved);
        // Validate the design structure before loading
        if (design && typeof design === 'object' && 
            design.id && design.name && design.rackHeight && 
            Array.isArray(design.components)) {
          // Convert date strings back to Date objects
          const loadedDesign = {
            ...design,
            createdAt: new Date(design.createdAt),
            updatedAt: new Date(design.updatedAt),
          };
          loadDesign(loadedDesign);
          alert('Design loaded successfully!');
        } else {
          alert('Invalid design format');
        }
      } catch (error) {
        alert('Error loading design');
      }
    } else {
      alert('No saved design found');
    }
  };

  const handleLoadFromFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const design = JSON.parse(content);
        
        // Validate that it's a proper design file
        if (design && typeof design === 'object' && 
            design.id && design.name && design.rackHeight && 
            Array.isArray(design.components)) {
          // Convert date strings back to Date objects
          const loadedDesign = {
            ...design,
            createdAt: new Date(design.createdAt),
            updatedAt: new Date(design.updatedAt),
          };
          loadDesign(loadedDesign);
          alert(`Design "${loadedDesign.name}" loaded successfully from file!`);
        } else {
          alert('Invalid design file format. Please select a valid exported JSON file.');
        }
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid JSON file.');
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file.');
    };
    
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (currentDesign) {
      const exportData = {
        ...currentDesign,
        stats: rackStats,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDesign.name.replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>
          <div id="app-root" className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Toolbar */}
          <Toolbar
            onSave={handleSave}
            onLoad={handleLoad}
            onLoadFromFile={handleLoadFromFile}
            onExport={handleExport}
            onClear={clearDesign}
            designName={currentDesign?.name}
            onDesignNameChange={name => {
              if (currentDesign) {
                loadDesign({
                  ...currentDesign,
                  name,
                  updatedAt: new Date(),
                });
              }
            }}
          />
          
          <div id="main-layout" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Desktop Component Library Sidebar - Only when not collapsed */}
            {!isLibraryCollapsed && (
              <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                <ComponentLibrary 
                  onComponentSelect={setSelectedComponent}
                  onComponentRemove={removeComponent}
                  selectedCategory="server"
                  isCollapsed={isLibraryCollapsed}
                  onToggleCollapse={setIsLibraryCollapsed}
                />
              </div>
            )}
            
            {/* Main Design Area */}
            <div 
              id="design-area" 
              className={`flex-1 flex flex-col min-w-0 relative overflow-hidden ${selectedComponent ? 'lg:mr-80' : ''}`}
              style={{ minHeight: '0' }} // Ensures proper flex behavior
            >
              {/* Stats Panel with Collapsed Library - Responsive grid layout */}
              {rackStats && (
                <StatsPanel
                  rackStats={rackStats}
                  currentDesign={currentDesign}
                  removeComponent={removeComponent}
                  isLibraryCollapsed={isLibraryCollapsed}
                  setIsLibraryCollapsed={setIsLibraryCollapsed}
                />
              )}
              
              {/* Design Canvas - Scrollable with centered content */}
              <div 
                id="canvas-container" 
                className="flex-1 overflow-auto scrollbar-thin" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  minHeight: '0' // Ensures flex child can shrink and create scrollable area
                }}
              >
                <div className="min-h-full flex flex-col items-center py-4 sm:py-6 lg:py-8">
                  <div className="w-full max-w-6xl px-2 sm:px-4 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 transition-colors">
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={currentDesign?.name || ''}
                            onChange={e => {
                              if (currentDesign) {
                                loadDesign({
                                  ...currentDesign,
                                  name: e.target.value,
                                  updatedAt: new Date(),
                                });
                              }
                            }}
                            className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 input-inline w-full"
                            style={{ minWidth: 120 }}
                            aria-label="Design Name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="rack-height-input" className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rack Height:</label>
                          <input
                            id="rack-height-input"
                            type="number"
                            min={1}
                            max={55}
                            value={pendingRackHeight}
                            onChange={e => handleRackHeightChange(Number(e.target.value))}
                            className="w-16 sm:w-20 input-standard text-sm"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">U</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <RackContainer
                          components={currentDesign?.components || []}
                          rackHeight={currentDesign?.rackHeight || 42}
                          onComponentDrop={addComponent}
                          onComponentMove={moveComponent}
                          onComponentSelect={setSelectedComponent}
                          onPortClick={handlePortClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            {/* Properties Panel - Mobile: Full overlay, Desktop: Fixed right sidebar */}
            {selectedComponent && (
              <div id="properties-panel" className="fixed inset-0 z-50 lg:top-16 lg:bottom-0 lg:right-0 lg:left-auto lg:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl lg:border-l lg:shadow-lg">
                <div className="flex-shrink-0 relative p-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    className="absolute top-2 right-2 btn-icon lg:btn-icon"
                    title="Close"
                    aria-label="Close details panel"
                    onClick={() => setSelectedComponent(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Component Details</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                  <div>
                    <img
                      src={
                        imageErrors.has(selectedComponent.imageUrl)
                          ? createPlaceholderSVG(256, 128, selectedComponent.name, selectedComponent.category)
                          : selectedComponent.imageUrl
                      }
                      alt={selectedComponent.name}
                      className="w-full h-24 object-cover rounded bg-gray-100"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(selectedComponent.imageUrl));
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      {isEditingComponentName ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={editedComponentName}
                            onChange={(e) => setEditedComponentName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveComponentName();
                              if (e.key === 'Escape') cancelEditingComponentName();
                            }}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            autoFocus
                            placeholder="Enter component name"
                          />
                          <button
                            onClick={saveComponentName}
                            className="btn-success"
                            title="Save name"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditingComponentName}
                            className="btn-danger"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {selectedComponent.customName || selectedComponent.name}
                          </h4>
                          <button
                            onClick={startEditingComponentName}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            title="Edit component name"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    {selectedComponent.customName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original: {selectedComponent.name}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{selectedComponent.category}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Height:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">{selectedComponent.height}U</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Width:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">{selectedComponent.width}%</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Specifications</h5>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedComponent.specifications.manufacturer}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Model:</span>
                        <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedComponent.specifications.model}</span>
                      </div>
                      {selectedComponent.specifications.power && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Power:</span>
                          <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedComponent.specifications.power}</span>
                        </div>
                      )}
                      {selectedComponent.specifications.weight && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                          <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedComponent.specifications.weight}</span>
                        </div>
                      )}
                      {selectedComponent.specifications.capacity && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                          <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedComponent.specifications.capacity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Port Labeling for Patch Panels */}
                  {isPatchPanel(selectedComponent) && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">Port Labels</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs status-success px-2 py-1 rounded border">
                            {selectedComponent.portLabels?.length || 0} labeled
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            of {selectedComponent.specifications.ports}
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced Port Grid Preview */}
                      {selectedComponent.specifications.ports && (
                        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Port Status</span>
                            <div className="flex items-center space-x-3 text-xs">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Labeled</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span className="text-gray-600 dark:text-gray-400">Empty</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-12 gap-1">
                            {Array.from({ length: selectedComponent.specifications.ports }, (_, i) => {
                              const portNumber = i + 1;
                              const hasLabel = selectedComponent.portLabels?.some(pl => pl.portNumber === portNumber && pl.label.trim() !== '');
                              const portLabel = selectedComponent.portLabels?.find(pl => pl.portNumber === portNumber);
                              return (
                                <div
                                  key={portNumber}
                                  className={`w-4 h-4 rounded flex items-center justify-center text-xs border cursor-help transition-colors ${
                                    hasLabel 
                                      ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 dark:bg-green-600 dark:border-green-500 dark:hover:bg-green-700' 
                                      : 'bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
                                  }`}
                                  title={hasLabel ? `Port ${portNumber}: ${portLabel?.label}${portLabel?.description ? ` - ${portLabel.description}` : ''}` : `Port ${portNumber}: Click "Label Ports" to add labels`}
                                >
                                  {portNumber}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setIsPatchPanelModalOpen(true)}
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Label Ports</span>
                      </button>
                    </div>
                  )}
                  
                  <button
                    id="remove-component-btn"
                    onClick={() => {
                      if (selectedComponent.id) {
                        removeComponent(selectedComponent.id);
                        setSelectedComponent(null);
                      }
                    }}
                    className="w-full mt-3 px-2 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove Component
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Floating Component Library */}
          <div className="lg:hidden">
            <ComponentLibrary 
              onComponentSelect={setSelectedComponent}
              onComponentRemove={removeComponent}
              selectedCategory="server"
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          </div>
        
        {/* Patch Panel Modal */}
        {selectedComponent && isPatchPanel(selectedComponent) && (
          <PatchPanelModal
            isOpen={isPatchPanelModalOpen}
            onClose={() => setIsPatchPanelModalOpen(false)}
            component={selectedComponent}
            onSave={handleSavePortLabels}
          />
        )}
        
        {/* Single Port Modal */}
        {selectedPortComponent && (
          <SinglePortModal
            isOpen={isSinglePortModalOpen}
            onClose={() => setIsSinglePortModalOpen(false)}
            component={selectedPortComponent}
            portNumber={selectedPortNumber}
            onSave={handleSaveSinglePort}
          />
        )}
        </DndProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
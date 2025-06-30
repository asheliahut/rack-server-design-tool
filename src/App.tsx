import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComponentLibrary from '@/components/library/ComponentLibrary';
import RackContainer from '@/components/rack/RackContainer';
import Toolbar from '@/components/ui/Toolbar';
import { useRackDesign } from '@/hooks/useRackDesign';
import { calculateRackStats } from '@/utils/rackCalculations';
import { createPlaceholderSVG } from '@/utils/imageLoader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});


function App() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isEditingComponentName, setIsEditingComponentName] = useState(false);
  const [editedComponentName, setEditedComponentName] = useState('');

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
      <DndProvider backend={HTML5Backend}>
        <div id="app-root" className="h-screen flex flex-col bg-gray-50">
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
          
          <div id="main-layout" className="flex-1 flex overflow-hidden">
            {/* Component Library Sidebar */}
            <ComponentLibrary 
              onComponentSelect={setSelectedComponent}
              onComponentRemove={removeComponent}
              selectedCategory="server"
            />
            
            {/* Main Design Area */}
            <div id="design-area" className="flex-1 flex flex-col">
              {/* Stats Panel */}
              {rackStats && (
                <div id="stats-panel" className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm">
                      <span className="font-medium">
                        Utilization: <span className="text-blue-600">{rackStats.utilizationPercentage.toFixed(1)}%</span>
                      </span>
                      <span className="font-medium">
                        Used Units: <span className="text-green-600">{rackStats.usedUnits}/{currentDesign?.rackHeight}U</span>
                      </span>
                      <span className="font-medium">
                        Power: <span className="text-orange-600">{rackStats.totalPower}W</span>
                      </span>
                      <span className="font-medium">
                        Weight: <span className="text-purple-600">{rackStats.totalWeight.toFixed(1)}kg</span>
                      </span>
                      <span className="font-medium">
                        Components: <span className="text-gray-600">{rackStats.totalComponents}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Design Canvas */}
              <div id="canvas-container" className="flex-1 overflow-auto">
                <div className="p-8 min-h-full flex justify-center items-start">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
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
                      className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400 transition-colors w-full"
                      style={{ minWidth: 120 }}
                      aria-label="Design Name"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label htmlFor="rack-height-input" className="text-sm text-gray-600 font-medium">Rack Height:</label>
                    <input
                      id="rack-height-input"
                      type="number"
                      min={1}
                      max={55}
                      value={pendingRackHeight}
                      onChange={e => handleRackHeightChange(Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ width: 60 }}
                    />
                    <span className="text-sm text-gray-600">U</span>
                  </div>
                </div>
                    
                    <RackContainer
                      components={currentDesign?.components || []}
                      rackHeight={currentDesign?.rackHeight || 42}
                      onComponentDrop={addComponent}
                      onComponentMove={moveComponent}
                      onComponentSelect={setSelectedComponent}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Properties Panel */}
            {selectedComponent && (
              <div id="properties-panel" className="w-80 bg-white border-l border-gray-200 p-4 relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  title="Close"
                  aria-label="Close details panel"
                  onClick={() => setSelectedComponent(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold mb-4">Component Details</h3>
                <div className="space-y-4">
                  <div>
                    <img
                      src={
                        imageErrors.has(selectedComponent.imageUrl)
                          ? createPlaceholderSVG(256, 128, selectedComponent.name, selectedComponent.category)
                          : selectedComponent.imageUrl
                      }
                      alt={selectedComponent.name}
                      className="w-full h-32 object-cover rounded-lg bg-gray-100"
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
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            placeholder="Enter component name"
                          />
                          <button
                            onClick={saveComponentName}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                            title="Save name"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditingComponentName}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
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
                      <p className="text-xs text-gray-500 mb-1">Original: {selectedComponent.name}</p>
                    )}
                    <p className="text-sm text-gray-600 capitalize">{selectedComponent.category}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Height:</span>
                      <span className="ml-1 font-medium">{selectedComponent.height}U</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Width:</span>
                      <span className="ml-1 font-medium">{selectedComponent.width}%</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Specifications</h5>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Manufacturer:</span>
                        <span className="ml-1">{selectedComponent.specifications.manufacturer}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <span className="ml-1">{selectedComponent.specifications.model}</span>
                      </div>
                      {selectedComponent.specifications.power && (
                        <div>
                          <span className="text-gray-600">Power:</span>
                          <span className="ml-1">{selectedComponent.specifications.power}</span>
                        </div>
                      )}
                      {selectedComponent.specifications.weight && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-1">{selectedComponent.specifications.weight}</span>
                        </div>
                      )}
                      {selectedComponent.specifications.capacity && (
                        <div>
                          <span className="text-gray-600">Capacity:</span>
                          <span className="ml-1">{selectedComponent.specifications.capacity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedComponent.position && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Position</h5>
                      <div className="text-sm">
                        <div>
                          <span className="text-gray-600">Rack Unit:</span>
                          <span className="ml-1">{selectedComponent.position.rackUnit}U</span>
                        </div>
                      </div>
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
                    className="w-full mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove Component
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
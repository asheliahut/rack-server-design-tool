import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComponentLibrary from '@/components/library/ComponentLibrary';
import RackContainer from '@/components/rack/RackContainer';
import Toolbar from '@/components/ui/Toolbar';
import { useRackDesign } from '@/hooks/useRackDesign';
import { calculateRackStats } from '@/utils/rackCalculations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const {
    currentDesign,
    addComponent,
    moveComponent,
    removeComponent,
    clearDesign,
    selectedComponent,
    setSelectedComponent,
  } = useRackDesign();

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
        // Load design logic would go here
        alert('Design loaded successfully!');
      } catch (error) {
        alert('Error loading design');
      }
    } else {
      alert('No saved design found');
    }
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
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Toolbar */}
          <Toolbar
            onSave={handleSave}
            onLoad={handleLoad}
            onExport={handleExport}
            onClear={clearDesign}
            designName={currentDesign?.name}
          />
          
          <div className="flex-1 flex overflow-hidden">
            {/* Component Library Sidebar */}
            <ComponentLibrary 
              onComponentSelect={setSelectedComponent}
              selectedCategory="server"
            />
            
            {/* Main Design Area */}
            <div className="flex-1 flex flex-col">
              {/* Stats Panel */}
              {rackStats && (
                <div className="bg-white border-b border-gray-200 p-4">
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
              <div className="flex-1 overflow-auto">
                <div className="p-8 min-h-full flex justify-center items-start">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {currentDesign?.name || 'New Rack Design'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {currentDesign?.rackHeight}U Standard Rack
                      </p>
                    </div>
                    
                    <RackContainer
                      components={currentDesign?.components || []}
                      rackHeight={currentDesign?.rackHeight || 42}
                      onComponentDrop={addComponent}
                      onComponentMove={moveComponent}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Properties Panel */}
            {selectedComponent && (
              <div className="w-80 bg-white border-l border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">Component Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <img
                      src={selectedComponent.imageUrl}
                      alt={selectedComponent.name}
                      className="w-full h-32 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholders/generic-placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedComponent.name}</h4>
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
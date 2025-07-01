import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ComponentLibrary from '@/components/library/ComponentLibrary';
import RackContainer from '@/components/rack/RackContainer';
import Toolbar from '@/components/ui/Toolbar';
import PatchPanelModal from '@/components/ui/PatchPanelModal';
import SinglePortModal from '@/components/ui/SinglePortModal';
import { StatsPanel } from '@/components/ui/StatsPanel';
import { PropertiesPanel } from '@/components/ui/PropertiesPanel';
import { Input } from '@/components/ui/Input';
import { useRackDesign } from '@/hooks/useRackDesign';
import { calculateRackStats } from '@/utils/rackCalculations';
import { PortLabel, RackComponent } from '@/types/rack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});


function App() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isPatchPanelModalOpen, setIsPatchPanelModalOpen] = useState(false);
  const [isSinglePortModalOpen, setIsSinglePortModalOpen] = useState(false);
  const [selectedPortComponent, setSelectedPortComponent] = useState<RackComponent | null>(null);
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

  // Helper function for image errors
  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url));
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


  const handlePortClick = (component: RackComponent, portNumber: number) => {
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
      } catch {
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
      } catch {
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
                          <Input
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
                            variant="inline"
                            className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 w-full"
                            style={{ minWidth: 120 }}
                            aria-label="Design Name"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor="rack-height-input" className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rack Height:</label>
                          <Input
                            id="rack-height-input"
                            type="number"
                            min={1}
                            max={55}
                            value={pendingRackHeight.toString()}
                            onChange={e => handleRackHeightChange(Number(e.target.value))}
                            className="w-16 sm:w-20 text-sm"
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
            
            {/* Properties Panel */}
            {selectedComponent && (
              <PropertiesPanel
                component={selectedComponent}
                onClose={() => setSelectedComponent(null)}
                onComponentUpdate={(updatedComponent) => {
                  updateComponent(selectedComponent.id, updatedComponent);
                  setSelectedComponent(updatedComponent);
                }}
                onComponentRemove={(id) => {
                  removeComponent(id);
                  setSelectedComponent(null);
                }}
                onPortClick={handlePortClick}
                onPatchPanelModalOpen={() => setIsPatchPanelModalOpen(true)}
                imageErrors={imageErrors}
                onImageError={handleImageError}
              />
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
        {selectedComponent && (
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
import React, { useState, useCallback } from 'react';
import { RackComponent, RackPosition, RackDesign } from '@/types/rack';
import RackContainer from '@/components/rack/RackContainer';
import DragPreview from './DragPreview';
import { useDragLayer } from 'react-dnd';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Eye, EyeOff } from 'lucide-react';

interface DesignCanvasProps {
  design: RackDesign;
  onComponentDrop: (component: RackComponent, position: RackPosition) => void;
  onComponentMove: (componentId: string, newPosition: RackPosition) => void;
  onComponentSelect?: (component: RackComponent) => void;
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({
  design,
  onComponentDrop,
  onComponentMove,
  onComponentSelect,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  // Drag layer for custom drag preview
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
  }));

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1.0);
    setCanvasPosition({ x: 0, y: 0 });
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleToggleLabels = useCallback(() => {
    setShowLabels(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 flex items-center">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-l-lg border-r border-gray-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="px-3 py-2 text-sm font-mono min-w-[60px] text-center border-r border-gray-200">
            {(zoom * 100).toFixed(0)}%
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 border-r border-gray-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="p-2 hover:bg-gray-100 rounded-r-lg"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 flex items-center">
          <button
            onClick={handleToggleGrid}
            className={`p-2 rounded-l-lg border-r border-gray-200 ${
              showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleLabels}
            className={`p-2 rounded-r-lg ${
              showLabels ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle Labels"
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Design Info Panel */}
      <div className="absolute top-4 left-4 z-30 bg-white rounded-lg shadow-md border border-gray-200 p-3">
        <h3 className="font-medium text-gray-900 mb-1">{design.name}</h3>
        <div className="text-xs text-gray-600 space-y-0.5">
          <div>Rack Height: {design.rackHeight}U</div>
          <div>Components: {design.components.length}</div>
          <div>
            Used: {design.components.reduce((sum, c) => sum + c.height, 0)}U / {design.rackHeight}U
          </div>
          <div>
            Utilization: {(
              (design.components.reduce((sum, c) => sum + c.height, 0) / design.rackHeight) * 100
            ).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="absolute inset-0 overflow-auto"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
        }}
      >
        <div 
          className="flex items-center justify-center min-w-full min-h-full p-8"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="relative">
            {/* Drop shadow for rack */}
            <div 
              className="absolute bg-black opacity-10 rounded-lg"
              style={{
                top: 8,
                left: 8,
                right: -8,
                bottom: -8,
              }}
            />
            
            {/* Main Rack Container */}
            <RackContainer
              components={design.components}
              rackHeight={design.rackHeight}
              onComponentDrop={onComponentDrop}
              onComponentMove={onComponentMove}
            />
          </div>
        </div>
      </div>

      {/* Custom Drag Preview */}
      {isDragging && item && (
        <DragPreview
          component={item.component}
          isDragging={isDragging}
          currentOffset={currentOffset}
        />
      )}

      {/* Canvas Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 z-30 text-xs text-gray-500 bg-white bg-opacity-90 rounded p-2">
        <div className="font-medium mb-1">Shortcuts:</div>
        <div>Drag components from library to rack</div>
        <div>Click components to select/edit</div>
        <div>Zoom: Mouse wheel or +/- keys</div>
      </div>
    </div>
  );
};

export default DesignCanvas;
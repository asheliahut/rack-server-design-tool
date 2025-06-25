import React, { useState } from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Trash2, 
  FileText, 
  Share2, 
  Settings,
  Undo,
  Redo,
  Copy,
  Palette
} from 'lucide-react';
import Button from './Button';

interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  designName?: string;
  onDesignNameChange?: (name: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDuplicate?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
  designName = 'New Rack Design',
  onDesignNameChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onDuplicate,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(designName);

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(designName);
  };

  const handleNameSave = () => {
    onDesignNameChange?.(tempName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(designName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-300 flex items-center px-6 shadow-sm">
      {/* Left section - App title and design name */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Rack Designer</h1>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        {/* Design name editor */}
        <div className="flex items-center space-x-2">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border border-blue-300 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <button
              onClick={handleNameEdit}
              className="px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded"
            >
              {designName}
            </button>
          )}
        </div>
      </div>

      {/* Center section - Edit actions */}
      <div className="flex items-center space-x-1 ml-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDuplicate}
          title="Duplicate Design"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          title="Clear All Components"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Right section - File actions */}
      <div className="ml-auto flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoad}
          title="Load Design"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Load
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          title="Save Design (Ctrl+S)"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        
        {/* Export dropdown */}
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            title="Export Design"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                onClick={() => onExport?.()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </button>
              <button
                onClick={() => {/* Handle PDF export */}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </button>
              <button
                onClick={() => {/* Handle image export */}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as Image
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <Button
          variant="ghost"
          size="sm"
          title="Share Design"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
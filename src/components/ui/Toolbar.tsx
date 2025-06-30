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
  Palette,
  Upload,
  Sun,
  Moon
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '@/contexts/ThemeContext';

interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onLoadFromFile?: (file: File) => void;
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
  onLoadFromFile,
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
  const { theme, toggleTheme } = useTheme();
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onLoadFromFile) {
      onLoadFromFile(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div id="main-toolbar" className="h-16 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 flex items-center px-6 shadow-sm transition-colors">
      {/* Left section - App title and design name */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Rack Designer</h1>
        </div>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        
        {/* Design name editor */}
        <div className="flex items-center space-x-2">
          {isEditingName ? (
            <input
              id="design-name-input"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border border-blue-300 dark:border-blue-500 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <button
              id="design-name-edit-btn"
              onClick={handleNameEdit}
              className="px-2 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {designName}
            </button>
          )}
        </div>
      </div>

      {/* Center section - Edit actions */}
      <div className="flex items-center space-x-1 ml-8">
        <Button
          id="toolbar-undo-btn"
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          id="toolbar-redo-btn"
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
        
        <Button
          id="toolbar-duplicate-btn"
          variant="ghost"
          size="sm"
          onClick={onDuplicate}
          title="Duplicate Design"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          id="toolbar-clear-btn"
          variant="ghost"
          size="sm"
          onClick={onClear}
          title="Clear All Components"
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Right section - File actions */}
      <div className="ml-auto flex items-center space-x-2">
        {/* Load dropdown */}
        <div className="relative group">
          <Button
            id="toolbar-load-btn"
            variant="ghost"
            size="sm"
            title="Load Design"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Load
          </Button>
          
          {/* Load dropdown menu */}
          <div id="load-dropdown-menu" className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                id="load-storage-btn"
                onClick={() => onLoad?.()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Load from Storage
              </button>
              <label className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Load from File
                <input
                  id="load-file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
        
        <Button
          id="toolbar-save-btn"
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
            id="toolbar-export-btn"
            variant="ghost"
            size="sm"
            onClick={onExport}
            title="Export Design"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          {/* Dropdown menu */}
          <div id="export-dropdown-menu" className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                id="export-json-btn"
                onClick={() => onExport?.()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </button>
              <button
                id="export-pdf-btn"
                onClick={() => {/* Handle PDF export */}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </button>
              <button
                id="export-image-btn"
                onClick={() => {/* Handle image export */}}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as Image
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        
        <Button
          id="toolbar-share-btn"
          variant="ghost"
          size="sm"
          title="Share Design"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <Button
          id="toolbar-theme-toggle-btn"
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          title={`Currently ${theme} mode - click to switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          id="toolbar-settings-btn"
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
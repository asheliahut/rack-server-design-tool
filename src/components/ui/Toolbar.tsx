import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Trash2, 
  FileText, 
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
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onLoadFromFile,
  onExport,
  onClear,
  designName = 'New Rack Design',
  onDesignNameChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(designName);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

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
    <div ref={toolbarRef} className="relative">
      <div id="main-toolbar" className="h-14 sm:h-16 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 flex items-center px-3 sm:px-6 shadow-sm transition-colors">
      {/* Left section - App title and design name */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">Rack Designer</h1>
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:hidden">Rack</h1>
        </div>
        
        <div className="h-4 sm:h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />
        
        {/* Design name editor - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-2 min-w-0">
          {isEditingName ? (
            <input
              id="design-name-input"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border border-blue-300 dark:border-blue-500 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              autoFocus
            />
          ) : (
            <button
              id="design-name-edit-btn"
              onClick={handleNameEdit}
              className="px-2 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded truncate min-w-0 max-w-48"
              title={designName}
            >
              {designName}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Actions and Menu */}
      <div className="lg:hidden ml-auto flex items-center space-x-1">
        {/* Quick Action Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="p-2"
          title="Save Design"
        >
          <Save className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Clear All Components"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="p-2"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
        
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 relative"
        >
          <div className="w-4 h-4 flex flex-col justify-center space-y-1">
            <div className={`w-4 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-4 h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-4 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </Button>
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center space-x-1 ml-8">
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

      {/* Desktop File Actions */}
      <div className="hidden lg:flex ml-auto items-center space-x-2">
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="max-h-screen overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Design name editor for mobile */}
              <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Design Name</label>
                {isEditingName ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleKeyPress}
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-500 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={handleNameEdit}
                    className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200"
                  >
                    {designName}
                  </button>
                )}
              </div>
              
              {/* Load Options */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Load Design</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onLoad?.(); setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors duration-200 active:scale-95"
                  >
                    <FolderOpen className="w-5 h-5 mb-1" />
                    <span className="text-xs">From Storage</span>
                  </button>
                  
                  <label className="flex flex-col items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors duration-200 active:scale-95 cursor-pointer">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">From File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => { handleFileSelect(e); setIsMobileMenuOpen(false); }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              {/* Export Options */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Design</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onExport?.(); setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-colors duration-200 active:scale-95"
                  >
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">JSON File</span>
                  </button>
                  
                  <button
                    onClick={() => { /* Handle PDF export */ setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-colors duration-200 active:scale-95"
                  >
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-xs">PDF Report</span>
                  </button>
                  
                  <button
                    onClick={() => { /* Handle image export */ setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-colors duration-200 active:scale-95"
                  >
                    <Download className="w-5 h-5 mb-1" />
                    <span className="text-xs">Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Toolbar;
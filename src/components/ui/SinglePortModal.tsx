import React, { useState, useEffect } from 'react';
import { RackComponent, PortLabel } from '@/types/rack';
import { X, Save, Trash2 } from 'lucide-react';

interface SinglePortModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: RackComponent;
  portNumber: number;
  onSave: (portNumber: number, portLabel: PortLabel | null) => void;
}

const SinglePortModal: React.FC<SinglePortModalProps> = ({
  isOpen,
  onClose,
  component,
  portNumber,
  onSave,
}) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingLabel = component.portLabels?.find(pl => pl.portNumber === portNumber);
      setLabel(existingLabel?.label || '');
      setDescription(existingLabel?.description || '');
      setHasChanges(false);
    }
  }, [isOpen, component, portNumber]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    const trimmedLabel = label.trim();
    const trimmedDescription = description.trim();
    
    if (trimmedLabel || trimmedDescription) {
      const portLabel: PortLabel = {
        portNumber,
        label: trimmedLabel,
        description: trimmedDescription || undefined,
      };
      onSave(portNumber, portLabel);
    } else {
      // If both are empty, remove the port label
      onSave(portNumber, null);
    }
    setHasChanges(false);
    onClose();
  };

  const handleClear = () => {
    setLabel('');
    setDescription('');
    setHasChanges(true);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  const existingLabel = component.portLabels?.find(pl => pl.portNumber === portNumber);
  const isLabeled = existingLabel && existingLabel.label.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Port {portNumber}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {component.customName || component.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none p-2 -m-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Port Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isLabeled ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLabeled ? 'Port is labeled' : 'Port is unlabeled'}
            </span>
          </div>

          {/* Label Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Port Label <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="e.g., Office-101, Server Room A, etc."
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {label.length}/50 characters
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Additional details about this connection..."
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description.length}/200 characters
            </p>
          </div>

          {/* Change Indicator */}
          {hasChanges && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full mr-2" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">Unsaved changes</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center sm:justify-start">
            {(label.trim() || description.trim()) && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Clear all fields"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-3 sm:py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center justify-center px-4 py-3 sm:py-2 text-sm rounded order-1 sm:order-2 ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Press Ctrl+Enter to save, Esc to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePortModal;
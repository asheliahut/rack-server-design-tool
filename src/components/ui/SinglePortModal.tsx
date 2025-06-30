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
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Port {portNumber}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {component.customName || component.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Port Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isLabeled ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span className="text-sm text-gray-600">
              {isLabeled ? 'Port is labeled' : 'Port is unlabeled'}
            </span>
          </div>

          {/* Label Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Office-101, Server Room A, etc."
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {label.length}/50 characters
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Additional details about this connection..."
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/200 characters
            </p>
          </div>

          {/* Change Indicator */}
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                <span className="text-sm text-yellow-800">Unsaved changes</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {(label.trim() || description.trim()) && (
              <button
                onClick={handleClear}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                title="Clear all fields"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center px-4 py-2 text-sm rounded ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 text-center">
            Press Ctrl+Enter to save, Esc to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePortModal;
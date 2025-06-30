import React, { useState, useEffect } from 'react';
import { RackComponent, PortLabel } from '@/types/rack';
import { X, Save, RotateCcw } from 'lucide-react';

interface PatchPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: RackComponent;
  onSave: (portLabels: PortLabel[]) => void;
}

const PatchPanelModal: React.FC<PatchPanelModalProps> = ({
  isOpen,
  onClose,
  component,
  onSave,
}) => {
  const [portLabels, setPortLabels] = useState<PortLabel[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const totalPorts = component.specifications.ports || 0;

  // Initialize port labels when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialLabels: PortLabel[] = [];
      for (let i = 1; i <= totalPorts; i++) {
        const existingLabel = component.portLabels?.find(pl => pl.portNumber === i);
        initialLabels.push({
          portNumber: i,
          label: existingLabel?.label || '',
          description: existingLabel?.description || '',
        });
      }
      setPortLabels(initialLabels);
      setHasChanges(false);
    }
  }, [isOpen, component, totalPorts]);

  const updatePortLabel = (portNumber: number, field: 'label' | 'description', value: string) => {
    setPortLabels(prev => 
      prev.map(pl => 
        pl.portNumber === portNumber 
          ? { ...pl, [field]: value }
          : pl
      )
    );
    setHasChanges(true);
  };

  const clearAllLabels = () => {
    setPortLabels(prev => 
      prev.map(pl => ({ ...pl, label: '', description: '' }))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // Only save non-empty labels
    const validLabels = portLabels.filter(pl => pl.label.trim() !== '' || pl.description?.trim() !== '');
    onSave(validLabels);
    setHasChanges(false);
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Port Labeling - {component.customName || component.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {totalPorts} ports • {component.specifications.manufacturer} {component.specifications.model}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {portLabels.filter(pl => pl.label.trim() !== '').length} of {totalPorts} ports labeled
              </span>
              {hasChanges && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Unsaved changes
                </span>
              )}
            </div>
            <button
              onClick={clearAllLabels}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
              title="Clear all labels"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          {/* Port Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portLabels.map((portLabel) => (
                <div
                  key={portLabel.portNumber}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">
                      Port {portLabel.portNumber}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      portLabel.label.trim() !== '' ? 'bg-green-500' : 'bg-gray-300'
                    }`} title={portLabel.label.trim() !== '' ? 'Labeled' : 'Unlabeled'} />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={portLabel.label}
                        onChange={(e) => updatePortLabel(portLabel.portNumber, 'label', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="e.g., Office-101"
                        maxLength={50}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        value={portLabel.description || ''}
                        onChange={(e) => updatePortLabel(portLabel.portNumber, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="e.g., Main conference room"
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
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
            Save Labels
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatchPanelModal;
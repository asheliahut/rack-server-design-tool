import React, { useState, useEffect } from 'react';
import { RackComponent, PortLabel } from '@/types/rack';
import { Save, RotateCcw } from 'lucide-react';
import { BaseModal } from './BaseModal';
import Button from './Button';
import { Input } from './Input';
import { ComponentGrid } from './ResponsiveGrid';
import { StatusIndicator } from './StatusIndicator';

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
    if (window.confirm('Are you sure you want to clear all port labels?')) {
      setPortLabels(prev => prev.map(pl => ({ ...pl, label: '', description: '' })));
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    // Only save non-empty labels
    const validLabels = portLabels.filter(pl => pl.label.trim() !== '');
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

  const footer = (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
      <Button
        onClick={handleClose}
        variant="secondary"
        size="sm"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        variant="primary"
        size="sm"
        icon={<Save className="w-4 h-4" />}
        disabled={!hasChanges}
      >
        Save Labels
      </Button>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Port Labeling - ${component.customName || component.name}`}
      size="xl"
      footer={footer}
      closeOnOverlayClick={false}
    >
      {/* Subtitle */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalPorts} ports • {component.specifications.manufacturer} {component.specifications.model}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {portLabels.filter(pl => pl.label.trim() !== '').length} of {totalPorts} ports labeled
          </span>
          {hasChanges && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
        </div>
        <Button
          onClick={clearAllLabels}
          variant="ghost"
          size="sm"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Clear All
        </Button>
      </div>

      {/* Port Grid */}
      <div className="max-h-96 overflow-y-auto">
        <ComponentGrid>
          {portLabels.map((portLabel) => (
            <div
              key={portLabel.portNumber}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Port {portLabel.portNumber}
                </span>
                <StatusIndicator 
                  status={portLabel.label.trim() !== '' ? 'success' : 'neutral'}
                  size="sm"
                />
              </div>
              
              <div className="space-y-3">
                <Input
                  label="Label"
                  value={portLabel.label}
                  onChange={(e) => updatePortLabel(portLabel.portNumber, 'label', e.target.value)}
                  placeholder="e.g., Office-101"
                  maxLength={50}
                  fullWidth
                />
                
                <Input
                  label="Description (optional)"
                  value={portLabel.description || ''}
                  onChange={(e) => updatePortLabel(portLabel.portNumber, 'description', e.target.value)}
                  placeholder="e.g., Main conference room"
                  maxLength={100}
                  fullWidth
                />
              </div>
            </div>
          ))}
        </ComponentGrid>
      </div>
    </BaseModal>
  );
};

export default PatchPanelModal;
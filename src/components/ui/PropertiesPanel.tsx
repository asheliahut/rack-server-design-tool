import { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { RackComponent } from '@/types/rack';
import { ComponentSpecifications } from './ComponentSpecifications';
import { InlineTextEditor } from './InlineTextEditor';
import { IconButton } from './IconButton';
import Button from './Button';
import { PortStatusGrid } from './PortStatusGrid';
import { CollapsibleSection } from './CollapsibleSection';
import { StatusBadge } from './StatusIndicator';
import { createPlaceholderSVG } from '@/utils/imageLoader';

interface PropertiesPanelProps {
  component: RackComponent;
  onClose: () => void;
  onComponentUpdate: (component: RackComponent) => void;
  onComponentRemove: (id: string) => void;
  onPortClick?: (component: RackComponent, portNumber: number) => void;
  onPatchPanelModalOpen?: () => void;
  imageErrors: Set<string>;
  onImageError: (url: string) => void;
}

function isPatchPanel(component: RackComponent): boolean {
  const name = component?.name?.toLowerCase() || '';
  const category = component?.category?.toLowerCase() || '';
  
  // Check for patch panel keywords or if it has ports
  return (
    (name.includes('patch') && name.includes('panel')) ||
    (name.includes('keystone') && name.includes('panel')) ||
    category === 'management' ||
    !!(component?.specifications?.ports && component.specifications.ports > 0)
  );
}

export function PropertiesPanel({
  component,
  onClose,
  onComponentUpdate,
  onComponentRemove,
  onPortClick,
  onPatchPanelModalOpen,
  imageErrors,
  onImageError,
}: PropertiesPanelProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSave = (newName: string) => {
    const updatedComponent = {
      ...component,
      customName: newName !== component.name ? newName : undefined,
    };
    onComponentUpdate(updatedComponent);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
  };

  const startEditingName = () => {
    setIsEditingName(true);
  };

  const displayName = component.customName || component.name;
  const hasCustomName = !!component.customName;

  return (
    <div
      id="properties-panel"
      className="fixed inset-0 z-50 lg:top-16 lg:bottom-0 lg:right-0 lg:left-auto lg:w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl lg:border-l lg:shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 relative p-4 border-b border-gray-200 dark:border-gray-700">
        <IconButton
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          title="Close"
          aria-label="Close details panel"
        >
          <X className="h-5 w-5" />
        </IconButton>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Component Details
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin min-h-0">
        {/* Component Image */}
        <div>
          <img
            src={
              imageErrors.has(component.imageUrl)
                ? createPlaceholderSVG(256, 128, component.name, component.category)
                : component.imageUrl
            }
            alt={component.name}
            className="w-full h-24 object-cover rounded bg-gray-100"
            onError={() => onImageError(component.imageUrl)}
          />
        </div>

        {/* Component Name Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            {isEditingName ? (
              <InlineTextEditor
                value={displayName}
                onSave={handleNameSave}
                onCancel={handleNameCancel}
                placeholder="Enter component name"
                maxLength={100}
                validation={(value) =>
                  value.trim() === '' ? 'Name cannot be empty' : null
                }
              />
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {displayName}
                </h4>
                <IconButton
                  onClick={startEditingName}
                  variant="ghost"
                  size="sm"
                  title="Edit component name"
                  aria-label="Edit component name"
                >
                  <Edit2 className="h-4 w-4" />
                </IconButton>
              </div>
            )}
          </div>
          {hasCustomName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Original: {component.name}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {component.category}
          </p>
        </div>

        {/* Component Dimensions */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
            <span className="text-blue-600 dark:text-blue-400 text-xs">Height:</span>
            <span className="ml-1 font-medium text-blue-800 dark:text-blue-300 text-xs">
              {component.height}U
            </span>
          </div>
          <div className="inline-flex items-center bg-green-50 dark:bg-green-900/20 rounded px-2 py-1">
            <span className="text-green-600 dark:text-green-400 text-xs">Width:</span>
            <span className="ml-1 font-medium text-green-800 dark:text-green-300 text-xs">
              {component.width}%
            </span>
          </div>
        </div>

        {/* Component Specifications */}
        <div className="border-t pt-3">
          <ComponentSpecifications
            specifications={component.specifications}
          />
        </div>

        {/* Port Labeling for Patch Panels */}
        {isPatchPanel(component) && (
          <div className="border-t pt-3">
            <CollapsibleSection
              title="Port Labels"
              defaultExpanded={true}
              badge={
                <div className="flex items-center space-x-2">
                  <StatusBadge status="success" size="sm">
                    {component.portLabels?.length || 0} labeled
                  </StatusBadge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    of {component.specifications.ports}
                  </span>
                </div>
              }
              variant="minimal"
            >
              {/* Port Grid Preview */}
              {component.specifications.ports && (
                <div className="mb-3">
                  <PortStatusGrid
                    totalPorts={component.specifications.ports}
                    portLabels={component.portLabels}
                    onPortClick={
                      onPortClick ? (portNumber) => onPortClick(component, portNumber) : undefined
                    }
                    size="sm"
                  />
                </div>
              )}

              <Button
                onClick={onPatchPanelModalOpen}
                variant="primary"
                size="sm"
                className="w-full"
                icon={<Edit2 className="h-4 w-4" />}
                disabled={!onPatchPanelModalOpen}
              >
                Label Ports
              </Button>
            </CollapsibleSection>
          </div>
        )}

        {/* Remove Component Button */}
        <Button
          onClick={() => onComponentRemove(component.id)}
          variant="destructive"
          size="sm"
          className="w-full mt-3"
        >
          Remove Component
        </Button>
      </div>
    </div>
  );
}
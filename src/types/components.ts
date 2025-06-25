import { RackComponent } from "./rack";

export interface ComponentLibraryProps {
  onComponentSelect?: (component: RackComponent) => void;
  selectedCategory?: string;
}

export interface ComponentCardProps {
  component: RackComponent;
  isSelected?: boolean;
  onSelect?: (component: RackComponent) => void;
  isDragging?: boolean;
}

export interface ComponentCategoryProps {
  category: string;
  components: RackComponent[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export interface DragPreviewProps {
  component: RackComponent;
  isDragging: boolean;
  currentOffset?: { x: number; y: number };
}

export interface RackUnitProps {
  unitNumber: number;
  components: RackComponent[];
  isHighlighted?: boolean;
  onComponentSelect?: (component: RackComponent) => void;
  onComponentRemove?: (componentId: string) => void;
}

export interface RackGridProps {
  rackHeight: number;
  gridVisible?: boolean;
  snapPoints?: Array<{ x: number; y: number; rackUnit: number }>;
}

export interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  designName?: string;
  onDesignNameChange?: (name: string) => void;
}

import { RackComponent, RackPosition, SnapPoint, RackDesign } from "./rack.js";

export interface DragItem {
  type: string;
  component: RackComponent;
  sourcePosition?: RackPosition;
}

export interface DropResult {
  position: RackPosition;
  snapPoint: SnapPoint;
}

export interface SnapGuide {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  rackUnit?: number;
}

export interface DesignState {
  currentDesign: RackDesign | null;
  selectedComponent: RackComponent | null;
  draggedComponent: RackComponent | null;
  snapGuides: SnapGuide[];
  gridVisible: boolean;
}

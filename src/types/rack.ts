export interface RackPosition {
  x: number;
  y: number;
  rackUnit: number; // 1U, 2U, etc.
}

export interface RackComponent {
  id: string;
  name: string;
  customName?: string; // User-defined custom name for the component
  category: ComponentCategory;
  height: number; // in rack units (1U, 2U, etc.)
  width: number; // percentage of rack width (25%, 50%, 100%)
  depth: number; // short, medium, full depth
  imageUrl: string;
  specifications: ComponentSpecs;
  position?: RackPosition;
}

export interface ComponentSpecs {
  power?: string;
  ports?: number;
  capacity?: string;
  manufacturer: string;
  model: string;
  weight?: string;
}

export type ComponentCategory =
  | "server"
  | "storage"
  | "network"
  | "power"
  | "cooling"
  | "management"
  | "blank";

export interface RackDesign {
  id: string;
  name: string;
  rackHeight: number; // in U (usually 42U)
  components: RackComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SnapPoint {
  x: number;
  y: number;
  rackUnit: number;
  isOccupied: boolean;
}

// Rack measurement constants
export const RACK_UNIT_HEIGHT = 44; // pixels per rack unit
export const RACK_WIDTH_COMPACT = 600; // compact rack width in pixels
export const RACK_WIDTH_STANDARD = 720; // standard rack width in pixels
export const RACK_UNIT_LABEL_WIDTH = 56; // width for rack unit labels (ml-14 equivalent)

// Rack positioning utilities
export const getRackUnitFromY = (y: number): number => Math.floor(y / RACK_UNIT_HEIGHT);
export const getYFromRackUnit = (unit: number): number => unit * RACK_UNIT_HEIGHT;
export const getRackUnitHeight = (units: number): number => units * RACK_UNIT_HEIGHT;
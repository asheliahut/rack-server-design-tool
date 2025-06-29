import { RackComponent, RackPosition, SnapPoint } from "@/types/rack";

export const RACK_CONSTANTS = {
  UNIT_HEIGHT: 44, // Standard rack unit height in pixels
  RACK_WIDTH: 572, // Updated usable rack width leaving space for rail holes (720 - 56 - 40 - 24 - 8 - 20)
  SNAP_THRESHOLD: 50, // Increased snap distance threshold in pixels (more forgiving)
  HALF_WIDTH: 286, // Half rack width for dual components (572 / 2)
};

export const calculateSnapPosition = (
  mouseX: number,
  mouseY: number,
  component: RackComponent,
  rackHeight: number,
  existingComponents: RackComponent[] = []
): SnapPoint | null => {
  const { UNIT_HEIGHT, HALF_WIDTH } = RACK_CONSTANTS;

  // Calculate the rack unit based on Y position - fix the decremental logic
  // Y=0 should be the highest rack unit number (top of rack)
  // As Y increases (going down), rack unit numbers should decrease
  const rawRackUnit = Math.floor(mouseY / UNIT_HEIGHT);
  const rackUnit = Math.max(1, Math.min(rackHeight, rackHeight - rawRackUnit));

  // Determine X position (full width or half width) - offset from left rail holes
  const leftRailOffset = 16; // Space for left rail holes
  let snapX = leftRailOffset;
  if (component.width === 50) {
    // Half-width component - snap to left or right half
    snapX = mouseX > (HALF_WIDTH + leftRailOffset) ? (HALF_WIDTH + leftRailOffset) : leftRailOffset;
  } else {
    // Full-width component - start after left rail holes
    snapX = leftRailOffset;
  }

  // Calculate Y position - align to the correct rack unit position
  const snapY = (rackHeight - rackUnit) * UNIT_HEIGHT;


  // Check if this position would cause overlap
  const wouldOverlap = checkForOverlap(
    { x: snapX, y: snapY, rackUnit },
    component,
    existingComponents
  );

  if (wouldOverlap) {
    return null;
  }

  // Always return a snap point (simplified for better UX)
  return {
    x: snapX,
    y: snapY,
    rackUnit,
    isOccupied: false,
  };
};

export const checkForOverlap = (
  position: RackPosition,
  component: RackComponent,
  existingComponents: RackComponent[],
  excludeId?: string
): boolean => {
  for (const existing of existingComponents) {
    if (excludeId && existing.id === excludeId) continue;
    if (!existing.position) continue;

    // Calculate rack unit ranges - components grow DOWNWARD (decremental)
    // A 2U component placed "on unit 39" occupies units 39 and 38
    const newStartUnit = position.rackUnit;
    const newEndUnit = position.rackUnit - component.height + 1;
    const existingStartUnit = existing.position.rackUnit;
    const existingEndUnit = existing.position.rackUnit - existing.height + 1;

    // Check if rack unit ranges overlap
    // For decremental ranges: [newStartUnit, newEndUnit] and [existingStartUnit, existingEndUnit]
    // where start > end (e.g., [39, 38] for a 2U component on unit 39)
    const verticalOverlap = !(newEndUnit > existingStartUnit || newStartUnit < existingEndUnit);
    
    if (verticalOverlap) {
      return true; // Found an overlap in rack units
    }
  }
  
  return false; // No overlaps found
};

export const generateAvailablePositions = (
  component: RackComponent,
  rackHeight: number,
  existingComponents: RackComponent[]
): SnapPoint[] => {
  const positions: SnapPoint[] = [];

  // Components grow downward, so we need to ensure they don't go below unit 1
  for (let unit = component.height; unit <= rackHeight; unit++) {
    // Full width position - offset from left rail holes
    const leftRailOffset = 16;
    const fullWidthPos: RackPosition = {
      x: leftRailOffset,
      y: (rackHeight - unit) * RACK_CONSTANTS.UNIT_HEIGHT,
      rackUnit: unit,
    };

    if (!checkForOverlap(fullWidthPos, component, existingComponents)) {
      positions.push({
        ...fullWidthPos,
        isOccupied: false,
      });
    }

    // Half width positions (if component supports it)
    if (component.width === 50) {
      const leftHalfPos: RackPosition = {
        x: leftRailOffset,
        y: (rackHeight - unit) * RACK_CONSTANTS.UNIT_HEIGHT,
        rackUnit: unit,
      };

      const rightHalfPos: RackPosition = {
        x: RACK_CONSTANTS.HALF_WIDTH + leftRailOffset,
        y: (rackHeight - unit) * RACK_CONSTANTS.UNIT_HEIGHT,
        rackUnit: unit,
      };

      if (!checkForOverlap(leftHalfPos, component, existingComponents)) {
        positions.push({
          ...leftHalfPos,
          isOccupied: false,
        });
      }

      if (!checkForOverlap(rightHalfPos, component, existingComponents)) {
        positions.push({
          ...rightHalfPos,
          isOccupied: false,
        });
      }
    }
  }

  return positions;
};

export const findNearestAvailablePosition = (
  targetPosition: RackPosition,
  component: RackComponent,
  rackHeight: number,
  existingComponents: RackComponent[]
): SnapPoint | null => {
  const availablePositions = generateAvailablePositions(
    component,
    rackHeight,
    existingComponents
  );

  if (availablePositions.length === 0) return null;

  let nearest = availablePositions[0];
  let minDistance = calculateDistance(targetPosition, nearest);

  for (const position of availablePositions) {
    const distance = calculateDistance(targetPosition, position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = position;
    }
  }

  return nearest;
};

export const calculateDistance = (
  pos1: RackPosition,
  pos2: RackPosition
): number => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

export const isValidRackPosition = (
  position: RackPosition,
  component: RackComponent,
  rackHeight: number
): boolean => {
  // Check if component fits within rack bounds (components grow downward)
  if (
    position.rackUnit < component.height ||
    position.rackUnit > rackHeight
  ) {
    return false;
  }

  // Check if X position is valid - accounting for left rail offset
  const leftRailOffset = 16;
  if (component.width === 100 && position.x !== leftRailOffset) {
    return false;
  }

  if (
    component.width === 50 &&
    position.x !== leftRailOffset &&
    position.x !== RACK_CONSTANTS.HALF_WIDTH + leftRailOffset
  ) {
    return false;
  }

  return true;
};

import { RackComponent, RackPosition, SnapPoint } from "@/types/rack";

export const RACK_CONSTANTS = {
  UNIT_HEIGHT: 44, // Standard rack unit height in pixels
  RACK_WIDTH: 600, // Total rack width in pixels
  SNAP_THRESHOLD: 15, // Snap distance threshold in pixels
  HALF_WIDTH: 300, // Half rack width for dual components
};

export const calculateSnapPosition = (
  mouseX: number,
  mouseY: number,
  component: RackComponent,
  rackHeight: number,
  existingComponents: RackComponent[] = []
): SnapPoint | null => {
  const { UNIT_HEIGHT, RACK_WIDTH, SNAP_THRESHOLD, HALF_WIDTH } =
    RACK_CONSTANTS;

  // Calculate the rack unit based on Y position
  const rackUnit = Math.max(
    1,
    Math.min(rackHeight, Math.round(mouseY / UNIT_HEIGHT) + 1)
  );

  // Determine X position (full width or half width)
  let snapX = 0;
  if (component.width === 50) {
    // Half-width component - snap to left or right half
    snapX = mouseX > HALF_WIDTH ? HALF_WIDTH : 0;
  } else {
    // Full-width component - always snap to left edge
    snapX = 0;
  }

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

  // Check distance to see if we should snap
  const distance = Math.sqrt(
    Math.pow(mouseX - snapX, 2) + Math.pow(mouseY - snapY, 2)
  );

  if (distance <= SNAP_THRESHOLD) {
    return {
      x: snapX,
      y: snapY,
      rackUnit,
      isOccupied: false,
    };
  }

  return null;
};

export const checkForOverlap = (
  position: RackPosition,
  component: RackComponent,
  existingComponents: RackComponent[],
  excludeId?: string
): boolean => {
  const componentEndUnit = position.rackUnit + component.height - 1;

  return existingComponents.some((existing) => {
    if (excludeId && existing.id === excludeId) return false;
    if (!existing.position) return false;

    const existingEndUnit = existing.position.rackUnit + existing.height - 1;

    // Check vertical overlap
    const verticalOverlap = !(
      componentEndUnit < existing.position.rackUnit ||
      position.rackUnit > existingEndUnit
    );

    if (!verticalOverlap) return false;

    // Check horizontal overlap
    const componentRight =
      position.x +
      (component.width === 100
        ? RACK_CONSTANTS.RACK_WIDTH
        : RACK_CONSTANTS.HALF_WIDTH);
    const existingRight =
      existing.position.x +
      (existing.width === 100
        ? RACK_CONSTANTS.RACK_WIDTH
        : RACK_CONSTANTS.HALF_WIDTH);

    const horizontalOverlap = !(
      componentRight <= existing.position.x || position.x >= existingRight
    );

    return horizontalOverlap;
  });
};

export const generateAvailablePositions = (
  component: RackComponent,
  rackHeight: number,
  existingComponents: RackComponent[]
): SnapPoint[] => {
  const positions: SnapPoint[] = [];

  for (let unit = 1; unit <= rackHeight - component.height + 1; unit++) {
    // Full width position
    const fullWidthPos: RackPosition = {
      x: 0,
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
        x: 0,
        y: (rackHeight - unit) * RACK_CONSTANTS.UNIT_HEIGHT,
        rackUnit: unit,
      };

      const rightHalfPos: RackPosition = {
        x: RACK_CONSTANTS.HALF_WIDTH,
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
  // Check if component fits within rack bounds
  if (
    position.rackUnit < 1 ||
    position.rackUnit + component.height - 1 > rackHeight
  ) {
    return false;
  }

  // Check if X position is valid
  if (component.width === 100 && position.x !== 0) {
    return false;
  }

  if (
    component.width === 50 &&
    position.x !== 0 &&
    position.x !== RACK_CONSTANTS.HALF_WIDTH
  ) {
    return false;
  }

  return true;
};

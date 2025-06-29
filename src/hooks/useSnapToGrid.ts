import { useState, useCallback } from "react";
import { RackComponent, SnapPoint } from "@/types/rack";
import { SnapGuide } from "@/types/design";
import { calculateSnapPosition } from "@/utils/snapHelpers";

export const useSnapToGrid = (rackHeight: number) => {
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  const RACK_UNIT_HEIGHT = 44; // pixels
  // New component area width: total width (720) - ml-14 (56) - mr-6 (24) - px-2 left (8) - px-2 right (8) = 624px
  const COMPONENT_AREA_WIDTH = 624;

  const generateSnapPoints = useCallback((): SnapPoint[] => {
    const points: SnapPoint[] = [];

    for (let unit = 1; unit <= rackHeight; unit++) {
      // Full width positions
      points.push({
        x: 0,
        y: (rackHeight - unit) * RACK_UNIT_HEIGHT,
        rackUnit: unit,
        isOccupied: false, // TODO: Check against existing components
      });

      // Half width positions
      points.push({
        x: COMPONENT_AREA_WIDTH / 2,
        y: (rackHeight - unit) * RACK_UNIT_HEIGHT,
        rackUnit: unit,
        isOccupied: false,
      });
    }

    return points;
  }, [rackHeight]);

  const snapToGrid = useCallback(
    (
      mousePosition: { x: number; y: number; rackUnit?: number },
      component: RackComponent
    ): SnapPoint | null => {
      // If rackUnit is provided, use it directly (for cleaner rack-unit-based snapping)
      if (mousePosition.rackUnit !== undefined) {
        const rackUnit = mousePosition.rackUnit;
        const snapY = (rackHeight - rackUnit) * RACK_UNIT_HEIGHT;
        
        const snapPoint: SnapPoint = {
          x: 0,
          y: snapY,
          rackUnit: rackUnit,
          isOccupied: false,
        };

        // Update snap guides
        const componentHeight = component.height * RACK_UNIT_HEIGHT;
        const componentWidth = component.width === 100 ? COMPONENT_AREA_WIDTH : COMPONENT_AREA_WIDTH / 2;

        const guides: SnapGuide[] = [
          {
            x: 0, // SnapGuides component handles positioning
            y: snapY,
            width: componentWidth,
            height: componentHeight,
            rackUnit: rackUnit,
            visible: true,
          },
        ];

        setSnapGuides(guides);
        return snapPoint;
      }

      // Fallback to old pixel-based calculation
      const snapPoint = calculateSnapPosition(
        mousePosition.x,
        mousePosition.y,
        component,
        rackHeight,
        []
      );

      if (snapPoint) {
        const componentHeight = component.height * RACK_UNIT_HEIGHT;
        const componentWidth = component.width === 100 ? COMPONENT_AREA_WIDTH : COMPONENT_AREA_WIDTH / 2;

        const guides: SnapGuide[] = [
          {
            x: 0,
            y: snapPoint.y,
            width: componentWidth,
            height: componentHeight,
            rackUnit: snapPoint.rackUnit,
            visible: true,
          },
        ];

        setSnapGuides(guides);
      } else {
        setSnapGuides([]);
      }

      return snapPoint;
    },
    [rackHeight]
  );

  const clearSnapGuides = useCallback(() => {
    setSnapGuides([]);
  }, []);

  return {
    snapToGrid,
    getSnapPoints: generateSnapPoints,
    snapGuides,
    clearSnapGuides,
  };
};

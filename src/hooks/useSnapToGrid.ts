import { useState, useCallback } from "react";
import { RackComponent, SnapPoint } from "@/types/rack";
import { SnapGuide } from "@/types/design";

export const useSnapToGrid = (rackHeight: number) => {
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  const RACK_UNIT_HEIGHT = 44; // pixels
  const RACK_WIDTH = 600;
  const SNAP_THRESHOLD = 10; // pixels

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
        x: RACK_WIDTH / 2,
        y: (rackHeight - unit) * RACK_UNIT_HEIGHT,
        rackUnit: unit,
        isOccupied: false,
      });
    }

    return points;
  }, [rackHeight]);

  const snapToGrid = useCallback(
    (
      mousePosition: { x: number; y: number },
      component: RackComponent
    ): SnapPoint | null => {
      const snapPoints = generateSnapPoints();
      const componentHeight = component.height * RACK_UNIT_HEIGHT;

      // Find the closest snap point
      let closestPoint: SnapPoint | null = null;
      let minDistance = Infinity;

      snapPoints.forEach((point) => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - point.x, 2) +
            Math.pow(mousePosition.y - point.y, 2)
        );

        if (distance < minDistance && distance <= SNAP_THRESHOLD) {
          // Check if component fits at this position
          const wouldFit = point.rackUnit + component.height - 1 <= rackHeight;

          if (wouldFit) {
            closestPoint = point;
            minDistance = distance;
          }
        }
      });

      // Update snap guides
      if (closestPoint) {
        const guides: SnapGuide[] = [
          {
            x: closestPoint.x,
            y: closestPoint.y,
            width: component.width === 100 ? RACK_WIDTH : RACK_WIDTH / 2,
            height: componentHeight,
            visible: true,
          },
        ];

        setSnapGuides(guides);
      } else {
        setSnapGuides([]);
      }

      return closestPoint;
    },
    [generateSnapPoints, rackHeight]
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

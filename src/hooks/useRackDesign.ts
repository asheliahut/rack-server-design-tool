import { useState, useCallback } from "react";
import { RackDesign, RackComponent, RackPosition } from "@/types/rack";

export const useRackDesign = () => {
  const [currentDesign, setCurrentDesign] = useState<RackDesign>({
    id: "default",
    name: "New Rack Design",
    rackHeight: 42,
    components: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [selectedComponent, setSelectedComponent] =
    useState<RackComponent | null>(null);

  const addComponent = useCallback(
    (component: RackComponent, position: RackPosition) => {
      const newComponent: RackComponent = {
        ...component,
        id: `${component.id}-${Date.now()}`, // Ensure unique ID
        position,
      };

      setCurrentDesign((prev) => ({
        ...prev,
        components: [...prev.components, newComponent],
        updatedAt: new Date(),
      }));
    },
    []
  );

  const moveComponent = useCallback(
    (componentId: string, newPosition: RackPosition) => {
      setCurrentDesign((prev) => ({
        ...prev,
        components: prev.components.map((comp) =>
          comp.id === componentId ? { ...comp, position: newPosition } : comp
        ),
        updatedAt: new Date(),
      }));
    },
    []
  );

  const removeComponent = useCallback((componentId: string) => {
    setCurrentDesign((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
      updatedAt: new Date(),
    }));
  }, []);

  const updateComponent = useCallback(
    (componentId: string, updates: Partial<RackComponent>) => {
      setCurrentDesign((prev) => ({
        ...prev,
        components: prev.components.map((comp) =>
          comp.id === componentId ? { ...comp, ...updates } : comp
        ),
        updatedAt: new Date(),
      }));
    },
    []
  );

  const clearDesign = useCallback(() => {
    setCurrentDesign((prev) => ({
      ...prev,
      components: [],
      updatedAt: new Date(),
    }));
    setSelectedComponent(null);
  }, []);

  const loadDesign = useCallback((design: RackDesign) => {
    setCurrentDesign(design);
    setSelectedComponent(null);
  }, []);

  const exportDesign = useCallback(() => {
    return {
      ...currentDesign,
      exportedAt: new Date(),
    };
  }, [currentDesign]);

  const isPositionOccupied = useCallback(
    (position: RackPosition, excludeId?: string): boolean => {
      return currentDesign.components.some((comp) => {
        if (excludeId && comp.id === excludeId) return false;

        if (!comp.position) return false;

        const compStartUnit = comp.position.rackUnit;
        const compEndUnit = compStartUnit + comp.height - 1;
        const targetStartUnit = position.rackUnit;

        // Check for vertical overlap
        const verticalOverlap =
          targetStartUnit >= compStartUnit && targetStartUnit <= compEndUnit;

        // Check for horizontal overlap (same X position or overlapping widths)
        const horizontalOverlap = Math.abs(comp.position.x - position.x) < 300; // Half rack width

        return verticalOverlap && horizontalOverlap;
      });
    },
    [currentDesign.components]
  );

  return {
    currentDesign,
    selectedComponent,
    setSelectedComponent,
    addComponent,
    moveComponent,
    removeComponent,
    updateComponent,
    clearDesign,
    loadDesign,
    exportDesign,
    isPositionOccupied,
  };
};

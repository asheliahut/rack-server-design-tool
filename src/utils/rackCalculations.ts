import { RackComponent, RackDesign } from "@/types/rack";

export interface RackStats {
  totalComponents: number;
  usedUnits: number;
  availableUnits: number;
  utilizationPercentage: number;
  totalPower: number;
  totalWeight: number;
  componentsByCategory: Record<string, number>;
}

export const calculateRackStats = (design: RackDesign): RackStats => {
  const stats: RackStats = {
    totalComponents: design.components.length,
    usedUnits: 0,
    availableUnits: design.rackHeight,
    utilizationPercentage: 0,
    totalPower: 0,
    totalWeight: 0,
    componentsByCategory: {},
  };

  design.components.forEach((component) => {
    // Calculate used rack units
    stats.usedUnits += component.height;

    // Calculate total power consumption
    if (component.specifications.power) {
      const powerValue = parseFloat(
        component.specifications.power.replace(/[^\d.]/g, "")
      );
      if (!isNaN(powerValue)) {
        stats.totalPower += powerValue;
      }
    }

    // Calculate total weight
    if (component.specifications.weight) {
      const weightValue = parseFloat(
        component.specifications.weight.replace(/[^\d.]/g, "")
      );
      if (!isNaN(weightValue)) {
        stats.totalWeight += weightValue;
      }
    }

    // Count components by category
    stats.componentsByCategory[component.category] =
      (stats.componentsByCategory[component.category] || 0) + 1;
  });

  stats.availableUnits = design.rackHeight - stats.usedUnits;
  stats.utilizationPercentage = (stats.usedUnits / design.rackHeight) * 100;

  return stats;
};

export const calculatePowerDistribution = (
  components: RackComponent[]
): {
  byCategory: Record<string, number>;
  total: number;
  maxComponent: { component: RackComponent; power: number } | null;
} => {
  const distribution: Record<string, number> = {};
  let total = 0;
  let maxComponent: { component: RackComponent; power: number } | null = null;

  components.forEach((component) => {
    if (component.specifications.power) {
      const powerValue = parseFloat(
        component.specifications.power.replace(/[^\d.]/g, "")
      );
      if (!isNaN(powerValue)) {
        distribution[component.category] =
          (distribution[component.category] || 0) + powerValue;
        total += powerValue;

        if (!maxComponent || powerValue > maxComponent.power) {
          maxComponent = { component, power: powerValue };
        }
      }
    }
  });

  return { byCategory: distribution, total, maxComponent };
};

export const findOptimalPositions = (
  components: RackComponent[],
  rackHeight: number
): Array<{
  component: RackComponent;
  suggestedUnit: number;
  reason: string;
}> => {
  const suggestions: Array<{
    component: RackComponent;
    suggestedUnit: number;
    reason: string;
  }> = [];

  // Sort components by weight (heaviest first for bottom placement)
  const sortedByWeight = [...components].sort((a, b) => {
    const weightA = parseFloat(
      a.specifications.weight?.replace(/[^\d.]/g, "") || "0"
    );
    const weightB = parseFloat(
      b.specifications.weight?.replace(/[^\d.]/g, "") || "0"
    );
    return weightB - weightA;
  });

  let currentUnit = rackHeight; // Start from bottom

  sortedByWeight.forEach((component) => {
    if (currentUnit - component.height + 1 >= 1) {
      let reason = "Optimal placement";

      // Heavy components at bottom
      if (
        component.specifications.weight &&
        parseFloat(component.specifications.weight.replace(/[^\d.]/g, "")) > 20
      ) {
        reason = "Heavy component - bottom placement for stability";
      }

      // Servers in middle
      if (component.category === "server") {
        reason = "Server placement for accessibility";
      }

      // Network equipment at top
      if (component.category === "network") {
        reason = "Network equipment - top placement for cable management";
      }

      suggestions.push({
        component,
        suggestedUnit: currentUnit - component.height + 1,
        reason,
      });

      currentUnit -= component.height;
    }
  });

  return suggestions;
};

export const validateRackDesign = (
  design: RackDesign
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for overlapping components
  const positions = design.components
    .filter((c) => c.position)
    .map((c) => ({
      component: c,
      startUnit: c.position!.rackUnit,
      endUnit: c.position!.rackUnit + c.height - 1,
    }));

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];

      // Check for vertical overlap
      if (!(pos1.endUnit < pos2.startUnit || pos1.startUnit > pos2.endUnit)) {
        // Check for horizontal overlap
        const comp1X = pos1.component.position!.x;
        const comp2X = pos2.component.position!.x;
        const comp1Width = pos1.component.width === 100 ? 600 : 300;
        const comp2Width = pos2.component.width === 100 ? 600 : 300;

        if (!(comp1X + comp1Width <= comp2X || comp2X + comp2Width <= comp1X)) {
          errors.push(
            `Components "${pos1.component.name}" and "${pos2.component.name}" overlap`
          );
        }
      }
    }
  }

  // Check for components outside rack bounds
  design.components.forEach((component) => {
    if (component.position) {
      if (component.position.rackUnit < 1) {
        errors.push(
          `Component "${component.name}" is positioned below rack (unit ${component.position.rackUnit})`
        );
      }

      if (
        component.position.rackUnit + component.height - 1 >
        design.rackHeight
      ) {
        errors.push(`Component "${component.name}" extends beyond rack height`);
      }
    }
  });

  // Power consumption warnings
  const stats = calculateRackStats(design);
  if (stats.totalPower > 3000) {
    warnings.push(
      `High power consumption: ${stats.totalPower}W. Consider power distribution.`
    );
  }

  // Weight distribution warnings
  if (stats.totalWeight > 500) {
    warnings.push(
      `High total weight: ${stats.totalWeight}kg. Verify rack load capacity.`
    );
  }

  // Utilization warnings
  if (stats.utilizationPercentage > 90) {
    warnings.push(
      `Very high rack utilization: ${stats.utilizationPercentage.toFixed(1)}%`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const generateCoolingRecommendations = (
  design: RackDesign
): string[] => {
  const recommendations: string[] = [];
  const stats = calculateRackStats(design);

  // High power density
  if (stats.totalPower > 2000) {
    recommendations.push("Consider additional cooling for high power density");
  }

  // Server placement
  const serversCount = stats.componentsByCategory["server"] || 0;
  if (serversCount > 5) {
    recommendations.push(
      "Multiple servers detected - ensure adequate airflow separation"
    );
  }

  // Check for cooling components
  const coolingComponents = design.components.filter(
    (c) => c.category === "cooling"
  );
  if (coolingComponents.length === 0 && stats.totalPower > 1000) {
    recommendations.push(
      "No cooling components found - consider adding fans or cooling units"
    );
  }

  return recommendations;
};

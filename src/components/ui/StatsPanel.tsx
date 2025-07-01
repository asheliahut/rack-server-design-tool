import { useDrop } from 'react-dnd';
import { ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from './IconButton';
import { StatsGrid } from './ResponsiveGrid';
import { DragItem } from '@/types/design';
import { RackDesign } from '@/types/rack';

interface RackStats {
  utilizationPercentage: number;
  usedUnits: number;
  totalPower: number;
  totalWeight: number;
  totalComponents: number;
}

interface StatsPanelProps {
  rackStats: RackStats;
  currentDesign: RackDesign;
  removeComponent: (id: string) => void;
  isLibraryCollapsed: boolean;
  setIsLibraryCollapsed: (collapsed: boolean) => void;
}

interface StatItemProps {
  label: string;
  value: string | number;
  color: string;
  responsive?: boolean;
}

function StatItem({ label, value, color, responsive = true }: StatItemProps) {
  return (
    <div className={cn(
      'flex items-center',
      responsive ? 'flex-row gap-1' : 'flex-row gap-1'
    )}>
      <span className={cn(
        'font-medium text-gray-900 dark:text-gray-100',
        responsive ? 'text-sm' : 'text-sm'
      )}>
        {label}:
      </span>
      <span className={cn('font-semibold text-sm', color)}>
        {value}
      </span>
    </div>
  );
}

export function StatsPanel({
  rackStats,
  currentDesign,
  removeComponent,
  isLibraryCollapsed,
  setIsLibraryCollapsed,
}: StatsPanelProps) {
  // Set up drop area for stats panel to remove components on mobile
  const [{ isStatsDropOver, canStatsDropRemove }, statsDropRef] = useDrop<
    DragItem,
    void,
    { isStatsDropOver: boolean; canStatsDropRemove: boolean }
  >({
    accept: 'component',
    drop: (item) => {
      // Only remove if the item has a sourcePosition (meaning it's from the rack)
      if (item.sourcePosition) {
        removeComponent(item.component.id);
      }
    },
    collect: (monitor) => ({
      isStatsDropOver: monitor.isOver(),
      canStatsDropRemove: monitor.canDrop() && !!monitor.getItem()?.sourcePosition,
    }),
  });

  return (
    <div className="flex">
      {/* Collapsed Library Button */}
      {isLibraryCollapsed && (
        <div className="hidden lg:block w-12 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 border-b border-gray-200 dark:border-gray-700 px-3 py-3 sm:px-4 sm:py-3 transition-colors">
          <IconButton
            onClick={() => setIsLibraryCollapsed(false)}
            title="Expand Component Library"
            aria-label="Expand Component Library"
            variant="ghost"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </IconButton>
        </div>
      )}

      {/* Stats Panel */}
      <div
        ref={statsDropRef as unknown as React.Ref<HTMLDivElement>}
        id="stats-panel"
        className={cn(
          'flex-1 border-b border-gray-200 dark:border-gray-700 px-3 py-3 sm:px-4 sm:py-3 transition-colors relative',
          isStatsDropOver && canStatsDropRemove
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600'
            : 'bg-white dark:bg-gray-800'
        )}
      >
        {/* Drop Indicator for Mobile */}
        {isStatsDropOver && canStatsDropRemove && (
          <div className="lg:hidden absolute inset-0 bg-red-50 dark:bg-red-900/50 border-2 border-dashed border-red-400 dark:border-red-500 rounded-md flex items-center justify-center">
            <div className="text-red-700 dark:text-red-300 font-medium text-sm flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Drop here to remove component
            </div>
          </div>
        )}

        <StatsGrid>
          <StatItem
            label="Utilization"
            value={`${rackStats.utilizationPercentage.toFixed(1)}%`}
            color="text-blue-600 dark:text-blue-400"
          />
          <StatItem
            label="Used Units"
            value={`${rackStats.usedUnits}/${currentDesign?.rackHeight}U`}
            color="text-green-600 dark:text-green-400"
          />
          <StatItem
            label="Power"
            value={`${rackStats.totalPower}W`}
            color="text-orange-600 dark:text-orange-400"
          />
          <StatItem
            label="Weight"
            value={`${rackStats.totalWeight.toFixed(1)}kg`}
            color="text-purple-600 dark:text-purple-400"
          />
          <StatItem
            label="Components"
            value={rackStats.totalComponents}
            color="text-gray-600 dark:text-gray-400"
          />
        </StatsGrid>
      </div>
    </div>
  );
}
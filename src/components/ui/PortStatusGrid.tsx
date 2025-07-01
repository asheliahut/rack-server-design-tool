import { PortLabel } from '@/types/rack';
import { cn } from '@/utils/cn';
import { StatusIndicator } from './StatusIndicator';

interface PortStatusGridProps {
  totalPorts: number;
  portLabels?: PortLabel[];
  onPortClick?: (portNumber: number) => void;
  className?: string;
  showLegend?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    port: 'w-5 h-5 sm:w-4 sm:h-4 md:w-3 md:h-3 text-xs',
    legend: 'text-xs',
  },
  md: {
    port: 'w-6 h-6 sm:w-5 sm:h-5 md:w-4 md:h-4 text-xs',
    legend: 'text-xs',
  },
  lg: {
    port: 'w-8 h-8 sm:w-7 sm:h-7 md:w-6 md:h-6 text-sm',
    legend: 'text-sm',
  },
};

export function PortStatusGrid({
  totalPorts,
  portLabels = [],
  onPortClick,
  className,
  showLegend = true,
  size = 'md',
}: PortStatusGridProps) {
  const sizeStyle = sizeClasses[size];

  const getPortStatus = (portNumber: number) => {
    const portLabel = portLabels.find(pl => pl.portNumber === portNumber);
    return portLabel && portLabel.label.trim() !== '';
  };

  const getPortTooltip = (portNumber: number) => {
    const portLabel = portLabels.find(pl => pl.portNumber === portNumber);
    if (portLabel && portLabel.label.trim() !== '') {
      return `Port ${portNumber}: ${portLabel.label}${
        portLabel.description ? ` - ${portLabel.description}` : ''
      }`;
    }
    return `Port ${portNumber}: ${onPortClick ? 'Click to add label' : 'Unlabeled'}`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {showLegend && (
        <div className="flex items-center justify-between">
          <span className={cn('font-medium text-gray-700 dark:text-gray-300', sizeStyle.legend)}>
            Port Status
          </span>
          <div className={cn('flex items-center space-x-3', sizeStyle.legend)}>
            <div className="flex items-center space-x-1">
              <StatusIndicator status="success" size="sm" />
              <span className="text-gray-600 dark:text-gray-400">Labeled</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIndicator status="neutral" size="sm" />
              <span className="text-gray-600 dark:text-gray-400">Empty</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {Array.from({ length: totalPorts }, (_, i) => {
            const portNumber = i + 1;
            const hasLabel = getPortStatus(portNumber);
            const tooltip = getPortTooltip(portNumber);
            
            return (
              <button
                key={portNumber}
                onClick={() => onPortClick?.(portNumber)}
                disabled={!onPortClick}
                className={cn(
                  'rounded flex items-center justify-center border transition-colors',
                  sizeStyle.port,
                  hasLabel
                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 dark:bg-green-600 dark:border-green-500 dark:hover:bg-green-700'
                    : 'bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500',
                  onPortClick && 'cursor-pointer',
                  !onPortClick && 'cursor-help'
                )}
                title={tooltip}
                aria-label={tooltip}
              >
                {portNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
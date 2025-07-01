import { cn } from '@/utils/cn';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

interface StatusBadgeProps extends StatusIndicatorProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outline' | 'subtle';
}

const statusColors = {
  success: {
    dot: 'bg-green-500',
    filled: 'bg-green-500 text-white',
    outline: 'border-green-500 text-green-700 dark:text-green-400',
    subtle: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  warning: {
    dot: 'bg-yellow-500',
    filled: 'bg-yellow-500 text-white',
    outline: 'border-yellow-500 text-yellow-700 dark:text-yellow-400',
    subtle: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  error: {
    dot: 'bg-red-500',
    filled: 'bg-red-500 text-white',
    outline: 'border-red-500 text-red-700 dark:text-red-400',
    subtle: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  info: {
    dot: 'bg-blue-500',
    filled: 'bg-blue-500 text-white',
    outline: 'border-blue-500 text-blue-700 dark:text-blue-400',
    subtle: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  neutral: {
    dot: 'bg-gray-400',
    filled: 'bg-gray-500 text-white',
    outline: 'border-gray-400 text-gray-700 dark:text-gray-300',
    subtle: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  },
};

const sizeClasses = {
  sm: {
    dot: 'w-2 h-2',
    badge: 'px-2 py-1 text-xs',
  },
  md: {
    dot: 'w-3 h-3',
    badge: 'px-2.5 py-1.5 text-sm',
  },
  lg: {
    dot: 'w-4 h-4',
    badge: 'px-3 py-2 text-base',
  },
};

export function StatusIndicator({ 
  status, 
  size = 'md', 
  className, 
  animate = false 
}: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        'rounded-full',
        statusColors[status].dot,
        sizeClasses[size].dot,
        animate && 'animate-pulse',
        className
      )}
    />
  );
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  variant = 'subtle', 
  children, 
  className,
  animate = false 
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        statusColors[status][variant],
        sizeClasses[size].badge,
        animate && 'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  );
}
import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  variant?: 'default' | 'bordered' | 'minimal';
}

const variantClasses = {
  default: {
    container: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
    header: 'p-4 border-b border-gray-200 dark:border-gray-700',
    content: 'p-4',
  },
  bordered: {
    container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
    header: 'p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50',
    content: 'p-3',
  },
  minimal: {
    container: '',
    header: 'py-2',
    content: 'pt-2',
  },
};

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  onToggle,
  disabled = false,
  icon,
  badge,
  className,
  contentClassName,
  headerClassName,
  variant = 'default',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (disabled) return;
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const variantStyle = variantClasses[variant];

  return (
    <div className={cn(variantStyle.container, className)}>
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between text-left transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-700/50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyle.header,
          headerClassName
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {badge && (
            <div className="flex-shrink-0">
              {badge}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className={cn(variantStyle.content, contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number | string;
  className?: string;
}

function generateGridClasses(cols: ResponsiveGridProps['cols']) {
  const classes = [];
  
  if (cols?.base) classes.push(`grid-cols-${cols.base}`);
  if (cols?.sm) classes.push(`sm:grid-cols-${cols.sm}`);
  if (cols?.md) classes.push(`md:grid-cols-${cols.md}`);
  if (cols?.lg) classes.push(`lg:grid-cols-${cols.lg}`);
  if (cols?.xl) classes.push(`xl:grid-cols-${cols.xl}`);
  
  return classes.join(' ');
}

function generateGapClass(gap: number | string | undefined) {
  if (typeof gap === 'number') {
    return `gap-${gap}`;
  }
  if (typeof gap === 'string') {
    return gap;
  }
  return 'gap-4'; // default
}

export function ResponsiveGrid({ 
  children, 
  cols = { base: 1, sm: 2, lg: 3 }, 
  gap = 4,
  className 
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        'grid',
        generateGridClasses(cols),
        generateGapClass(gap),
        className
      )}
    >
      {children}
    </div>
  );
}

// Common presets for frequently used grid layouts
export function StatsGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 sm:grid-cols-5 gap-2',
        className
      )}
    >
      {children}
    </div>
  );
}

export function ComponentGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      gap={3}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function PortGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      cols={{ base: 12 }}
      gap={1}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}
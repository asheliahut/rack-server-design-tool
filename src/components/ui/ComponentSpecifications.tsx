import { ComponentSpecs } from '@/types/rack';
import { cn } from '@/utils/cn';

interface ComponentSpecificationsProps {
  specifications: ComponentSpecs;
  className?: string;
  layout?: 'grid' | 'list' | 'flow';
  showTitle?: boolean;
}

interface SpecificationItemProps {
  label: string;
  value: string;
  layout: 'grid' | 'list' | 'flow';
}

function SpecificationItem({ label, value, layout }: SpecificationItemProps) {
  if (layout === 'list') {
    return (
      <div className="space-y-1">
        <span className="text-gray-600 dark:text-gray-400 block">{label}:</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{value}</span>
      </div>
    );
  }

  if (layout === 'flow') {
    return (
      <div className="inline-flex items-center bg-gray-50 dark:bg-gray-700 rounded px-2 py-1 mr-2 mb-2">
        <span className="text-gray-600 dark:text-gray-400 text-xs">{label}:</span>
        <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 text-xs">{value}</span>
      </div>
    );
  }

  return (
    <div>
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

export function ComponentSpecifications({
  specifications,
  className,
  layout = 'flow',
  showTitle = true,
}: ComponentSpecificationsProps) {
  const specs = [
    { key: 'manufacturer', label: 'Manufacturer', value: specifications.manufacturer },
    { key: 'model', label: 'Model', value: specifications.model },
    ...(specifications.power ? [{ key: 'power', label: 'Power', value: specifications.power }] : []),
    ...(specifications.weight ? [{ key: 'weight', label: 'Weight', value: specifications.weight }] : []),
    ...(specifications.capacity ? [{ key: 'capacity', label: 'Capacity', value: specifications.capacity }] : []),
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {showTitle && (
        <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          Specifications
        </h5>
      )}
      <div
        className={cn(
          'text-xs',
          layout === 'list' && 'space-y-1',
          layout === 'grid' && 'grid grid-cols-2 gap-2',
          layout === 'flow' && 'flex flex-wrap'
        )}
      >
        {specs.map((spec) => (
          <SpecificationItem
            key={spec.key}
            label={spec.label}
            value={spec.value}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}
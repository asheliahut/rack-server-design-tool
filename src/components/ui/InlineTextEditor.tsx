import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from './IconButton';
import { Input } from './Input';

interface InlineTextEditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
  validation?: (value: string) => string | null;
}

export function InlineTextEditor({
  value,
  onSave,
  onCancel,
  placeholder = 'Enter text',
  className,
  autoFocus = true,
  maxLength,
  validation,
}: InlineTextEditorProps) {
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    
    if (validation) {
      const validationError = validation(trimmedValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    onSave(trimmedValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    onCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const canSave = editValue.trim() !== '' && editValue !== value && !error;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Input
        ref={inputRef}
        value={editValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        error={error || undefined}
        variant="default"
        className="flex-1"
      />
      <IconButton
        onClick={handleSave}
        disabled={!canSave}
        variant="default"
        size="sm"
        title="Save"
        aria-label="Save changes"
      >
        <Check className="w-4 h-4" />
      </IconButton>
      <IconButton
        onClick={handleCancel}
        variant="outline"
        size="sm"
        title="Cancel"
        aria-label="Cancel changes"
      >
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  );
}
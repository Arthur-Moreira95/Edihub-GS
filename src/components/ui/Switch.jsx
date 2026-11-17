import { useId } from 'react';
import { cn } from '../../lib/cn.js';

export function Switch({ checked, onChange, label, description, icon: Icon }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />}
        <span>
          <span className="block text-sm font-medium text-ink">{label}</span>
          {description && <span className="block text-xs text-muted">{description}</span>}
        </span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-action' : 'bg-line-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </div>
  );
}

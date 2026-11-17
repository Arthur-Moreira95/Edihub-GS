import { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn.js';

export const inputClasses =
  'w-full rounded-lg border border-line-strong bg-base px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

export const Field = forwardRef(function Field({ label, hint, error, className, ...props }, ref) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-desc` : undefined}
        className={cn(inputClasses, error && 'border-danger focus:border-danger focus:ring-danger/30')}
        {...props}
      />
      {(error || hint) && (
        <p id={`${id}-desc`} className={cn('mt-1.5 text-xs', error ? 'text-danger-ink' : 'text-faint')}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

import { cn } from '../../lib/cn.js';

/** Grupo de opções exclusivas (ex.: Mensal / Semestral, Grade / Lista). */
export function SegmentedControl({ options, value, onChange, label, className }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-lg bg-raised p-1', className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.ariaLabel}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active ? 'bg-surface text-ink shadow' : 'text-muted hover:text-ink',
            )}
          >
            {Icon && <Icon className="size-4" aria-hidden />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

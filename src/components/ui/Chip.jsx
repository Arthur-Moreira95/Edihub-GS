import { cn } from '../../lib/cn.js';

/** Pílula de filtro com estado ligado/desligado. */
export function Chip({ active, onClick, children, count, className, color }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-line-strong bg-surface text-ink-soft hover:border-hover-line hover:bg-hover-soft hover:text-ink',
        className,
      )}
    >
      {color && <span className="size-2 rounded-full" style={{ background: color }} aria-hidden />}
      {children}
      {count != null && (
        <span className={cn('tabular text-xs', active ? 'text-primary-mist' : 'text-faint')}>{count}</span>
      )}
    </button>
  );
}

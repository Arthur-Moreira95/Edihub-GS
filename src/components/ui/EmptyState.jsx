import { cn } from '../../lib/cn.js';

export function EmptyState({ icon: Icon, title, children, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center',
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 grid size-12 place-items-center rounded-full bg-raised text-primary-soft">
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      <h3 className="font-semibold text-ink">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

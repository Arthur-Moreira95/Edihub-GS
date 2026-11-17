import { STATUS } from '../../data/constants.js';
import { cn } from '../../lib/cn.js';

const TONES = {
  action: 'bg-action/15 text-action-strong ring-action/30',
  alert: 'bg-alert/15 text-alert-soft ring-alert/30',
  rectify: 'bg-rectify/15 text-rectify-ink ring-rectify/30',
  primary: 'bg-primary/15 text-primary-soft ring-primary/30',
  school: 'bg-school/15 text-school-soft ring-school/30',
  danger: 'bg-danger/15 text-danger-ink ring-danger/30',
  neutral: 'bg-raised text-ink-soft ring-line-strong',
  outline: 'bg-transparent text-muted ring-line-strong',
};

export function Badge({ tone = 'neutral', className, children, icon: Icon }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

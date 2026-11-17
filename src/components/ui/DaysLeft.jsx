import { urgencyTone } from '../../lib/edital.js';
import { cn } from '../../lib/cn.js';

const TONES = {
  danger: 'text-danger-ink bg-danger/15',
  alert: 'text-alert-soft bg-alert/15',
  primary: 'text-primary-soft bg-primary/15',
  neutral: 'text-ink-soft bg-raised',
};

export function daysLabel(dias) {
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  return `${dias} dias`;
}

/** Pílula com os dias restantes, colorida pela urgência. */
export function DaysLeft({ dias, className }) {
  return (
    <span
      className={cn(
        'tabular inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold',
        TONES[urgencyTone(dias)],
        className,
      )}
    >
      {daysLabel(dias)}
    </span>
  );
}

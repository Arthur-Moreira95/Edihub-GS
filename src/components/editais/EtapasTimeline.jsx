import { Check } from 'lucide-react';
import { getCurrentEtapaIndex } from '../../lib/edital.js';
import { formatRange, relativeDays } from '../../lib/dates.js';
import { cn } from '../../lib/cn.js';

/** Linha do tempo das etapas do certame: concluídas, atual e futuras. */
export function EtapasTimeline({ etapas, previsao = false }) {
  const atual = getCurrentEtapaIndex(etapas);

  return (
    <ol className="relative">
      {etapas.map((et, i) => {
        const done = i < atual;
        const current = i === atual;
        return (
          <li key={et.key} className="relative flex gap-4 pb-5 last:pb-0">
            {i < etapas.length - 1 && (
              <span
                aria-hidden
                className={cn('absolute top-6 bottom-0 left-[11px] w-px', done ? 'bg-action/60' : 'bg-line-strong')}
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold',
                done && 'border-action bg-action text-white',
                current && 'border-primary bg-primary text-white ring-4 ring-primary/25',
                !done && !current && 'border-line-strong bg-surface text-faint',
                previsao && !done && 'border-dashed',
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <div className={cn('min-w-0 flex-1', !done && !current && 'text-muted')}>
              <p className={cn('text-sm', current ? 'font-semibold text-ink' : 'font-medium')}>
                {et.label}
                {done && <span className="sr-only"> (concluída)</span>}
                {current && <span className="sr-only"> (etapa atual)</span>}
              </p>
              <p className="tabular text-xs text-muted">
                {formatRange(et.inicio, et.fim)}
                {!done && (
                  <span className="text-faint"> · {relativeDays(et.periodo && current ? et.fim : et.inicio)}</span>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

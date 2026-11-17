import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { dayKey, isSameDay, today } from '../../lib/dates.js';
import { cn } from '../../lib/cn.js';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function buildMonth(cursor) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** Grade mensal com os eventos de cada dia. `direction` anima a troca de mês. */
export function MonthGrid({ cursor, eventsByDay, selected, onSelect, direction }) {
  const root = useRef(null);
  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const hoje = today();

  useGSAP(
    () => {
      if (!direction) return;
      gsap.from('[data-cell]', { x: direction * 14, autoAlpha: 0, duration: 0.3, stagger: 0.006 });
    },
    { scope: root, dependencies: [cursor.getTime()], revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      <div className="grid grid-cols-7 border-b border-line pb-2 text-center text-xs font-medium text-muted">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div
        className="grid grid-cols-7 gap-px overflow-hidden rounded-b-xl bg-line"
        role="grid"
        aria-label="Dias do mês"
      >
        {days.map((d) => {
          const key = dayKey(d);
          const evs = eventsByDay.get(key) ?? [];
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = isSameDay(d, hoje);
          const isSelected = isSameDay(d, selected);
          const hasPrazo = evs.some((e) => e.prazo);
          return (
            <button
              key={key}
              data-cell
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`${d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}, ${evs.length} ${evs.length === 1 ? 'evento' : 'eventos'}`}
              onClick={() => onSelect(d)}
              className={cn(
                'relative flex min-h-16 flex-col items-start gap-1 bg-surface p-1.5 text-left transition-colors sm:min-h-24 sm:p-2',
                !inMonth && 'bg-base text-faint',
                isSelected ? 'bg-raised ring-2 ring-primary ring-inset' : 'hover:bg-hover-soft',
              )}
            >
              <span
                className={cn(
                  'tabular grid size-6 place-items-center rounded-full text-xs font-semibold',
                  isToday ? 'bg-primary text-white' : inMonth ? 'text-ink-soft' : 'text-faint',
                )}
              >
                {d.getDate()}
              </span>
              {/* telas pequenas: só pontos */}
              <span className="flex flex-wrap gap-0.5 sm:hidden">
                {evs.slice(0, 4).map((ev) => (
                  <span key={ev.id} className="size-1.5 rounded-full" style={{ background: ev.cor }} />
                ))}
              </span>
              <span className="hidden w-full flex-col gap-0.5 sm:flex">
                {evs.slice(0, 2).map((ev) => (
                  <span
                    key={ev.id}
                    className="truncate rounded px-1.5 py-0.5 text-[11px] leading-tight font-medium text-white"
                    style={{ background: `color-mix(in oklab, ${ev.cor} var(--event-tint), #0f172a)` }}
                  >
                    {ev.edital.sigla}
                  </span>
                ))}
                {evs.length > 2 && <span className="px-1 text-[11px] text-muted">+{evs.length - 2}</span>}
              </span>
              {hasPrazo && inMonth && (
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-alert" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

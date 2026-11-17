import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useEditalParam } from '../../hooks/useEditalParam.js';
import { getEventos } from '../../lib/edital.js';
import { daysUntil, formatShort, formatWeekday } from '../../lib/dates.js';
import { Button } from '../ui/Button.jsx';
import { DaysLeft } from '../ui/DaysLeft.jsx';
import { FollowButton } from '../editais/FollowButton.jsx';

/** Prazos dos próximos 7 dias em todos os editais. */
export function WeekDeadlines() {
  const { editais } = useApp();
  const { openEdital } = useEditalParam();

  const eventos = useMemo(
    () =>
      getEventos(editais).filter((ev) => {
        const d = daysUntil(ev.data);
        return d >= 0 && d <= 7;
      }),
    [editais],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="semana-titulo">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="semana-titulo" className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Próximos 7 dias
          </h2>
          <p className="mt-2 text-muted">{eventos.length} datas em todos os editais monitorados.</p>
        </div>
        <Button variant="outline" to="/calendario">
          <CalendarDays className="size-4" aria-hidden />
          Abrir calendário
        </Button>
      </div>

      <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {eventos.map((ev) => (
          <li
            key={ev.id}
            className="relative grid grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-3.5 sm:gap-4 hover:bg-hover-soft sm:grid-cols-[8rem_1fr_auto_auto] sm:px-6"
          >
            <time
              dateTime={ev.data.toISOString()}
              className="tabular text-sm font-medium text-ink-soft first-letter:uppercase"
            >
              {/* celular: dia da semana em cima e data curta embaixo; desktop: "Ter, 17 de nov." */}
              <span className="flex flex-col leading-tight sm:hidden">
                <span className="text-xs text-muted first-letter:uppercase">{formatWeekday(ev.data).split(',')[0]}</span>
                <span>{formatShort(ev.data)}</span>
              </span>
              <span className="hidden sm:inline">{formatWeekday(ev.data)}</span>
            </time>
            <div className="flex min-w-0 items-center gap-3">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: ev.cor }} aria-hidden />
              <button
                type="button"
                onClick={() => openEdital(ev.edital.id)}
                className="min-w-0 text-left after:absolute after:inset-0"
              >
                <span className="block truncate text-sm font-semibold text-ink">{ev.edital.nome}</span>
                <span className="block truncate text-sm text-muted">{ev.titulo}</span>
              </button>
            </div>
            <span className="hidden sm:block">
              <DaysLeft dias={daysUntil(ev.data)} />
            </span>
            <FollowButton edital={ev.edital} className="relative z-10" />
          </li>
        ))}
      </ol>
    </section>
  );
}

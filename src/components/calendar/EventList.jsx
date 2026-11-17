import { useEditalParam } from '../../hooks/useEditalParam.js';
import { daysUntil, formatWeekday } from '../../lib/dates.js';
import { DaysLeft } from '../ui/DaysLeft.jsx';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';

/** Lista de eventos (do dia ou do mês). */
export function EventList({ eventos, showDate = false, empty }) {
  const { openEdital } = useEditalParam();
  if (!eventos.length) return <p className="py-6 text-sm text-muted">{empty}</p>;

  return (
    <ul className="divide-y divide-line">
      {eventos.map((ev) => {
        const dias = daysUntil(ev.data);
        return (
          <li key={ev.id}>
            <button
              type="button"
              onClick={() => openEdital(ev.edital.id)}
              className="flex w-full items-center gap-3 py-3 text-left hover:opacity-90"
            >
              <InstitutionMark edital={ev.edital} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{ev.edital.nome}</span>
                <span className="block truncate text-xs text-muted">
                  {showDate && <span className="first-letter:uppercase">{formatWeekday(ev.data)} · </span>}
                  {ev.titulo}
                </span>
              </span>
              {dias >= 0 ? <DaysLeft dias={dias} /> : <span className="text-xs text-faint">passou</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

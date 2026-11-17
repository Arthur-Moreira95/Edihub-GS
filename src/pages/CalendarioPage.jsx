import { useMemo, useState } from 'react';
import { BellRing, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getEventos } from '../lib/edital.js';
import { dayKey, formatMonth, formatWeekday, isSameDay, today } from '../lib/dates.js';
import { MonthGrid } from '../components/calendar/MonthGrid.jsx';
import { EventList } from '../components/calendar/EventList.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Switch } from '../components/ui/Switch.jsx';

export default function CalendarioPage() {
  const { editais, followed } = useApp();
  const [cursor, setCursor] = useState(() => {
    const t = today();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [direction, setDirection] = useState(0);
  const [selected, setSelected] = useState(today);
  const [onlyFollowed, setOnlyFollowed] = useState(false);

  const eventos = useMemo(() => {
    const base = onlyFollowed ? editais.filter((e) => followed.includes(e.id)) : editais;
    return getEventos(base);
  }, [editais, followed, onlyFollowed]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of eventos) {
      const k = dayKey(ev.data);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(ev);
    }
    return map;
  }, [eventos]);

  // Do mês exibido: próximas datas primeiro, as que já passaram no fim
  const doMes = eventos
    .filter((ev) => ev.data.getMonth() === cursor.getMonth() && ev.data.getFullYear() === cursor.getFullYear())
    .sort((a, b) => Number(a.data < today()) - Number(b.data < today()) || a.data - b.data);
  const doDia = eventsByDay.get(dayKey(selected)) ?? [];

  const go = (delta) => {
    setDirection(delta);
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };
  const goToday = () => {
    const t = today();
    setDirection(t < cursor ? -1 : 1);
    setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelected(t);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">Calendário de prazos</h1>
          <p className="mt-2 text-muted">Inscrições, isenções, provas e resultados, dia a dia.</p>
        </div>
        <div className="w-full rounded-xl border border-line bg-surface p-3 sm:max-w-xs">
          <Switch
            icon={BellRing}
            label="Só o que acompanho"
            description={`${followed.length} editais no radar`}
            checked={onlyFollowed}
            onChange={setOnlyFollowed}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-line bg-surface p-3 sm:p-5" aria-labelledby="mes-atual">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 id="mes-atual" className="font-serif text-xl font-semibold text-ink sm:text-2xl" aria-live="polite">
              {formatMonth(cursor)}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={goToday}>
                Hoje
              </Button>
              <Button variant="ghost" size="icon" onClick={() => go(-1)} aria-label="Mês anterior">
                <ChevronLeft className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => go(1)} aria-label="Próximo mês">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
          <MonthGrid
            cursor={cursor}
            eventsByDay={eventsByDay}
            selected={selected}
            direction={direction}
            onSelect={(d) => {
              setSelected(d);
              if (d.getMonth() !== cursor.getMonth()) {
                const delta = d < cursor ? -1 : 1;
                setDirection(delta);
                setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
              }
            }}
          />
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-alert" aria-hidden /> Dia com fim de prazo ou prova
          </p>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink-soft first-letter:uppercase">
              {isSameDay(selected, today()) ? 'Hoje' : formatWeekday(selected)}
            </h2>
            <EventList eventos={doDia} empty="Nada marcado para este dia." />
          </section>
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink-soft">
              Em {formatMonth(cursor).toLowerCase()} ({doMes.length})
            </h2>
            <div className="lg:max-h-[28rem] lg:overflow-y-auto lg:pr-1">
              <EventList eventos={doMes} showDate empty="Nenhuma data neste mês para os filtros escolhidos." />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

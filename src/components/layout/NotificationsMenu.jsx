import { useEffect, useRef, useState } from 'react';
import { Bell, CalendarClock, FilePen, Inbox } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useEditalParam } from '../../hooks/useEditalParam.js';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { relativeDays } from '../../lib/dates.js';
import { cn } from '../../lib/cn.js';

export function NotificationsMenu() {
  const { notifications, unreadCount, markRead, markAllRead } = useApp();
  const { openEdital } = useEditalParam();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const panel = useRef(null);

  useGSAP(
    () => {
      if (open) gsap.from(panel.current, { y: -8, autoAlpha: 0, duration: 0.25 });
    },
    { dependencies: [open], scope: root },
  );

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
        className="relative grid size-9 place-items-center rounded-lg text-ink-soft hover:bg-hover hover:text-ink"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="tabular absolute -top-0.5 -right-0.5 grid min-w-4.5 place-items-center rounded-full bg-alert px-1 text-[10px] leading-4.5 font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panel}
          className="absolute right-0 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-shade/50"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notificações</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-primary-soft hover:text-primary-mist"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          {notifications.length ? (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.tipo === 'retificacao' ? FilePen : CalendarClock;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                        openEdital(n.edital.id);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex w-full gap-3 border-b border-line px-4 py-3 text-left last:border-0 hover:bg-hover-soft',
                        !n.lida && 'bg-primary/[0.06]',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg',
                          n.tipo === 'retificacao' ? 'bg-rectify/15 text-rectify-ink' : 'bg-alert/15 text-alert-soft',
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink">{n.titulo}</span>
                          {!n.lida && (
                            <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="não lida" />
                          )}
                        </span>
                        <span className="block text-sm text-muted first-letter:uppercase">{n.texto}</span>
                        <span className="mt-0.5 block text-xs text-faint">{relativeDays(n.data)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <Inbox className="mb-2 size-6 text-faint" aria-hidden />
              <p className="text-sm text-muted">
                Acompanhe um edital pelo sino para receber avisos de prazos e retificações aqui.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

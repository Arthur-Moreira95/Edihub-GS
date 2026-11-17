import { useMemo } from 'react';
import { BellRing, Mail, MessageCircle, Radar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useEditalParam } from '../hooks/useEditalParam.js';
import { getEventos, getNextDeadline } from '../lib/edital.js';
import { daysUntil, formatLong } from '../lib/dates.js';
import { EditalRow } from '../components/editais/EditalRow.jsx';
import { EventList } from '../components/calendar/EventList.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { InstitutionMark } from '../components/ui/InstitutionMark.jsx';
import { daysLabel } from '../components/ui/DaysLeft.jsx';

export default function RadarPage() {
  const { editais, followed, prefs, openAlerts, disableAlerts, plan } = useApp();
  const { openEdital } = useEditalParam();

  const meus = useMemo(
    () =>
      editais
        .filter((e) => followed.includes(e.id))
        .map((e) => ({ edital: e, next: getNextDeadline(e) }))
        .sort((a, b) => (a.next?.dias ?? 9999) - (b.next?.dias ?? 9999)),
    [editais, followed],
  );

  const proximos30 = useMemo(
    () =>
      getEventos(meus.map((m) => m.edital)).filter((ev) => {
        const d = daysUntil(ev.data);
        return d >= 0 && d <= 30;
      }),
    [meus],
  );

  if (!meus.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 font-serif text-4xl font-semibold text-ink">Meu radar</h1>
        <EmptyState icon={Radar} title="Seu radar está vazio" action={<Button to="/editais">Escolher editais</Button>}>
          Toque no sino de qualquer edital para acompanhar prazos, etapas e retificações aqui.
        </EmptyState>
      </div>
    );
  }

  const destaque = meus.filter((m) => m.next).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
          {prefs.nome ? `Radar de ${prefs.nome.trim().split(' ')[0]}` : 'Meu radar'}
        </h1>
        <p className="mt-2 text-muted">
          {meus.length} {meus.length === 1 ? 'edital acompanhado' : 'editais acompanhados'}, em ordem de urgência.
        </p>
      </header>

      {destaque.length > 0 && (
        <section
          aria-label="Prazos mais próximos"
          className="mb-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3"
        >
          {destaque.map(({ edital, next }, i) => (
            <button
              key={edital.id}
              type="button"
              onClick={() => openEdital(edital.id)}
              className={`flex items-start gap-4 p-5 text-left transition-colors hover:bg-hover ${i === 0 ? 'bg-navy-950' : 'bg-surface'}`}
            >
              <InstitutionMark edital={edital} />
              <span className="min-w-0">
                <span className="tabular block font-serif text-4xl leading-none font-semibold text-primary-mist">
                  {daysLabel(next.dias)}
                </span>
                <span className="mt-2 block truncate text-sm font-semibold text-ink">{edital.nome}</span>
                <span className="block text-xs text-muted first-letter:uppercase">
                  {next.label}, {formatLong(next.data)}
                </span>
              </span>
            </button>
          ))}
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section aria-labelledby="acompanhando">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="acompanhando" className="text-lg font-semibold text-ink">
                Acompanhando
              </h2>
              <Button variant="ghost" size="sm" to="/editais">
                Adicionar editais
              </Button>
            </div>
            <ul className="rounded-2xl border border-line bg-surface">
              {meus.map(({ edital }) => (
                <EditalRow key={edital.id} edital={edital} onOpen={openEdital} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="proximos30" className="rounded-2xl border border-line bg-surface p-5">
            <h2 id="proximos30" className="text-lg font-semibold text-ink">
              Próximos 30 dias
            </h2>
            <EventList eventos={proximos30} showDate empty="Nenhuma data nos próximos 30 dias." />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="alertas-titulo">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="alertas-titulo" className="text-lg font-semibold text-ink">
                Alertas
              </h2>
              <Badge tone={prefs.ativo ? 'action' : 'neutral'}>{prefs.ativo ? 'Ativos' : 'Desligados'}</Badge>
            </div>
            {prefs.ativo ? (
              <>
                <ul className="space-y-2 text-sm text-ink-soft">
                  {prefs.canais.whatsapp && (
                    <li className="flex items-center gap-2">
                      <MessageCircle className="size-4 text-action-strong" aria-hidden />
                      WhatsApp {prefs.whatsapp}
                    </li>
                  )}
                  {prefs.canais.email && prefs.email && (
                    <li className="flex items-center gap-2">
                      <Mail className="size-4 text-primary-soft" aria-hidden />
                      Resumo semanal em {prefs.email}
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <BellRing className="size-4 text-alert-soft" aria-hidden />
                    Aviso {prefs.antecedencia} {prefs.antecedencia === 1 ? 'dia' : 'dias'} antes de cada prazo
                  </li>
                </ul>
                {prefs.areas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {prefs.areas.map((a) => (
                      <Badge key={a} tone="primary">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openAlerts()}>
                    Editar alertas
                  </Button>
                  <Button variant="danger" size="sm" onClick={disableAlerts}>
                    Pausar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted">
                  Ative para receber no WhatsApp os prazos e retificações dos editais acima.
                </p>
                <Button variant="action" className="mt-4 w-full" onClick={() => openAlerts()}>
                  <BellRing className="size-4" aria-hidden />
                  Ativar alertas
                </Button>
              </>
            )}
          </section>

          {plan !== 'pro' && (
            <section className="rounded-2xl border border-primary/30 bg-navy-950 p-5">
              <Sparkles className="size-5 text-primary-soft" aria-hidden />
              <h2 className="mt-3 font-semibold text-ink">Aviso na hora, não só no resumo</h2>
              <p className="mt-1 text-sm text-muted">
                No Pro, a retificação chega no WhatsApp minutos depois de publicada, sem anúncios.
              </p>
              <Button to="/planos" className="mt-4" size="sm">
                Conhecer o Pro
              </Button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

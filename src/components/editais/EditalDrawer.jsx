import { Building2, Download, FileText, Link2, MapPin, MessageCircle, Ticket, Users, Wallet } from 'lucide-react';
import { CATEGORIAS, formatBRL, formatNumber } from '../../data/constants.js';
import { getEtapas, getNextDeadline, getRetificacoes, getStatusList } from '../../lib/edital.js';
import { formatFull } from '../../lib/dates.js';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Drawer } from '../ui/Overlay.jsx';
import { StatusBadge } from '../ui/Badge.jsx';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';
import { Button } from '../ui/Button.jsx';
import { daysLabel } from '../ui/DaysLeft.jsx';
import { FollowButton } from './FollowButton.jsx';
import { EtapasTimeline } from './EtapasTimeline.jsx';
import { RetificacaoCard } from './RetificacaoCard.jsx';

function Section({ title, children }) {
  return (
    <section className="border-t border-line px-6 py-5">
      <h3 className="mb-3 text-sm font-semibold text-ink-soft">{title}</h3>
      {children}
    </section>
  );
}

export function EditalDrawer({ edital, onClose }) {
  const { openAlerts, prefs } = useApp();
  const { notify } = useToast();
  const etapas = getEtapas(edital);
  const retificacoes = getRetificacoes(edital);
  const next = getNextDeadline(edital);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Link do edital copiado.');
    } catch {
      notify('Não foi possível copiar. Copie o endereço da barra do navegador.', { tone: 'warning' });
    }
  };

  const infos = [
    { icon: Wallet, label: 'Taxa de inscrição', value: formatBRL(edital.taxa) },
    { icon: Ticket, label: 'Isenção da taxa', value: edital.isencao ? 'Prevista no edital' : 'Não prevista' },
    {
      icon: Users,
      label: 'Vagas',
      value: edital.vagas ? `${formatNumber(edital.vagas)} (aprox.)` : 'Conforme cada instituição',
    },
    { icon: Building2, label: 'Organizadora', value: edital.banca },
    { icon: MapPin, label: 'Local', value: edital.cidade },
  ];

  return (
    <Drawer onClose={onClose} label={edital.nome}>
      {({ close }) => (
        <>
          <div className="flex-1 overflow-y-auto">
            <header className="px-6 pt-6 pb-5">
              <div className="flex items-start gap-4 pr-10">
                <InstitutionMark edital={edital} size="lg" />
                <div className="min-w-0">
                  <p className="text-sm text-muted">{edital.instituicao}</p>
                  <h2 className="font-serif text-2xl leading-tight font-semibold text-ink">{edital.nome}</h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {getStatusList(edital).map((s) => (
                      <StatusBadge key={s} status={s} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{edital.resumo}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <FollowButton edital={edital} withLabel />
                <Button variant="outline" onClick={copyLink}>
                  <Link2 className="size-4" aria-hidden />
                  Copiar link
                </Button>
              </div>
            </header>
            {next && (
              <div className="mx-6 mb-5 flex items-center gap-4 rounded-xl bg-navy-950 px-4 py-3 ring-1 ring-primary/30">
                <p className="tabular font-serif text-3xl font-semibold text-primary-mist">{daysLabel(next.dias)}</p>
                <div className="min-w-0 border-l border-primary/30 pl-4">
                  <p className="text-sm font-medium text-ink first-letter:uppercase">{next.label}</p>
                  <p className="text-xs text-muted">{formatFull(next.data)}</p>
                </div>
              </div>
            )}

            <Section title={edital.editalPublicado ? 'Etapas do certame' : 'Etapas previstas'}>
              <EtapasTimeline etapas={etapas} previsao={!edital.editalPublicado} />
            </Section>

            <Section title={`Retificações (${retificacoes.length})`}>
              {retificacoes.length ? (
                <div className="space-y-3">
                  {retificacoes.map((r) => (
                    <RetificacaoCard key={r.id} retificacao={r} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">Nenhuma retificação publicada até agora.</p>
              )}
            </Section>

            <Section title="Informações gerais">
              <dl className="grid gap-3 sm:grid-cols-2">
                {infos.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                    <div>
                      <dt className="text-xs text-muted">{label}</dt>
                      <dd className="text-sm text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted">
                {CATEGORIAS[edital.categoria].singular} · Modalidades de vaga: {edital.cotas.join(', ')}
              </p>
            </Section>

            <Section title="Documentos oficiais">
              {edital.documentos.length ? (
                <ul className="divide-y divide-line rounded-xl border border-line">
                  {edital.documentos.map((doc) => (
                    <li key={doc.nome} className="flex items-center gap-3 px-4 py-3">
                      <FileText className="size-4 shrink-0 text-primary-soft" aria-hidden />
                      <span className="flex-1 text-sm text-ink">{doc.nome}</span>
                      <span className="text-xs text-faint">
                        {doc.tipo} · {doc.tamanho}
                      </span>
                      <button
                        type="button"
                        onClick={() => notify(`Download de "${doc.nome}" simulado neste demo.`, { tone: 'info' })}
                        className="grid size-8 place-items-center rounded-lg text-muted hover:bg-hover hover:text-ink"
                        aria-label={`Baixar ${doc.nome}`}
                      >
                        <Download className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">O edital ainda não foi publicado. Avisamos assim que sair.</p>
              )}
            </Section>
          </div>

          <footer className="border-t border-line bg-surface px-6 py-4">
            <Button
              variant="action"
              size="lg"
              className="w-full"
              onClick={() => {
                close();
                openAlerts(edital.id);
              }}
            >
              <MessageCircle className="size-5" aria-hidden />
              {prefs.ativo ? `Receber alertas de ${edital.sigla} no WhatsApp` : 'Ativar alertas no WhatsApp'}
            </Button>
          </footer>
        </>
      )}
    </Drawer>
  );
}

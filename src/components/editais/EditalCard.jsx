import { FilePen, MapPin } from 'lucide-react';
import { CATEGORIAS, formatBRL } from '../../data/constants.js';
import { getNextDeadline, getStatusList, hasRecentRetificacao } from '../../lib/edital.js';
import { formatShort } from '../../lib/dates.js';
import { Badge, StatusBadge } from '../ui/Badge.jsx';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';
import { DaysLeft } from '../ui/DaysLeft.jsx';
import { FollowButton } from './FollowButton.jsx';

export function EditalCard({ edital, onOpen }) {
  const next = getNextDeadline(edital);
  const statuses = getStatusList(edital);
  const retificado = hasRecentRetificacao(edital);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-hover-line">
      <div className="flex items-start gap-3">
        <InstitutionMark edital={edital} />
        <div className="min-w-0 flex-1">
          <h3 className="leading-snug font-semibold text-ink">
            {/* o link cobre o card inteiro para facilitar o clique */}
            <button
              type="button"
              onClick={() => onOpen(edital.id)}
              className="text-left after:absolute after:inset-0 after:rounded-2xl hover:text-primary-mist"
            >
              {edital.nome}
            </button>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-3.5" aria-hidden />
            {CATEGORIAS[edital.categoria].singular}, {edital.uf === 'BR' ? 'nacional' : edital.uf}
          </p>
        </div>
        <FollowButton edital={edital} className="relative z-10" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {statuses.map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
        {retificado && (
          <Badge tone="rectify" icon={FilePen}>
            Retificado
          </Badge>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        {next ? (
          <div className="min-w-0">
            <p className="text-xs text-muted">Próximo prazo</p>
            <p className="truncate text-sm font-medium text-ink first-letter:uppercase">
              {next.label}, {formatShort(next.data)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">Sem prazos futuros</p>
        )}
        {next && <DaysLeft dias={next.dias} />}
      </div>
      <p className="mt-2 text-xs text-faint">Taxa: {formatBRL(edital.taxa)}</p>
    </article>
  );
}

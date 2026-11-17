import { FilePen } from 'lucide-react';
import { CATEGORIAS, formatBRL } from '../../data/constants.js';
import { getNextDeadline, getStatus, hasRecentRetificacao } from '../../lib/edital.js';
import { formatShort } from '../../lib/dates.js';
import { Badge, StatusBadge } from '../ui/Badge.jsx';
import { InstitutionMark } from '../ui/InstitutionMark.jsx';
import { DaysLeft } from '../ui/DaysLeft.jsx';
import { FollowButton } from './FollowButton.jsx';

/** Versão em linha do edital, para a visualização em lista. */
export function EditalRow({ edital, onOpen }) {
  const next = getNextDeadline(edital);
  return (
    // celular: [logo | nome | sino] e, embaixo do nome, [status ... prazo]; desktop: tudo em uma linha
    <li className="relative grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 border-b border-line px-3 py-3.5 last:border-0 hover:bg-hover-soft sm:flex sm:gap-x-4 sm:px-4">
      <InstitutionMark edital={edital} size="sm" />
      <div className="min-w-0 sm:flex-1 sm:basis-48">
        <button
          type="button"
          onClick={() => onOpen(edital.id)}
          className="text-left text-sm font-semibold text-ink after:absolute after:inset-0 hover:text-primary-mist"
        >
          {edital.nome}
        </button>
        <p className="text-xs text-muted">
          {CATEGORIAS[edital.categoria].singular} · Taxa {formatBRL(edital.taxa)}
        </p>
      </div>
      <div className="col-span-2 col-start-2 flex flex-wrap items-center justify-between gap-2 sm:contents">
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={getStatus(edital)} />
        {hasRecentRetificacao(edital) && (
          <Badge tone="rectify" icon={FilePen}>
            Retificado
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 text-right sm:w-40">
        {next ? (
          <>
            <span className="tabular text-xs text-muted">{formatShort(next.data)}</span>
            <DaysLeft dias={next.dias} />
          </>
        ) : (
          <span className="text-xs text-faint">Sem prazos</span>
        )}
      </div>
      </div>
      <FollowButton edital={edital} className="relative z-10 col-start-3 row-start-1" />
    </li>
  );
}

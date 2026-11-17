import { FilePen } from 'lucide-react';
import { formatLong, relativeDays } from '../../lib/dates.js';

/** Mostra o que mudou na retificação: antes riscado, depois em destaque. */
export function RetificacaoCard({ retificacao }) {
  return (
    <div className="rounded-xl border border-rectify/30 bg-rectify/[0.07] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-rectify-ink">
          <FilePen className="size-4" aria-hidden />
          {retificacao.campo}
        </p>
        <span className="text-xs text-muted">
          {formatLong(retificacao.data)} · {relativeDays(retificacao.data)}
        </span>
      </div>
      <dl className="grid gap-2 text-sm">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-muted">Antes</dt>
          <dd className="text-muted line-through decoration-danger/60">{retificacao.antes}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 text-muted">Agora</dt>
          <dd className="font-semibold text-ink">{retificacao.depois}</dd>
        </div>
      </dl>
    </div>
  );
}

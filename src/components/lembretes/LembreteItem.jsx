import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import { formatLong } from '../../lib/dates.js';
import { parseDia, situacaoLembrete } from '../../lib/lembretes.js';
import { LembreteForm } from './LembreteForm.jsx';

const SITUACAO = {
  feito: { texto: 'Feito', classe: 'text-action-strong' },
  atrasado: { texto: 'Atrasado', classe: 'text-danger-ink' },
  hoje: { texto: 'É hoje', classe: 'text-alert-soft' },
  breve: { texto: null, classe: 'text-alert-soft' },
  futuro: { texto: null, classe: 'text-muted' },
};

/**
 * Um lembrete da lista: marcar como feito, editar no lugar e excluir.
 * Enquanto salva, os botões ficam com aria-disabled (e ignoram o clique) em vez de disabled,
 * para o foco não sair do lugar e o teclado continuar funcionando.
 */
export function LembreteItem({ lembrete, edital, editais, mostrarEdital, onToggle, onEdit, onDelete }) {
  const [editando, setEditando] = useState(false);
  const { chave, dias } = situacaoLembrete(lembrete);
  const sit = SITUACAO[chave];
  const dia = parseDia(lembrete.data);
  const quando = sit.texto ?? (dias === 1 ? 'Amanhã' : `Em ${dias} dias`);

  if (editando) {
    return (
      <li className="py-4">
        <LembreteForm
          inicial={{ titulo: lembrete.titulo, data: lembrete.data, editalId: lembrete.editalId }}
          editais={editais}
          editalFixo={mostrarEdital ? undefined : lembrete.editalId}
          permitirPassado
          textoBotao="Salvar"
          onCancel={() => setEditando(false)}
          onSubmit={async (dados) => {
            await onEdit(lembrete.id, dados);
            setEditando(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className={cn('flex items-start gap-3 py-3', lembrete.salvando && 'opacity-60')}>
      <button
        type="button"
        role="checkbox"
        aria-checked={lembrete.feito}
        aria-label={lembrete.feito ? `Desmarcar "${lembrete.titulo}"` : `Marcar "${lembrete.titulo}" como feito`}
        onClick={() => !lembrete.salvando && onToggle(lembrete)}
        aria-disabled={lembrete.salvando}
        className={cn(
          'mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors',
          lembrete.feito ? 'border-action bg-action text-white' : 'border-line-strong hover:border-hover-line',
        )}
      >
        {lembrete.feito && <Check className="size-4" strokeWidth={3} aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium break-words text-ink', lembrete.feito && 'text-muted line-through')}>
          {lembrete.titulo}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          <span className={cn('font-semibold', sit.classe)}>{quando}</span>
          {dia && <> · {formatLong(dia)}</>}
          {mostrarEdital && edital && <> · {edital.sigla}</>}
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => !lembrete.salvando && setEditando(true)}
          aria-disabled={lembrete.salvando}
          aria-label={`Editar "${lembrete.titulo}"`}
          className="grid size-9 place-items-center rounded-lg text-muted hover:bg-hover hover:text-ink"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => !lembrete.salvando && onDelete(lembrete)}
          aria-disabled={lembrete.salvando}
          aria-label={`Excluir "${lembrete.titulo}"`}
          className="grid size-9 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger-ink"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

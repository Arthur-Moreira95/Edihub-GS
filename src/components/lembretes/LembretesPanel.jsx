import { useMemo } from 'react';
import { CloudOff, ListTodo, Loader2, RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useLembretes } from '../../hooks/useLembretes.js';
import { Button } from '../ui/Button.jsx';
import { LembreteForm } from './LembreteForm.jsx';
import { LembreteItem } from './LembreteItem.jsx';

/**
 * Lembretes do estudante, salvos na API externa (CRUD completo).
 * - Na página "Meu radar": todos os lembretes, com escolha entre os editais acompanhados.
 * - Na ficha de um edital (prop `editalId`): só os lembretes daquele edital.
 */
export function LembretesPanel({ editalId, titulo = 'Meus lembretes', className }) {
  const { editais, followed } = useApp();
  const { notify } = useToast();
  const { lembretes, status, erro, recarregar, criar, editar, alternarFeito, excluir } = useLembretes({ editalId });

  // opções do formulário: com edital fixo, só ele; senão os acompanhados (ou todos, se nenhum)
  const opcoes = useMemo(() => {
    if (editalId) return editais.filter((e) => e.id === editalId);
    const seguidos = editais.filter((e) => followed.includes(e.id));
    return seguidos.length ? seguidos : editais;
  }, [editais, followed, editalId]);
  const porId = useMemo(() => Object.fromEntries(editais.map((e) => [e.id, e])), [editais]);
  const pendentes = lembretes.filter((l) => !l.feito).length;

  // cada ação mostra o resultado; os erros da API viram aviso com a mensagem do apiClient
  const tentar = async (acao, sucesso) => {
    try {
      const r = await acao();
      if (sucesso) notify(typeof sucesso === 'function' ? sucesso(r) : sucesso);
      return r;
    } catch (e) {
      notify(e.message, { tone: 'warning', duration: 5000 });
      throw e;
    }
  };

  const aoCriar = (dados) => tentar(() => criar(dados), 'Lembrete salvo.');
  const aoEditar = (id, dados) => tentar(() => editar(id, dados), 'Lembrete atualizado.');
  const aoAlternar = (l) => tentar(() => alternarFeito(l)).catch(() => {});
  const aoExcluir = (l) =>
    tentar(() => excluir(l.id))
      .then((removido) => {
        if (!removido) return;
        notify('Lembrete excluído.', {
          tone: 'info',
          // "Desfazer" recria o lembrete na API com um novo POST, já com o "feito" original
          action: {
            label: 'Desfazer',
            onClick: () =>
              tentar(
                () =>
                  criar({
                    titulo: removido.titulo,
                    data: removido.data,
                    editalId: removido.editalId,
                    feito: removido.feito,
                  }),
                'Lembrete restaurado.',
              ).catch(() => {}),
          },
        });
      })
      .catch(() => {});

  return (
    <section className={className} aria-labelledby={`lembretes-${editalId ?? 'todos'}`}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id={`lembretes-${editalId ?? 'todos'}`} className="text-lg font-semibold text-ink">
          {titulo}
        </h2>
        {status === 'pronto' && lembretes.length > 0 && (
          <p className="text-xs text-muted" aria-live="polite">
            {pendentes ? `${pendentes} ${pendentes === 1 ? 'pendente' : 'pendentes'}` : 'Tudo feito'}
          </p>
        )}
      </div>

      {status === 'sem-api' && (
        <p className="flex items-start gap-2 rounded-xl border border-dashed border-line-strong p-4 text-sm text-muted">
          <CloudOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          Os lembretes ficam salvos numa API externa, que ainda não foi configurada neste ambiente (VITE_API_URL).
        </p>
      )}

      {status === 'erro' && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm">
          <p className="flex items-start gap-2 text-danger-ink">
            <CloudOff className="mt-0.5 size-4 shrink-0" aria-hidden />
            {erro}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={recarregar}>
            <RotateCw className="size-4" aria-hidden />
            Tentar de novo
          </Button>
        </div>
      )}

      {(status === 'carregando' || status === 'ocioso') && (
        <p className="flex items-center gap-2 py-6 text-sm text-muted" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Carregando seus lembretes…
        </p>
      )}

      {status === 'pronto' && (
        <>
          <LembreteForm editais={opcoes} editalFixo={editalId} onSubmit={aoCriar} />
          {lembretes.length ? (
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {lembretes.map((l) => (
                <LembreteItem
                  key={l.id}
                  lembrete={l}
                  edital={porId[l.editalId]}
                  editais={opcoes}
                  mostrarEdital={!editalId}
                  onToggle={aoAlternar}
                  onEdit={aoEditar}
                  onDelete={aoExcluir}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm text-muted">
              <ListTodo className="size-4 shrink-0" aria-hidden />
              {editalId
                ? 'Nenhum lembrete para este edital ainda.'
                : 'Nenhum lembrete ainda. Anote o que você precisa fazer para não perder nenhum prazo.'}
            </p>
          )}
        </>
      )}
    </section>
  );
}

import { useCallback, useMemo } from 'react';
import { useEnsureLembretes, useLembretesContext } from '../context/LembretesContext.jsx';
import { ordenarLembretes } from '../lib/lembretes.js';

/**
 * Custom hook dos lembretes do estudante (CRUD na API externa).
 * Dispara a primeira busca quando um componente o usa e devolve a lista já filtrada e ordenada,
 * com as operações de criar, editar, marcar como feito e excluir.
 *
 * @param {{ editalId?: string }} filtro mostra só os lembretes de um edital (opcional)
 * @returns {{
 *   lembretes: object[], status: 'ocioso'|'carregando'|'pronto'|'erro'|'sem-api', erro: string|null,
 *   recarregar: () => void, criar: (form) => Promise<object>, editar: (id, mudancas) => Promise<object>,
 *   alternarFeito: (lembrete) => Promise<object>, excluir: (id) => Promise<object>,
 * }}
 */
export function useLembretes({ editalId } = {}) {
  const { lista, status, erro, ensureLoaded, recarregar, criar, editar, excluir } = useLembretesContext();
  useEnsureLembretes(ensureLoaded);

  const lembretes = useMemo(
    () => ordenarLembretes(editalId ? lista.filter((x) => x.editalId === editalId) : lista),
    [lista, editalId],
  );

  const alternarFeito = useCallback((lembrete) => editar(lembrete.id, { feito: !lembrete.feito }), [editar]);

  return { lembretes, status, erro, recarregar, criar, editar, alternarFeito, excluir };
}

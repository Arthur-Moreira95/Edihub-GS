import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { isApiConfigured } from '../services/apiClient.js';
import { atualizarLembrete, criarLembrete, excluirLembrete, listarLembretes } from '../services/lembretesService.js';
import { novoLembrete } from '../lib/lembretes.js';

/**
 * Estado compartilhado dos lembretes (CRUD na API externa).
 * Fica num contexto para que todos os painéis (Meu radar e ficha do edital) vejam a mesma lista:
 * criar um lembrete em um lugar atualiza o outro na hora.
 * A busca só acontece quando algum painel pede (ensureLoaded), não ao abrir o site.
 */

const DONO_KEY = 'edihub:dono';

/** Identificador aleatório deste navegador (não é dado pessoal), criado na primeira vez. */
function getDono() {
  try {
    let id = window.localStorage.getItem(DONO_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(DONO_KEY, id);
    }
    return id;
  } catch {
    return 'visitante';
  }
}

const LembretesContext = createContext(null);

export function LembretesProvider({ children }) {
  const dono = useMemo(getDono, []);
  const [lista, setLista] = useState([]);
  // ocioso → carregando → pronto | erro   (ou sem-api, se VITE_API_URL não foi definida)
  const [status, setStatus] = useState(isApiConfigured ? 'ocioso' : 'sem-api');
  const [erro, setErro] = useState(null);
  // espelho da lista atual: os callbacks leem daqui (no React 18+, a função passada ao
  // setState pode rodar só na próxima renderização, então não serve para ler o valor anterior)
  const listaRef = useRef(lista);
  listaRef.current = lista;
  const carregando = useRef(false);

  // READ
  const carregar = useCallback(async () => {
    if (!isApiConfigured || carregando.current) return;
    carregando.current = true;
    setStatus('carregando');
    setErro(null);
    try {
      const dados = await listarLembretes(dono);
      setLista(Array.isArray(dados) ? dados : []);
      setStatus('pronto');
    } catch (e) {
      setErro(e.message);
      setStatus('erro');
    } finally {
      carregando.current = false;
    }
  }, [dono]);

  const ensureLoaded = useCallback(() => {
    if (status === 'ocioso') carregar();
  }, [status, carregar]);

  // CREATE: aparece na hora com id provisório e é trocado pelo registro salvo pela API
  const criar = useCallback(
    async (form) => {
      const dados = novoLembrete(form, dono);
      const tempId = `tmp-${Date.now()}`;
      setLista((l) => [...l, { ...dados, id: tempId, salvando: true }]);
      try {
        const salvo = await criarLembrete(dados);
        setLista((l) => l.map((x) => (x.id === tempId ? salvo : x)));
        return salvo;
      } catch (e) {
        setLista((l) => l.filter((x) => x.id !== tempId));
        throw e;
      }
    },
    [dono],
  );

  // UPDATE: aplica a mudança na hora e desfaz se a API recusar
  const editar = useCallback(async (id, mudancas) => {
    const anterior = listaRef.current.find((x) => x.id === id);
    if (!anterior) return null;
    setLista((l) => l.map((x) => (x.id === id ? { ...x, ...mudancas, salvando: true } : x)));
    const { salvando, ...base } = anterior; // eslint-disable-line no-unused-vars
    try {
      const salvo = await atualizarLembrete(id, { ...base, ...mudancas });
      setLista((l) => l.map((x) => (x.id === id ? salvo : x)));
      return salvo;
    } catch (e) {
      setLista((l) => l.map((x) => (x.id === id ? anterior : x)));
      throw e;
    }
  }, []);

  // DELETE: some na hora e volta para a mesma posição se a API falhar
  const excluir = useCallback(async (id) => {
    const posicao = listaRef.current.findIndex((x) => x.id === id);
    const removido = listaRef.current[posicao];
    if (!removido) return null;
    setLista((l) => l.filter((x) => x.id !== id));
    try {
      await excluirLembrete(id);
      return removido;
    } catch (e) {
      setLista((l) => [...l.slice(0, posicao), removido, ...l.slice(posicao)]);
      throw e;
    }
  }, []);

  const value = useMemo(
    () => ({ lista, status, erro, ensureLoaded, recarregar: carregar, criar, editar, excluir }),
    [lista, status, erro, ensureLoaded, carregar, criar, editar, excluir],
  );
  return <LembretesContext.Provider value={value}>{children}</LembretesContext.Provider>;
}

export function useLembretesContext() {
  const ctx = useContext(LembretesContext);
  if (!ctx) throw new Error('useLembretes precisa estar dentro de <LembretesProvider>');
  return ctx;
}

// usado pelo hook para disparar a primeira busca
export function useEnsureLembretes(ensureLoaded) {
  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);
}

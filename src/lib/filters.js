import { getNextDeadline, getStatus, hasRecentRetificacao } from './edital.js';

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const matchers = {
  q: (e, q) => normalize(`${e.sigla} ${e.nome} ${e.instituicao} ${e.cidade}`).includes(normalize(q.trim())),
  categoria: (e, v) => e.categoria === v,
  status: (e, v) => (v === 'retificado' ? hasRecentRetificacao(e) : getStatus(e) === v),
  uf: (e, v) => e.uf === v,
  area: (e, v) => e.areas.includes(v),
  seguindo: (e, v, ctx) => !v || ctx.followed.includes(e.id),
};

/** Aplica todos os filtros ativos, opcionalmente ignorando um (para calcular contagens). */
export function applyFilters(editais, filters, ctx, ignore) {
  return editais.filter((e) =>
    Object.entries(matchers).every(([key, fn]) => key === ignore || !filters[key] || fn(e, filters[key], ctx)),
  );
}

/** Quantos resultados cada opção traria, mantendo os demais filtros. */
export function countOptions(editais, filters, ctx, key, values) {
  const base = applyFilters(editais, filters, ctx, key);
  return Object.fromEntries(values.map((v) => [v, base.filter((e) => matchers[key](e, v, ctx)).length]));
}

const SORTERS = {
  prazo: (a, b) => (getNextDeadline(a)?.dias ?? 9999) - (getNextDeadline(b)?.dias ?? 9999),
  seguidores: (a, b) => b.seguidores - a.seguidores,
  taxa: (a, b) => (a.taxa ?? 9999) - (b.taxa ?? 9999),
  nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
};

export function sortEditais(list, ordem) {
  return [...list].sort(SORTERS[ordem] ?? SORTERS.prazo);
}

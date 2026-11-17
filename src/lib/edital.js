import { ETAPAS } from '../data/constants.js';
import { fromToday, today, daysUntil } from './dates.js';

const RETIFICACAO_RECENTE_DIAS = 14;

/** Minúscula só na primeira letra, preservando siglas ("Inscrições no SiSU" → "inscrições no SiSU"). */
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/** Normaliza as etapas do mock para objetos com datas reais, em ordem cronológica. */
export function getEtapas(edital) {
  return edital.etapas
    .map((et, index) => {
      const inicio = fromToday(et.inicio ?? et.dia);
      const fim = fromToday(et.fim ?? et.dia);
      return {
        key: `${edital.id}-${et.tipo}-${index}`,
        tipo: et.tipo,
        label: et.label ?? ETAPAS[et.tipo],
        inicio,
        fim,
        periodo: et.dia == null,
      };
    })
    .sort((a, b) => a.inicio - b.inicio);
}

const within = (et, d) => et.inicio <= d && d <= et.fim;

export function getStatus(edital) {
  if (!edital.editalPublicado) return 'aguardando';
  const etapas = getEtapas(edital);
  const hoje = today();
  const inscricao = etapas.find((e) => e.tipo === 'inscricao');
  const isencao = etapas.find((e) => e.tipo === 'isencao');
  if (inscricao && within(inscricao, hoje)) return 'aberta';
  if (isencao && within(isencao, hoje)) return 'isencao';
  if (inscricao && hoje < inscricao.inicio) return 'em-breve';
  return etapas.some((e) => e.fim >= hoje) ? 'andamento' : 'encerrado';
}

/** Status com prioridade + marcadores extras (isenção aberta junto com inscrição etc.). */
export function getStatusList(edital) {
  const main = getStatus(edital);
  const list = [main];
  const hoje = today();
  const isencao = getEtapas(edital).find((e) => e.tipo === 'isencao');
  if (main === 'aberta' && isencao && within(isencao, hoje)) list.push('isencao');
  return list;
}

export function getRetificacoes(edital) {
  return edital.retificacoes
    .map((r, i) => ({ ...r, id: `${edital.id}-ret-${i}`, data: fromToday(r.dia) }))
    .sort((a, b) => b.data - a.data);
}

export function hasRecentRetificacao(edital) {
  return getRetificacoes(edital).some((r) => daysUntil(r.data) >= -RETIFICACAO_RECENTE_DIAS);
}

/**
 * Próximo marco do edital: o fim de uma etapa em andamento ou o início/dia da próxima.
 * Retorna { label, data, dias } ou null.
 */
export function getNextDeadline(edital) {
  const hoje = today();
  const marcos = [];
  for (const et of getEtapas(edital)) {
    if (et.periodo) {
      if (within(et, hoje)) marcos.push({ label: `Fim: ${lowerFirst(et.label)}`, data: et.fim, etapa: et });
      else if (et.inicio > hoje) marcos.push({ label: `Início: ${lowerFirst(et.label)}`, data: et.inicio, etapa: et });
    } else if (et.inicio >= hoje) {
      marcos.push({ label: et.label, data: et.inicio, etapa: et });
    }
  }
  marcos.sort((a, b) => a.data - b.data);
  const next = marcos[0];
  return next ? { ...next, dias: daysUntil(next.data) } : null;
}

/** Índice da etapa atual (primeira que ainda não terminou). */
export function getCurrentEtapaIndex(etapas) {
  const hoje = today();
  const idx = etapas.findIndex((e) => e.fim >= hoje);
  return idx === -1 ? etapas.length : idx;
}

/**
 * Todos os eventos de calendário: dias de prova/resultado e início/fim de períodos.
 */
export function getEventos(editais) {
  const eventos = [];
  for (const ed of editais) {
    for (const et of getEtapas(ed)) {
      const base = { edital: ed, etapa: et, cor: ed.cor };
      if (et.periodo) {
        eventos.push({ ...base, id: `${et.key}-i`, data: et.inicio, titulo: `Abre: ${lowerFirst(et.label)}` });
        eventos.push({
          ...base,
          id: `${et.key}-f`,
          data: et.fim,
          titulo: `Encerra: ${lowerFirst(et.label)}`,
          prazo: true,
        });
      } else {
        eventos.push({ ...base, id: et.key, data: et.inicio, titulo: et.label, prazo: et.tipo === 'prova' });
      }
    }
  }
  return eventos.sort((a, b) => a.data - b.data);
}

/** Tom visual conforme a urgência de um prazo. */
export function urgencyTone(dias) {
  if (dias == null) return 'neutral';
  if (dias <= 3) return 'danger';
  if (dias <= 7) return 'alert';
  if (dias <= 30) return 'primary';
  return 'neutral';
}

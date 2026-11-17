import { dayKey, daysUntil } from './dates.js';

/**
 * Regras de negócio dos lembretes do estudante.
 * Funções puras: não sabem nada de API nem de tela, então dá para testar e reaproveitar.
 */

export const TITULO_MIN = 3;
export const TITULO_MAX = 80;

/** Converte 'AAAA-MM-DD' em Date no horário local (sem o fuso deslocar o dia). */
export function parseDia(texto) {
  const [a, m, d] = String(texto).split('-').map(Number);
  if (!a || !m || !d) return null;
  const data = new Date(a, m - 1, d);
  return data.getMonth() === m - 1 ? data : null; // rejeita 31/02 etc.
}

/**
 * Valida o que o estudante digitou. Devolve um objeto de erros por campo
 * (vazio quando está tudo certo).
 * @param {{ titulo: string, data: string, editalId: string }} dados
 * @param {{ editaisValidos: string[], permitirPassado?: boolean }} contexto
 */
export function validarLembrete(dados, { editaisValidos, permitirPassado = false }) {
  const erros = {};
  const titulo = (dados.titulo ?? '').trim();
  if (titulo.length < TITULO_MIN) erros.titulo = `Escreva pelo menos ${TITULO_MIN} letras.`;
  else if (titulo.length > TITULO_MAX) erros.titulo = `Use no máximo ${TITULO_MAX} caracteres.`;

  const dia = parseDia(dados.data);
  if (!dia) erros.data = 'Escolha uma data válida.';
  // ao criar, não faz sentido lembrar de algo no passado; ao editar, mantém a data antiga
  else if (!permitirPassado && daysUntil(dia) < 0) erros.data = 'Escolha hoje ou uma data futura.';

  if (!editaisValidos.includes(dados.editalId)) erros.editalId = 'Escolha um edital.';
  return erros;
}

/**
 * Monta o registro que vai para a API a partir do formulário.
 * `feito` só vem preenchido ao restaurar um lembrete excluído ("Desfazer").
 */
export function novoLembrete({ titulo, data, editalId, feito = false }, dono) {
  return {
    dono,
    editalId,
    titulo: titulo.trim(),
    data,
    feito: Boolean(feito),
    criadoEm: new Date().toISOString(),
  };
}

/**
 * Situação de um lembrete, usada para cor e texto na tela.
 * @returns {{ chave: 'feito'|'atrasado'|'hoje'|'breve'|'futuro', dias: number }}
 */
export function situacaoLembrete(lembrete) {
  const dia = parseDia(lembrete.data);
  const dias = dia ? daysUntil(dia) : 0;
  if (lembrete.feito) return { chave: 'feito', dias };
  if (dias < 0) return { chave: 'atrasado', dias };
  if (dias === 0) return { chave: 'hoje', dias };
  if (dias <= 3) return { chave: 'breve', dias };
  return { chave: 'futuro', dias };
}

/** Ordem da lista: pendentes primeiro (atrasados no topo, depois por data); feitos no fim. */
export function ordenarLembretes(lista) {
  return [...lista].sort((a, b) => {
    if (a.feito !== b.feito) return a.feito ? 1 : -1;
    return String(a.data).localeCompare(String(b.data));
  });
}

/** Data de hoje no formato do campo <input type="date">. */
export const hojeISO = () => dayKey(new Date());

import { request } from './apiClient.js';

/**
 * Serviço do recurso "lembretes" na API externa: as quatro operações do CRUD.
 * Não tem regra de negócio nem estado; só conversa com a API.
 *
 * Formato de um lembrete na API:
 *   { id, dono, editalId, titulo, data: 'AAAA-MM-DD', feito: boolean, criadoEm: ISO }
 * `dono` é um identificador aleatório deste navegador (sem dado pessoal), para cada
 * visitante ver só os próprios lembretes.
 */
const RECURSO = '/lembretes';

/** READ: lista os lembretes de um dono. */
export const listarLembretes = (dono, { signal } = {}) => request(RECURSO, { query: { dono }, signal });

/** CREATE: cria um lembrete e devolve o registro salvo (com o id gerado pela API). */
export const criarLembrete = (dados) => request(RECURSO, { method: 'POST', body: dados });

/** UPDATE: atualiza um lembrete e devolve o registro salvo. */
export const atualizarLembrete = (id, dados) =>
  request(`${RECURSO}/${encodeURIComponent(id)}`, { method: 'PUT', body: dados });

/** DELETE: exclui um lembrete. */
export const excluirLembrete = (id) => request(`${RECURSO}/${encodeURIComponent(id)}`, { method: 'DELETE' });

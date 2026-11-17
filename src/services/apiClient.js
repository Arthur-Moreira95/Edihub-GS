/**
 * Cliente HTTP da API externa (camada de acesso a dados).
 *
 * O endereço vem da variável de ambiente VITE_API_URL (arquivo .env), por exemplo:
 *   VITE_API_URL=https://<id>.mockapi.io/api/v1
 * Todas as chamadas têm tempo limite e devolvem um ApiError com uma mensagem
 * pronta para mostrar ao estudante quando algo dá errado.
 */

export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
export const isApiConfigured = API_URL.length > 0;

const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.cause = cause;
  }
}

/** Traduz o status HTTP numa mensagem simples, em português. */
function messageFor(status) {
  if (status === 404) return 'Não encontramos esse item. Ele pode ter sido excluído.';
  if (status === 429) return 'Muitas requisições em pouco tempo. Espere alguns segundos e tente de novo.';
  if (status >= 500) return 'O servidor está com problemas agora. Tente de novo em instantes.';
  return 'Não foi possível concluir a operação.';
}

/**
 * Faz uma requisição JSON para a API.
 * @param {string} path caminho a partir da base, ex.: '/lembretes'
 * @param {{ method?: string, body?: unknown, query?: Record<string, string>, signal?: AbortSignal }} options
 */
export async function request(path, { method = 'GET', body, query, signal } = {}) {
  if (!isApiConfigured) {
    throw new ApiError('A API não está configurada. Defina VITE_API_URL no arquivo .env.');
  }

  const url = new URL(API_URL + path);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  // tempo limite: cancela a requisição se a rede travar
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (cause) {
    if (signal?.aborted) throw cause; // cancelado por quem chamou (ex.: componente desmontado)
    const timedOut = cause?.name === 'AbortError';
    throw new ApiError(
      timedOut ? 'A conexão demorou demais. Verifique sua internet e tente de novo.' : 'Sem conexão com o servidor. Verifique sua internet.',
      { cause },
    );
  } finally {
    clearTimeout(timer);
  }

  // MockAPI responde 404 com "Not found" para uma lista filtrada vazia
  if (method === 'GET' && response.status === 404 && !path.match(/\/[^/]+\/[^/]+$/)) return [];
  if (!response.ok) throw new ApiError(messageFor(response.status), { status: response.status });
  if (response.status === 204) return null;
  return response.json();
}

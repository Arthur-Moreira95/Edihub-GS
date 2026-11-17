import { useId, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Field, inputClasses } from '../ui/Field.jsx';
import { cn } from '../../lib/cn.js';
import { TITULO_MAX, hojeISO, validarLembrete } from '../../lib/lembretes.js';

/**
 * Formulário de lembrete, usado para criar e para editar.
 * Valida com as regras de lib/lembretes.js antes de chamar onSubmit.
 *
 * @param {{
 *   inicial?: { titulo: string, data: string, editalId: string },
 *   editais: { id: string, nome: string }[],
 *   editalFixo?: string,            // esconde a escolha do edital (ex.: dentro da ficha do edital)
 *   onSubmit: (dados) => Promise<void>,
 *   onCancel?: () => void,
 *   textoBotao?: string,
 *   permitirPassado?: boolean,      // ao editar, a data antiga pode já ter passado
 * }} props
 */
export function LembreteForm({
  inicial,
  editais,
  editalFixo,
  onSubmit,
  onCancel,
  textoBotao = 'Adicionar lembrete',
  permitirPassado = false,
}) {
  const selectId = useId();
  const tituloRef = useRef(null);
  const [dados, setDados] = useState(
    () => inicial ?? { titulo: '', data: hojeISO(), editalId: editalFixo ?? editais[0]?.id ?? '' },
  );
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) => {
    setDados((d) => ({ ...d, [campo]: e.target.value }));
    if (erros[campo]) setErros((x) => ({ ...x, [campo]: undefined }));
  };

  async function enviar(e) {
    e.preventDefault();
    const encontrados = validarLembrete(dados, { editaisValidos: editais.map((x) => x.id), permitirPassado });
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    setEnviando(true);
    try {
      await onSubmit({ ...dados, titulo: dados.titulo.trim() });
      if (!inicial) setDados((d) => ({ ...d, titulo: '' })); // pronto para o próximo
    } finally {
      setEnviando(false);
      // o botão fica desabilitado enquanto salva e o navegador tira o foco dele;
      // devolve o foco ao campo para o teclado (e o Esc dos modais) continuar funcionando
      requestAnimationFrame(() => tituloRef.current?.focus({ preventScroll: true }));
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-3 sm:grid-cols-[1fr_10rem]">
      <Field
        ref={tituloRef}
        label="O que você precisa fazer?"
        placeholder="Ex.: separar documentos para a isenção"
        value={dados.titulo}
        onChange={alterar('titulo')}
        maxLength={TITULO_MAX}
        error={erros.titulo}
        className="sm:col-span-2"
      />
      {!editalFixo && (
        <div>
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-soft">
            Edital
          </label>
          <select
            id={selectId}
            value={dados.editalId}
            onChange={alterar('editalId')}
            aria-invalid={Boolean(erros.editalId)}
            className={cn(inputClasses, erros.editalId && 'border-danger')}
          >
            {editais.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
          {erros.editalId && <p className="mt-1.5 text-xs text-danger-ink">{erros.editalId}</p>}
        </div>
      )}
      <Field
        label="Até quando"
        type="date"
        value={dados.data}
        min={permitirPassado ? undefined : hojeISO()}
        onChange={alterar('data')}
        error={erros.data}
        className={cn(editalFixo && 'sm:col-span-2')}
      />
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button type="submit" disabled={enviando} className="w-full sm:w-auto">
          {enviando && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {enviando ? 'Salvando…' : textoBotao}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={enviando}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

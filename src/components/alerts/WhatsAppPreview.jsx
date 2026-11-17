import { useRef } from 'react';
import { CheckCheck } from 'lucide-react';
import { gsap, useGSAP } from '../../lib/gsap.js';

/** Prévia da mensagem que o aluno vai receber. Atualiza conforme o formulário. */
export function WhatsAppPreview({ nome, edital, antecedencia }) {
  const bubble = useRef(null);
  const primeiroNome = nome.trim().split(' ')[0] || 'estudante';

  // Pequeno "pulso" quando o conteúdo da mensagem muda
  useGSAP(
    () => {
      gsap.fromTo(bubble.current, { scale: 0.98 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    },
    { dependencies: [edital?.id, antecedencia] },
  );

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-line-strong">
      <div className="flex items-center gap-3 bg-[#075E54] px-4 py-2.5 text-white">
        <span className="grid size-8 place-items-center rounded-full bg-white font-serif text-sm font-bold text-primary">
          E
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Edihub</p>
          <p className="text-[11px] text-white/70">conta comercial</p>
        </div>
      </div>
      <div className="min-h-56 space-y-2 bg-wa-paper p-4">
        <div
          ref={bubble}
          className="max-w-[92%] origin-top-left rounded-xl rounded-tl-sm bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 shadow"
        >
          Olá, {primeiroNome}! Faltam{' '}
          <b>
            {antecedencia} {antecedencia === 1 ? 'dia' : 'dias'}
          </b>{' '}
          para o fim das inscrições do <b>{edital?.nome ?? 'Vestibular UERJ 2027'}</b>. A taxa pode ser paga até o
          último dia.
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-500">
            09:41 <CheckCheck className="size-3.5 text-sky-500" aria-hidden />
          </span>
        </div>
        <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 shadow">
          Saiu uma retificação: o local de prova mudou. Toque para ver o que mudou no edital.
          <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-500">
            18:02 <CheckCheck className="size-3.5 text-sky-500" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

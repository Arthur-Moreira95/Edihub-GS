import { useState } from 'react';
import { cn } from '../../lib/cn.js';

const SIZES = {
  sm: 'size-8 rounded-lg',
  md: 'size-11 rounded-xl',
  lg: 'size-14 rounded-2xl',
};

// Respiro interno do logo conforme o tamanho do selo
const PAD = {
  sm: 'p-0.5',
  md: 'p-1',
  lg: 'p-1.5',
};

// Tamanho da fonte conforme o tamanho do selo e o comprimento do texto
const FONT = {
  sm: ['text-[10px]', 'text-[8px]'],
  md: ['text-[11px]', 'text-[9px]'],
  lg: ['text-xs', 'text-[10px]'],
};

/** Logo da instituição; cai para o selo colorido com a sigla se não houver logo ou ele falhar. */
export function InstitutionMark({ edital, size = 'md', className }) {
  const [failed, setFailed] = useState(false);

  if (edital.logo && !failed) {
    // logoPosicao 'left': o arquivo tem o símbolo à esquerda e texto ao lado; recorta só o símbolo
    const crop = edital.logoPosicao === 'left';
    return (
      <span
        aria-hidden
        className={cn(
          'grid shrink-0 place-items-center overflow-hidden bg-white ring-1 ring-line-strong/60',
          SIZES[size],
          !crop && PAD[size],
          className,
        )}
      >
        <img
          // respeita o base do Vite ('./'), para funcionar também publicado em subpasta
          src={`${import.meta.env.BASE_URL}${edital.logo.replace(/^\//, '')}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className={cn('size-full', crop ? 'object-cover object-left' : 'object-contain')}
        />
      </span>
    );
  }

  const label = edital.marca ?? edital.sigla;
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center font-bold leading-none tracking-tight text-white',
        SIZES[size],
        FONT[size][label.length >= 5 ? 1 : 0],
        className,
      )}
      style={{ background: `linear-gradient(140deg, ${edital.cor}, color-mix(in oklab, ${edital.cor} 70%, #020617))` }}
    >
      {label}
    </span>
  );
}

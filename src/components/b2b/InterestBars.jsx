import { useRef } from 'react';
import { getEditalById } from '../../data/editais.js';
import { gsap, useGSAP, FULL_MOTION } from '../../lib/gsap.js';

/** Barras horizontais de interesse; crescem quando entram na tela. */
export function InterestBars({ data, total }) {
  const root = useRef(null);
  const rows = Object.entries(data)
    .map(([id, alunos]) => ({ edital: getEditalById(id), alunos }))
    .sort((a, b) => b.alunos - a.alunos);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.from('[data-bar]', {
          scaleX: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <ul ref={root} className="space-y-3.5">
      {rows.map(({ edital, alunos }) => {
        const pct = Math.round((alunos / total) * 100);
        return (
          <li
            key={edital.id}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[12rem_1fr_4rem]"
          >
            <span className="truncate text-ink-soft" title={edital.nome}>
              {edital.nome}
            </span>
            <span className="col-span-2 row-start-2 h-2.5 overflow-hidden rounded-full bg-raised sm:col-span-1 sm:row-start-auto">
              <span
                data-bar
                className="block h-full origin-left rounded-full"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
              />
            </span>
            <span className="tabular text-right text-ink">
              {alunos} <span className="text-xs text-faint">({pct}%)</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

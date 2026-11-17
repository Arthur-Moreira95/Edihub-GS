import { useRef } from 'react';
import { BellRing, FileSearch, MessageCircle } from 'lucide-react';
import { gsap, useGSAP, FULL_MOTION } from '../../lib/gsap.js';
import { useTheme } from '../../context/ThemeContext.jsx';

// Padrão de ícones da marca (tile 480×480). No escuro, o azul-marinho do arquivo vira azul-claro
// (variante -dark) para continuar visível sobre o fundo escuro.
const PATTERN = {
  light: `${import.meta.env.BASE_URL}patterns/edihub-icons.svg`,
  dark: `${import.meta.env.BASE_URL}patterns/edihub-icons-dark.svg`,
};

const PASSOS = [
  {
    icon: FileSearch,
    titulo: 'Lemos os editais por você',
    texto: 'Conferimos os sites das organizadoras e o Diário Oficial todos os dias, inclusive as retificações.',
  },
  {
    icon: BellRing,
    titulo: 'Você escolhe o que acompanhar',
    texto: 'Um toque no sino e o vestibular entra no seu radar, com todas as etapas em ordem.',
  },
  {
    icon: MessageCircle,
    titulo: 'Avisamos antes do prazo',
    texto: 'Mensagem no WhatsApp 1, 3 ou 7 dias antes, dizendo o que muda e o que você precisa fazer.',
  },
];

/** Passo a passo com a linha de progresso preenchida pela rolagem (ScrollTrigger). */
export function HowItWorks() {
  const root = useRef(null);
  const { theme } = useTheme();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const dots = gsap.utils.toArray('[data-step-dot]');
        const state = dots.map(() => null);
        const paint = (progress) =>
          dots.forEach((dot, i) => {
            const on = progress >= (i / (dots.length - 1)) * 0.98;
            if (state[i] === on) return;
            state[i] = on;
            // cores via classes de token, para acompanhar a troca de tema (transição no CSS)
            dot.classList.toggle('bg-primary', on);
            dot.classList.toggle('text-white', on);
            dot.classList.toggle('bg-raised', !on);
            dot.classList.toggle('text-faint', !on);
          });
        paint(0);
        gsap.fromTo(
          '[data-progress]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: 0.6,
              onUpdate: (self) => paint(self.progress),
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-line bg-surface/40"
      aria-labelledby="como-funciona"
    >
      {/* fundo com o padrão de ícones: discreto e esmaecendo nas bordas de cima e de baixo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-(--pattern-opacity)"
        style={{
          backgroundImage: `url("${PATTERN[theme]}")`,
          backgroundSize: '420px 420px',
          backgroundRepeat: 'repeat',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 id="como-funciona" className="max-w-xl font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Do PDF de 80 páginas para uma mensagem de uma linha
        </h2>

        <div className="relative mt-12">
          <div className="absolute top-4 right-[16%] left-4 hidden h-px bg-line-strong md:block" aria-hidden>
            <div data-progress className="h-full origin-left bg-primary" />
          </div>
          <ol className="grid gap-8 md:grid-cols-3 md:gap-8">
            {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
              // celular: número à esquerda e conteúdo ao lado (mais compacto); desktop: em coluna
              <li key={titulo} className="relative grid grid-cols-[2rem_1fr] gap-x-4 md:block">
                <span
                  data-step-dot
                  className="relative z-10 grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white transition-colors duration-200"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-ink md:mt-6 md:block">
                    <Icon className="size-5 shrink-0 text-primary-soft md:mb-3 md:size-6" aria-hidden />
                    {titulo}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted md:mt-2">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

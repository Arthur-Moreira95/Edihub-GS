import { useRef } from 'react';
import { BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useEditalParam } from '../../hooks/useEditalParam.js';
import { gsap, useGSAP, FULL_MOTION, REDUCED_MOTION } from '../../lib/gsap.js';
import { Button } from '../ui/Button.jsx';
import { DeadlineRadar, RADAR } from './DeadlineRadar.jsx';
import { OceanBackground } from './OceanBackground.jsx';

/**
 * Hero com o radar de prazos. Único momento de animação orquestrada da página:
 * o título entra, os anéis são traçados, os editais aparecem do mais urgente
 * para o mais distante e o feixe começa a girar, acendendo cada ponto ao passar.
 */
export function Hero() {
  const { editais, openAlerts } = useApp();
  const { openEdital } = useEditalParam();
  const root = useRef(null);
  const radar = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const rings = gsap.utils.toArray('[data-ring]');
        rings.forEach((ring) => {
          const len = 2 * Math.PI * Number(ring.getAttribute('r'));
          gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        });

        const dots = gsap.utils.toArray('[data-dot]').sort((a, b) => Number(a.dataset.dias) - Number(b.dataset.dias));

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .from('[data-hero-line]', { yPercent: 110, duration: 0.9, stagger: 0.12 })
          .from('[data-hero-fade]', { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
          .to(rings, { strokeDashoffset: 0, duration: 1.2, stagger: 0.15, ease: 'power2.inOut' }, 0.2)
          .from('[data-ring-label]', { autoAlpha: 0, duration: 0.4, stagger: 0.1 }, 0.9)
          .from(
            dots,
            {
              scale: 0,
              autoAlpha: 0,
              svgOrigin: (i, el) => el.dataset.origin,
              duration: 0.45,
              stagger: 0.07,
              ease: 'back.out(2.4)',
            },
            1,
          )
          .from('[data-sweep]', { autoAlpha: 0, duration: 0.6 }, '-=0.2')
          .from('[data-readout]', { y: 12, autoAlpha: 0, duration: 0.5 }, '<')
          // devolve o tracejado original do anel de 90 dias
          .add(() => rings.forEach((r) => r.removeAttribute('style')));

        // Feixe: uma volta a cada RADAR.sweep segundos, acendendo os pontos no caminho
        // A rotação é um tween infinito e independente; os halos NÃO ficam na mesma timeline.
        // (Antes, o halo de um ponto perto de 360° terminava depois da volta e esticava a timeline,
        // fazendo o feixe parar alguns segundos a cada volta.)
        const halos = dots.map((dot) => ({
          angle: Number(dot.dataset.angle),
          el: dot.querySelector('[data-halo]'),
        }));
        const pulse = (el) =>
          gsap.fromTo(
            el,
            { attr: { r: 7 }, opacity: 0.7 },
            { attr: { r: 22 }, opacity: 0, duration: 1.1, ease: 'power2.out', overwrite: true },
          );

        let lastAngle = 0;
        const sweep = gsap.to('[data-sweep]', {
          rotation: 360,
          svgOrigin: `${RADAR.c} ${RADAR.c}`,
          duration: RADAR.sweep,
          ease: 'none',
          repeat: -1,
          paused: true,
          onUpdate() {
            // ângulo do feixe nesta volta; acende os pontos que ele cruzou desde o último quadro
            const angle = this.progress() * 360;
            const wrapped = angle < lastAngle; // começou uma volta nova
            halos.forEach((h) => {
              const crossed = wrapped
                ? h.angle > lastAngle || h.angle <= angle
                : h.angle > lastAngle && h.angle <= angle;
              if (crossed) pulse(h.el);
            });
            lastAngle = angle;
          },
        });
        intro.add(() => sweep.play());
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set('[data-sweep]', { rotation: 35, svgOrigin: `${RADAR.c} ${RADAR.c}` });
      });
    },
    { scope: root },
  );

  const total = editais.length;

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-line"
      // gradiente definido por tema em index.css (--hero-bg)
      style={{ background: 'var(--hero-bg)' }}
    >
      <OceanBackground anchorRef={radar} />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-10 pb-12 sm:gap-12 sm:px-6 sm:pt-14 sm:pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        <div>
          <h1 className="font-serif text-[2.6rem] leading-[1.04] font-semibold tracking-tight text-ink sm:text-6xl xl:text-[4.1rem]">
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block">
                Os editais mudam.
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-hero-line className="block text-primary-mist">
                Você fica sabendo.
              </span>
            </span>
          </h1>
          <p data-hero-fade className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft">
            {total} vestibulares públicos, privados e militares monitorados todos os dias. Acompanhe os seus e receba
            prazos e retificações no WhatsApp, explicados em uma frase.
          </p>
          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="action" size="lg" className="w-full sm:w-auto" onClick={() => openAlerts()}>
              <BellRing className="size-5" aria-hidden />
              Ativar alertas grátis
            </Button>
            <Button variant="outline" size="lg" to="/editais" className="w-full text-ink sm:w-auto sm:border-transparent">
              Ver todos os editais
            </Button>
          </div>
          <p data-hero-fade className="mt-6 text-sm text-muted">
            {/* em telas de toque não existe "passar o mouse" */}
            <span className="pointer-coarse:hidden">Passe o mouse ou use Tab nos pontos do radar para ver cada prazo.</span>
            <span className="hidden pointer-coarse:inline">Toque nos pontos do radar para abrir cada edital.</span>
          </p>
        </div>

        <DeadlineRadar ref={radar} editais={editais} onOpen={openEdital} />
      </div>
    </section>
  );
}

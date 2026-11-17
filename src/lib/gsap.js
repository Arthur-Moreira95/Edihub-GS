import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Registro único dos plugins. Componentes importam daqui para garantir o registro.
gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: 'power3.out', duration: 0.6 });

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const FULL_MOTION = '(prefers-reduced-motion: no-preference)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

export { gsap, ScrollTrigger, useGSAP };

import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';

/**
 * Rastro do feixe como numa tela de radar de verdade (fósforo com persistência).
 * - Cada ponto da tela acende quando o feixe passa e decai exponencialmente com o tempo
 *   (brilho = inicial × 0,5^(idade / meia-vida)). O rastro nasce dessa física, não de uma forma fixa.
 * - O decaimento é calculado exatamente a cada quadro a partir da idade de cada trecho do rastro,
 *   em vez de "apagar um pouco" o canvas por quadro (que trava por arredondamento do canal alfa e
 *   deixa um rastro fantasma que nunca some).
 * O ângulo é lido do próprio feixe animado pelo GSAP ([data-sweep]), então fica sempre sincronizado.
 * Cores vêm de --radar-* (index.css). Com prefers-reduced-motion desenha um quadro estático.
 */

const VB = 400; // viewBox do SVG do radar
const C = 200; // centro
const R = 190; // alcance do feixe
const HALF_LIFE = 1.05; // s até o brilho cair pela metade
const MIN_ALPHA = 0.008; // abaixo disso, não desenha
const STEP = 1.25; // resolução angular do rastro (graus)
const STATIC_SPEED = 40; // graus/s usado no quadro estático (movimento reduzido)

const decay = (age) => Math.pow(0.5, age / HALF_LIFE);
// graus do SVG (0 = para cima, sentido horário) -> radianos do canvas (0 = direita)
const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    trail: cs.getPropertyValue('--radar-trail').trim() || '59, 130, 246',
    alpha: parseFloat(cs.getPropertyValue('--radar-trail-alpha')) || 0.5,
  };
}

export function RadarTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const sweepEl = host?.querySelector('[data-sweep]');
    if (!canvas || !sweepEl) return undefined;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let colors = readColors();
    let gradient = null;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let lastAngle = null;
    let lastT = 0;
    let speed = 0; // graus/s, suavizado
    let energy = 0; // 0..1: o rastro "carrega" quando o feixe aparece, em vez de surgir pronto

    function makeGradient() {
      // brilho ao longo do raio: fraco no centro, máximo no meio/fim, levemente mais fraco na borda
      // (usado como máscara sobre o gradiente cônico do rastro)
      const g = ctx.createRadialGradient(C, C, 0, C, C, R);
      g.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      g.addColorStop(0.35, 'rgba(0, 0, 0, 0.85)');
      g.addColorStop(0.75, 'rgba(0, 0, 0, 1)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      return g;
    }

    // Rastro como UM gradiente cônico: contínuo, sem emendas entre fatias.
    // Começa no feixe e anda no sentido horário; o "atrás do feixe" fica no fim do círculo (offset → 1).
    function drawTrail(angle, degPerSec, peak) {
      const maxBack = Math.min(330, degPerSec * HALF_LIFE * Math.log2(peak / MIN_ALPHA));
      if (maxBack <= 0) return;
      const conic = ctx.createConicGradient(toRad(angle), C, C);
      conic.addColorStop(0, `rgba(${colors.trail}, 0)`);
      conic.addColorStop(Math.max(0, 1 - maxBack / 360), `rgba(${colors.trail}, 0)`);
      const steps = 24;
      for (let i = steps; i >= 0; i--) {
        const back = (maxBack * i) / steps;
        const a = peak * decay(back / degPerSec);
        conic.addColorStop(Math.min(1, 1 - back / 360), `rgba(${colors.trail}, ${a.toFixed(4)})`);
      }
      ctx.fillStyle = conic;
      ctx.beginPath();
      ctx.arc(C, C, R, 0, Math.PI * 2);
      ctx.fill();
      // aplica o brilho radial só sobre o rastro
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, VB, VB);
      ctx.globalCompositeOperation = 'source-over';
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
      const scale = (w * dpr) / VB;
      ctx.setTransform(scale, 0, 0, scale, 0, 0); // desenha em unidades do viewBox
      gradient = makeGradient();
      if (!running) drawStatic();
    }

    function wedge(fromDeg, toDeg, alpha) {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(C, C);
      ctx.arc(C, C, R, toRad(fromDeg), toRad(toDeg));
      ctx.closePath();
      ctx.fill();
    }

    // desenha o rastro atrás de `angle` para um feixe girando a `degPerSec`
    function render(angle, degPerSec, strength) {
      ctx.clearRect(0, 0, VB, VB);
      if (degPerSec > 1 && strength > 0) {
        const peak = colors.alpha * strength;
        if (typeof ctx.createConicGradient === 'function') drawTrail(angle, degPerSec, peak);
        else {
          // navegadores antigos sem gradiente cônico: fatias finas
          ctx.fillStyle = `rgb(${colors.trail})`;
          const maxBack = Math.min(330, degPerSec * HALF_LIFE * Math.log2(peak / MIN_ALPHA));
          for (let back = 0; back < maxBack; back += STEP) {
            wedge(angle - back - STEP, angle - back, peak * decay(back / degPerSec));
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(ms) {
      const now = ms / 1000;
      const dt = Math.min(0.1, now - lastT || 0);
      lastT = now;

      const opacity = Number(gsap.getProperty(sweepEl, 'opacity'));
      const visible = opacity > 0.01 && getComputedStyle(sweepEl).visibility !== 'hidden';
      const angle = ((Number(gsap.getProperty(sweepEl, 'rotation')) % 360) + 360) % 360;

      if (visible && lastAngle !== null && dt > 0) {
        let delta = (angle - lastAngle + 360) % 360;
        if (delta > 90) delta = 0; // salto (ex.: aba voltou do segundo plano)
        // velocidade suavizada (a do feixe é constante; isso só absorve a irregularidade dos quadros)
        speed += (delta / dt - speed) * Math.min(1, dt * 6);
      }
      // o rastro se forma ao longo da primeira volta, como um fósforo "carregando"
      energy = visible ? Math.min(1, energy + dt / 1.2) : Math.max(0, energy - dt * 2);
      lastAngle = visible ? angle : null;

      render(angle, speed, energy * Math.max(opacity, 0));
      raf = requestAnimationFrame(frame);
    }

    // movimento reduzido: rastro "congelado" atrás da posição atual do feixe
    function drawStatic() {
      ctx.clearRect(0, 0, VB, VB);
      if (!reduceMotion.matches) return;
      const angle = Number(gsap.getProperty(sweepEl, 'rotation')) || 35;
      render(angle, STATIC_SPEED, 1);
    }

    function sync() {
      const shouldRun = !reduceMotion.matches && onScreen && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        lastT = performance.now() / 1000;
        lastAngle = null;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (reduceMotion.matches) requestAnimationFrame(drawStatic);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(canvas);

    // troca de tema: novas cores
    const mo = new MutationObserver(() => {
      colors = readColors();
      gradient = makeGradient();
      if (!running) drawStatic();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener('change', sync);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduceMotion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 aspect-square w-full"
    />
  );
}

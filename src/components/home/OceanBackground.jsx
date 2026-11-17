import { useEffect, useRef } from 'react';

/**
 * Mar visto de cima, desenhado em <canvas> atrás do hero: a bússola (radar) flutua no meio dele.
 * - Ondulações: linhas de onda que se deslocam devagar, com uma sombra para dar profundidade.
 * - Reflexos: pontos de luz que cintilam na água.
 * - A bússola "flutua": de tempos em tempos uma onda suave se abre a partir da borda do radar.
 * - Mouse: o cursor deixa um rastro de ondas, a água ondula em volta dele e o clique gera uma onda maior.
 * Cores vêm das variáveis --sea-* (index.css), então acompanham o tema.
 * Respeita prefers-reduced-motion (desenha um quadro estático) e pausa fora da tela ou com a aba oculta.
 */

const MAX_DPR = 1.75;
const LINE_GAP = 30; // distância média entre as linhas de onda (px)
const STEP = 10; // resolução horizontal das linhas (px)
const RIPPLE_SPEED = 85; // px/s
const RIPPLE_LIFE = 2.8; // s
const FLOAT_EVERY = 3.2; // s entre as ondas que saem da bússola

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  const num = (name, fallback) => parseFloat(get(name, '')) || fallback;
  return {
    line: get('--sea-line', '147, 197, 253'),
    lineAlpha: num('--sea-line-alpha', 0.1),
    shadow: get('--sea-shadow', '2, 6, 23'),
    shadowAlpha: num('--sea-shadow-alpha', 0.25),
    glint: get('--sea-glint', '219, 234, 254'),
    glintAlpha: num('--sea-glint-alpha', 0.55),
    ripple: get('--sea-ripple', '147, 197, 253'),
    rippleAlpha: num('--sea-ripple-alpha', 0.45),
  };
}

// 0 nas bordas de cima/baixo, 1 no meio: as linhas somem suavemente nas extremidades do hero
function edgeFade(y, h) {
  const top = Math.min(1, y / (h * 0.08));
  const bottom = Math.min(1, (h - y) / (h * 0.22));
  return Math.max(0, Math.min(top, bottom));
}

export function OceanBackground({ anchorRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let colors = readColors();
    let lastFloat = -FLOAT_EVERY + 0.8; // primeira onda da bússola logo após a entrada
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;

    const ripples = [];
    const pointer = { x: -1e4, y: -1e4, sx: -1e4, sy: -1e4, strength: 0, target: 0 };
    const lastSpawn = { x: -1e4, y: -1e4, t: 0 };
    // cristas quebradas: cada linha tem um padrão próprio de trechos e vãos, que desliza devagar
    const crests = Array.from({ length: 80 }, () => ({
      dash: [
        90 + Math.random() * 260,
        30 + Math.random() * 110,
        40 + Math.random() * 160,
        20 + Math.random() * 90,
      ],
      offset: Math.random() * 600,
      drift: (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 14),
    }));
    const glints = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.4,
      size: 0.8 + Math.random() * 1.4,
    }));

    function anchor() {
      const svg = anchorRef?.current?.querySelector('svg');
      if (!svg) return null;
      const r = svg.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      return { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, r: r.width / 2 };
    }

    function addRipple(x, y, strength, startRadius = 0) {
      ripples.push({ x, y, born: now(), strength, r0: startRadius });
      if (ripples.length > 40) ripples.shift();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(reduceMotion.matches ? 0 : now());
    }

    // deslocamento vertical da água num ponto (ondas + bolha do cursor + ondas em expansão)
    function waveY(x, baseY, i, t) {
      let y =
        baseY +
        6 * Math.sin(x * 0.008 + t * 0.55 + i * 1.3) +
        3.5 * Math.sin(x * 0.021 - t * 0.85 + i * 0.7) +
        1.8 * Math.sin(x * 0.047 + t * 1.3 + i * 2.1);

      if (pointer.strength > 0.01) {
        const dx = x - pointer.sx;
        const dy = baseY - pointer.sy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 260) {
          const f = Math.exp(-(d * d) / (2 * 95 * 95));
          y += f * 13 * pointer.strength * Math.sin(t * 3.2 - d * 0.06);
        }
      }

      for (const rp of ripples) {
        const age = t - rp.born;
        const life = 1 - age / RIPPLE_LIFE;
        if (life <= 0) continue;
        const radius = rp.r0 + age * RIPPLE_SPEED;
        if (radius <= 0) continue;
        const dx = x - rp.x;
        const dy = baseY - rp.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const band = d - radius;
        if (band > -50 && band < 50) y += Math.exp(-(band * band) / (2 * 16 * 16)) * 7 * rp.strength * life;
      }
      return y;
    }

    function strokeLines(t, offset, rgb, alpha) {
      const count = Math.ceil(h / LINE_GAP) + 1;
      for (let i = 0; i < count; i++) {
        const baseY = (i + 0.5) * (h / count);
        const fade = edgeFade(baseY, h);
        if (fade <= 0) continue;
        const a = alpha * fade * (0.55 + 0.45 * Math.sin(i * 1.7 + t * 0.35));
        ctx.strokeStyle = `rgba(${rgb}, ${a.toFixed(3)})`;
        const crest = crests[i % crests.length];
        ctx.setLineDash(crest.dash);
        ctx.lineDashOffset = crest.offset + t * crest.drift;
        ctx.beginPath();
        for (let x = -STEP; x <= w + STEP; x += STEP) {
          const y = waveY(x, baseY, i, t) + offset;
          if (x === -STEP) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      // ondulações: sombra (vale da onda) e crista
      strokeLines(t, 4, colors.shadow, colors.shadowAlpha);
      strokeLines(t, 0, colors.line, colors.lineAlpha);

      // reflexos de luz
      for (const g of glints) {
        const gx = g.x * w;
        const gy = g.y * h;
        let intensity = Math.pow(Math.max(0, Math.sin(t * g.speed + g.phase)), 10);
        if (pointer.strength > 0.01) {
          const d = Math.hypot(gx - pointer.sx, gy - pointer.sy);
          if (d < 180) intensity = Math.min(1, intensity + (1 - d / 180) * 0.6 * pointer.strength);
        }
        const a = intensity * colors.glintAlpha * edgeFade(gy, h);
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(${colors.glint}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(gx, gy, g.size * 2.2, g.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ondas em expansão (cursor, clique e bússola)
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rp = ripples[k];
        const age = t - rp.born;
        const life = 1 - age / RIPPLE_LIFE;
        if (life <= 0) {
          ripples.splice(k, 1);
          continue;
        }
        const radius = rp.r0 + age * RIPPLE_SPEED;
        if (radius <= 0) continue; // ondas com atraso (r0 negativo) ainda não começaram
        const a = colors.rippleAlpha * rp.strength * life * life;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(${colors.ripple}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        if (radius > 18) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${colors.ripple}, ${(a * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, radius * 0.72, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    function frame() {
      const t = now();
      // o cursor "arrasta" a água com um pequeno atraso
      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.sy += (pointer.y - pointer.sy) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.06;

      if (t - lastFloat > FLOAT_EVERY) {
        lastFloat = t;
        const a = anchor();
        if (a) addRipple(a.x, a.y, 0.55, a.r * 0.96);
      }

      draw(t);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (running || reduceMotion.matches || !onScreen || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (reduceMotion.matches || !onScreen || document.hidden) {
        pause();
        if (reduceMotion.matches) draw(0);
      } else play();
    }

    // --- interação ---
    function local(e) {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onMove(e) {
      const p = local(e);
      if (pointer.target === 0) {
        pointer.sx = p.x;
        pointer.sy = p.y;
      }
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.target = 1;
      const t = now();
      if (Math.hypot(p.x - lastSpawn.x, p.y - lastSpawn.y) > 55 && t - lastSpawn.t > 0.09) {
        addRipple(p.x, p.y, 0.6);
        lastSpawn.x = p.x;
        lastSpawn.y = p.y;
        lastSpawn.t = t;
      }
    }
    function onLeave() {
      pointer.target = 0;
    }
    function onDown(e) {
      const p = local(e);
      addRipple(p.x, p.y, 1.3);
      addRipple(p.x, p.y, 0.8, -26);
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(host);

    // troca de tema: relê as cores
    const mo = new MutationObserver(() => {
      colors = readColors();
      if (!running) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener('change', sync);
    sync();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', sync);
      reduceMotion.removeEventListener('change', sync);
    };
  }, [anchorRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}

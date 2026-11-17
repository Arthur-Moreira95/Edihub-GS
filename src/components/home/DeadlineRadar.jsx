import { forwardRef, useMemo, useState } from 'react';
import { getNextDeadline } from '../../lib/edital.js';
import { formatLong } from '../../lib/dates.js';
import { daysLabel } from '../ui/DaysLeft.jsx';
import { RadarTrail } from './RadarTrail.jsx';

export const RADAR = { size: 400, c: 200, maxDias: 120, sweep: 9 };
const RINGS = [7, 30, 90];

/**
 * Raio por dias restantes, em faixas: a primeira semana ganha mais espaço porque é
 * onde se concentram os prazos que pedem ação.
 */
export const radius = (dias) => {
  const d = Math.min(Math.max(dias, 0), RADAR.maxDias);
  if (d <= 7) return 44 + (d / 7) * 54;
  if (d <= 30) return 98 + ((d - 7) / 23) * 42;
  return 140 + ((d - 30) / (RADAR.maxDias - 30)) * 46;
};

const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: RADAR.c + r * Math.sin(rad), y: RADAR.c - r * Math.cos(rad) };
};

/**
 * Radar de prazos: cada ponto é um edital, mais perto do centro quanto mais perto o prazo.
 * As animações (traçado dos anéis, entrada dos pontos e giro do feixe) são orquestradas
 * pelo Hero, que conhece a sequência de entrada da página.
 */
export const DeadlineRadar = forwardRef(function DeadlineRadar({ editais, onOpen }, ref) {
  const points = useMemo(() => {
    const list = editais
      .map((e) => ({ edital: e, next: getNextDeadline(e) }))
      .filter((p) => p.next && p.next.dias <= RADAR.maxDias)
      .sort((a, b) => a.next.dias - b.next.dias);
    // ângulo áureo: distribui sem sobreposição e de forma estável
    return list.map((p, i) => {
      const angle = (i * 137.508 + 24) % 360;
      return { ...p, angle, ...polar(radius(p.next.dias), angle) };
    });
  }, [editais]);

  const [activeId, setActiveId] = useState(null);
  const active = points.find((p) => p.edital.id === activeId) ?? points[0];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px]">
      {/* camadas: brilho de fundo -> rastro de fósforo (canvas) -> anéis, feixe e pontos (SVG) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 aspect-square w-full rounded-full"
        style={{
          background:
            'radial-gradient(circle closest-side, color-mix(in oklab, var(--color-primary-strong) 35%, transparent) 0%, color-mix(in oklab, var(--color-navy-900) 25%, transparent) 70%, transparent 98%)',
        }}
      />
      <RadarTrail />
      <svg
        viewBox={`0 0 ${RADAR.size} ${RADAR.size}`}
        className="relative h-auto w-full overflow-visible"
        role="group"
        aria-label="Radar de prazos: editais mais próximos do centro vencem antes"
      >
        {/* eixos */}
        <g className="stroke-primary-soft" strokeOpacity="0.12" strokeWidth="1">
          <line x1={RADAR.c} y1="8" x2={RADAR.c} y2="392" />
          <line x1="8" y1={RADAR.c} x2="392" y2={RADAR.c} />
        </g>

        {/* anéis de 7, 30 e 90 dias */}
        {RINGS.map((d) => (
          <g key={d}>
            <circle
              data-ring
              cx={RADAR.c}
              cy={RADAR.c}
              r={radius(d)}
              fill="none"
              className="stroke-primary-soft"
              strokeOpacity={d === 7 ? 0.5 : 0.22}
              strokeWidth={d === 7 ? 1.4 : 1}
              strokeDasharray={d === 90 ? '2 5' : undefined}
            />
            <text
              data-ring-label
              x={RADAR.c - 6}
              y={RADAR.c - radius(d) - 6}
              textAnchor="end"
              className="fill-muted"
              fontSize="11"
              fontFamily="var(--font-sans)"
            >
              {d} dias
            </text>
          </g>
        ))}

        {/* feixe giratório */}
        {/* feixe: só a borda da frente; o rastro é desenhado pelo RadarTrail (canvas) */}
        <g data-sweep>
          <line
            x1={RADAR.c}
            y1={RADAR.c}
            x2={RADAR.c}
            y2="10"
            className="stroke-primary-mist"
            strokeOpacity="0.85"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 3px rgba(var(--radar-trail), 0.9))' }}
          />
        </g>

        {/* centro: hoje */}
        <circle cx={RADAR.c} cy={RADAR.c} r="22" className="fill-base stroke-primary" strokeWidth="1.5" />
        <text
          x={RADAR.c}
          y={RADAR.c + 4}
          textAnchor="middle"
          className="fill-primary-mist"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          hoje
        </text>

        {/* editais */}
        {points.map((p) => {
          const isActive = active?.edital.id === p.edital.id;
          return (
            <g
              key={p.edital.id}
              data-dot
              data-angle={p.angle}
              data-dias={p.next.dias}
              role="button"
              tabIndex={0}
              aria-label={`${p.edital.nome}: ${p.next.label}, ${daysLabel(p.next.dias).toLowerCase()}`}
              className="cursor-pointer outline-none"
              data-origin={`${p.x} ${p.y}`}
              onMouseEnter={() => setActiveId(p.edital.id)}
              onFocus={() => setActiveId(p.edital.id)}
              onClick={() => onOpen(p.edital.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen(p.edital.id);
                }
              }}
            >
              <circle data-halo cx={p.x} cy={p.y} r="7" fill={p.edital.cor} opacity="0" />
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 8 : 6}
                fill={p.edital.cor}
                className={isActive ? 'stroke-ink' : 'stroke-base'}
                strokeWidth="2"
                style={{ transition: 'r 150ms' }}
              />
              <text
                x={p.x < RADAR.c ? p.x - 11 : p.x + 11}
                y={p.y + 4}
                textAnchor={p.x < RADAR.c ? 'end' : 'start'}
                className={isActive ? 'fill-ink' : 'fill-ink-soft'}
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-sans)"
                pointerEvents="none"
              >
                {p.edital.sigla}
              </text>
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          data-readout
          aria-live="polite"
          className="mx-auto mt-2 flex max-w-sm items-center gap-4 rounded-xl border border-primary/25 bg-base/80 px-4 py-3 backdrop-blur"
        >
          <span className="size-2.5 shrink-0 rounded-full" style={{ background: active.edital.cor }} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{active.edital.nome}</p>
            <p className="truncate text-xs text-muted first-letter:uppercase">
              {active.next.label}, {formatLong(active.next.data)}
            </p>
          </div>
          <p className="tabular shrink-0 font-serif text-xl font-semibold text-primary-mist">
            {daysLabel(active.next.dias)}
          </p>
        </div>
      )}
    </div>
  );
});

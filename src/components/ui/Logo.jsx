import { cn } from '../../lib/cn.js';

/** Wordmark serifado: "Edi" em azul-marinho claro e "hub" em azul vivo, com a bússola. */
export function Logo({ className, compact = false }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight', className)}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="13" stroke="#2563EB" strokeWidth="2.2" />
        <path d="M21.5 10.5 18 18l-7.5 3.5L14 14z" fill="#60A5FA" />
      </svg>
      {!compact && (
        <span>
          <span className="text-primary-mist">Edi</span>
          <span className="text-primary">hub</span>
        </span>
      )}
    </span>
  );
}

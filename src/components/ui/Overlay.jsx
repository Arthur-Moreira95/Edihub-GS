import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap.js';
import { useScrollLock } from '../../hooks/useScrollLock.js';
import { cn } from '../../lib/cn.js';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Base para Modal e Drawer: portal, backdrop, Esc, trava de rolagem, foco preso e
 * animação de entrada/saída com GSAP. O pai renderiza condicionalmente; `close()`
 * anima a saída e só então chama `onClose`.
 *
 * `children` pode ser uma função ({ close }) => ReactNode.
 */
function Overlay({ onClose, label, variant, className, children, initialFocus }) {
  const root = useRef(null);
  const panel = useRef(null);
  const closing = useRef(false);
  const lastFocused = useRef(null);
  useScrollLock(true);

  const { contextSafe } = useGSAP(
    () => {
      // opacity (e não autoAlpha): um painel com visibility:hidden não recebe foco na entrada
      const fromPanel = variant === 'drawer' ? { xPercent: 100 } : { y: 24, scale: 0.98, opacity: 0 };
      gsap
        .timeline({ defaults: { duration: prefersReducedMotion() ? 0 : 0.4 } })
        .from('[data-backdrop]', { autoAlpha: 0, duration: 0.25 })
        .from(panel.current, { ...fromPanel, ease: 'power3.out' }, '<0.05');
    },
    { scope: root },
  );

  const close = useCallback(
    contextSafe(() => {
      if (closing.current) return;
      closing.current = true;
      const toPanel = variant === 'drawer' ? { xPercent: 100 } : { y: 16, autoAlpha: 0 };
      gsap
        .timeline({ defaults: { duration: prefersReducedMotion() ? 0 : 0.28, ease: 'power2.in' }, onComplete: onClose })
        .to(panel.current, toPanel)
        .to('[data-backdrop]', { autoAlpha: 0, duration: 0.2 }, '<0.08');
    }),
    [onClose, variant],
  );

  // Foco: entra no painel e volta para o elemento anterior ao fechar
  useEffect(() => {
    lastFocused.current = document.activeElement;
    const target = initialFocus?.current ?? panel.current?.querySelector(FOCUSABLE) ?? panel.current;
    target?.focus({ preventScroll: true });
    return () => {
      // Só devolve o foco se ninguém (ex.: outra camada aberta) já o assumiu
      const current = document.activeElement;
      if (!current || current === document.body) lastFocused.current?.focus?.({ preventScroll: true });
    };
  }, [initialFocus]);

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    }
    if (event.key === 'Tab') {
      const nodes = [...panel.current.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const content = typeof children === 'function' ? children({ close }) : children;

  return createPortal(
    <div ref={root} className="fixed inset-0 z-[70]" onKeyDown={onKeyDown}>
      <div data-backdrop className="absolute inset-0 bg-scrim/70 backdrop-blur-sm" onClick={close} aria-hidden />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex',
          variant === 'drawer' ? 'justify-end' : 'items-end justify-center p-0 sm:items-center sm:p-4',
        )}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className={cn(
            'pointer-events-auto relative flex flex-col border-line-strong bg-surface shadow-2xl shadow-shade/50 outline-none',
            variant === 'drawer'
              ? 'h-full w-full max-w-xl border-l'
              : 'max-h-[94vh] w-full rounded-t-2xl border sm:max-w-2xl sm:rounded-2xl',
            className,
          )}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-lg text-muted hover:bg-hover hover:text-ink"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          {content}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Modal(props) {
  return <Overlay variant="modal" {...props} />;
}

export function Drawer(props) {
  return <Overlay variant="drawer" {...props} />;
}

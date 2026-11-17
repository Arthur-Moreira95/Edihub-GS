import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { cn } from '../lib/cn.js';

const ToastContext = createContext(null);

const ICONS = { success: CircleCheck, info: Info, warning: TriangleAlert };
const TONES = {
  success: 'text-action-strong',
  info: 'text-primary-soft',
  warning: 'text-alert-soft',
};

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null);
  const Icon = ICONS[toast.tone] ?? Info;

  useGSAP(
    () => {
      gsap.from(ref.current, { y: 16, autoAlpha: 0, duration: 0.35 });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="status"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line-strong bg-raised/95 px-4 py-3 text-sm shadow-2xl shadow-shade/40 backdrop-blur"
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', TONES[toast.tone])} aria-hidden />
      <p className="flex-1 text-ink">{toast.message}</p>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action.onClick();
            onDismiss(toast.id);
          }}
          className="font-semibold text-primary-soft hover:text-primary-mist"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-muted hover:text-ink"
        aria-label="Fechar aviso"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const notify = useCallback(
    (message, { tone = 'success', action, duration = 3200 } = {}) => {
      const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
      setToasts((list) => [...list.slice(-2), { id, message, tone, action }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}

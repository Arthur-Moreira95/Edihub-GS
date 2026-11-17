import { useEffect, useRef } from 'react';

/**
 * Atalho de teclado global. `combo` aceita 'mod+k' (Ctrl ou ⌘) ou uma tecla simples ('Escape').
 */
export function useHotkey(combo, handler, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;
    const [mod, key] = combo.includes('+') ? combo.split('+') : [null, combo];
    const onKey = (event) => {
      const needsMod = mod === 'mod';
      const modPressed = event.ctrlKey || event.metaKey;
      if (needsMod !== modPressed && needsMod) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (needsMod) event.preventDefault();
      ref.current(event);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [combo, enabled]);
}

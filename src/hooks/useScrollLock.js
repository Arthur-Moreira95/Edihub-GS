import { useEffect } from 'react';

let locks = 0;

/** Trava a rolagem do body enquanto `active` for true (suporta camadas sobrepostas). */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    locks += 1;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [active]);
}

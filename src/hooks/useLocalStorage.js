import { useCallback, useEffect, useState } from 'react';

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** useState persistido no localStorage (tolerante a ambientes sem storage). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage indisponível: mantém só em memória */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset];
}

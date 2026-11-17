import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Abre/fecha a gaveta de detalhes via ?edital=<id>, permitindo links diretos. */
export function useEditalParam() {
  const [params, setParams] = useSearchParams();
  const editalId = params.get('edital');

  const openEdital = useCallback(
    (id) =>
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.set('edital', id);
        return next;
      }),
    [setParams],
  );

  const closeEdital = useCallback(
    () =>
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          next.delete('edital');
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  return { editalId, openEdital, closeEdital };
}

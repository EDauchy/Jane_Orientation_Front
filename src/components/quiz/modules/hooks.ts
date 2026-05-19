import { useEffect, useRef } from 'react';

export function useRehydrateOnce(effect: () => void) {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

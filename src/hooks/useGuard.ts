import { useEffect } from 'react';

export const useGuard = <T>(
  item: T,
  loading: boolean,
  hook: () => void,
): void => {
  useEffect(() => {
    if (!item && !loading) {
      hook();
    }
  }, [item, loading]);
};

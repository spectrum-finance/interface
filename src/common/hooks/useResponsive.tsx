import { useCallback, useEffect, useState } from 'react';

export default function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const updateSize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);
  return size;
}

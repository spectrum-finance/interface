import { useEffect, useState } from 'react';

export const useActiveData = <T>(
  data: T[],
): [T, (d: T | null | undefined) => void] => {
  const [activeData, setActiveData] = useState<T>(data[data.length - 1]);

  useEffect(() => {
    setActiveData(data[data.length - 1]);
  }, [data]);

  const setActiveOrLast = (d?: T | null) => {
    setActiveData(d ?? data[data.length - 1]);
  };

  return [activeData, setActiveOrLast];
};

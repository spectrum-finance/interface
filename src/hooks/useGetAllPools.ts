import { AmmPool, Explorer, NetworkPools } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';

export const useGetAllPools = () => {
  const [pools, setPools] = useState<AmmPool[] | null>(null);
  useEffect(() => {
    const network = new Explorer('https://api.ergoplatform.com');
    const poolNetwork = new NetworkPools(network);

    poolNetwork
      .getAll({ limit: 100, offset: 0 })
      .then((data) => setPools(data[0]));
  }, []);

  return pools;
};

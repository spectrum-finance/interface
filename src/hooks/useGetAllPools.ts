import { AmmPool, Explorer, NetworkPools } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';

type PoolsState = AmmPool[] | undefined;

export const useGetAllPools = (): PoolsState => {
  const [pools, setPools] = useState<PoolsState>(undefined);
  useEffect(() => {
    const network = new Explorer('https://api.ergoplatform.com');
    const poolNetwork = new NetworkPools(network);

    poolNetwork
      .getAll({ limit: 100, offset: 0 })
      .then((data) => setPools(data[0]));
  }, []);

  return pools;
};

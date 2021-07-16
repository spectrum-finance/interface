import { AmmPool, NetworkPools } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';
import { explorer } from '../utils/explorer';

type PoolsState = AmmPool[] | undefined;

export const useGetAllPools = (): PoolsState => {
  const [pools, setPools] = useState<PoolsState>(undefined);
  useEffect(() => {
    const network = explorer;
    const poolNetwork = new NetworkPools(network);

    poolNetwork
      .getAll({ limit: 100, offset: 0 })
      .then((data) => setPools(data[0]));
  }, []);

  return pools;
};

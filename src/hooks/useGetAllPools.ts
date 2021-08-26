import { AmmPool } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';
import { networkPools, nativeNetworkPools } from '../services/networkPools';

type PoolsState = AmmPool[] | undefined;

export const useGetAllPools = (): PoolsState => {
  const [pools, setPools] = useState<PoolsState>(undefined);
  useEffect(() => {
    nativeNetworkPools()
      .getAll({ limit: 100, offset: 0 })
      .then((data) =>
        networkPools()
          .getAll({ limit: 100, offset: 0 })
          .then((data2) => data[0].concat(data2[0])),
      )
      .then((pools) => setPools(pools));
  }, []);

  return pools;
};

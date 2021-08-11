import { AmmPool } from 'ergo-dex-sdk';
import { useEffect, useState } from 'react';
import poolNetwork from '../services/networkPools';

type PoolsState = AmmPool[] | undefined;

export const useGetAllPools = (): PoolsState => {
  const [pools, setPools] = useState<PoolsState>(undefined);
  useEffect(() => {
    poolNetwork
      .getAll({ limit: 100, offset: 0 })
      .then((data) => setPools(data[0]));
  }, []);

  return pools;
};

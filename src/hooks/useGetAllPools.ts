import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { useEffect, useState } from 'react';

import { nativeNetworkPools, networkPools } from '../services/networkPools';

type PoolsState = AmmPool[] | undefined;

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

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
      .then((pools) =>
        setPools(pools.filter((p) => p.id != BlacklistedPoolId)),
      );
  }, []);

  return pools;
};

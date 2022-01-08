import { PoolId } from '@ergolabs/ergo-dex-sdk';

import { AmmPool } from '../common/models/AmmPool';
// import { useNetworkPools } from './useNetworkPools';
import { useGetAllPools } from './useGetAllPools';

const usePosition = (poolId: PoolId): AmmPool | undefined => {
  const positions = useGetAllPools();
  const pl = positions?.find((position) => position.id === poolId);
  return pl ? new AmmPool(pl) : undefined;
};

export { usePosition };

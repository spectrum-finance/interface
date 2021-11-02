import { AmmPool, PoolId } from '@ergolabs/ergo-dex-sdk';

import { useNetworkPools } from './useNetworkPools';

const usePosition = (poolId: PoolId): AmmPool | undefined => {
  const positions = useNetworkPools();
  return positions?.find((position) => position.id === poolId);
};

export { usePosition };

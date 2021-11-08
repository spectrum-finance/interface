import { AmmPool } from '@ergolabs/ergo-dex-sdk';

import { useNetworkPools } from './useNetworkPools';

const usePositionsByPair = (x: string, y: string): AmmPool | undefined => {
  const positions = useNetworkPools();
  return positions?.find(
    (position) => position.x.asset.name === x && position.y.asset.name === y,
  );
};

export { usePositionsByPair };

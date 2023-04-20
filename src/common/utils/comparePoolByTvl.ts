import { AmmPool } from '../models/AmmPool';

export const comparePoolByTvl = (poolA: AmmPool, poolB: AmmPool): number => {
  if (!poolA.tvl) {
    return 1;
  }
  if (!poolB.tvl) {
    return -1;
  }
  return Number(poolB.tvl.toAmount()) - Number(poolA.tvl.toAmount());
};

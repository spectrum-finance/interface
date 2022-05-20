import { VERIFIED_POOLS } from '../mappers/verifiedPoolsMapper';

export const getVerifiedPoolByName = (poolId: string) =>
  VERIFIED_POOLS.get(poolId);

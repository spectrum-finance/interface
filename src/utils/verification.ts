import { VERIFIED_POOLS, VerifiedPool } from '../mappers/verifiedPoolsMapper';

export const getVerifiedPoolByName = (
  poolId: string,
): VerifiedPool | undefined => VERIFIED_POOLS.get(poolId);

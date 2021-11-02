import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { TOKENS_MAPPER } from '../constants/mapper';
import { VERIFIED_POOLS } from '../constants/verifiedPools';

export const isVerifiedToken = (token: AssetInfo): boolean => {
  return Object.keys(TOKENS_MAPPER).some((key) => {
    return key === token.name && TOKENS_MAPPER[key] === token.id;
  });
};

export const isVerifiedPool = (pool: AmmPool): boolean => {
  return Object.values(VERIFIED_POOLS).some((poolId) => {
    return poolId === pool.id;
  });
};

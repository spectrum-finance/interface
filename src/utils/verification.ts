import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { TokenId } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { VERIFIED_TOKENS } from '../constants/varifiedTokens';
import { VERIFIED_POOLS } from '../constants/verifiedPools';

export const isVerifiedToken = (token: AssetInfo): boolean =>
  VERIFIED_TOKENS.has(token.id);

export const isVerifiedPool = (pool: AmmPool): boolean =>
  VERIFIED_POOLS.has(pool.id);

export const getVerifiedTokenNameById = (
  tokenId: TokenId,
): string | undefined => VERIFIED_TOKENS.get(tokenId);

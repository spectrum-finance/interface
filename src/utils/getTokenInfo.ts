import { AssetInfo, TokenId } from '@ergolabs/ergo-sdk';

import { explorer } from '../services/explorer';

export const getTokenInfo = (
  tokenId: TokenId,
): Promise<AssetInfo | undefined> => explorer.getFullTokenInfo(tokenId);

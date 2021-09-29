import explorer from '../services/explorer';
import { AssetInfo, TokenId } from '@ergolabs/ergo-sdk';

export const getTokenInfo = (
  tokenId: TokenId,
): Promise<AssetInfo | undefined> => explorer.getFullTokenInfo(tokenId);

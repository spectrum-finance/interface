import { AssetInfo, TokenId } from 'ergo-dex-sdk/build/module/ergo';
import explorer from '../services/explorer';

export const getTokenInfo = (
  tokenId: TokenId,
): Promise<AssetInfo | undefined> => explorer.getFullTokenInfo(tokenId);

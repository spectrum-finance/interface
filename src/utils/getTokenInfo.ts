import { Explorer } from 'ergo-dex-sdk';
import { AssetInfo, TokenId } from 'ergo-dex-sdk/build/module/ergo';
import { explorer } from './explorer';

export const getTokenInfo = (
  tokenId: TokenId,
): Promise<AssetInfo | undefined> => {
  const network = explorer;

  return network.getFullTokenInfo(tokenId);
};

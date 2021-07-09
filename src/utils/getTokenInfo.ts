import { Explorer } from 'ergo-dex-sdk';
import { AssetInfo, TokenId } from 'ergo-dex-sdk/build/module/ergo';

export const getTokenInfo = (
  tokenId: TokenId,
): Promise<AssetInfo | undefined> => {
  const network = new Explorer('https://api.ergoplatform.com');

  return network.getToken(tokenId);
};

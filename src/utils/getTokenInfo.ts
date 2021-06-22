import { Explorer } from 'ergo-dex-sdk';

export const getTokenInfo = (tokenId: string) => {
  const network = new Explorer('https://api.ergoplatform.com');

  return network.getToken(tokenId);
};

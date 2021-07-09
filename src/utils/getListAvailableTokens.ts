import { ErgoBox, TokenId } from 'ergo-dex-sdk/build/module/ergo';

type Asset = {
  tokenName?: string;
  tokenId: string;
  amount: number;
  decimals?: number;
};

type AssetDictionary = Record<TokenId, Asset>;

export const getListAvailableTokens = (boxes: ErgoBox[]): AssetDictionary => {
  const assetDict: AssetDictionary = {};
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = 0; j < boxes[i].assets.length; j += 1) {
      const { tokenId, amount, decimals, name } = boxes[i].assets[j];

      if (tokenId in assetDict) {
        assetDict[tokenId].amount += amount;
      } else {
        assetDict[tokenId] = { amount, tokenId, decimals, tokenName: name };
      }
    }
  }

  return assetDict;
};

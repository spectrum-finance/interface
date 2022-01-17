import { ErgoBox, TokenId } from '@ergolabs/ergo-sdk';

export type Asset = {
  tokenName?: string;
  tokenId: string;
  amount: bigint;
  decimals?: number;
};

// export const isAsset = (value: any): value is Asset => !!value?.tokenId;

export type AssetDictionary = Record<TokenId, Asset>;

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

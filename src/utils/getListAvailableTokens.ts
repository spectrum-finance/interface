export const getListAvailableTokens = (boxes: any) => {
  const assetDict: {
    [key: string]: {
      tokenName: string;
      tokenId: string;
      amount: number;
      decimals: number;
    };
  } = {};
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

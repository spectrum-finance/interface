import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';

export const calculateAvailableAmount = (
  tokenId: string,
  boxes: ErgoBox[],
): bigint => {
  return boxes
    .flatMap(({ assets }) => assets)
    .filter((a) => a.tokenId == tokenId)
    .map(({ amount }) => amount)
    .reduce((acc, x) => acc + x, 0n);
};

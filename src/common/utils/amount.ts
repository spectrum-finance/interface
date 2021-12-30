import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

export const getDecimalsCount = (amount: string) => {
  const decimals = amount.split('.')[1];

  if (decimals) {
    return decimals.length;
  }
  return 0;
};

export const normalizeAmount = (amount: string, asset: AssetInfo) => {
  const currentDecimalsCount = getDecimalsCount(amount);

  if (currentDecimalsCount <= (asset.decimals || 0)) {
    return amount;
  }

  return amount.slice(
    0,
    amount.length - currentDecimalsCount + (asset.decimals || 0),
  );
};

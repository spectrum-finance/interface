import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';

import { Currency } from '../models/Currency';

export const usdAsset: AssetInfo = {
  id: 'USD',
  name: 'USD',
  decimals: 2,
};

export const emptyUsdCurrency = new Currency(0n, usdAsset);

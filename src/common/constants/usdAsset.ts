import { AssetInfo } from '../models/AssetInfo';
import { Currency } from '../models/Currency';

export const usdAsset: AssetInfo = {
  id: 'USD',
  name: 'USD',
  prefix: '$',
  decimals: 2,
};

export const emptyUsdCurrency = new Currency(0n, usdAsset);

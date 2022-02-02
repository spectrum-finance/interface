import { AssetAmount, AssetInfo } from '@ergolabs/ergo-sdk';

import { Currency } from '../common/models/Currency';

const mockAmount = 111n;

const mockAssetInfo: AssetInfo = {
  name: 'ERG',
  decimals: 9,
  id: '0000000000000000000',
};

export const mockAsset = new AssetAmount(mockAssetInfo, mockAmount);

export const mockCurrency = new Currency(mockAmount, mockAssetInfo);

import React, { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { AssetTitle } from '../../../../AssetTitle/AssetTitle';
import { AssetBox } from '../AssetBox/AssetBox';

export interface SingleAssetBoxProps {
  readonly currency: Currency;
}

export const SingleAssetBox: FC<SingleAssetBoxProps> = ({ currency }) => (
  <AssetBox
    title={<AssetTitle level={5} asset={currency.asset} gap={1} />}
    value={currency.toString(Math.max(currency.asset.decimals || 0, 2), 2)}
  />
);

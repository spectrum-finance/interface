import React, { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { AssetBox } from '../../../../common/cells/SwapAssetCell/AssetBox/AssetBox';

export interface SingleAssetDetailProps {
  readonly currency: Currency;
}

export const SingleAssetDetail: FC<SingleAssetDetailProps> = ({ currency }) => (
  <AssetBox currency={currency} />
);

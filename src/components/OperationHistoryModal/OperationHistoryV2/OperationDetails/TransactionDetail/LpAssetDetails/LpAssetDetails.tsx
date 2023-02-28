import React, { FC } from 'react';

import { AssetInfo } from '../../../../../../common/models/AssetInfo';
import { Currency } from '../../../../../../common/models/Currency';
import { AssetBox } from '../../../../common/cells/SwapAssetCell/AssetBox/AssetBox';

export interface LpAssetDetailsProps {
  readonly currencies: [AssetInfo, AssetInfo, Currency];
}

export const LpAssetDetails: FC<LpAssetDetailsProps> = ({ currencies }) => {
  return <AssetBox currency={currencies} />;
};

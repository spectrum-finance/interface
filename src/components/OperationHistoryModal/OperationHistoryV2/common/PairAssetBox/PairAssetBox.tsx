import { FC } from 'react';

import { Currency } from '../../../../../common/models/Currency';
import { AssetPairTitle } from '../../../../AssetPairTitle/AssetPairTitle';
import { ConvenientAssetView } from '../../../../ConvenientAssetView/ConvenientAssetView';
import { AssetBox } from '../AssetBox/AssetBox';

export interface SingleAssetBoxProps {
  readonly pair: [Currency, Currency];
}

export const PairAssetBox: FC<SingleAssetBoxProps> = ({ pair }) => (
  <AssetBox
    title={
      <AssetPairTitle
        level={5}
        assetX={pair[0].asset}
        assetY={pair[1].asset}
        gap={1}
      />
    }
    value={<ConvenientAssetView sensitive value={pair} />}
  />
);

import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { AssetBox } from '../../../../common/cells/SwapAssetCell/AssetBox/AssetBox';

export interface AssetPairDetailProps {
  readonly pair: [Currency, Currency];
}

export const AssetPairDetail: FC<AssetPairDetailProps> = ({ pair }) => (
  <Flex col>
    <Flex.Item marginBottom={0.5}>
      <AssetBox currency={pair[0]} />
    </Flex.Item>
    <AssetBox currency={pair[1]} />
  </Flex>
);

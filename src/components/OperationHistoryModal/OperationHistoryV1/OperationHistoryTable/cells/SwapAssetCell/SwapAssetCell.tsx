import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { ArrowIcon } from './ArrowIcon/ArrowIcon';
import { AssetBox } from './AssetBox/AssetBox';

export interface SwapAssetCellProps {
  readonly base: Currency;
  readonly quote: Currency;
}

export const SwapAssetCell: FC<SwapAssetCellProps> = ({ base, quote }) => (
  <Flex col width={188}>
    <Flex.Item marginBottom={1}>
      <AssetBox currency={base} />
    </Flex.Item>
    <ArrowIcon />
    <Flex.Item>
      <AssetBox currency={quote} />
    </Flex.Item>
  </Flex>
);

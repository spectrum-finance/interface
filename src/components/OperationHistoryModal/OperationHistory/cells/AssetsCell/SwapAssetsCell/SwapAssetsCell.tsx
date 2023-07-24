import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { SwapItem } from '../../../../../../common/models/OperationV2';
import { SingleAssetBox } from '../../../common/SingleAssetBox/SingleAssetBox';
import { ArrowIcon } from './ArrowIcon/ArrowIcon';

export interface SwapAssetsCellProps {
  readonly swapItem: SwapItem;
}

export const SwapAssetsCell: FC<SwapAssetsCellProps> = ({ swapItem }) => (
  <Flex col width={200}>
    <Flex.Item marginBottom={0.5}>
      <SingleAssetBox currency={swapItem.base} />
    </Flex.Item>
    <ArrowIcon />
    <Flex.Item>
      <SingleAssetBox currency={swapItem.quote} />
    </Flex.Item>
  </Flex>
);

import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { SwapItem } from '../../../../../../network/ergo/api/operations/history/v2/types/SwapOperation';
import { ArrowIcon } from '../../../../OperationHistoryV1/OperationHistoryTable/cells/SwapAssetCell/ArrowIcon/ArrowIcon';
import { AssetBox } from '../../../../OperationHistoryV1/OperationHistoryTable/cells/SwapAssetCell/AssetBox/AssetBox';

export interface SwapAssetsCellProps {
  readonly swapItem: SwapItem;
}

export const SwapAssetsCell: FC<SwapAssetsCellProps> = ({ swapItem }) => (
  <Flex col width={188}>
    <Flex.Item marginBottom={0.5}>
      <AssetBox currency={swapItem.base} />
    </Flex.Item>
    <ArrowIcon />
    <Flex.Item>
      <AssetBox currency={swapItem.quote} />
    </Flex.Item>
  </Flex>
);

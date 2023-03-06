import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AddLiquidityItem } from '../../../../../../network/ergo/api/operations/history/v2/types/AddLiquidityOperation';
import { AssetBox } from '../../../common/AssetBox/AssetBox';
import { SingleAssetBox } from '../../../common/SingleAssetBox/SingleAssetBox';

export interface SwapAssetsCellProps {
  readonly operationItem: AddLiquidityItem;
}

export const OtherOperationAssetsCell: FC<SwapAssetsCellProps> = ({
  operationItem,
}) => (
  <Flex col width={188}>
    <Flex.Item marginBottom={0.5}>
      <SingleAssetBox currency={operationItem.x} />
    </Flex.Item>
    <Flex.Item>
      <SingleAssetBox currency={operationItem.y} />
    </Flex.Item>
  </Flex>
);

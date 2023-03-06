import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AddLiquidityItem } from '../../../../../../network/ergo/api/operations/history/v2/types/AddLiquidityOperation';
import { SingleAssetBox } from '../../../common/SingleAssetBox/SingleAssetBox';

export interface AddLiquidityAssetsCellProps {
  readonly addLiquidityItem: AddLiquidityItem;
}

export const AddLiquidityAssetsCell: FC<AddLiquidityAssetsCellProps> = ({
  addLiquidityItem,
}) => (
  <Flex col width={200}>
    <Flex.Item marginBottom={0.5}>
      <SingleAssetBox currency={addLiquidityItem.x} />
    </Flex.Item>
    <Flex.Item>
      <SingleAssetBox currency={addLiquidityItem.y} />
    </Flex.Item>
  </Flex>
);

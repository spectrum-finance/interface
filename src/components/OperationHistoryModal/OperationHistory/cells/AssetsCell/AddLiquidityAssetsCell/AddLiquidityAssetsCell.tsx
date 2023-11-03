import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AddLiquidityItem } from '../../../../../../common/models/OperationV2';
import { SingleAssetBox } from '../../../common/SingleAssetBox/SingleAssetBox';

export interface AddLiquidityAssetsCellProps {
  readonly addLiquidityItem: AddLiquidityItem;
}

export const AddLiquidityAssetsCell: FC<AddLiquidityAssetsCellProps> = ({
  addLiquidityItem,
}) => (
  <Flex col width={215}>
    <Flex.Item marginBottom={0.5}>
      <SingleAssetBox currency={addLiquidityItem.x} />
    </Flex.Item>
    <Flex.Item>
      <SingleAssetBox currency={addLiquidityItem.y} />
    </Flex.Item>
  </Flex>
);

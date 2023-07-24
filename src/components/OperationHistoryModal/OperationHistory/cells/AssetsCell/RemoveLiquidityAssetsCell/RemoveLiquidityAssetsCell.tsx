import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { RemoveLiquidityItem } from '../../../../../../common/models/OperationV2';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface RemoveLiquidityAssetsCellProps {
  readonly removeLiquidityItem: RemoveLiquidityItem;
}

export const RemoveLiquidityAssetsCell: FC<RemoveLiquidityAssetsCellProps> = ({
  removeLiquidityItem,
}) => (
  <Flex col width={200}>
    <PairAssetBox
      pair={removeLiquidityItem.pool.shares(removeLiquidityItem.lp)}
    />
  </Flex>
);

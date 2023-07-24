import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { LockItem } from '../../../../../../common/models/OperationV2';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LockAssetsCellProps {
  readonly lockItem: LockItem;
}

export const LockAssetsCell: FC<LockAssetsCellProps> = ({ lockItem }) => (
  <Flex col width={200}>
    <PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />
  </Flex>
);

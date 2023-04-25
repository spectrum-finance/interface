import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { LockItem } from '../../../../../../network/ergo/api/operations/history/v2/types/LockOperation';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LockAssetsCellProps {
  readonly lockItem: LockItem;
}

export const LockAssetsCell: FC<LockAssetsCellProps> = ({ lockItem }) => (
  <Flex col width={200}>
    <PairAssetBox pair={lockItem.pool.shares(lockItem.lp)} />
  </Flex>
);

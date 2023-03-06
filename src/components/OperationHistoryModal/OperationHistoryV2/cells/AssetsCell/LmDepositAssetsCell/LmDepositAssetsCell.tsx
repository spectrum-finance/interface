import { Flex } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { LmDepositItem } from '../../../../../../network/ergo/api/operations/history/v2/types/LmDepositOperation';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LmDepositAssetsCellProps {
  readonly lmDepositItem: LmDepositItem;
}

export const LmDepositAssetsCell: FC<LmDepositAssetsCellProps> = ({
  lmDepositItem,
}) => (
  <Flex col width={200}>
    <PairAssetBox pair={lmDepositItem.pool.shares(lmDepositItem.input)} />
  </Flex>
);

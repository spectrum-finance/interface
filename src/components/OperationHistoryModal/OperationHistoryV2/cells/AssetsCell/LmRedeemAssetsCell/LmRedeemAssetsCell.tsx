import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { LmRedeemItem } from '../../../../../../network/ergo/api/operations/history/v2/types/LmRedeemOperation';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LmDepositAssetsCellProps {
  readonly lmRedeemItem: LmRedeemItem;
}

export const LmRedeemAssetsCell: FC<LmDepositAssetsCellProps> = ({
  lmRedeemItem,
}) => (
  <Flex col width={200}>
    <PairAssetBox pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)} />
  </Flex>
);

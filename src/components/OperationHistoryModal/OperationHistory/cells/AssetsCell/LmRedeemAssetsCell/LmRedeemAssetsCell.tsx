import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { LmRedeemItem } from '../../../../../../common/models/OperationV2';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LmDepositAssetsCellProps {
  readonly lmRedeemItem: LmRedeemItem;
}

export const LmRedeemAssetsCell: FC<LmDepositAssetsCellProps> = ({
  lmRedeemItem,
}) => (
  <Flex col width={215}>
    <PairAssetBox pair={lmRedeemItem.pool.shares(lmRedeemItem.lq)} />
  </Flex>
);

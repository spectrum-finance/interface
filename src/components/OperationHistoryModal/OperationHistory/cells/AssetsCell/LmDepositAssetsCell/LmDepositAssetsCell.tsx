import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { LmDepositItem } from '../../../../../../common/models/OperationV2';
import { PairAssetBox } from '../../../common/PairAssetBox/PairAssetBox';

export interface LmDepositAssetsCellProps {
  readonly lmDepositItem: LmDepositItem;
}

export const LmDepositAssetsCell: FC<LmDepositAssetsCellProps> = ({
  lmDepositItem,
}) => (
  <Flex col width={215}>
    <PairAssetBox pair={lmDepositItem.pool.shares(lmDepositItem.input)} />
  </Flex>
);

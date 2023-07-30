import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { RemoveLiquidityItem } from '../../../../../../common/models/OperationV2';
import { LpAssetBox } from '../../../common/LpAssetBox/LpAssetBox';

export interface RemoveLiquidityAssetsCellProps {
  readonly removeLiquidityItem: RemoveLiquidityItem;
}

export const RemoveLiquidityAssetsCell: FC<RemoveLiquidityAssetsCellProps> = ({
  removeLiquidityItem,
}) => {
  return (
    <Flex col width={200}>
      <LpAssetBox
        lpCurrency={removeLiquidityItem.lp}
        xCurrency={removeLiquidityItem.x}
        yCurrency={removeLiquidityItem.y}
      />
    </Flex>
  );
};

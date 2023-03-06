import React, { FC } from 'react';

import { OperationType } from '../../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { OperationItem } from '../../../../../network/ergo/api/operations/history/v2/types/OperationItem';
import { OtherOperationAssetsCell } from './OtherOperationAssetsCell/OtherOperationAssetsCell';
import { SwapAssetsCell } from './SwapAssetsCell/SwapAssetsCell';

export interface AssetsCellProps {
  readonly operationItem: OperationItem;
}

export const AssetsCell: FC<AssetsCellProps> = ({ operationItem }) => (
  <>
    {operationItem.type === OperationType.Swap && (
      <SwapAssetsCell swapItem={operationItem} />
    )}
    {operationItem.type === OperationType.AddLiquidity && (
      <OtherOperationAssetsCell operationItem={operationItem} />
    )}
  </>
);

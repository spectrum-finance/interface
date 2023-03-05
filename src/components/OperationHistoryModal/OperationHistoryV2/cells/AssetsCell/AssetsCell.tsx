import React, { FC } from 'react';

import { OperationItem } from '../../../../../network/ergo/api/operations/history/v2/types/OperationItem';
import { SwapAssetsCell } from './SwapAssetsCell/SwapAssetsCell';

export interface AssetsCellProps {
  readonly operationItem: OperationItem;
}

export const AssetsCell: FC<AssetsCellProps> = ({ operationItem }) => (
  <SwapAssetsCell swapItem={operationItem} />
);

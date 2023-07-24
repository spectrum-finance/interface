import { FC } from 'react';

import {
  OperationItem,
  OperationType,
} from '../../../../../common/models/OperationV2';
import { AddLiquidityAssetsCell } from './AddLiquidityAssetsCell/AddLiquidityAssetsCell';
import { LmDepositAssetsCell } from './LmDepositAssetsCell/LmDepositAssetsCell';
import { LmRedeemAssetsCell } from './LmRedeemAssetsCell/LmRedeemAssetsCell';
import { LockAssetsCell } from './LockAssetsCell/LockAssetsCell';
import { RemoveLiquidityAssetsCell } from './RemoveLiquidityAssetsCell/RemoveLiquidityAssetsCell';
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
      <AddLiquidityAssetsCell addLiquidityItem={operationItem} />
    )}
    {operationItem.type === OperationType.RemoveLiquidity && (
      <RemoveLiquidityAssetsCell removeLiquidityItem={operationItem} />
    )}
    {operationItem.type === OperationType.LmDeposit && (
      <LmDepositAssetsCell lmDepositItem={operationItem} />
    )}
    {operationItem.type === OperationType.LmRedeem && (
      <LmRedeemAssetsCell lmRedeemItem={operationItem} />
    )}
    {operationItem.type === OperationType.LockLiquidity && (
      <LockAssetsCell lockItem={operationItem} />
    )}
    {operationItem.type === OperationType.ReLockLiquidity && (
      <LockAssetsCell lockItem={operationItem} />
    )}
    {operationItem.type === OperationType.WithdrawLock && (
      <LockAssetsCell lockItem={operationItem} />
    )}
  </>
);

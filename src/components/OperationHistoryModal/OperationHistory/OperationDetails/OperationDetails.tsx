import { FC } from 'react';

import {
  OperationItem,
  OperationType,
} from '../../../../common/models/OperationV2';
import { ExpandComponentProps } from '../../../TableView/common/Expand';
import { AddLiquidityOperationDetails } from './AddLiquidityOperationDetails/AddLiquidityOperationDetails';
import { LmDepositOperationDetails } from './LmDepositOperationDetails/LmDepositOperationDetails';
import { LmRedeemOperationDetails } from './LmRedeemOperationDetails/LmRedeemOperationDetails';
import { LockOperationDetails } from './LockOperationDetails/LockOperationDetails';
import { RemoveLiquidityOperationDetails } from './RemoveLiquidityOperationDetails/RemoveLiquidityOperationDetails';
import { SwapOperationDetails } from './SwapOperationDetails/SwapOperationDetails';

export const OperationDetails: FC<ExpandComponentProps<OperationItem>> = ({
  item,
}) => (
  <>
    {item.type === OperationType.Swap && (
      <SwapOperationDetails swapItem={item} />
    )}
    {item.type === OperationType.AddLiquidity && (
      <AddLiquidityOperationDetails addLiquidityItem={item} />
    )}
    {item.type === OperationType.RemoveLiquidity && (
      <RemoveLiquidityOperationDetails removeLiquidityItem={item} />
    )}
    {item.type === OperationType.LmDeposit && (
      <LmDepositOperationDetails lmDepositItem={item} />
    )}
    {item.type === OperationType.LmRedeem && (
      <LmRedeemOperationDetails lmRedeemItem={item} />
    )}
    {item.type === OperationType.LockLiquidity && (
      <LockOperationDetails lockItem={item} />
    )}
    {item.type === OperationType.WithdrawLock && (
      <LockOperationDetails lockItem={item} />
    )}
    {item.type === OperationType.ReLockLiquidity && (
      <LockOperationDetails lockItem={item} />
    )}
  </>
);

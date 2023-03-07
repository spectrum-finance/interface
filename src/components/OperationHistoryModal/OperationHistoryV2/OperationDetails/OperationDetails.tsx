import React, { FC } from 'react';

import { OperationType } from '../../../../network/ergo/api/operations/history/v2/types/BaseOperation';
import { OperationItem } from '../../../../network/ergo/api/operations/history/v2/types/OperationItem';
import { ExpandComponentProps } from '../../../TableView/common/Expand';
import { AddLiquidityOperationDetails } from './AddLiquidityOperationDetails/AddLiquidityOperationDetails';
import { LmDepositOperationDetails } from './LmDepositOperationDetails/LmDepositOperationDetails';
import { LmRedeemOperationDetails } from './LmRedeemOperationDetails/LmRedeemOperationDetails';
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
  </>
);

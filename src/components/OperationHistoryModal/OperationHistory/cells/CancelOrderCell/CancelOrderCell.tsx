import { Button, Tooltip } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { first } from 'rxjs';

import {
  OperationItem,
  OperationStatus,
  OperationType,
} from '../../../../../common/models/OperationV2.ts';
import { refund } from '../../../../../gateway/api/operations/refund.ts';

interface CancelOrderCellProps {
  readonly operationItem: OperationItem;
}

export const CancelOrderCell: FC<CancelOrderCellProps> = ({
  operationItem,
}) => {
  const isDisabled =
    operationItem.status === OperationStatus.Refunded ||
    operationItem.status === OperationStatus.Evaluated ||
    operationItem.status === OperationStatus.Pending;

  const handleRefundButtonClick = () => {
    const txId = operationItem.registerTx.id;

    switch (operationItem.type) {
      case OperationType.Swap:
        refund(txId, operationItem.base, operationItem.quote)
          .pipe(first())
          .subscribe();
        break;
      case OperationType.AddLiquidity:
        refund(txId, operationItem.x, operationItem.y)
          .pipe(first())
          .subscribe();
        break;
      case OperationType.LmDeposit:
        refund(txId, ...operationItem.pool.shares(operationItem.input))
          .pipe(first())
          .subscribe();
        break;
      case OperationType.RemoveLiquidity:
        refund(txId, ...operationItem.pool.shares(operationItem.lp))
          .pipe(first())
          .subscribe();
        break;
      case OperationType.LmRedeem:
        refund(txId, ...operationItem.pool.shares(operationItem.lq))
          .pipe(first())
          .subscribe();
        break;
      case OperationType.LockLiquidity:
        break;
      case OperationType.ReLockLiquidity:
        break;
      case OperationType.WithdrawLock:
        break;
      default:
        break;
    }
  };

  return (
    <Tooltip
      visible={
        operationItem.status === OperationStatus.Pending ? undefined : false
      }
      title={<Trans>Transaction is in Mempool now</Trans>}
    >
      <div>
        <Button
          type="link"
          disabled={isDisabled}
          onClick={handleRefundButtonClick}
        >
          Cancel
        </Button>
      </div>
    </Tooltip>
  );
};

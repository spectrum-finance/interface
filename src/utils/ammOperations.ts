import { OpStatus } from 'ergo-dex-sdk/build/main/amm/models/ammOperation';

import { RefundParams } from 'ergo-dex-sdk/build/module/models/refundParams';
import { TransactionContext } from 'ergo-dex-sdk/build/module/ergo/wallet/entities/transactionContext';
import { ammOrderRefunds } from './ammOrderRefund';

const validRefundStatuses = ['pending', 'submitted'];

export const isRefundableOperation = (status: OpStatus): boolean =>
  validRefundStatuses.indexOf(status) !== -1;

export const refund = async (
  refundParams: RefundParams,
  txCtx: TransactionContext,
): Promise<void> => {
  try {
    await ammOrderRefunds.refund(refundParams, txCtx);
  } catch (err) {
    console.error(err);
  }
};

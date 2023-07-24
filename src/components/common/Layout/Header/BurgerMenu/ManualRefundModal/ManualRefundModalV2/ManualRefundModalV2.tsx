import {
  Alert,
  Animation,
  Flex,
  Modal,
  ModalRef,
  useDevice,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { CSSProperties, FC, useEffect } from 'react';
import { first } from 'rxjs';

import { useSubject } from '../../../../../../../common/hooks/useObservable';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  OperationItem,
  OperationStatus,
  OperationType,
} from '../../../../../../../common/models/OperationV2';
import { refund } from '../../../../../../../gateway/api/operations/refund';
import { getOperationByTxId } from '../../../../../../../gateway/api/transactionsHistory';
import { TransactionFindForm } from '../common/TransactionFindForm/TransactionFindForm';

const getPairByOperationItem = (
  operationItem: OperationItem,
): [Currency, Currency] => {
  switch (operationItem.type) {
    case OperationType.Swap:
      return [operationItem.base, operationItem.quote];
    case OperationType.AddLiquidity:
      return [operationItem.x, operationItem.y];
    case OperationType.RemoveLiquidity:
      return operationItem.pool.shares(operationItem.lp);
    case OperationType.LmDeposit:
      return operationItem.pool.shares(operationItem.input);
    case OperationType.LmRedeem:
      return operationItem.pool.shares(operationItem.lq);
    case OperationType.ReLockLiquidity:
    case OperationType.LockLiquidity:
    case OperationType.WithdrawLock:
      return operationItem.pool.shares(operationItem.lp);
  }
};

export const ManualRefundModalV2: FC<ModalRef> = ({ close }) => {
  const { valBySize } = useDevice();
  const [operation, requestOperation, operationLoading, operationError] =
    useSubject(getOperationByTxId);

  const findTx = (txId: string) => requestOperation(txId);

  const refundOperation = (operation: OperationItem) => {
    const [xAsset, yAsset] = getPairByOperationItem(operation);

    refund(operation.registerTx.id, xAsset, yAsset).pipe(first()).subscribe();
  };

  let errorMessage: string | undefined = undefined;

  if (operationError) {
    errorMessage = t`Transaction not found`;
  } else if (
    !operationLoading &&
    operation &&
    operation.status !== OperationStatus.NeedRefund
  ) {
    errorMessage = t`Unable to refund a transaction.`;
  }

  useEffect(() => {
    if (
      !!operation &&
      operation.status === OperationStatus.NeedRefund &&
      !operationLoading
    ) {
      close();
      refundOperation(operation);
    }
  }, [operation]);

  return (
    <>
      <Modal.Title>
        <Trans>Manual refund</Trans>
      </Modal.Title>
      <Modal.Content
        width={valBySize<CSSProperties['width']>('100%', 550, 750)}
      >
        <Flex col>
          <TransactionFindForm onSubmit={findTx} loading={operationLoading} />
          <Flex.Item marginTop={!!errorMessage ? 6 : 0}>
            <Animation.Expand
              expanded={!!errorMessage && !operationLoading}
              opacityDelay={true}
            >
              {!!errorMessage && (
                <Alert showIcon type="error" message={errorMessage} />
              )}
            </Animation.Expand>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

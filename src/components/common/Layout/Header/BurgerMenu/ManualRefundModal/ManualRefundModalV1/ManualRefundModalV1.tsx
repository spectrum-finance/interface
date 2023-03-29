import { Alert, Animation, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { CSSProperties, FC, useEffect } from 'react';
import { first } from 'rxjs';

import { useSubject } from '../../../../../../../common/hooks/useObservable';
import { Operation } from '../../../../../../../common/models/Operation';
import { refund } from '../../../../../../../gateway/api/operations/refund';
import { getOperationByTxId } from '../../../../../../../gateway/api/transactionsHistory';
import { TransactionFindForm } from '../common/TransactionFindForm/TransactionFindForm';

export const ManualRefundModalV1: FC<{ close: () => void }> = ({ close }) => {
  const { valBySize } = useDevice();
  const [operation, requestOperation, operationLoading, operationError] =
    useSubject(getOperationByTxId);

  const refundOperation = (operation: Operation) => {
    const payload =
      operation.type === 'swap'
        ? { xAsset: operation.base, yAsset: operation.quote }
        : { xAsset: operation.x, yAsset: operation.y };
    refund(operation.txId, payload.xAsset, payload.yAsset)
      .pipe(first())
      .subscribe();
  };

  const findTx = (txId: string) => requestOperation(txId);

  let errorMessage: string | undefined = undefined;

  if (operationError) {
    errorMessage = t`Transaction not found`;
  } else if (!operationLoading && operation && operation.status !== 'locked') {
    errorMessage = t`Unable to refund a transaction.`;
  }

  useEffect(() => {
    if (!!operation && operation.status === 'locked' && !operationLoading) {
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

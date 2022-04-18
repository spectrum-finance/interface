import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { map, Observable } from 'rxjs';

import { getOperationByTxId } from '../../../../api/transactionsHistory';
import { useSubject } from '../../../../common/hooks/useObservable';
import { Animation, Flex, Modal } from '../../../../ergodex-cdk';
import { Operation } from '../../../common/TxHistory/types';
import { normalizeOperations } from '../../../common/TxHistory/utils';
import { TransactionFindForm } from './TransactionFindForm/TransactionFindForm';
import { TransactionInfo } from './TransactionInfo/TransactionInfo';

const getNormalizedOperationByTxId = (
  txId: string,
): Observable<Operation | undefined> =>
  getOperationByTxId(txId).pipe(
    map((dexOp) => (dexOp ? normalizeOperations([dexOp])[0] : dexOp)),
    map((op) => (op ? { ...op, status: 'pending' } : undefined)),
  );

export const ManualRefundModal: FC<{ close: () => void }> = ({ close }) => {
  const [operation, requestOperation, operationLoading, operationError] =
    useSubject(getNormalizedOperationByTxId);

  const findTx = (txId: string) => requestOperation(txId);

  let errorMessage: string | undefined = undefined;

  if (operationError) {
    errorMessage = t`Transaction not found`;
  } else if (
    !operationLoading &&
    operation &&
    operation.status !== 'pending' &&
    operation.status !== 'submitted'
  ) {
    errorMessage = t`Unable to refund a transaction.`;
  }

  return (
    <>
      <Modal.Title>
        <Trans>Manual refund</Trans>
      </Modal.Title>
      <Modal.Content width={750}>
        <Flex col>
          <TransactionFindForm onSubmit={findTx} loading={operationLoading} />
          <Flex.Item marginTop={!!operation || !!errorMessage ? 6 : 0}>
            <Animation.Expand
              expanded={!!operation || !!errorMessage}
              opacityDelay={true}
            >
              {() => (
                <TransactionInfo
                  operation={operation}
                  close={close}
                  errorMessage={errorMessage}
                />
              )}
            </Animation.Expand>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

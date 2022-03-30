import { t, Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { getOperationByTxId } from '../../../../api/transactionsHistory';
import { useSubject } from '../../../../common/hooks/useObservable';
import { Flex, Modal } from '../../../../ergodex-cdk';
import { TransactionFindForm } from './TransactionFindForm/TransactionFindForm';
import { TransactionInfo } from './TransactionInfo/TransactionInfo';

export const ManualRefundModal: FC = () => {
  const [tx, requestTx, txLoading, txError] = useSubject(getOperationByTxId);

  const findTx = (txId: string) => requestTx(txId);

  let errorMessage: string | undefined = undefined;

  if (txError) {
    errorMessage = t`Transaction not found`;
  } else if (!txLoading && tx && tx.status !== 'refund') {
    errorMessage = t`Unable to refund a transaction.`;
  }

  return (
    <>
      <Modal.Title>
        <Trans>Manual refund</Trans>
      </Modal.Title>
      <Modal.Content width={750}>
        <Flex col>
          <TransactionFindForm
            errorMessage={errorMessage}
            onSubmit={findTx}
            loading={txLoading}
          />
          <TransactionInfo operation={{} as any} />
        </Flex>
      </Modal.Content>
    </>
  );
};

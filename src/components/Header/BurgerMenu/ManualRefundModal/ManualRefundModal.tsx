import { Animation, Flex, Modal, useDevice } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { CSSProperties, FC } from 'react';

import { useSubject } from '../../../../common/hooks/useObservable';
import { getOperationByTxId } from '../../../../gateway/api/transactionsHistory';
import { TransactionFindForm } from './TransactionFindForm/TransactionFindForm';
import { TransactionInfo } from './TransactionInfo/TransactionInfo';

export const ManualRefundModal: FC<{ close: () => void }> = ({ close }) => {
  const { valBySize } = useDevice();
  const [operation, requestOperation, operationLoading, operationError] =
    useSubject(getOperationByTxId);

  const findTx = (txId: string) => requestOperation(txId);

  let errorMessage: string | undefined = undefined;

  if (operationError) {
    errorMessage = t`Transaction not found`;
  } else if (!operationLoading && operation && operation.status !== 'locked') {
    errorMessage = t`Unable to refund a transaction.`;
  }

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
          <Flex.Item marginTop={!!operation || !!errorMessage ? 6 : 0}>
            <Animation.Expand
              expanded={(!!operation || !!errorMessage) && !operationLoading}
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

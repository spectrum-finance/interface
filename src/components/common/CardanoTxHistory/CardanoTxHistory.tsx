import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Modal } from '../../../ergodex-cdk';
import { getTransactionHistory } from '../../../network/cardano/api/transactionHistory/transactionHistory';
import { OperationHistoryTable } from '../../OperationHistoryTable/OperationHistoryTable';

export const CardanoTxHistory: FC = () => {
  const [operations, loading] = useObservable(getTransactionHistory(), []);

  return (
    <>
      <Modal.Title>
        <Trans>Transaction history</Trans>
      </Modal.Title>
      <Modal.Content width={772}>
        <OperationHistoryTable
          loading={loading}
          operations={operations || []}
        />
      </Modal.Content>
    </>
  );
};

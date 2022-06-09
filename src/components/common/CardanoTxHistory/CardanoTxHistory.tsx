import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { DialogRef, Modal } from '../../../ergodex-cdk';
import { getTransactionHistory } from '../../../network/cardano/api/transactionHistory/transactionHistory';
import { OperationHistoryTable } from '../../OperationHistoryTable/OperationHistoryTable';

export const CardanoTxHistory: FC<DialogRef> = ({ close }) => {
  const [operations, loading] = useObservable(getTransactionHistory(), []);

  return (
    <>
      <Modal.Title>
        <Trans>Transaction history</Trans>
      </Modal.Title>
      <Modal.Content width={772}>
        <OperationHistoryTable
          close={close}
          loading={loading}
          operations={operations || []}
        />
      </Modal.Content>
    </>
  );
};

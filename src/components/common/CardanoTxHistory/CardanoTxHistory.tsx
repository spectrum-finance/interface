import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { Modal } from '../../../ergodex-cdk';
import { txHistory$ } from '../../../network/cardano/api/history/txHistory';
import { OperationHistoryTable } from '../../OperationHistoryTable/OperationHistoryTable';

export const CardanoTxHistory: FC = () => {
  const [operations] = useObservable(txHistory$);

  return (
    <>
      <Modal.Title>
        <Trans>Transaction history</Trans>
      </Modal.Title>
      <Modal.Content width={772}>
        <OperationHistoryTable operations={(operations as any) || []} />
      </Modal.Content>
    </>
  );
};

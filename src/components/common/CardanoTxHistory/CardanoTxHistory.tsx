import React, { FC } from 'react';

import { ModalRef } from '../../../ergodex-cdk';
import { getTransactionHistory } from '../../../network/cardano/api/transactionHistory/transactionHistory';
import { OperationHistoryModal } from '../../OperationHistoryModal/OperationHistoryModal';

export const CardanoTxHistory: FC<ModalRef> = ({ close }) => {
  return (
    <OperationHistoryModal
      operationsSource={getTransactionHistory()}
      close={close}
    />
  );
};

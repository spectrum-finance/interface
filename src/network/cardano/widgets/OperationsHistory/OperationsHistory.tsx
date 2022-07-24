import { Button, HistoryOutlined, Modal, Tooltip } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { OperationHistoryModal } from '../../../../components/OperationHistoryModal/OperationHistoryModal';
import { getTransactionHistory } from '../../api/transactionHistory/transactionHistory';

export const OperationsHistory: FC = () => {
  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => (
      <OperationHistoryModal
        operationsSource={getTransactionHistory()}
        close={close}
      />
    ));
  };

  return (
    <Tooltip title={t`Recent transactions`} placement="bottom">
      <Button
        size="large"
        type="ghost"
        icon={<HistoryOutlined />}
        onClick={openOperationsHistoryModal}
      />
    </Tooltip>
  );
};

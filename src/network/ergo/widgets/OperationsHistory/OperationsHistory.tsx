import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { OperationHistoryModal } from '../../../../components/OperationHistoryModal/OperationHistoryModal';
import {
  isSyncing$,
  sync,
  transactionHistory$,
} from '../../api/transactionHistory/transactionHistory';

export const OperationsHistory: FC = () => {
  const [isSyncing] = useObservable(isSyncing$);

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => (
      <OperationHistoryModal
        sync={sync}
        isSyncing$={isSyncing$}
        showDateTime
        operationsSource={transactionHistory$}
        close={close}
      />
    ));
  };

  return (
    <Tooltip title={t`Recent transactions`} placement="bottom">
      <Button
        size="large"
        type="ghost"
        icon={isSyncing ? <LoadingOutlined /> : <HistoryOutlined />}
        onClick={openOperationsHistoryModal}
      >
        {isSyncing && t`Syncing...`}
      </Button>
    </Tooltip>
  );
};

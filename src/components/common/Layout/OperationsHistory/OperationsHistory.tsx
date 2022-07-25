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
import { isOperationsSyncing$ } from '../../../../gateway/api/transactionsHistory';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

export const OperationsHistory: FC = () => {
  const [isOperationsSyncing] = useObservable(isOperationsSyncing$);
  const [selectedNetwork] = useSelectedNetwork();

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => (
      <OperationHistoryModal
        showDateTime={selectedNetwork.name === 'ergo'}
        close={close}
      />
    ));
  };

  return (
    <Tooltip title={t`Recent transactions`} placement="bottom">
      <Button
        size="large"
        type="ghost"
        icon={isOperationsSyncing ? <LoadingOutlined /> : <HistoryOutlined />}
        onClick={openOperationsHistoryModal}
      >
        {isOperationsSyncing && t`Syncing...`}
      </Button>
    </Tooltip>
  );
};

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
import { pendingOperations$ } from '../../../../gateway/api/pendingOperations';
import { isOperationsSyncing$ } from '../../../../gateway/api/transactionsHistory';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { mempoolRawOperations$ } from '../../../../network/ergo/api/operations/history/v2/operationsHistory';
import { OperationHistoryModal } from '../../../OperationHistoryModal/OperationHistoryModal';

export const OperationsHistory: FC = () => {
  const [isOperationsSyncing] = useObservable(isOperationsSyncing$);
  const [selectedNetwork] = useSelectedNetwork();
  const [pendingOperations, pendingLoading] = useObservable<any[]>(
    selectedNetwork.name === 'ergo'
      ? mempoolRawOperations$
      : (pendingOperations$ as any),
  );

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => (
      <OperationHistoryModal
        showDateTime={selectedNetwork.name === 'ergo'}
        close={close}
      />
    ));
  };

  const showSyncingLabel =
    isOperationsSyncing && !pendingOperations?.length && !pendingLoading;
  const showLoader =
    isOperationsSyncing || !!pendingOperations?.length || pendingLoading;

  return (
    <Tooltip
      title={
        showSyncingLabel
          ? t`Synchronizing transaction history. The first time it may take a little longer.`
          : t`Recent transactions`
      }
      width="100%"
      maxWidth={200}
      placement="bottom"
    >
      <Button
        size="large"
        type="ghost"
        icon={showLoader ? <LoadingOutlined /> : <HistoryOutlined />}
        onClick={openOperationsHistoryModal}
      >
        {showSyncingLabel
          ? t`Syncing...`
          : !!pendingOperations?.length
          ? `${pendingOperations?.length} ` + t`Pending`
          : ''}
      </Button>
    </Tooltip>
  );
};

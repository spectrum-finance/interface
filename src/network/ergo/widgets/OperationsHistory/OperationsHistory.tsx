import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  ModalRef,
  ReloadOutlined,
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

const OperationsHistoryModal: FC<ModalRef> = ({ close }) => {
  const [isSyncing] = useObservable(isSyncing$);

  return (
    <OperationHistoryModal
      content={
        <Button
          size="large"
          loading={isSyncing}
          onClick={() => sync()}
          icon={<ReloadOutlined />}
        >
          {isSyncing ? t`Syncing...` : t`Sync`}
        </Button>
      }
      showDateTime
      operationsSource={transactionHistory$}
      close={close}
    />
  );
};

export const OperationsHistory: FC = () => {
  const [isSyncing] = useObservable(isSyncing$);

  const openOperationsHistoryModal = () => {
    Modal.open(({ close }) => <OperationsHistoryModal close={close} />);
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

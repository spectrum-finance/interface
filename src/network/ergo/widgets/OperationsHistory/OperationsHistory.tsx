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
import { getAddresses } from '../../api/addresses/addresses';
import {
  isSyncing$,
  sync,
  transactionHistory$,
} from '../../api/transactionHistory/transactionHistory';

const OperationsHistoryModal: FC<{ addresses: string[] } & ModalRef> = ({
  close,
  addresses,
}) => {
  const [isSyncing] = useObservable(isSyncing$);

  return (
    <OperationHistoryModal
      addresses={addresses}
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
  const [addresses] = useObservable(getAddresses());

  const openOperationsHistoryModal = () => {
    if (addresses) {
      Modal.open(({ close }) => (
        <OperationsHistoryModal addresses={addresses} close={close} />
      ));
    }
  };

  return (
    <>
      {addresses && (
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
      )}
    </>
  );
};

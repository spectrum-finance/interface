import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  Tooltip,
} from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { isTransactionsHistorySyncing$ } from '../../../gateway/api/transactionsHistory';
import { IsCardano } from '../../IsCardano/IsCardano';
import { IsErgo } from '../../IsErgo/IsErgo';
import { CardanoTxHistory } from '../CardanoTxHistory/CardanoTxHistory';
import { TxHistoryModal } from './TxHistoryModal/TxHistoryModal';

const TxHistory = (): JSX.Element => {
  const [isTxHistorySyncing] = useObservable(isTransactionsHistorySyncing$);

  const handleOpenTxErgoHistoryModal = () => {
    return Modal.open(<TxHistoryModal />);
  };

  const handleOpenTxCardanoHistoryModal = () => {
    return Modal.open(({ close }) => <CardanoTxHistory close={close} />);
  };

  return (
    <>
      <IsErgo>
        <Tooltip title={t`Recent transactions`} placement="bottom">
          <Button
            size="large"
            type="ghost"
            icon={
              isTxHistorySyncing ? <LoadingOutlined /> : <HistoryOutlined />
            }
            onClick={handleOpenTxErgoHistoryModal}
          >
            {isTxHistorySyncing && t`Syncing...`}
          </Button>
        </Tooltip>
      </IsErgo>
      <IsCardano>
        <Tooltip title={t`Recent transactions`} placement="bottom">
          <Button
            size="large"
            type="ghost"
            icon={
              isTxHistorySyncing ? <LoadingOutlined /> : <HistoryOutlined />
            }
            onClick={handleOpenTxCardanoHistoryModal}
          />
        </Tooltip>
      </IsCardano>
    </>
  );
};

export { TxHistory };

import { t } from '@lingui/macro';
import React from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import {
  Button,
  HistoryOutlined,
  LoadingOutlined,
  Modal,
  Tooltip,
} from '../../../ergodex-cdk';
import { isTransactionsHistorySyncing$ } from '../../../gateway/transactionsHistory';
import { TxHistoryModal } from './TxHistoryModal/TxHistoryModal';

const TxHistory = (): JSX.Element => {
  const [isTxHistorySyncing] = useObservable(isTransactionsHistorySyncing$);

  const handleOpenTxHistoryModal = () => {
    return Modal.open(<TxHistoryModal />);
  };

  return (
    <Tooltip title={t`Recent transactions`} placement="bottom">
      <Button
        className="header__btn"
        size="large"
        type="ghost"
        icon={isTxHistorySyncing ? <LoadingOutlined /> : <HistoryOutlined />}
        onClick={handleOpenTxHistoryModal}
      >
        {isTxHistorySyncing && t`Syncing...`}
      </Button>
    </Tooltip>
  );
};

export { TxHistory };

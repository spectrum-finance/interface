import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { isTransactionsHistorySyncing$ } from '../../../api/transactionsHistory';
import { useObservable } from '../../../common/hooks/useObservable';
import { Button, HistoryOutlined, Modal, Tooltip } from '../../../ergodex-cdk';
import { TxHistoryModal } from './TxHistoryModal/TxHistoryModal';

const TxHistory = (): JSX.Element => {
  const [isTxHistorySyncing] = useObservable(isTransactionsHistorySyncing$);

  const handleOpenTxHistoryModal = () => {
    return Modal.open(<TxHistoryModal />);
  };

  return (
    <Tooltip title="Recent transactions" placement="bottom">
      <Button
        className="header__btn"
        size="large"
        type="ghost"
        icon={isTxHistorySyncing ? <LoadingOutlined /> : <HistoryOutlined />}
        onClick={handleOpenTxHistoryModal}
      >
        {isTxHistorySyncing ? 'Syncing...' : ''}
      </Button>
    </Tooltip>
  );
};

export { TxHistory };

import React from 'react';

import { Button, HistoryOutlined, Modal, Tooltip } from '../../../ergodex-cdk';
import { TxHistoryModal } from './TxHistoryModal/TxHistoryModal';

const TxHistory = (): JSX.Element => {
  const handleOpenTxHistoryModal = () => {
    return Modal.open(<TxHistoryModal />);
  };

  return (
    <Tooltip title="Recent transactions" placement="bottom">
      <Button
        size="large"
        type="ghost"
        icon={<HistoryOutlined />}
        onClick={handleOpenTxHistoryModal}
      />
    </Tooltip>
  );
};

export { TxHistory };

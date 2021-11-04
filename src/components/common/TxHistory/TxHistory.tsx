import React from 'react';

import { Button, HistoryOutlined, Modal } from '../../../ergodex-cdk';
import { TxHistoryModal } from './TxHistoryModal/TxHistoryModal';

const TxHistory = (): JSX.Element => {
  const handleOpenTxHistoryModal = () => {
    return Modal.open(<TxHistoryModal />, {
      width: 570,
      title: 'Recent transactions',
    });
  };

  return (
    <Button
      size="large"
      type="text"
      icon={<HistoryOutlined />}
      onClick={handleOpenTxHistoryModal}
    />
  );
};

export { TxHistory };

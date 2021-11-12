import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { Box, Button, Modal, Space, Typography } from '../../../ergodex-cdk';
import { getShortAddress } from '../../../utils/string/addres';
import { ConnectWalletButton } from '../../common/ConnectWalletButton/ConnectWalletButton';
import { WalletModal } from '../../WalletModal/WalletModal';

export interface ConnectWalletProps {
  balance?: string;
  currency?: string;
  address?: string;
  numberOfPendingTxs: number;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  balance,
  currency,
  address,
  numberOfPendingTxs,
}) => {
  const addressToRender = address ? getShortAddress(address) : '';

  const openWalletModal = () =>
    Modal.open(<WalletModal />, {
      width: 440,
      title: 'Wallet',
    });

  const addressButton = (
    <Box borderRadius="m" padding={[1, 1, 1, 2]}>
      <Space>
        <Typography.Body style={{ whiteSpace: 'nowrap' }}>
          {balance ? `${balance} ${currency}` : <LoadingOutlined />}
        </Typography.Body>
        <Button
          className="connect-wallet__address-btn"
          onClick={openWalletModal}
          icon={!!numberOfPendingTxs && <LoadingOutlined />}
          size="middle"
          type="default"
        >
          {numberOfPendingTxs > 0
            ? `${numberOfPendingTxs} Pending`
            : addressToRender}
        </Button>
      </Space>
    </Box>
  );

  return (
    <ConnectWalletButton size="large" className="connect-wallet__connect-btn">
      {addressButton}
    </ConnectWalletButton>
  );
};

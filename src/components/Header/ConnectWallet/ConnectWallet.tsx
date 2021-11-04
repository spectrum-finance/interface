import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { Box, Button, Modal, Space, Typography } from '../../../ergodex-cdk';
import { getShortAddress } from '../../../utils/address';
import { ConnectWalletButton } from '../../common/ConnectWalletButton/ConnectWalletButton';
import { WalletModal } from '../../WalletModal/WalletModal';

export interface ConnectWalletProps {
  isWalletConnected: boolean;
  balance?: string;
  currency?: string;
  address?: string;
  numberOfPendingTxs: number;
  isWalletLoading: boolean;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  isWalletConnected,
  balance,
  currency,
  address,
  numberOfPendingTxs,
}) => {
  const addressToRender = address ? getShortAddress(address) : '';

  const openWalletModal = () =>
    Modal.open(({ close }) => <WalletModal />, {
      width: 440,
      title: 'Wallet',
    });

  const addressButton = (
    <Box borderRadius="m">
      <Space>
        <Typography.Body
          style={{ whiteSpace: 'nowrap' }}
        >{`${balance} ${currency}`}</Typography.Body>
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

  return isWalletConnected && balance ? (
    addressButton
  ) : (
    <ConnectWalletButton size="large" className="connect-wallet__connect-btn" />
  );
};

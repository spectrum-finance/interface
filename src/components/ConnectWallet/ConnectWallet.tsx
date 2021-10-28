import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { Box, Button, Space, Typography } from '../../ergodex-cdk';
import { openChooseWalletModal } from '../ChooseWalletModal/main';

export interface ConnectWalletProps {
  isWalletConnected: boolean;
  balance?: string;
  currency?: string;
  address?: string;
  numberOfPendingTxs: number;
}

const getShortAddress = (address: string) => {
  let shortAddress = address ? address : '';
  shortAddress =
    shortAddress.length < 10
      ? shortAddress
      : shortAddress.substring(0, 6) +
        '...' +
        shortAddress.substring(shortAddress.length - 4, shortAddress.length);

  return shortAddress;
};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  isWalletConnected,
  balance,
  currency,
  address,
  numberOfPendingTxs,
}) => {
  const addressToRender = address ? getShortAddress(address) : '';

  const connectButton = (
    <Button
      size="large"
      className="connect-wallet__connect-btn"
      onClick={openChooseWalletModal}
    >
      Connect to a wallet
    </Button>
  );

  const addressButton = (
    <Box borderRadius="m">
      <Space>
        <Typography.Body
          style={{ whiteSpace: 'nowrap' }}
        >{`${balance} ${currency}`}</Typography.Body>
        <Button
          className="connect-wallet__address-btn"
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

  return isWalletConnected && balance ? addressButton : connectButton;
};

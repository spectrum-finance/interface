import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';

import { ReactComponent as YoroiLogo } from '../../assets/icons/yoroi-logo-icon.svg';
import { WalletContext } from '../../context';
import { Box, Button, Modal, Space, Typography } from '../../ergodex-cdk';
import { connectYoroiWallet } from '../../utils/wallet/walletsOperations';
import { ChooseWalletModal } from '../ChooseWalletModal/ChooseWalletModal';
import { WalletModal } from '../WalletModal/WalletModal';

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
  const walletCtx = useContext(WalletContext);

  const wallets = [
    {
      name: 'Yoroi',
      logo: <YoroiLogo />,
      onClick: connectYoroiWallet(walletCtx),
    },
  ];

  const openChooseWalletModal = () =>
    Modal.open(
      ({ close }) => <ChooseWalletModal wallets={wallets} close={close} />,
      {
        width: 372,
        title: 'Select a wallet',
      },
    );

  const openWalletModal = () =>
    Modal.open(({ close }) => <WalletModal />, {
      width: 420,
      title: 'Wallet',
    });

  const connectButton = (
    <Button
      size="large"
      className="connect-wallet__connect-btn"
      onClick={openChooseWalletModal}
      // onClick={openWalletModal}
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

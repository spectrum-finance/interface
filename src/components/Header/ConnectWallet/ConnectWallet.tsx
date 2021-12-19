import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import { Box, Button, Flex, Modal, Typography } from '../../../ergodex-cdk';
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

  const openWalletModal = () => Modal.open(<WalletModal />);

  const addressButton = (
    <Box borderRadius="m" padding={[1, 1, 1, 2]}>
      <Flex align="center">
        <Flex.Item marginRight={2}>
          <Typography.Body style={{ whiteSpace: 'nowrap' }}>
            {balance ? `${balance} ${currency}` : <LoadingOutlined />}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
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
        </Flex.Item>
      </Flex>
    </Box>
  );

  return (
    <ConnectWalletButton size="large" className="connect-wallet__connect-btn">
      {addressButton}
    </ConnectWalletButton>
  );
};

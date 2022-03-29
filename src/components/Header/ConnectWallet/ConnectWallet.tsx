import './ConnectWallet.less';

import { LoadingOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import React from 'react';

import { Currency } from '../../../common/models/Currency';
import { Box, Button, Flex, Modal, Typography } from '../../../ergodex-cdk';
import { getShortAddress } from '../../../utils/string/addres';
import { ConnectWalletButton } from '../../common/ConnectWalletButton/ConnectWalletButton';
import { WalletModal } from '../../WalletModal/WalletModal';

export interface ConnectWalletProps {
  balance?: Currency;
  address?: string;
  numberOfPendingTxs: number;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  balance,
  address,
  numberOfPendingTxs,
}) => {
  const addressToRender = address ? getShortAddress(address) : '';

  const openWalletModal = () => Modal.open(<WalletModal />);

  const addressButton = (
    <Box borderRadius="m" padding={1}>
      <Flex align="center">
        <Flex.Item
          className="connect-wallet__balance"
          marginRight={2}
          marginLeft={1}
        >
          <Typography.Body style={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
            {balance?.toCurrencyString() ?? <LoadingOutlined />}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Button
            className="connect-wallet__address-btn"
            onClick={openWalletModal}
            icon={!!numberOfPendingTxs && <LoadingOutlined />}
            size="large"
            type="default"
          >
            {numberOfPendingTxs > 0
              ? t`${numberOfPendingTxs} Pending`
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

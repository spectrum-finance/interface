import React from 'react';

import { Currency } from '../../../common/models/Currency';
import { HeaderConnectWalletButton } from './HeaderConnectWalletButton/HeaderConnectWalletButton';
import { WalletInfoButton } from './WalletInfoButton/WalletInfoButton';

export interface ConnectWalletProps {
  balance?: Currency;
  address?: string;
  numberOfPendingTxs: number;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  balance,
  address,
}) => {
  return (
    <HeaderConnectWalletButton
      size="large"
      analytics={{ connectWalletLocation: 'header' }}
    >
      <WalletInfoButton balance={balance} address={address} />
    </HeaderConnectWalletButton>
  );
};

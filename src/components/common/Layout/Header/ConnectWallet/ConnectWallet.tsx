import React, { FC } from 'react';

import { HeaderConnectWalletButton } from './HeaderConnectWalletButton/HeaderConnectWalletButton';
import { WalletInfoButton } from './WalletInfoButton/WalletInfoButton';

export const ConnectWallet: FC = () => {
  return (
    <HeaderConnectWalletButton size="large" analytics={{ location: 'header' }}>
      <WalletInfoButton />
    </HeaderConnectWalletButton>
  );
};

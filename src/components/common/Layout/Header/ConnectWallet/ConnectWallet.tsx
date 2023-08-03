import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC } from 'react';

import { HeaderConnectWalletButton } from './HeaderConnectWalletButton/HeaderConnectWalletButton';
import { WalletInfoButton } from './WalletInfoButton/WalletInfoButton';

export const ConnectWallet: FC = () => {
  return (
    <HeaderConnectWalletButton
      size="large"
      trace={{
        element_name: ElementName.connectWalletButton,
        element_location: ElementLocation.header,
      }}
    >
      <WalletInfoButton />
    </HeaderConnectWalletButton>
  );
};

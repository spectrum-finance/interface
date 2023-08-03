import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC, useEffect } from 'react';

import { useHasAdaHandle } from '../../../../../network/cardano/api/adaHandle';
import {
  patchSettings as patchCardanoSettings,
  useSettings as useCardanoSettings,
} from '../../../../../network/cardano/settings/settings.ts';
import { openAdaHandleModal } from '../../../../../network/cardano/widgets/AdaHandle/AdaHandleModal/AdaHandleModal.tsx';
import { isCardano } from '../../../../../utils/network.ts';
import { HeaderConnectWalletButton } from './HeaderConnectWalletButton/HeaderConnectWalletButton';
import { WalletInfoButton } from './WalletInfoButton/WalletInfoButton';

export const ConnectWallet: FC = () => {
  const [hasAdaHandleBalance] = useHasAdaHandle();
  const { wasAdaHandleModalOpened } = useCardanoSettings();

  useEffect(() => {
    if (isCardano() && hasAdaHandleBalance && !wasAdaHandleModalOpened) {
      openAdaHandleModal(true);
      patchCardanoSettings({ wasAdaHandleModalOpened: true });
    }
  }, [hasAdaHandleBalance]);

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

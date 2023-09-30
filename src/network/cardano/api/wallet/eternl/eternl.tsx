import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import EternlLogo from './eternl-icon.svg';

export const Eternl = createWallet<AdditionalData>({
  id: 'Eternl',
  getConnector: () => cardano.eternl,
  name: 'Eternl',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  icon: <img alt="Eternl Logo" src={EternlLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Eternl Logo" src={EternlLogo} width={21} height={21} />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

export const EternlMobile = createWallet<AdditionalData>({
  id: 'EternlMobile',
  getConnector: () => window.dAppConnectorBridge as any,
  name: 'Eternl',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  icon: <img alt="Eternl Logo" src={EternlLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Eternl Logo" src={EternlLogo} width={21} height={21} />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

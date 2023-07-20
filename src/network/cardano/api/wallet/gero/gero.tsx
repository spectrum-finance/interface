import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import GeroLogo from './gerowallet-icon.svg';

export const Gero = createWallet<AdditionalData>({
  id: 'Gero',
  name: 'Gero',
  getConnector: () => cardano.gerowallet,
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  icon: <img alt="Gero Logo" src={GeroLogo} height={32} width={32} />,
  previewIcon: <img alt="Gero Logo" src={GeroLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import LaceLogo from './lace-icon.svg';

export const Lace = createWallet<AdditionalData>({
  id: 'Lace',
  getConnector: () => cardano.lace,
  name: 'Lace',
  extensionLink:
    'https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk',
  icon: <img alt="Lace Logo" src={LaceLogo} width={32} height={32} />,
  previewIcon: <img alt="Lace Logo" src={LaceLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

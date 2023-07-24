import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import { ReactComponent as FlintLogo } from './flint-icon.svg';

export const Flint = createWallet<AdditionalData>({
  id: 'Flint',
  getConnector: () => cardano.flint,
  name: 'Flint',
  extensionLink:
    'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj?hl=en',
  walletSupportedFeatures: { createPool: false },
  icon: <FlintLogo width={32} height={32} />,
  previewIcon: <FlintLogo width={21} height={21} />,
  definition: 'default',
});

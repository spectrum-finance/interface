import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import YoroiLogo from './yoroi-icon.svg';

export const Yoroi = createWallet<AdditionalData>({
  id: 'Yoroi',
  getConnector: () => cardano.yoroi,
  name: 'Yoroi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  icon: <img alt="Yoroi Logo" src={YoroiLogo} height={32} width={32} />,
  previewIcon: <img alt="Yoroi Logo" src={YoroiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

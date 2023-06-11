import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import YoroiLogo from './yoroi-icon.svg';

export const Yoroi: CardanoWalletContract = makeCardanoWallet({
  name: 'Yoroi',
  variableName: 'yoroi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  icon: <img alt="Yoroi Logo" src={YoroiLogo} height={32} width={32} />,
  previewIcon: <img alt="Yoroi Logo" src={YoroiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
});

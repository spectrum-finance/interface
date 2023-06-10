import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import LaceLogo from './lace-icon.svg';

export const Lace: CardanoWalletContract = makeCardanoWallet({
  name: 'Lace',
  variableName: 'lace',
  extensionLink:
    'https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk',
  icon: <img alt="Lace Logo" src={LaceLogo} width={32} height={32} />,
  previewIcon: <img alt="Lace Logo" src={LaceLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
});

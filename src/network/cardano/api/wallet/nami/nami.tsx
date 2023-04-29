import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import NamiLogo from './nami-icon.svg';

export const Nami: CardanoWalletContract = makeCardanoWallet({
  variableName: 'nami',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  walletSupportedFeatures: { createPool: false },
  name: 'Nami',
  icon: <img src={NamiLogo} width={32} height={32} />,
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet/#nami-wallet',
  previewIcon: <img src={NamiLogo} width={21} height={21} />,
});

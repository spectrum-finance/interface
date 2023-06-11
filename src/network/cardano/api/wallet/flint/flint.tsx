import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as FlintLogo } from './flint-icon.svg';

export const Flint: CardanoWalletContract = makeCardanoWallet({
  name: 'Flint',
  variableName: 'flint',
  extensionLink:
    'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj?hl=en',
  walletSupportedFeatures: { createPool: false },
  icon: <FlintLogo width={32} height={32} />,
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet/#flint-wallet',
  previewIcon: <FlintLogo width={21} height={21} />,
});

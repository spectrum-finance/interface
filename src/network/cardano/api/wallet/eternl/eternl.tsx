import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import EternlLogo from './eternl-icon.svg';

export const Eternl: CardanoWalletContract = makeCardanoWallet({
  variableName: 'eternl',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  walletSupportedFeatures: { createPool: false },
  name: 'Eternl',
  icon: <img src={EternlLogo} height={32} width={32} />,
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet#eternl-wallet',
  previewIcon: <img src={EternlLogo} width={21} height={21} />,
});

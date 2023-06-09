import {
  cardanoMainnetWalletConnect,
  getActiveConnector,
  WalletConnectConnector,
} from '@dcspark/adalib';
import { init as initWalletConnect } from '@dcspark/adalib';

import { CardanoWalletContract } from '../common/CardanoWalletContract.ts';
import { makeCardanoWallet } from '../common/makeCardanoWallet.tsx';
import { CONNECTOR_NAME_WALLET_CONNECT } from '../consts.ts';
import WcLogo from './wc-logo.png';

const PROJECT_ID = 'add5d2d2d1b89b17dd9871986a5fe797';
initWalletConnect(
  () => ({
    connectorName: CONNECTOR_NAME_WALLET_CONNECT,
    connectors: [
      new WalletConnectConnector({
        relayerRegion: `wss://relay.walletconnect.com`,
        metadata: {
          name: 'Spectrum Finance',
          description: 'Spectrum Finance Cardano AMM DEX',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
          url: 'http://localhost:3030',
        },
        autoconnect: true,
        qrcode: true,
      }),
    ],
    chosenChain: cardanoMainnetWalletConnect(),
  }),
  PROJECT_ID,
);
export const WalletConnect: CardanoWalletContract = makeCardanoWallet({
  variableName: CONNECTOR_NAME_WALLET_CONNECT,
  walletSupportedFeatures: { createPool: false },
  name: 'WalletConnect',
  icon: <img src={WcLogo} height={32} width={32} alt="WalletConnect logo" />,
  previewIcon: (
    <img src={WcLogo} width={21} height={21} alt="WalletConnect logo" />
  ),
  connectorApi: getActiveConnector(),
});

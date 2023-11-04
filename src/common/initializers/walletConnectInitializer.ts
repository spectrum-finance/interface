import {
  cardanoMainnetWalletConnect,
  init as initWalletConnect,
  WalletConnectConnector,
} from '@dcspark/adalib';
import { of } from 'rxjs';

const PROJECT_ID = 'add5d2d2d1b89b17dd9871986a5fe797';
export const walletConnectInitializer = () => {
  if (PROJECT_ID) {
    initWalletConnect(
      () => ({
        connectorName: 'walletconnect',
        connectors: [
          new WalletConnectConnector({
            relayerRegion: `wss://relay.walletconnect.com`,
            metadata: {
              name: 'TeddySwap',
              description: 'TeddySwap Cardano AMM DEX',
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
  }
  return of(true);
};

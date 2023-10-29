import {
  cardanoMainnetWalletConnect,
  getActiveConnector,
  WalletConnectConnector,
} from '@dcspark/adalib';
import { init as initWalletConnect } from '@dcspark/adalib';

import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import { CONNECTOR_NAME_WALLET_CONNECT } from '../consts.ts';
import WcLogo from './wc-logo.png';
import EncodedTxOut = CardanoBridge.EncodedTxOut;
import EncodedBalance = CardanoBridge.EncodedBalance;
import {
  AdaAssetName,
  AdaPolicyId,
  AssetEntry,
  decodeWasmUtxo,
  decodeWasmValue,
  getLovelace,
} from '@teddyswap/cardano-dex-sdk';
import { RustModule } from '@teddyswap/cardano-dex-sdk/build/main/utils/rustLoader';

const PROJECT_ID = 'add5d2d2d1b89b17dd9871986a5fe797';
export const WalletConnect = createWallet<AdditionalData>({
  id: 'WalletConnect',
  getConnector: () => {
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
            qrcode: true,
            autoconnect: true,
          }),
        ],
        chosenChain: cardanoMainnetWalletConnect(),
      }),
      PROJECT_ID,
    );
    const connector = getActiveConnector();

    return connector as CardanoBridge.ConnectorAPI;
  },
  getBalance: (ctx) => {
    return Promise.all([ctx.getCollateral(), ctx.getBalance()]).then(
      (data: [EncodedTxOut[] | undefined, EncodedBalance]) => {
        const [encodedCollateral, encodedBalance] = data;

        const balance = decodeWasmValue(encodedBalance, RustModule.CardanoWasm);
        const collateral =
          encodedCollateral?.map((hex) =>
            decodeWasmUtxo(hex, RustModule.CardanoWasm),
          ) || [];

        return balance.map((item) => {
          if (item.policyId === AdaPolicyId && item.name === AdaAssetName) {
            return collateral.reduce<AssetEntry>(
              (assetEntry, out) => ({
                ...assetEntry,
                quantity: assetEntry.quantity - getLovelace(out.value).amount,
              }),
              item,
            );
          }
          return item;
        });
      },
    );
  },
  name: 'WalletConnect',
  icon: <img src={WcLogo} height={32} width={32} alt="WalletConnect Logo" />,
  previewIcon: (
    <img src={WcLogo} width={21} height={21} alt="WalletConnect Logo" />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});

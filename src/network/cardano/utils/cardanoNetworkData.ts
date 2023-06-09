import { applicationConfig } from '../../../applicationConfig';
import { localStorageManager } from '../../../common/utils/localStorageManager';
import { SupportedNetworks } from '../../common/Network';

// TODO: MAKE REFACTORING AFTER MAINNET RELEASE
export type CardanoNetworkData =
  typeof applicationConfig.networksSettings['ergo'] & {
    readonly settingsKey: string;
    readonly walletKey: string;
  };

// TODO: REWRITE AFTER RELEASE
const networkUrl: SupportedNetworks = location.pathname.split('/')[1] as any;
const possibleUrl =
  localStorageManager.get<SupportedNetworks>('ergodex-selected-network-key') ||
  networkUrl;

export const currentNetwork: SupportedNetworks =
  possibleUrl === 'cardano_mainnet' || possibleUrl === 'cardano_preview'
    ? possibleUrl
    : 'cardano_mainnet';

export const cardanoNetworkData: CardanoNetworkData =
  currentNetwork === 'cardano_mainnet'
    ? {
        ...applicationConfig.networksSettings.cardanoMainnet,
        settingsKey: 'cardano-mainnet-settings',
        walletKey: 'cardano-mainnet-selected-wallet',
      }
    : {
        ...applicationConfig.networksSettings.cardanoPreview,
        settingsKey: 'cardano-preview-settings',
        walletKey: 'cardano-preview-selected-wallet',
      };

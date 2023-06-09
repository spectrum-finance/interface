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
  networkUrl === 'cardano_mainnet' || networkUrl === 'cardano_preview'
    ? networkUrl
    : localStorageManager.get<SupportedNetworks>(
        'spectrum-selected-network-key',
      );

export const currentNetwork: SupportedNetworks =
  possibleUrl === 'ergo' ? 'cardano_mainnet' : possibleUrl || 'cardano_mainnet';

export const cardanoNetworkData: CardanoNetworkData =
  currentNetwork === 'cardano_mainnet'
    ? {
        ...applicationConfig.networksSettings.cardano_mainnet,
        settingsKey: 'cardano-mainnet-settings',
        walletKey: 'cardano-mainnet-selected-wallet',
      }
    : {
        ...applicationConfig.networksSettings.cardano_preview,
        settingsKey: 'cardano-preview-settings',
        walletKey: 'cardano-preview-selected-wallet',
      };

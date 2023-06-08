import { applicationConfig } from '../../../applicationConfig';

// TODO: MAKE REFACTORING AFTER MAINNET RELEASE
export type CardanoNetworkData =
  typeof applicationConfig.networksSettings['ergo'] & {
    readonly settingsKey: string;
    readonly walletKey: string;
  };

export let cardanoNetworkData: CardanoNetworkData;

export const setCardanoNetworkData = (data: CardanoNetworkData): void => {
  cardanoNetworkData = data;
};

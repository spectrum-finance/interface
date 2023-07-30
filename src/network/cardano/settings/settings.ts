import { PublicKey } from '@ergolabs/ergo-sdk';
import { user } from '@spectrumlabs/analytics';
import { pubKeyHashFromAddr } from '@spectrumlabs/cardano-dex-sdk';
import { RustModule } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { filter, map, Observable, startWith, zip } from 'rxjs';

import { MIN_NITRO } from '../../../common/constants/erg';
import { defaultSlippage } from '../../../common/constants/settings';
import { useObservable } from '../../../common/hooks/useObservable';
import { Address } from '../../../common/types';
import { isCurrentAddressValid } from '../../../common/utils/isCurrenctAddressValid';
import { localStorageManager } from '../../../common/utils/localStorageManager';
import { BaseNetworkSettings } from '../../common/NetworkSettings';
import {
  getChangeAddress,
  getUnusedAddresses,
  getUsedAddresses,
} from '../api/addresses/addresses';
import { networkAsset } from '../api/networkAsset/networkAsset';
import { cardanoNetworkData } from '../utils/cardanoNetworkData';

const SETTINGS_KEY = cardanoNetworkData.settingsKey;

export interface CardanoSettings extends BaseNetworkSettings {
  readonly ph?: PublicKey;
}

export const defaultCardanoSettings: CardanoSettings = {
  nitro: MIN_NITRO,
  slippage: defaultSlippage,
  ph: undefined,
  address: undefined,
  executionFeeAsset: networkAsset,
};

const getNewSelectedAddress = (
  settings: CardanoSettings,
  usedAddresses: Address[],
  unusedAddresses: Address[],
  walletAddress: Address,
): string => {
  let newSelectedAddress: Address;

  if (settings.address === walletAddress) {
    newSelectedAddress = settings.address!;
  } else {
    newSelectedAddress = walletAddress;
  }
  return newSelectedAddress;
};

export const initializeSettings = (): void => {
  zip([
    getUsedAddresses().pipe(filter(Boolean)),
    getUnusedAddresses().pipe(filter(Boolean)),
    getChangeAddress().pipe(filter(Boolean)),
  ])
    .pipe(startWith(undefined))
    .subscribe((addresses) => {
      if (!addresses) {
        return;
      }
      const [usedAddresses, unusedAddresses, walletAddress] = addresses;

      const currentSettings: CardanoSettings =
        localStorageManager.get(SETTINGS_KEY) || defaultCardanoSettings;
      const newSelectedAddress = getNewSelectedAddress(
        currentSettings,
        usedAddresses,
        unusedAddresses,
        walletAddress,
      );

      user.set('address_active_cardano', newSelectedAddress);
      user.postInsert('all_addresses_cardano', [
        ...usedAddresses,
        ...unusedAddresses,
      ]);

      setSettings({
        ...settings,
        address: newSelectedAddress,
        ph: pubKeyHashFromAddr(newSelectedAddress, RustModule.CardanoWasm),
        executionFeeAsset:
          currentSettings.executionFeeAsset ||
          defaultCardanoSettings.executionFeeAsset,
      });
    });
};

export const settings =
  localStorageManager.get<CardanoSettings>(SETTINGS_KEY) ||
  defaultCardanoSettings;

export const setSettings = (newSettings: CardanoSettings): void =>
  localStorageManager.set(SETTINGS_KEY, newSettings);

export const settings$: Observable<CardanoSettings> = localStorageManager
  .getStream<CardanoSettings>(SETTINGS_KEY)
  .pipe(map((settings) => settings || defaultCardanoSettings));

export const useSettings = (): CardanoSettings => {
  const [_settings] = useObservable(settings$, [], settings);

  return _settings;
};

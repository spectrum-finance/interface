import { pubKeyHashFromAddr } from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { PublicKey } from '@ergolabs/ergo-sdk';
import { filter, map, Observable, startWith, zip } from 'rxjs';

import { MIN_NITRO } from '../../../common/constants/erg';
import { defaultSlippage } from '../../../common/constants/settings';
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

const SETTINGS_KEY = 'cardano-settings';

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
  address: Address,
): string => {
  let newSelectedAddress: Address;

  if (
    isCurrentAddressValid(
      settings.address,
      unusedAddresses.concat(usedAddresses),
    )
  ) {
    newSelectedAddress = settings.address!;
  } else {
    newSelectedAddress = address;
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

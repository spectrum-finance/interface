import { PublicKey, publicKeyFromAddress } from '@ergolabs/ergo-sdk';
import { filter, map, Observable, startWith, zip } from 'rxjs';

import { MIN_NITRO } from '../../../common/constants/erg';
import {
  defaultMinerFee,
  defaultSlippage,
} from '../../../common/constants/settings';
import { Address } from '../../../common/types';
import { isCurrentAddressValid } from '../../../common/utils/isCurrenctAddressValid';
import { localStorageManager } from '../../../common/utils/localStorageManager';
import { BaseNetworkSettings } from '../../common/NetworkSettings';
import {
  getUnusedAddresses,
  getUsedAddresses,
} from '../api/addresses/addresses';

const SETTINGS_KEY = 'ergo-settings';

export interface ErgoSettings extends BaseNetworkSettings {
  readonly minerFee: number;
  readonly pk?: PublicKey;
}

export const defaultErgoSettings: ErgoSettings = {
  minerFee: defaultMinerFee,
  nitro: MIN_NITRO,
  slippage: defaultSlippage,
  pk: undefined,
  address: undefined,
};

const updateAddressSettings = (
  settings: ErgoSettings,
  usedAddresses: Address[],
  unusedAddresses: Address[],
): void => {
  let newSelectedAddress: Address;

  if (
    isCurrentAddressValid(
      settings.address,
      unusedAddresses.concat(usedAddresses),
    )
  ) {
    newSelectedAddress = settings.address!;
  } else {
    newSelectedAddress = unusedAddresses[0] || usedAddresses[0];
  }

  setSettings({
    ...settings,
    address: newSelectedAddress,
    pk: publicKeyFromAddress(newSelectedAddress),
  });
};

export const initializeSettings = (): void => {
  zip([
    getUsedAddresses().pipe(filter(Boolean)),
    getUnusedAddresses().pipe(filter(Boolean)),
  ])
    .pipe(startWith(undefined))
    .subscribe((addresses) => {
      if (!addresses) {
        return;
      }
      const [usedAddresses, unusedAddresses] = addresses;
      updateAddressSettings(
        localStorageManager.get(SETTINGS_KEY) || defaultErgoSettings,
        usedAddresses,
        unusedAddresses,
      );
    });
};

export const settings =
  localStorageManager.get<ErgoSettings>(SETTINGS_KEY) || defaultErgoSettings;

export const setSettings = (newSettings: ErgoSettings): void =>
  localStorageManager.set(SETTINGS_KEY, newSettings);

export const settings$: Observable<ErgoSettings> = localStorageManager
  .getStream<ErgoSettings>(SETTINGS_KEY)
  .pipe(map((settings) => settings || defaultErgoSettings));

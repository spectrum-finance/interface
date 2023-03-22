import { PublicKey, publicKeyFromAddress } from '@ergolabs/ergo-sdk';
import { user } from '@spectrumlabs/analytics';
import { filter, map, Observable, startWith, zip } from 'rxjs';

import { MIN_NITRO } from '../../../common/constants/erg';
import {
  defaultMinerFee,
  defaultSlippage,
} from '../../../common/constants/settings';
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

const SETTINGS_KEY = 'ergo-settings';

export interface ErgoSettings extends BaseNetworkSettings {
  readonly minerFee: number;
  readonly pk?: PublicKey;
  readonly ergopay: boolean;
}

export const defaultErgoSettings: ErgoSettings = {
  minerFee: defaultMinerFee,
  nitro: MIN_NITRO,
  slippage: defaultSlippage,
  executionFeeAsset: networkAsset,
  pk: undefined,
  address: undefined,
  ergopay: false,
};

const getNewSelectedAddress = (
  settings: ErgoSettings,
  usedAddresses: Address[],
  unusedAddresses: Address[],
  walletAddress: Address,
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

      const currentSettings: ErgoSettings =
        localStorageManager.get(SETTINGS_KEY) || defaultErgoSettings;

      const newSelectedAddress = getNewSelectedAddress(
        currentSettings,
        usedAddresses,
        unusedAddresses,
        walletAddress,
      );

      user.set('address_active_ergo', newSelectedAddress);
      user.postInsert('all_addresses_ergo', [
        ...usedAddresses,
        ...unusedAddresses,
      ]);

      setSettings({
        ...currentSettings,
        address: newSelectedAddress,
        pk: publicKeyFromAddress(newSelectedAddress),
        executionFeeAsset:
          currentSettings.executionFeeAsset ||
          defaultErgoSettings.executionFeeAsset,
      });
    });
};

export const getSettings = (): ErgoSettings => {
  const localStorageData = localStorageManager.get<ErgoSettings>(SETTINGS_KEY);

  return localStorageData
    ? { ...localStorageData, minerFee: defaultMinerFee }
    : defaultErgoSettings;
};

export const setSettings = (newSettings: ErgoSettings): void =>
  localStorageManager.set(SETTINGS_KEY, newSettings);

export const patchSettings = (newSettings: Partial<ErgoSettings>): void =>
  localStorageManager.set(SETTINGS_KEY, {
    ...(localStorageManager.get<ErgoSettings>(SETTINGS_KEY) ||
      defaultErgoSettings),
    ...newSettings,
  });

export const settings$: Observable<ErgoSettings> = localStorageManager
  .getStream<ErgoSettings>(SETTINGS_KEY)
  .pipe(
    map((settings) =>
      settings
        ? { ...settings, minerFee: defaultMinerFee }
        : defaultErgoSettings,
    ),
  );

export const useSettings = (): [ErgoSettings, boolean, Error | undefined] =>
  useObservable(settings$, [], getSettings());

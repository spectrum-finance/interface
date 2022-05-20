import { Observable } from 'rxjs';

import { Currency } from '../../common/models/Currency';
import { Address, Nitro, Percent } from '../../common/types';

export interface BaseNetworkSettings {
  readonly address?: Address;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

export interface NetworkSettings<T extends BaseNetworkSettings> {
  settings: T;
  settings$: Observable<T>;
  setSettings: (value: T) => void;
}

export interface BaseNetworkSettingsV2 {
  readonly address?: Address;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

export interface NetworkSettingsV2<T extends BaseNetworkSettingsV2> {
  readonly snapshot: T;

  readonly settings$: Observable<T>;

  readonly nitro$: Observable<Percent>;

  readonly address$: Observable<Address | undefined>;

  readonly slippage$: Observable<Percent | undefined>;

  readonly minTotalFee$: Observable<Currency>;

  readonly maxTotalFee$: Observable<Currency>;

  readonly setSettings: (value: Partial<T>) => void;

  readonly setNitro: (value: Nitro) => void;

  readonly setSlippage: (value: Percent) => void;

  readonly setAddress: (value: Address) => void;
}

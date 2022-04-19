import { Observable } from 'rxjs';

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

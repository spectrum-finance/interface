import { Observable } from 'rxjs';

import { Address, Nitro, Percent } from '../../common/types';

interface BaseNetworkConfig {
  readonly address: Address;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

export interface NetworkSettings<T extends BaseNetworkConfig> {
  settings$: Observable<T>;
  setSettings: (value: T) => void;
}

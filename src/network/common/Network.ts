import { Observable } from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { NetworkData } from './NetworkData';
import { NetworkOperations } from './NetworkOperations';
import { BaseNetworkSettings, NetworkSettings } from './NetworkSettings';
import { NetworkWidgets } from './NetworkWidgets';
import { Wallet } from './Wallet';

export interface Network<W extends Wallet, S extends BaseNetworkSettings>
  extends NetworkData<W>,
    NetworkOperations,
    NetworkWidgets,
    NetworkSettings<S> {
  readonly name: string;
  readonly networkAsset: AssetInfo;
  readonly initialized$: Observable<boolean>;
  readonly initialize: () => void;
}

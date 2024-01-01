import { Observable } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { AssetInfo } from '../../common/models/AssetInfo';
import { NetworkData } from './NetworkData';
import { NetworkOperations } from './NetworkOperations';
import { BaseNetworkSettings, NetworkSettings } from './NetworkSettings';
import { NetworkUtils } from './NetworkUtils';
import { NetworkWidgets } from './NetworkWidgets';
import { Wallet } from './Wallet';

export type SupportedNetworks = 'ergo';

export interface Network<
  W extends Wallet,
  S extends BaseNetworkSettings,
  P extends AmmPool = AmmPool,
> extends NetworkData<W>,
    NetworkOperations,
    NetworkWidgets<P>,
    NetworkUtils,
    NetworkSettings<S> {
  readonly name: SupportedNetworks;
  readonly favicon: string;
  readonly label: string;
  readonly convenientAssetDefaultPreview: string;
  readonly networkAsset: AssetInfo;
  readonly initialized$: Observable<boolean>;
  readonly initialize: () => void;
}

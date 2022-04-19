import { AssetInfo } from '../../common/models/AssetInfo';
import { NetworkData } from './NetworkData';
import { NetworkOperations } from './NetworkOperations';
import { NetworkWidgets } from './NetworkWidgets';
import { Wallet } from './Wallet';

export interface Network<W extends Wallet>
  extends NetworkData<W>,
    NetworkOperations,
    NetworkWidgets {
  readonly name: string;
  readonly networkAsset: AssetInfo;
}

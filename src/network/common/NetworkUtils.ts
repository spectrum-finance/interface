import { AssetInfo } from '../../common/models/AssetInfo';
import { Address, TxId } from '../../common/types';

export interface NetworkUtils {
  exploreTx(txId: TxId): unknown;
  exploreToken(asset: AssetInfo): unknown;
  exploreAddress(address: Address): unknown;
  exploreLastBlock(lastBlockId: number): unknown;
}

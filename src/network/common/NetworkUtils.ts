import { Address, TxId } from '../../common/types';

export interface NetworkUtils {
  exploreTx(txId: TxId): unknown;
  exploreAddress(address: Address): unknown;
  exploreLastBlock(lastBlockId: number): unknown;
}

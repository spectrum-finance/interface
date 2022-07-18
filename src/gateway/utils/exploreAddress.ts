import { first } from 'rxjs';

import { AssetInfo } from '../../common/models/AssetInfo';
import { Address, TxId } from '../../common/types';
import { selectedNetwork$ } from '../common/network';

export const exploreAddress = (address: Address): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.exploreAddress(address));
};

export const exploreTx = (txId: TxId): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.exploreTx(txId));
};

export const exploreLastBlock = (lastBlockId: number): void => {
  selectedNetwork$
    .pipe(first())
    .subscribe((n) => n.exploreLastBlock(lastBlockId));
};

export const exploreToken = (asset: AssetInfo): void => {
  selectedNetwork$.pipe(first()).subscribe((n) => n.exploreToken(asset));
};

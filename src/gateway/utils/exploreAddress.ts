import { first } from 'rxjs';

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

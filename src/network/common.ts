import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Address } from '@ergolabs/ergo-sdk';
import { Observable } from 'rxjs';

export interface Network {
  readonly addresses$: Observable<Address[]>;
  readonly pendingTransactionsCount$: Observable<number>;
  readonly getTxHistory: (limit: number) => Observable<AmmDexOperation[]>;
}

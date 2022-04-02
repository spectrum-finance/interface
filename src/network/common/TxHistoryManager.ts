import { AmmDexOperation } from '@ergolabs/ergo-dex-sdk';
import { Observable } from 'rxjs';

export interface TxHistoryManager {
  readonly transactionHistory$: Observable<AmmDexOperation[]>;
  readonly isSyncing$: Observable<boolean>;
  readonly sync: () => void;
}

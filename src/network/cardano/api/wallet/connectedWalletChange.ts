import { Observable } from 'rxjs';

import { AdditionalData } from './common/AdditionalData';
import { Wallet } from './common/Wallet';
import { selectedWallet$ } from './wallet';

export const connectedWalletChange$: Observable<
  Wallet<AdditionalData> | undefined
> = selectedWallet$;

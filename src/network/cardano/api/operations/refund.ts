import { AmmOrderRefunds } from '@ergolabs/cardano-dex-sdk';
import { first, Observable, switchMap, tap, zip } from 'rxjs';

import { TxId } from '../../../../common/types';
import { settings$ } from '../../settings/settings';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../common/cardanoNetwork';
import { submitTx } from './common/submitTx';

const ammRefunds = new AmmOrderRefunds(cardanoNetwork);

export const refund = (): Observable<TxId> =>
  zip([cardanoNetworkParams$, settings$]).pipe(
    first(),
    tap(console.log, console.log),
    switchMap(([networkParams, settings]) =>
      ammRefunds.refund({
        recipientAddress: settings.address!,
        txId: '81afad9972abd16daa45d56592b95d72952f68cb657768d8bb8785e12adda5ab',
      }),
    ),
    tap(console.log, console.log),
    switchMap(submitTx),
    tap(console.log, console.log),
  );

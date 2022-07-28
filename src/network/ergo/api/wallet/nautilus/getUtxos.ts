import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { from, map, Observable } from 'rxjs';

export const getUtxos = (): Observable<ErgoBox[]> =>
  from(
    ergoConnector.nautilus.getContext().then((context) => context.get_utxos()),
  ).pipe(
    map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
    map((data) => data ?? []),
  );

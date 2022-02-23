import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { from, map, Observable } from 'rxjs';

export const getUtxos = (): Observable<ErgoBox[]> =>
  from(ergo.get_utxos()).pipe(
    map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
    map((data) => data ?? []),
  );

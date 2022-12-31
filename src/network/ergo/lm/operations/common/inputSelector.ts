import {
  BoxSelection,
  DefaultBoxSelector,
  InputSelector,
  InsufficientInputs,
  MinBoxValue,
  OverallAmount,
} from '@ergolabs/ergo-sdk';
import { first, map } from 'rxjs';

import { utxos$ } from '../../../api/utxos/utxos';

export class DefaultInputSelector implements InputSelector {
  select(target: OverallAmount): Promise<BoxSelection | InsufficientInputs> {
    return utxos$
      .pipe(
        first(),
        map((utxos) =>
          DefaultBoxSelector.select(utxos, target, MinBoxValue * 3n),
        ),
      )
      .toPromise() as Promise<BoxSelection | InsufficientInputs>;
  }
}

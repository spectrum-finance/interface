import {
  mkAmmActions,
  mkAmmOutputs,
  mkTxAsm,
  mkTxMath,
} from '@ergolabs/cardano-dex-sdk';
import { DefaultAmmTxCandidateBuilder } from '@ergolabs/cardano-dex-sdk/build/main/amm/interpreters/ammTxBuilder/ammTxBuilder';
import { OrderAddrsV1Testnet } from '@ergolabs/cardano-dex-sdk/build/main/amm/scripts';
import { NetworkParams } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { CardanoWasm } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { cardanoNetworkParams$ } from '../../common/cardanoNetwork';
import { cardanoWasm$ } from '../../common/cardanoWasm';
import { DefaultInputSelector } from './inputSelector';

export const transactionBuilder$ = combineLatest([
  cardanoWasm$,
  cardanoNetworkParams$,
]).pipe(
  map(([cardanoWasm, cardanoNetworkParams]: [CardanoWasm, NetworkParams]) => {
    const txMath = mkTxMath(cardanoNetworkParams.pparams, cardanoWasm);
    const ammOutputs = mkAmmOutputs(OrderAddrsV1Testnet, txMath, cardanoWasm);
    const ammActions = mkAmmActions(ammOutputs, '');
    const inputSelector = new DefaultInputSelector();
    const txAsm = mkTxAsm(cardanoNetworkParams, cardanoWasm);

    return new DefaultAmmTxCandidateBuilder(
      txMath,
      ammOutputs,
      ammActions,
      inputSelector,
      cardanoWasm,
      txAsm,
    );
  }),
  publishReplay(1),
  refCount(),
);

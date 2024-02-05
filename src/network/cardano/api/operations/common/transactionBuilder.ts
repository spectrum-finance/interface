import {
  mkAmmActions,
  mkAmmOutputs,
  mkTxAsm,
  mkTxMath,
  ScriptCredsV1,
} from '@spectrumlabs/cardano-dex-sdk';
import { DefaultAmmTxCandidateBuilder } from '@spectrumlabs/cardano-dex-sdk/build/main/amm/interpreters/ammTxBuilder/ammTxBuilder';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { CardanoWasm } from '@spectrumlabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { cardanoNetworkData } from '../../../utils/cardanoNetworkData';
import {
  cardanoNetwork,
  cardanoNetworkParams$,
} from '../../common/cardanoNetwork';
import { cardanoWasm$ } from '../../common/cardanoWasm';
import {
  DefaultCollateralSelector,
  DefaultInputCollector,
  DefaultInputSelector,
} from './inputSelector';

export const transactionBuilder$ = combineLatest([
  cardanoWasm$,
  cardanoNetworkParams$,
]).pipe(
  map(([cardanoWasm, cardanoNetworkParams]: [CardanoWasm, NetworkParams]) => {
    const txMath = mkTxMath(cardanoNetworkParams.pparams, cardanoWasm);
    const ammOutputs = mkAmmOutputs(
      cardanoNetworkData.addrs,
      txMath,
      cardanoWasm,
    );
    const ammActions = mkAmmActions(ammOutputs, '');
    const inputSelector = new DefaultInputSelector();
    const inputCollector = new DefaultInputCollector();
    const txAsm = mkTxAsm(cardanoNetworkParams, cardanoWasm);
    const collateralSelector = new DefaultCollateralSelector();

    return new DefaultAmmTxCandidateBuilder(
      txMath,
      ammOutputs,
      ammActions,
      inputSelector,
      inputCollector,
      collateralSelector,
      cardanoWasm,
      txAsm,
      cardanoNetworkData.addrs,
      ScriptCredsV1,
      cardanoNetworkParams.pparams,
      cardanoNetwork,
    );
  }),
  publishReplay(1),
  refCount(),
);

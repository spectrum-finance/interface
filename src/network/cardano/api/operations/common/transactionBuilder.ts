import {
  mkAmmActions,
  mkAmmOutputs,
  mkTxAsm,
  mkTxMath,
} from '@teddyswap/cardano-dex-sdk';
import { DefaultAmmTxCandidateBuilder } from '@teddyswap/cardano-dex-sdk/build/main/amm/interpreters/ammTxBuilder/ammTxBuilder';
import { NetworkParams } from '@teddyswap/cardano-dex-sdk/build/main/cardano/entities/env';
import { CardanoWasm } from '@teddyswap/cardano-dex-sdk/build/main/utils/rustLoader';
import { combineLatest, map, publishReplay, refCount } from 'rxjs';

import { cardanoNetworkData } from '../../../utils/cardanoNetworkData';
import { cardanoNetworkParams$ } from '../../common/cardanoNetwork';
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
    const ammActions = mkAmmActions(
      ammOutputs,
      'addr1q8kuqjlchm5uwrt07rc7xc6436zkgsl3a77rr64xe8ah0mjycz22w98pwn93ygptan36rt8x386ut056ps7ggs7q2msq69ll27',
    );
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
    );
  }),
  publishReplay(1),
  refCount(),
);

import { Quickblue } from '@spectrumlabs/cardano-dex-sdk';
import {
  NetworkParams,
  ProtocolParams,
} from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { from, map, Observable, publishReplay, refCount } from 'rxjs';

import { cardanoNetworkData } from '../../utils/cardanoNetworkData';

const DEFAULT_PROTOCOL_PARAMS: Pick<
  ProtocolParams,
  'minUTxOValue' | 'utxoCostPerWord'
> = {
  minUTxOValue: 34482,
  utxoCostPerWord: 34482n,
};

const normalizeNetworkParams = (np: NetworkParams): NetworkParams => ({
  ...np,
  pparams: {
    ...np.pparams,
    minUTxOValue: np.pparams.minUTxOValue
      ? Math.max(DEFAULT_PROTOCOL_PARAMS.minUTxOValue, np.pparams.minUTxOValue)
      : DEFAULT_PROTOCOL_PARAMS.minUTxOValue,
    utxoCostPerWord: np.pparams.utxoCostPerWord
      ? np.pparams.utxoCostPerWord > DEFAULT_PROTOCOL_PARAMS.utxoCostPerWord
        ? np.pparams.utxoCostPerWord
        : DEFAULT_PROTOCOL_PARAMS.utxoCostPerWord
      : DEFAULT_PROTOCOL_PARAMS.utxoCostPerWord,
  },
});

export const cardanoNetwork = new Quickblue(cardanoNetworkData.networkUrl);

export const cardanoNetworkParams$: Observable<NetworkParams> = from(
  cardanoNetwork.getNetworkParams(),
).pipe(map(normalizeNetworkParams), publishReplay(1), refCount());

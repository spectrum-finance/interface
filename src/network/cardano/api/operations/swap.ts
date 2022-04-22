import {
  mkAmmActions,
  mkAmmOutputs,
  mkTxMath,
  OrderRequestKind,
  TxCandidate,
} from '@ergolabs/cardano-dex-sdk';
import { OrderAddrsV1Testnet } from '@ergolabs/cardano-dex-sdk/build/main/amm/scripts';
import { NetworkParams } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { TxOut } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { first, Observable, switchMap, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { utxos$ } from '../utxos/utxos';
import { submitTx } from './common/submitTx';

interface SwapTxCandidateConfig {
  readonly networkParams: NetworkParams;
  readonly settings: CardanoSettings;
  readonly pool: CardanoAmmPool;
  readonly from: Currency;
  readonly to: Currency;
  readonly utxos: TxOut[];
}

const toSwapTxCandidate = ({
  networkParams,
  settings,
  pool,
  from,
  to,
  utxos,
}: SwapTxCandidateConfig): TxCandidate => {
  if (!settings.address || !settings.ph) {
    throw new Error('[swap]: address is not selected');
  }

  const txMath = mkTxMath(networkParams.pparams, RustModule.CardanoWasm);
  const ammOutputs = mkAmmOutputs(
    OrderAddrsV1Testnet,
    txMath,
    RustModule.CardanoWasm,
  );
  const ammActions = mkAmmActions(ammOutputs, settings.address);
  const quoteAsset =
    from.asset.id === pool.x.asset.id ? pool.pool.y.asset : pool.pool.x.asset;
  const baseInput =
    from.asset.id === pool.x.asset.id
      ? pool.pool.x.withAmount(from.amount)
      : pool.pool.y.withAmount(from.amount);

  return ammActions.createOrder(
    {
      kind: OrderRequestKind.Swap,
      poolId: pool.pool.id,
      rewardPkh: settings.ph,
      poolFeeNum: pool.poolFeeNum,
      baseInput: baseInput,
      quoteAsset: quoteAsset,
      minQuoteOutput: to.amount,
      uiFee: UI_FEE_BIGINT,
      exFeePerToken: {
        numerator: 2500000n,
        denominator: 1n,
      },
    },
    {
      changeAddr: settings.address,
      collateralInputs: [],
      inputs: utxos.map((u) => ({ txOut: u })),
    },
  );
};

export const swap = (
  pool: CardanoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  zip([cardanoNetworkParams$, utxos$, settings$]).pipe(
    first(),
    switchMap(([networkParams, utxos, settings]) =>
      submitTx(
        toSwapTxCandidate({
          pool,
          from,
          to,
          networkParams,
          utxos,
          settings,
        }),
      ),
    ),
  );

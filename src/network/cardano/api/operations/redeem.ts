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

interface DepositTxCandidateConfig {
  readonly pool: CardanoAmmPool;
  readonly lq: Currency;
  readonly settings: CardanoSettings;
  readonly utxos: TxOut[];
  readonly networkParams: NetworkParams;
}

const toRedeemTxCandidate = ({
  pool,
  settings,
  networkParams,
  utxos,
  lq,
}: DepositTxCandidateConfig): TxCandidate => {
  if (!settings.address || !settings.ph) {
    throw new Error('[deposit]: wallet address is not selected');
  }

  const txMath = mkTxMath(networkParams.pparams, RustModule.CardanoWasm);
  const ammOutputs = mkAmmOutputs(
    OrderAddrsV1Testnet,
    txMath,
    RustModule.CardanoWasm,
  );
  const ammActions = mkAmmActions(ammOutputs, settings.address);
  const lqAmount = pool.pool.lp.withAmount(lq.amount);

  return ammActions.createOrder(
    {
      kind: OrderRequestKind.Redeem,
      poolId: pool.pool.id,
      x: pool.pool.x.asset,
      y: pool.pool.y.asset,
      lq: lqAmount,
      rewardPkh: settings.ph,
      uiFee: UI_FEE_BIGINT,
      exFee: 1n,
    },
    {
      changeAddr: settings.address,
      collateralInputs: [],
      inputs: utxos.map((u) => ({ txOut: u })),
    },
  );
};

export const redeem = (pool: CardanoAmmPool, lq: Currency): Observable<TxId> =>
  zip([cardanoNetworkParams$, utxos$, settings$]).pipe(
    first(),
    switchMap(([networkParams, utxos, settings]) =>
      submitTx(
        toRedeemTxCandidate({
          pool,
          lq,
          networkParams,
          utxos,
          settings,
        }),
      ),
    ),
  );

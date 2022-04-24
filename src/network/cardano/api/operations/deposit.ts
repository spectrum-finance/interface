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
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: CardanoSettings;
  readonly utxos: TxOut[];
  readonly networkParams: NetworkParams;
}

const toDepositTxCandidate = ({
  pool,
  x,
  y,
  settings,
  networkParams,
  utxos,
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
  const xAmount = pool.pool.x.withAmount(x.amount);
  const yAmount = pool.pool.y.withAmount(y.amount);

  return ammActions.createOrder(
    {
      kind: OrderRequestKind.Deposit,
      poolId: pool.pool.id,
      x: xAmount,
      y: yAmount,
      lq: pool.pool.lp.asset,
      rewardPkh: settings.ph,
      uiFee: UI_FEE_BIGINT,
      exFee: 1n,
      collateralAda: 0n,
    },
    {
      changeAddr: settings.address,
      collateralInputs: [],
      inputs: utxos.map((u) => ({ txOut: u })),
    },
  );
};

export const deposit = (
  pool: CardanoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  zip([cardanoNetworkParams$, utxos$, settings$]).pipe(
    first(),
    switchMap(([networkParams, utxos, settings]) =>
      submitTx(
        toDepositTxCandidate({
          pool,
          x,
          y,
          networkParams,
          utxos,
          settings,
        }),
      ),
    ),
  );

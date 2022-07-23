import {
  minBudgetForRedeem,
  mkAmmActions,
  mkAmmOutputs,
  mkTxMath,
  stakeKeyHashFromAddr,
  TxCandidate,
} from '@ergolabs/cardano-dex-sdk';
import { OrderKind } from '@ergolabs/cardano-dex-sdk/build/main/amm/models/opRequests';
import { OrderAddrsV1Testnet } from '@ergolabs/cardano-dex-sdk/build/main/amm/scripts';
import { NetworkParams } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import { first, map, Observable, switchMap, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { TxSuccess } from '../../../../common/services/submitTx';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { getUtxosByAmount } from '../utxos/utxos';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTx';

interface DepositTxCandidateConfig {
  readonly pool: CardanoAmmPool;
  readonly lq: Currency;
  readonly settings: CardanoSettings;
  readonly networkParams: NetworkParams;
}

const toRedeemTxCandidate = ({
  pool,
  settings,
  networkParams,
  lq,
}: DepositTxCandidateConfig): Observable<TxCandidate> => {
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
  const [estimatedOutputX, estimatedOutputY] = pool.pool.shares(lqAmount);

  const redeemVariables = minBudgetForRedeem(
    lqAmount,
    estimatedOutputX,
    estimatedOutputY,
    ammTxFeeMapping,
    minExecutorReward,
    UI_FEE_BIGINT,
    txMath,
  );

  if (!redeemVariables) {
    throw new Error('incorrect redeem variables');
  }

  const [redeemBudget, redeemValue] = redeemVariables;

  return getUtxosByAmount(redeemValue).pipe(
    map((utxos) =>
      ammActions.createOrder(
        {
          kind: OrderKind.Redeem,
          poolId: pool.pool.id,
          x: pool.pool.x.asset,
          y: pool.pool.y.asset,
          lq: lqAmount,
          rewardPkh: settings.ph!,
          stakePkh: stakeKeyHashFromAddr(
            settings.address!,
            RustModule.CardanoWasm,
          ),
          exFee: minExecutorReward + ammTxFeeMapping.redeemExecution,
          uiFee: UI_FEE_BIGINT,
          orderValue: redeemBudget,
        },
        {
          changeAddr: settings.address!,
          collateralInputs: [],
          inputs: utxos.map((u) => ({ txOut: u })),
        },
      ),
    ),
  );
};

export const redeem = (
  pool: CardanoAmmPool,
  lq: Currency,
): Observable<TxSuccess> =>
  zip([cardanoNetworkParams$, settings$]).pipe(
    first(),
    switchMap(([networkParams, settings]) =>
      toRedeemTxCandidate({
        pool,
        lq,
        networkParams,
        settings,
      }),
    ),
    switchMap(submitTx),
  );

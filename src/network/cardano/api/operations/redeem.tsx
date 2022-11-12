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
import React from 'react';
import { first, map, Observable, Subject, switchMap, tap, zip } from 'rxjs';

import { panalytics } from '../../../../common/analytics';
import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { depositAda } from '../../settings/depositAda';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { RedeemConfirmationModal } from '../../widgets/RedeemConfirmationModal/RedeemConfirmationModal';
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
    minExecutorReward + depositAda.amount,
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

export const walletRedeem = (
  pool: CardanoAmmPool,
  lq: Currency,
): Observable<TxId> =>
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
    tap((_) => console.log(_)),
    switchMap(submitTx),
    tap(null, (_) => console.log(_)),
  );

export const redeem = (
  pool: CardanoAmmPool,
  data: Required<RemoveLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <RedeemConfirmationModal
          pool={pool}
          value={data}
          onClose={(request) =>
            next(
              request.pipe(
                tap((txId) => {
                  subject.next(txId);
                  subject.complete();
                }),
              ),
            )
          }
        />
      );
    },
    Operation.REMOVE_LIQUIDITY,
    {
      xAsset: data.xAmount,
      yAsset: data.yAmount,
    },
    () => {
      panalytics.closeConfirmRedeem(data, pool);
    },
  );

  return subject.asObservable();
};

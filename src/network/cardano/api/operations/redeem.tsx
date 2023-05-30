import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { RedeemTxInfo, TxCandidate } from '@spectrumlabs/cardano-dex-sdk';
import { NetworkParams } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/env';
import { first, map, Observable, Subject, switchMap, tap, zip } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { RedeemConfirmationModal } from '../../widgets/RedeemConfirmationModal/RedeemConfirmationModal';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTx';
import { transactionBuilder$ } from './common/transactionBuilder';

interface DepositTxCandidateConfig {
  readonly pool: CardanoAmmPool;
  readonly lq: Currency;
  readonly settings: CardanoSettings;
  readonly networkParams: NetworkParams;
}

const toRedeemTxCandidate = ({
  pool,
  settings,
  lq,
}: DepositTxCandidateConfig): Observable<TxCandidate> => {
  if (!settings.address || !settings.ph) {
    throw new Error('[deposit]: wallet address is not selected');
  }
  const lqAmount = pool.pool.lp.withAmount(lq.amount);

  return transactionBuilder$.pipe(
    switchMap((txBuilder) =>
      txBuilder.redeem({
        lq: lqAmount,
        pool: pool.pool,
        slippage: settings.slippage,
        txFees: ammTxFeeMapping,
        minExecutorReward: minExecutorReward,
        changeAddress: settings.address!,
        pk: settings.ph!,
      }),
    ),
    map(
      ([, txCandidate]: [Transaction | null, TxCandidate, RedeemTxInfo]) =>
        txCandidate,
    ),
    first(),
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
    switchMap(submitTx),
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
  );

  return subject.asObservable();
};

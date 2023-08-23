import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { t } from '@lingui/macro';
import * as Sentry from '@sentry/react';
import { Severity } from '@sentry/react';
import { SwapTxInfo, TxCandidate } from '@spectrumlabs/cardano-dex-sdk';
import {
  catchError,
  first,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import {
  addErrorLog,
  toSentryOperationError,
} from '../../../../common/services/ErrorLogs';
import { Nitro, Percent, TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { isLbspAmmPool } from '../../../../utils/lbsp';
import {
  CardanoSettings,
  settings$,
  useSettings,
} from '../../settings/settings';
import { SwapConfirmationModal } from '../../widgets/SwapConfirmationModal/SwapConfirmationModal';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { networkAsset } from '../networkAsset/networkAsset';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTxCandidate';
import { transactionBuilder$ } from './common/transactionBuilder';

interface SwapTxCandidateConfig {
  readonly settings: CardanoSettings;
  readonly pool: CardanoAmmPool;
  readonly from: Currency;
  readonly to: Currency;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

const toSwapTxCandidate = ({
  settings,
  pool,
  from,
  slippage,
  nitro,
}: SwapTxCandidateConfig): Observable<Transaction> => {
  if (!settings.address || !settings.ph) {
    throw new Error('[swap]: address is not selected');
  }
  const baseInput =
    from.asset.id === pool.x.asset.id
      ? pool.pool.x.withAmount(from.amount)
      : pool.pool.y.withAmount(from.amount);
  const quoteOutput = pool.pool.outputAmount(baseInput, slippage);

  return transactionBuilder$.pipe(
    switchMap((txBuilder) =>
      txBuilder.swap({
        slippage,
        nitro,
        minExecutorReward: minExecutorReward,
        base: baseInput,
        quote: quoteOutput,
        changeAddress: settings.address!,
        pk: settings.ph!,
        txFees: ammTxFeeMapping,
        pool: pool.pool,
      }),
    ),
    map(
      ([transaction]: [
        Transaction | null,
        TxCandidate,
        SwapTxInfo,
        Error | null,
      ]) => transaction!,
    ),
    first(),
  );
};

export const walletSwap = (
  pool: CardanoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      toSwapTxCandidate({
        pool,
        from,
        to,
        settings,
        slippage: settings.slippage,
        nitro: settings.nitro,
      }),
    ),
    switchMap((tx) => submitTx(tx)),
    tap({ error: addErrorLog({ op: 'swap' }) }),
    catchError((err) => throwError(toSentryOperationError(err))),
  );

export const swap = (data: Required<SwapFormModel>): Observable<TxId> => {
  const subject = new Subject<string>();

  openConfirmationModal(
    (next) => {
      return (
        <SwapConfirmationModal
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
    Operation.SWAP,
    {
      xAsset: data.fromAmount!,
      yAsset: data.toAmount!,
    },
  );

  return subject;
};

export const useSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const settings = useSettings();

  const ammPoolMinValueForSwapCardanoValidator: OperationValidator<SwapFormModel> =
    ({ value: { pool } }) => {
      if (!pool || !isLbspAmmPool(pool.id)) {
        return undefined;
      }
      const minLqAdaValue = new Currency(
        (pool as CardanoAmmPool).pool.lqBound,
        networkAsset,
      );
      return pool.x.mult(2n).lte(minLqAdaValue)
        ? `Pool liquidity is low, need ${minLqAdaValue.toString()} ADA`
        : undefined;
    };

  const insufficientAssetForFeeValidator: OperationValidator<
    Required<SwapFormModel>
  > = ({ value: { fromAmount, pool } }) => {
    const baseInput =
      fromAmount.asset.id === pool.x.asset.id
        ? pool.pool.x.withAmount(fromAmount.amount)
        : pool.pool.y.withAmount(fromAmount.amount);
    const quoteOutput = pool.pool.outputAmount(
      baseInput as any,
      settings.slippage,
    );

    return transactionBuilder$.pipe(
      switchMap((txBuilder) =>
        txBuilder.swap({
          slippage: settings.slippage,
          nitro: settings.nitro,
          minExecutorReward: minExecutorReward,
          base: baseInput as any,
          quote: quoteOutput as any,
          changeAddress: settings.address!,
          pk: settings.ph!,
          txFees: ammTxFeeMapping,
          pool: pool.pool as any,
        }),
      ),
      map(
        (data: [Transaction | null, TxCandidate, SwapTxInfo, Error | null]) => {
          const error = data[3];

          if (error && !data[0]) {
            Sentry.captureMessage(error?.message || (error as any), {
              level: Severity.Critical,
            });
            addErrorLog({ op: 'swapValidation', ctx: data[2] })(error);
          }
          return data[0]
            ? undefined
            : t`Insufficient ${networkAsset.ticker} balance for fees`;
        },
      ),
      first(),
    );
  };

  return [
    ammPoolMinValueForSwapCardanoValidator,
    insufficientAssetForFeeValidator as any,
  ];
};

export const useHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  return (balance) => balance;
};

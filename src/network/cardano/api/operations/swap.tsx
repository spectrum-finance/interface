import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';
import { t } from '@lingui/macro';
import { SwapTxInfo, TxCandidate } from '@spectrumlabs/cardano-dex-sdk';
import { first, map, Observable, Subject, switchMap, tap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { Nitro, Percent, TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
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
      ([transaction]: [Transaction | null, TxCandidate, SwapTxInfo]) =>
        transaction!,
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
    switchMap(tx => submitTx(tx)),
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
      map((data: [Transaction | null, TxCandidate, SwapTxInfo]) =>
        data[0]
          ? undefined
          : t`Insufficient ${networkAsset.ticker} balance for fees`,
      ),
      first(),
    );
  };

  return [insufficientAssetForFeeValidator as any];
};

export const useHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  return (balance) => balance;
};

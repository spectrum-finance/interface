import { RedeemParams } from '@spectrumlabs/cardano-dex-sdk';
import { Value } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/value';
import { useEffect } from 'react';
import { map, Observable, of, publishReplay, refCount, switchMap } from 'rxjs';

import { useSubject } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { ammTxFeeMapping } from '../../api/operations/common/ammTxFeeMapping';
import { minExecutorReward } from '../../api/operations/common/minExecutorReward';
import { transactionBuilder$ } from '../../api/operations/common/transactionBuilder.ts';
import {
  CardanoSettings,
  settings,
  useSettings,
} from '../../settings/settings';

export interface ExtendedRedeemTxInfo {
  readonly txFee: Currency | undefined;
  readonly exFee: Currency;
  readonly refundableDeposit: Currency;
  readonly xOutput: Currency;
  readonly yOutput: Currency;
  readonly orderBudget: Value;
  readonly orderValue: Value;
}

export const useRedeemTxInfo = (
  value: RemoveLiquidityFormModel,
  pool: AmmPool,
): [ExtendedRedeemTxInfo | undefined, boolean, CardanoSettings] => {
  const { slippage } = useSettings();

  const [redeemTxInfo, updateRedeemTxInfo, isRedeemTxInfoLoading] = useSubject(
    (
      value: RemoveLiquidityFormModel,
      swapParams?: RedeemParams,
    ): Observable<ExtendedRedeemTxInfo | undefined> => {
      if (!swapParams) {
        return of(undefined);
      }

      return transactionBuilder$.pipe(
        switchMap((txBuilder) => txBuilder.redeem(swapParams)),
        map(([, , txInfo]) => ({
          ...txInfo,
          txFee: txInfo.txFee
            ? new Currency(txInfo.txFee, networkAsset)
            : undefined,
          exFee: new Currency(txInfo.exFee, networkAsset),
          refundableDeposit: new Currency(
            txInfo.refundableDeposit,
            networkAsset,
          ),
          xOutput: new Currency(txInfo.xOutput.amount, value.xAmount?.asset),
          yOutput: new Currency(txInfo.yOutput.amount, value.yAmount?.asset),
          orderBudget: txInfo.orderBudget,
          orderValue: txInfo.orderValue,
        })),
        publishReplay(1),
        refCount(),
      );
    },
  );

  useEffect(() => {
    const { lpAmount } = value;

    if (!pool || !lpAmount || !lpAmount.isPositive()) {
      updateRedeemTxInfo(value);
      return;
    }

    updateRedeemTxInfo(value, {
      slippage,
      minExecutorReward: minExecutorReward,
      changeAddress: settings.address!,
      pk: settings.ph!,
      txFees: ammTxFeeMapping,
      pool: pool.pool as any,
      lq: pool.pool.lp.withAmount(lpAmount.amount) as any,
    });
  }, [value.yAmount, value.xAmount, value.lpAmount, slippage, settings]);

  return [redeemTxInfo, isRedeemTxInfoLoading, settings];
};

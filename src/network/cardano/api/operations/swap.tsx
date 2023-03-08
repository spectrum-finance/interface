import {
  minBudgetForSwap,
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
import { t } from '@lingui/macro';
import React from 'react';
import { first, map, Observable, Subject, switchMap, tap, zip } from 'rxjs';

// import { panalytics } from '../../../../common/analytics';
import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { Nitro, Percent, TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { depositAda } from '../../settings/depositAda';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { useSwapValidationFee } from '../../settings/totalFee';
import { SwapConfirmationModal } from '../../widgets/SwapConfirmationModal/SwapConfirmationModal';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { networkAsset } from '../networkAsset/networkAsset';
import { getUtxosByAmount } from '../utxos/utxos';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTx';

interface SwapTxCandidateConfig {
  readonly networkParams: NetworkParams;
  readonly settings: CardanoSettings;
  readonly pool: CardanoAmmPool;
  readonly from: Currency;
  readonly to: Currency;
  readonly slippage: Percent;
  readonly nitro: Nitro;
}

const toSwapTxCandidate = ({
  networkParams,
  settings,
  pool,
  from,
  slippage,
  nitro,
}: SwapTxCandidateConfig): Observable<TxCandidate> => {
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
  const baseInput =
    from.asset.id === pool.x.asset.id
      ? pool.pool.x.withAmount(from.amount)
      : pool.pool.y.withAmount(from.amount);
  const quoteOutput = pool.pool.outputAmount(baseInput, slippage);

  const swapVariables = minBudgetForSwap(
    baseInput,
    quoteOutput,
    nitro,
    ammTxFeeMapping,
    minExecutorReward,
    UI_FEE_BIGINT,
    txMath,
  );

  if (!swapVariables) {
    throw new Error('incorrect swap variables');
  }

  const [swapBudget, swapValue, feePerToken, swapExtremums] = swapVariables;

  return getUtxosByAmount(swapBudget).pipe(
    map((utxos) => {
      return ammActions.createOrder(
        {
          kind: OrderKind.Swap,
          poolId: pool.pool.id,
          rewardPkh: settings.ph!,
          stakePkh: stakeKeyHashFromAddr(
            settings.address!,
            RustModule.CardanoWasm,
          ),
          poolFeeNum: pool.poolFeeNum,
          baseInput: baseInput,
          quoteAsset: quoteOutput.asset,
          minQuoteOutput: swapExtremums.minOutput.amount,
          uiFee: UI_FEE_BIGINT,
          exFeePerToken: feePerToken,
          orderValue: swapValue,
        },
        {
          changeAddr: settings.address!,
          collateralInputs: [],
          inputs: utxos.map((txOut) => ({ txOut })),
        },
      );
    }),
  );
};

export const walletSwap = (
  pool: CardanoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  zip([cardanoNetworkParams$, settings$]).pipe(
    first(),
    switchMap(([networkParams, settings]) =>
      toSwapTxCandidate({
        pool,
        from,
        to,
        networkParams,
        settings,
        slippage: settings.slippage,
        nitro: settings.nitro,
      }),
    ),
    switchMap(submitTx),
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
    () => {
      // panalytics.closeConfirmSwap(data);
    },
  );

  return subject;
};

export const useSwapValidators = (): OperationValidator<SwapFormModel>[] => {
  const swapValidationFee = useSwapValidationFee();

  const insufficientAssetForFeeValidator: OperationValidator<
    Required<SwapFormModel>
  > = ({ value: { fromAmount } }, balance) => {
    const totalFeesWithAmount = fromAmount.isAssetEquals(networkAsset)
      ? fromAmount.plus(swapValidationFee).minus(depositAda)
      : swapValidationFee.minus(depositAda);

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? t`Insufficient ${networkAsset.ticker} balance for fees`
      : undefined;
  };

  const insufficientAssetForRefundableDepositValidator: OperationValidator<
    Required<SwapFormModel>
  > = ({ value: { fromAmount } }, balance) => {
    const totalFeesWithAmount = fromAmount.isAssetEquals(networkAsset)
      ? fromAmount.plus(swapValidationFee)
      : swapValidationFee;

    return totalFeesWithAmount.gt(balance.get(networkAsset))
      ? t`Insufficient ${networkAsset.ticker} for refundable deposit`
      : undefined;
  };

  return [
    insufficientAssetForFeeValidator as any,
    insufficientAssetForRefundableDepositValidator as any,
  ];
};

export const useHandleSwapMaxButtonClick = (): ((
  balance: Currency,
) => Currency) => {
  const swapValidationFee = useSwapValidationFee();

  return (balance) =>
    balance.asset.id === networkAsset.id
      ? balance.minus(swapValidationFee)
      : balance;
};

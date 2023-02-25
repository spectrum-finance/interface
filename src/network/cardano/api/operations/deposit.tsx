import {
  minBudgetForDeposit,
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

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { OperationValidator } from '../../../../components/OperationForm/OperationForm';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { depositAda } from '../../settings/depositAda';
import { CardanoSettings, settings$ } from '../../settings/settings';
import { useDepositValidationFee } from '../../settings/totalFee';
import { DepositConfirmationModal } from '../../widgets/DepositConfirmationModal/DepositConfirmationModal';
import { CardanoAmmPool } from '../ammPools/CardanoAmmPool';
import { cardanoNetworkParams$ } from '../common/cardanoNetwork';
import { networkAsset } from '../networkAsset/networkAsset';
import { getUtxosByAmount } from '../utxos/utxos';
import { ammTxFeeMapping } from './common/ammTxFeeMapping';
import { minExecutorReward } from './common/minExecutorReward';
import { submitTx } from './common/submitTx';

interface DepositTxCandidateConfig {
  readonly pool: CardanoAmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: CardanoSettings;
  readonly networkParams: NetworkParams;
}

const toDepositTxCandidate = ({
  pool,
  x,
  y,
  settings,
  networkParams,
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
  const xAmount = pool.pool.x.withAmount(x.amount);
  const yAmount = pool.pool.y.withAmount(y.amount);
  const lpAmount = pool.pool.rewardLP(xAmount, yAmount);

  const depositVariables = minBudgetForDeposit(
    xAmount,
    yAmount,
    lpAmount,
    ammTxFeeMapping,
    minExecutorReward,
    UI_FEE_BIGINT,
    txMath,
  );

  if (!depositVariables) {
    throw new Error('incorrect deposit variables');
  }

  const [depositBudget, depositValue, depositCollateral] = depositVariables;

  return getUtxosByAmount(depositValue).pipe(
    map((utxos) =>
      ammActions.createOrder(
        {
          kind: OrderKind.Deposit,
          poolId: pool.pool.id,
          x: xAmount,
          y: yAmount,
          lq: lpAmount.asset,
          rewardPkh: settings.ph!,
          stakePkh: stakeKeyHashFromAddr(
            settings.address!,
            RustModule.CardanoWasm,
          ),
          uiFee: UI_FEE_BIGINT,
          exFee: minExecutorReward + ammTxFeeMapping.depositExecution,
          orderValue: depositBudget,
          collateralAda: depositCollateral,
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

export const walletDeposit = (
  pool: CardanoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  zip([cardanoNetworkParams$, settings$]).pipe(
    first(),
    switchMap(([networkParams, settings]) =>
      toDepositTxCandidate({
        pool,
        x,
        y,
        networkParams,
        settings,
      }),
    ),
    switchMap(submitTx),
  );

export const deposit = (
  data: Required<AddLiquidityFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <DepositConfirmationModal
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
    Operation.ADD_LIQUIDITY,
    {
      xAsset: data.x!,
      yAsset: data.y!,
    },
  );

  return subject.asObservable();
};

export const useDepositValidators =
  (): OperationValidator<AddLiquidityFormModel>[] => {
    const depositValidationFee = useDepositValidationFee();

    const insufficientFeeValidator: OperationValidator<AddLiquidityFormModel> =
      ({ value: { x, y } }, balance) => {
        let totalFeesWithAmount = depositValidationFee.minus(depositAda);

        totalFeesWithAmount = x?.isAssetEquals(networkAsset)
          ? totalFeesWithAmount.plus(x)
          : totalFeesWithAmount;

        totalFeesWithAmount = y?.isAssetEquals(networkAsset)
          ? totalFeesWithAmount.plus(y)
          : totalFeesWithAmount;

        return totalFeesWithAmount.gt(balance.get(networkAsset))
          ? t`Insufficient ${networkAsset.ticker} balance for fees`
          : undefined;
      };

    const insufficientRefundableBalanceValidator: OperationValidator<AddLiquidityFormModel> =
      ({ value: { x, y } }, balance) => {
        let totalFeesWithAmount = depositValidationFee;

        totalFeesWithAmount = x?.isAssetEquals(networkAsset)
          ? totalFeesWithAmount.plus(x)
          : totalFeesWithAmount;

        totalFeesWithAmount = y?.isAssetEquals(networkAsset)
          ? totalFeesWithAmount.plus(y)
          : totalFeesWithAmount;

        return totalFeesWithAmount.gt(balance.get(networkAsset))
          ? t`Insufficient ${networkAsset.ticker} for refundable deposit`
          : undefined;
      };

    return [insufficientFeeValidator, insufficientRefundableBalanceValidator];
  };

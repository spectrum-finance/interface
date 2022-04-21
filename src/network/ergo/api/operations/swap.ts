import { minValueForOrder, SwapParams } from '@ergolabs/ergo-dex-sdk';
import {
  SwapExtremums,
  swapVars,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import {
  AssetAmount,
  DefaultBoxSelector,
  ErgoBox,
  InsufficientInputs,
  OverallAmount,
  TransactionContext,
} from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import {
  first,
  from as fromPromise,
  Observable,
  of,
  switchMap,
  zip,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { getBaseInputParameters } from '../../../../utils/walletMath';
import { minExFee$ } from '../../settings/executionFee';
import { minerFee$ } from '../../settings/minerFee';
import { nitro$ } from '../../settings/nitro';
import { ErgoSettings, settings$ } from '../../settings/settings';
import { ErgoAmmPool } from '../ammPools/ErgoAmmPool';
import { networkContext$ } from '../networkContext/networkContext';
import { utxos$ } from '../utxos/utxos';
import { makeTarget } from './common/makeTarget';
import { poolActions } from './common/poolActions';
import { submitTx } from './common/submitTx';

interface TxCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly from: Currency;
  readonly to: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  readonly networkContext: NetworkContext;
  readonly nitro: number;
}

const toSwapOperationArgs = ({
  from,
  to,
  settings,
  pool,
  minerFee,
  networkContext,
  utxos,
  minExFee,
  nitro,
}: TxCandidateParams): [SwapParams, TransactionContext] => {
  if (!settings.address || !settings.pk) {
    throw new Error('address not selected');
  }

  const { baseInput, baseInputAmount, minOutput } = getBaseInputParameters(
    pool,
    {
      inputAmount: from,
      slippage: settings.slippage,
    },
  );
  const swapVariables: [number, SwapExtremums] | undefined = swapVars(
    minExFee.amount,
    nitro,
    minOutput,
  );

  if (!swapVariables) {
    throw new Error('incorrect swap data');
  }

  const [exFeePerToken, extremum] = swapVariables;
  const target: OverallAmount = makeTarget(
    [new AssetAmount(from.asset, baseInputAmount)],
    minValueForOrder(minerFee.amount, 0n, extremum.maxExFee),
  );
  const inputs = DefaultBoxSelector.select(utxos, target);

  if (inputs instanceof InsufficientInputs) {
    throw new Error('not enough money');
  }

  const swapParams: SwapParams = {
    poolId: pool.pool.id,
    pk: settings.pk,
    baseInput,
    minQuoteOutput: extremum.minOutput.amount,
    exFeePerToken,
    uiFee: 0n,
    quoteAsset: to.asset.id,
    poolFeeNum: pool.pool.poolFeeNum,
  };
  const txContext: TransactionContext = {
    inputs,
    changeAddress: settings.address,
    selfAddress: settings.address,
    feeNErgs: minerFee.amount,
    network: networkContext,
  };

  return [swapParams, txContext];
};

export const swap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  zip([settings$, utxos$, minerFee$, minExFee$, networkContext$, nitro$]).pipe(
    first(),
    switchMap(
      ([settings, utxos, minerFee, minExFee, networkContext, nitro]) => {
        const [swapParams, txContext] = toSwapOperationArgs({
          from,
          to,
          settings,
          pool,
          minerFee,
          networkContext: networkContext as any,
          utxos,
          minExFee,
          nitro,
        });

        return fromPromise(
          poolActions(pool.pool).swap(swapParams, txContext),
        ).pipe(switchMap((tx) => submitTx(tx)));
      },
    ),
  );

import { SwapParams } from '@ergolabs/ergo-dex-sdk';
import {
  SwapExtremums,
  swapVars,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/math/swap';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, from as fromPromise, Observable, switchMap, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../common/constants/erg';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
import { getBaseInputParameters } from '../../../utils/walletMath';
import { ErgoAmmPool } from '../api/ammPools/ErgoAmmPool';
import { networkContext$ } from '../api/networkContext/networkContext';
import { utxos$ } from '../api/utxos/utxos';
import { minExFee$ } from '../settings/executionFee';
import { minerFee$ } from '../settings/minerFee';
import { ErgoSettings, settings$ } from '../settings/settings';
import { getInputs } from './common/getInputs';
import { getTxContext } from './common/getTxContext';
import { poolActions } from './common/poolActions';
import { submitTx } from './common/submitTx';

interface SwapOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly from: Currency;
  readonly to: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit, refund)
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
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
}: SwapOperationCandidateParams): [SwapParams, TransactionContext] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[swap]: wallet address is not selected');
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
    throw new Error('[swap]: an error occurred in swapVariables');
  }

  const [exFeePerToken, extremum] = swapVariables;

  const inputs = getInputs(
    utxos,
    [new AssetAmount(from.asset, baseInputAmount)],
    {
      minerFee: minerFee.amount,
      uiFee: UI_FEE_BIGINT,
      exFee: extremum.maxExFee,
    },
  );

  const swapParams: SwapParams = {
    poolId: pool.pool.id,
    pk: settings.pk,
    baseInput,
    minQuoteOutput: extremum.minOutput.amount,
    exFeePerToken,
    uiFee: UI_FEE_BIGINT,
    quoteAsset: to.asset.id,
    poolFeeNum: pool.pool.poolFeeNum,
  };
  const txContext: TransactionContext = getTxContext(
    inputs,
    networkContext as NetworkContext,
    settings.address,
    minerFee.amount,
  );

  return [swapParams, txContext];
};

export const swap = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  zip([settings$, utxos$, minerFee$, minExFee$, networkContext$]).pipe(
    first(),
    switchMap(([settings, utxos, minerFee, minExFee, networkContext]) => {
      const [swapParams, txContext] = toSwapOperationArgs({
        from,
        to,
        settings,
        pool,
        minerFee,
        networkContext,
        utxos,
        minExFee,
        nitro: settings.nitro,
      });

      return fromPromise(
        poolActions(pool.pool).swap(swapParams, txContext),
      ).pipe(
        switchMap((tx) =>
          submitTx(tx, {
            type: 'swap',
            baseAsset: from.asset.id,
            baseAmount: from.toAmount(),
            quoteAsset: to.asset.id,
            quoteAmount: to.toAmount(),
            txId: tx.id,
          }),
        ),
      );
    }),
  );

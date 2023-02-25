import { SwapParams } from '@ergolabs/ergo-dex-sdk';
import {
  SwapExtremums,
  swapVars,
} from '@ergolabs/ergo-dex-sdk/build/main/amm/common/math/swap';
import { SpecExFeeType } from '@ergolabs/ergo-dex-sdk/build/main/types';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, Observable, zip } from 'rxjs';

import {
  NEW_MIN_BOX_VALUE,
  UI_FEE_BIGINT,
} from '../../../../../common/constants/erg';
import { Currency } from '../../../../../common/models/Currency';
import { getBaseInputParameters } from '../../../../../utils/walletMath';
import { ErgoAmmPool } from '../../../api/ammPools/ErgoAmmPool';
import { feeAsset, networkAsset } from '../../../api/networkAsset/networkAsset';
import { networkContext$ } from '../../../api/networkContext/networkContext';
import { utxos$ } from '../../../api/utxos/utxos';
import { minExFee$ } from '../../../settings/executionFee/spfExecutionFee';
import { minerFee$ } from '../../../settings/minerFee';
import { ErgoSettings, settings$ } from '../../../settings/settings';
import { maxTotalFee$, minTotalFee$ } from '../../../settings/totalFees';
import { getInputs } from '../../common/getInputs';
import { getTxContext } from '../../common/getTxContext';

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
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
}

export interface AdditionalData {
  readonly pool: ErgoAmmPool;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly p2pkaddress: string;
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
  minTotalFee,
  maxTotalFee,
}: SwapOperationCandidateParams): [
  SwapParams<SpecExFeeType>,
  TransactionContext,
  AdditionalData,
] => {
  console.log('SPF fee swap!');
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
    from.asset.id === feeAsset.id
      ? [new AssetAmount(from.asset, baseInputAmount + extremum.maxExFee)]
      : [
          new AssetAmount(from.asset, baseInputAmount),
          new AssetAmount(feeAsset, extremum.maxExFee),
        ],
    {
      minerFee: minerFee.amount,
      uiFee: UI_FEE_BIGINT,
      exFee:
        baseInput.asset.id !== networkAsset.id
          ? NEW_MIN_BOX_VALUE
          : baseInput.amount > NEW_MIN_BOX_VALUE
          ? 0n
          : NEW_MIN_BOX_VALUE - baseInput.amount,
    },
    true,
  );

  const swapParams: SwapParams<SpecExFeeType> = {
    poolId: pool.pool.id,
    pk: settings.pk,
    baseInput,
    minQuoteOutput: extremum.minOutput.amount,
    exFeePerToken: { amount: exFeePerToken, tokenId: feeAsset.id },
    uiFee: UI_FEE_BIGINT,
    quoteAsset: to.asset.id,
    poolFeeNum: pool.pool.poolFeeNum,
    maxExFee: { amount: extremum.maxExFee, tokenId: feeAsset.id },
  };
  const txContext: TransactionContext = getTxContext(
    inputs,
    networkContext as NetworkContext,
    settings.address,
    minerFee.amount,
  );
  const additionalData: AdditionalData = {
    pool,
    minTotalFee,
    maxTotalFee,
    p2pkaddress: settings.address,
  };

  return [swapParams, txContext, additionalData];
};

export const createSwapTxData = (
  pool: ErgoAmmPool,
  from: Currency,
  to: Currency,
): Observable<
  [SwapParams<SpecExFeeType>, TransactionContext, AdditionalData]
> =>
  zip([
    settings$,
    utxos$,
    minerFee$,
    minExFee$,
    networkContext$,
    minTotalFee$,
    maxTotalFee$,
  ]).pipe(
    first(),
    map(
      ([
        settings,
        utxos,
        minerFee,
        minExFee,
        networkContext,
        minTotalFee,
        maxTotalFee,
      ]) =>
        toSwapOperationArgs({
          from,
          to,
          settings,
          pool,
          minerFee,
          networkContext,
          utxos,
          minExFee,
          nitro: settings.nitro,
          minTotalFee,
          maxTotalFee,
        }),
    ),
  );

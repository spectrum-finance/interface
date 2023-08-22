import { makePoolSetupParams, PoolSetupParams } from '@ergolabs/ergo-dex-sdk';
import { InvalidParams } from '@ergolabs/ergo-dex-sdk/build/main/amm/common/errors/invalidParams';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, Observable, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { networkAsset } from '../../api/networkAsset/networkAsset';
import { networkContext$ } from '../../api/networkContext/networkContext';
import { utxos$ } from '../../api/utxos/utxos';
import { minerFee$ } from '../../settings/minerFee';
import { ErgoSettings, settings$ } from '../../settings/settings';
import { maxTotalFee$, minTotalFee$ } from '../../settings/totalFees';
import { getInputs } from '../common/getInputs';
import { getTxContext } from '../common/getTxContext';

interface CreatePoolOperationCandidateParams {
  readonly x: Currency;
  readonly y: Currency;
  readonly feePct: number;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit)
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
}

export interface AdditionalData {
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
  readonly p2pkaddress: string;
}

const toCreateCreatePoolOperationArgs = ({
  x,
  y,
  feePct,
  settings,
  minerFee,
  networkContext,
  utxos,
  minTotalFee,
  maxTotalFee,
}: CreatePoolOperationCandidateParams): [
  PoolSetupParams,
  TransactionContext,
  AdditionalData,
] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[createPool]: wallet address is not selected');
  }
  let inputX: AssetAmount;
  let inputY: AssetAmount;

  if (y.isAssetEquals(networkAsset)) {
    inputX = new AssetAmount(y.asset, y.amount);
    inputY = new AssetAmount(x.asset, x.amount);
  } else {
    inputX = new AssetAmount(x.asset, x.amount);
    inputY = new AssetAmount(y.asset, y.amount);
  }

  const createPoolParamsOrError: PoolSetupParams | InvalidParams =
    makePoolSetupParams(
      inputX,
      inputY,
      Number((feePct / 100).toFixed(3)),
      UI_FEE_BIGINT,
    );

  if (createPoolParamsOrError instanceof Array) {
    throw new Error('[createPool]: invalid params');
  }
  const inputs = getInputs(
    utxos,
    [inputX, inputY],
    {
      minerFee: minerFee.amount,
      uiFee: UI_FEE_BIGINT,
      exFee: 0n,
    },
    false,
    true,
  );

  const txContext = getTxContext(
    inputs,
    networkContext as NetworkContext,
    settings.address,
    minerFee.amount,
  );
  const additionalData: AdditionalData = {
    minTotalFee,
    maxTotalFee,
    p2pkaddress: settings.address,
  };

  return [createPoolParamsOrError, txContext, additionalData];
};

export const createCreatePoolTxData = (
  feePct: number,
  x: Currency,
  y: Currency,
): Observable<[PoolSetupParams, TransactionContext, AdditionalData]> =>
  zip([
    settings$,
    utxos$,
    minerFee$,
    networkContext$,
    minTotalFee$,
    maxTotalFee$,
  ]).pipe(
    first(),
    map(
      ([settings, utxos, minerFee, networkContext, minTotalFee, maxTotalFee]) =>
        toCreateCreatePoolOperationArgs({
          feePct,
          x,
          y,
          settings,
          minerFee,
          networkContext,
          utxos,
          minTotalFee,
          maxTotalFee,
        }),
    ),
  );

import { DepositParams } from '@ergolabs/ergo-dex-sdk';
import { AssetAmount, ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, from, Observable, switchMap, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../common/constants/erg';
import { Currency } from '../../../common/models/Currency';
import { TxId } from '../../../common/types';
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

interface DepositOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly x: Currency;
  readonly y: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  readonly minerFee: Currency;
  readonly minExFee: Currency;
  // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit)
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
}

const toDepositOperationArgs = ({
  pool,
  x,
  y,
  settings,
  minerFee,
  networkContext,
  utxos,
  minExFee,
}: DepositOperationCandidateParams): [DepositParams, TransactionContext] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[deposit]: wallet address is not selected');
  }
  const inputX = new AssetAmount(x.asset, x.amount);
  const inputY = new AssetAmount(y.asset, y.amount);

  const depositParams: DepositParams = {
    poolId: pool.id,
    x: inputX,
    y: inputY,
    pk: settings.pk,
    exFee: minExFee.amount,
    uiFee: UI_FEE_BIGINT,
  };

  const inputs = getInputs(utxos, [inputX, inputY], {
    minerFee: minerFee.amount,
    uiFee: UI_FEE_BIGINT,
    exFee: minExFee.amount,
  });

  const txContext = getTxContext(
    inputs,
    networkContext as NetworkContext,
    settings.address,
    minerFee.amount,
  );

  return [depositParams, txContext];
};

export const deposit = (
  pool: ErgoAmmPool,
  x: Currency,
  y: Currency,
): Observable<TxId> =>
  zip([settings$, utxos$, minerFee$, minExFee$, networkContext$]).pipe(
    first(),
    switchMap(([settings, utxos, minerFee, minExFee, networkContext]) => {
      const [depositParams, txContext] = toDepositOperationArgs({
        pool,
        x,
        y,
        settings,
        minerFee,
        networkContext,
        utxos,
        minExFee,
      });

      return from(
        poolActions(pool.pool).deposit(depositParams, txContext),
      ).pipe(
        switchMap((tx) =>
          submitTx(tx, {
            type: 'deposit',
            xAsset: x.asset.id,
            xAmount: x.toAmount(),
            yAsset: y.asset.id,
            yAmount: y.toAmount(),
            txId: tx.id,
          }),
        ),
      );
    }),
  );

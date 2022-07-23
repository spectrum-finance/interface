import { RedeemParams } from '@ergolabs/ergo-dex-sdk';
import { ErgoBox, TransactionContext } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, from, Observable, switchMap, zip } from 'rxjs';

import { UI_FEE_BIGINT } from '../../../../common/constants/erg';
import { Currency } from '../../../../common/models/Currency';
import { TxSuccess } from '../../../../common/services/submitTx';
import { minExFee$ } from '../../settings/executionFee';
import { minerFee$ } from '../../settings/minerFee';
import { ErgoSettings, settings$ } from '../../settings/settings';
import { ErgoAmmPool } from '../ammPools/ErgoAmmPool';
import { networkContext$ } from '../networkContext/networkContext';
import { utxos$ } from '../utxos/utxos';
import { getInputs } from './common/getInputs';
import { getTxContext } from './common/getTxContext';
import { poolActions } from './common/poolActions';
import { submitTx } from './common/submitTx';

interface RedeemOperationCandidateParams {
  readonly pool: ErgoAmmPool;
  readonly lp: Currency;
  readonly settings: ErgoSettings;
  readonly utxos: ErgoBox[];
  // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit)
  readonly networkContext:
    | NetworkContext
    | {
        readonly height: number;
        readonly lastBlockId: number;
      };
  readonly minerFee: Currency;
  readonly minExFee: Currency;
}

const toRedeemOperationArgs = ({
  pool,
  lp,
  settings,
  utxos,
  networkContext,
  minerFee,
  minExFee,
}: RedeemOperationCandidateParams): [RedeemParams, TransactionContext] => {
  if (!settings.address || !settings.pk) {
    throw new Error('[redeem]: wallet address is not selected');
  }
  const lpToRemove = pool['pool'].lp.withAmount(lp.amount);

  const redeemParams: RedeemParams = {
    poolId: pool.id,
    pk: settings.pk,
    lp: lpToRemove,
    exFee: minExFee.amount,
    uiFee: UI_FEE_BIGINT,
  };

  const inputs = getInputs(utxos, [lpToRemove], {
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

  return [redeemParams, txContext];
};

export const redeem = (
  pool: ErgoAmmPool,
  lp: Currency,
): Observable<TxSuccess> =>
  zip([settings$, utxos$, minerFee$, minExFee$, networkContext$]).pipe(
    first(),
    switchMap(([settings, utxos, minerFee, minExFee, networkContext]) => {
      const [redeemParams, txContext] = toRedeemOperationArgs({
        pool,
        lp,
        settings,
        utxos,
        minerFee,
        minExFee,
        networkContext,
      });

      return from(poolActions(pool.pool).redeem(redeemParams, txContext)).pipe(
        switchMap((tx) => submitTx(tx)),
      );
    }),
  );

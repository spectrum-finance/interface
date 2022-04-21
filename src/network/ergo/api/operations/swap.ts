import { first, Observable, of, switchMap, zip } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { settings$ } from '../../settings/settings';
import { utxos$ } from '../utxos/utxos';

const swapTxCandidate = () => {};

export const swap = (
  pool: AmmPool,
  from: Currency,
  to: Currency,
): Observable<TxId> =>
  zip([settings$, utxos$]).pipe(
    first(),
    switchMap(([settings, utxos]) => {
      console.log(settings, utxos);

      return of('');
    }),
  );

// const swapOperation = async () => {
//   if (
//     poolFeeNum &&
//     baseParams &&
//     utxos &&
//     address &&
//     poolId &&
//     operationVars &&
//     value.pool &&
//     value.fromAmount &&
//     value.fromAsset &&
//     value.toAsset?.id
//   ) {
//     const pk = publicKeyFromAddress(address)!;
//     const actions = poolActions(value.pool['pool'] as any);
//     const quoteAsset = value.toAsset?.id;
//
//     const minNErgs = minValueForOrder(
//       minerFeeNErgs,
//       uiFeeNErg,
//       operationVars[1].maxExFee,
//     );
//
//     const target = makeTarget(
//       [new AssetAmount(value.fromAsset!, baseParams.baseInputAmount)],
//       minNErgs,
//     );
//
//     const inputs = DefaultBoxSelector.select(utxos, target) as BoxSelection;
//
//     const network = await explorer.getNetworkContext();
//
//     onClose(
//       actions
//         .swap(
//           {
//             pk,
//             poolId,
//             baseInput: baseParams.baseInput,
//             minQuoteOutput: operationVars[1].minOutput.amount,
//             exFeePerToken: operationVars[0],
//             uiFee: uiFeeNErg,
//             quoteAsset,
//             poolFeeNum,
//           },
//           {
//             inputs,
//             changeAddress: address,
//             selfAddress: address,
//             feeNErgs: minerFeeNErgs,
//             network,
//           },
//         )
//         .then((tx) => submitTx(tx)),
//     );
//   }
// };

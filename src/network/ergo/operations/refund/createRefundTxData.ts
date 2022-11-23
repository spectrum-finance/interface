import { RefundParams } from '@ergolabs/ergo-dex-sdk';
import {
  DefaultBoxSelector,
  InsufficientInputs,
  MinTransactionContext,
} from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, Observable, zip } from 'rxjs';

import { networkContext$ } from '../../api/networkContext/networkContext';
import { utxos$ } from '../../api/utxos/utxos';
import { minerFee$ } from '../../settings/minerFee';
import { settings$ } from '../../settings/settings';
import { getTxContext } from '../common/getTxContext';

export const createRefundTxData = (
  address: string,
  txId: string,
): Observable<[RefundParams, MinTransactionContext]> =>
  zip([utxos$, minerFee$, networkContext$, settings$]).pipe(
    first(),
    map(([utxos, minerFee, networkContext, settings]) => {
      const refundParams: RefundParams = {
        txId,
        recipientAddress: address,
      };

      const inputs = DefaultBoxSelector.select(utxos, {
        nErgs: minerFee.amount,
        assets: [],
      });

      if (inputs instanceof InsufficientInputs) {
        throw new Error(
          `Error in getInputs function: InsufficientInputs -> ${inputs}`,
        );
      }

      const txContext = getTxContext(
        inputs,
        // @ts-ignore
        // TODO: refactor in SDK || or here in frontend repo (operations: swap, redeem, deposit, refund)
        networkContext as NetworkContext,
        settings.address!,
        minerFee.amount,
      );

      return [refundParams, txContext];
    }),
  );

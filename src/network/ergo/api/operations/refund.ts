import { RefundParams } from '@ergolabs/ergo-dex-sdk';
import { DefaultBoxSelector, InsufficientInputs } from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, from, Observable, switchMap, zip } from 'rxjs';

import { TxId } from '../../../../common/types';
import { ammOrderRefunds } from '../../../../services/amm';
import { minerFee$ } from '../../settings/minerFee';
import { settings$ } from '../../settings/settings';
import { networkContext$ } from '../networkContext/networkContext';
import { utxos$ } from '../utxos/utxos';
import { getTxContext } from './common/getTxContext';
import { submitTx } from './common/submitTx';

export const refund = (address: string, txId: string): Observable<TxId> =>
  zip([utxos$, minerFee$, networkContext$, settings$]).pipe(
    first(),
    switchMap(([utxos, minerFee, networkContext, settings]) => {
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

      return from(ammOrderRefunds.refund(refundParams, txContext)).pipe(
        switchMap((tx) => submitTx(tx)),
      );
    }),
  );

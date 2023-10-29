import { RefundParams } from '@ergolabs/ergo-dex-sdk';
import {
  DefaultBoxSelector,
  InsufficientInputs,
  MinTransactionContext,
} from '@ergolabs/ergo-sdk';
import { NetworkContext } from '@ergolabs/ergo-sdk/build/main/entities/networkContext';
import { first, map, Observable, zip } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { networkContext$ } from '../../api/networkContext/networkContext';
import { utxos$ } from '../../api/utxos/utxos';
import { minerFee$ } from '../../settings/minerFee';
import { settings$ } from '../../settings/settings';
import { getTxContext } from '../common/getTxContext';

export interface AdditionalData {
  readonly txId: TxId;
  readonly address: string;
  readonly p2pkaddress: string;
  readonly minTotalFee: Currency;
  readonly maxTotalFee: Currency;
}

export const createRefundTxData = (
  address: string,
  txId: string,
): Observable<[RefundParams, MinTransactionContext, AdditionalData]> =>
  zip([utxos$, minerFee$, networkContext$, settings$]).pipe(
    first(),
    map(([utxos, minerFee, networkContext, settings]) => {
      const refundParams: RefundParams = {
        txId,
        recipientAddress: address,
        utxos,
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
        networkContext as NetworkContext,
        settings.address!,
        minerFee.amount,
      );

      const additionalData: AdditionalData = {
        txId,
        address,
        p2pkaddress: address,
        minTotalFee: minerFee,
        maxTotalFee: minerFee,
      };

      return [refundParams, txContext, additionalData];
    }),
  );

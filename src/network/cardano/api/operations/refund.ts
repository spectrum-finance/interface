import { AmmOrderRefunds } from '@spectrumlabs/cardano-dex-sdk';
import { TxOut } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { first, Observable, Subject, switchMap, tap, zip } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation as ModalOperation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { settings$ } from '../../settings/settings';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { COLLATERAL_AMOUNT } from '../const.ts';
import { getCollateralByAmount } from '../utxos/utxos';
import { submitTxCandidate } from './common/submitTxCandidate';

const ammRefunds = new AmmOrderRefunds(cardanoNetwork);

const walletRefund = (txId: TxId): Observable<TxId> =>
  zip([settings$, getCollateralByAmount(COLLATERAL_AMOUNT.amount)]).pipe(
    first(),
    switchMap(([settings, collateral]) => {
      console.log('>>collateral', collateral);
      return ammRefunds.refund({
        recipientAddress: settings.address!,
        txId,
        collateral: collateral.map((txOut: TxOut) => ({ txOut })),
        fee: COLLATERAL_AMOUNT.amount,
      });
    }),
    switchMap(submitTxCandidate),
  );

export const refund = (
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    walletRefund(txId).pipe(
      tap((txId) => {
        subject.next(txId);
        subject.complete();
      }),
    ),
    ModalOperation.REFUND,
    {
      xAsset: xAmount,
      yAsset: yAmount,
    },
  );

  return subject.asObservable();
};

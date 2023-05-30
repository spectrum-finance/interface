import { AmmOrderRefunds } from '@spectrumlabs/cardano-dex-sdk';
import { TxOut } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { first, Observable, Subject, switchMap, tap, zip } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation as ModalOperation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { depositAda } from '../../settings/depositAda';
import { settings$ } from '../../settings/settings';
import { cardanoNetwork } from '../common/cardanoNetwork';
import { getCollateralByAmount } from '../utxos/utxos';
import { submitTx } from './common/submitTx';

const ammRefunds = new AmmOrderRefunds(cardanoNetwork);

const walletRefund = (txId: TxId): Observable<TxId> =>
  zip([settings$, getCollateralByAmount(depositAda.amount)]).pipe(
    first(),
    switchMap(([settings, collateral]) =>
      ammRefunds.refund({
        recipientAddress: settings.address!,
        txId,
        collateral: collateral.map((txOut: TxOut) => ({ txOut })),
        fee: depositAda.amount,
      }),
    ),
    switchMap(submitTx),
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

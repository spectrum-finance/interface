import { Address } from '@ergolabs/ergo-sdk';
import { Modal } from '@ergolabs/ui-kit';
import React from 'react';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation as ModalOperation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { settings$ } from '../../settings/settings';
import { ErgoPayModal } from '../../widgets/ErgoPayModal/ErgoPayModal';
import { ergopayRefund } from './ergopayRefund';
import { walletRefund } from './walletRefund';

const refundWithErgopay = (address: Address, txId: TxId): Observable<TxId> => {
  const subject = new Subject<TxId>();
  Modal.open(({ close }) => (
    <ErgoPayModal
      request={ergopayRefund(address, txId)}
      onTxRegister={(txId) => {
        subject.next(txId);
        subject.complete();
      }}
      close={close}
    />
  ));
  return subject;
};

const refundWithWallet = (
  address: Address,
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    walletRefund(address, txId).pipe(
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

export const refund = (
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? refundWithErgopay(settings.address!, txId)
        : refundWithWallet(settings.address!, txId, xAmount, yAmount),
    ),
  );

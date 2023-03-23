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
import { RefundConfirmationModal } from '../../widgets/RefundConfirmationModal/RefundConfirmationModal';
import { RefundOpenWallet } from '../../widgets/RefundOpenWallet/RefundOpenWallet';

const refundWithErgopay = (
  addresses: Address[],
  txId: TxId,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  Modal.open(({ close }) => (
    <ErgoPayModal
      openWalletContent={(onTxRegister) => (
        <RefundOpenWallet
          addresses={addresses}
          txId={txId}
          onTxRegister={onTxRegister}
        />
      )}
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
  addresses: Address[],
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    (next) => {
      return (
        <RefundConfirmationModal
          addresses={addresses}
          txId={txId}
          onClose={(request) =>
            next(
              request.pipe(
                tap((txId) => {
                  subject.next(txId);
                  subject.complete();
                }),
              ),
            )
          }
        />
      );
    },
    ModalOperation.REFUND,
    {
      xAsset: xAmount,
      yAsset: yAmount,
    },
  );

  return subject.asObservable();
};

export const refund = (
  addresses: Address[],
  txId: TxId,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? refundWithErgopay(addresses, txId)
        : refundWithWallet(addresses, txId, xAmount, yAmount),
    ),
  );

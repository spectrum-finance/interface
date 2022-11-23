import { Address } from '@ergolabs/ergo-sdk';
import React from 'react';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { Operation } from '../../../../common/models/Operation';
import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation as ModalOperation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { settings$ } from '../../settings/settings';
import { RefundConfirmationModal } from '../../widgets/RefundConfirmationModal/RefundConfirmationModal';

const refundWithErgopay = (
  addresses: Address[],
  operation: Operation,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  // Modal.open(({ close }) => (
  //   <ErgoPayModal
  //     openWalletContent={(onTxRegister) => (
  //       <RedeemOpenWallet
  //         pool={pool}
  //         value={data}
  //         onTxRegister={onTxRegister}
  //       />
  //     )}
  //     onTxRegister={(txId) => {
  //       subject.next(txId);
  //       subject.complete();
  //     }}
  //     close={close}
  //   />
  // ));
  return subject;
};

const refundWithWallet = (
  addresses: Address[],
  operation: Operation,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> => {
  const subject = new Subject<TxId>();
  openConfirmationModal(
    (next) => {
      return (
        <RefundConfirmationModal
          addresses={addresses}
          operation={operation}
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
  operation: Operation,
  xAmount: Currency,
  yAmount: Currency,
): Observable<TxId> =>
  settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay
        ? refundWithErgopay(addresses, operation)
        : refundWithWallet(addresses, operation, xAmount, yAmount),
    ),
  );

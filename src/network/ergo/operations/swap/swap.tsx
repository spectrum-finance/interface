import { Modal } from '@ergolabs/ui-kit';
import React from 'react';
import { first, Observable, Subject, switchMap, tap } from 'rxjs';

import { TxId } from '../../../../common/types';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { SwapFormModel } from '../../../../pages/Swap/SwapFormModel';
import { settings$ } from '../../settings/settings';
import { ErgoPaySwapConfirmationModal } from '../../widgets/SwapConfirmationModal/ErgoPaySwapConfirmationModal/ErgoPaySwapConfirmationModal';
import { WalletSwapConfirmationModal } from '../../widgets/SwapConfirmationModal/WalletSwapConfirmationModal/WalletSwapConfirmationModal';

export const swapWithWallet = (
  data: Required<SwapFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  openConfirmationModal(
    (next) => {
      return (
        <WalletSwapConfirmationModal
          value={data}
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
    Operation.SWAP,
    {
      xAsset: data.fromAmount!,
      yAsset: data.toAmount!,
    },
  );

  return subject.asObservable();
};

export const swapWithErgopay = (
  data: Required<SwapFormModel>,
): Observable<TxId> => {
  const subject = new Subject<TxId>();

  Modal.open(({ close }) => (
    <ErgoPaySwapConfirmationModal
      onTxRegister={(txId) => {
        subject.next(txId);
        subject.complete();
      }}
      close={close}
      value={data}
    />
  ));
  return subject;
};

export const swap = (data: Required<SwapFormModel>): Observable<TxId> => {
  return settings$.pipe(
    first(),
    switchMap((settings) =>
      settings.ergopay ? swapWithErgopay(data) : swapWithWallet(data),
    ),
  );
};
